-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Apply to all tables with updated_at
CREATE TRIGGER trg_profile_updated_at
    BEFORE UPDATE ON profile
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_household_updated_at
    BEFORE UPDATE ON household
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_household_member_updated_at
    BEFORE UPDATE ON household_member
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_household_invite_updated_at
    BEFORE UPDATE ON household_invite
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_household_item_updated_at
    BEFORE UPDATE ON household_item
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_routine_checklist_updated_at
    BEFORE UPDATE ON routine_checklist
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_routine_checklist_item_updated_at
    BEFORE UPDATE ON routine_checklist_item
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_reminder_updated_at
    BEFORE UPDATE ON reminder
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_urgent_problem_updated_at
    BEFORE UPDATE ON urgent_problem
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_bill_updated_at
    BEFORE UPDATE ON bill
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_household_secret_updated_at
    BEFORE UPDATE ON household_secret
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON AUTH SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profile (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'name',
            NEW.raw_user_meta_data->>'full_name',
            split_part(NEW.email, '@', 1)
        ),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- AUTO-ADD OWNER AS HOUSEHOLD MEMBER
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_household()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.household_member (household_id, user_id, role, joined_at)
    VALUES (NEW.id, NEW.owner_id, 'owner', now());
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_household_created
    AFTER INSERT ON household
    FOR EACH ROW EXECUTE FUNCTION handle_new_household();

-- ============================================================
-- AUTO-SET RESOLVED_AT ON ITEM STATUS CHANGE
-- ============================================================

CREATE OR REPLACE FUNCTION handle_item_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.status = 'done' AND (OLD.status IS NULL OR OLD.status <> 'done') THEN
        NEW.resolved_at = now();
    ELSIF NEW.status <> 'done' AND OLD.status = 'done' THEN
        NEW.resolved_at = NULL;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_household_item_status_change
    BEFORE UPDATE OF status ON household_item
    FOR EACH ROW EXECUTE FUNCTION handle_item_status_change();

-- ============================================================
-- ACCEPT INVITE (Service-Role Function)
-- ============================================================

CREATE OR REPLACE FUNCTION accept_invite(p_invite_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_invite RECORD;
    v_user_id UUID;
    v_existing RECORD;
BEGIN
    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Find the invite
    SELECT * INTO v_invite
    FROM household_invite
    WHERE code = p_invite_code
      AND status = 'pending'
      AND expires_at > now()
    FOR UPDATE;

    IF v_invite IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invite not found, expired, or already used'
        );
    END IF;

    -- Check if already a member
    SELECT * INTO v_existing
    FROM household_member
    WHERE household_id = v_invite.household_id
      AND user_id = v_user_id;

    IF v_existing IS NOT NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'You are already a member of this household'
        );
    END IF;

    -- Create the membership
    INSERT INTO household_member (household_id, user_id, role, joined_at)
    VALUES (v_invite.household_id, v_user_id, v_invite.role, now());

    -- Mark invite as accepted
    UPDATE household_invite
    SET status = 'accepted',
        accepted_by = v_user_id,
        accepted_at = now()
    WHERE id = v_invite.id;

    RETURN jsonb_build_object(
        'success', true,
        'household_id', v_invite.household_id
    );
END;
$$;

-- ============================================================
-- GET CYCLE START TIME
-- ============================================================

CREATE OR REPLACE FUNCTION get_cycle_start(p_recurrence recurrence_type)
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    CASE p_recurrence
        WHEN 'daily' THEN
            RETURN date_trunc('day', now());
        WHEN 'weekly' THEN
            RETURN date_trunc('week', now());
        WHEN 'monthly' THEN
            RETURN date_trunc('month', now());
        WHEN 'custom' THEN
            RETURN date_trunc('day', now());
    END CASE;
END;
$$;

-- ============================================================
-- GET CHECKLIST COMPLETION STATUS
-- ============================================================

CREATE OR REPLACE FUNCTION get_checklist_completion(p_checklist_id UUID)
RETURNS TABLE (
    item_id UUID,
    label TEXT,
    sort_order INTEGER,
    is_completed_this_cycle BOOLEAN,
    last_completed_at TIMESTAMPTZ,
    completed_by UUID
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        rci.id AS item_id,
        rci.label,
        rci.sort_order,
        (rci.last_completed_at IS NOT NULL
         AND rci.last_completed_at >= get_cycle_start(rc.recurrence))
            AS is_completed_this_cycle,
        rci.last_completed_at,
        rci.completed_by
    FROM routine_checklist_item rci
    JOIN routine_checklist rc ON rc.id = rci.checklist_id
    WHERE rci.checklist_id = p_checklist_id
    ORDER BY rci.sort_order, rci.created_at;
$$;

-- ============================================================
-- EXPIRE PENDING INVITES
-- ============================================================

CREATE OR REPLACE FUNCTION expire_pending_invites()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    UPDATE household_invite
    SET status = 'expired'
    WHERE status = 'pending'
      AND expires_at <= now();

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$;

-- ============================================================
-- PRUNE OLD NOTIFICATIONS
-- ============================================================

CREATE OR REPLACE FUNCTION prune_old_notifications()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    DELETE FROM notification
    WHERE is_read = true
      AND created_at < now() - INTERVAL '30 days';

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$;

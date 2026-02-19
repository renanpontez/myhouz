-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- ---- PROFILE ----
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY profile_select_authenticated
    ON profile FOR SELECT TO authenticated
    USING (true);

CREATE POLICY profile_update_own
    ON profile FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- ---- HOUSEHOLD ----
ALTER TABLE household ENABLE ROW LEVEL SECURITY;

CREATE POLICY household_select_members
    ON household FOR SELECT TO authenticated
    USING (is_household_member(id));

CREATE POLICY household_insert_authenticated
    ON household FOR INSERT TO authenticated
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY household_update_owner
    ON household FOR UPDATE TO authenticated
    USING (is_household_owner(id))
    WITH CHECK (is_household_owner(id));

CREATE POLICY household_delete_owner
    ON household FOR DELETE TO authenticated
    USING (is_household_owner(id));

-- ---- HOUSEHOLD MEMBER ----
ALTER TABLE household_member ENABLE ROW LEVEL SECURITY;

CREATE POLICY household_member_select_members
    ON household_member FOR SELECT TO authenticated
    USING (is_household_member(household_id));

CREATE POLICY household_member_insert_owner
    ON household_member FOR INSERT TO authenticated
    WITH CHECK (is_household_owner(household_id));

CREATE POLICY household_member_update_owner
    ON household_member FOR UPDATE TO authenticated
    USING (is_household_owner(household_id))
    WITH CHECK (is_household_owner(household_id));

CREATE POLICY household_member_delete_owner_or_self
    ON household_member FOR DELETE TO authenticated
    USING (
        is_household_owner(household_id)
        OR user_id = auth.uid()
    );

-- ---- HOUSEHOLD INVITE ----
ALTER TABLE household_invite ENABLE ROW LEVEL SECURITY;

CREATE POLICY household_invite_select_members
    ON household_invite FOR SELECT TO authenticated
    USING (is_household_member(household_id));

CREATE POLICY household_invite_insert_owner
    ON household_invite FOR INSERT TO authenticated
    WITH CHECK (
        is_household_owner(household_id)
        AND invited_by = auth.uid()
    );

CREATE POLICY household_invite_update_owner
    ON household_invite FOR UPDATE TO authenticated
    USING (is_household_owner(household_id))
    WITH CHECK (is_household_owner(household_id));

CREATE POLICY household_invite_delete_owner
    ON household_invite FOR DELETE TO authenticated
    USING (is_household_owner(household_id));

-- ---- HOUSEHOLD ITEM ----
ALTER TABLE household_item ENABLE ROW LEVEL SECURITY;

CREATE POLICY household_item_select_members
    ON household_item FOR SELECT TO authenticated
    USING (
        (get_household_role(household_id) IN ('owner', 'member'))
        OR guest_has_permission(household_id, 'items', 'read')
    );

CREATE POLICY household_item_insert_members
    ON household_item FOR INSERT TO authenticated
    WITH CHECK (
        (get_household_role(household_id) IN ('owner', 'member'))
        AND added_by = auth.uid()
    );

CREATE POLICY household_item_update_members
    ON household_item FOR UPDATE TO authenticated
    USING (
        (get_household_role(household_id) IN ('owner', 'member'))
        OR guest_has_permission(household_id, 'items', 'write')
    )
    WITH CHECK (
        (get_household_role(household_id) IN ('owner', 'member'))
        OR guest_has_permission(household_id, 'items', 'write')
    );

CREATE POLICY household_item_delete_members
    ON household_item FOR DELETE TO authenticated
    USING (get_household_role(household_id) IN ('owner', 'member'));

-- ---- ROUTINE CHECKLIST ----
ALTER TABLE routine_checklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY routine_checklist_select_members
    ON routine_checklist FOR SELECT TO authenticated
    USING (
        (get_household_role(household_id) IN ('owner', 'member'))
        OR guest_has_permission(household_id, 'routines', 'read')
    );

CREATE POLICY routine_checklist_insert_members
    ON routine_checklist FOR INSERT TO authenticated
    WITH CHECK (
        (get_household_role(household_id) IN ('owner', 'member'))
        AND created_by = auth.uid()
    );

CREATE POLICY routine_checklist_update_members
    ON routine_checklist FOR UPDATE TO authenticated
    USING (get_household_role(household_id) IN ('owner', 'member'))
    WITH CHECK (get_household_role(household_id) IN ('owner', 'member'));

CREATE POLICY routine_checklist_delete_members
    ON routine_checklist FOR DELETE TO authenticated
    USING (get_household_role(household_id) IN ('owner', 'member'));

-- ---- ROUTINE CHECKLIST ITEM ----
ALTER TABLE routine_checklist_item ENABLE ROW LEVEL SECURITY;

CREATE POLICY routine_checklist_item_select_members
    ON routine_checklist_item FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM routine_checklist rc
            WHERE rc.id = routine_checklist_item.checklist_id
              AND (
                  (get_household_role(rc.household_id) IN ('owner', 'member'))
                  OR guest_has_permission(rc.household_id, 'routines', 'read')
              )
        )
    );

CREATE POLICY routine_checklist_item_insert_members
    ON routine_checklist_item FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM routine_checklist rc
            WHERE rc.id = routine_checklist_item.checklist_id
              AND get_household_role(rc.household_id) IN ('owner', 'member')
        )
    );

CREATE POLICY routine_checklist_item_update_members
    ON routine_checklist_item FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM routine_checklist rc
            WHERE rc.id = routine_checklist_item.checklist_id
              AND (
                  (get_household_role(rc.household_id) IN ('owner', 'member'))
                  OR guest_has_permission(rc.household_id, 'routines', 'write')
              )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM routine_checklist rc
            WHERE rc.id = routine_checklist_item.checklist_id
              AND (
                  (get_household_role(rc.household_id) IN ('owner', 'member'))
                  OR guest_has_permission(rc.household_id, 'routines', 'write')
              )
        )
    );

CREATE POLICY routine_checklist_item_delete_members
    ON routine_checklist_item FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM routine_checklist rc
            WHERE rc.id = routine_checklist_item.checklist_id
              AND get_household_role(rc.household_id) IN ('owner', 'member')
        )
    );

-- ---- REMINDER ----
ALTER TABLE reminder ENABLE ROW LEVEL SECURITY;

CREATE POLICY reminder_select_members
    ON reminder FOR SELECT TO authenticated
    USING (
        (get_household_role(household_id) IN ('owner', 'member'))
        OR guest_has_permission(household_id, 'reminders', 'read')
    );

CREATE POLICY reminder_insert_members
    ON reminder FOR INSERT TO authenticated
    WITH CHECK (
        (get_household_role(household_id) IN ('owner', 'member'))
        AND created_by = auth.uid()
    );

CREATE POLICY reminder_update_members
    ON reminder FOR UPDATE TO authenticated
    USING (
        (get_household_role(household_id) IN ('owner', 'member'))
        OR guest_has_permission(household_id, 'reminders', 'write')
    )
    WITH CHECK (
        (get_household_role(household_id) IN ('owner', 'member'))
        OR guest_has_permission(household_id, 'reminders', 'write')
    );

CREATE POLICY reminder_delete_members
    ON reminder FOR DELETE TO authenticated
    USING (get_household_role(household_id) IN ('owner', 'member'));

-- ---- URGENT PROBLEM ----
ALTER TABLE urgent_problem ENABLE ROW LEVEL SECURITY;

CREATE POLICY urgent_problem_select_members
    ON urgent_problem FOR SELECT TO authenticated
    USING (get_household_role(household_id) IN ('owner', 'member'));

CREATE POLICY urgent_problem_insert_members
    ON urgent_problem FOR INSERT TO authenticated
    WITH CHECK (
        (get_household_role(household_id) IN ('owner', 'member'))
        AND reported_by = auth.uid()
    );

CREATE POLICY urgent_problem_update_members
    ON urgent_problem FOR UPDATE TO authenticated
    USING (get_household_role(household_id) IN ('owner', 'member'))
    WITH CHECK (get_household_role(household_id) IN ('owner', 'member'));

CREATE POLICY urgent_problem_delete_owner
    ON urgent_problem FOR DELETE TO authenticated
    USING (is_household_owner(household_id));

-- ---- NOTIFICATION ----
ALTER TABLE notification ENABLE ROW LEVEL SECURITY;

CREATE POLICY notification_select_own
    ON notification FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY notification_update_own
    ON notification FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY notification_delete_own
    ON notification FOR DELETE TO authenticated
    USING (user_id = auth.uid());

-- ---- BILL (Post-MVP) ----
ALTER TABLE bill ENABLE ROW LEVEL SECURITY;

CREATE POLICY bill_select_members
    ON bill FOR SELECT TO authenticated
    USING (get_household_role(household_id) IN ('owner', 'member'));

CREATE POLICY bill_insert_members
    ON bill FOR INSERT TO authenticated
    WITH CHECK (
        (get_household_role(household_id) IN ('owner', 'member'))
        AND created_by = auth.uid()
    );

CREATE POLICY bill_update_members
    ON bill FOR UPDATE TO authenticated
    USING (get_household_role(household_id) IN ('owner', 'member'))
    WITH CHECK (get_household_role(household_id) IN ('owner', 'member'));

CREATE POLICY bill_delete_owner
    ON bill FOR DELETE TO authenticated
    USING (is_household_owner(household_id));

-- ---- HOUSEHOLD SECRET (Post-MVP) ----
ALTER TABLE household_secret ENABLE ROW LEVEL SECURITY;

CREATE POLICY household_secret_select_authorized
    ON household_secret FOR SELECT TO authenticated
    USING (
        is_household_owner(household_id)
        OR (
            is_household_member(household_id)
            AND auth.uid() = ANY(visible_to)
        )
    );

CREATE POLICY household_secret_insert_owner
    ON household_secret FOR INSERT TO authenticated
    WITH CHECK (
        is_household_owner(household_id)
        AND created_by = auth.uid()
    );

CREATE POLICY household_secret_update_owner
    ON household_secret FOR UPDATE TO authenticated
    USING (is_household_owner(household_id))
    WITH CHECK (is_household_owner(household_id));

CREATE POLICY household_secret_delete_owner
    ON household_secret FOR DELETE TO authenticated
    USING (is_household_owner(household_id));

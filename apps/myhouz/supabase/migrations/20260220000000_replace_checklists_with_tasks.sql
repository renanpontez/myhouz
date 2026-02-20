-- ============================================================
-- REPLACE ROUTINE CHECKLISTS WITH FLAT ROUTINE TASKS
-- Pre-launch migration: drops old tables, creates new model
-- ============================================================

-- Drop old function that references old tables
DROP FUNCTION IF EXISTS get_checklist_completion(UUID);

-- Drop old tables (CASCADE drops dependent RLS policies, indexes, triggers)
DROP TABLE IF EXISTS routine_checklist_item CASCADE;
DROP TABLE IF EXISTS routine_checklist CASCADE;

-- ============================================================
-- ROUTINE TASK — one row per recurring task
-- ============================================================

CREATE TABLE routine_task (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id      UUID NOT NULL REFERENCES household (id) ON DELETE CASCADE,
    title             TEXT NOT NULL,
    recurrence        recurrence_type NOT NULL DEFAULT 'daily',
    recurrence_meta   JSONB,
    assigned_to       UUID REFERENCES profile (id) ON DELETE SET NULL,
    sort_order        INTEGER NOT NULL DEFAULT 0,
    is_active         BOOLEAN NOT NULL DEFAULT true,
    last_completed_at TIMESTAMPTZ,
    completed_by      UUID REFERENCES profile (id) ON DELETE SET NULL,
    created_by        UUID NOT NULL REFERENCES profile (id) ON DELETE SET NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT routine_task_title_not_empty CHECK (title <> ''),
    CONSTRAINT routine_task_title_max_length CHECK (char_length(title) <= 200),
    CONSTRAINT routine_task_completed_consistency
        CHECK (
            (last_completed_at IS NOT NULL AND completed_by IS NOT NULL)
            OR
            (last_completed_at IS NULL AND completed_by IS NULL)
        )
);

COMMENT ON TABLE routine_task IS
    'A standalone recurring task with its own recurrence schedule. Completion is cycle-based via last_completed_at.';

-- ============================================================
-- ROUTINE TASK COMPLETION — append-only log for streaks/history
-- ============================================================

CREATE TABLE routine_task_completion (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id       UUID NOT NULL REFERENCES routine_task (id) ON DELETE CASCADE,
    completed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_by  UUID NOT NULL REFERENCES profile (id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE routine_task_completion IS
    'Append-only completion log for routine tasks. Used for streak calculation and history.';

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE routine_task ENABLE ROW LEVEL SECURITY;

CREATE POLICY routine_task_select_members
    ON routine_task FOR SELECT TO authenticated
    USING (
        (get_household_role(household_id) IN ('owner', 'member'))
        OR guest_has_permission(household_id, 'routines', 'read')
    );

CREATE POLICY routine_task_insert_members
    ON routine_task FOR INSERT TO authenticated
    WITH CHECK (
        (get_household_role(household_id) IN ('owner', 'member'))
        AND created_by = auth.uid()
    );

CREATE POLICY routine_task_update_members
    ON routine_task FOR UPDATE TO authenticated
    USING (get_household_role(household_id) IN ('owner', 'member'))
    WITH CHECK (get_household_role(household_id) IN ('owner', 'member'));

CREATE POLICY routine_task_delete_members
    ON routine_task FOR DELETE TO authenticated
    USING (get_household_role(household_id) IN ('owner', 'member'));

ALTER TABLE routine_task_completion ENABLE ROW LEVEL SECURITY;

CREATE POLICY routine_task_completion_select_members
    ON routine_task_completion FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM routine_task rt
            WHERE rt.id = routine_task_completion.task_id
              AND (
                  (get_household_role(rt.household_id) IN ('owner', 'member'))
                  OR guest_has_permission(rt.household_id, 'routines', 'read')
              )
        )
    );

CREATE POLICY routine_task_completion_insert_members
    ON routine_task_completion FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM routine_task rt
            WHERE rt.id = routine_task_completion.task_id
              AND get_household_role(rt.household_id) IN ('owner', 'member')
        )
        AND completed_by = auth.uid()
    );

CREATE POLICY routine_task_completion_delete_members
    ON routine_task_completion FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM routine_task rt
            WHERE rt.id = routine_task_completion.task_id
              AND get_household_role(rt.household_id) IN ('owner', 'member')
        )
    );

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_routine_task_household
    ON routine_task (household_id)
    WHERE is_active = true;

CREATE INDEX idx_routine_task_household_recurrence
    ON routine_task (household_id, recurrence)
    WHERE is_active = true;

CREATE INDEX idx_routine_task_assigned_to
    ON routine_task (assigned_to)
    WHERE assigned_to IS NOT NULL;

CREATE INDEX idx_routine_task_completion_task
    ON routine_task_completion (task_id, completed_at DESC);

CREATE INDEX idx_routine_task_completion_completed_by
    ON routine_task_completion (completed_by, completed_at DESC);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER trg_routine_task_updated_at
    BEFORE UPDATE ON routine_task
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

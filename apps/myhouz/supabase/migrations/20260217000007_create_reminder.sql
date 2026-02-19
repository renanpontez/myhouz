-- ============================================================
-- REMINDER
-- ============================================================

CREATE TABLE reminder (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES household (id) ON DELETE CASCADE,
    title        TEXT NOT NULL,
    due_at       TIMESTAMPTZ NOT NULL,
    assigned_to  UUID REFERENCES profile (id) ON DELETE SET NULL,
    created_by   UUID NOT NULL REFERENCES profile (id) ON DELETE SET NULL,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES profile (id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT reminder_title_not_empty CHECK (title <> ''),
    CONSTRAINT reminder_title_max_length CHECK (char_length(title) <= 200),
    CONSTRAINT reminder_completed_consistency
        CHECK (
            (is_completed = true AND completed_at IS NOT NULL)
            OR
            (is_completed = false AND completed_at IS NULL AND completed_by IS NULL)
        )
);

COMMENT ON TABLE reminder IS
    'General-purpose reminders with due dates, assignable to household members.';

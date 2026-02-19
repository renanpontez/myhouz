-- ============================================================
-- URGENT PROBLEM
-- ============================================================

CREATE TABLE urgent_problem (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES household (id) ON DELETE CASCADE,
    title        TEXT NOT NULL,
    description  TEXT NOT NULL,
    reported_by  UUID NOT NULL REFERENCES profile (id) ON DELETE SET NULL,
    resolved_by  UUID REFERENCES profile (id) ON DELETE SET NULL,
    is_active    BOOLEAN NOT NULL DEFAULT true,
    resolved_at  TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT urgent_problem_title_not_empty CHECK (title <> ''),
    CONSTRAINT urgent_problem_title_max_length CHECK (char_length(title) <= 200),
    CONSTRAINT urgent_problem_description_not_empty CHECK (description <> ''),
    CONSTRAINT urgent_problem_description_max_length CHECK (char_length(description) <= 2000),
    CONSTRAINT urgent_problem_resolved_consistency
        CHECK (
            (is_active = false AND resolved_at IS NOT NULL AND resolved_by IS NOT NULL)
            OR
            (is_active = true AND resolved_at IS NULL AND resolved_by IS NULL)
        )
);

COMMENT ON TABLE urgent_problem IS
    'High-priority problems with dashboard banner and email notifications.';

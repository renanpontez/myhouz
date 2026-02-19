-- ============================================================
-- ROUTINE CHECKLIST
-- ============================================================

CREATE TABLE routine_checklist (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES household (id) ON DELETE CASCADE,
    title        TEXT NOT NULL,
    recurrence   recurrence_type NOT NULL DEFAULT 'weekly',
    created_by   UUID NOT NULL REFERENCES profile (id) ON DELETE SET NULL,
    is_active    BOOLEAN NOT NULL DEFAULT true,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT routine_checklist_title_not_empty CHECK (title <> ''),
    CONSTRAINT routine_checklist_title_max_length CHECK (char_length(title) <= 200)
);

COMMENT ON TABLE routine_checklist IS
    'A recurring checklist template (daily, weekly, monthly).';

-- ============================================================
-- ROUTINE CHECKLIST ITEM
-- ============================================================

CREATE TABLE routine_checklist_item (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id      UUID NOT NULL REFERENCES routine_checklist (id) ON DELETE CASCADE,
    label             TEXT NOT NULL,
    sort_order        INTEGER NOT NULL DEFAULT 0,
    last_completed_at TIMESTAMPTZ,
    completed_by      UUID REFERENCES profile (id) ON DELETE SET NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT routine_checklist_item_label_not_empty CHECK (label <> ''),
    CONSTRAINT routine_checklist_item_label_max_length CHECK (char_length(label) <= 200),
    CONSTRAINT routine_checklist_item_completed_consistency
        CHECK (
            (last_completed_at IS NOT NULL AND completed_by IS NOT NULL)
            OR
            (last_completed_at IS NULL AND completed_by IS NULL)
        )
);

COMMENT ON TABLE routine_checklist_item IS
    'Individual tasks within a routine checklist. Completion tracked per cycle via last_completed_at.';

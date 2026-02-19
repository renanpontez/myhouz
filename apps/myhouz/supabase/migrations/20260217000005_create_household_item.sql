-- ============================================================
-- HOUSEHOLD ITEM (Items to Buy module)
-- ============================================================

CREATE TABLE household_item (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES household (id) ON DELETE CASCADE,
    name         TEXT NOT NULL,
    type         item_type NOT NULL DEFAULT 'buy',
    priority     item_priority NOT NULL DEFAULT 'medium',
    status       item_status NOT NULL DEFAULT 'pending',
    added_by     UUID NOT NULL REFERENCES profile (id) ON DELETE SET NULL,
    assigned_to  UUID REFERENCES profile (id) ON DELETE SET NULL,
    notes        TEXT,
    resolved_at  TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT household_item_name_not_empty CHECK (name <> ''),
    CONSTRAINT household_item_name_max_length CHECK (char_length(name) <= 200),
    CONSTRAINT household_item_notes_max_length CHECK (notes IS NULL OR char_length(notes) <= 1000),
    CONSTRAINT household_item_resolved_consistency
        CHECK (
            (status = 'done' AND resolved_at IS NOT NULL)
            OR
            (status <> 'done' AND resolved_at IS NULL)
        )
);

COMMENT ON TABLE household_item IS
    'Items the household needs to buy, repair, or fix.';

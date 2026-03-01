-- ============================================================
-- ITEM COMMENT — text comments on household items
-- ============================================================

CREATE TABLE item_comment (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id       UUID NOT NULL REFERENCES household_item (id) ON DELETE CASCADE,
    household_id  UUID NOT NULL REFERENCES household (id) ON DELETE CASCADE,
    author_id     UUID NOT NULL REFERENCES profile (id) ON DELETE SET NULL,
    content       TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT item_comment_content_not_empty CHECK (content <> ''),
    CONSTRAINT item_comment_content_max_length CHECK (char_length(content) <= 2000)
);

COMMENT ON TABLE item_comment IS
    'Text comments on household items. Scoped by both item_id and household_id for RLS efficiency.';

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE item_comment ENABLE ROW LEVEL SECURITY;

CREATE POLICY item_comment_select_members
    ON item_comment FOR SELECT TO authenticated
    USING (
        (get_household_role(household_id) IN ('owner', 'member'))
        OR guest_has_permission(household_id, 'items', 'read')
    );

CREATE POLICY item_comment_insert_members
    ON item_comment FOR INSERT TO authenticated
    WITH CHECK (
        (get_household_role(household_id) IN ('owner', 'member'))
        AND author_id = auth.uid()
    );

CREATE POLICY item_comment_update_own
    ON item_comment FOR UPDATE TO authenticated
    USING (author_id = auth.uid())
    WITH CHECK (author_id = auth.uid());

CREATE POLICY item_comment_delete_own
    ON item_comment FOR DELETE TO authenticated
    USING (
        author_id = auth.uid()
        AND (get_household_role(household_id) IN ('owner', 'member'))
    );

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_item_comment_item
    ON item_comment (item_id, created_at ASC);

CREATE INDEX idx_item_comment_household
    ON item_comment (household_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER trg_item_comment_updated_at
    BEFORE UPDATE ON item_comment
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

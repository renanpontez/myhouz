-- ============================================================
-- HOUSEHOLD
-- ============================================================

CREATE TABLE household (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    owner_id   UUID NOT NULL REFERENCES profile (id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT household_name_not_empty CHECK (name <> ''),
    CONSTRAINT household_name_max_length CHECK (char_length(name) <= 200)
);

COMMENT ON TABLE household IS
    'A household is the top-level tenant. All feature data belongs to exactly one household.';
COMMENT ON COLUMN household.owner_id IS
    'The primary owner. ON DELETE RESTRICT prevents deleting a user who owns a household.';

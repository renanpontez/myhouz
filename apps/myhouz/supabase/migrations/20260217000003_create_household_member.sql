-- ============================================================
-- HOUSEHOLD MEMBER
-- ============================================================

CREATE TABLE household_member (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES household (id) ON DELETE CASCADE,
    user_id      UUID NOT NULL REFERENCES profile (id) ON DELETE CASCADE,
    role         member_role NOT NULL DEFAULT 'member',
    permissions  JSONB NOT NULL DEFAULT '{}',
    joined_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT household_member_unique UNIQUE (household_id, user_id)
);

COMMENT ON TABLE household_member IS
    'Associates users with households and defines their role.';
COMMENT ON COLUMN household_member.permissions IS
    'JSONB for per-section guest permissions. Ignored for owner/member roles.';

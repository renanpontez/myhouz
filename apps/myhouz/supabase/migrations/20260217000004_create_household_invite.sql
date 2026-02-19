-- ============================================================
-- HOUSEHOLD INVITE
-- ============================================================

CREATE TABLE household_invite (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES household (id) ON DELETE CASCADE,
    invited_by   UUID NOT NULL REFERENCES profile (id) ON DELETE CASCADE,
    email        TEXT,
    role         member_role NOT NULL DEFAULT 'member',
    code         TEXT NOT NULL,
    status       invite_status NOT NULL DEFAULT 'pending',
    accepted_by  UUID REFERENCES profile (id) ON DELETE SET NULL,
    accepted_at  TIMESTAMPTZ,
    expires_at   TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT household_invite_code_unique UNIQUE (code),
    CONSTRAINT household_invite_email_format
        CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT household_invite_role_not_owner
        CHECK (role <> 'owner'),
    CONSTRAINT household_invite_accepted_consistency
        CHECK (
            (status = 'accepted' AND accepted_by IS NOT NULL AND accepted_at IS NOT NULL)
            OR
            (status <> 'accepted' AND accepted_by IS NULL AND accepted_at IS NULL)
        )
);

COMMENT ON TABLE household_invite IS
    'Invite links for joining a household. Expires after 7 days by default.';

-- ============================================================
-- PROFILE
-- ============================================================
-- Application-level user profile, synced from auth.users.

CREATE TABLE profile (
    id         UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    name       TEXT NOT NULL DEFAULT '',
    email      TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT profile_email_not_empty CHECK (email <> ''),
    CONSTRAINT profile_name_max_length CHECK (char_length(name) <= 100)
);

COMMENT ON TABLE profile IS
    'Application-level user profile. Created automatically when a user signs up via Supabase Auth.';

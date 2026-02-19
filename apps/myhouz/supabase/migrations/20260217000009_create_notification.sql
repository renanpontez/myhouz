-- ============================================================
-- NOTIFICATION
-- ============================================================

CREATE TABLE notification (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES profile (id) ON DELETE CASCADE,
    household_id   UUID REFERENCES household (id) ON DELETE CASCADE,
    type           TEXT NOT NULL,
    title          TEXT NOT NULL,
    body           TEXT,
    reference_id   UUID,
    reference_type TEXT,
    is_read        BOOLEAN NOT NULL DEFAULT false,
    read_at        TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT notification_type_not_empty CHECK (type <> ''),
    CONSTRAINT notification_title_not_empty CHECK (title <> ''),
    CONSTRAINT notification_type_valid CHECK (
        type IN (
            'urgent_problem_reported',
            'urgent_problem_resolved',
            'reminder_due',
            'household_invite',
            'member_joined',
            'member_removed',
            'item_assigned',
            'checklist_reset'
        )
    )
);

COMMENT ON TABLE notification IS
    'In-app notifications for individual users.';

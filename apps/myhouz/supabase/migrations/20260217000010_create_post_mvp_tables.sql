-- ============================================================
-- BILL (Post-MVP)
-- ============================================================

CREATE TABLE bill (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES household (id) ON DELETE CASCADE,
    name         TEXT NOT NULL,
    amount       NUMERIC(12, 2) NOT NULL,
    currency     TEXT NOT NULL DEFAULT 'USD',
    due_date     DATE NOT NULL,
    recurrence   bill_recurrence NOT NULL DEFAULT 'monthly',
    status       bill_status NOT NULL DEFAULT 'unpaid',
    paid_by      UUID REFERENCES profile (id) ON DELETE SET NULL,
    paid_at      TIMESTAMPTZ,
    assigned_to  UUID REFERENCES profile (id) ON DELETE SET NULL,
    notes        TEXT,
    created_by   UUID NOT NULL REFERENCES profile (id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT bill_name_not_empty CHECK (name <> ''),
    CONSTRAINT bill_name_max_length CHECK (char_length(name) <= 200),
    CONSTRAINT bill_amount_positive CHECK (amount > 0),
    CONSTRAINT bill_currency_length CHECK (char_length(currency) = 3),
    CONSTRAINT bill_notes_max_length CHECK (notes IS NULL OR char_length(notes) <= 1000),
    CONSTRAINT bill_paid_consistency
        CHECK (
            (status = 'paid' AND paid_at IS NOT NULL AND paid_by IS NOT NULL)
            OR
            (status <> 'paid')
        )
);

-- ============================================================
-- HOUSEHOLD SECRET (Post-MVP)
-- ============================================================

CREATE TABLE household_secret (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id    UUID NOT NULL REFERENCES household (id) ON DELETE CASCADE,
    label           TEXT NOT NULL,
    value_encrypted TEXT NOT NULL,
    category        secret_category NOT NULL DEFAULT 'other',
    visible_to      UUID[] NOT NULL DEFAULT '{}',
    created_by      UUID NOT NULL REFERENCES profile (id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT household_secret_label_not_empty CHECK (label <> ''),
    CONSTRAINT household_secret_label_max_length CHECK (char_length(label) <= 200),
    CONSTRAINT household_secret_value_not_empty CHECK (value_encrypted <> '')
);

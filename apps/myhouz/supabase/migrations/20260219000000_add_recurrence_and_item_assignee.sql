-- ============================================================
-- ADD WEEKDAYS/WEEKENDS TO RECURRENCE_TYPE ENUM
-- (Kept for Postgres compatibility — UI uses daily/monthly/custom only)
-- ============================================================

ALTER TYPE recurrence_type ADD VALUE IF NOT EXISTS 'weekdays';
ALTER TYPE recurrence_type ADD VALUE IF NOT EXISTS 'weekends';

-- ============================================================
-- ADD RECURRENCE_META JSONB TO ROUTINE CHECKLIST
-- Stores custom recurrence configuration:
--   { "type": "days_of_week", "days": [1, 3, 5] }        — Mon/Wed/Fri
--   { "type": "interval", "every": 2, "unit": "weeks" }  — every 2 weeks
-- NULL for daily/monthly (no extra config needed)
-- ============================================================

ALTER TABLE routine_checklist
    ADD COLUMN recurrence_meta JSONB;

-- ============================================================
-- ADD ASSIGNED_TO TO ROUTINE CHECKLIST ITEMS
-- ============================================================

ALTER TABLE routine_checklist_item
    ADD COLUMN assigned_to UUID REFERENCES profile (id) ON DELETE SET NULL;

-- ============================================================
-- UPDATE GET_CYCLE_START TO HANDLE NEW RECURRENCE TYPES
-- For 'custom', cycle is always daily (app code handles the logic)
-- ============================================================

CREATE OR REPLACE FUNCTION get_cycle_start(p_recurrence recurrence_type)
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    CASE p_recurrence
        WHEN 'daily' THEN
            RETURN date_trunc('day', now());
        WHEN 'weekly' THEN
            RETURN date_trunc('week', now());
        WHEN 'monthly' THEN
            RETURN date_trunc('month', now());
        WHEN 'weekdays' THEN
            RETURN date_trunc('day', now());
        WHEN 'weekends' THEN
            RETURN date_trunc('day', now());
        WHEN 'custom' THEN
            RETURN date_trunc('day', now());
    END CASE;
END;
$$;

-- ============================================================
-- UPDATE GET_CHECKLIST_COMPLETION TO INCLUDE ASSIGNED_TO
-- ============================================================

DROP FUNCTION IF EXISTS get_checklist_completion(UUID);

CREATE FUNCTION get_checklist_completion(p_checklist_id UUID)
RETURNS TABLE (
    item_id UUID,
    label TEXT,
    sort_order INTEGER,
    is_completed_this_cycle BOOLEAN,
    last_completed_at TIMESTAMPTZ,
    completed_by UUID,
    assigned_to UUID
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        rci.id AS item_id,
        rci.label,
        rci.sort_order,
        (rci.last_completed_at IS NOT NULL
         AND rci.last_completed_at >= get_cycle_start(rc.recurrence))
            AS is_completed_this_cycle,
        rci.last_completed_at,
        rci.completed_by,
        rci.assigned_to
    FROM routine_checklist_item rci
    JOIN routine_checklist rc ON rc.id = rci.checklist_id
    WHERE rci.checklist_id = p_checklist_id
    ORDER BY rci.sort_order, rci.created_at;
$$;

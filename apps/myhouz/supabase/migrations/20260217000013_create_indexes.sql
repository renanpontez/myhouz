-- ============================================================
-- INDEXES
-- ============================================================

-- household
CREATE INDEX idx_household_owner ON household (owner_id);

-- household_member
CREATE INDEX idx_household_member_user ON household_member (user_id);
CREATE INDEX idx_household_member_household ON household_member (household_id);

-- household_invite
CREATE INDEX idx_household_invite_household_status
    ON household_invite (household_id, status);
CREATE INDEX idx_household_invite_expires_at
    ON household_invite (expires_at)
    WHERE status = 'pending';

-- household_item
CREATE INDEX idx_household_item_household_status
    ON household_item (household_id, status);
CREATE INDEX idx_household_item_household_type
    ON household_item (household_id, type);
CREATE INDEX idx_household_item_household_priority
    ON household_item (household_id, priority DESC)
    WHERE status <> 'done';
CREATE INDEX idx_household_item_assigned_to
    ON household_item (assigned_to)
    WHERE assigned_to IS NOT NULL;

-- routine_checklist
CREATE INDEX idx_routine_checklist_household
    ON routine_checklist (household_id)
    WHERE is_active = true;
CREATE INDEX idx_routine_checklist_household_recurrence
    ON routine_checklist (household_id, recurrence)
    WHERE is_active = true;

-- routine_checklist_item
CREATE INDEX idx_routine_checklist_item_checklist
    ON routine_checklist_item (checklist_id, sort_order);
CREATE INDEX idx_routine_checklist_item_last_completed
    ON routine_checklist_item (checklist_id, last_completed_at)
    WHERE last_completed_at IS NOT NULL;

-- reminder
CREATE INDEX idx_reminder_household_due
    ON reminder (household_id, due_at)
    WHERE is_completed = false;
CREATE INDEX idx_reminder_household_completed
    ON reminder (household_id, completed_at DESC)
    WHERE is_completed = true;
CREATE INDEX idx_reminder_assigned_to
    ON reminder (assigned_to, due_at)
    WHERE assigned_to IS NOT NULL AND is_completed = false;
CREATE INDEX idx_reminder_overdue
    ON reminder (due_at)
    WHERE is_completed = false;

-- urgent_problem
CREATE INDEX idx_urgent_problem_household_active
    ON urgent_problem (household_id, created_at DESC)
    WHERE is_active = true;
CREATE INDEX idx_urgent_problem_household_resolved
    ON urgent_problem (household_id, resolved_at DESC)
    WHERE is_active = false;

-- notification
CREATE INDEX idx_notification_user_created
    ON notification (user_id, created_at DESC);
CREATE INDEX idx_notification_user_unread
    ON notification (user_id)
    WHERE is_read = false;
CREATE INDEX idx_notification_household
    ON notification (household_id, created_at DESC)
    WHERE household_id IS NOT NULL;

-- bill (post-MVP)
CREATE INDEX idx_bill_household_status ON bill (household_id, status);
CREATE INDEX idx_bill_household_due
    ON bill (household_id, due_date)
    WHERE status = 'unpaid';
CREATE INDEX idx_bill_assigned_to
    ON bill (assigned_to)
    WHERE assigned_to IS NOT NULL;

-- household_secret (post-MVP)
CREATE INDEX idx_household_secret_household_category
    ON household_secret (household_id, category);

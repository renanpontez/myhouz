ALTER TABLE routine_task
  ADD COLUMN starts_at DATE;

COMMENT ON COLUMN routine_task.starts_at IS
  'Optional start date. If set, the task is hidden from the calendar before this date.';

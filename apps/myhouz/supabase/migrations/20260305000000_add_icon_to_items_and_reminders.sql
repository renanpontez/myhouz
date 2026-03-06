-- Add icon column to household_item and reminder tables
ALTER TABLE household_item ADD COLUMN icon text;
ALTER TABLE reminder ADD COLUMN icon text;

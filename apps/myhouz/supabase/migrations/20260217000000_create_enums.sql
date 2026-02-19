-- ============================================================
-- ENUM TYPES
-- ============================================================

-- Roles within a household
CREATE TYPE member_role AS ENUM ('owner', 'member', 'guest');

-- Household item types (Items to Buy module)
CREATE TYPE item_type AS ENUM ('buy', 'repair', 'fix');

-- Household item priority levels
CREATE TYPE item_priority AS ENUM ('low', 'medium', 'high');

-- Household item statuses
CREATE TYPE item_status AS ENUM ('pending', 'in_progress', 'done');

-- Recurrence frequency for routine checklists
CREATE TYPE recurrence_type AS ENUM ('daily', 'weekly', 'monthly', 'custom');

-- Invite statuses
CREATE TYPE invite_status AS ENUM ('pending', 'accepted', 'revoked', 'expired');

-- Bill statuses (post-MVP)
CREATE TYPE bill_status AS ENUM ('unpaid', 'paid', 'overdue', 'cancelled');

-- Bill recurrence (post-MVP)
CREATE TYPE bill_recurrence AS ENUM ('one_off', 'weekly', 'monthly', 'quarterly', 'yearly');

-- Household secret categories (post-MVP)
CREATE TYPE secret_category AS ENUM ('password', 'contact', 'code', 'other');

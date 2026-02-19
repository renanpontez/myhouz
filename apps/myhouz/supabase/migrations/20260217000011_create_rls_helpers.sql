-- ============================================================
-- RLS HELPER FUNCTIONS
-- ============================================================

-- Check if the current user is a member of the given household
CREATE OR REPLACE FUNCTION is_household_member(p_household_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM household_member
        WHERE household_id = p_household_id
          AND user_id = auth.uid()
    );
$$;

-- Get the current user's role in a household
CREATE OR REPLACE FUNCTION get_household_role(p_household_id UUID)
RETURNS member_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT role
    FROM household_member
    WHERE household_id = p_household_id
      AND user_id = auth.uid();
$$;

-- Check if the current user is an owner of the given household
CREATE OR REPLACE FUNCTION is_household_owner(p_household_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM household_member
        WHERE household_id = p_household_id
          AND user_id = auth.uid()
          AND role = 'owner'
    );
$$;

-- Check if a guest has a specific permission level for a section
CREATE OR REPLACE FUNCTION guest_has_permission(
    p_household_id UUID,
    p_section TEXT,
    p_level TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM household_member
        WHERE household_id = p_household_id
          AND user_id = auth.uid()
          AND role = 'guest'
          AND (
              (p_level = 'read' AND permissions->>p_section IN ('read', 'write'))
              OR
              (p_level = 'write' AND permissions->>p_section = 'write')
          )
    );
$$;

-- ============================================================
-- SEED DATA (Development / Testing)
-- ============================================================
-- This seed creates two test users via Supabase Auth,
-- which triggers profile auto-creation, then populates
-- a household with realistic test data.
-- ============================================================

-- Create test users in auth.users (triggers handle_new_user -> profile)
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'alice@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"name": "Alice Smith", "avatar_url": null}'::jsonb,
    now(),
    now(),
    '', '', '', ''
), (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'bob@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"name": "Bob Johnson", "avatar_url": null}'::jsonb,
    now(),
    now(),
    '', '', '', ''
);

-- Also insert identities so login works
INSERT INTO auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'alice@example.com',
    '{"sub": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "email": "alice@example.com"}'::jsonb,
    'email',
    now(), now(), now()
), (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'bob@example.com',
    '{"sub": "b2c3d4e5-f6a7-8901-bcde-f12345678901", "email": "bob@example.com"}'::jsonb,
    'email',
    now(), now(), now()
);

-- Now seed the app data
DO $$
DECLARE
    user_alice UUID := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    user_bob   UUID := 'b2c3d4e5-f6a7-8901-bcde-f12345678901';
    hh_id      UUID;
    cl_daily   UUID;
    cl_weekly  UUID;
BEGIN
    -- -------------------------------------------------------
    -- 1. Create a household (trigger auto-adds alice as owner)
    -- -------------------------------------------------------
    INSERT INTO household (id, name, owner_id)
    VALUES (gen_random_uuid(), 'Casa do Renan & Andressa', user_alice)
    RETURNING id INTO hh_id;

    -- Add Bob as a member
    INSERT INTO household_member (household_id, user_id, role, joined_at)
    VALUES (hh_id, user_bob, 'member', now() - INTERVAL '14 days');

    -- -------------------------------------------------------
    -- 2. Household Items (Items to Buy)
    -- -------------------------------------------------------
    INSERT INTO household_item (household_id, name, type, priority, status, added_by, assigned_to, notes) VALUES
        (hh_id, 'Esponjas novas para cozinha', 'buy', 'low', 'pending', user_alice, NULL, 'Pegar as antiaderentes'),
        (hh_id, 'Consertar torneira do banheiro', 'repair', 'high', 'in_progress', user_bob, user_bob, 'A torneira de agua quente pinga sem parar. Pode precisar trocar a borracha.'),
        (hh_id, 'Trocar pilhas do detector de fumaca', 'fix', 'high', 'pending', user_alice, NULL, 'Os 4 detectores estao apitando'),
        (hh_id, 'Sabao para lavar roupa', 'buy', 'medium', 'pending', user_bob, NULL, 'De preferencia ecologico'),
        (hh_id, 'Papel toalha', 'buy', 'low', 'pending', user_alice, NULL, NULL);

    -- A done item (need to set resolved_at manually for seed since trigger only fires on UPDATE)
    INSERT INTO household_item (household_id, name, type, priority, status, added_by, assigned_to, notes, resolved_at) VALUES
        (hh_id, 'Comprar tapete novo', 'buy', 'low', 'done', user_alice, user_alice, NULL, now() - INTERVAL '3 days');

    -- -------------------------------------------------------
    -- 3. Routine Checklists
    -- -------------------------------------------------------

    -- Daily checklist
    INSERT INTO routine_checklist (id, household_id, title, recurrence, created_by)
    VALUES (gen_random_uuid(), hh_id, 'Limpeza Diaria', 'daily', user_alice)
    RETURNING id INTO cl_daily;

    INSERT INTO routine_checklist_item (checklist_id, label, sort_order, last_completed_at, completed_by) VALUES
        (cl_daily, 'Arrumar as camas', 1, now() - INTERVAL '2 hours', user_alice),
        (cl_daily, 'Lavar a louca', 2, NULL, NULL),
        (cl_daily, 'Limpar bancada da cozinha', 3, now() - INTERVAL '1 hour', user_bob),
        (cl_daily, 'Tirar o lixo', 4, NULL, NULL),
        (cl_daily, 'Varrer as areas comuns', 5, NULL, NULL);

    -- Weekly checklist
    INSERT INTO routine_checklist (id, household_id, title, recurrence, created_by)
    VALUES (gen_random_uuid(), hh_id, 'Manutencao Semanal', 'weekly', user_alice)
    RETURNING id INTO cl_weekly;

    INSERT INTO routine_checklist_item (checklist_id, label, sort_order, last_completed_at, completed_by) VALUES
        (cl_weekly, 'Aspirar todos os comodos', 1, now() - INTERVAL '2 days', user_bob),
        (cl_weekly, 'Passar pano no chao', 2, now() - INTERVAL '2 days', user_bob),
        (cl_weekly, 'Limpar banheiros', 3, NULL, NULL),
        (cl_weekly, 'Regar as plantas', 4, now() - INTERVAL '3 days', user_alice),
        (cl_weekly, 'Limpar peitoris das janelas', 5, NULL, NULL),
        (cl_weekly, 'Trocar roupa de cama', 6, NULL, NULL);

    -- -------------------------------------------------------
    -- 4. Reminders
    -- -------------------------------------------------------
    INSERT INTO reminder (household_id, title, due_at, assigned_to, created_by) VALUES
        (hh_id, 'Ligar para o encanador sobre o aquecedor', now() + INTERVAL '2 days', user_alice, user_alice),
        (hh_id, 'Agendar dedetizacao', now() + INTERVAL '5 days', user_bob, user_alice),
        (hh_id, 'Renovar seguro da casa', now() + INTERVAL '14 days', user_alice, user_alice),
        (hh_id, 'Buscar encomenda no correio', now() - INTERVAL '1 day', user_bob, user_bob);

    -- -------------------------------------------------------
    -- 5. Urgent Problems
    -- -------------------------------------------------------
    INSERT INTO urgent_problem (household_id, title, description, reported_by, is_active) VALUES
        (hh_id,
         'Vazamento embaixo da pia da cozinha',
         'Tem um gotejamento constante embaixo da pia. Um balde esta segurando a agua por enquanto, mas precisa ser consertado urgente. O vazamento parece vir da conexao do sifao.',
         user_bob, true);

    INSERT INTO urgent_problem (household_id, title, description, reported_by, is_active, resolved_at, resolved_by) VALUES
        (hh_id,
         'Queda de energia nos quartos de cima',
         'Todas as tomadas e luzes dos quartos de cima pararam de funcionar. O disjuntor tinha desarmado. Rearmei e tudo voltou ao normal.',
         user_alice, false, now() - INTERVAL '5 days', user_alice);

    -- -------------------------------------------------------
    -- 6. Household Invite (pending)
    -- -------------------------------------------------------
    INSERT INTO household_invite (household_id, invited_by, email, role, code, status, expires_at) VALUES
        (hh_id, user_alice, 'carol@example.com', 'member', 'abc123def456', 'pending', now() + INTERVAL '5 days');

    -- -------------------------------------------------------
    -- 7. Notifications
    -- -------------------------------------------------------
    INSERT INTO notification (user_id, household_id, type, title, body) VALUES
        (user_alice, hh_id, 'urgent_problem_reported', 'Novo problema urgente',
         'Bob reportou: Vazamento embaixo da pia da cozinha'),
        (user_bob, hh_id, 'item_assigned', 'Item atribuido a voce',
         'Alice atribuiu "Consertar torneira do banheiro" para voce'),
        (user_alice, hh_id, 'member_joined', 'Novo membro entrou',
         'Bob entrou em Casa do Renan & Andressa');

    RAISE NOTICE 'Seed data created successfully for household %', hh_id;
END;
$$;

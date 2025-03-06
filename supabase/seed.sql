
-- This seed file will run on the first deployment of your Supabase project
-- It's useful for creating initial data for testing

-- If there are no users yet, we'll create a default admin user
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users) THEN
    -- Note: This won't actually create an auth user, just a placeholder
    -- Real users are created through the auth system
    INSERT INTO users (id, email, name, role, is_approved)
    VALUES 
      ('00000000-0000-0000-0000-000000000000', 'admin@example.com', 'System Admin', 'admin', TRUE);
  END IF;
END
$$;

-- Create some sample services
INSERT INTO services (name, description, price, user_id)
SELECT 
  'Website - Landing Page', 
  'Uma página de destino profissional para a sua empresa', 
  1999.99, 
  id 
FROM users 
WHERE role = 'admin' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO services (name, description, price, user_id)
SELECT 
  'Website - E-commerce', 
  'Loja virtual completa com gestão de produtos e pagamentos', 
  5999.99, 
  id 
FROM users 
WHERE role = 'admin' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO services (name, description, price, user_id)
SELECT 
  'Gestão de Redes Sociais', 
  'Pacote mensal de gestão de conteúdo para redes sociais', 
  1200.00, 
  id 
FROM users 
WHERE role = 'admin' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- Create a sample client
INSERT INTO clients (name, email, phone, user_id)
SELECT 
  'Cliente Demonstração', 
  'cliente@exemplo.com', 
  '(11) 99999-9999', 
  id 
FROM users 
WHERE role = 'admin' 
LIMIT 1
ON CONFLICT DO NOTHING;

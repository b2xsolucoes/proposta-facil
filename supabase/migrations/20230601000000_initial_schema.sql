
-- Create users table with roles and approval
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  total_value DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
  valid_until DATE,
  notes TEXT,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create proposal items table for services included in proposals
CREATE TABLE IF NOT EXISTS proposal_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL, -- Price at the time of proposal creation (may differ from current service price)
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies

-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Admin can see all users
CREATE POLICY "Admins can see all users" ON users
  FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Users can see themselves
CREATE POLICY "Users can see themselves" ON users
  FOR SELECT
  USING (id = auth.uid());

-- Admin can insert users
CREATE POLICY "Admins can insert users" ON users
  FOR INSERT
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin' OR
    (SELECT COUNT(*) FROM users) = 0 -- First user can register
  );

-- Admin can update users
CREATE POLICY "Admins can update users" ON users
  FOR UPDATE
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Admin can delete users
CREATE POLICY "Admins can delete users" ON users
  FOR DELETE
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Clients table policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Users can see their own clients
CREATE POLICY "Users can see their own clients" ON clients
  FOR SELECT
  USING (user_id = auth.uid());

-- Approved users can insert clients
CREATE POLICY "Approved users can insert clients" ON clients
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    (SELECT is_approved FROM users WHERE id = auth.uid())
  );

-- Users can update their own clients
CREATE POLICY "Users can update their own clients" ON clients
  FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own clients
CREATE POLICY "Users can delete their own clients" ON clients
  FOR DELETE
  USING (user_id = auth.uid());

-- Services table policies
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Users can see their own services
CREATE POLICY "Users can see their own services" ON services
  FOR SELECT
  USING (user_id = auth.uid());

-- Approved users can insert services
CREATE POLICY "Approved users can insert services" ON services
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    (SELECT is_approved FROM users WHERE id = auth.uid())
  );

-- Users can update their own services
CREATE POLICY "Users can update their own services" ON services
  FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own services
CREATE POLICY "Users can delete their own services" ON services
  FOR DELETE
  USING (user_id = auth.uid());

-- Proposals table policies
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Users can see their own proposals
CREATE POLICY "Users can see their own proposals" ON proposals
  FOR SELECT
  USING (user_id = auth.uid());

-- Approved users can insert proposals
CREATE POLICY "Approved users can insert proposals" ON proposals
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    (SELECT is_approved FROM users WHERE id = auth.uid())
  );

-- Users can update their own proposals
CREATE POLICY "Users can update their own proposals" ON proposals
  FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own proposals
CREATE POLICY "Users can delete their own proposals" ON proposals
  FOR DELETE
  USING (user_id = auth.uid());

-- Proposal items table policies
ALTER TABLE proposal_items ENABLE ROW LEVEL SECURITY;

-- Users can see items from their own proposals
CREATE POLICY "Users can see items from their own proposals" ON proposal_items
  FOR SELECT
  USING (
    (
      SELECT user_id 
      FROM proposals 
      WHERE id = proposal_id
    ) = auth.uid()
  );

-- Approved users can insert proposal items
CREATE POLICY "Approved users can insert proposal items" ON proposal_items
  FOR INSERT
  WITH CHECK (
    (
      SELECT user_id 
      FROM proposals 
      WHERE id = proposal_id
    ) = auth.uid() AND
    (SELECT is_approved FROM users WHERE id = auth.uid())
  );

-- Users can update items from their own proposals
CREATE POLICY "Users can update items from their own proposals" ON proposal_items
  FOR UPDATE
  USING (
    (
      SELECT user_id 
      FROM proposals 
      WHERE id = proposal_id
    ) = auth.uid()
  );

-- Users can delete items from their own proposals
CREATE POLICY "Users can delete items from their own proposals" ON proposal_items
  FOR DELETE
  USING (
    (
      SELECT user_id 
      FROM proposals 
      WHERE id = proposal_id
    ) = auth.uid()
  );

-- Create functions and triggers
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, name, role, is_approved)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    CASE WHEN (SELECT COUNT(*) FROM users) = 0 THEN 'admin' ELSE 'user' END,
    CASE WHEN (SELECT COUNT(*) FROM users) = 0 THEN TRUE ELSE FALSE END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Function to calculate proposal total
CREATE OR REPLACE FUNCTION calculate_proposal_total() 
RETURNS TRIGGER AS $$
BEGIN
  UPDATE proposals
  SET total_value = (
    SELECT SUM(price * quantity)
    FROM proposal_items
    WHERE proposal_id = NEW.proposal_id
  )
  WHERE id = NEW.proposal_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for calculating proposal total
CREATE TRIGGER on_proposal_item_change
  AFTER INSERT OR UPDATE OR DELETE ON proposal_items
  FOR EACH ROW EXECUTE PROCEDURE calculate_proposal_total();

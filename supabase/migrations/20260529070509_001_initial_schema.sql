-- ============================================
-- Complete Migration: PG Student Expense Tracker
-- Drop existing tables for clean state
-- ============================================

DROP TABLE IF EXISTS shopping_log CASCADE;
DROP TABLE IF EXISTS social_log CASCADE;
DROP TABLE IF EXISTS academics_log CASCADE;
DROP TABLE IF EXISTS health_log CASCADE;
DROP TABLE IF EXISTS mess_log CASCADE;
DROP TABLE IF EXISTS shared_expenses CASCADE;
DROP TABLE IF EXISTS roommates CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS savings_goals CASCADE;
DROP TABLE IF EXISTS income CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================
-- PROFILES TABLE (uses id, not user_id)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  bio text,
  phone_number text,
  avatar_url text,
  college_name text,
  department text,
  year_of_study integer,
  pg_name text,
  pg_address text,
  room_number text,
  move_in_date date,
  emergency_contact_name text,
  emergency_contact_phone text,
  monthly_rent numeric,
  rent_due_date integer,
  pocket_money numeric,
  pocket_money_date integer,
  gender text,
  email_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false
);

-- ============================================
-- EXPENSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  subcategory text,
  amount numeric NOT NULL,
  description text,
  payment_mode text NOT NULL,
  expense_date date NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false
);

-- ============================================
-- INCOME TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS income (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source text NOT NULL,
  amount numeric NOT NULL,
  payment_mode text,
  account_id text,
  income_date date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false
);

-- ============================================
-- SAVINGS GOALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS savings_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  target_amount numeric NOT NULL,
  current_amount numeric DEFAULT 0,
  deadline date,
  is_achieved boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false
);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount numeric NOT NULL,
  frequency text NOT NULL,
  next_due_date date NOT NULL,
  category text,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false
);

-- ============================================
-- ROOMMATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS roommates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  room_number text,
  notes text,
  balance numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false
);

-- ============================================
-- SHARED EXPENSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS shared_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  roommate_id uuid REFERENCES roommates(id) ON DELETE CASCADE,
  description text NOT NULL,
  total_amount numeric NOT NULL,
  paid_by_user boolean DEFAULT true,
  split_type text DEFAULT 'equal',
  your_share numeric NOT NULL,
  their_share numeric NOT NULL,
  is_settled boolean DEFAULT false,
  settled_date date,
  expense_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false
);

-- ============================================
-- MESS LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS mess_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_name text,
  monthly_fee numeric NOT NULL,
  start_date date NOT NULL,
  is_active boolean DEFAULT true,
  off_days_count integer DEFAULT 0,
  expected_refund numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false
);

-- ============================================
-- HEALTH LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS health_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  hospital_pharmacy_name text,
  doctor_name text,
  medicine_name text,
  medicine_dosage text,
  medicine_duration text,
  amount numeric NOT NULL,
  payment_mode text NOT NULL,
  visit_date date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false
);

-- ============================================
-- ACADEMICS LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS academics_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  semester integer NOT NULL,
  subject text,
  item_name text NOT NULL,
  item_type text,
  amount numeric NOT NULL,
  payment_mode text NOT NULL,
  purchase_date date NOT NULL,
  is_exam_fee boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false
);

-- ============================================
-- SOCIAL LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS social_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  person_name text,
  place text,
  people_count integer,
  description text NOT NULL,
  amount numeric NOT NULL,
  is_lent boolean,
  is_returned boolean DEFAULT false,
  due_date date,
  transaction_date date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false
);

-- ============================================
-- SHOPPING LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS shopping_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shopping_type text NOT NULL,
  item_category text,
  item_name text NOT NULL,
  brand text,
  color text,
  size text,
  occasion text,
  amount numeric NOT NULL,
  payment_mode text NOT NULL,
  purchase_date date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false
);

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roommates ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE mess_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE academics_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES (uses id NOT user_id)
-- ============================================
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- ============================================
-- EXPENSES POLICIES
-- ============================================
CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- INCOME POLICIES
-- ============================================
CREATE POLICY "Users can view own income"
  ON income FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own income"
  ON income FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own income"
  ON income FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own income"
  ON income FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- SAVINGS GOALS POLICIES
-- ============================================
CREATE POLICY "Users can view own savings goals"
  ON savings_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own savings goals"
  ON savings_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own savings goals"
  ON savings_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own savings goals"
  ON savings_goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- SUBSCRIPTIONS POLICIES
-- ============================================
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions"
  ON subscriptions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- ROOMMATES POLICIES
-- ============================================
CREATE POLICY "Users can view own roommates"
  ON roommates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own roommates"
  ON roommates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own roommates"
  ON roommates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own roommates"
  ON roommates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- SHARED EXPENSES POLICIES
-- ============================================
CREATE POLICY "Users can view own shared expenses"
  ON shared_expenses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shared expenses"
  ON shared_expenses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shared expenses"
  ON shared_expenses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own shared expenses"
  ON shared_expenses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- MESS LOG POLICIES
-- ============================================
CREATE POLICY "Users can view own mess log"
  ON mess_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mess log"
  ON mess_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mess log"
  ON mess_log FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own mess log"
  ON mess_log FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- HEALTH LOG POLICIES
-- ============================================
CREATE POLICY "Users can view own health log"
  ON health_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health log"
  ON health_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health log"
  ON health_log FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health log"
  ON health_log FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- ACADEMICS LOG POLICIES
-- ============================================
CREATE POLICY "Users can view own academics log"
  ON academics_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own academics log"
  ON academics_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own academics log"
  ON academics_log FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own academics log"
  ON academics_log FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- SOCIAL LOG POLICIES
-- ============================================
CREATE POLICY "Users can view own social log"
  ON social_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own social log"
  ON social_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social log"
  ON social_log FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own social log"
  ON social_log FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- SHOPPING LOG POLICIES
-- ============================================
CREATE POLICY "Users can view own shopping log"
  ON shopping_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shopping log"
  ON shopping_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shopping log"
  ON shopping_log FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own shopping log"
  ON shopping_log FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_is_deleted ON expenses(is_deleted);
CREATE INDEX IF NOT EXISTS idx_expenses_metadata ON expenses USING GIN(metadata);

CREATE INDEX IF NOT EXISTS idx_income_user_id ON income(user_id);
CREATE INDEX IF NOT EXISTS idx_income_date ON income(income_date);
CREATE INDEX IF NOT EXISTS idx_income_is_deleted ON income(is_deleted);

CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON savings_goals(user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_due ON subscriptions(next_due_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_is_active ON subscriptions(is_active);

CREATE INDEX IF NOT EXISTS idx_roommates_user_id ON roommates(user_id);

CREATE INDEX IF NOT EXISTS idx_shared_expenses_user_id ON shared_expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_expenses_roommate_id ON shared_expenses(roommate_id);
CREATE INDEX IF NOT EXISTS idx_shared_expenses_is_settled ON shared_expenses(is_settled);

CREATE INDEX IF NOT EXISTS idx_mess_log_user_id ON mess_log(user_id);
CREATE INDEX IF NOT EXISTS idx_mess_log_is_active ON mess_log(is_active);

CREATE INDEX IF NOT EXISTS idx_health_log_user_id ON health_log(user_id);
CREATE INDEX IF NOT EXISTS idx_health_log_visit_date ON health_log(visit_date);

CREATE INDEX IF NOT EXISTS idx_academics_log_user_id ON academics_log(user_id);
CREATE INDEX IF NOT EXISTS idx_academics_log_semester ON academics_log(semester);

CREATE INDEX IF NOT EXISTS idx_social_log_user_id ON social_log(user_id);
CREATE INDEX IF NOT EXISTS idx_social_log_type ON social_log(type);
CREATE INDEX IF NOT EXISTS idx_social_log_is_returned ON social_log(is_returned);

CREATE INDEX IF NOT EXISTS idx_shopping_log_user_id ON shopping_log(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_log_shopping_type ON shopping_log(shopping_type);

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS ₹₹
BEGIN
  INSERT INTO public.profiles (id, display_name, email_verified)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'display_name',
    new.email_confirmed_at IS NOT NULL
  );
  RETURN new;
END;
₹₹ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- AUTO-UPDATE email_verified ON EMAIL CONFIRM
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_email_verified()
RETURNS trigger AS ₹₹
BEGIN
  IF new.email_confirmed_at IS NOT NULL AND old.email_confirmed_at IS NULL THEN
    UPDATE public.profiles
    SET email_verified = true, updated_at = now()
    WHERE id = new.id;
  END IF;
  RETURN new;
END;
₹₹ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_email_confirmed ON auth.users;

CREATE TRIGGER on_auth_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_email_verified();

-- ============================================
-- AUTO-UPDATE updated_at TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS ₹₹
BEGIN
  new.updated_at = now();
  RETURN new;
END;
₹₹ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_updated_at_expenses
  BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_updated_at_income
  BEFORE UPDATE ON income
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_updated_at_savings_goals
  BEFORE UPDATE ON savings_goals
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_updated_at_subscriptions
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_updated_at_roommates
  BEFORE UPDATE ON roommates
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_updated_at_shared_expenses
  BEFORE UPDATE ON shared_expenses
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_updated_at_mess_log
  BEFORE UPDATE ON mess_log
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_updated_at_health_log
  BEFORE UPDATE ON health_log
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_updated_at_academics_log
  BEFORE UPDATE ON academics_log
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_updated_at_social_log
  BEFORE UPDATE ON social_log
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_updated_at_shopping_log
  BEFORE UPDATE ON shopping_log
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
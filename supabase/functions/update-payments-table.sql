
-- Add Stripe-specific columns to payments table
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Remove Lemon Squeezy specific column if it exists
ALTER TABLE public.payments 
DROP COLUMN IF EXISTS lemon_squeezy_order_id;

-- Update the table comment
COMMENT ON TABLE public.payments IS 'Stores payment information for Stripe transactions';

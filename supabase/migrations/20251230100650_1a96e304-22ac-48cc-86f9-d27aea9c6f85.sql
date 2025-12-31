-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS issues)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles (only admins can view/modify roles)
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create blocked_dates table for admin date blocking
CREATE TABLE public.blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocked_date DATE NOT NULL,
    scooter_type TEXT CHECK (scooter_type IN ('single', 'double', 'all')) DEFAULT 'all',
    reason TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (blocked_date, scooter_type)
);

-- Enable RLS on blocked_dates
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- Anyone can read blocked dates (needed for booking UI)
CREATE POLICY "Anyone can view blocked dates"
ON public.blocked_dates
FOR SELECT
TO anon, authenticated
USING (true);

-- Only admins can insert blocked dates
CREATE POLICY "Admins can insert blocked dates"
ON public.blocked_dates
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete blocked dates
CREATE POLICY "Admins can delete blocked dates"
ON public.blocked_dates
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create bookings table for storing rental bookings
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scooter_type TEXT NOT NULL CHECK (scooter_type IN ('single', 'double')),
    pickup_date DATE NOT NULL,
    pickup_time TEXT NOT NULL,
    return_date DATE NOT NULL,
    return_time TEXT NOT NULL,
    total_days INTEGER NOT NULL,
    rental_fee DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2) NOT NULL DEFAULT 100,
    remaining_balance DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    stripe_payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow anonymous inserts for public booking (customers don't need to be logged in)
CREATE POLICY "Anyone can create bookings"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can update bookings
CREATE POLICY "Admins can update bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create scooter_inventory table
CREATE TABLE public.scooter_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scooter_type TEXT NOT NULL UNIQUE CHECK (scooter_type IN ('single', 'double')),
    total_count INTEGER NOT NULL DEFAULT 0,
    price_per_day DECIMAL(10,2) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on scooter_inventory
ALTER TABLE public.scooter_inventory ENABLE ROW LEVEL SECURITY;

-- Anyone can read inventory
CREATE POLICY "Anyone can view inventory"
ON public.scooter_inventory
FOR SELECT
TO anon, authenticated
USING (true);

-- Only admins can update inventory
CREATE POLICY "Admins can update inventory"
ON public.scooter_inventory
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default inventory (2 single-seaters, 0 double-seaters as per requirements)
INSERT INTO public.scooter_inventory (scooter_type, total_count, price_per_day)
VALUES 
    ('single', 2, 50.00),
    ('double', 0, 70.00);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
BEFORE UPDATE ON public.scooter_inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
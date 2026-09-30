-- Grant admin role directly to amudarash102@gmail.com
-- 1. If the user already exists in auth.users, assign admin role immediately:
DO $$
DECLARE
  target_user_id uuid;
BEGIN
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE lower(email) = lower('amudarash102@gmail.com')
  LIMIT 1;

  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

-- 2. Trigger on new user signup for amudarash102@gmail.com:
CREATE OR REPLACE FUNCTION public.auto_grant_owner_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF lower(NEW.email) = lower('amudarash102@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS tr_auto_grant_owner_admin ON auth.users;
CREATE TRIGGER tr_auto_grant_owner_admin
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_grant_owner_admin();

-- 3. Callable RPC for the owner to claim or bootstrap admin access:
CREATE OR REPLACE FUNCTION public.bootstrap_owner_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  u_email text;
BEGIN
  IF uid IS NULL THEN
    RETURN false;
  END IF;

  SELECT email INTO u_email
  FROM auth.users
  WHERE id = uid;

  IF lower(u_email) = lower('amudarash102@gmail.com') OR NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (uid, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

REVOKE ALL ON FUNCTION public.bootstrap_owner_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bootstrap_owner_admin() TO authenticated;

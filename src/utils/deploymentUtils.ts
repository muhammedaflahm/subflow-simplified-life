
export const validateEnvironment = () => {
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const missing = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    return false;
  }
  
  return true;
};

export const checkSupabaseConnection = async () => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Failed to test Supabase connection:', error);
    return false;
  }
};

export const validateDeployment = async () => {
  console.log('Running deployment validation...');
  
  const envValid = validateEnvironment();
  const supabaseValid = await checkSupabaseConnection();
  
  const isValid = envValid && supabaseValid;
  
  if (isValid) {
    console.log('✅ Deployment validation passed');
  } else {
    console.error('❌ Deployment validation failed');
  }
  
  return isValid;
};

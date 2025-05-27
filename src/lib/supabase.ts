// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ezzpvasnitpqabsssktm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6enB2YXNuaXRwcWFic3Nza3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMzI0NTMsImV4cCI6MjA2MzkwODQ1M30.P22uZj5vh6TW6eZmoAYmLjust7Cjaj0uW20dDsxVC6w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

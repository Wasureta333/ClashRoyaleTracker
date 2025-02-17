import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xdgduhjdwazviraadyja.supabase.co"; 
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZ2R1aGpkd2F6dmlyYWFkeWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3ODYyNTEsImV4cCI6MjA1NTM2MjI1MX0.TQSHFCQIdimQt3mOeBPea1BqPy0Ywli1fxrVXg537AU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
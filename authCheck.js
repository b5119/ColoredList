const SUPABASE_URL = "https://naolniqjndbevsytsnwu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hb2xuaXFqbmRiZXZzeXRzbnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxOTY5MTUsImV4cCI6MjA3Mjc3MjkxNX0.PhSFQO69hWLMFaaPv3UHAIxhow9k3XDNSIMS_sbmVps";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "/"; // redirect if not logged in
  }
}

checkSession();

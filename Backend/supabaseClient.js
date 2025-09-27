// supabaseClient.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config(); // Load variables from .env

// ✅ Define constants FIRST
const SUPABASE_URL = process.env.SUPABASE_URL || "https://xmuxhzdlluxenlouvpob.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdXhoemRsbHV4ZW5sb3V2cG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NDI2OTIsImV4cCI6MjA3MjQxODY5Mn0.SEBSFAYdZyyYY97KOuYyDp9ZONDYWc2teI9WLa9PYZo";

// ✅ Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ✅ Export the client for use in other files
export default supabase;

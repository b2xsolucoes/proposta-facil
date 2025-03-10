
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Create a Supabase client with the Auth admin key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://facgdpqsepiqaefudhnq.supabase.co";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Send password reset email
    console.log(`Attempting to send password reset email to: ${email}`);
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${req.headers.get("origin") || ""}/reset-password-confirm`,
    });

    if (error) {
      console.error("Reset password error:", error);
      throw error;
    }

    console.log("Password reset email sent successfully");
    
    return new Response(
      JSON.stringify({ success: true, message: "Password reset email sent" }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error in reset-password function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send password reset email" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

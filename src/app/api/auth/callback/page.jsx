"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";

export default function AuthCallback() {

  console.log("Callback page loaded")
  const router = useRouter();

  useEffect(() => {
    const syncProfile = async () => {
      // Wait briefly to allow the session to be restored if needed
      const { data: { session, user }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
        return;
      }
      if (!user) return; // No user authenticated; you may want to redirect back to login

      console.log("User authenticated:", user);

      // Check if the user profile exists in your custom table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
        return;
      }
      
      if (profile) {
        // Profile exists, just redirect
        console.log("Existing profile found, redirecting to dashboard");
        console.log("Router push to: /dashboard");
        
        // Try direct window.location as fallback
        setTimeout(() => {
          router.push("/dashboard");
          
          // Fallback if router doesn't work
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1000);
        }, 100);
      } else {
        console.log("No profile found, creating one for Google user");
        
        // Create a new profile for the Google-authenticated user
        console.log("User ID type:", typeof user.id, "Value:", user.id);
        
        const newProfile = {
          auth_id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split('@')[0] || '',  // Changed from full_name to name
          role: "student", // Default to student
          dietary_preferences: []
        };
        
        // Try inserting with a direct SQL approach if the standard approach fails
        console.log("Before insert - using profiles table");
        
        console.log("Inserting new profile:", JSON.stringify(newProfile, null, 2));
        
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([newProfile]);
          
        if (insertError) {
          console.error("Error creating profile:", insertError.message, insertError.code, insertError.details, insertError.hint);
          
          // Try fallback with an alternative approach
          console.log("Attempting fallback insert method");
          try {
            const { data: rawData, error: rpcError } = await supabase.rpc('create_profile_for_user', {
              auth_id_param: user.id,
              email_param: user.email,
              name_param: user.user_metadata?.full_name || user.email.split('@')[0] || '',
              role_param: 'student'
            });
            
            if (rpcError) {
              console.error("RPC fallback error:", rpcError);
            } else {
              console.log("Profile created with RPC fallback");
            }
          } catch (e) {
            console.error("Exception in fallback:", e);
          }
          
          return;
        }
        
        console.log("Profile created successfully");
        
        // For Google sign-ups, we'll send them to set dietary preferences
        console.log("Router push to: /dietary-preferences");
        
        // Try direct window.location as fallback
        setTimeout(() => {
          router.push("/dietary-preferences");
          
          // Fallback if router doesn't work
          setTimeout(() => {
            window.location.href = "/dietary-preferences";
          }, 1000);
        }, 100);
      }
    };

    syncProfile();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900">
      <p className="text-white text-xl">Setting up your account...</p>
      <p className="text-zinc-400 mt-4 text-sm">
        If you're not redirected automatically, 
        <a href="/dashboard" className="text-green-500 hover:text-green-400 ml-1">
          click here
        </a>
      </p>
    </div>
  );
}

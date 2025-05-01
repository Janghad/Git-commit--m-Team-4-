"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // The Supabase client will automatically handle the token in the URL
    // We just need to check the session and redirect appropriately
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          router.push("/login?error=auth-error");
          return;
        }

        if (session) {
          // If we have a session, redirect to dashboard
          router.push("/dashboard");
        } else {
          // Otherwise, redirect to login
          router.push("/login?message=email-confirmed");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        router.push("/login?error=unknown");
      }
    };

    // Run the session check
    checkSession();
  }, [router]);

  // Simple loading state while we process
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <div className="text-center p-8 bg-zinc-800 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-white mb-2">Processing authentication...</h1>
        <p className="text-zinc-400">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
}
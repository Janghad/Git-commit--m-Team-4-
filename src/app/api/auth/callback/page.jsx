"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

//Referenced ChatGPT
export default function AuthCallback() {
    const router = useRouter()

    useEffect(() => {
        const syncGoogleUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Checks if the user is already known to the database
        const { data: existing } = await supabase
            .from("users")
            .select("id")
            .eq("email", user.email)
            .maybeSingle()

        // If new user added
        if (!existing) {
            await supabase.from("users").insert([
            {
                email: user.email,
                user_type: "student", //default role but come back to it later
                auth_id: user.id,
                first_name: user.user_metadata.full_name?.split(" ")[0] || null,
                last_name: user.user_metadata.full_name?.split(" ")[1] || null,
            },
            ])
        }

        // Redirect to appropriate page
        router.push("/dashboard")
        }

        syncGoogleUser()
    }, [router])

    return <p>Logging in...</p>
}
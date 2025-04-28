import supabase from "@/lib/supabaseClient";

export async function POST(req) {
    try {
        const { username, email, password } = await req.json();
        
        // Sign up the user using Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });
        
        if (authError) {
            return Response.json({ error: authError.message }, { status: 500 });
        }
        
        // Insert additional user data into the profiles table
        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .insert([
                {
                    auth_id: authData.user.id,
                    email: email,
                    full_name: username,
                    role: "student", 
                }
            ]);
        
        if (profileError) {
            return Response.json({ error: profileError.message }, { status: 500 });
        }
        
        return Response.json({ 
            message: "User registered", 
            userId: authData.user.id 
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
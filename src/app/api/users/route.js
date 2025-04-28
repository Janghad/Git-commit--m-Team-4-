import supabase from "@/lib/supabaseClient";

export async function GET() {
    try {
        // Fetch all profiles from the Supabase profiles table
        const { data, error } = await supabase
            .from("profiles")
            .select("*");
            
        if (error) {
            return Response.json({ error: error.message }, { status: 500 });
        }
        
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
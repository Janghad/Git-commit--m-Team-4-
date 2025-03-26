import pool from "@/lib/db";

export async function POST(req) {
    try {
    const { username, email, password } = await req.json();
    const hashedPassword = password; // 🔹 Hashing will be added later

    const [result] = await pool.query(
        "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
        [username, email, hashedPassword]
    );

    return Response.json({ message: "User registered", userId: result.insertId });
    } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
    }
}

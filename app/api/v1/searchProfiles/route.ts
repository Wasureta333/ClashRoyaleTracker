import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const playerName = searchParams.get("playerName");

    if (!playerName) {
        return NextResponse.json({ error: "Il parametro 'playerName' è obbligatorio." }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("player_tag")
        .ilike("name", `%${playerName}%`) // 🔎 Cerca per nome (case-insensitive)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data.length === 0) {
        return NextResponse.json({ error: "Profilo non trovato." }, { status: 404 });
    }

    return NextResponse.json({ player_tag: data[0].player_tag }, { status: 200 });
}

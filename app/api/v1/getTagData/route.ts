import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const playerTagRaw = searchParams.get("playerTag");
    if (!playerTagRaw) {
        return NextResponse.json({ error: "Il parametro 'playerTag' è obbligatorio." }, { status: 400 });
    }

    const playerTag = playerTagRaw.toUpperCase();
    const url = `https://api.clashroyale.com/v1/players/${encodeURIComponent(`#${playerTag}`)}`;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Errore API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        const playerProfile = {
            player_tag: playerTag,
            name: data.name,
            exp_level: data.expLevel,
            trophies: data.trophies,
            best_trophies: data.bestTrophies,
            wins: data.wins,
            losses: data.losses,
            leagueNumber: data.currentPathOfLegendSeasonResult?.leagueNumber ?? 0,
            medals: data.currentPathOfLegendSeasonResult?.trophies ?? 0,
            rank: data.currentPathOfLegendSeasonResult?.rank  ?? 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from("profiles")
            .upsert([playerProfile], { onConflict: "player_tag" }); // 🔹 Passa un array di oggetti e una stringa in onConflict


        if (error) {
            throw new Error(`Errore su Supabase: ${error.message}`);
        }

        return NextResponse.json({ data }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        );
    }
}
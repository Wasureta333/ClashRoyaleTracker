import { NextResponse } from "next/server";

export async function GET(request) {
        const { searchParams } = new URL(request.url);
        const playerTag = searchParams.get("playerTag")?.toUpperCase();
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
                const data = await response.json();
                console.log(data)
                throw new Error(`Errore API: ${response.status} ${response.statusText}`);
            }
    
            const data = await response.json();

            return NextResponse.json({data},{ status: 200 });
        } catch (error) {
            return NextResponse.json(
                {
                  error: error
                },
                { status: 400 },
              );
            return 
        }
}
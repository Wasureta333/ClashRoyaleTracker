import { NextResponse } from "next/server";

export async function GET(request: Request) {    
        //const playerTag = 'R89UG2G';
        const { searchParams } = new URL(request.url);
        const playerTagRaw = searchParams.get('playerTag');

        if (!playerTagRaw) {
            return new Response(JSON.stringify({ error: "Il parametro 'playerTag' è obbligatorio." }), { status: 400 });
        }

        const playerTag = playerTagRaw.toUpperCase();
        console.log(playerTag);

        const url = `https://api.clashroyale.com/v1/players/${encodeURIComponent(`#${playerTag}`)}/battlelog`;
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;

        console.log(url);
    
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
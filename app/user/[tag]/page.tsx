"use client";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import Image from "next/image";
import {PlayerMatch} from "@/types/PlayerMatches";

export default function PlayerProfile() {
    const params = useParams();
    const [playerMatches, setPlayerMatches] = useState < PlayerMatch[] > ([]);
    const [tag, setTag] = useState < string | null > (null);
    const [loading, setLoading] = useState < boolean > (true); // ✅ Stato di caricamento
    
    useEffect(() => {
        if (params && typeof params.tag === "string") {
            setTag(params.tag);
        }
        
    }, [params]);


    const retrievePlayerMatches = async () => {
        if (!tag) 
            return;
        
        try {
            setLoading(true);
            const response = await fetch(`/api/v1/getPlayerMatches?playerName=${tag}`);
            if (! response.ok) {
                throw new Error(`Errore API: ${
                    response.status
                } ${
                    response.statusText
                }`);
            }
            const data = await response.json();
            setPlayerMatches(data.data);
        } catch (error) {
            console.error("Errore nel recupero dei dati:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        retrievePlayerMatches();
    }, [tag]);
    
    return (
    <div className="w-full">
        <div className="h-96 w-full overflow-hidden ">
            <Image 
            layout="responsive"
            alt="cane!!"
            width={1}
            height={1}
            src="/banner1.jpg"/>

        </div>

        <div className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4 text-right">Matches</h2>
        {
        loading
            ? (<p className="text-xl font-semibold mb-4 text-right">Loading matches..</p> // ✅ Mostra un messaggio di caricamento
            )
            : playerMatches.length === 0
                ? (<p>No matches found.</p> // ✅ Gestisce il caso di nessun match
                )
                : (playerMatches.map((match, index) => (<div key={index}
                    className="bg-defaultBg2 shadow-md rounded-lg mb-2 w-1/2 ml-auto">
                    <div className="flex justify-between w-full"> {/* Nome del primo giocatore con "WIN" o "LOSE" */}
                        <div className="flex items-center gap-2 pl-3 pt-3">
                            <h3 className="text-lg font-bold"> {
                                match.team[0] ?. name
                            }</h3>
                            {
                            match.opponent[0] ?. trophyChange > 0
                                ? (<h3 className="text-lg font-bold text-green-500">WIN</h3>)
                                : (<h3 className="text-lg font-bold text-red-500">LOSE</h3>)
                        } </div>
                        {/* Nome dell'avversario con "WIN" o "LOSE" */}
                        <div className="flex items-center gap-2 pr-3 pt-3"> {
                            match.opponent[0] ?. trophyChange > 0
                                ? (<h3 className="text-lg font-bold text-red-500">LOSE</h3>)
                                : (<h3 className="text-lg font-bold text-green-500">WIN</h3>)
                        }
                            <h3 className="text-lg font-bold"> {
                                match.opponent[0] ?. name
                            }</h3>
                        </div>
                    </div>
                    {/* <p className="text-sm text-gray-600">{match.arena?.name || "Sconosciuta"}</p> */}
                    {/* <p className="text-sm text-gray-600">Modalità: {match.gameMode?.name || "Sconosciuta"}1</p> */}
                    <div className="mt-0 grid grid-cols-4 m-0 p-0"> {
                        match.team[0] ?. cards ?. map((card) => (<div key={
                                card.id
                            }
                            className="flex flex-col items-center">
                            <Image width={90}
                                height={90}
                                src={
                                    card.iconUrls.medium
                                }
                                alt={
                                    card.name
                                }
                                className="w-12 h-16"/>
                        </div>))
                    } </div>
                </div>)))
    } </div>);

      </div>
    )
    return (
        <div className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4 text-right">Matches</h2>
        {
        loading
            ? (<p className="text-xl font-semibold mb-4 text-right">Loading matches..</p> // ✅ Mostra un messaggio di caricamento
            )
            : playerMatches.length === 0
                ? (<p>No matches found.</p> // ✅ Gestisce il caso di nessun match
                )
                : (playerMatches.map((match, index) => (<div key={index}
                    className="bg-defaultBg2 shadow-md rounded-lg mb-2 w-1/2 ml-auto">
                    <div className="flex justify-between w-full"> {/* Nome del primo giocatore con "WIN" o "LOSE" */}
                        <div className="flex items-center gap-2 pl-3 pt-3">
                            <h3 className="text-lg font-bold"> {
                                match.team[0] ?. name
                            }</h3>
                            {
                            match.opponent[0] ?. trophyChange > 0
                                ? (<h3 className="text-lg font-bold text-green-500">WIN</h3>)
                                : (<h3 className="text-lg font-bold text-red-500">LOSE</h3>)
                        } </div>
                        {/* Nome dell'avversario con "WIN" o "LOSE" */}
                        <div className="flex items-center gap-2 pr-3 pt-3"> {
                            match.opponent[0] ?. trophyChange > 0
                                ? (<h3 className="text-lg font-bold text-red-500">LOSE</h3>)
                                : (<h3 className="text-lg font-bold text-green-500">WIN</h3>)
                        }
                            <h3 className="text-lg font-bold"> {
                                match.opponent[0] ?. name
                            }</h3>
                        </div>
                    </div>
                    {/* <p className="text-sm text-gray-600">{match.arena?.name || "Sconosciuta"}</p> */}
                    {/* <p className="text-sm text-gray-600">Modalità: {match.gameMode?.name || "Sconosciuta"}1</p> */}
                    <div className="mt-0 grid grid-cols-4 m-0 p-0"> {
                        match.team[0] ?. cards ?. map((card) => (<div key={
                                card.id
                            }
                            className="flex flex-col items-center">
                            <Image width={90}
                                height={90}
                                src={
                                    card.iconUrls.medium
                                }
                                alt={
                                    card.name
                                }
                                className="w-12 h-16"/>
                        </div>))
                    } </div>
                </div>)))
    } </div>);
}
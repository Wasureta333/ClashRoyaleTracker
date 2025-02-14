"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { PlayerMatch } from "@/types/PlayerMatches";

export default function PlayerProfile() {
  const params = useParams();
  const [playerMatches, setPlayerMatches] = useState<PlayerMatch[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // ✅ Stato di caricamento
  const tag = 'R89UG2G';

  useEffect(() => {
    if (params && typeof params.username === "string") {
      setUsername(params.username);
    }
  }, [params]);

  const retrievePlayerMatches = async () => {
    if (!username) return;
  
    try {
      setLoading(true);
  
      const response = await fetch(`/api/v1/getPlayerMatches?playerName=${tag}`);
      if (!response.ok) {
        throw new Error(`Errore API: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(fetch);
      console.log({tag});
      console.log("Risposta API:", data); // ✅ DEBUG: Logga la risposta
  
      if (Array.isArray(data)) {
        setPlayerMatches(data);
      } else if (data.data && Array.isArray(data.data)) {
        console.log("Dati trovati dentro 'data':", data.data);
        setPlayerMatches(data.data);
      } else {
        console.error("Formato risposta API non valido:", data);
      }
    } catch (error) {
      console.error("Errore nel recupero dei dati:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      retrievePlayerMatches();
    }
  }, [username]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Partite di {username || "Caricamento..."}</h2>

      {loading ? (
        <p>Caricamento partite...</p> // ✅ Mostra un messaggio di caricamento
      ) : playerMatches.length === 0 ? (
        <p>Nessuna partita trovata.</p> // ✅ Gestisce il caso di nessun match
      ) : (
        playerMatches.map((match, index) => (
          <div key={index} className="bg-white shadow-md p-4 rounded-lg mb-4">
            <h3 className="text-lg font-bold">
              {match.team[0]?.name} vs {match.opponent[0]?.name}
            </h3>
            <p className="text-sm text-gray-600">Arena: {match.arena?.name || "Sconosciuta"}</p>
            <p className="text-sm text-gray-600">Modalità: {match.gameMode?.name || "Sconosciuta"}</p>

            <div className="mt-2 grid grid-cols-4 gap-2">
              {match.team[0]?.cards?.map((card) => (
                <div key={card.id} className="flex flex-col items-center">
                  <img src={card.iconUrls.medium} alt={card.name} className="w-12 h-12" />
                  <span className="text-xs">{card.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

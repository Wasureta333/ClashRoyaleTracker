"use client"
import * as React from "react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion" // Importing Framer Motion
import Image from "next/image"
import { PlayerMatch } from "@/types/PlayerMatches"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PlayerProfile() {
  const params = useParams();
  const [playerMatches, setPlayerMatches] = useState<PlayerMatch[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<PlayerMatch[]>([]);
  const [tag, setTag] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("all"); // State for filtering matches

  const getTimeAgo = (battleTime: string) => {
    const battleDate = new Date(
      Date.UTC(
        parseInt(battleTime.substring(0, 4)), // Anno
        parseInt(battleTime.substring(4, 6)) - 1, // Mese (JavaScript usa 0-based)
        parseInt(battleTime.substring(6, 8)), // Giorno
        parseInt(battleTime.substring(9, 11)), // Ora
        parseInt(battleTime.substring(11, 13)), // Minuti
        parseInt(battleTime.substring(13, 15)) // Secondi
      )
    );
  
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - battleDate.getTime()) / 1000);
    
    //fixare: se il match è stato giocato una settimana fa, viene mostrato "1 weeks ago" e non va bene
    if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} min ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} h ago`;
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    } else {
      return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    }
  };

  useEffect(() => {
    if (params && typeof params.tag === "string") {
      setTag(params.tag);
    }
  }, [params]);

  const retrievePlayerMatches = async () => {
    if (!tag) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/v1/getPlayerMatches?playerName=${tag}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setPlayerMatches(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retrievePlayerMatches();
  }, [tag]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredMatches([...playerMatches]);
    } else if (filter === "wins") {
      setFilteredMatches(playerMatches.filter(match => match.opponent[0]?.trophyChange > 0));
    } else if (filter === "losses") {
      setFilteredMatches(playerMatches.filter(match => match.team[0]?.trophyChange > 0));
    }
  }, [filter, playerMatches]);

  return (
    <div className="w-full">
      <div className="h-96 w-full overflow-hidden">
        <Image layout="responsive" alt="banner" width={1} height={1} src="/banner1.jpg" />
      </div>
      <div className="container mx-auto p-4 flex justify-center">
        <div className="w-2/5">Sidebar</div>
        <div className="w-3/5 bg-defaultBg h-full flex flex-col justify-center items-center">
          <div className="w-[98%] flex justify-between items-center">
            <Select onValueChange={(value) => setFilter(value)}>
              <SelectTrigger className="w-[180px] bg-defaultBg2 border-1 border-defaultBg mb-2 pr-4 pt-2">
                <SelectValue placeholder="Filter matches" />
              </SelectTrigger>
              <SelectContent className="bg-defaultBg2 border-1 border-defaultBg text-white">
                <SelectItem value="all">All matches</SelectItem>
                <SelectItem value="wins">Wins</SelectItem>
                <SelectItem value="losses">Losses</SelectItem>
              </SelectContent>
            </Select>
            <h2 className="text-xl font-semibold mb-2 ml-auto pr-4">Matches</h2>
          </div>
          {loading ? (
            <p className="text-xl font-semibold mb-4 text-right">Loading matches..</p>
          ) : filteredMatches.length === 0 ? (
            <p>No matches found.</p>
          ) : (
            filteredMatches.map((match, index) => (
              <motion.div
                key={index}
                className={`bg-defaultBg2 shadow-md rounded-lg mb-3 w-[98%] border-l-2 
                  ${match.opponent[0]?.trophyChange > 0 ? 'border-green-500' : 'border-red-500'} 
                  p-4`}
                whileHover={{ scale: 1.01, boxShadow: "0px 4px 10px rgba(0,0,0,0.15)" }} // Hover Effect
                transition={{ duration: 0.15 }} // Smooth Animation
              >
                <div className="flex justify-between w-full">
                  <div className="text-xs text-gray-400 text-right pl-3 pt-1">
                    {match.arena.name}
                  </div>
                  <div className="text-xs text-gray-400 text-right pr-3 pt-1">
                    {getTimeAgo(match.battleTime)}
                  </div>
                </div>

                <div className="flex justify-between w-full">
                  <div className="flex items-center gap-2 pl-3 pt-3 pb-2 max-h-0.5">
                    <h3 className="text-lg font-bold">{match.team[0]?.name}</h3>
                    {match.opponent[0]?.trophyChange > 0 ? (
                      <h3 className="text-lg font-bold text-green-500">WIN</h3>
                    ) : (
                      <h3 className="text-lg font-bold text-red-500">LOSE</h3>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pr-3 pt-3 pb-0 max-h-0.5">
                    {match.opponent[0]?.trophyChange > 0 ? (
                      <h3 className="text-lg font-bold text-red-500">LOSE</h3>
                    ) : (
                      <h3 className="text-lg font-bold text-green-500">WIN</h3>
                    )}
                    <h3 className="text-lg font-bold">{match.opponent[0]?.name}</h3>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="grid grid-cols-4 w-[35%]">
                    {match.team[0]?.cards?.map((card) => (
                      <div key={card.id} className="flex flex-col items-center">
                        <Image
                          width={90}
                          height={90}
                          src={card.iconUrls.medium}
                          alt={card.name}
                          className="w-12 h-16"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-0 grid grid-cols-4 w-[35%]">
                    {match.opponent[0]?.cards?.map((card) => (
                      <div key={card.id} className="flex flex-col items-center gap-0 space-x-0">
                        <Image
                          width={90}
                          height={90}
                          src={card.iconUrls.medium}
                          alt={card.name}
                          className="w-12 h-16"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

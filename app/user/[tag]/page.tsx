"use client"
import * as React from "react"
import { RefreshCcw } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion" // Importing Framer Motion
import Image from "next/image"
import { PlayerMatch } from "@/types/PlayerMatches"
import { PlayerData } from "@/types/PlayerData";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";


export default function PlayerProfile() {
  const params = useParams();
  const { toast } = useToast();
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [playerMatches, setPlayerMatches] = useState<PlayerMatch[]>([]);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [filteredMatches, setFilteredMatches] = useState<PlayerMatch[]>([]);
  const [tag, setTag] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("all"); // State for filtering matches

  const matchCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

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
  
    if (diffInSeconds < 10) {
      return "a few seconds ago"; // 🔥 Nuovo caso per meno di 10 secondi
    } else if (diffInSeconds < 60) {
      return `${diffInSeconds} sec ago`; // Mostra i secondi esatti
    } else if (diffInSeconds < 3600) {
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
      const response = await fetch(`/api/v1/getPlayerMatches?playerTag=${tag}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setPlayerMatches(data.data);
  
      // Supponiamo che il nome sia in data.data[0]?.team[0]?.name
      if (data.data.length > 0) {
        setPlayerName(data.data[0]?.team[0]?.name || "Unknown Player");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const retrievePlayerProfile = async () => {
    if (!tag) return;
  
    try {
      const response = await fetch(`/api/v1/getTagData?playerTag=${tag}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setPlayerData(data.data);
    } catch (error) {
      console.error("Error fetching player profile:", error);
    }
  };
  
  

  useEffect(() => {
    retrievePlayerMatches();
    retrievePlayerProfile();
  }, [tag]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredMatches([...playerMatches]);
    } else if (filter === "wins") {
      setFilteredMatches(playerMatches.filter(match => match.team[0]?.trophyChange > 0));
    } else if (filter === "losses") {
      setFilteredMatches(playerMatches.filter(match => match.opponent[0]?.trophyChange > 0));
    }
  }, [filter, playerMatches]);

  useEffect(() => {
    if (playerData) {
      console.log("Campi disponibili in playerData:", Object.keys(playerData));
    }
  }, [playerData]);
  

  console.log("Badges ricevuti:", playerData?.badges);
  console.log("Badges con icona:", playerData?.badges?.filter(badge => badge.iconUrls?.large));
  

  return (
    <div className="w-full ">
      <div className="w-full relative">
        <div className="h-96 w-full overflow-hidden">
          <Image layout="responsive" alt="banner" width={1} height={1} src="/banner1.png" />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-full flex items-end z-9 text-white p-4">
          <div className="w-full flex justify-between">
            <div className="font-bold text-7xl">
              {playerName ? playerName : <Skeleton className="w-48 h-12 bg-gray-700 rounded-md" />}
            </div>
            <Button 
              onClick={() => {
                retrievePlayerMatches();
                toast({
                  title: "Refresh",
                  description: "The profile has been updated.",
                  duration: 1500
                });
              }}
              disabled={loading}
              className="z-10 mt-6 bg-defaultBg2 border border-defaultBg" variant="outline" size="icon">
              
              <RefreshCcw />
            </Button>      
          </div>
        </div>
      </div>
      <div className="z-10 container mx-auto p-4 flex justify-center">
        <div className="w-2/5">
          <h2 className="text-xl font-semibold mb-2 ml-auto pr-4 pt-2">Profile info</h2>
          <div className="w-[98%] bg-defaultBg2 shadow-md rounded-lg mb-3">
            <Carousel>
              <CarouselContent>
                {playerData?.badges && playerData.badges.length > 0 ? (
                  playerData.badges
                    .filter(badge => badge.iconUrls?.large)
                    .map((badge, index) => (
                      <CarouselItem key={`badge-${index}`} className="sm:basis-1/2 md:basis-1/5 lg:basis-1/5">

                        <div className="flex flex-col items-center">
                          <Image 
                            width={64} 
                            height={64} 
                            src={badge.iconUrls!.large} 
                            alt={badge.name} 
                            style={{ userSelect: "none", pointerEvents: "none"}}
                            className="w-16 h-16 rounded-md"
                          />
                          {/* <p className="text-sm mt-2 text-center" style={{userSelect: "none"}}>{badge.name}</p> */}
                        </div>
                      </CarouselItem>
                    ))
                ) : (
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                    <p>No badges available</p>
                  </CarouselItem>
                )}
              </CarouselContent>     {/* ❌ Rimuovi questa riga */}
            </Carousel>
          </div>
        </div>
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
                custom={index}
                variants={matchCardVariants}
                initial="hidden"
                animate="visible"
                className={`bg-defaultBg2 shadow-md rounded-lg mb-3 w-[98%] border-l-2 
                  ${match.opponent[0]?.trophyChange > 0 ? 'border-red-500' : 'border-green-500'} 
                  p-4`}
                whileHover={{ scale: 1.01, boxShadow: "0px 4px 10px rgba(0,0,0,0.15)" }} // Hover Effect
                transition={{ duration: 0.15 }} // Smooth Animation
              >
                <div className="flex justify-between w-full">
                  <div className="text-xs text-gray-400 text-right pl-3 pt-1">
                    {'League ' + match.leagueNumber}
                  </div>
                  <div className="text-xs text-gray-400 text-right pr-3 pt-1 cursor-pointer"
                    onMouseEnter={(e) => e.currentTarget.innerText = new Intl.DateTimeFormat('it-IT', { 
                      year: 'numeric', month: '2-digit', day: '2-digit', 
                      hour: '2-digit', minute: '2-digit'
                    }).format(new Date(
                      Date.UTC(
                        parseInt(match.battleTime.substring(0, 4)),  
                        parseInt(match.battleTime.substring(4, 6)) - 1,  
                        parseInt(match.battleTime.substring(6, 8)),  
                        parseInt(match.battleTime.substring(9, 11)), 
                        parseInt(match.battleTime.substring(11, 13))
                      )
                    ))}
                    onMouseLeave={(e) => e.currentTarget.innerText = getTimeAgo(match.battleTime)}>
                    {getTimeAgo(match.battleTime)}
                  </div>
                </div>

                <div className="flex justify-between w-full">
                  <div className="flex items-center gap-2 pl-3 pt-3 pb-2 max-h-0.5">
                    <h3 className="text-lg font-bold">{match.team[0]?.name}</h3>
                    {match.team[0]?.trophyChange > 0 ? (
                      <h3 className="text-lg font-bold text-green-500">WIN</h3>
                    ) : (
                      <h3 className="text-lg font-bold text-red-500">LOSE</h3>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pr-3 pt-3 pb-0 max-h-0.5">
                    {match.opponent[0]?.trophyChange == null ? (
                      <h3 className="text-lg font-bold text-red-500">LOSE</h3>
                    ) : (
                      <h3 className="text-lg font-bold text-green-500">WIN</h3>
                    )}

                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Link href={playerData?.name ? `/user/${decodeURIComponent(match.opponent[0].tag.replace(/^#/, ''))}` : "#"} passHref>
                          <h3 className="text-lg font-bold cursor-pointer">
                            {match.opponent[0]?.name}
                          </h3>
                        </Link>
                      </HoverCardTrigger>
                      <HoverCardContent className="p-4 bg-defaultBg shadow-lg rounded-lg w-80 border-2 border-mainColor">
                        <div className="flex justify-between items-start">
                            <p className="text-lg font-semibold text-white">Rank: <span className="font-normal">502</span></p>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Current Trophies</p>
                                <div className="flex items-center justify-end gap-2">
                                  <p className="text-2xl font-bold text-white">2839</p>
                <                 Image src="/league10.png" alt="League Icon" className="w-6 h-6" width={1} height={1}/>
                                </div>
                                <hr className="my-1 border-white"/>
                                <div className="flex items-center justify-end gap-2">
                                  <p className="text-2xl font-bold text-white">3020</p>
                                  <Image src="/league10.png" alt="League Icon" className="w-6 h-6" width={1} height={1}/>
                                </div>
                                <p className="text-sm text-gray-500">Best Finish</p>
                            </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
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

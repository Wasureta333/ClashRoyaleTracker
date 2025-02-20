"use client"
// #region imports
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
// #endregion
export default function PlayerProfile() {
  // #region constants
  const [allTimeStats, setAllTimeStats] = useState<{ total: number; wins: number; losses: number; winrate: number } | null>(null);
  const params = useParams();
  const { toast } = useToast();
  const tabs = ["ALL TIME", "LAST GAMES", "THIS SEASON"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [bannerSrc, setBannerSrc] = useState("/banner1.png"); // state for storing the banner image source
  const [playerData, setPlayerData] = useState<PlayerData | null>(null); // state for storing the player data
  const [playerMatches, setPlayerMatches] = useState<PlayerMatch[]>([]); // state for storing the player matches
  const [playerName, setPlayerName] = useState<string | null>(null); // state for storing the player name
  const [matchTypeFilter, setMatchTypeFilter] = useState<string>("all"); // state for storing the match type filter
  const [filteredMatches, setFilteredMatches] = useState<PlayerMatch[]>([]); // state for storing the filtered matches
  const [tag, setTag] = useState<string | null>(null); // State for storing the player tag
  const [loading, setLoading] = useState<boolean>(true); // state for loading the player data
  const [filter, setFilter] = useState<string>("all"); // State for filtering matches
  const [refreshDisabled, setRefreshDisabled] = useState<boolean>(false); // State for blocking the refresh button
  // #endregion

  // #region functions
  const handleRefresh = async () => {
    if (refreshDisabled) return;
  
    setRefreshDisabled(true);
    toast({
      title: "Refreshing..",
      description: "The profile is being refreshed...",
      duration: 3000,
      className: "top-right-toast", // Per gestire lo stile e la posizione
    });
  
    await retrievePlayerMatches();
    await retrievePlayerProfile();
  
    toast({
      title: "Refresh Completed",
      description: "The profile has been updated.",
      duration: 3000,
      className: "top-right-toast",
    });
  
    setTimeout(() => setRefreshDisabled(false), 12000);
  };
  
  //function which fluidly loads the matches of the player from the API.
  const matchCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  //function to calculate how much time ago the match was played. This function uses the battle time provided by the API.
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

  //function to retrieve player data from the API.
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

  //function to retrieve player matches from the API.
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

  //function to retrieve all time stats from the DB
  const retrieveAllTimeStats = async () => {
    if (!tag) return;
  
    try {
      const response = await fetch(`/api/v1/getAllTimeStats?playerTag=${tag}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setAllTimeStats(data); 
    } catch (error) {
      console.error("Error fetching all-time stats:", error);
    }
  };
  
  // #endregion

  // #region effects
  useEffect(() => {
    if (params && typeof params.tag === "string") {
      setTag(params.tag);
    }
  }, [params]);

  // Function which randomizes the banner each time the page loads.
  useEffect(() => {
    const banners = ["/banner1.png", "/banner5.jpg", "/banner7.jpeg", "/banner3.jpg"];
    const randomBanner = banners[Math.floor(Math.random() * banners.length)];
    setBannerSrc(randomBanner);
    console.log(setBannerSrc)
  }, []);
  
  useEffect(() => {
    retrievePlayerMatches();
    retrievePlayerProfile();
    retrieveAllTimeStats();
  }, [tag]);

  useEffect(() => {
    let matches = [...playerMatches];
  
    if (filter !== "all") {
      matches = matches.filter(match => 
        (filter === "wins" && match.team[0]?.crowns > match.opponent[0]?.crowns) ||
        (filter === "losses" && match.team[0]?.crowns < match.opponent[0]?.crowns)
      );
    }
  
    if (matchTypeFilter !== "all") {
      matches = matches.filter(match => match.type === matchTypeFilter);
    }
  
    setFilteredMatches(matches);
  }, [filter, matchTypeFilter, playerMatches]);
  // #endregion
  
  return (
    <div className="w-full ">
      <div className="w-full relative">
        <div className="h-96 w-full overflow-hidden">
          <Image layout="responsive" alt="banner" width={1} height={1} src={bannerSrc}/>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-full flex items-end z-9 text-white p-4">
          <div className="w-full flex justify-between">
            <div className="font-bold text-7xl">
              {playerName ? playerName : <Skeleton className="w-48 h-12 bg-gray-700 rounded-md" />}
            </div>
            <Button
                onClick={handleRefresh}
                disabled={loading || refreshDisabled} // 🔒 Disabilita se loading o refresh bloccato
                className={`z-10 mt-6 bg-defaultBg2 border border-defaultBg ${
                  refreshDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                variant="outline"
                size="icon">
              <RefreshCcw />
            </Button>   
          </div>
        </div>
      </div>
      <div className="z-10 container mx-auto p-4 flex justify-center">
        <div className="w-2/5">
          <h2 className="text-xl font-semibold mb-2 ml-auto pr-4 pt-2">Profile info</h2>
          <div className="w-[98%] bg-defaultBg2 shadow-md rounded-lg mb-3">
          <div className="relative flex ">
        {tabs.map((tab) => (
          <button
          key={tab}
          onClick={() => {
            setActiveTab(tab);
            if (tab === "ALL TIME") retrieveAllTimeStats(); // 🔥 Recupera dati quando clicchi su ALL TIME
          }}
          className={`relative px-4 py-2 text-lg transition-colors duration-300 focus:outline-none ${
            activeTab === tab ? "text-defaultWhite text-sm font-bold" : "text-gray-400 text-sm font-bold hover:text-defaultWhite"
          }`}
        >
          {tab}
          {activeTab === tab && (
            <motion.div
              layoutId="underline"
              className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#EF4444]"
              transition={{ type: "spring", duration: 0.2, ease: "easeInOut" }}
            />
          )}
        </button>
        
        ))}
          </div>
      <motion.div layout transition={{ type: "spring", stiffness: 300, damping: 30 }}>
        <div className="p-5 text-left text-gray-700 bg-defaultBg2 rounded-b-lg shadow">
        <h2 className="text-xl font-semibold">{activeTab} Content</h2>
        <div className="p-5 text-left text-gray-700 bg-defaultBg2 rounded-b-lg shadow">
          {activeTab === "ALL TIME" ? (
            allTimeStats ? (
              <div>
                <h2 className="text-xl font-semibold mb-3">All Time Statistics</h2>
                <p>Total Matches: <strong>{allTimeStats.total}</strong></p>
                <p>Wins: <strong>{allTimeStats.wins}</strong></p>
                <p>Losses: <strong>{allTimeStats.losses}</strong></p>
                <p>Winrate: <strong>{allTimeStats.winrate.toFixed(2)}%</strong></p>
              </div>
            ) : (
              <p>Loading all-time statistics...</p>
            )
          ) : (
            <p className="mt-2">Qui va il contenuto per <strong>{activeTab}</strong>.</p>
          )}
        </div>
        </div>
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
      </motion.div>
      
      </div>
    </div> 
        <div className="w-3/5 bg-defaultBg h-full flex flex-col justify-center items-center">
          <div className="w-[98%] flex justify-between items-center gap-2">
            <Select onValueChange={(value) => {
              console.log("Selected match type:", value); // 🔥 Log veloce qui
              setMatchTypeFilter(value);}}>
              <SelectTrigger className="w-[180px] bg-defaultBg2 border-1 border-defaultBg mb-2 pr-4 pt-2">
                <SelectValue placeholder="Filter match type" />
              </SelectTrigger>
              <SelectContent className="bg-defaultBg2 border-1 border-defaultBg text-white">
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="pathOfLegend">Path of Legends</SelectItem>
                <SelectItem value="Tournament">Tournament</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="ladder">Ladder</SelectItem>
              </SelectContent>
            </Select>
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
            <p className="text-xl font-semibold mb-4 text-left">Loading matches..</p>
          ) : filteredMatches.length === 0 ? (
            <p className="pt-4 text-left">No matches found.</p>
          ) : (
            filteredMatches.map((match, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={matchCardVariants}
                initial="hidden"
                animate="visible"
                className={`bg-defaultBg2 shadow-md rounded-lg mb-3 w-[98%] border-l-2 
                  ${match.team[0]?.crowns < match.opponent[0]?.crowns ? 'border-red-500' : 'border-green-500'} 
                  p-4`}
                whileHover={{ scale: 1.01, boxShadow: "0px 4px 10px rgba(0,0,0,0.15)" }} // Hover Effect
                transition={{ duration: 0.15 }} // Smooth Animation
              >
                <div className="flex justify-between w-full">
                  <div className="text-xs text-gray-400 text-right pl-3 pt-1">
                    {match.leagueNumber === 10 ? 'Legendary Arena' : 'League ' + match.leagueNumber}
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
                    {match.team[0]?.crowns > match.opponent[0]?.crowns ? (
                      <h3 className="text-lg font-bold text-green-500">WIN</h3>
                    ) : (
                      <h3 className="text-lg font-bold text-red-500">LOSE</h3>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pr-3 pt-3 pb-0 max-h-0.5">
                    {match.team[0]?.crowns < match.opponent[0]?.crowns ? (
                      <h3 className="text-lg font-bold text-green-500">WIN</h3>
                    ) : (
                      <h3 className="text-lg font-bold text-red-500">LOSE</h3>
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

                <div className="flex justify-between pt-1">
                  <div className="grid grid-cols-4 w-[35%]">
                    {match.team[0]?.cards?.map((card) => (
                      <div key={card.id} className="flex flex-col items-center">
                        <Link href={card.name ? { pathname: `/card/${encodeURIComponent(card.name)}`, query: {
                              imageUrl: card.evolutionLevel === 1
                              ? card.iconUrls.evolutionMedium
                              : card.iconUrls.medium,},}   : "#"}>
                          <Image
                            width={90}
                            height={90}
                            src={card.evolutionLevel? card.iconUrls.evolutionMedium || card.iconUrls.medium : card.iconUrls.medium}
                            alt={card.name}
                            className="w-12 h-16"/>
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Image src="https://cdn.royaleapi.com/static/img/ui/crown-blue.png?t=5fe83973c" alt="" className="w-6 h-6 pt-1.5" width={128} height={128}/>
                    <div className="text-2xl font-bold px-2"> {match.team[0].crowns + ' - ' + match.opponent[0].crowns} </div>
                    <Image src="https://cdn.royaleapi.com/static/img/ui/crown-red.png?t=5fe83973c" alt="" className="w-6 h-6 pt-1.5" width={128} height={128}/>
                  </div>
                  <div className="mt-0 grid grid-cols-4 w-[35%]">
                    {match.opponent[0]?.cards?.map((card) => (
                      <div key={card.id} className="flex flex-col items-center gap-0 space-x-0">
                         <Link href={card.name ? { pathname: `/card/${encodeURIComponent(card.name)}`, query: {
                              imageUrl: card.evolutionLevel === 1
                              ? card.iconUrls.evolutionMedium
                              : card.iconUrls.medium,},}   : "#"}>
                          <Image
                            width={90}
                            height={90}
                            src={card.evolutionLevel? card.iconUrls.evolutionMedium || card.iconUrls.medium : card.iconUrls.medium}
                            alt={card.name}
                            className="w-12 h-16"/>
                        </Link>
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

"use client";

import Link from "next/link";
import * as motion from "motion/react-client"
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input" 
import { Button } from "@/components/ui/button";
import { PlayerData } from "@/types/PlayerData";


export function Navbar() {
    const [tag, setTag] = useState("");
    const [playerData, setPlayerData] = useState<PlayerData|null>(null);
    const [apiSuccess, setApiSuccess] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [finalTag, setFinalTag] = useState<string | null>(null);


    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTag = e.target.value.toUpperCase();
        setTag(newTag);
    
        try {
            let updatedTag = newTag;
        
            // 🔎 Se l'utente inserisce un nome anziché un tag
            if (isNaN(Number(newTag))) {
                const response = await fetch(`/api/v1/searchProfiles?playerName=${newTag}`);
                if (response.ok) {
                    const data = await response.json();
                    updatedTag = data.player_tag; // 🎯 Usa il tag trovato
                    setFinalTag(updatedTag);      // ✅ Salva finalTag nello stato
                } else {
                    console.error("Nessun profilo trovato per il nome:", newTag);
                    setApiSuccess(false);
                    return;
                }
            } else {
                setFinalTag(updatedTag);          // ✅ Se è già un tag, salvalo comunque
            }
        
            // 🔗 Ora esegue la chiamata con il player_tag corretto
            const response = await fetch(`/api/v1/getTagData?playerTag=${updatedTag}`);
            if (response.ok) {
                const dataPlayer = await response.json();
                setPlayerData(dataPlayer.data);
                setApiSuccess(true);
            } else {
                setApiSuccess(false);
            }
        } catch (error) {
            console.error("Errore durante il recupero del profilo:", error);
            setApiSuccess(false);
        }
        
    };
    

    const handleDialogClose = (isOpen: boolean) => {
        setIsDialogOpen(isOpen);
        if (!isOpen) {
            setTag(""); // Resetta l'input
            setApiSuccess(false); // Nasconde il pulsante
        }
    };

    const retrievePlayerData = async () => {
        try {
          const response = await fetch(`/api/v1/getTagData?playerTag=${tag}`);
    
          if (!response.ok) {
            throw new Error(`Errore API: ${response.status} ${response.statusText}`);
          }
    
          const dataPlayer = await response.json();
          setPlayerData(dataPlayer.data);
          setApiSuccess(true);

          
        } catch (error) {
          console.error("Errore nella richiesta API:", error);
          setPlayerData(null);
          setApiSuccess(false);
        }
    };

    useEffect(() => {
        if (tag.length > 6) {
            retrievePlayerData()
        } else {
            setApiSuccess(false);
        }
      }, [tag]);

    return(
        <div className="absolute top-0 w-full flex justify-center z-10">
            <div className="w-4/5 p-4 flex justify-between">
                <div className="w-1/2">
                    <Link href="/">
                        <span className="text-2xl font-semibold text-mainColor">
                            Royale Tracker
                        </span>
                    </Link>
                </div>

                <div className="w-1/2 flex justify-end">
                <Link href="" className="pr-8 pt-1 text-white md:hover:text-mainColor transition-all">
                    Profile
                </Link>
                <Link href="" className="pr-8 pt-1 text-white md:hover:text-mainColor transition-all">
                    Clans
                </Link>
                <Link href="" className="pr-8 pt-1 text-white md:hover:text-mainColor transition-all">
                    Decks
                </Link>
                <Link href="" className="pr-8 pt-1 text-white md:hover:text-mainColor transition-all">
                    Cards
                </Link>
                <Dialog open={isDialogOpen} onOpenChange={handleDialogClose} >
                    <DialogTrigger className="text-white md:hover:text-mainColor transition-all ">
                        Search
                    </DialogTrigger>

                    <DialogContent className="bg-defaultBg -mt-64 max-w-[450px]">
                        <DialogHeader>
                            <DialogTitle className="text-left">Search a Player</DialogTitle>
                            <DialogDescription className="text-left pt-3">
                                Insert the tag of the player you are looking for.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="w-full border-t border-separator border-[0.02rem]"></div>
                        <div className="relative w-full">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">#</div>
                            <Input
                                type="text"
                                value={tag}
                                maxLength={9}
                                onChange={handleChange}
                                placeholder="Insert a TAG..."
                                className="pl-8"/>
                        </div>
                        {apiSuccess && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 1, scale: 0.8 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                whileHover={{ scale: 1.015 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full">
                            <Link 
                                href={finalTag ? `/user/${encodeURIComponent(finalTag)}` : `/user/${encodeURIComponent(tag)}`} 
                                passHref 
                                onClick={() => handleDialogClose(false)}>
                            <Button className="mt-0 w-full h-14 text-white flex justify-between items-center px-4 shadow-none hover:shadow-md transition-all">
                                {/* Sinistra: Nome e Livello */}
                                <div className="text-left space-x-2">
                                    <span className="font-bold">{playerData?.name || "Unknown"}</span>{" "}
                                    <span className="text-xs text-white/30">Level {playerData?.expLevel || "N/A"}</span>
                                </div>

                                {/* Destra: Trofei e Win Rate */}
                                <div className="text-right">
                                    <span className="font-semibold">{playerData?.trophies || 0} 🏆</span>{" "}
                                    {/* <span className="text-sm">
                                    WR: {((playerData?.wins || 0) / ((playerData?.wins || 0) + (playerData?.losses || 0)) * 100 || 0).toFixed(2)}%
                                    </span> */}
                                </div>
                            </Button>
                            </Link>    
                        </motion.div>
                        )}
                    </DialogContent>
                </Dialog>
                </div>
            </div>
        </div>)
}
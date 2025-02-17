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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTag = e.target.value.toUpperCase();
        setTag(newTag);
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
            
                <Link href="/">
                    <span className="text-2xl font-semibold text-mainColor">
                        Royale Tracker
                    </span>
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
                                maxLength={8}
                                onChange={handleChange}
                                placeholder="Insert a TAG..."
                                className="pl-8"
                            />
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
                            <Link href={playerData ? `/user/${encodeURIComponent(tag)}` : "#"} passHref onClick={() => handleDialogClose(false)}>
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
                        {!apiSuccess && (
                            <div className="text-right">
                                    <span className="font-semibold">R89UG2G</span>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

        </div>)
    
    return (
            <div className="absolute z-1 max-w-screen-xl flex flex-wrap items-center justify-between p-4 bg-white w-full">
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-mainColor">
                        Royale Tracker
                    </span>
                </Link>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-l md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                                <DialogTrigger className="block py-2 px-3 text-red-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-mainColor md:p-0">
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
                                            maxLength={8}
                                            onChange={handleChange}
                                            placeholder="Insert a TAG..."
                                            className="pl-8"
                                        />
                                    </div>
                                    {apiSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 1, scale: 0.8 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full">
                                        <Link href={playerData ? `/user/${encodeURIComponent(playerData.name)}` : "#"} passHref onClick={() => handleDialogClose(false)}>
                                        <Button className="mt-0 w-full bg-gray-500 h-14 text-white flex justify-between items-center px-4">
                                            {/* Sinistra: Nome e Livello */}
                                            <div className="text-left">
                                                <span className="font-bold">{playerData?.name || "Unknown"}</span>{" "}
                                                <span className="text-sm">lv. {playerData?.expLevel || "N/A"}</span>
                                            </div>

                                            {/* Destra: Trofei e Win Rate */}
                                            <div className="text-right">
                                                <span className="font-semibold">{playerData?.trophies || 0} 🏆</span>{" "}
                                                <span className="text-sm">
                                                WR: {((playerData?.wins || 0) / ((playerData?.wins || 0) + (playerData?.losses || 0)) * 100 || 0).toFixed(2)}%
                                                </span>
                                            </div>
                                        </Button>
                                        </Link>    
                                    </motion.div>
                                    )}
                                    {!apiSuccess && (
                                        <div className="text-right">
                                                <span className="font-semibold">R89UG2G</span>
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </li>
                    </ul>
                </div>
            </div>
    );
}
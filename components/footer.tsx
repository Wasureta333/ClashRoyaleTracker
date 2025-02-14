//aggiungere i md appropriati
//TODO: funzione handleCookieSaves per salvare le preferenze utente (aggiungere onhandle)

"use client";

import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"


export function Footer(){

    return(<footer className="w-full">
            <div className="flex justify-center" id="footer-default">
                <ul className="font-medium p-4 mt-4 rounded-l rtl:space-x-reverse flex flex-row">
                    <li>
                        <Link href={"/"} className="text-defaultWhite rounded-sm hover:text-mainColor mx-32"> Contact Us </Link>
                    </li>
                    <li>
                        <Link href={"/"} className="text-defaultWhite rounded-sm hover:text-mainColor mx-32"> Privacy Policy </Link>
                    </li>
                    <li>
                    <Dialog>
                        <DialogTrigger className="text-defaultWhite rounded-sm hover:text-mainColor mx-32">Cookies Settings</DialogTrigger>
                            <DialogContent className="bg-defaultBg -mt-64">
                                <DialogHeader>
                                    <DialogTitle className="text-left">Privacy Settings</DialogTitle>
                                    <DialogDescription className="text-left pt-3">
                                        manage your privacy settings below
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="sm:justify-start flex flex-row">
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">
                                        Save and exit
                                        </Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">
                                        Accept all
                                        </Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">
                                        Decline all
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </li>
                </ul>
            </div>
        
        </footer>
    )
}
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

    return(<footer className="md:w-full">
            <div className="md:flex" id="footer-container">
                <div className="md:flex w-1/2">
                <ul className="font-medium flex md:pl-[21.00%]">
                    <li>
                        <Link href={"/"} className="text-defaultWhite text-sm rounded-sm hover:text-mainColor mr-6"> Contact Us </Link>
                    </li>
                    <li>
                        <Link href={"/"} className="text-defaultWhite text-sm rounded-sm hover:text-mainColor mr-6"> Privacy Policy </Link>
                    </li>
                    <li>
                    <Dialog>
                        <DialogTrigger className="text-defaultWhite text-sm rounded-sm hover:text-mainColor mr-6">Cookies Settings</DialogTrigger>
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
                <div className="md:flex pt-1 w-1/2">
                        <p className="text-xs text-right w-full md:pr-[21.00%]">&copy; royalestracker.com is not affiliated with or endorsed by Supercell.</p>
                </div>
            </div>
        </footer>
    )
}

"use client";
import * as React from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function CardPage() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl") || "/card-image.png"; // Recupera l'URL passato come parametro

  return (
    <div className="w-full ">
      <div className="w-full relative">
        <div className="h-80 w-full overflow-hidden">
          <Image layout="responsive" alt="banner" width={1} height={1} src="/banner1.png" />
        </div>
        {/* Immagine posizionata a metà tra il banner e il div sottostante */}
        <div className="absolute left-16 bottom-0 transform translate-y-1/4 w-40 h-40 z-10">
          <Image
            src={imageUrl} // Usa l'URL passato come parametro
            alt="Card Icon"
            width={160}
            height={160}
            className="rounded-xl shadow-lg"
          />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-full flex items-end z-9 text-white p-4">
          <div className="w-full flex justify-between">
            <div className="font-bold text-7xl">Nome della Carta</div>
          </div>
        </div>
      </div>
    </div>
  );
}
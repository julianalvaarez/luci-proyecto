"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, Calendar, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["plan a medida", "mejor futuro", "cambio real", "seguimiento", "apoyo"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <span className="gap-4 bg-emerald-100/90 py-2 px-4 rounded-full backdrop-blur-sm border border-emerald-200 text-emerald-800 font-bold hover:bg-emerald-200/90">
              Reserva tu turno online en segundos
            </span>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-display font-bold text-gray-900 leading-[1.1]">
              <span className="block">Tu salud merece un</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1 h-[1.2em]">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-brand-primary"
                    initial={{ opacity: 0, y: "-100%" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                          y: 0,
                          opacity: 1,
                        }
                        : {
                          y: titleNumber > index ? "-150%" : "150%",
                          opacity: 0,
                        }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-gray-700 max-w-2xl text-center font-medium">
              Agenda tu consulta nutricional de forma simple y rápida.
              Modalidad online o presencial en Wilde, Avellaneda.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="gap-4 bg-brand-primary hover:bg-brand-secondary text-white rounded-full h-14 px-10 text-base font-bold transition-all hover:scale-105 active:scale-95" asChild>
              <Link href="/booking">
                Agendar Turno <Calendar className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" className="gap-4 border border-gray-200 bg-white/80 backdrop-blur-md rounded-full h-14 px-10 text-base font-bold transition-all hover:scale-105" variant="outline" asChild>
              <Link href="#services">
                Ver Servicios <MoveRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };

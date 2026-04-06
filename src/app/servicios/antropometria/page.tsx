import Link from 'next/link';
import { ArrowLeft, Calendar, Dumbbell, TrendingUp } from 'lucide-react';
import { Heart } from 'lucide-react';

export default function AntropometriaPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header / Navbar */}
      <header className="flex items-center p-4 bg-white z-10 sticky top-0 border-b border-gray-100">
        <Link href="/" className="text-brand-primary p-2">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">Servicios Especializados</h1>
      </header>

      {/* Hero Section */}
      <section
        className="relative h-64 md:h-80 w-full bg-cover bg-center flex flex-col justify-end p-6"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="relative z-10 text-white">
          <span className="inline-block bg-brand-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
            NUTRICIÓN DEPORTIVA
          </span>
          <h2 className="text-3xl font-display font-bold">Antropometría ISAK</h2>
        </div>
      </section>

      <main className="flex-1 px-4 max-w-lg lg:max-w-5xl mx-auto w-full pb-24 lg:pb-32">
        {/* Pricing Card */}
        <div className="bg-emerald-50 rounded-2xl p-5 mt-8 mb-8 border border-emerald-100 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-xs text-brand-primary uppercase font-bold tracking-wide">INVERSIÓN POR SESIÓN</p>
            <p className="text-3xl font-bold text-brand-primary mt-1">$50.000</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Duración estimada</p>
            <p className="text-sm font-bold mt-1">60 minutos</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="lg:flex lg:gap-12 mt-8">
          {/* Left Column */}
          <div className="lg:flex-[3]">
            {/* Description */}
            <p className="text-gray-600 mb-8 leading-relaxed text-[15px] lg:text-base">
              La antropometría es un estudio integral de la composición corporal que permite cuantificar con precisión el tejido adiposo, muscular, óseo y residual. Es la herramienta definitiva para quienes buscan llevar su rendimiento físico al siguiente nivel.
            </p>

            {/* Why this study */}
            <h3 className="text-xl font-bold mb-4">¿Por qué realizar este estudio?</h3>
            <div className="space-y-4 mb-8">
              <div className="bg-white p-5 rounded-2xl flex gap-4 shadow-sm border border-gray-100">
                <div className="bg-emerald-50 p-3 rounded-xl h-fit text-brand-primary">
                  <Dumbbell className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Precisión Deportiva</h4>
                  <p className="text-sm text-gray-500">Indispensable para atletas que necesitan ajustar su peso y porcentaje de grasa según su disciplina.</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl flex gap-4 shadow-sm border border-gray-100">
                <div className="bg-emerald-50 p-3 rounded-xl h-fit text-brand-primary">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Seguimiento Real</h4>
                  <p className="text-sm text-gray-500">A diferencia de la balanza común, aquí vemos cuánto de tu peso es músculo y cuánto es grasa.</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl flex gap-4 shadow-sm border border-gray-100">
                <div className="bg-emerald-50 p-3 rounded-xl h-fit text-brand-primary">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Salud Integral</h4>
                  <p className="text-sm text-gray-500">Identifica riesgos de salud analizando la distribución de la masa grasa y ósea.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:flex-[2]">
            {/* What we measure */}
            <div className="sticky top-24">
              <h3 className="text-xl font-bold mb-4">Lo que medimos</h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4 mb-8">
                <div className="bg-emerald-50/50 p-4 lg:p-6 rounded-2xl text-center border border-emerald-50 flex flex-col lg:flex-row lg:justify-between lg:items-center">
                  <p className="font-bold text-brand-primary lg:text-lg">Masa Grasa</p>
                  <p className="text-[10px] lg:text-xs font-semibold text-gray-500 mt-1 lg:mt-0 uppercase">TEJIDO ADIPOSO</p>
                </div>
                <div className="bg-emerald-50/50 p-4 lg:p-6 rounded-2xl text-center border border-emerald-50 flex flex-col lg:flex-row lg:justify-between lg:items-center">
                  <p className="font-bold text-brand-primary lg:text-lg">Masa Muscular</p>
                  <p className="text-[10px] lg:text-xs font-semibold text-gray-500 mt-1 lg:mt-0 uppercase">TEJIDO ESQUELÉTICO</p>
                </div>
                <div className="bg-emerald-50/50 p-4 lg:p-6 rounded-2xl text-center border border-emerald-50 flex flex-col lg:flex-row lg:justify-between lg:items-center">
                  <p className="font-bold text-brand-primary lg:text-lg">Masa Ósea</p>
                  <p className="text-[10px] lg:text-xs font-semibold text-gray-500 mt-1 lg:mt-0 uppercase">ESTRUCTURA</p>
                </div>
                <div className="bg-emerald-50/50 p-4 lg:p-6 rounded-2xl text-center border border-emerald-50 flex flex-col lg:flex-row lg:justify-between lg:items-center">
                  <p className="font-bold text-brand-primary lg:text-lg">Somatotipo</p>
                  <p className="text-[10px] lg:text-xs font-semibold text-gray-500 mt-1 lg:mt-0 uppercase">FORMA CORPORAL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-20">
        <div className="max-w-lg mx-auto flex flex-col items-center">
          <Link href="/booking" className="w-full bg-brand-primary text-white h-14 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-secondary transition-colors shadow-lg shadow-emerald-200">
            <Calendar className="h-5 w-5" />
            Reservar Turno
          </Link>
          <p className="text-[10px] text-gray-400 font-bold uppercase mt-3 tracking-widest">
            ATENCIÓN EN NUTRI-FLOW CENTER
          </p>
        </div>
      </div>
    </div>
  );
}

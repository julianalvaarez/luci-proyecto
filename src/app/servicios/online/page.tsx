import Link from 'next/link';
import { ArrowLeft, Calendar, Share2, CheckCircle2 } from 'lucide-react';

export default function OnlinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header / Navbar */}
      <header className="flex items-center p-4 bg-white z-10 sticky top-0 border-b border-gray-100">
        <Link href="/" className="text-brand-primary p-2">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="flex-1 text-center font-bold text-lg">Consulta Online</h1>

      </header>

      {/* Hero Section */}
      <div className="p-4 bg-white">
        <section
          className="relative h-64 md:h-80 w-full rounded-3xl bg-cover bg-center flex flex-col justify-end p-6 overflow-hidden shadow-sm"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&q=80')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
          <div className="relative z-10 text-white">
            <span className="inline-block bg-brand-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 shadow-lg shadow-emerald-500/20">
              SERVICIO DIGITAL
            </span>
            <h2 className="text-3xl font-display font-bold leading-tight">
              Tu Nutricionista,<br />estés donde estés
            </h2>
          </div>
        </section>
      </div>

      <main className="flex-1 px-4 max-w-lg lg:max-w-5xl mx-auto w-full pb-24 lg:pb-32">
        {/* Pricing Card */}
        <div className="bg-emerald-50 rounded-2xl p-5 my-6 border border-emerald-100 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-xs text-brand-primary uppercase font-bold tracking-wide">INVERSIÓN POR SESIÓN</p>
            <p className="text-4xl font-bold text-brand-primary mt-1">$45.000</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Duración estimada</p>
            <p className="text-sm font-bold mt-1">60 minutos</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="lg:flex lg:gap-12 mt-8">
          {/* Left Column */}
          <div className="lg:flex-[3]">
            {/* Description */}
            <h3 className="text-xl font-bold mb-3">¿En qué consiste?</h3>
            <p className="text-gray-600 mb-8 leading-relaxed text-[15px] lg:text-base">
              Nuestra consulta online ofrece la misma calidad y profundidad que una visita presencial, adaptándose a tu ritmo de vida. Analizamos tus hábitos, objetivos y creamos un plan nutricional 100% personalizado que podrás seguir desde nuestra aplicación móvil.
            </p>

            {/* Steps */}
            <div className="space-y-6 mb-10 relative">
              <div className="absolute left-5 top-8 bottom-8 w-[2px] bg-emerald-100"></div>

              <div className="flex gap-4 relative z-10">
                <div className="bg-emerald-100 text-brand-primary h-10 w-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 border-4 border-gray-50">
                  1
                </div>
                <div className="pt-2">
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Reserva y Cuestionario</h4>
                  <p className="text-[15px] lg:text-base text-gray-500 leading-relaxed">Eliges tu horario y completas un breve perfil nutricional previo a la sesión.</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="bg-emerald-100 text-brand-primary h-10 w-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 border-4 border-gray-50">
                  2
                </div>
                <div className="pt-2">
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Video Consulta Personalizada</h4>
                  <p className="text-[15px] lg:text-base text-gray-500 leading-relaxed">Sesión de 60 min para definir metas, resolver dudas y diseñar tu estrategia.</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="bg-emerald-100 text-brand-primary h-10 w-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 border-4 border-gray-50">
                  3
                </div>
                <div className="pt-2">
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Plan y Acompañamiento</h4>
                  <p className="text-[15px] lg:text-base text-gray-500 leading-relaxed">Recibes tu plan  con recetas, lista de compras y seguimiento diario con comidas y actividad fisica.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:flex-[2]">
            {/* Benefits Card */}
            <div className="bg-emerald-50/50 rounded-3xl p-6 lg:p-8 border border-emerald-50 mb-8 sticky top-24">
              <h4 className="text-center font-bold text-lg lg:text-xl mb-6 lg:mb-8 text-emerald-950">Beneficios de lo remoto</h4>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-6 lg:gap-y-8">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 lg:h-6 lg:w-6 text-brand-primary flex-shrink-0" />
                  <span className="text-sm lg:text-base font-medium leading-tight">Sin desplazamientos ni tráfico</span>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 lg:h-6 lg:w-6 text-brand-primary flex-shrink-0" />
                  <span className="text-sm lg:text-base font-medium leading-tight">Mayor flexibilidad horaria para tu rutina</span>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 lg:h-6 lg:w-6 text-brand-primary flex-shrink-0" />
                  <span className="text-sm lg:text-base font-medium leading-tight">Atención desde la comodidad de tu hogar</span>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 lg:h-6 lg:w-6 text-brand-primary flex-shrink-0" />
                  <span className="text-sm lg:text-base font-medium leading-tight">Misma eficacia en resultados que presencial</span>
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
        </div>
      </div>
    </div>
  );
}

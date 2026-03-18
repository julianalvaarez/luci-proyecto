import Link from 'next/link';
import { ArrowLeft, Calendar, FileText, Pickaxe, MapPin, ActivitySquare, LayoutList, ClipboardList, ExternalLink } from 'lucide-react';

export default function PresencialPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header / Navbar */}
      <header className="flex items-center justify-between p-4 bg-white z-10 sticky top-0 border-b border-gray-100">
        <Link href="/" className="text-brand-primary p-2">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="flex-1 text-center font-bold text-lg mr-10 relative left-2">Atención Presencial</h1>
      </header>

      {/* Hero Section */}
      <section
        className="relative h-64 md:h-80 w-full bg-cover bg-center flex flex-col justify-end p-6"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="relative z-10 text-white">
          <h2 className="text-3xl font-display font-bold mt-1">Nutrición Cara a Cara</h2>
          <p className="text-sm mt-2 opacity-90 max-w-sm leading-snug">
            Transforma tu salud con un acompañamiento personalizado y evaluación física.
          </p>
        </div>
      </section>

      <main className="flex-1 px-4 max-w-lg lg:max-w-5xl mx-auto w-full pb-24 lg:pb-32">
        {/* Pricing Card */}
        <div className="bg-emerald-50 rounded-2xl p-5 mb-8 border border-emerald-100 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-[10px] text-brand-primary uppercase font-bold tracking-widest">INVERSIÓN POR SESIÓN</p>
            <p className="text-4xl font-bold text-brand-primary mt-1">$55.000</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Duración estimada</p>
            <p className="text-sm font-bold mt-1">60 minutos</p>
          </div>
        </div>

        {/* What to expect */}
        <div className="lg:flex lg:space-x-10 ">
          <div className='lg:flex-1'>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-brand-primary text-white p-1.5 rounded-md">
                <ClipboardList className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">¿Qué esperar en tu visita?</h3>
            </div>

            <div className="space-y-4 mb-10">
              <div className="bg-white p-6 rounded-2xl flex gap-5 shadow-sm border border-gray-100 items-start">
                <div className="bg-emerald-100 p-3 rounded-xl h-fit text-brand-primary">
                  <ActivitySquare className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Evaluación Antropométrica</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Medición de pliegues, perímetros y composición corporal detallada (InBody).</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl flex gap-5 shadow-sm border border-gray-100 items-start">
                <div className="bg-emerald-100 p-3 rounded-xl h-fit text-brand-primary">
                  <LayoutList className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Plan Alimentario</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Diseño de un plan adaptado a tus gustos, horarios y objetivos específicos en tiempo real.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl flex gap-5 shadow-sm border border-gray-100 items-start">
                <div className="bg-emerald-100 p-3 rounded-xl h-fit text-brand-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Historia Clínica</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Análisis de laboratorios, antecedentes médicos y estilo de vida actual.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Locations */}
          <div className='lg:flex-1'>
            <h3 className="text-[22px] font-bold mb-1">Nuestras Sedes</h3>
            <p className="text-gray-500 text-sm mb-5">Encuentra tu consultorio más cercano</p>

            <div className="space-y-3 mb-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-gray-900">Palermo Soho</h4>
                <p className="text-sm text-gray-500 mb-3">Jorge Luis Borges 1900, CABA</p>
                <a href="#" className="text-brand-primary text-[11px] font-bold tracking-widest uppercase flex items-center gap-1 hover:underline">
                  VER EN GOOGLE MAPS
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-gray-900">Belgrano</h4>
                <p className="text-sm text-gray-500 mb-3">Av. Cabildo 2200, CABA</p>
                <a href="#" className="text-brand-primary text-[11px] font-bold tracking-widest uppercase flex items-center gap-1 hover:underline">
                  VER EN GOOGLE MAPS
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-gray-900">Nordelta</h4>
                <p className="text-sm text-gray-500 mb-3">Av. de los Lagos 6800, Tigre</p>
                <a href="#" className="text-brand-primary text-[11px] font-bold tracking-widest uppercase flex items-center gap-1 hover:underline">
                  VER EN GOOGLE MAPS
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 italic text-center mb-8 pb-4">
          * Cualquier duda o consulta, no dudes en contactarnos al 11-2345-6789.
        </p>
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

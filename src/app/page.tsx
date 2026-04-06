import Link from 'next/link';
import { ArrowRight, Calendar, MapPin, Video, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Global Background Wrapper - Fixed to the viewport */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-45 sm:opacity-40"
          style={{
            backgroundImage: "url('/fondo.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Fusion / Gradient Overlays - Adjusted for mobile visibility */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white/10 via-white/50 to-white" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-white/20 via-transparent to-white/20 sm:from-white sm:via-white/20 sm:to-white opacity-60" />
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle,transparent_0%,white_120%)] sm:bg-[radial-gradient(circle,transparent_10%,white_90%)]" />
      </div>

      <header className="px-4 lg:px-6 h-12 flex items-center justify-center glass sticky top-0 z-50 border-b border-white/20">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-display font-semibold text-xl text-brand-primary">Lic. Luciana Cresia</span>
        </Link>

      </header>

      <main className="flex-1 relative z-10">
        <section className="w-full min-h-[calc(100vh-64px)] flex items-center py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden bg-transparent">
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="inline-block rounded-full bg-emerald-100/90 backdrop-blur-sm border border-emerald-200 px-4 py-1.5 text-sm text-emerald-800 font-bold shadow-sm">
                Reserva tu turno online en segundos
              </div>
              <h1 className="text-4xl font-display font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-8xl max-w-4xl drop-shadow-sm text-gray-900 leading-[1.1]">
                Tu salud merece un <span className="text-brand-primary drop-shadow-sm">plan a medida</span>
              </h1>
              <p className="mx-auto max-w-[750px] text-gray-700 md:text-xl font-medium leading-relaxed drop-shadow-sm px-4">
                Agenda tu consulta nutricional de forma simple y rápida. Modalidad online o presencial en nuestras sucursales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link
                  href="/booking"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-brand-primary px-10 text-base font-bold text-white shadow-xl transition-all hover:bg-brand-secondary hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Agendar Turno
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="#services"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-gray-200 bg-white/80 backdrop-blur-md px-10 text-base font-bold shadow-lg transition-all hover:bg-white hover:scale-105 cursor-pointer"
                >
                  Ver Servicios
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Sobre Mí Section */}
        <section className="w-full py-12 md:py-20 bg-transparent relative z-10">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl">
            <div className="bg-white rounded-[32px] p-6 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">

              {/* Image & Title Column (Desktop Left) */}
              <div className="flex flex-col items-center md:items-start shrink-0 md:w-1/3">
                <h2 className="text-[28px] md:text-3xl font-bold text-gray-900 mb-6 font-display md:hidden w-full text-left">Sobre Mí</h2>

                <div className="w-32 h-32 md:w-56 md:h-56 rounded-full overflow-hidden border-[4px] border-[#e6fbf2] mb-4 bg-gray-50">
                  <img src="/luci.webp" alt="Lic. Marina Ríos" className="w-full h-full object-cover object-top" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight">Lic. Luciana Cresia</h3>
                  <p className="text-[#00e362] font-semibold text-xs md:text-sm tracking-wide uppercase mt-1 md:mt-2">Nutricionista Clínica</p>
                </div>
              </div>

              {/* Text & Stats Column (Desktop Right) */}
              <div className="flex flex-col flex-1 w-full justify-center md:pt-4">
                <h2 className="hidden md:block text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-display">Sobre Mí</h2>

                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 text-center md:text-left">
                  Especialista en Nutrición Clínica y Gastronomica con más de 6 años de experiencia ayudando a personas a transformar su relación con la comida de manera sostenible.
                </p>

                <div className='flex flex-col items-center md:flex-row md:justify-between '>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3 md:mb-8 text-gray-500 text-sm">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 bg-gray-500 text-white rounded-full p-0.5" />
                    <span className="italic text-gray-500 font-medium md:text-base">Matrícula Nacional: 12135</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-8  text-gray-500 text-sm">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 bg-gray-500 text-white rounded-full p-0.5" />
                    <span className="italic text-gray-500 font-medium md:text-base">Matrícula Provincial: 6054</span>
                  </div>

                </div>

                <div className="grid grid-cols-3 gap-3 md:gap-6 border-t border-gray-100 pt-8 w-full">
                  <div className="bg-[#f9fafb] rounded-[24px] py-4 md:py-6 px-2 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.02]">
                    <span className="text-xl md:text-3xl font-bold text-[#00e362] mb-1 leading-none">+100</span>
                    <span className="text-[9px] md:text-xs font-bold text-gray-500 uppercase tracking-widest leading-none mt-2">Pacientes</span>
                  </div>
                  <div className="bg-[#f9fafb] rounded-[24px] py-4 md:py-6 px-2 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.02]">
                    <span className="text-xl md:text-3xl font-bold text-[#00e362] mb-1 leading-none">6+</span>
                    <span className="text-[9px] md:text-xs font-bold text-gray-500 uppercase tracking-widest leading-none mt-2">Años Exp.</span>
                  </div>
                  <div className="bg-[#f9fafb] rounded-[24px] py-4 md:py-6 px-2 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.02]">
                    <span className="text-xl md:text-3xl font-bold text-[#00e362] mb-1 leading-none">100%</span>
                    <span className="text-[9px] md:text-xs font-bold text-gray-500 uppercase tracking-widest leading-none mt-2">Online</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-transparent relative z-10">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-12">Nuestros Servicios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ServiceCard
                title="Consulta Online"
                icon={<Video className="h-6 w-6 text-brand-primary" />}
                description="Atención personalizada desde la comodidad de tu casa."
                price="$25.000"
                href="/servicios/online"
              />
              <ServiceCard
                title="Consulta Presencial"
                icon={<MapPin className="h-6 w-6 text-brand-primary" />}
                description="Te esperamos en nuestras sucursales de Palermo, Belgrano o Caballito."
                price="$30.000"
                href="/servicios/presencial"
              />
              <ServiceCard
                title="Antropometría"
                icon={<Calendar className="h-6 w-6 text-brand-primary" />}
                description="Medición de composición corporal avanzada (solo presencial)."
                price="$50.000"
                href="/servicios/antropometria"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8 glass">
        <div className="container mx-auto text-center">
          <p className="text-sm text-gray-500">© 2026 Lic. Luciana Cresia. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/5491165368186?text=Hola!%20Vi%20la%20web%20y%20queria%20hacerte%20una%20consulta:%20"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[60] bg-[#25D366] text-white h-14 w-14 hover:w-auto p-4 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:bg-[#20ba59] transition-all hover:scale-110 active:scale-95 group flex items-center justify-center gap-0 hover:gap-3 overflow-hidden cursor-pointer"
        aria-label="Contactar por WhatsApp"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold text-sm whitespace-nowrap">
          ¿Tenes dudas?
        </span>
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="0"
          fill="currentColor"
          className="h-6 w-6 shrink-0"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </div>
  );
}

function ServiceCard({ title, icon, description, price, href }: { title: string, icon: React.ReactNode, description: string, price: string, href: string }) {
  return (
    <Link href={href} className="flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-brand-primary transition-colors">{title}</h3>
      <p className="text-gray-500 text-sm mb-4">{description}</p>
      <div className="mt-auto flex justify-between items-center">
        <span className="font-bold text-brand-primary">{price}</span>
        <div className="flex items-center text-xs text-brand-secondary font-medium">
          <CheckCircle className="h-3 w-3 mr-1" />
          Conocer más
        </div>
      </div>
    </Link>
  );
}

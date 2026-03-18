import Link from 'next/link';
import { ArrowRight, Calendar, MapPin, Video, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b glass sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-display font-bold text-2xl text-brand-primary">Lic. Luciana Cresia</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-brand-primary transition-colors" href="/admin">
            Admin
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-emerald-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700 font-medium">
                Reserva tu turno online en segundos
              </div>
              <h1 className="text-4xl font-display font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Tu salud merece un <span className="text-brand-primary">plan a medida</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Agenda tu consulta nutricional de forma simple y rápida. Modalidad online o presencial en nuestras sucursales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  href="/booking"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-brand-primary px-8 text-sm font-medium text-white shadow transition-all hover:bg-brand-secondary hover:scale-105 active:scale-95"
                >
                  Agendar Turno
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="#services"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-all hover:bg-gray-50"
                >
                  Ver Servicios
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Sobre Mí Section */}
        <section className="w-full py-12 md:py-20 bg-white">
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
                  Especialista en Nutrición Clínica y Deportiva con más de 8 años de experiencia ayudando a personas a transformar su relación con la comida de manera sostenible.
                </p>

                <div className="flex items-center justify-center md:justify-start gap-2 mb-8 text-gray-500 text-sm">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 bg-gray-500 text-white rounded-full p-0.5" />
                  <span className="italic text-gray-500 font-medium md:text-base">Matrícula Profesional: 12345</span>
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

        <section id="services" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-12">Nuestros Servicios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ServiceCard
                title="Consulta Online"
                icon={<Video className="h-6 w-6 text-brand-primary" />}
                description="Atención personalizada desde la comodidad de tu casa."
                price="$45.000"
                href="/servicios/online"
              />
              <ServiceCard
                title="Consulta Presencial"
                icon={<MapPin className="h-6 w-6 text-brand-primary" />}
                description="Te esperamos en nuestras sucursales de Palermo, Belgrano o Caballito."
                price="$55.000"
                href="/servicios/presencial"
              />
              <ServiceCard
                title="Antropometría"
                icon={<Calendar className="h-6 w-6 text-brand-primary" />}
                description="Medición de composición corporal avanzada (solo presencial)."
                price="$60.000"
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

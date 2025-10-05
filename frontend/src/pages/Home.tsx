import React from 'react';
import team from '../assets/DoctorHome.png'; 

const ProductCard: React.FC<{
  tag: string;
  tagColor?: string;
  title: string;
  description: string;
}> = ({ tag, tagColor = 'bg-red-500', title, description }) => {
  return (
    <article className="relative bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Badge */}
      <div className={`absolute top-0 left-0 mt-0 ml-0 ${tagColor} text-white px-3 py-1 text-xs font-semibold rounded-br-lg`}>
        {tag}
      </div>

      {/* Image placeholder */}
      <div className="h-40 bg-gray-100 w-full flex items-center justify-center">
        {/* Aquí podrías insertar <img src={...} alt="..." /> */}
        <span className="text-sm text-gray-400">Imagen del producto</span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h4 className="font-semibold text-lg text-slate-800">{title}</h4>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
        <div className="mt-4">
          <a href="#" className="inline-block text-sm font-medium text-slate-700 hover:underline">
            Ver más →
          </a>
        </div>
      </div>
    </article>
  );
};

const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="w-full bg-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="w-full md:w-4/5 mx-auto bg-slate-700 rounded-2xl shadow-lg p-12">
            <div className="flex justify-center mb-6">
            </div>

            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Bienvenido a <span className="text-slate-100">MedCore</span>
              </h1>
              <p className="mt-4 text-slate-200 max-w-2xl mx-auto">
                Una plataforma pensada para la gestión clínica y administrativa de tu práctica médica —
                agendas, historial, facturación y comunicación todo en un mismo lugar.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="#productos"
                  className="inline-block px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold shadow hover:opacity-95"
                >
                  Ver Funcionalidades
                </a>
                {/* Requisito: no habilitar registro en landing. Mostrar acceso a login. */}
                <a
                  href="/login"
                  className="inline-block px-6 py-3 rounded-lg border border-slate-300 text-white/90 bg-white/5 backdrop-blur-sm"
                >
                  Iniciar sesión
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES / Small cards (Citas, Pacientes, Facturación) */}
      <section className="pt-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="p-6 bg-white rounded-xl shadow text-center">
              <h3 className="font-semibold text-lg">Citas</h3>
              <p className="text-sm text-gray-600 mt-2">Gestiona tus citas de forma eficiente.</p>
            </article>
            <article className="p-6 bg-white rounded-xl shadow text-center">
              <h3 className="font-semibold text-lg">Pacientes</h3>
              <p className="text-sm text-gray-600 mt-2">Accede al historial de tus pacientes.</p>
            </article>
            <article className="p-6 bg-white rounded-xl shadow text-center">
              <h3 className="font-semibold text-lg">Facturación</h3>
              <p className="text-sm text-gray-600 mt-2">Controla la facturación y cobros.</p>
            </article>
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS (Nueva Sección) */}
      <section id="productos" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Título y CTA */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-extrabold text-slate-900">Productos Destacados</h2>
            <p className="mt-3 text-slate-600">
              Herramientas creadas para que tu clínica funcione mejor: desde la gestión de citas hasta
              reportes y facturación avanzada.
            </p>

            <div className="mt-6">
              <a
                href="/productos"
                className="inline-block px-6 py-3 rounded-lg bg-slate-700 text-white font-semibold shadow hover:opacity-95"
              >
                Ver Todos
              </a>
            </div>
          </div>

          {/* Grid de tarjetas */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <ProductCard
              tag="NUEVO"
              tagColor="bg-indigo-600"
              title="Agenda Inteligente"
              description="Organiza las citas, evita solapamientos y envía recordatorios automáticos a tus pacientes."
            />
            <ProductCard
              tag="PROMO"
              tagColor="bg-emerald-500"
              title="Facturación Avanzada"
              description="Automatiza cobros, genera facturas y exporta recibos en segundos."
            />
            <ProductCard
              tag="TOP"
              tagColor="bg-rose-500"
              title="Historia Clínica Digital"
              description="Accede al historial completo del paciente, con notas estructuradas y multimedia."
            />
          </div>

          {/* Imagen del equipo */}
          <div className="mt-12">
            <div className="max-w-4xl mx-auto">
              <img
                src={team}
                alt="Equipo médico MedCore"
                className="w-full rounded-xl shadow-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

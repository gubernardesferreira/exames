
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="relative bg-gray-900 shadow-xl overflow-hidden mb-6">
      {/* Imagem de Fundo com Overlay de Gradiente */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop" 
          alt="Fundo Laboratório Abstrato" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/95 to-brand-pink/90 mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-10">
            <div className="flex items-center gap-5">
                 {/* Ícone Temático em container com efeito de vidro */}
                 <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
                        <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                        <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.367 7.516 1.092a.75.75 0 01.634.74zM3.75 21V10.333c0-.46.343-.86.79-1.02a47.609 47.609 0 0114.92 0c.447.16.79.56.79 1.02v10.668h-1.5v-1.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v1.5h-4.5v-1.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v1.5h-1.5z" clipRule="evenodd" />
                    </svg>
                 </div>
                
                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
                        Exames da Lê
                    </h1>
                    <p className="text-purple-100 text-sm md:text-lg font-medium mt-1 opacity-90">
                        Painel de Controle e Histórico de Saúde
                    </p>
                </div>
            </div>

            {/* Tag Decorativa */}
            <div className="mt-6 md:mt-0 hidden md:block">
               <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm">
                   <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                   </span>
                   <span className="text-white text-xs font-bold tracking-wide uppercase">Monitoramento Ativo</span>
               </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

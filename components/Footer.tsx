
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="font-semibold">&copy; {new Date().getFullYear()} Produzido por GBF Consultoria.</p>
        <p className="text-sm text-gray-400 mt-2">Todos os direitos reservados.</p>
        <p className="text-xs text-gray-500 mt-4 max-w-2xl mx-auto">As informações geradas por esta aplicação são para fins informativos e não substituem o aconselhamento, diagnóstico ou tratamento médico profissional. Sempre consulte um médico qualificado para questões de saúde.</p>
      </div>
    </footer>
  );
};

export default Footer;

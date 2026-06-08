'use client';

import FormularioAdm from "./FormularioAdm";

export default function AdmPage() {
  return (
    <div className="p-4 sm:p-8 max-w-md mx-auto text-black pb-20">
      <h1 className="text-2xl font-black mb-1 text-center uppercase tracking-tight text-zinc-900">
        Painel ADM
      </h1>
      <p className="text-xs text-zinc-500 text-center mb-6">
        Gerencie o estoque do e-commerce VÉSTIA
      </p>
      
      {/* Carrega o miolo do formulário dinâmico */}
      <FormularioAdm />
    </div>
  );
}

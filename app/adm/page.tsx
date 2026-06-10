'use client';

import FormularioAdm from "./FormularioAdm";
import ListaEstoque from "../../components/listaestoque"; // 🔥 Injeta a nova lista isolada
import Link from "next/dist/client/link";

export default function AdmPage() {
  return (
    // 🔥 Tema atualizado: Fundo preto profundo e textos adaptados
    <div className="min-h-screen bg-zinc-950 p-4 sm:p-8 pb-20 text-white">
      <div className="max-w-md mx-auto">
        
        {/* Badge superior com a identidade da marca */}
        <div className="text-center mb-3">
          <h1 className="text-pink-500 font-bold tracking-widest text-[30px] uppercase bg-pink-950/40 px-3 py-1 rounded-full border border-pink-500/50">
             <Link href="/">VÉSTIA</Link>
          </h1>
        </div>

        <h1 className="text-2xl font-black mb-1 text-center uppercase tracking-tight text-white">
          Painel <span className="text-pink-500">ADM</span>
        </h1>
        
        <p className="text-xs text-zinc-400 text-center mb-8">
          Gerencie o estoque do e-commerce VÉSTIA
        </p>
        
        {/* Carrega o miolo do formulário dinâmico */}
        <FormularioAdm />
              {/* Carrega o miolo do formulário dinâmico */}
    
      
      {/* 🔥 Gerenciamento (Listagem, busca e exclusão isolados) */}
      <ListaEstoque />

        
      </div>
    </div>
  );
}

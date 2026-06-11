'use client';

import FormularioAdm from "./FormularioAdm";
import ListaEstoque from "../../components/listaestoque"; 
import Link from "next/dist/client/link";

export default function AdmPage() {
  return (
    <div className="min-h-screen bg-zinc-950 p-4 sm:p-6 text-white flex flex-col gap-6">
      
      {/* Cabeçalho Minimalista e Compacto */}
      <div className="max-w-md w-full mx-auto flex items-baseline justify-between border-b border-zinc-900 pb-2">
        <h1 className="text-sm font-black tracking-widest text-pink-500 uppercase">
          <Link href="/" className="hover:text-pink-400 transition-colors">VÉSTIA</Link>
        </h1>
        <div className="text-right">
          <span className="text-xs font-black uppercase tracking-tight text-white">
            Painel <span className="text-pink-500">ADM</span>
          </span>
          <p className="text-[10px] text-zinc-500 lowercase tracking-wide">
            gerenciamento de estoque
          </p>
        </div>
      </div>

      {/* Bloco do Formulário Encurtado */}
      <div className="max-w-md w-full mx-auto">
        <FormularioAdm />
      </div>

      {/* Bloco da Listagem de Estoque */}
      <div className="max-w-5xl w-full mx-auto mt-2">
        <ListaEstoque />
      </div>

    </div>
  );
}
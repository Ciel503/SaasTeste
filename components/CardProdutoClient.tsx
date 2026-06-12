'use client';

import { useState } from 'react';
import BotaoCarrinho from './botaocarrinho';
import ModalDetalhes from './ModalDetalhes';

interface Produto {
  id: number;
  nome: string;
  preco: string;
  categoria: string;
  genero: string | null;
  subcategoria: string;
  tamanho: string | null;
  descricao: string;
  imagem1: string;
  imagem2: string | null;
  imagem3: string | null;
  imagem4: string | null;
}

interface CardProdutoClientProps {
  produto: Produto;
}

export default function CardProdutoClient({ produto }: CardProdutoClientProps) {
  // Controle individual de abertura do modal para este produto específico
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group">
        
        {/* IMAGEM CLICÁVEL: Quando clica aqui, abre o carrossel no centro */}
        <div 
          onClick={() => setModalAberto(true)}
          className="w-full h-40 sm:h-52 bg-zinc-100 relative overflow-hidden border-b border-zinc-100 flex items-center justify-center cursor-pointer"
        >
          <img 
            src={produto.imagem1} 
            alt={produto.nome}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {/* VALIDAÇÃO DE TAMANHO */}
          {produto.tamanho && (
            <span className="absolute top-2 right-2 bg-zinc-950/80 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              {produto.tamanho}
            </span>
          )}
        </div>

        {/* CONTEÚDO */}
        <div className="p-2 sm:p-3 flex flex-col flex-1 gap-1">
          
          {/* TAGS INFERIORES */}
          <div className="flex flex-wrap items-center gap-1 text-[9px] font-semibold uppercase tracking-wider">
            <span className="text-pink-600">{produto.categoria}</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-500">{produto.subcategoria}</span>
            
            {produto.genero && (
              <>
                <span className="text-zinc-300">•</span>
                <span className="text-zinc-400">{produto.genero}</span>
              </>
            )}
          </div>

          {/* Título também fica clicável para abrir o modal */}
          <h3 
            onClick={() => setModalAberto(true)}
            className="text-xs sm:text-sm font-bold text-zinc-900 line-clamp-1 group-hover:text-pink-600 transition-colors mt-0.5 cursor-pointer"
          >
            {produto.nome}
          </h3>
          
          <p className="text-[10px] sm:text-xs text-zinc-500 leading-tight line-clamp-2 flex-1">
            {produto.descricao}
          </p>

          <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-100">
            <span className="text-[11px] sm:text-sm font-black text-zinc-900">
              R$ {Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>

            {/* Botão de compras com mapeamento da imagem necessário para a estrutura do carrinho */}
            <BotaoCarrinho 
              produto={{
                ...produto,
                imagem_url: produto.imagem1
              }} 
            />
          </div>

        </div>

      </div>

      {/* RENDERIZAÇÃO DO CARROSSEL EXPANDIDO */}
      {modalAberto && (
        <ModalDetalhes 
          produto={produto} 
          onClose={() => setModalAberto(false)} 
        />
      )}
    </>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import BotaoCarrinho from './botaocarrinho';

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

interface ModalDetalhesProps {
  produto: Produto;
  onClose: () => void;
}

export default function ModalDetalhes({ produto, onClose }: ModalDetalhesProps) {
  const imagensDoCarrossel = [
    produto.imagem1,
    produto.imagem2,
    produto.imagem3,
    produto.imagem4,
  ].filter(Boolean) as string[];

  const [indexImagemAtiva, setIndexImagemAtiva] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Sincroniza o index quando o usuário arrasta com o dedo no celular
  const handleScrollCarrossel = () => {
    if (!containerRef.current) return;
    const larguraContainer = containerRef.current.clientWidth;
    const scrollEsquerda = containerRef.current.scrollLeft;
    
    // Calcula qual imagem está mais visível no centro da tela
    const novoIndex = Math.round(scrollEsquerda / larguraContainer);
    if (novoIndex !== indexImagemAtiva && novoIndex >= 0 && novoIndex < imagensDoCarrossel.length) {
      setIndexImagemAtiva(novoIndex);
    }
  };

  // Move o carrossel de forma suave ao clicar nos botões ou miniaturas
  const navegarParaSlide = (index: number) => {
    if (!containerRef.current) return;
    const larguraContainer = containerRef.current.clientWidth;
    containerRef.current.scrollTo({
      left: index * larguraContainer,
      behavior: 'smooth'
    });
    setIndexImagemAtiva(index);
  };

  const imagemAnterior = () => {
    const proximoIndex = indexImagemAtiva === 0 ? imagensDoCarrossel.length - 1 : indexImagemAtiva - 1;
    navegarParaSlide(proximoIndex);
  };

  const proximaImagem = () => {
    const proximoIndex = indexImagemAtiva === imagensDoCarrossel.length - 1 ? 0 : indexImagemAtiva + 1;
    navegarParaSlide(proximoIndex);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl border border-zinc-100 flex flex-col z-10 max-h-[90vh]">
        
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 z-20 h-7 w-7 flex items-center justify-center bg-zinc-950/60 hover:bg-zinc-950 text-white rounded-full text-sm font-bold transition-colors"
        >
          ✕
        </button>

        {/* ÁREA DO CARROSSEL MODIFICADA COM SCROLL SNAP (Arrastar com o dedo) */}
        <div className="w-full h-64 sm:h-80 bg-zinc-100 relative border-b border-zinc-100 group/carrossel">
          
          {/* Container horizontal com scroll nativo e travas automáticas */}
          <div 
            ref={containerRef}
            onScroll={handleScrollCarrossel}
            className="w-full h-full flex overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing"
          >
            {imagensDoCarrossel.map((img, idx) => (
              <div key={idx} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center">
                <img 
                  src={img} 
                  alt={`${produto.nome} - Foto ${idx + 1}`}
                  className="w-full h-full object-cover select-none"
                  draggable="false"
                />
              </div>
            ))}
          </div>

          {/* Seta Esquerda */}
          {imagensDoCarrossel.length > 1 && (
            <button 
              onClick={imagemAnterior}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-zinc-900 p-2 rounded-full shadow-md text-xs font-bold transition-all opacity-100 sm:opacity-0 sm:group-hover/carrossel:opacity-100 z-10"
            >
              ◀
            </button>
          )}

          {/* Seta Direita */}
          {imagensDoCarrossel.length > 1 && (
            <button 
              onClick={proximaImagem}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-zinc-900 p-2 rounded-full shadow-md text-xs font-bold transition-all opacity-100 sm:opacity-0 sm:group-hover/carrossel:opacity-100 z-10"
            >
              ▶
            </button>
          )}

          {/* Indicador de Bolinhas Inferiores */}
          {imagensDoCarrossel.length > 1 && (
            <div className="absolute bottom-3 flex gap-1.5 justify-center w-full z-10">
              {imagensDoCarrossel.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => navegarParaSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === indexImagemAtiva ? 'w-4 bg-pink-600' : 'w-1.5 bg-zinc-400/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* MINIATURAS CLICÁVEIS */}
        {imagensDoCarrossel.length > 1 && (
          <div className="flex gap-2 px-4 pt-3 overflow-x-auto bg-zinc-50/50 border-b border-zinc-100 pb-2">
            {imagensDoCarrossel.map((img, idx) => (
              <button
                key={idx}
                onClick={() => navegarParaSlide(idx)}
                className={`h-12 w-12 rounded border-2 bg-white object-contain p-0.5 overflow-hidden flex-shrink-0 transition-all ${
                  idx === indexImagemAtiva ? 'border-pink-600 scale-95' : 'border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* DETALHES E CONTEÚDO */}
        <div className="p-4 flex flex-col gap-2 overflow-y-auto">
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            <span className="text-pink-600">{produto.categoria}</span>
            <span>•</span>
            <span>{produto.subcategoria}</span>
            {produto.genero && (
              <>
                <span>•</span>
                <span>{produto.genero}</span>
              </>
            )}
            {produto.tamanho && (
              <>
                <span>•</span>
                <span className="bg-zinc-900 text-white px-1 rounded text-[9px]">{produto.tamanho}</span>
              </>
            )}
          </div>

          <h3 className="text-base font-black text-zinc-900 leading-tight">
            {produto.nome}
          </h3>

          <p className="text-xs text-zinc-600 leading-relaxed max-h-24 overflow-y-auto bg-zinc-50 p-2 rounded-lg border border-zinc-100">
            {produto.descricao}
          </p>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100">
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 font-bold uppercase">Preço</span>
              <span className="text-lg font-black text-zinc-900">
                R$ {Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <BotaoCarrinho 
              produto={{
                ...produto,
                imagem_url: produto.imagem1
              }} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}

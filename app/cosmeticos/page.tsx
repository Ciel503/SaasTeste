'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // 🔥 Importado para capturar a busca do Header
import BotaoCarrinho from "../../components/botaocarrinho";

interface Produto {
  id: number;
  nome: string;
  preco: string;
  categoria: string;
  genero: string | null;
  subcategoria: string;
  tamanho: string | null;
  descricao: string;
  imagem_url: string;
}

export default function CosmeticosPage() {
  const [todosProdutos, setTodosProdutos] = useState<Produto[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Filtro de subcategoria ativo (Inicia mostrando tudo)
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState<string>("Todos");

  // 🔥 Captura o termo de busca digitado na URL
  const searchParams = useSearchParams();
  const termoBusca = searchParams.get('busca') || '';

  // 1. Busca os dados de Cosméticos usando o termo limpo 'Cosmeticos' na API inteligente
  useEffect(() => {
    async function buscarCosmeticos() {
      try {
        const response = await fetch('/api/produtos?categoria=cosmeticos');
        if (!response.ok) throw new Error("Erro na requisição");
        
        const dados = (await response.json()) as Produto[];
        setTodosProdutos(dados);
        setProdutosFiltrados(dados);
      } catch (error) {
        console.error("Erro ao buscar cosméticos:", error);
      } finally {
        setCarregando(false);
      }
    }
    buscarCosmeticos();
  }, []);

  // 2. Filtra a tela instantaneamente quando o cliente clica nas abas OU digita na busca
  useEffect(() => {
    let resultado = todosProdutos;

    // 🔥 FILTRO DA BARRA DE BUSCA: Valida se o termo bate com o nome, descrição ou subcategoria do cosmético
    if (termoBusca.trim() !== "") {
      const termo = termoBusca.toLowerCase();
      resultado = resultado.filter(p => 
        p.nome.toLowerCase().includes(termo) || 
        p.descricao.toLowerCase().includes(termo) ||
        p.subcategoria.toLowerCase().includes(termo)
      );
    }

    // Filtro original por aba de subcategoria
    if (subcategoriaSelecionada !== "Todos") {
      resultado = resultado.filter(p => p.subcategoria === subcategoriaSelecionada);
    }

    setProdutosFiltrados(resultado);
  }, [subcategoriaSelecionada, todosProdutos, termoBusca]); // 🔥 termoBusca adicionado aqui

  if (carregando) {
    return <div className="text-center py-12 text-zinc-500 bg-zinc-50 min-h-screen">Carregando vitrine de cosméticos...</div>;
  }

  return (
    <div className="w-full bg-zinc-50 min-h-screen pb-24 text-black">
      
      {/* SEÇÃO DE FILTROS DO TOPO (Sem gênero, focada direto nos produtos) */}
      <section className="w-full bg-white border-b border-zinc-200 py-6 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900">Fragrâncias & Cosméticos</h1>
            <p className="text-xs text-zinc-500">
              {/* 🔥 Mostra se há um termo sendo buscado na barra de navegação */}
              {termoBusca ? `Buscando cosméticos por: "${termoBusca}"` : "Encontre os melhores perfumes, cremes e maquiagens do nosso catálogo real."}
            </p>
          </div>

          {/* ABAS DE SELEÇÃO DIRETA */}
          <div className="flex flex-col gap-1.5 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Categorias</span>
            <div className="flex flex-wrap gap-2">
              {["Todos", "Perfume", "Creme", "Maquiagem", "Outros"].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSubcategoriaSelecionada(sub)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    subcategoriaSelecionada === sub
                      ? "bg-zinc-950 text-white border-zinc-950 shadow-xs"
                      : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GRADE DE CARTÕES */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 py-6">
        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border p-6">
            <p className="text-zinc-500 text-sm">Nenhum cosmético encontrado para essa busca.</p>
            <p className="text-xs text-zinc-400 mt-1">Tente mudar o termo da busca ou selecionar outra categoria!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {produtosFiltrados.map((produto) => (
              <div 
                key={produto.id} 
                className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* IMAGEM DO PRODUTO (Vercel Blob) */}
                <div className="w-full h-40 sm:h-52 bg-zinc-100 relative overflow-hidden border-b border-zinc-100 flex items-center justify-center">
                  <img 
                    src={produto.imagem_url} 
                    alt={produto.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* DETALHES CARD */}
                <div className="p-2 sm:p-3 flex flex-col flex-1 gap-1">
                  <div className="text-[9px] font-bold text-pink-600 uppercase tracking-wider">
                    {produto.subcategoria}
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-zinc-900 line-clamp-1 group-hover:text-pink-600 transition-colors">
                    {produto.nome}
                  </h3>
                  
                  <p className="text-[10px] sm:text-xs text-zinc-500 leading-tight line-clamp-2 flex-1">
                    {produto.descricao}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-100">
                    <span className="text-[11px] sm:text-sm font-black text-zinc-900">
                      R$ {Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <BotaoCarrinho produto={produto} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

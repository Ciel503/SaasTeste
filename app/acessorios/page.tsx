'use client';

import { useEffect, useState } from "react";
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

export default function AcessoriosPage() {
  const [todosProdutos, setTodosProdutos] = useState<Produto[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Estados dos filtros dinâmicos
  const [generoSelecionado, setGeneroSelecionado] = useState<string>("Todos");
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState<string>("Todos");

  // 1. Busca os dados de Acessórios de forma segura usando a API que criamos
  useEffect(() => {
    async function buscarAcessorios() {
      try {
        const response = await fetch('/api/produtos?categoria=acessorios');
        if (!response.ok) throw new Error("Erro na requisição");
        
        const dados = (await response.json()) as Produto[];
        setTodosProdutos(dados);
        setProdutosFiltrados(dados);
      } catch (error) {
        console.error("Erro ao buscar acessórios:", error);
      } finally {
        setCarregando(false);
      }
    }
    buscarAcessorios();
  }, []);

  // 2. Filtra a grade na tela sempre que um botão de filtro for clicado
  useEffect(() => {
    let resultado = todosProdutos;

    if (generoSelecionado !== "Todos") {
      resultado = resultado.filter(p => p.genero === generoSelecionado);
    }

    if (subcategoriaSelecionada !== "Todos") {
      resultado = resultado.filter(p => p.subcategoria === subcategoriaSelecionada);
    }

    setProdutosFiltrados(resultado);
  }, [generoSelecionado, subcategoriaSelecionada, todosProdutos]);

  if (carregando) {
    return <div className="text-center py-12 text-zinc-500 bg-zinc-50 min-h-screen">Carregando vitrine de acessórios...</div>;
  }

  return (
    <div className="w-full bg-zinc-50 min-h-screen pb-24 text-black">
      
      {/* SEÇÃO DE FILTROS DO TOPO */}
      <section className="w-full bg-white border-b border-zinc-200 py-6 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900">Acessórios</h1>
            <p className="text-xs text-zinc-500">Destaque o seu visual com os melhores complementos.</p>
          </div>

          {/* FILTRO 1: GÊNERO */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Gênero</span>
            <div className="flex gap-2">
              {["Todos", "Masculino", "Feminino"].map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setGeneroSelecionado(g);
                    setSubcategoriaSelecionada("Todos"); // Reseta a peça ao mudar o gênero
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    generoSelecionado === g 
                      ? "bg-pink-600 text-white shadow-xs" 
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* FILTRO 2: SUBCATEGORIAS DE ACESSÓRIOS */}
          <div className="flex flex-col gap-1.5 mt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Filtrar por</span>
            <div className="flex flex-wrap gap-2">
              {["Todos", "Relógio", "Óculos", "Boné", "Pulseira", "Joias", "Outros"].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSubcategoriaSelecionada(sub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    subcategoriaSelecionada === sub
                      ? "bg-zinc-950 text-white border-zinc-950"
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

      {/* LISTA DE PRODUTOS */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 py-6">
        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border p-6">
            <p className="text-zinc-500 text-sm">Nenhum acessório encontrado com esses filtros.</p>
            <p className="text-xs text-zinc-400 mt-1">Tente selecionar outra combinação de pesquisa!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {produtosFiltrados.map((produto) => (
              <div 
                key={produto.id} 
                className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* IMAGEM */}
                <div className="w-full h-40 sm:h-52 bg-zinc-100 relative overflow-hidden border-b border-zinc-100 flex items-center justify-center">
                  <img 
                    src={produto.imagem_url} 
                    alt={produto.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* CONTEÚDO */}
                <div className="p-2 sm:p-3 flex flex-col flex-1 gap-1">
                  <div className="flex items-center gap-1 text-[9px] font-semibold text-pink-600 uppercase tracking-wider">
                    {produto.genero && <span>{produto.genero}</span>}
                    {produto.genero && <span>•</span>}
                    <span className="text-zinc-500">{produto.subcategoria}</span>
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

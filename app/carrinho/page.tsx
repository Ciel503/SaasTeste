'use client';

import { useEffect, useState } from 'react';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Definição do formato do item que está no carrinho
interface ItemCarrinho {
  id: number;
  nome: string;
  preco: string;
  imagem_url: string;
  quantidade: number;
}

export default function CarrinhoPage() {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [carregando, setCarregando] = useState(true);

  // 1. Carrega os itens do localStorage assim que a página abre no navegador
  useEffect(() => {
    const carrinhoSalvo = JSON.parse(localStorage.getItem('carrinho') || '[]');
    setItens(carrinhoSalvo);
    setCarregando(false);
  }, []);

  // 2. Função para salvar as alterações de volta no localStorage
  const atualizarLocalStorage = (novoCarrinho: ItemCarrinho[]) => {
    setItens(novoCarrinho);
    localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
    window.dispatchEvent(new Event('carrinhoAtualizado')); // Dispara um evento customizado para atualizar o contador do carrinho no Header
  };

  // 3. Altera a quantidade de um produto (Aumentar ou Diminuir)
  const alterarQuantidade = (id: number, tipo: 'aumentar' | 'diminuir') => {
    const novoCarrinho = itens.map(item => {
      if (item.id === id) {
        const novaQtd = tipo === 'aumentar' ? item.quantidade + 1 : item.quantidade - 1;
        return { ...item, quantidade: Math.max(1, novaQtd) }; // Não deixa ficar menor que 1
      }
      return item;
    });
    atualizarLocalStorage(novoCarrinho);
  };

  // 4. Remove um produto do carrinho
  const removerItem = (id: number) => {
    const novoCarrinho = itens.filter(item => item.id !== id);
    atualizarLocalStorage(novoCarrinho);
  };

  // 5. Calcula o valor total de todas as roupas juntas
  const calcularTotal = () => {
    return itens.reduce((total, item) => total + Number(item.preco) * item.quantidade, 0);
  };

  if (carregando) {
    return <div className="text-center py-12 text-zinc-500">Carregando carrinho...</div>;
  }

  return (
    <div className="w-full bg-zinc-50 min-h-screen p-4 sm:p-8 text-black">
      <div className="max-w-3xl mx-auto">
        
        {/* BOTÃO VOLTAR */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-pink-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar para a Vitrine
        </Link>

        <h1 className="text-2xl font-black uppercase tracking-tight mb-6 text-zinc-900">Meu Carrinho</h1>

        {/* SE O CARRINHO ESTIVER VAZIO */}
        {itens.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border p-6 shadow-xs">
            <p className="text-zinc-500 text-sm">Seu carrinho está vazio.</p>
            <p className="text-xs text-zinc-400 mt-1 mb-4">Escolha algumas peças incríveis na nossa vitrine!</p>
            <Link href="/" className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-pink-600 transition-colors">
              Ver Roupas
            </Link>
          </div>
        ) : (
          /* LISTA DE PRODUTOS NO CARRINHO */
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
              {itens.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3 border-b border-zinc-100 last:border-0">
                  
                  {/* FOTO DO BLOB */}
                  <img 
                    src={item.imagem_url} 
                    alt={item.nome} 
                    className="w-16 h-20 object-cover rounded-lg border bg-zinc-50"
                  />

                  {/* TEXTOS */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-900 truncate">{item.nome}</h3>
                    <p className="text-xs font-black text-zinc-700 mt-1">
                      R$ {Number(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  {/* CONTROLE DE QUANTIDADE */}
                  <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-lg border border-zinc-200">
                    <button 
                      onClick={() => Skinner(item.id, 'diminuir')}
                      onClick={() => alterarQuantidade(item.id, 'diminuir')}
                      className="p-1 hover:bg-white rounded transition-colors text-zinc-600 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold px-1 w-4 text-center">{item.quantidade}</span>
                    <button 
                      onClick={() => alterarQuantidade(item.id, 'aimentar')}
                      onClick={() => alterarQuantidade(item.id, 'aumentar')}
                      className="p-1 hover:bg-white rounded transition-colors text-zinc-600 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* BOTÃO REMOVER */}
                  <button 
                    onClick={() => removerItem(item.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Remover item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              ))}
            </div>

            {/* RESUMO DO TOTAL */}
            <div className="bg-zinc-950 text-white p-4 rounded-xl flex items-center justify-between shadow-md mt-2">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Total do Pedido</p>
                <p className="text-xl font-black">
                  R$ {calcularTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <button 
                onClick={() => alert("Integração de pagamento será o próximo passo!")}
                className="bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs uppercase px-4 py-3 rounded-lg transition-colors cursor-pointer tracking-wider"
              >
                Fechar Pedido
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

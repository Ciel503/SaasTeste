'use client';

import { useState, useEffect } from 'react';

interface Produto {
  id: number;
  nome: string;
  preco: string;
  categoria: string;
  subcategoria: string;
  imagem_url: string;
}

export default function ListaEstoque() {
  const [estoque, setEstoque] = useState<Produto[]>([]);
  const [buscaLocal, setBuscaLocal] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  // 1. Busca todos os produtos para a gestão local do ADM
  const carregarEstoque = async () => {
    try {
      const response = await fetch('/api/produtos/todos');
      if (response.ok) {
        const dados = await response.json();
        setEstoque(dados);
      }
    } catch (e) {
      console.error("Erro ao carregar estoque:", e);
    }
  };

  useEffect(() => {
    carregarEstoque();
  }, []);

    // 2. Deleta o produto no banco Neon usando a sua API isolada de exclusão
  const handleDeletar = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este produto?")) return;

    try {
      // 🔥 MUDADO AQUI: apontando para a sua rota real api/delete
      const response = await fetch('/api/delete', { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        setStatus('✅ Removido com sucesso!');
        setEstoque(prev => prev.filter(p => p.id !== id));
        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus('❌ Erro ao deletar produto.');
      }
    } catch (e) {
      setStatus('❌ Erro na conexão.');
    }
  };

  // Filtra os itens enquanto você digita na barra local do ADM
  const estoqueFiltrado = estoque.filter(p => 
    p.nome.toLowerCase().includes(buscaLocal.toLowerCase()) ||
    p.subcategoria.toLowerCase().includes(buscaLocal.toLowerCase())
  );

  return (
    <div className="mt-12 pt-8 border-t border-zinc-800 text-white w-full max-w-md mx-auto">
      <h2 className="text-lg font-black uppercase tracking-tight mb-1">Gerenciar Estoque</h2>
      <p className="text-xs text-zinc-400 mb-4">Remova ou selecione produtos cadastrados.</p>

      {status && (
        <div className="p-2.5 rounded-lg mb-3 text-xs font-bold text-center bg-zinc-900 border border-zinc-800 text-pink-500 uppercase tracking-wider">
          {status}
        </div>
      )}

      {/* 🔍 Barra de Busca Local do ADM */}
      <div className="relative w-full mb-4">
        <input 
          type="text" 
          value={buscaLocal}
          onChange={(e) => setBuscaLocal(e.target.value)}
          placeholder="Buscar no estoque por nome ou subcategoria..." 
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 transition-colors" 
        />
        <span className="absolute left-3.5 top-3.5 text-zinc-600 text-sm">🔍</span>
      </div>

      {/* Lista de Itens do Neon */}
      <div className="flex flex-col gap-2">
        {estoqueFiltrado.length === 0 ? (
          <p className="text-center py-6 text-xs text-zinc-600 border border-dashed border-zinc-800 rounded-xl">Nenhum produto encontrado.</p>
        ) : (
          estoqueFiltrado.map((prod) => (
            <div key={prod.id} className="flex items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 p-3 rounded-xl shadow-md">
              <img src={prod.imagem_url} alt={prod.nome} className="w-10 h-12 object-cover rounded bg-zinc-950 border border-zinc-800" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{prod.nome}</h4>
                <span className="text-[10px] text-pink-500 font-medium block uppercase tracking-wider mt-0.5">
                  {prod.categoria} • {prod.subcategoria}
                </span>
                <span className="text-[11px] font-black text-zinc-300 block">
                  R$ {Number(prod.preco).toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {/* Botão de Editar (Chama um alert indicando que faremos a rota isolada) */}
                <button type="button" onClick={() => alert("Criaremos a rota/tela para editar a seguir!")} className="p-2 text-zinc-500 hover:text-pink-500 transition-colors cursor-pointer" title="Editar">📝</button>
                <button type="button" onClick={() => handleDeletar(prod.id)} className="p-2 text-zinc-500 hover:text-red-500 transition-colors cursor-pointer" title="Deletar">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

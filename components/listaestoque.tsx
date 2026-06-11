'use client';

import { useState, useEffect, ChangeEvent } from 'react';


interface Produto {
  id: number;
  nome: string;
  preco: string;
  categoria: string;
  genero: string | null;  // 🔥 Adicionado para o TypeScript reconhecer
  subcategoria: string;
  tamanho: string | null; // 🔥 Adicionado para o TypeScript reconhecer
  descricao: string;
  imagem_url: string;
}

export default function ListaEstoque() {
  const [estoque, setEstoque] = useState<Produto[]>([]);
  const [buscaLocal, setBuscaLocal] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  // Estados para o formulário embutido que desce na tela
  const [idProdutoEditando, setIdProdutoEditando] = useState<number | null>(null);
  const [nomeEdit, setNomeEdit] = useState('');
  const [precoEdit, setPrecoEdit] = useState('');
  const [descEdit, setDescEdit] = useState('');
  const [subCatEdit, setSubCatEdit] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [arquivoFoto, setArquivoFoto] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);

  const carregarEstoque = async () => {
    try {
      const response = await fetch('/api/produtos');
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
    window.addEventListener('estoqueAtualizado', carregarEstoque);
    return () => window.removeEventListener('estoqueAtualizado', carregarEstoque);
  }, []);

  const handleDeletar = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este produto?")) return;
    try {
      const response = await fetch('/api/delete', { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (response.ok) {
        setStatus('✅ Removido com sucesso!');
        setEstoque(prev => prev.filter(p => p.id !== id));
        if (idProdutoEditando === id) setIdProdutoEditando(null);
        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus('❌ Erro ao deletar produto.');
      }
    } catch (e) {
      setStatus('❌ Erro na conexão.');
    }
  };

  const abrirEdicaoInline = (prod: Produto) => {
    if (idProdutoEditando === prod.id) {
      setIdProdutoEditando(null);
      return;
    }
    setIdProdutoEditando(prod.id);
    setNomeEdit(prod.nome);
    setPrecoEdit(prod.preco);
    setDescEdit(prod.descricao);
    setSubCatEdit(prod.subcategoria);
    setPreviewUrl(prod.imagem_url);
    setArquivoFoto(null);
  };

  const handleMudarImagem = (event: ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    if (arquivo) {
      setArquivoFoto(arquivo);
      setPreviewUrl(URL.createObjectURL(arquivo));
    }
  };

  // 🔥 Função atualizada: Sem e.preventDefault() e 100% livre de Server Actions
  const handleSalvarEdicao = async () => {
    setCarregando(true);
    try {
      const formData = new FormData();
      formData.append('id', idProdutoEditando!.toString());
      formData.append('nome', nomeEdit);
      formData.append('preco', precoEdit);
      formData.append('subcategoria', subCatEdit);
      formData.append('descricao', descEdit);
      
      const prodOriginal = estoque.find(p => p.id === idProdutoEditando);
      formData.append('categoria', prodOriginal?.categoria || 'Roupas');
      formData.append('genero', prodOriginal?.genero || '');   // 🔥 Atualizado seguro
      formData.append('tamanho', prodOriginal?.tamanho || '');
      
      if (arquivoFoto) formData.append('file', arquivoFoto);

      const response = await fetch('/api/editar', { 
        method: 'POST', 
        body: formData 
      });

      if (response.ok) {
        setStatus('✅ Alterações salvas com sucesso!');
        setIdProdutoEditando(null);
        carregarEstoque();
        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus('❌ Erro ao atualizar produto.');
      }
    } catch (error) {
      setStatus('❌ Erro na conexão.');
    } finally {
      setCarregando(false);
    }
  };

  const estoqueFiltrado = estoque.filter(p => 
    p.nome.toLowerCase().includes(buscaLocal.toLowerCase()) ||
    p.subcategoria.toLowerCase().includes(buscaLocal.toLowerCase())
  );

  return (
    <div className="mt-12 pt-8 border-t border-zinc-800 text-white w-full max-w-md mx-auto">
      <h2 className="text-lg font-black uppercase tracking-tight mb-1">Gerenciar Estoque</h2>
      <p className="text-xs text-zinc-400 mb-4">Remova ou edite produtos cadastrados no Neon.</p>

      {status && (
        <div className="p-2.5 rounded-lg mb-3 text-xs font-bold text-center bg-zinc-900 border border-zinc-800 text-pink-500 uppercase tracking-wider">
          {status}
        </div>
      )}

      <div className="relative w-full mb-4">
        <input 
          type="text" 
          value={buscaLocal}
          onChange={(e) => setBuscaLocal(e.target.value)}
          placeholder="Buscar no estoque por nome..." 
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 transition-colors" 
        />
        <span className="absolute left-3.5 top-3.5 text-zinc-600 text-sm">🔍</span>
      </div>

      <div className="flex flex-col gap-3">
        {estoqueFiltrado.length === 0 ? (
          <p className="text-center py-6 text-xs text-zinc-600 border border-dashed border-zinc-800 rounded-xl">Nenhum produto encontrado.</p>
        ) : (
          estoqueFiltrado.map((prod) => (
            <div key={prod.id} className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-md">
              
              <div className="flex items-center justify-between gap-3 p-3">
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
                  <button 
                    type="button" 
                    onClick={() => abrirEdicaoInline(prod)} 
                    className={`p-2 transition-colors cursor-pointer rounded-lg ${idProdutoEditando === prod.id ? 'text-pink-500 bg-pink-950/20' : 'text-zinc-500 hover:text-pink-500'}`} 
                    title="Editar"
                  >
                    📝
                  </button>
                  <button type="button" onClick={() => handleDeletar(prod.id)} className="p-2 text-zinc-500 hover:text-red-500 transition-colors cursor-pointer" title="Deletar">🗑️</button>
                </div>
              </div>

                            {/* 🔥 CONTAINER ENCAPSULADO COMO DIV (Zero chance de b.o.) */}
              {idProdutoEditando === prod.id && (
                <div className="border-t border-zinc-800 p-4 bg-zinc-950 flex flex-col gap-3 text-white transition-all duration-300">
                  
                  <div className="text-[10px] font-black uppercase tracking-wider text-pink-500 mb-1">
                    ✏️ Editando: {prod.nome}
                  </div>

                  <div className="flex items-center gap-3 bg-zinc-900 p-2.5 rounded-xl border border-zinc-800 relative group overflow-hidden">
                    <img src={previewUrl || prod.imagem_url} alt="Preview" className="w-12 h-14 object-cover rounded border border-zinc-800 bg-zinc-950" />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-zinc-400">Alterar Imagem</span>
                      <span className="text-[9px] text-pink-500 font-bold hover:underline cursor-pointer">Clique para escolher</span>
                    </div>
                    <input type="file" accept="image/*" onChange={handleMudarImagem} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Nome</label>
                    <input type="text" value={nomeEdit} onChange={(e) => setNomeEdit(e.target.value)} required className="border border-zinc-800 p-2 rounded-lg text-xs bg-zinc-900 text-white focus:outline-none focus:border-pink-500 w-full" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Preço (R$)</label>
                    <input type="number" step="0.01" value={precoEdit} onChange={(e) => setPrecoEdit(e.target.value)} required className="border border-zinc-800 p-2 rounded-lg text-xs bg-zinc-900 text-white focus:outline-none focus:border-pink-500 w-full" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Subcategoria</label>
                    <input type="text" value={subCatEdit} onChange={(e) => setSubCatEdit(e.target.value)} required className="border border-zinc-800 p-2 rounded-lg text-xs bg-zinc-900 text-white focus:outline-none focus:border-pink-500 w-full" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Descrição</label>
                    <textarea rows={2} value={descEdit} onChange={(e) => setDescEdit(e.target.value)} required className="border border-zinc-800 p-2 rounded-lg text-xs bg-zinc-900 text-white focus:outline-none focus:border-pink-500 resize-none w-full" />
                  </div>

                  <div className="flex gap-2 mt-1">
                    {/* 🔥 Botão disparando handleSalvarEdicao direto no onClick */}
                    <button 
                      type="button" 
                      onClick={handleSalvarEdicao}
                      disabled={carregando}
                      className="flex-1 bg-pink-600 hover:bg-pink-500 text-white font-black py-2 rounded-xl text-[11px] uppercase tracking-wider transition-colors cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-600"
                    >
                      {carregando ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIdProdutoEditando(null)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold px-3 py-2 rounded-xl text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>

                </div>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
}

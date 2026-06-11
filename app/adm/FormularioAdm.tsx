'use client';

import { useState, useRef, ChangeEvent } from 'react';

export default function FormularioAdm() {
  // Controle de abas principais (Roupas, Acessórios, Cosméticos)
  const [abaAtiva, setAbaAtiva] = useState<'roupas' | 'acessorios' | 'cosmeticos'>('roupas');
  
  // Referências dos elementos do formulário
  const inputFileRef = useRef<HTMLInputElement>(null);
  const nomeRef = useRef<HTMLInputElement>(null);
  const precoRef = useRef<HTMLInputElement>(null);
  const descricaoRef = useRef<HTMLTextAreaElement>(null);
  const generoRef = useRef<HTMLSelectElement>(null);
  const tamanhoRef = useRef<HTMLSelectElement>(null);
  const subcategoriaRef = useRef<HTMLSelectElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [statusMensagem, setStatusMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);
  const [idProdutoEditando, setIdProdutoEditando] = useState<number | null>(null);

  const handleMudarImagem = (event: ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    setPreviewUrl(arquivo ? URL.createObjectURL(arquivo) : null);
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatusMensagem(null);

    if (!idProdutoEditando && !inputFileRef.current?.files?.length) {
      setStatusMensagem({ tipo: 'erro', texto: '⚠️ Selecione uma foto do produto!' });
      return;
    }

    setCarregando(true);
    const file = inputFileRef.current?.files?.[0];

    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      
      formData.append('nome', nomeRef.current?.value || '');
      formData.append('preco', precoRef.current?.value || '0');
      
      const cat = abaAtiva === 'roupas' ? 'Roupas' : abaAtiva === 'acessorios' ? 'Acessórios' : 'Cosméticos';
      formData.append('categoria', cat);
      
      formData.append('genero', generoRef.current?.value || '');
      formData.append('tamanho', tamanhoRef.current?.value || '');
      formData.append('subcategoria', subcategoriaRef.current?.value || '');
      formData.append('descricao', descricaoRef.current?.value || '');

      if (idProdutoEditando) {
        formData.append('id', idProdutoEditando.toString());
      }

      const rotaUrl = idProdutoEditando ? '/api/editar' : '/api/produtos';
      const response = await fetch(rotaUrl, { method: 'POST', body: formData });

      if (response.ok) {
        const msgSucesso = idProdutoEditando ? '✅ Alterações salvas!' : `✅ ${cat} cadastrado!`;
        setStatusMensagem({ tipo: 'sucesso', texto: msgSucesso });

        window.dispatchEvent(new Event("estoqueAtualizado"));

        setPreviewUrl(null);
        if (inputFileRef.current) inputFileRef.current.value = '';
        if (nomeRef.current) nomeRef.current.value = '';
        if (precoRef.current) precoRef.current.value = '';
        if (descricaoRef.current) descricaoRef.current.value = '';
        if (generoRef.current) generoRef.current.value = '';
        if (tamanhoRef.current) tamanhoRef.current.value = '';
        if (subcategoriaRef.current) subcategoriaRef.current.value = '';

        setTimeout(() => setStatusMensagem(null), 3000);
      } else {
        setStatusMensagem({ tipo: 'erro', texto: '❌ Erro ao salvar dados.' });
      }
    } catch (e) {
      console.error(e);
      setStatusMensagem({ tipo: 'erro', texto: '❌ Erro na conexão.' });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      {/* NOTIFICAÇÃO TOAST */}
      {statusMensagem && (
        <div className="fixed inset-x-4 bottom-6 z-50 flex justify-center pointer-events-none">
          <div className={`p-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border shadow-2xl backdrop-blur-md ${
            statusMensagem.tipo === 'sucesso' ? 'bg-zinc-900/95 text-emerald-400 border-emerald-500' : 'bg-red-950/95 text-red-400 border-red-500'
          }`}>
            <span>{statusMensagem.texto}</span>
          </div>
        </div>
      )}

      {/* FORMULÁRIO ULTRA COMPACTO */}
      <form onSubmit={handleUpload} className="flex flex-col gap-2.5 border border-zinc-900 p-4 rounded-xl bg-zinc-900 text-white w-full">
        
        {/* Cabeçalho do Form com Dropdown Embutido */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Novo Cadastro</span>
          
          <select 
            value={abaAtiva}
            onChange={(e) => {
              setAbaAtiva(e.target.value as any);
              if (generoRef.current) generoRef.current.value = '';
              if (tamanhoRef.current) tamanhoRef.current.value = '';
              if (subcategoriaRef.current) subcategoriaRef.current.value = '';
            }}
            className="bg-zinc-950 border border-zinc-800 text-[10px] font-bold uppercase px-2 py-1 rounded text-pink-500 focus:outline-none cursor-pointer"
          >
            <option value="roupas">👕 Roupas</option>
            <option value="acessorios">👜 Acessórios</option>
            <option value="cosmeticos">💄 Cosméticos</option>
          </select>
        </div>

        {/* Zona da Imagem Slim */}
        <div className="border border-dashed border-zinc-800 rounded-lg p-2 text-center bg-zinc-950 relative min-h-[60px] flex items-center justify-center group hover:border-pink-500/40 transition-colors">
          {previewUrl ? (
            <div className="flex items-center gap-3 z-10">
              <img src={previewUrl} alt="Preview" className="h-10 w-10 object-contain rounded border border-zinc-800 bg-zinc-900" />
              <button type="button" onClick={() => { setPreviewUrl(null); if (inputFileRef.current) inputFileRef.current.value = ''; }} className="text-[10px] text-pink-500 font-bold hover:underline">Remover</button>
            </div>
          ) : (
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">📸 Adicionar Foto do Produto</p>
          )}
          <input ref={inputFileRef} type="file" accept="image/*" required={!previewUrl} onChange={handleMudarImagem} className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>

        {/* Linha 1: Nome e Preço */}
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 flex flex-col gap-0.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Nome</label>
            <input ref={nomeRef} type="text" placeholder="Ex: Camiseta" required className="border border-zinc-800 p-2 rounded bg-zinc-950 text-xs text-white focus:outline-none focus:border-pink-500" />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Preço</label>
            <input ref={precoRef} type="number" step="0.01" placeholder="99.90" required className="border border-zinc-800 p-2 rounded bg-zinc-950 text-xs text-white focus:outline-none focus:border-pink-500" />
          </div>
        </div>

        {/* Linha 2: Filtros Dinâmicos Condicionais */}
        <div className="grid grid-cols-2 gap-2">
          {/* Gênero (Apenas para Roupas e Acessórios) */}
          {abaAtiva !== 'cosmeticos' && (
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Gênero</label>
              <select ref={generoRef} required className="border border-zinc-800 p-2 rounded bg-zinc-950 text-xs text-white focus:outline-none focus:border-pink-500">
                <option value="">Selecione</option>
                <option value="Masculino">Unissex / Masc</option>
                <option value="Feminino">Feminino</option>
              </select>
            </div>
          )}

          {/* Tamanho (Apenas para Roupas) */}
          {abaAtiva === 'roupas' && (
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Tamanho</label>
              <select ref={tamanhoRef} required className="border border-zinc-800 p-2 rounded bg-zinc-950 text-xs text-white focus:outline-none focus:border-pink-500">
                <option value="">Selecione</option>
                <option value="PP">PP</option>
                <option value="P">P</option>
                <option value="M">M</option>
                <option value="G">G</option>
                <option value="GG">GG</option>
                <option value="XG">XG</option>
                {Array.from({ length: 26 }, (_, i) => 19 + i).map(num => (
                  <option key={num} value={num.toString()}>{num}</option>
                ))}
              </select>
            </div>
          )}

          {/* Subcategoria para Acessórios ou Cosméticos ocupando espaço dinâmico */}
          {abaAtiva !== 'roupas' && (
            <div className="flex flex-col gap-0.5 className={abaAtiva === 'cosmeticos' ? 'col-span-2' : ''}">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Subcategoria</label>
              <select ref={subcategoriaRef} required className="border border-zinc-800 p-2 rounded bg-zinc-950 text-xs text-white focus:outline-none focus:border-pink-500">
                <option value="">Selecione</option>
                {abaAtiva === 'acessorios' ? (
                  <>
                    <option value="Relógio">Relógio</option>
                    <option value="Óculos">Óculos</option>
                    <option value="Boné">Boné</option>
                    <option value="Joias">Joias</option>
                    <option value="Outros">Outros</option>
                  </>
                ) : (
                  <>
                    <option value="Perfume">Perfume</option>
                    <option value="Creme">Creme</option>
                    <option value="Maquiagem">Maquiagem</option>
                    <option value="Outros">Outros</option>
                  </>
                )}
              </select>
            </div>
          )}
        </div>

        {/* Subcategoria exclusiva para Roupas (Ocupa linha inteira se for roupa) */}
        {abaAtiva === 'roupas' && (
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Subcategoria</label>
            <select ref={subcategoriaRef} required className="border border-zinc-800 p-2 rounded bg-zinc-950 text-xs text-white focus:outline-none focus:border-pink-500">
              <option value="">Selecione a subcategoria</option>
              <option value="Blusa">Blusa / Camiseta</option>
              <option value="Calça">Calça</option>
              <option value="Short">Short / Berma</option>
              <option value="Íntima">Moda Íntima</option>
              <option value="Calçados">Calçados</option>
            </select>
          </div>
        )}

        {/* Descrição Curta */}
        <div className="flex flex-col gap-0.5">
          <label className="text-[10px] font-bold text-zinc-400 uppercase">Descrição</label>
          <textarea ref={descricaoRef} rows={3} placeholder="Detalhes do produto..." required className="border border-zinc-800 p-2 rounded bg-zinc-950 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-pink-500 resize-none" />
        </div>

        {/* Botão Enviar Slim */}
        <button 
          type="submit" 
          disabled={carregando}
          className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 rounded-lg text-[11px] uppercase tracking-wider transition-colors cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed mt-1"
        >
          {carregando ? 'Salvando...' : 'Cadastrar Produto'}
        </button>

      </form>
    </>
  );
}
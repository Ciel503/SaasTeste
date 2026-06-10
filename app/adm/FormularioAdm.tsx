'use client';


import { useState, useRef, ChangeEvent } from 'react';

export default function FormularioAdm() {
  // Controle de abas principais (Roupas, Acessórios, Cosméticos)
  const [abaAtiva, setAbaAtiva] = useState<'roupas' | 'acessorios' | 'cosmeticos'>('roupas');
  
  // Referências dos elementos comuns do formulário
  const inputFileRef = useRef<HTMLInputElement>(null);
  const nomeRef = useRef<HTMLInputElement>(null);
  const precoRef = useRef<HTMLInputElement>(null);
  const descricaoRef = useRef<HTMLTextAreaElement>(null);
  
  // Referências dos elementos dinâmicos
  const generoRef = useRef<HTMLSelectElement>(null);
  const tamanhoRef = useRef<HTMLSelectElement>(null);
  const subcategoriaRef = useRef<HTMLSelectElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [statusMensagem, setStatusMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);
  const [idProdutoEditando, setIdProdutoEditando] = useState<number | null>(null); // Para controlar se estamos editando ou criando
  

  const handleMudarImagem = (event: ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    setPreviewUrl(arquivo ? URL.createObjectURL(arquivo) : null);
  };

    const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatusMensagem(null); // Limpa avisos anteriores antes de começar

    // 1. Se for cadastro novo, a foto é obrigatória. Se for edição, pode manter a antiga!
    if (!idProdutoEditando && !inputFileRef.current?.files?.length) {
      setStatusMensagem({ tipo: 'erro', texto: '⚠️ Selecione uma foto do produto!' });
      return;
    }

    setCarregando(true);
    const file = inputFileRef.current?.files?.[0]; // Captura o arquivo com segurança se houver

    try {
      const formData = new FormData();
      if (file) formData.append('file', file); // Só envia a foto se uma nova foi escolhida
      
      formData.append('nome', nomeRef.current?.value || '');
      formData.append('preco', precoRef.current?.value || '0');
      
      const cat = abaAtiva === 'roupas' ? 'Roupas' : abaAtiva === 'acessorios' ? 'Acessórios' : 'Cosméticos';
      formData.append('categoria', cat);
      
      formData.append('genero', generoRef.current?.value || '');
      formData.append('tamanho', tamanhoRef.current?.value || '');
      formData.append('subcategoria', subcategoriaRef.current?.value || '');
      formData.append('descricao', descricaoRef.current?.value || '');

      // 2. Se estiver editando, injeta o ID no FormData para a API saber quem atualizar
      if (idProdutoEditando) {
        formData.append('id', idProdutoEditando.toString());
      }

      // 3. Escolhe dinamicamente a API de cadastro ou a sua real de edição /api/editar
      const rotaUrl = idProdutoEditando ? '/api/editar' : '/api/roupas/upload';
      const response = await fetch(rotaUrl, { method: 'POST', body: formData });

      if (response.ok) {
        // 4. Mensagem inteligente baseada na ação, ativando o Toast flutuante (Sem usar alert)
        const msgSucesso = idProdutoEditando ? '✅ Alterações salvas com sucesso no Neon!' : `✅ ${cat} cadastrado(a) com sucesso!`;
        setStatusMensagem({ tipo: 'sucesso', texto: msgSucesso });

        // 5. SOLTA O GRITO: Avisa a ListaEstoque lá embaixo para atualizar na hora sem dar F5
        window.dispatchEvent(new Event("estoqueAtualizado"));

        // Limpa as referências e desliga o modo de edição automaticamente
              if (response.ok) {
        // Mensagem inteligente baseada na ação, ativando o Toast flutuante
        const msgSucesso = idProdutoEditando ? '✅ Alterações salvas com sucesso no Neon!' : `✅ ${cat} cadastrado(a) com sucesso!`;
        setStatusMensagem({ tipo: 'sucesso', texto: msgSucesso });

        // 🔥 SOLTA O GRITO: Avisa a ListaEstoque lá embaixo para atualizar na hora sem dar F5
        window.dispatchEvent(new Event("estoqueAtualizado"));

        // 🔥 LIMPEZA DIRETA: Reseta os campos para o próximo cadastro novo
        setPreviewUrl(null);
        if (inputFileRef.current) inputFileRef.current.value = '';
        if (nomeRef.current) nomeRef.current.value = '';
        if (precoRef.current) precoRef.current.value = '';
        if (descricaoRef.current) descricaoRef.current.value = '';
        if (generoRef.current) generoRef.current.value = '';
        if (tamanhoRef.current) tamanhoRef.current.value = '';
        if (subcategoriaRef.current) subcategoriaRef.current.value = '';

        // Faz o aviso flutuante sumir sozinho após 4 segundos
        setTimeout(() => setStatusMensagem(null), 4000);
      }

      } else {
        setStatusMensagem({ tipo: 'erro', texto: '❌ Erro ao salvar dados no Neon.' });
      }
    } catch (e) {
      console.error(e);
      setStatusMensagem({ tipo: 'erro', texto: '❌ Erro na conexão com o banco.' });
    } finally {
      setCarregando(false);
    }
  };


  return (
    <>
      {/* SELETOR DE ABAS PRINCIPAIS */}
      <div className="flex bg-zinc-200 p-1 rounded-xl mb-6 font-semibold border border-zinc-300">
        {(['roupas', 'acessorios', 'cosmeticos'] as const).map((aba) => (
          <button
            key={aba}
            type="button"
            onClick={() => {
              setAbaAtiva(aba);
              // Limpa os seletores dinâmicos ao trocar de aba para evitar lixo de estado
              if (generoRef.current) generoRef.current.value = '';
              if (tamanhoRef.current) tamanhoRef.current.value = '';
              if (subcategoriaRef.current) subcategoriaRef.current.value = '';
            }}
            className={`flex-1 text-xs py-2 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
              abaAtiva === aba ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            {aba === 'acessorios' ? 'Acessórios' : aba === 'cosmeticos' ? 'Cosméticos' : 'Roupas'}
          </button>
        ))}
      </div>

            {/* 🚨 NOTIFICAÇÃO FLUTUANTE (TOAST) NO VERDE ESMERALDA */}
      {statusMensagem && (
        <div className="fixed inset-x-4 bottom-20 sm:bottom-6 sm:left-auto sm:right-6 z-50 flex justify-center pointer-events-none animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`p-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 border shadow-2xl pointer-events-auto backdrop-blur-md ${
            statusMensagem.tipo === 'sucesso' 
              ? 'bg-zinc-900/95 text-emerald-400 border-emerald-500 shadow-emerald-500/10' // 🔥 Mudado para o verde esmeralda!
              : 'bg-red-950/95 text-red-400 border-red-500'
          }`}>
            {statusMensagem.tipo === 'sucesso' ? (
              /* Círculo Verde com o visto ✓ pulando */
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center text-[11px] font-black scale-110 animate-bounce">
                ✓
              </div>
            ) : (
              <span className="text-sm">⚠️</span>
            )}
            <span>{statusMensagem.texto}</span>
          </div>
        </div>
      )}





      <form onSubmit={handleUpload} className="flex flex-col gap-4 border border-zinc-800 p-5 rounded-2xl bg-zinc-900 shadow-xl text-white">
        
        {/* Foto */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Foto do Produto</label>
          <div className="border-2 border-dashed border-zinc-800 rounded-xl p-4 text-center bg-zinc-950 flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden group hover:border-pink-500/50 transition-colors">
            {previewUrl ? (
              <div className="w-full flex flex-col items-center gap-2 z-10">
                <img src={previewUrl} alt="Preview" className="max-h-[110px] w-auto object-contain rounded border border-zinc-800 bg-zinc-900" />
                <button type="button" onClick={() => { setPreviewUrl(null); if (inputFileRef.current) inputFileRef.current.value = ''; }} className="text-xs text-pink-500 font-bold hover:text-pink-400 transition-colors">Trocar Foto</button>
              </div>
            ) : (
              <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wide group-hover:text-zinc-400 transition-colors">📸 Adicionar Foto</p>
            )}
            <input ref={inputFileRef} type="file" accept="image/*" required={!previewUrl} onChange={handleMudarImagem} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
        </div>

        {/* Nome */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Nome</label>
          <input ref={nomeRef} type="text" placeholder="Ex: Camiseta Véstia Premium" required className="border border-zinc-800 p-3 rounded-lg text-sm bg-zinc-950 text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 transition-colors w-full" />
        </div>

        {/* Preço */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Preço (R$)</label>
          <input ref={precoRef} type="number" step="0.01" placeholder="99.90" required className="border border-zinc-800 p-3 rounded-lg text-sm bg-zinc-950 text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 transition-colors w-full" />
        </div>

        {/* Gênero */}
        {abaAtiva !== 'cosmeticos' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Gênero</label>
            <select ref={generoRef} required className="border border-zinc-800 p-3 rounded-lg text-sm bg-zinc-950 text-white focus:outline-none focus:border-pink-500 transition-colors w-full">
              <option value="" className="bg-zinc-900 text-zinc-500">Selecione o gênero</option>
              <option value="Masculino" className="bg-zinc-900 text-white">🙋‍♂️ Masculino</option>
              <option value="Feminino" className="bg-zinc-900 text-white">🙋‍♀️ Feminino</option>
            </select>
          </div>
        )}

        {/* Tamanho / Numeração */}
        {abaAtiva === 'roupas' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Tamanho / Numeração</label>
            <select ref={tamanhoRef} required className="border border-zinc-800 p-3 rounded-lg text-sm bg-zinc-950 text-white focus:outline-none focus:border-pink-500 transition-colors w-full">
              <option value="" className="bg-zinc-900 text-zinc-500">Selecione o tamanho</option>
              <option value="PP" className="bg-zinc-900 text-white">PP</option>
              <option value="P" className="bg-zinc-900 text-white">P</option>
              <option value="M" className="bg-zinc-900 text-white">M</option>
              <option value="G" className="bg-zinc-900 text-white">G</option>
              <option value="GG" className="bg-zinc-900 text-white">GG</option>
              <option value="XG" className="bg-zinc-900 text-white">XG</option>
              {/* Loop inteligente dos tamanhos de calçados do 19 ao 44 */}
              {Array.from({ length: 26 }, (_, i) => 19 + i).map(num => (
                <option key={num} value={num.toString()} className="bg-zinc-900 text-white">{num}</option>
              ))}
            </select>
          </div>
        )}

        {/* Subcategoria */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Subcategoria</label>
          <select ref={subcategoriaRef} required className="border border-zinc-800 p-3 rounded-lg text-sm bg-zinc-950 text-white focus:outline-none focus:border-pink-500 transition-colors w-full">
            <option value="" className="bg-zinc-900 text-zinc-500">Selecione a subcategoria</option>
            {abaAtiva === 'roupas' ? (
              <>
                <option value="Blusa" className="bg-zinc-900 text-white">Blusa</option>
                <option value="Calça" className="bg-zinc-900 text-white">Calça</option>
                <option value="Short" className="bg-zinc-900 text-white">Short</option>
                <option value="Íntima" className="bg-zinc-900 text-white">Íntima</option>
                <option value="Calçados" className="bg-zinc-900 text-white">Calçados</option>
              </>
            ) : abaAtiva === 'acessorios' ? (
              <>
                <option value="Relógio" className="bg-zinc-900 text-white">Relógio</option>
                <option value="Óculos" className="bg-zinc-900 text-white">Óculos</option>
                <option value="Boné" className="bg-zinc-900 text-white">Boné</option>
                <option value="Joias" className="bg-zinc-900 text-white">Joias</option>
                <option value="Outros" className="bg-zinc-900 text-white">Outros</option>
              </>
            ) : (
              <>
                <option value="Perfume" className="bg-zinc-900 text-white">Perfume</option>
                <option value="Creme" className="bg-zinc-900 text-white">Creme</option>
                <option value="Maquiagem" className="bg-zinc-900 text-white">Maquiagem</option>
                <option value="Outros" className="bg-zinc-900 text-white">Outros</option>
              </>
            )}
          </select>
        </div>

        {/* Descrição */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Descrição</label>
          <textarea ref={descricaoRef} rows={3} placeholder="Diga os detalhes da peça, tecido, composição..." required className="border border-zinc-800 p-3 rounded-lg text-sm bg-zinc-950 text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 transition-colors resize-none w-full" />
        </div>

        {/* Botão Cadastrar */}
        <button 
          type="submit" 
          disabled={carregando}
          className="w-full bg-pink-600 hover:bg-pink-500 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed mt-2 shadow-lg shadow-pink-600/10"
        >
          {carregando ? 'Salvando no Neon...' : 'Cadastrar Produto'}
        </button>

      </form>

    </>
  );
}
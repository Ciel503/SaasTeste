'use client';

import { useState, useRef, ChangeEvent } from 'react';

export default function FormularioAdm() {
  // Controle de abas principais (Roupas, Acessórios, Cosméticos)
  const [abaAtiva, setAbaAtiva] = useState<'roupas' | 'acessorios' | 'cosmeticos'>('roupas');
  
  // Referências dos elementos textuais do formulário
  const nomeRef = useRef<HTMLInputElement>(null);
  const precoRef = useRef<HTMLInputElement>(null);
  const descricaoRef = useRef<HTMLTextAreaElement>(null);
  const generoRef = useRef<HTMLSelectElement>(null);
  const tamanhoRef = useRef<HTMLSelectElement>(null);
  const subcategoriaRef = useRef<HTMLSelectElement>(null);

  // Array de referências para os 4 inputs de arquivos individuais
  const inputFilesRef = useRef<(HTMLInputElement | null)[]>([]);

  // Estado para armazenar as URLs de preview de cada uma das 4 posições
  const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([null, null, null, null]);
  const [carregando, setCarregando] = useState(false);
  const [statusMensagem, setStatusMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);
  const [idProdutoEditando, setIdProdutoEditando] = useState<number | null>(null);

  // Gerencia a alteração de imagem baseado no índice (0 a 3)
  const handleMudarImagem = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const arquivo = event.target.files?.[0];
    
    setPreviewUrls((prev) => {
      const novasUrls = [...prev];
      novasUrls[index] = arquivo ? URL.createObjectURL(arquivo) : null;
      return novasUrls;
    });
  };

  // Remove a imagem de um índice específico
  const handleRemoverImagem = (index: number) => {
    setPreviewUrls((prev) => {
      const novasUrls = [...prev];
      novasUrls[index] = null;
      return novasUrls;
    });
    
    if (inputFilesRef.current[index]) {
      inputFilesRef.current[index]!.value = '';
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatusMensagem(null);

    // Validação: Exige ao menos a imagem principal (index 0) para novos cadastros
    if (!idProdutoEditando && !previewUrls[0]) {
      setStatusMensagem({ tipo: 'erro', texto: '⚠️ Selecione ao menos a Imagem 1 (Principal)!' });
      return;
    }

    setCarregando(true);

    try {
      const formData = new FormData();
      
      // Percorre os 4 inputs coletando os arquivos que existem
      inputFilesRef.current.forEach((input, index) => {
        const arquivo = input?.files?.[0];
        if (arquivo) {
          // Enviamos com chaves indexadas (ex: file0, file1...) para facilitar no back-end
          formData.append(`file${index}`, arquivo);
        }
      });
      
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

        // Reseta todos os previews e inputs de arquivos
        setPreviewUrls([null, null, null, null]);
        inputFilesRef.current.forEach((input) => {
          if (input) input.value = '';
        });

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

        {/* Bloco de Legenda das Fotos */}
        <label className="text-[10px] font-bold text-zinc-400 uppercase -mb-1.5">Fotos do Produto (Máx 4)</label>

        {/* Grid de 4 Inputs Individuais Lado a Lado (Estilo 2x2 ou linha compacta) */}
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3].map((index) => (
            <div 
              key={index} 
              className="border border-dashed border-zinc-800 rounded-lg h-14 bg-zinc-950 relative flex flex-col items-center justify-center group hover:border-pink-500/40 transition-colors overflow-hidden p-0.5"
            >
              {previewUrls[index] ? (
                <div className="absolute inset-0 z-10 bg-zinc-950 flex flex-col items-center justify-between p-1">
                  <img 
                    src={previewUrls[index]!} 
                    alt={`Preview ${index + 1}`} 
                    className="h-8 w-full object-contain rounded bg-zinc-900" 
                  />
                  <button 
                    type="button" 
                    onClick={() => handleRemoverImagem(index)} 
                    className="text-[8px] text-pink-500 font-extrabold hover:underline uppercase tracking-tight"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center pointer-events-none text-center">
                  <span className="text-[14px] text-zinc-600 font-bold">{index + 1}</span>
                  <span className="text-[7px] text-zinc-500 font-bold uppercase tracking-tight">Foto</span>
                </div>
              )}
              
              <input 
                ref={(el) => { inputFilesRef.current[index] = el; }} 
                type="image/*" // Corrigido de "image/*" para tipo "file" para o seletor abrir corretamente
                className="hidden" 
              />
              {/* Ajustado para input tipo file padrão oculto controlado pelo clique na div */}
              <input 
                ref={(el) => { inputFilesRef.current[index] = el; }}
                type="file" 
                accept="image/*" 
                onChange={(e) => handleMudarImagem(e, index)} 
                className="absolute inset-0 opacity-0 cursor-pointer z-0" 
              />
            </div>
          ))}
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
            <div className={`flex flex-col gap-0.5 ${abaAtiva === 'cosmeticos' ? 'col-span-2' : ''}`}>
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
          className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 rounded text-xs uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {carregando ? 'Salvando...' : idProdutoEditando ? 'Salvar Alterações' : 'Cadastrar Produto'}
        </button>
      </form>
    </>
  );
}


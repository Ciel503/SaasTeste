'use client';

import { useState, useRef, ChangeEvent } from 'react';

export default function AdmPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const nomeRef = useRef<HTMLInputElement>(null);
  const precoRef = useRef<HTMLInputElement>(null);
  const descricaoRef = useRef<HTMLTextAreaElement>(null);
  const tamanhoRef = useRef<HTMLSelectElement>(null);
  const generoRef = useRef<HTMLSelectElement>(null);
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleMudarImagem = (event: ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    if (arquivo) {
      setPreviewUrl(URL.createObjectURL(arquivo));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputFileRef.current?.files?.length) {
      alert("Selecione uma foto da roupa!");
      return;
    }

    setCarregando(true);
    const file = inputFileRef.current.files[0];

    try {
      // Enviamos o arquivo no body e os textos nos Headers para a rota ler
      const response = await fetch(`/api/roupas/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
        headers: {
          'x-nome': nomeRef.current?.value || '',
          'x-preco': precoRef.current?.value || '0',
          'x-genero': generoRef.current?.value || '',
          'x-tamanho': tamanhoRef.current?.value || '',
          'x-descricao': descricaoRef.current?.value || '',
        }
      });

      if (response.ok) {
        alert("Produto e foto salvos com sucesso no Neon!");
        
        // Limpa o formulário automaticamente após o sucesso
        setPreviewUrl(null);
        if (inputFileRef.current) inputFileRef.current.value = '';
        if (nomeRef.current) nomeRef.current.value = '';
        if (precoRef.current) precoRef.current.value = '';
        if (descricaoRef.current) descricaoRef.current.value = '';
        if (tamanhoRef.current) tamanhoRef.current.value = '';
        if (generoRef.current) generoRef.current.value = '';
      } else {
        alert("Erro ao salvar produto.");
      }

    } catch (error) {
      console.error("Erro no envio:", error);
      alert("Houve um erro na conexão.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto text-black">
      <h1 className="text-2xl font-bold mb-6 text-center">Painel ADM - Cadastrar Roupa</h1>
      <h2>atualização 6</h2>

      <form onSubmit={handleUpload} className="flex flex-col gap-4 border p-6 rounded-lg bg-white shadow">
        
        {/* Foto */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Foto da Peça</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 flex flex-col items-center justify-center min-h-[180px] relative overflow-hidden">
            {previewUrl ? (
              <div className="w-full flex flex-col items-center gap-2">
                <img src={previewUrl} alt="Preview" className="max-h-[140px] w-auto object-contain rounded border bg-white" />
                <button type="button" onClick={() => { setPreviewUrl(null); if (inputFileRef.current) inputFileRef.current.value = ''; }} className="text-xs text-red-500 hover:underline">Trocar foto</button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <span className="text-gray-400 text-3xl mb-1">📸</span>
                <p className="text-xs text-gray-500">Selecione a foto</p>
              </div>
            )}
            <input name="file" ref={inputFileRef} type="file" accept="image/jpeg, image/png, image/webp" required onChange={handleMudarImagem} className={`absolute inset-0 opacity-0 cursor-pointer ${previewUrl ? 'hidden' : ''}`} />
          </div>
        </div>

        {/* Nome */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Nome da Roupa</label>
          <input ref={nomeRef} type="text" placeholder="Ex: Camiseta Oversized" required className="border p-2 rounded text-black bg-white" />
        </div>

        {/* Preço */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Preço (R$)</label>
          <input ref={precoRef} type="number" step="0.01" placeholder="99.90" required className="border p-2 rounded text-black bg-white" />
        </div>

        {/* Gênero */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Gênero</label>
          <select ref={generoRef} required className="border p-2 rounded text-black bg-white">
            <option value="">Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Unissex">Unissex</option>
          </select>
        </div>

        {/* Tamanho */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Tamanho</label>
          <select ref={tamanhoRef} required className="border p-2 rounded text-black bg-white">
            <option value="">Selecione</option>
            <option value="P">P</option>
            <option value="M">M</option>
            <option value="G">G</option>
            <option value="GG">GG</option>
          </select>
        </div>

        {/* Descrição */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Descrição</label>
          <textarea ref={descricaoRef} rows={3} placeholder="Detalhes do tecido..." required className="border p-2 rounded text-black bg-white resize-none" />
        </div>

        <button type="submit" disabled={carregando} className="bg-black text-white p-3 rounded-lg font-semibold disabled:bg-gray-400 mt-2">
          {carregando ? 'Cadastrando tudo...' : 'Cadastrar Produto'}
        </button>
      </form>
    </div>
  );
}

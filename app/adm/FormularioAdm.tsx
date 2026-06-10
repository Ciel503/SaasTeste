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

  const handleMudarImagem = (event: ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    setPreviewUrl(arquivo ? URL.createObjectURL(arquivo) : null);
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputFileRef.current?.files?.length) {
      alert("Selecione uma foto do produto!");
      return;
    }

    setCarregando(true);
    const file = inputFileRef.current.files[0];

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('nome', nomeRef.current?.value || '');
      formData.append('preco', precoRef.current?.value || '0');
      
      // Define a categoria máster com base na aba ativa
      const cat = abaAtiva === 'roupas' ? 'Roupas' : abaAtiva === 'acessorios' ? 'Acessórios' : 'Cosméticos';
      formData.append('categoria', cat);
      
      // Envia os dados específicos (se houverem)
      formData.append('genero', generoRef.current?.value || '');
      formData.append('tamanho', tamanhoRef.current?.value || '');
      formData.append('subcategoria', subcategoriaRef.current?.value || '');
      formData.append('descricao', descricaoRef.current?.value || '');

      const response = await fetch(`/api/roupas/upload`, { method: 'POST', body: formData });

      if (response.ok) {
        alert(`${cat} cadastrado(a) com sucesso no Neon!`);
        setPreviewUrl(null);
        if (inputFileRef.current) inputFileRef.current.value = '';
        if (nomeRef.current) nomeRef.current.value = '';
        if (precoRef.current) precoRef.current.value = '';
        if (descricaoRef.current) descricaoRef.current.value = '';
        if (generoRef.current) generoRef.current.value = '';
        if (tamanhoRef.current) tamanhoRef.current.value = '';
        if (subcategoriaRef.current) subcategoriaRef.current.value = '';
      } else {
        alert("Erro ao salvar produto.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro na conexão.");
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

      {/* FORMULÁRIO DINÂMICO UNIFICADO */}
      <form onSubmit={handleUpload} className="flex flex-col gap-4 border border-zinc-200 p-5 rounded-2xl bg-white shadow-sm">
        
        {/* Foto */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Foto</label>
          <div className="border-2 border-dashed border-zinc-300 rounded-xl p-4 text-center bg-zinc-50 flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden">
            {previewUrl ? (
              <div className="w-full flex flex-col items-center gap-2 z-10">
                <img src={previewUrl} alt="Preview" className="max-h-[100px] w-auto object-contain rounded border bg-white" />
                <button type="button" onClick={() => { setPreviewUrl(null); if (inputFileRef.current) inputFileRef.current.value = ''; }} className="text-xs text-red-500 font-semibold hover:underline">Trocar</button>
              </div>
            ) : (
              <p className="text-[11px] text-zinc-400 font-medium">📸 Escolha a Imagem</p>
            )}
            <input ref={inputFileRef} type="file" accept="image/*" required={!previewUrl} onChange={handleMudarImagem} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
        </div>

        {/* Nome */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Nome</label>
          <input ref={nomeRef} type="text" placeholder="Nome do produto" required className="border p-2.5 rounded-lg text-sm bg-white focus:outline-none focus:border-pink-500" />
        </div>

        {/* Preço */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Preço (R$)</label>
          <input ref={precoRef} type="number" step="0.01" placeholder="99.90" required className="border p-2.5 rounded-lg text-sm bg-white focus:outline-none" />
        </div>

        {/* Gênero (Exibe para Roupas e Acessórios, oculta em Cosméticos) */}
        {abaAtiva !== 'cosmeticos' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Gênero</label>
            <select ref={generoRef} required className="border p-2.5 rounded-lg text-sm bg-white focus:outline-none">
              <option value="">Selecione</option>
              <option value="Masculino">🙋‍♂️ Masculino</option>
              <option value="Feminino">🙋‍♀️ Feminino</option>
            </select>
          </div>
        )}

        {/* Tamanho (Exibido para Roupas. Nota: Se for Calçado, pode salvar o tamanho como texto ou número livre) */}
       {/* Tamanho (Exibido para Roupas. Atualizado com numerações menores!) */}
{abaAtiva === 'roupas' && (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Tamanho / Numeração</label>
    <select ref={tamanhoRef} required className="border p-2.5 rounded-lg text-sm bg-white focus:outline-none">
      <option value="">Selecione</option>
      
      {/* Grade de Letras padrão */}
      <option value="PP">PP</option>
      <option value="P">P</option>
      <option value="M">M</option>
      <option value="G">G</option>
      <option value="GG">GG</option>
      <option value="XG">XG</option>

      {/* Grade de Calçados Completa (Do 33 ao 44) */}
      <option value="19">19</option>
      <option value="20">20</option>
      <option value="21">21</option>
      <option value="22">22</option>
      <option value="23">23</option>
      <option value="24">24</option>
      <option value="25">25</option>
      <option value="26">26</option>
      <option value="27">27</option>
      <option value="28">28</option>
      <option value="29">29</option>
      <option value="30">30</option>
      <option value="31">31</option>
      <option value="32">32</option>
      <option value="33">33</option>
      <option value="34">34</option>
      <option value="35">35</option>
      <option value="36">36</option>
      <option value="37">37</option>
      <option value="38">38</option>
      <option value="39">39</option>
      <option value="40">40</option>
      <option value="41">41</option>
      <option value="42">42</option>
      <option value="43">43</option>
      <option value="44">44</option>
    </select>
  </div>
)}


        {/* Subcategoria Dinâmica */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Subcategoria</label>
          <select ref={subcategoriaRef} required className="border p-2.5 rounded-lg text-sm bg-white focus:outline-none">
            <option value="">Selecione</option>
            {/* Opções de Roupas (Calçados incluído aqui!) */}
            {abaAtiva === 'roupas' && (
              <>
                <option value="Blusa">Blusa</option>
                <option value="Calça">Calça</option>
                <option value="Short">Short</option>
                <option value="Íntima">Íntima</option>
                <option value="Calçados">Calçados (Tênis/Sapato)</option>
              </>
            )}
            {/* Opções de Acessórios (Sem Pulseira) */}
            {abaAtiva === 'acessorios' && (
              <>
                <option value="Relógio">Relógio</option>
                <option value="Óculos">Óculos</option>
                <option value="Boné">Boné</option>
                <option value="Joias">Joias / Pulseiras</option>
                <option value="Outros">Outros</option>
              </>
            )}
            {/* Opções de Cosméticos */}
            {abaAtiva === 'cosmeticos' && (
              <>
                <option value="Perfume">Perfume</option>
                <option value="Creme">Creme / Hidratante</option>
                <option value="Maquiagem">Maquiagem</option>
                <option value="Outros">Outros</option>
              </>
            )}
          </select>
        </div>

        {/* Descrição */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Descrição</label>
          <textarea ref={descricaoRef} rows={3} placeholder="Detalhes do produto..." required className="border p-2.5 rounded-lg text-sm bg-white resize-none focus:outline-none focus:border-pink-500" />
        </div>

        {/* Botão Submeter */}
        <button type="submit" disabled={carregando} className="bg-zinc-950 text-white p-3 rounded-xl font-bold text-xs uppercase tracking-wider disabled:bg-zinc-400 mt-2 hover:bg-pink-600 transition-colors cursor-pointer">
          {carregando ? 'Cadastrando...' : 'Cadastrar Produto'}
        </button>
      </form>
    </>
  );
}
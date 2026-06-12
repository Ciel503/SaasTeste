import { neon } from "@neondatabase/serverless";
import BotaoCarrinho from "../components/botaocarrinho"; 
import CardProdutoClient from "../components/CardProdutoClient";

// Força o Next.js a renderizar a página de forma dinâmica, impedindo cache travado de build
export const dynamic = 'force-dynamic';

interface Produto {
  id: number;
  nome: string;
  preco: string;
  categoria: string;     
  genero: string | null; 
  subcategoria: string;
  tamanho: string | null; 
  descricao: string;
  imagem1: string;       
  imagem2: string | null; 
  imagem3: string | null; 
  imagem4: string | null; 
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string }>;
}) {
  const sql = neon(`${process.env.FRANeon_DATABASE_URL}`);

  const params = await searchParams;
  const termoBusca = params.busca || "";

  let produtos: Produto[] = [];

  // Busca as 4 colunas de imagens direto do Neon no servidor
  if (termoBusca.trim() !== "") {
    const termoQuery = `%${termoBusca}%`;
    produtos = (await sql`
      SELECT id, nome, preco, categoria, genero, subcategoria, tamanho, descricao, imagem1, imagem2, imagem3, imagem4 
      FROM produtos 
      WHERE nome ILIKE ${termoQuery} 
         OR descricao ILIKE ${termoQuery} 
         OR subcategoria ILIKE ${termoQuery}
         OR categoria ILIKE ${termoQuery}
      ORDER BY id DESC
    `) as Produto[];
  } else {
    produtos = (await sql`
      SELECT id, nome, preco, categoria, genero, subcategoria, tamanho, descricao, imagem1, imagem2, imagem3, imagem4 
      FROM produtos 
      ORDER BY id DESC
    `) as Produto[];
  }

  return (
    <div className="w-full bg-zinc-50 min-h-screen pb-20">
      
      {/* VITRINE */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
        <div className="flex flex-col mb-6 px-1">
          <h2 className="text-base sm:text-lg font-black tracking-tight uppercase text-zinc-900">
            {termoBusca ? `Resultados para: "${termoBusca}"` : "Destaques"}
          </h2>
          <span className="text-xs text-zinc-500">Todos os produtos disponíveis ({produtos.length} itens).</span>
        </div>

        {produtos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border p-6">
            <p className="text-zinc-500 text-sm">Nenhum produto cadastrado ainda.</p>
            <p className="text-xs text-zinc-400 mt-1">Acesse o painel /adm para inaugurar o novo banco!</p>
          </div>
        ) : (
          /* Grid unificado chamando o componente com o Modal embutido */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {produtos.map((produto) => (
              <CardProdutoClient key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

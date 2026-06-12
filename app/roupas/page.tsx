import { neon } from "@neondatabase/serverless";
import CardProdutoClient from "../../components/CardProdutoClient";

// Força o Next.js a rodar de forma dinâmica para trazer novos produtos sem precisar de re-build
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

export default async function PaginaCategoria() {
  const sql = neon(`${process.env.FRANeon_DATABASE_URL}`);

  // IMPORTANTE: Altere este termo conforme a pasta/página atual!
  // Use 'Roupas', 'Acessórios' ou 'Cosméticos' (com acento para bater com o banco)
  const categoriaAlvo = "Roupas"; 

  // Busca do banco Neon trazendo as 4 imagens filtradas por categoria
  const produtos = (await sql`
    SELECT id, nome, preco, categoria, genero, subcategoria, tamanho, descricao, imagem1, imagem2, imagem3, imagem4 
    FROM produtos 
    WHERE categoria = ${categoriaAlvo}
    ORDER BY id DESC
  `) as Produto[];

  return (
    <div className="w-full bg-zinc-50 min-h-screen pb-20">
      
      <section className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
        <div className="flex flex-col mb-6 px-1">
          <h2 className="text-base sm:text-lg font-black tracking-tight uppercase text-zinc-900">
            ✨ Categoria: {categoriaAlvo}
          </h2>
          <span className="text-xs text-zinc-500">
            {produtos.length === 0 
              ? "Nenhum item disponível nesta categoria." 
              : `Aproveite nossa seleção exclusiva (${produtos.length} itens).`}
          </span>
        </div>

        {produtos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border p-6">
            <p className="text-zinc-500 text-sm">Nenhum produto encontrado.</p>
            <p className="text-xs text-zinc-400 mt-1">Adicione novos itens nesta categoria pelo painel /adm.</p>
          </div>
        ) : (
          /* O mesmo grid da Home, aproveitando o carrossel sem reescrever código */
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

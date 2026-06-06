import { neon } from "@neondatabase/serverless";
// Importa o novo botão que criamos no Passo 1
import BotaoCarrinho from "../components/botaocarrinho"; 
// Força o Next.js a renderizar a página de forma dinâmica, impedindo cache travado de build
export const dynamic = 'force-dynamic';


interface Produto {
  id: number;
  nome: string;
  preco: string;
  genero: string;
  tamanho: string;
  descricao: string;
  imagem_url: string;
}

export default async function Home() {
  const sql = neon(`${process.env.FRANeon_DATABASE_URL}`);

  const produtos = (await sql`
    SELECT id, nome, preco, genero, tamanho, descricao, imagem_url 
    FROM produtos 
    ORDER BY id DESC
  `) as Produto[];

  return (
    <div className="w-full bg-zinc-50 min-h-screen">
      
      {/* SEÇÃO HERO */}
      <section className="w-full bg-zinc-950 py-12 text-center text-white px-4">
        <span className="text-pink-500 font-bold tracking-widest text-[10px] uppercase bg-pink-950/50 px-2.5 py-1 rounded-full border border-pink-500/30">
          Catálogo Real
        </span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase mt-2">
          Estilo VÉSTIA
        </h1>
        <p className="text-zinc-400 text-xs mt-1">Sua vitrine de moda local sincronizada com o Neon.</p>
      </section>

      {/* VITRINE */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
        <div className="flex flex-col mb-6 px-1">
          <h2 className="text-base sm:text-lg font-black tracking-tight uppercase text-zinc-900">Destaques</h2>
          <p className="text-xs text-zinc-500">Produtos disponíveis no catálogo real ({produtos.length} itens).</p>
        </div>

        {produtos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border p-6">
            <p className="text-zinc-500 text-sm">Nenhuma roupa cadastrada ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {produtos.map((produto) => (
              <div 
                key={produto.id} 
                className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                
                {/* IMAGEM */}
                <div className="w-full h-40 sm:h-52 bg-zinc-100 relative overflow-hidden border-b border-zinc-100 flex items-center justify-center">
                  <img 
                    src={produto.imagem_url} 
                    alt={produto.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-2 right-2 bg-zinc-950/80 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {produto.tamanho}
                  </span>
                </div>

                {/* CONTEÚDO */}
                <div className="p-2 sm:p-3 flex flex-col flex-1 gap-1">
                  <span className="text-[9px] font-semibold text-pink-600 uppercase tracking-wider">
                    {produto.genero}
                  </span>

                  <h3 className="text-xs sm:text-sm font-bold text-zinc-900 line-clamp-1 group-hover:text-pink-600 transition-colors">
                    {produto.nome}
                  </h3>
                  
                  <p className="text-[10px] sm:text-xs text-zinc-500 leading-tight line-clamp-2 flex-1">
                    {produto.descricao}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-100">
                    <span className="text-[11px] sm:text-sm font-black text-zinc-900">
                      R$ {Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>

                    {/* SUBSTUIÇÃO AQUI: O botão inteligente assume o controle */}
                    <BotaoCarrinho produto={produto} />
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

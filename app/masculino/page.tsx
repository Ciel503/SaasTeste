import { neon } from "@neondatabase/serverless";
import BotaoCarrinho from "../../components/botaocarrinho";

interface Produto {
  id: number;
  nome: string;
  preco: string;
  genero: string;
  tamanho: string;
  descricao: string;
  imagem_url: string;
}

export default async function MasculinoPage() {
  // 1. Conecta ao Neon
  const sql = neon(`${process.env.FRANeon_DATABASE_URL}`);

  // 2. Busca APENAS os produtos masculinos ordenados pelos mais novos
  const produtos = (await sql`
    SELECT id, nome, preco, genero, tamanho, descricao, imagem_url 
    FROM produtos 
    WHERE genero = 'Masculino'
    ORDER BY id DESC
  `) as Produto[];

  return (
    <div className="w-full bg-zinc-50 min-h-screen pb-20">
      
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col mb-6 px-1">
          <h2 className="text-base sm:text-lg font-black tracking-tight uppercase text-zinc-900">
            Coleção Masculina
          </h2>
          <p className="text-xs text-zinc-500">
            {produtos.length} {produtos.length === 1 ? 'produto encontrado' : 'produtos encontrados'}.
          </p>
        </div>

        {/* VALIDAÇÃO: Se não houver roupas masculinas ainda */}
        {produtos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border p-6 shadow-xs">
            <p className="text-zinc-500 text-sm">Nenhum produto masculino cadastrado ainda.</p>
            <p className="text-xs text-zinc-400 mt-1">Cadastre novas peças masculinas no painel /adm!</p>
          </div>
        ) : (
          /* GRADE DE PRODUTOS FILTRADOS */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {produtos.map((produto) => (
              <div 
                key={produto.id} 
                className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
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
                      R$ {Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>

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

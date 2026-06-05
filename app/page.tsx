import { ShoppingCart, Shirt, User, Sparkles, Footprints } from "lucide-react";

// DADOS DOS PRODUTOS - Usando componentes de ícones no lugar de arquivos de imagem externos
const PRODUTOS_DESTAQUE = [
  {
    id: 1,
    nome: "Jaqueta Puffer Streetwear",
    descricao: "Jaqueta térmica acolchoada com isolamento leve e capuz removível.",
    preco: "R$ 349,90",
    icone: <Shirt className="w-10 h-10 text-zinc-400 group-hover:text-pink-500 transition-colors" />
  },
  {
    id: 2,
    nome: "Vestido Midi Canelado Premium",
    descricao: "Confeccionado em malha de alta elasticidade que se ajusta ao corpo.",
    preco: "R$ 189,90",
    icone: <Sparkles className="w-10 h-10 text-zinc-400 group-hover:text-pink-500 transition-colors" />
  },
  {
    id: 3,
    nome: "Conjunto Moletom Oversized",
    descricao: "Blusa com bolso canguru e calça jogger em algodão felpado.",
    preco: "R$ 279,90",
    icone: <User className="w-10 h-10 text-zinc-400 group-hover:text-pink-500 transition-colors" />
  },
  {
    id: 4,
    nome: "Calça Alfaiataria Moderna",
    descricao: "Modelagem slim com pregas frontais e tecido de ótimo caimento.",
    preco: "R$ 219,90",
    icone: <Footprints className="w-10 h-10 text-zinc-400 group-hover:text-pink-500 transition-colors" />
  },
];

export default function Home() {
  return (
    <div className="w-full bg-zinc-50 min-h-screen">
      
      {/* SEÇÃO HERO COMPACTA E SIMPLES */}
      <section className="w-full bg-zinc-950 py-12 text-center text-white px-4">
        <span className="text-pink-500 font-bold tracking-widest text-[10px] uppercase bg-pink-950/50 px-2.5 py-1 rounded-full border border-pink-500/30">
          Nova Coleção
        </span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase mt-2">
          Estilo VÉSTIA
        </h1>
        <p className="text-zinc-400 text-xs mt-1">Sua vitrine de moda local.</p>
      </section>

      {/* VITRINE SIMPLES */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
        <div className="flex flex-col mb-6 px-1">
          <h2 className="text-base sm:text-lg font-black tracking-tight uppercase text-zinc-900">Destaques</h2>
          <p className="text-xs text-zinc-500">Produtos disponíveis no catálogo.</p>
        </div>

        {/* GRADE DE CARTÕES (2 colunas no celular, 4 no PC) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {PRODUTOS_DESTAQUE.map((produto) => (
            <div 
              key={produto.id} 
              className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              
              {/* ÁREA DA IMAGEM SUBSTITUÍDA POR UM QUADRADO COM ÍCONE CENTRALIZADO */}
              <div className="w-full h-32 sm:h-40 bg-zinc-100 flex items-center justify-center border-b border-zinc-100">
                {produto.icone}
              </div>

              {/* CONTEÚDO DO CARTÃO */}
              <div className="p-2 sm:p-3 flex flex-col flex-1 gap-1">
                
                <h3 className="text-xs sm:text-sm font-bold text-zinc-900 line-clamp-1 group-hover:text-pink-600 transition-colors">
                  {produto.nome}
                </h3>
                
                <p className="text-[10px] sm:text-xs text-zinc-500 leading-tight line-clamp-2 flex-1">
                  {produto.descricao}
                </p>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-100">
                  <span className="text-[11px] sm:text-sm font-black text-zinc-900">
                    {produto.preco}
                  </span>

                  <button className="bg-zinc-950 text-white p-1.5 sm:p-2 rounded-lg hover:bg-pink-600 transition-colors">
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

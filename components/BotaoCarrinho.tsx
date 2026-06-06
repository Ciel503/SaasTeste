'use client';

import { ShoppingCart } from "lucide-react";

interface BotaoCarrinhoProps {
  produto: {
    id: number;
    nome: string;
    preco: string;
    imagem_url: string;
  };
}

export default function BotaoCarrinho({ produto }: BotaoCarrinhoProps) {
  const adicionarAoCarrinho = () => {
    // 1. Pega os produtos que já estão no carrinho (se houver)
    const carrinhoAtual = JSON.parse(localStorage.getItem('carrinho') || '[]');

    // 2. Verifica se o produto já foi adicionado antes para não duplicar
    const jaExiste = carrinhoAtual.find((item: any) => item.id === produto.id);

    if (jaExiste) {
      alert("Este produto já está no seu carrinho!");
      return;
    }

    // 3. Adiciona o novo produto na lista
    carrinhoAtual.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem_url: produto.imagem_url,
      quantidade: 1
    });

    // 4. Salva a lista atualizada de volta no navegador
    localStorage.setItem('carrinho', JSON.stringify(carrinhoAtual));
    
    alert("Produto adicionado ao carrinho!");
  };

  return (
    <button 
      onClick={adicionarAoCarrinho}
      className="bg-zinc-950 text-white p-1.5 sm:p-2 rounded-lg hover:bg-pink-600 transition-colors cursor-pointer"
      title="Adicionar ao carrinho"
    >
      <ShoppingCart className="w-3.5 h-3.5" />
    </button>
  );
}

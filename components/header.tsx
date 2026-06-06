'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Search, User, Home, Tag } from "lucide-react";

export default function Header() {
    const [totalItens, setTotalItens] = useState(0);

    // Função que varre o localStorage e soma tudo
    const atualizarContador = () => {
        if (typeof window !== 'undefined') {
            const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
            const total = carrinho.reduce((soma: number, item: any) => soma + (item.quantidade || 1), 0);
            setTotalItens(total);
        }
    };

    useEffect(() => {
        // Inicializa o valor assim que a página abre
        atualizarContador();

        // 1. Criamos um loop de checagem super rápido (200ms) de segurança.
        // Isso garante que se qualquer botão clicar, o Header atualiza na hora sem falhar.
        const intervalo = setInterval(atualizarContador, 200);

        // 2. Mantém os ouvintes padrão para garantir sincronia entre abas
        window.addEventListener('storage', atualizarContador);
        window.addEventListener('carrinhoAtualizado', atualizarContador);

        return () => {
            clearInterval(intervalo);
            window.removeEventListener('storage', atualizarContador);
            window.removeEventListener('carrinhoAtualizado', atualizarContador);
        };
    }, []);

    return (
        <>
            {/* O RESTANTE DO SEU HTML DO HEADER CONTINUA EXATAMENTE IGUAL */}
            <header className="w-full bg-black text-white sticky top-0 z-50 border-b border-gray-900">
                <div className="w-full bg-pink-600 text-center py-1.5 text-[10px] sm:text-xs font-medium tracking-wider uppercase">
                    atualizaçao 17
                </div>

                <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
                    <div className="flex-1 md:flex-initial text-center md:text-left">
                        <Link href="/" className="text-xl sm:text-2xl font-black tracking-widest uppercase">
                            VÉSTIA
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide uppercase">
                        <Link href="/novidades" className="hover:text-pink-200 transition-colors">Novidades</Link>
                        <Link href="/feminino" className="hover:text-pink-200 transition-colors">Feminino</Link>
                        <Link href="/masculino" className="hover:text-pink-200 transition-colors">Masculino</Link>
                        <Link href="/promocoes" className="text-pink-400 hover:text-pink-300 font-bold transition-colors">Promoção</Link>
                    </nav>

                    <div className="relative w-full max-w-xs hidden md:block">
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-4 pr-10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-all"
                        />
                        <Search className="absolute right-3 top-2.5 w-4 h-4 text-zinc-500" />
                    </div>

                    <div className="hidden md:flex items-center gap-5">
                        <Link href="/conta" className="hover:text-pink-200 transition-colors">
                            <User className="w-5 h-5" />
                        </Link>
                        <Link href="/favoritos" className="hover:text-pink-200 transition-colors relative">
                            <Heart className="w-5 h-5" />
                            <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                        </Link>
                        
                        {/* Contador Computador */}
                        <Link href="/carrinho" className="hover:text-pink-200 transition-colors relative">
                            <ShoppingBag className="w-5 h-5" />
                            {totalItens > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                                    {totalItens}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                <div className="w-full px-4 pb-3 md:hidden bg-black">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="O que você está procurando hoje?"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none"
                        />
                        <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                    </div>
                </div>
            </header>

            {/* BARRA INFERIOR CELULAR */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-zinc-900 text-white md:hidden">
                <div className="flex items-center justify-around h-16">
                    <Link href="/" className="flex flex-col items-center justify-center gap-1 flex-1 text-zinc-400 hover:text-white">
                        <Home className="w-5 h-5 text-white" />
                        <span className="text-[10px] font-medium tracking-wide">Início</span>
                    </Link>
                    <Link href="/feminino" className="flex flex-col items-center justify-center gap-1 flex-1 text-zinc-400 hover:text-white">
                        <span className="text-xs font-bold font-mono">F</span>
                        <span className="text-[10px] font-medium tracking-wide">Feminino</span>
                    </Link>
                    <Link href="/masculino" className="flex flex-col items-center justify-center gap-1 flex-1 text-zinc-400 hover:text-white">
                        <span className="text-xs font-bold font-mono">M</span>
                        <span className="text-[10px] font-medium tracking-wide">Masculino</span>
                    </Link>
                    <Link href="/promocoes" className="flex flex-col items-center justify-center gap-1 flex-1 text-pink-400 hover:text-pink-300">
                        <Tag className="w-5 h-5" />
                        <span className="text-[10px] font-medium tracking-wide">Outlet</span>
                    </Link>
                    
                    {/* Contador Celular */}
                    <Link href="/carrinho" className="flex flex-col items-center justify-center gap-1 flex-1 text-zinc-400 hover:text-white relative">
                        <ShoppingBag className="w-5 h-5" />
                        {totalItens > 0 && (
                            <span className="absolute top-2 right-6 bg-pink-600 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold animate-pulse">
                                {totalItens}
                            </span>
                        )}
                        <span className="text-[10px] font-medium tracking-wide">Sacola</span>
                    </Link>
                </div>
            </div>
        </>
    );
}

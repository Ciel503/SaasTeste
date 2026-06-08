'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Search, User, Home, Tag, Sparkles, Shirt, Footprints } from "lucide-react";

export default function Header() {
    const [totalItens, setTotalItens] = useState(0);

    const atualizarContador = () => {
        if (typeof window !== 'undefined') {
            const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
            const total = carrinho.reduce((soma: number, item: any) => soma + (item.quantidade || 1), 0);
            setTotalItens(total);
        }
    };

    useEffect(() => {
        atualizarContador();
        const intervalo = setInterval(atualizarContador, 200);

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
            {/* 1. CABEÇALHO DO TOPO (Computador e Base Celular) */}
            <header className="w-full bg-black text-white sticky top-0 z-50 border-b border-gray-900">
                {/* BARRA SUPERIOR DE AVISOS */}
                <div className="w-full bg-pink-600 text-center py-1.5 text-[10px] sm:text-xs font-medium tracking-wider uppercase">
                    ATUALIZAÇÃO 20.0
                </div>

                {/* CONTEÚDO PRINCIPAL DO TOPO */}
                <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">

                    {/* LOGO */}
                    <div className="flex-1 md:flex-initial text-center md:text-left">
                        <Link href="/" className="text-xl sm:text-2xl font-black tracking-widest uppercase">
                            VÉSTIA
                        </Link>
                    </div>

                    {/* LINKS DE CATEGORIAS ATUALIZADOS (Apenas Computador) */}
                    <nav className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide uppercase">
                        <Link href="/roupas" className="hover:text-pink-200 transition-colors">Roupas</Link>
                        <Link href="/acessorios" className="hover:text-pink-200 transition-colors">Acessórios</Link>
                        <Link href="/cosmeticos" className="hover:text-pink-200 transition-colors">Cosméticos</Link>
                    </nav>

                    {/* BARRA DE PESQUISA */}
                    <div className="relative w-full max-w-xs hidden md:block">
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-4 pr-10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-all"
                        />
                        <Search className="absolute right-3 top-2.5 w-4 h-4 text-zinc-500" />
                    </div>

                    {/* ÍCONES DE AÇÃO */}
                    <div className="hidden md:flex items-center gap-5">
                        <Link href="/conta" className="hover:text-pink-200 transition-colors">
                            <User className="w-5 h-5" />
                        </Link>
                        <Link href="/favoritos" className="hover:text-pink-200 transition-colors relative">
                            <Heart className="w-5 h-5" />
                            <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                        </Link>
                        
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

                {/* BARRA DE PESQUISA DO CELULAR */}
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

            {/* 2. BARRA DE NAVEGAÇÃO INFERIOR ATUALIZADA PARA CELULAR (Estilo Aplicativo) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-zinc-900 text-white md:hidden">
                <div className="flex items-center justify-around h-16">
                    
                    {/* Início */}
                    <Link href="/" className="flex flex-col items-center justify-center gap-1 flex-1 text-zinc-400 hover:text-white">
                        <Home className="w-5 h-5 text-white" />
                        <span className="text-[10px] font-medium tracking-wide">Início</span>
                    </Link>
                    
                    {/* Roupas */}
                    <Link href="/roupas" className="flex flex-col items-center justify-center gap-1 flex-1 text-zinc-400 hover:text-white">
                        <Shirt className="w-5 h-5" />
                        <span className="text-[10px] font-medium tracking-wide">Roupas</span>
                    </Link>
                    
                    {/* Acessórios */}
                    <Link href="/acessorios" className="flex flex-col items-center justify-center gap-1 flex-1 text-zinc-400 hover:text-white">
                        <Footprints className="w-5 h-5" />
                        <span className="text-[10px] font-medium tracking-wide">Acessórios</span>
                    </Link>
                    
                    {/* Cosméticos */}
                    <Link href="/cosmeticos" className="flex flex-col items-center justify-center gap-1 flex-1 text-pink-400 hover:text-pink-300">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-[10px] font-medium tracking-wide">Cosméticos</span>
                    </Link>
                    
                    {/* Sacola */}
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

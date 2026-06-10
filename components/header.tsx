'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // 🔥 Importação do Next.js
import { ShoppingBag, Heart, Search, User, Home, Sparkles, Shirt, Footprints } from "lucide-react";

export default function Header() {
    const [totalItens, setTotalItens] = useState(0);
    const router = useRouter(); // 🔥 Instancia o roteador
    const searchParams = useSearchParams(); // 🔥 Pega os parâmetros da URL
    
    // 🔥 Pega o termo que já está na URL (se houver) para manter o input preenchido
    const [busca, setBusca] = useState(searchParams.get('busca') || '');

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

    // 🔥 Função única para atualizar a URL conforme o usuário digita
   // 🔥 FUNÇÃO CORRIGIDA PARA O SEU components/header
const handleBuscaChange = (termo: string) => {
    setBusca(termo);

    if (typeof window !== 'undefined') {
        // Pega o caminho atual da página (ex: "/cosmeticos" ou "/roupas" ou "/")
        const pathAtual = window.location.pathname; 

        if (termo.trim() === '') {
            // 🔥 CORREÇÃO: Em vez de voltar para "/", ele mantém a página atual limpa
            router.push(pathAtual); 
        } else {
            // Mantém a página atual e injeta o termo buscado nela
            router.push(`${pathAtual}?busca=${encodeURIComponent(termo)}`); 
        }
    }
};


    return (
        <>
            {/* 1. TOPO COMPUTADOR (3 Categorias Limpas) */}
            <header className="w-full bg-black text-white sticky top-0 z-50 border-b border-gray-900">
                <div className="w-full bg-pink-600 text-center py-1.5 text-[10px] sm:text-xs font-medium tracking-wider uppercase">
                    Em desenvovimento ATUALIZAÇÃO 29.1.3
                    <Link href="/adm" className="ml-2 text-white/90 hover:text-white transition-colors font-bold">[Área ADM]</Link>
                </div>

                <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
                    <div className="flex-1 md:flex-initial text-center md:text-left">
                        <Link href="/" className="text-xl sm:text-2xl font-black tracking-widest uppercase">
                            VÉSTIA
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide uppercase">
                        <Link href="/roupas" className="hover:text-pink-200 transition-colors">Roupas</Link>
                        <Link href="/acessorios" className="hover:text-pink-200 transition-colors">Acessórios</Link>
                        <Link href="/cosmeticos" className="hover:text-pink-200 transition-colors">Cosméticos</Link>
                    </nav>

                    {/* 🔥 INPUT COMPUTADOR ATUALIZADO */}
                    <div className="relative w-full max-w-xs hidden md:block">
                        <input 
                            type="text" 
                            value={busca}
                            onChange={(e) => handleBuscaChange(e.target.value)}
                            placeholder="Buscar produtos..." 
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-pink-500 transition-all" 
                        />
                        <Search className="absolute right-3 top-2.5 w-4 h-4 text-zinc-500" />
                    </div>

                    <div className="hidden md:flex items-center gap-5">
                        <Link href="/conta" className="hover:text-pink-200 transition-colors"><User className="w-5 h-5" /></Link>
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

                {/* 🔥 INPUT CELULAR ATUALIZADO */}
                <div className="w-full px-4 pb-3 md:hidden bg-black">
                    <div className="relative w-full">
                        <input 
                            type="text" 
                            value={busca}
                            onChange={(e) => handleBuscaChange(e.target.value)}
                            placeholder="O que você está procurando hoje?" 
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none" 
                        />
                        <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                    </div>
                </div>
            </header>

            {/* 2. BARRA INFERIOR CELULAR */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-zinc-900 text-white md:hidden">
                <div className="flex items-center justify-around h-16 text-center">
                    <Link href="/" className="flex flex-col items-center justify-center flex-1 text-zinc-400 hover:text-white">
                        <Home className="w-5 h-5 text-white" />
                        <span className="text-[10px] font-medium tracking-wide mt-0.5">Início</span>
                    </Link>
                    <Link href="/roupas" className="flex flex-col items-center justify-center flex-1 text-zinc-400 hover:text-white">
                        <Shirt className="w-5 h-5" />
                        <span className="text-[10px] font-medium tracking-wide mt-0.5">Roupas</span>
                    </Link>
                    <Link href="/acessorios" className="flex flex-col items-center justify-center flex-1 text-zinc-400 hover:text-white">
                        <Footprints className="w-5 h-5" />
                        <span className="text-[10px] font-medium tracking-wide mt-0.5">Acessórios</span>
                    </Link>
                    <Link href="/cosmeticos" className="flex flex-col items-center justify-center flex-1 text-pink-400 hover:text-pink-300">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-[10px] font-medium tracking-wide mt-0.5">Cosméticos</span>
                    </Link>
                    <Link href="/carrinho" className="flex flex-col items-center justify-center flex-1 text-zinc-400 hover:text-white relative">
                        <ShoppingBag className="w-5 h-5" />
                        {totalItens > 0 && (
                            <span className="absolute top-2 right-6 bg-pink-600 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold animate-pulse">
                                {totalItens}
                            </span>
                        )}
                        <span className="text-[10px] font-medium tracking-wide mt-0.5">Sacola</span>
                    </Link>
                </div>
            </div>
        </>
    );
}

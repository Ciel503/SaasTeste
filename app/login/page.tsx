'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn("credentials", { 
        email, 
        password, 
        callbackUrl: "/adm" 
      });
    } catch (err) {
      console.error("Erro no login:", err);
      setIsLoading(false);
    }
  };

  return (
    // 💡 Mudado para w-full e adicionado pt-12 (ou pt-16) para dar um espaço perfeito logo abaixo do seu Header
    <div className="w-full bg-zinc-950 flex flex-col items-center px-4 pt-12 pb-12 relative min-h-[calc(100vh-80px)]">
      
      {/* 🚨 ERRO 100% FLUTUANTE: Fica preso no vidro do celular e não empurra nada */}
      {error && (
        <div className="fixed top-20 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none animate-fade-in">
          <div className="bg-red-950/95 text-red-400 border border-red-500/60 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 shadow-2xl backdrop-blur-md max-w-sm w-full justify-center">
            <span>⚠️ E-mail ou senha incorretos.</span>
          </div>
        </div>
      )}

      {/* BOX DO FORMULÁRIO: Fica no topo com uma distância controlada */}
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl flex flex-col gap-4 text-white mt-4">
        
        {/* Cabeçalho */}
        <div className="text-center pb-2 border-b border-zinc-800">
          <h2 className="text-sm font-black uppercase tracking-widest text-pink-500">
            Painel Admin
          </h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">
            Restrito para colaboradores
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Campo Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={e => setEmail(e.target.value)} 
              className="w-full border border-zinc-800 p-3 rounded-xl bg-zinc-950 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-pink-500 transition-colors" 
              required
            />
          </div>

          {/* Campo Senha */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)} 
              className="w-full border border-zinc-800 p-3 rounded-xl bg-zinc-950 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-pink-500 transition-colors" 
              required
            />
          </div>
          
          {/* Botão Ação Slim */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? "Autenticando..." : "Entrar no Sistema"}
          </button>
        </form>

      </div>
      
    </div>
  );
}

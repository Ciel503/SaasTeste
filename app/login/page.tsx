'use client'

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Captura o erro da URL, se existir
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-bold">Acesso Administrativo</h2>
      
      {/* Exibe mensagem de erro se o login falhar */}
      {error && (
        <p className="text-red-500 bg-red-50 p-2 rounded text-sm">
          E-mail ou senha incorretos.
        </p>
      )}

      <input 
        type="email" 
        placeholder="Email" 
        onChange={e => setEmail(e.target.value)} 
        className="border p-2 rounded" 
        required
      />
      <input 
        type="password" 
        placeholder="Senha" 
        onChange={e => setPassword(e.target.value)} 
        className="border p-2 rounded" 
        required
      />
      
      <button 
        type="submit" 
        disabled={isLoading}
        className={`bg-blue-600 text-white p-2 rounded ${isLoading ? 'opacity-50' : ''}`}
      >
        {isLoading ? "Entrando..." : "Entrar no Sistema"}
      </button>
    </form>
  );
}
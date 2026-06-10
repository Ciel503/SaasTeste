'use client'; // 🔥 Transformado em Client Component para ler a rota atual

import "./globals.css";
import { Suspense } from "react";
import { usePathname } from "next/navigation"; // 🔥 Hook para ler o caminho da URL
import Header from "../components/header"; 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // 🔥 Se a rota atual for "/adm", a variável vira true
  const ehPaginaAdm = pathname?.startsWith('/adm');

  return (
    <html
      lang="pt-BR"
      className="h-full antialiased"
    >
      <body className="h-full flex flex-col bg-white text-gray-900">
        
        {/* 🔥 Só renderiza o Header se NÃO for a página do ADM */}
        {!ehPaginaAdm && (
          <Suspense fallback={null}>
            <Header />
          </Suspense>
        )}

        <Suspense fallback={<div className="text-center py-12 text-zinc-500 bg-zinc-50 min-h-screen">Carregando...</div>}>
          <main className="flex-1">{children}</main>
        </Suspense>
      </body>
    </html>
  );
}

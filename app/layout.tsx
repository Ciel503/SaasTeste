import "./globals.css";
import { Suspense } from "react"; // 🔥 1. Adicionado para liberar o build na Vercel
import Header from "../components/header"; 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="h-full antialiased"
    >
      <body className="h-full flex flex-col bg-white text-gray-900">
        {/* O Header precisa do Suspense por perto por usar hooks de busca da URL */}
        <Suspense fallback={null}>
          <Header />
        </Suspense>

        {/* 🔥 2. Envolvemos o main com Suspense para blindar as páginas que usam busca */}
        <Suspense fallback={<div className="text-center py-12 text-zinc-500 bg-zinc-50 min-h-screen">Carregando...</div>}>
          <main className="flex-1">{children}</main>
        </Suspense>
      </body>
    </html>
  );
}

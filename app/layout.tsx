import "./globals.css";
import Header from "../components/header"; // Ajustado para "components" e "Header" com H maiúsculo

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
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

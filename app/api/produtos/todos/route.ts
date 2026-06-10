import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

// Impede que o Next.js faça cache estático da lista de produtos
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const sql = neon(`${process.env.FRANeon_DATABASE_URL}`);
    
    // 🔥 Puxa todos os produtos do banco Neon sem filtros, ordenando do mais novo pro mais antigo
    const produtos = await sql`
      SELECT id, nome, preco, categoria, genero, subcategoria, tamanho, descricao, imagem_url 
      FROM produtos 
      ORDER BY id DESC
    `;
    
    return NextResponse.json(produtos);
  } catch (error) {
    console.error("Erro interno ao listar estoque no ADM:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

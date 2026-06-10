import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = neon(`${process.env.FRANeon_DATABASE_URL}`);
    
    // Traz todos os produtos do Neon direto para a lista do ADM
    const produtos = await sql`
      SELECT id, nome, preco, categoria, genero, subcategoria, tamanho, descricao, imagem_url 
      FROM produtos 
      ORDER BY id DESC
    `;
    
    return NextResponse.json(produtos);
  } catch (error) {
    console.error("Erro ao listar estoque completo no ADM:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

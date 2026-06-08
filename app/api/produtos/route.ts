import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoriaUrl = (searchParams.get("categoria") || "roupas").toLowerCase().trim();
    
    let categoriaBanco = "Roupas";

    // Mapeamento absoluto em letras minúsculas para o banco de dados
    if (categoriaUrl === "acessorios") {
      categoriaBanco = "Acessórios";
    } else if (categoriaUrl === "cosmeticos") {
      categoriaBanco = "Cosméticos";
    } else if (categoriaUrl === "calcados") {
      categoriaBanco = "Calçados"; // Adicionado suporte a calçados
    } else {
      categoriaBanco = "Roupas";
    }

    const sql = neon(`${process.env.FRANeon_DATABASE_URL}`);

    const dados = await sql`
      SELECT id, nome, preco, categoria, genero, subcategoria, tamanho, descricao, imagem_url 
      FROM produtos 
      WHERE categoria = ${categoriaBanco}
      ORDER BY id DESC
    `;

    return NextResponse.json(dados);
  } catch (error) {
    console.error("Erro na API de produtos:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

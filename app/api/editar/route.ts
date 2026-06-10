import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.FRANeon_DATABASE_URL}`);
    const formData = await request.formData();

    const id = formData.get("id");
    const nome = formData.get("nome");
    const preco = formData.get("preco");
    const categoria = formData.get("categoria");
    const subcategoria = formData.get("subcategoria");
    const descricao = formData.get("descricao");
    const file = formData.get("file"); // Nova foto se houver

    if (!id) {
      return NextResponse.json({ error: "ID do produto não fornecido." }, { status: 400 });
    }

    // Executa o UPDATE direto no Neon salvando as alterações textuais
    await sql`
      UPDATE produtos 
      SET nome = ${nome}, preco = ${preco}, categoria = ${categoria}, 
          subcategoria = ${subcategoria}, descricao = ${descricao}
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, message: "Produto atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro na API de edição:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

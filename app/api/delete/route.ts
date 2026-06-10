import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function DELETE(request: Request) {
  try {
    const sql = neon(`${process.env.FRANeon_DATABASE_URL}`);
    
    // Captura o ID do produto enviado no corpo da requisição JSON
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID do produto não fornecido." }, { status: 400 });
    }

    // Executa a query para deletar o registro permanentemente do Neon
    await sql`
      DELETE FROM produtos 
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, message: "Produto removido com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar produto no Neon:", error);
    return NextResponse.json({ error: "Erro interno ao deletar produto." }, { status: 500 });
  }
}

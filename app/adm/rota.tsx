import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    // 1. Lê as informações textuais que a sua página enviou pelos Headers
    const nome = request.headers.get('x-nome') || '';
    const preco = request.headers.get('x-preco') || '0';
    const genero = request.headers.get('x-genero') || '';
    const tamanho = request.headers.get('x-tamanho') || '';
    const descricao = request.headers.get('x-descricao') || '';

    if (!filename) {
      return NextResponse.json({ error: 'Nome do arquivo não informado' }, { status: 400 });
    }

    // 2. Envia a imagem real para o seu Vercel Blob (usando o seu token DBFRAN)
    const blob = await put(filename, request.body!, {
      access: 'public',
      token: process.env.DBFRAN_READ_WRITE_TOKEN,
    });

    const urlDaFoto = blob.url; // Esse é o link gerado que guardaremos no Neon

    // 3. Conecta ao Neon utilizando a variável de ambiente automática do seu .env.local
    const sql = neon(`${process.env.DATABASE_URL}`);

    // 4. Executa o SQL Puro para inserir a linha da roupa na tabela 'produtos'
   // 4. Executa o SQL Puro usando Crases (Template Strings) para o TypeScript aceitar
await sql`
  INSERT INTO produtos (nome, preco, genero, tamanho, descricao, imagem_url) 
  VALUES (${nome}, ${parseFloat(preco)}, ${genero}, ${tamanho}, ${descricao}, ${urlDaFoto})
`;


    // Retorna a confirmação de sucesso para o frontend
    return NextResponse.json({ success: true, url: urlDaFoto });

  } catch (error) {
    console.error('Erro crítico no processo de cadastro:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}

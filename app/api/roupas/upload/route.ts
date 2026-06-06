import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 1. Lê os dados desempacotando o FormData enviado pela página ADM
    const data = await request.formData();
    
    const file = data.get('file') as File;
    const nome = data.get('nome') as string || '';
    const preco = data.get('preco') as string || '0';
    const genero = data.get('genero') as string || '';
    const tamanho = data.get('tamanho') as string || '';
    const descricao = data.get('descricao') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'Arquivo de imagem não informado' }, { status: 400 });
    }

    // 2. Salva a foto no Vercel Blob com o sufixo randômico ativado
    const blob = await put(file.name, file, {
      access: 'public',
      token: process.env.DBFRAN_READ_WRITE_TOKEN,
      addRandomSuffix: true, // Evita conflitos caso suba arquivos com o mesmo nome
    });

    const urlDaFoto = blob.url; // Link final gerado pelo Blob

    // 3. Conecta ao Neon usando o nome EXATO da sua variável gerada em produção
    const sql = neon(`${process.env.FRANeon_DATABASE_URL}`);

    // 4. Insere de forma segura os dados textuais e o link no banco de dados
    await sql`
      INSERT INTO produtos (nome, preco, genero, tamanho, descricao, imagem_url) 
      VALUES (${nome}, ${parseFloat(preco)}, ${genero}, ${tamanho}, ${descricao}, ${urlDaFoto})
    `;

    // Retorna o sucesso para o painel limpar os campos
    return NextResponse.json({ success: true, url: urlDaFoto });

  } catch (error) {
    console.error('Erro crítico no processo de cadastro:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}

import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'; // 1. O import fica no topo normalmente

export async function POST(request: Request): Promise<NextResponse> {
  try {
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

    const blob = await put(file.name, file, {
      access: 'public',
      token: process.env.DBFRAN_READ_WRITE_TOKEN,
      addRandomSuffix: true,
    });

    const urlDaFoto = blob.url;

    const sql = neon(`${process.env.FRANeon_DATABASE_URL}`);

    await sql`
      INSERT INTO produtos (nome, preco, genero, tamanho, descricao, imagem_url) 
      VALUES (${nome}, ${parseFloat(preco)}, ${genero}, ${tamanho}, ${descricao}, ${urlDaFoto})
    `;

    // 2. CORRIGIDO: O comando de limpar o cache fica AQUI dentro, após o banco salvar tudo!
    revalidatePath('/'); 

    return NextResponse.json({ success: true, url: urlDaFoto });

  } catch (error) {
    console.error('Erro crítico no processo de cadastro:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}

import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// O Next.js exige que a função se chame exatamente POST em letras maiúsculas para resolver o erro 405
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 1. Coleta o pacote FormData enviado pelo formulário novo do ADM
    const data = await request.formData();
    
    const file = data.get('file') as File;
    const nome = data.get('nome') as string || '';
    const preco = data.get('preco') as string || '0';
    const categoria = data.get('categoria') as string || 'Roupas';
    const genero = data.get('genero') as string || '';
    const subcategoria = data.get('subcategoria') as string || '';
    const tamanho = data.get('tamanho') as string || '';
    const descricao = data.get('descricao') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'Arquivo de imagem não informado' }, { status: 400 });
    }

    // 2. Envia a foto com segurança para o Vercel Blob com sufixo único
    const blob = await put(file.name, file, {
      access: 'public',
      token: process.env.DBFRAN_READ_WRITE_TOKEN,
      addRandomSuffix: true,
    });

    const urlDaFoto = blob.url; // Link final gerado da imagem

    // 3. Conecta ao banco Neon usando sua credencial secreta
    const sql = neon(`${process.env.FRANeon_DATABASE_URL}`);

    // 4. Insere de forma segura os dados textuais nas colunas unificadas
    await sql`
      INSERT INTO produtos (nome, preco, categoria, genero, subcategoria, tamanho, descricao, imagem_url) 
      VALUES (
        ${nome}, 
        ${parseFloat(preco)}, 
        ${categoria}, 
        ${genero || null}, 
        ${subcategoria}, 
        ${tamanho || null}, 
        ${descricao}, 
        ${urlDaFoto}
      )
    `;

    // 5. Limpa instantaneamente o cache do site para os produtos novos aparecerem
        // ... abaixo do await sql ...
    revalidatePath('/');
    revalidatePath('/roupas');
    revalidatePath('/acessorios');
    revalidatePath('/cosmeticos');
    revalidatePath('/calcados'); // Adicione esta linha aqui!

    return NextResponse.json({ success: true, url: urlDaFoto });



  } catch (error) {
    console.error('Erro crítico no processo de cadastro:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}

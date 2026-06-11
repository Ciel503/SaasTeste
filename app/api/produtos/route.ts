import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// ==========================================
// FUNÇÃO GET: BUSCA E FILTRA TODOS OS PRODUTOS
// ==========================================
export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Captura os parâmetros da URL (ex: ?categoria=roupas)
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');

    const sql = neon(`${process.env.FRANeon_DATABASE_URL}`);
    
    // Se o front-end passou uma categoria na URL, filtramos no banco
    if (categoria) {
      const termo = categoria.toLowerCase().trim();
      
      // Essa query busca ignorando maiúsculas/minúsculas e aceita com ou sem acento
      const produtosFiltrados = await sql`
        SELECT * FROM produtos 
        WHERE LOWER(categoria) = ${termo}
           OR LOWER(categoria) = ${termo === 'cosmeticos' ? 'cosméticos' : termo === 'acessorios' ? 'acessórios' : termo}
        ORDER BY id DESC
      `;
      return NextResponse.json(produtosFiltrados);
    }

    // Caso a URL não tenha parâmetros (ex: no seu painel Admin), traz tudo
    const todosProdutos = await sql`SELECT * FROM produtos ORDER BY id DESC`;
    return NextResponse.json(todosProdutos);

  } catch (error) {
    console.error('Erro crítico no GET de produtos:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}

// ==========================================
// FUNÇÃO POST: CADASTRA QUALQUER PRODUTO
// ==========================================
export async function POST(request: Request): Promise<NextResponse> {
  try {
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

    // Envia para o Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      token: process.env.DBFRAN_READ_WRITE_TOKEN,
      addRandomSuffix: true,
    });

    const urlDaFoto = blob.url;
    const sql = neon(`${process.env.FRANeon_DATABASE_URL}`);

    // Insere no banco Neon
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

    // Limpa o cache de todas as páginas para atualizar instantaneamente
    revalidatePath('/');
    revalidatePath('/roupas');
    revalidatePath('/acessorios');
    revalidatePath('/cosmeticos');

    return NextResponse.json({ success: true, url: urlDaFoto });

  } catch (error) {
    console.error('Erro crítico no processo de cadastro:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
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
// ==========================================
// FUNÇÃO POST: CADASTRA QUALQUER PRODUTO com até 4 imagens
// ==========================================
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const data = await request.formData();
    
    // Captura os dados básicos do formulário
    const nome = data.get('nome') as string || '';
    const preco = data.get('preco') as string || '0';
    const categoria = data.get('categoria') as string || 'Roupas';
    const genero = data.get('genero') as string || '';
    const subcategoria = data.get('subcategoria') as string || '';
    const tamanho = data.get('tamanho') as string || '';
    const descricao = data.get('descricao') as string || '';

    // Extrai os arquivos de forma robusta do FormData
    const arquivos: File[] = [];
    
    // Busca por todas as entradas do FormData que contêm arquivos de imagem
    for (const [chave, valor] of data.entries()) {
      if (valor instanceof File && valor.size > 0) {
        arquivos.push(valor);
      }
    }

    // Validação de segurança: verifica se alguma imagem válida foi recebida
    if (arquivos.length === 0) {
      return NextResponse.json({ error: 'Ao menos um arquivo de imagem deve ser informado' }, { status: 400 });
    }

    // Limita o processamento a no máximo 4 imagens
    const arquivosValidos = arquivos.slice(0, 4);

    // Faz o upload em paralelo de todas as imagens para o Vercel Blob
    const uploadsPromises = arquivosValidos.map((file) =>
      put(file.name, file, {
        access: 'public',
        token: process.env.DBFRAN_READ_WRITE_TOKEN,
        addRandomSuffix: true,
      })
    );

    const resultadosBlob = await Promise.all(uploadsPromises);
    
    // Mapeia os links retornados para as colunas correspondentes (ou null se não existirem)
    const imagem1 = resultadosBlob[0] ? resultadosBlob[0].url : null;
    const imagem2 = resultadosBlob[1] ? resultadosBlob[1].url : null;
    const imagem3 = resultadosBlob[2] ? resultadosBlob[2].url : null;
    const imagem4 = resultadosBlob[3] ? resultadosBlob[3].url : null;

    // A imagem principal (imagem1) é estritamente obrigatória no banco
    if (!imagem1) {
      return NextResponse.json({ error: 'Falha ao gerar o link da imagem principal' }, { status: 400 });
    }

    const sql = neon(`${process.env.FRANeon_DATABASE_URL}`);

    // Insere no banco Neon usando a nova estrutura de colunas de imagens
    await sql`
      INSERT INTO produtos (nome, preco, categoria, genero, subcategoria, tamanho, descricao, imagem1, imagem2, imagem3, imagem4) 
      VALUES (
        ${nome}, 
        ${parseFloat(preco)}, 
        ${categoria}, 
        ${genero || null}, 
        ${subcategoria}, 
        ${tamanho || null}, 
        ${descricao}, 
        ${imagem1},
        ${imagem2},
        ${imagem3},
        ${imagem4}
      )
    `;

    // Limpa o cache de todas as páginas para atualizar instantaneamente
    revalidatePath('/');
    revalidatePath('/roupas');
    revalidatePath('/acessorios');
    revalidatePath('/cosmeticos');

    return NextResponse.json({ success: true, urls: [imagem1, imagem2, imagem3, imagem4].filter(Boolean) });

  } catch (error) {
    console.error('Erro crítico no processo de cadastro:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}

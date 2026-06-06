import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 1. ATUALIZADO: Lê o FormData enviado pelo formulário do ADM (Evita ler os headers vazios)
    const data = await request.formData();
    
    const file = data.get('file') as File;
    const nome = data.get('nome') as string || '';
    const preco = data.get('preco') as string || '0';
    const genero = data.get('genero') as string || '';
    const tamanho = data.get('tamanho') as string || '';
    const descricao = data.get('descricao') as string || '';

    // Validação de segurança para garantir que o arquivo de imagem chegou
    if (!file) {
      return NextResponse.json({ error: 'Arquivo de imagem não informado' }, { status: 400 });
    }

    // 2. Salva a foto com segurança no Vercel Blob passando o arquivo estruturado
        // 2. Salva a foto com segurança no Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      token: process.env.DBFRAN_READ_WRITE_TOKEN,
      addRandomSuffix: true, // <--- ADICIONE ESTA LINHA AQUI!
    });


    const urlDaFoto = blob.url; // Esse é o link gerado que guardaremos no Neon

    // 3. Conecta ao Neon utilizando a variável de ambiente do banco
    const sql = neon(`${process.env.DATABASE_URL}`);

    // 4. Executa o SQL Puro usando as Crases para inserir todos os dados reais
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

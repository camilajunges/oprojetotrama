// =============================================================================
// PROJETO TRAMA — SERVIDOR HTTP & API REST COM BANCO DE DADOS RELACIONAL (SQLITE)
// Servidor leve em Node.js puro (sem dependências externas)
// =============================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const TramaDB = require('./db.js');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

// Mapa de MIME types para servir os arquivos da aplicação
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

// Helper para ler o corpo JSON da requisição
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Proteção contra payload excessivo (limite de 15MB para fotos em base64)
      if (body.length > 15 * 1024 * 1024) {
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

// Helper para envio de respostas JSON com CORS
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Servidor HTTP
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Lidar com pre-flight CORS OPTIONS
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // ---------------------------------------------------------------------------
  // ROTAS DA API REST (/api/...)
  // ---------------------------------------------------------------------------

  // 1. STATUS E ESTATÍSTICAS DO ATELIÊ
  if (pathname === '/api/stats' && method === 'GET') {
    return sendJSON(res, 200, TramaDB.getStats());
  }

  // 2. AUTENTICAÇÃO: LOGIN (CLIENTE OU ADMINISTRADORA)
  if (pathname === '/api/auth/login' && method === 'POST') {
    const body = await parseBody(req);
    const email = (body.email || '').trim().toLowerCase();
    const password = (body.password || '').trim();

    if (!email || !password) {
      return sendJSON(res, 400, { error: "Informe o e-mail e a senha." });
    }

    const user = TramaDB.users.findByEmail(email);
    if (!user) {
      return sendJSON(res, 401, { error: "Usuário não encontrado." });
    }

    const valid = TramaDB.users.verifyPassword(password, user.password_hash);
    if (!valid) {
      return sendJSON(res, 401, { error: "Senha incorreta." });
    }

    const measurements = TramaDB.measurements.get(user.id);
    return sendJSON(res, 200, {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role
      },
      measurements: measurements || { busto: 0, cintura: 0, quadril: 0, altura: 0 }
    });
  }

  // 3. AUTENTICAÇÃO: CADASTRO DE CLIENTE
  if (pathname === '/api/auth/register' && method === 'POST') {
    const body = await parseBody(req);
    const email = (body.email || '').trim().toLowerCase();
    const password = (body.password || '').trim();
    const name = (body.name || '').trim();
    const phone = (body.phone || '').trim();

    if (!email || !password) {
      return sendJSON(res, 400, { error: "E-mail e senha são obrigatórios." });
    }

    const existing = TramaDB.users.findByEmail(email);
    if (existing) {
      return sendJSON(res, 409, { error: "Já existe uma conta cadastrada com este e-mail." });
    }

    const newUser = TramaDB.users.create({
      email,
      password,
      name: name || email.split('@')[0],
      phone,
      role: 'client'
    });

    if (body.measurements) {
      TramaDB.measurements.save(newUser.id, body.measurements);
    }

    return sendJSON(res, 201, {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  }

  // 4. ATUALIZAR MEDIDAS DA CLIENTE (CORTE ANATÔMICO SOB MEDIDA)
  if (pathname === '/api/auth/measurements' && method === 'POST') {
    const body = await parseBody(req);
    const userId = body.userId;
    if (!userId) {
      return sendJSON(res, 400, { error: "ID do usuário é obrigatório." });
    }

    const updated = TramaDB.measurements.save(userId, body);
    return sendJSON(res, 200, { success: true, measurements: updated });
  }

  // 5. LISTAR TODAS AS CLIENTES (EXCLUSIVO PARA A ADMINISTRADORA NO PAINEL DO ATELIÊ)
  if (pathname === '/api/customers' && method === 'GET') {
    const customers = TramaDB.users.listCustomers();
    return sendJSON(res, 200, customers);
  }

  // 6. EXCLUIR CLIENTE
  if (pathname.startsWith('/api/customers/') && method === 'DELETE') {
    const customerId = pathname.replace('/api/customers/', '');
    const deleted = TramaDB.users.deleteCustomer(customerId);
    return sendJSON(res, 200, { success: deleted });
  }

  // 7. PRODUTOS DO CATÁLOGO: LISTAR
  if (pathname === '/api/products' && method === 'GET') {
    const products = TramaDB.products.list(false);
    return sendJSON(res, 200, products);
  }

  // 8. PRODUTOS DO CATÁLOGO: SALVAR (CRIAR OU ATUALIZAR PEÇA COM FOTOS)
  if (pathname === '/api/products' && method === 'POST') {
    const body = await parseBody(req);
    if (!body || !body.name) {
      return sendJSON(res, 400, { error: "Nome da peça é obrigatório." });
    }
    const saved = TramaDB.products.save(body);
    return sendJSON(res, 200, { success: true, product: saved });
  }

  // 9. PRODUTOS DO CATÁLOGO: EXCLUIR
  if (pathname.startsWith('/api/products/') && method === 'DELETE') {
    const prodId = pathname.replace('/api/products/', '');
    const deleted = TramaDB.products.delete(prodId);
    return sendJSON(res, 200, { success: deleted });
  }

  // 10. LOOKBOOK: LISTAR
  if (pathname === '/api/lookbook' && method === 'GET') {
    const looks = TramaDB.lookbook.list();
    return sendJSON(res, 200, looks);
  }

  // 11. LOOKBOOK: SALVAR (CRIAR OU ATUALIZAR ENSAIO)
  if (pathname === '/api/lookbook' && method === 'POST') {
    const body = await parseBody(req);
    if (!body || !body.title) {
      return sendJSON(res, 400, { error: "Título do ensaio é obrigatório." });
    }
    const saved = TramaDB.lookbook.save(body);
    return sendJSON(res, 200, { success: true, look: saved });
  }

  // 12. LOOKBOOK: EXCLUIR
  if (pathname.startsWith('/api/lookbook/') && method === 'DELETE') {
    const lookId = pathname.replace('/api/lookbook/', '');
    const deleted = TramaDB.lookbook.delete(lookId);
    return sendJSON(res, 200, { success: deleted });
  }

  // 13. PEDIDOS SOB ENCOMENDA: LISTAR
  if (pathname === '/api/orders' && method === 'GET') {
    const orders = TramaDB.orders.list();
    return sendJSON(res, 200, orders);
  }

  // 14. PEDIDOS SOB ENCOMENDA: CRIAR
  if (pathname === '/api/orders' && method === 'POST') {
    const body = await parseBody(req);
    const created = TramaDB.orders.create(body);
    return sendJSON(res, 201, { success: true, order: created });
  }

  // ---------------------------------------------------------------------------
  // SERVIR ARQUIVOS ESTÁTICOS DO FRONTEND (HTML, CSS, JS, IMAGENS)
  // ---------------------------------------------------------------------------
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA Fallback para rotas não mapeadas
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro interno do servidor');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

// Inicializar Servidor
server.listen(PORT, () => {
  console.log(`\n============================================================`);
  console.log(`  PROJETO TRAMA — BANCO DE DADOS & SERVIDOR ATIVO`);
  console.log(`  Endereço local: http://localhost:${PORT}`);
  console.log(`  Banco SQLite:   ${path.join(PUBLIC_DIR, 'data', 'trama.db')}`);
  console.log(`  Administradora: oprojetotrama@gmail.com (Senha: admin)`);
  console.log(`============================================================\n`);
});

module.exports = server;

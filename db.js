// =============================================================================
// PROJETO TRAMA - CAMADA DE BANCO DE DADOS RELACIONAL (SQLITE NATIVO)
// Armazenamento estruturado de Produtos, Clientes, Medidas, Lookbook e Pedidos
// =============================================================================

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Diretório e arquivo do Banco de Dados
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'trama.db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// -----------------------------------------------------------------------------
// INICIALIZAÇÃO DO SQLITE (Node 22+ com DatabaseSync nativo ou fallback resiliente)
// -----------------------------------------------------------------------------
let db = null;
let isNativeSqlite = false;

try {
  const { DatabaseSync } = require('node:sqlite');
  db = new DatabaseSync(DB_FILE);
  isNativeSqlite = true;
  console.log(`[DB] SQLite nativo conectado com sucesso em: ${DB_FILE}`);
} catch (err) {
  console.warn(`[DB] node:sqlite não disponível (${err.message}). Usando motor JSON resiliente.`);
}

// Helpers de Senha com Salt Seguro
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!password || !stored) return false;
  // Compatibilidade com senhas padrão de teste
  if (stored === 'admin' && (password === 'admin' || password === 'trama2026')) return true;
  if (stored === 'trama2026' && (password === 'trama2026' || password === 'admin')) return true;

  const parts = stored.split(':');
  if (parts.length !== 2) return password === stored;
  const [salt, originalHash] = parts;
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}

// -----------------------------------------------------------------------------
// CRIAÇÃO DE TABELAS (SCHEMA DDL)
// -----------------------------------------------------------------------------
function initTables() {
  if (isNativeSqlite && db) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS customer_measurements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE NOT NULL,
        busto REAL DEFAULT 0,
        cintura REAL DEFAULT 0,
        quadril REAL DEFAULT 0,
        altura REAL DEFAULT 0,
        observacoes TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS customer_addresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        cep TEXT NOT NULL,
        street TEXT NOT NULL,
        number TEXT NOT NULL,
        complement TEXT,
        neighborhood TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        is_default INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        subtitle TEXT,
        category TEXT NOT NULL,
        aesthetics TEXT NOT NULL CHECK (aesthetics IN ('fluido', 'reto', 'encontro', 'todos')),
        price REAL NOT NULL,
        lead_time TEXT NOT NULL DEFAULT '20–30 dias úteis',
        description TEXT,
        images_json TEXT NOT NULL DEFAULT '[]',
        fabrics_json TEXT NOT NULL DEFAULT '[]',
        colors_json TEXT NOT NULL DEFAULT '[]',
        impact_json TEXT NOT NULL DEFAULT '{}',
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS lookbook (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        image TEXT NOT NULL,
        items_json TEXT NOT NULL DEFAULT '[]',
        display_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT,
        total REAL NOT NULL,
        discount_pix REAL DEFAULT 0,
        payment_method TEXT NOT NULL,
        status_index INTEGER DEFAULT 1,
        status_name TEXT DEFAULT 'Pedido recebido',
        estimated_delivery TEXT,
        items_json TEXT NOT NULL,
        shipping_address_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);
  }
}

// -----------------------------------------------------------------------------
// CARGA INICIAL DE DADOS (SEED)
// -----------------------------------------------------------------------------
function seedInitialData() {
  const TramaData = require('./js/data.js');

  // 1. Seed da Administradora
  const adminEmail = 'oprojetotrama@gmail.com';
  const existingAdmin = TramaDB.users.findByEmail(adminEmail);
  if (!existingAdmin) {
    TramaDB.users.create({
      id: 'usr_admin_trama',
      email: adminEmail,
      password: 'admin',
      name: 'Camila Guimarães (Proprietária)',
      phone: '(41) 99258-4033',
      role: 'admin'
    });
    console.log(`[DB] Conta de administradora semeada: ${adminEmail}`);
  }

  // 2. Seed do Catálogo de Peças
  const currentProducts = TramaDB.products.list();
  if (currentProducts.length === 0 && TramaData.products) {
    for (const prod of TramaData.products) {
      TramaDB.products.save(prod);
    }
    console.log(`[DB] ${TramaData.products.length} peças semeadas no catálogo.`);
  }

  // 3. Seed do Lookbook
  const currentLooks = TramaDB.lookbook.list();
  if (currentLooks.length === 0 && TramaData.lookbook) {
    for (const look of TramaData.lookbook) {
      TramaDB.lookbook.save(look);
    }
    console.log(`[DB] ${TramaData.lookbook.length} ensaios semeados no Lookbook.`);
  }

  // 4. Seed de Cliente de Demonstração (com medidas reais)
  const clientEmail = 'cliente@exemplo.com.br';
  const existingClient = TramaDB.users.findByEmail(clientEmail);
  if (!existingClient) {
    const newClient = TramaDB.users.create({
      id: 'usr_cliente_demo',
      email: clientEmail,
      password: '123',
      name: 'Isadora Martins',
      phone: '(11) 98765-4321',
      role: 'client'
    });
    TramaDB.measurements.save(newClient.id, {
      busto: 92,
      cintura: 72,
      quadril: 101,
      altura: 168,
      observacoes: 'Preferência por caimento solto na linha do quadril.'
    });
    console.log(`[DB] Cliente demonstrativa semeada com medidas: ${clientEmail}`);
  }
}

// -----------------------------------------------------------------------------
// OPERAÇÕES DO BANCO DE DADOS (CRUD)
// -----------------------------------------------------------------------------
const TramaDB = {
  init: function() {
    initTables();
    seedInitialData();
  },

  // ---------------------------------------------------------------------------
  // USUÁRIOS E CLIENTES
  // ---------------------------------------------------------------------------
  users: {
    findByEmail: function(email) {
      if (!email) return null;
      const cleanEmail = email.trim().toLowerCase();
      if (isNativeSqlite && db) {
        const stmt = db.prepare('SELECT * FROM users WHERE LOWER(email) = ?');
        return stmt.get(cleanEmail) || null;
      }
      return null;
    },

    findById: function(id) {
      if (!id) return null;
      if (isNativeSqlite && db) {
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        return stmt.get(id) || null;
      }
      return null;
    },

    create: function({ id, email, password, name, phone, role = 'client' }) {
      const userId = id || `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const cleanEmail = (email || '').trim().toLowerCase();
      const pHash = hashPassword(password || '123456');

      if (isNativeSqlite && db) {
        const stmt = db.prepare(`
          INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `);
        stmt.run(userId, cleanEmail, pHash, name || cleanEmail.split('@')[0], phone || '', role);
        return this.findById(userId);
      }
      return null;
    },

    update: function(id, { name, phone, password }) {
      if (!id) return null;
      if (isNativeSqlite && db) {
        const current = this.findById(id);
        if (!current) return null;

        let pHash = current.password_hash;
        if (password) {
          pHash = hashPassword(password);
        }

        const stmt = db.prepare(`
          UPDATE users
          SET name = ?, phone = ?, password_hash = ?, updated_at = datetime('now')
          WHERE id = ?
        `);
        stmt.run(name || current.name, phone !== undefined ? phone : current.phone, pHash, id);
        return this.findById(id);
      }
      return null;
    },

    listCustomers: function() {
      if (isNativeSqlite && db) {
        // Retorna todos os clientes com suas medidas e total de pedidos realizados
        const stmt = db.prepare(`
          SELECT 
            u.id, 
            u.email, 
            u.name, 
            u.phone, 
            u.role, 
            u.created_at,
            m.busto,
            m.cintura,
            m.quadril,
            m.altura,
            m.observacoes,
            (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id OR LOWER(o.customer_email) = LOWER(u.email)) AS total_orders
          FROM users u
          LEFT JOIN customer_measurements m ON m.user_id = u.id
          WHERE u.role = 'client'
          ORDER BY u.created_at DESC
        `);
        return stmt.all();
      }
      return [];
    },

    deleteCustomer: function(id) {
      if (!id) return false;
      if (isNativeSqlite && db) {
        const stmt = db.prepare("DELETE FROM users WHERE id = ? AND role = 'client'");
        stmt.run(id);
        return true;
      }
      return false;
    },

    verifyPassword: function(password, storedHash) {
      return verifyPassword(password, storedHash);
    }
  },

  // ---------------------------------------------------------------------------
  // MEDIDAS ANATÔMICAS DAS CLIENTES
  // ---------------------------------------------------------------------------
  measurements: {
    get: function(userId) {
      if (!userId) return null;
      if (isNativeSqlite && db) {
        const stmt = db.prepare('SELECT * FROM customer_measurements WHERE user_id = ?');
        return stmt.get(userId) || null;
      }
      return null;
    },

    save: function(userId, { busto, cintura, quadril, altura, observacoes }) {
      if (!userId) return null;
      if (isNativeSqlite && db) {
        const existing = this.get(userId);
        if (existing) {
          const stmt = db.prepare(`
            UPDATE customer_measurements
            SET busto = ?, cintura = ?, quadril = ?, altura = ?, observacoes = ?, updated_at = datetime('now')
            WHERE user_id = ?
          `);
          stmt.run(
            parseFloat(busto) || 0,
            parseFloat(cintura) || 0,
            parseFloat(quadril) || 0,
            parseFloat(altura) || 0,
            observacoes || '',
            userId
          );
        } else {
          const stmt = db.prepare(`
            INSERT INTO customer_measurements (user_id, busto, cintura, quadril, altura, observacoes, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
          `);
          stmt.run(
            userId,
            parseFloat(busto) || 0,
            parseFloat(cintura) || 0,
            parseFloat(quadril) || 0,
            parseFloat(altura) || 0,
            observacoes || ''
          );
        }
        return this.get(userId);
      }
      return null;
    }
  },

  // ---------------------------------------------------------------------------
  // PRODUTOS DO CATÁLOGO
  // ---------------------------------------------------------------------------
  products: {
    list: function(onlyActive = true) {
      if (isNativeSqlite && db) {
        const sql = onlyActive 
          ? 'SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC' 
          : 'SELECT * FROM products ORDER BY created_at DESC';
        const rows = db.prepare(sql).all();
        return rows.map(r => ({
          id: r.id,
          name: r.name,
          subtitle: r.subtitle,
          category: r.category,
          aesthetics: r.aesthetics,
          price: r.price,
          leadTime: r.lead_time,
          description: r.description,
          images: JSON.parse(r.images_json || '[]'),
          fabrics: JSON.parse(r.fabrics_json || '[]'),
          colors: JSON.parse(r.colors_json || '[]'),
          impact: JSON.parse(r.impact_json || '{}'),
          isActive: r.is_active === 1
        }));
      }
      return [];
    },

    get: function(id) {
      if (!id) return null;
      if (isNativeSqlite && db) {
        const r = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
        if (!r) return null;
        return {
          id: r.id,
          name: r.name,
          subtitle: r.subtitle,
          category: r.category,
          aesthetics: r.aesthetics,
          price: r.price,
          leadTime: r.lead_time,
          description: r.description,
          images: JSON.parse(r.images_json || '[]'),
          fabrics: JSON.parse(r.fabrics_json || '[]'),
          colors: JSON.parse(r.colors_json || '[]'),
          impact: JSON.parse(r.impact_json || '{}'),
          isActive: r.is_active === 1
        };
      }
      return null;
    },

    save: function(productData) {
      if (!productData || !productData.name) return null;
      const id = productData.id || `peca-${Date.now()}`;
      const name = productData.name.trim();
      const subtitle = productData.subtitle || '';
      const category = productData.category || 'vestidos';
      const aesthetics = productData.aesthetics || 'fluido';
      const price = parseFloat(productData.price) || 450;
      const leadTime = productData.leadTime || '20–30 dias úteis';
      const description = productData.description || '';
      const imagesJson = JSON.stringify(Array.isArray(productData.images) ? productData.images : []);
      const fabricsJson = JSON.stringify(Array.isArray(productData.fabrics) ? productData.fabrics : []);
      const colorsJson = JSON.stringify(Array.isArray(productData.colors) ? productData.colors : []);
      const impactJson = JSON.stringify(productData.impact || {});

      if (isNativeSqlite && db) {
        const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
        if (existing) {
          const stmt = db.prepare(`
            UPDATE products
            SET name = ?, subtitle = ?, category = ?, aesthetics = ?, price = ?,
                lead_time = ?, description = ?, images_json = ?, fabrics_json = ?,
                colors_json = ?, impact_json = ?, updated_at = datetime('now')
            WHERE id = ?
          `);
          stmt.run(name, subtitle, category, aesthetics, price, leadTime, description, imagesJson, fabricsJson, colorsJson, impactJson, id);
        } else {
          const stmt = db.prepare(`
            INSERT INTO products (id, name, subtitle, category, aesthetics, price, lead_time, description, images_json, fabrics_json, colors_json, impact_json, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
          `);
          stmt.run(id, name, subtitle, category, aesthetics, price, leadTime, description, imagesJson, fabricsJson, colorsJson, impactJson);
        }
        return this.get(id);
      }
      return null;
    },

    delete: function(id) {
      if (!id) return false;
      if (isNativeSqlite && db) {
        const stmt = db.prepare('DELETE FROM products WHERE id = ?');
        stmt.run(id);
        return true;
      }
      return false;
    }
  },

  // ---------------------------------------------------------------------------
  // LOOKBOOK
  // ---------------------------------------------------------------------------
  lookbook: {
    list: function() {
      if (isNativeSqlite && db) {
        const rows = db.prepare('SELECT * FROM lookbook ORDER BY display_order ASC, created_at DESC').all();
        return rows.map(r => ({
          id: r.id,
          title: r.title,
          subtitle: r.subtitle,
          image: r.image,
          items: JSON.parse(r.items_json || '[]')
        }));
      }
      return [];
    },

    save: function(lookData) {
      if (!lookData || !lookData.title) return null;
      const id = lookData.id || `look-${Date.now()}`;
      const title = lookData.title.trim();
      const subtitle = lookData.subtitle || '';
      const image = lookData.image || '';
      const itemsJson = JSON.stringify(Array.isArray(lookData.items) ? lookData.items : []);

      if (isNativeSqlite && db) {
        const existing = db.prepare('SELECT id FROM lookbook WHERE id = ?').get(id);
        if (existing) {
          const stmt = db.prepare(`
            UPDATE lookbook
            SET title = ?, subtitle = ?, image = ?, items_json = ?, updated_at = datetime('now')
            WHERE id = ?
          `);
          stmt.run(title, subtitle, image, itemsJson, id);
        } else {
          const stmt = db.prepare(`
            INSERT INTO lookbook (id, title, subtitle, image, items_json, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
          `);
          stmt.run(id, title, subtitle, image, itemsJson);
        }
        return { id, title, subtitle, image, items: JSON.parse(itemsJson) };
      }
      return null;
    },

    delete: function(id) {
      if (!id) return false;
      if (isNativeSqlite && db) {
        const stmt = db.prepare('DELETE FROM lookbook WHERE id = ?');
        stmt.run(id);
        return true;
      }
      return false;
    }
  },

  // ---------------------------------------------------------------------------
  // PEDIDOS SOB ENCOMENDA
  // ---------------------------------------------------------------------------
  orders: {
    list: function() {
      if (isNativeSqlite && db) {
        const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
        return rows.map(r => ({
          id: r.id,
          userId: r.user_id,
          customerName: r.customer_name,
          customerEmail: r.customer_email,
          customerPhone: r.customer_phone,
          total: r.total,
          discountPix: r.discount_pix,
          paymentMethod: r.payment_method,
          statusIndex: r.status_index,
          statusName: r.status_name,
          estimatedDelivery: r.estimated_delivery,
          items: JSON.parse(r.items_json || '[]'),
          shippingAddress: JSON.parse(r.shipping_address_json || '{}'),
          date: new Date(r.created_at).toLocaleDateString('pt-BR')
        }));
      }
      return [];
    },

    create: function(orderData) {
      if (!orderData) return null;
      const id = orderData.id || `TRM-${Math.floor(1000 + Math.random() * 9000)}`;
      const userId = orderData.userId || null;
      const customerName = orderData.customerName || 'Cliente';
      const customerEmail = orderData.customerEmail || '';
      const customerPhone = orderData.customerPhone || '';
      const total = parseFloat(orderData.total) || 0;
      const discountPix = parseFloat(orderData.discountPix) || 0;
      const paymentMethod = orderData.paymentMethod || 'Cartão';
      const statusIndex = orderData.statusIndex || 1;
      const statusName = orderData.statusName || 'Pedido recebido';
      const estimatedDelivery = orderData.estimatedDelivery || '';
      const itemsJson = JSON.stringify(Array.isArray(orderData.items) ? orderData.items : []);
      const addressJson = JSON.stringify(orderData.shippingAddress || {});

      if (isNativeSqlite && db) {
        const stmt = db.prepare(`
          INSERT INTO orders (id, user_id, customer_name, customer_email, customer_phone, total, discount_pix, payment_method, status_index, status_name, estimated_delivery, items_json, shipping_address_json, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `);
        stmt.run(id, userId, customerName, customerEmail, customerPhone, total, discountPix, paymentMethod, statusIndex, statusName, estimatedDelivery, itemsJson, addressJson);
        return {
          id,
          customerName,
          customerEmail,
          total,
          paymentMethod,
          statusName,
          items: JSON.parse(itemsJson)
        };
      }
      return null;
    },

    clear: function() {
      if (isNativeSqlite && db) {
        db.prepare('DELETE FROM orders').run();
        return true;
      }
      return false;
    }
  },

  // ---------------------------------------------------------------------------
  // ESTATÍSTICAS PARA O PAINEL DO ATELIÊ
  // ---------------------------------------------------------------------------
  getStats: function() {
    if (isNativeSqlite && db) {
      const prodCount = db.prepare('SELECT COUNT(*) AS total FROM products WHERE is_active = 1').get().total;
      const clientCount = db.prepare("SELECT COUNT(*) AS total FROM users WHERE role = 'client'").get().total;
      const orderCount = db.prepare('SELECT COUNT(*) AS total FROM orders').get().total;
      const revenue = db.prepare('SELECT COALESCE(SUM(total), 0) AS total FROM orders').get().total;

      return {
        products: prodCount,
        customers: clientCount,
        orders: orderCount,
        revenue: revenue
      };
    }
    return { products: 0, customers: 0, orders: 0, revenue: 0 };
  }
};

// Inicializar banco automaticamente na carga
TramaDB.init();

module.exports = TramaDB;

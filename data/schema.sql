-- =============================================================================
-- PROJETO TRAMA — SCHEMA DO BANCO DE DADOS RELACIONAL (SQLITE / POSTGRESQL)
-- Modelagem para moda sob encomenda (slow fashion) com clientes e medidas
-- =============================================================================

-- 1. TABELA DE USUÁRIOS (CLIENTES & ADMINISTRADORA)
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

-- Índice para buscas rápidas por e-mail no login
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. TABELA DE MEDIDAS ANATÔMICAS DAS CLIENTES (CORTE SOB MEDIDA)
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

CREATE INDEX IF NOT EXISTS idx_measurements_user ON customer_measurements(user_id);

-- 3. TABELA DE ENDEREÇOS DE ENTREGA DAS CLIENTES
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

CREATE INDEX IF NOT EXISTS idx_addresses_user ON customer_addresses(user_id);

-- 4. TABELA DE PRODUTOS / PEÇAS DO CATÁLOGO
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

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_aesthetics ON products(aesthetics);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- 5. TABELA DE ENSAIOS DO LOOKBOOK (COMPRE O LOOK)
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

-- 6. TABELA DE PEDIDOS SOB ENCOMENDA
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

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

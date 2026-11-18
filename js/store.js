/* ==========================================================================
   PROJETO TRAMA - GERENCIADOR DE ESTADO & PERSISTÊNCIA LOCAL (STORE)
   Com Controle de Acesso da Dona (Admin) e CMS de Peças e Imagens
   ========================================================================== */

const TramaStore = {
  // Inicialização do Estado
  state: {
    cart: [],
    wishlist: [],
    user: null,
    orders: [],
    customers: [],            // Banco de dados de clientes cadastradas
    coupon: null,
    currentAestheticsFilter: 'todos',
    weeklyCapacity: {
      total: 25,
      booked: 18
    },
    siteContent: null,
    isAdmin: false,           // Apenas a dona do site tem acesso às edições
    adminDirectEdit: false    // Exibir botões de edição rápida na loja pública
  },

  // Helpers seguros de storage (compatíveis com qualquer ambiente)
  _getStorage: function(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (e) {
      console.warn("Storage read error:", e);
    }
    return null;
  },

  _setStorage: function(key, val) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, val);
      }
    } catch (e) {
      console.warn("Storage write error:", e);
    }
  },

  _removeStorage: function(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn("Storage remove error:", e);
    }
  },

  // Inicializar a partir de LocalStorage
  init: function() {
    try {
      // 1. Carregar Sessão do Usuário
      const savedUser = this._getStorage('trama_user');
      if (savedUser) {
        try { this.state.user = JSON.parse(savedUser); } catch (e) { this.state.user = null; }
      } else {
        this.state.user = null;
      }

      // 2. Verificar se a Dona (Admin) está autenticada
      // Apenas é admin se o usuário logado for exatamente o e-mail de admin (oprojetotrama@gmail.com)
      const savedAdminAuth = this._getStorage('trama_is_admin');
      const adminCreds = this.getAdminAccount();
      if (savedAdminAuth === 'true' && this.state.user && this.state.user.email && 
          this.state.user.email.toLowerCase() === adminCreds.email.toLowerCase()) {
        this.state.isAdmin = true;
      } else {
        this.state.isAdmin = false;
        this._removeStorage('trama_is_admin');
      }

      const savedDirectEdit = this._getStorage('trama_admin_direct_edit');
      if (savedDirectEdit === 'true' && this.state.isAdmin) {
        this.state.adminDirectEdit = true;
      } else {
        this.state.adminDirectEdit = false;
      }

      // 3. Carregar Catálogo Salvo
      const savedCatalog = this._getStorage('trama_catalog');
      if (savedCatalog) {
        try {
          const products = JSON.parse(savedCatalog);
          if (Array.isArray(products) && products.length > 0) {
            // Sincronizar produtos com os dados salvos
            TramaData.products = products;
          }
        } catch (e) {
          console.warn("Erro ao ler catálogo salvo:", e);
        }
      } else {
        this.saveCatalog(false);
      }

      // 2.1 Carregar Lookbook Salvo
      const savedLookbook = this._getStorage('trama_lookbook');
      if (savedLookbook) {
        try {
          const lb = JSON.parse(savedLookbook);
          if (Array.isArray(lb) && lb.length > 0) {
            TramaData.lookbook = lb;
          }
        } catch (e) {
          console.warn("Erro ao ler lookbook salvo:", e);
        }
      } else {
        this.saveLookbook(false);
      }

      // 3. Carregar Conteúdos do Site
      const savedContent = this._getStorage('trama_site_content');
      if (savedContent) {
        try {
          this.state.siteContent = JSON.parse(savedContent);
        } catch (e) {
          console.warn("Erro ao ler conteúdos:", e);
        }
      }
      if (!this.state.siteContent) {
        this.state.siteContent = {
          announcement: "Frete grátis para todo o Brasil acima de R$ 600 • Peças feitas sob encomenda com zero desperdício",
          heroFluid: {
            tag: "A Linha Fluida • Leveza & Caimento",
            title: "O movimento livre do tecido que respira.",
            desc: "Peças feitas sob encomenda em linho cru e pura seda. Sem sobras, sem pressa, respeitando o tempo orgânico da matéria."
          },
          heroStraight: {
            tag: "A Linha Reta • Estrutura & Impacto",
            title: "A precisão geométrica do corte afiado.",
            desc: "Alfaiataria rigorosa construída para resistir aos anos. Ombros definidos, costuras limpas e atitude arquitetônica."
          },
          sustainability: [
            { number: "1.420", label: "Peças feitas exclusivamente sob demanda", detail: "Zero peças paradas em estoque" },
            { number: "4.150 m", label: "De tecido nobre economizado", detail: "Corte geométrico inteligente sem resíduo" },
            { number: "0%", label: "De incineração ou queima de coleções", detail: "Produzimos apenas o que vai existir na vida de alguém" }
          ]
        };
      }

      // 4. Carregar Sacola
      const savedCart = this._getStorage('trama_cart');
      if (savedCart) {
        try { this.state.cart = JSON.parse(savedCart); } catch (e) {}
      }

      // 5. Carregar Favoritos
      const savedWishlist = this._getStorage('trama_wishlist');
      if (savedWishlist) {
        try { this.state.wishlist = JSON.parse(savedWishlist); } catch (e) {}
      }

      // 6. Carregar Pedidos
      const savedOrders = this._getStorage('trama_orders');
      if (savedOrders) {
        try { this.state.orders = JSON.parse(savedOrders); } catch (e) {}
      } else {
        this.state.orders = [
          {
            id: "TRM-8924",
            date: "14/11/2026",
            statusIndex: 3,
            statusName: "Em costura",
            estimatedDelivery: "05/12/2026",
            trackingCode: "TRM-SP-982194BR",
            items: [
              {
                productId: TramaData.products[0]?.id || "colete-estruturado-alfaitaria",
                name: TramaData.products[0]?.name || "Colete Estruturado em Alfaitaria",
                sizeMode: "Sob Medida",
                measurements: { busto: 92, cintura: 72, quadril: 101, altura: 168 },
                fabric: "Linho Puro 100%",
                color: "Off-White Natural",
                price: 480,
                qty: 1
              }
            ],
            total: 480,
            paymentMethod: "Pix (5% off aplicado)"
          }
        ];
        this.saveOrders();
      }

      // 7. Carregar Clientes Salvas no Banco Local / Cache
      const savedCustomers = this._getStorage('trama_customers');
      if (savedCustomers) {
        try { this.state.customers = JSON.parse(savedCustomers); } catch (e) { this.state.customers = []; }
      } else {
        this.state.customers = [
          {
            id: 'usr_cliente_demo',
            name: 'Isadora Martins',
            email: 'cliente@exemplo.com.br',
            phone: '(11) 98765-4321',
            role: 'client',
            created_at: new Date().toISOString(),
            busto: 92,
            cintura: 72,
            quadril: 101,
            altura: 168,
            observacoes: 'Preferência por caimento solto na linha do quadril.',
            total_orders: 1
          }
        ];
        this._setStorage('trama_customers', JSON.stringify(this.state.customers));
      }

      // Sincronizar com o Banco de Dados Relacional (SQLite) em segundo plano
      this.syncFromDatabase();
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  },

  // --------------------------------------------------------------------------
  // INTEGRAÇÃO COM BANCO DE DADOS (REST API / SQLITE)
  // --------------------------------------------------------------------------
  apiBaseUrl: (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) 
    ? window.location.origin 
    : 'http://localhost:3000',

  syncFromDatabase: async function() {
    if (typeof fetch === 'undefined') return;
    try {
      // 1. Sincronizar Produtos do Banco SQLite
      const prodRes = await fetch(`${this.apiBaseUrl}/api/products`);
      if (prodRes.ok) {
        const dbProducts = await prodRes.json();
        if (Array.isArray(dbProducts) && dbProducts.length > 0) {
          TramaData.products = dbProducts;
          this.saveCatalog(false);
        }
      }

      // 2. Sincronizar Lookbook do Banco SQLite
      const lookRes = await fetch(`${this.apiBaseUrl}/api/lookbook`);
      if (lookRes.ok) {
        const dbLooks = await lookRes.json();
        if (Array.isArray(dbLooks) && dbLooks.length > 0) {
          TramaData.lookbook = dbLooks;
          this.saveLookbook(false);
        }
      }

      // 3. Sincronizar Lista de Clientes do Banco SQLite
      const custRes = await fetch(`${this.apiBaseUrl}/api/customers`);
      if (custRes.ok) {
        const dbCustomers = await custRes.json();
        if (Array.isArray(dbCustomers) && dbCustomers.length > 0) {
          this.state.customers = dbCustomers;
          this._setStorage('trama_customers', JSON.stringify(dbCustomers));
        }
      }

      this.notifyUpdate('dbSync');
    } catch (e) {
      // Servidor local offline ou aberto diretamente via arquivo local (file://)
    }
  },

  deleteCustomer: function(customerId) {
    if (!this.state.customers) return false;
    const index = this.state.customers.findIndex(c => c.id === customerId);
    if (index > -1) {
      this.state.customers.splice(index, 1);
      this._setStorage('trama_customers', JSON.stringify(this.state.customers));
      if (typeof fetch !== 'undefined') {
        fetch(`${this.apiBaseUrl}/api/customers/${customerId}`, { method: 'DELETE' }).catch(() => {});
      }
      this.notifyUpdate('customers');
      return true;
    }
    return false;
  },

  // --------------------------------------------------------------------------
  // CONTROLE DE ACESSO DA DONA DO SITE (ADMIN AUTH & CONTA ESPECÍFICA)
  // --------------------------------------------------------------------------
  getAdminAccount: function() {
    const saved = this._getStorage('trama_admin_account');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email && parsed.password) return parsed;
      } catch (e) {}
    }
    // Conta padrão configurada no data.js ou padrão do ateliê
    if (typeof TramaData !== 'undefined' && TramaData.brand && TramaData.brand.adminAccount) {
      return TramaData.brand.adminAccount;
    }
    return {
      email: "oprojetotrama@gmail.com",
      password: "admin",
      name: "Camila Guimarães (Proprietária)"
    };
  },

  updateAdminAccount: function(newEmail, newPassword, newName) {
    if (!newEmail || !newPassword) return false;
    const current = this.getAdminAccount();
    const updated = {
      email: newEmail.trim().toLowerCase(),
      password: newPassword.trim(),
      name: (newName || current.name).trim()
    };
    this._setStorage('trama_admin_account', JSON.stringify(updated));
    this.notifyUpdate('adminAccount');
    return true;
  },

  isAdminLoggedIn: function() {
    return this.state.isAdmin === true;
  },

  adminLogin: function(emailOrUser, password) {
    const creds = this.getAdminAccount();
    const inputUser = (emailOrUser || '').trim().toLowerCase();
    const inputPass = (password || '').trim();

    // Permite login pelo email específico ou usuário 'admin'
    const isUserValid = (
      inputUser === creds.email.toLowerCase() ||
      inputUser === 'admin' ||
      inputUser === 'atelie' ||
      inputUser === 'trama'
    );

    // Senha específica cadastrada pela proprietária (ou senha mestre 'trama2026' / 'admin')
    const isPassValid = (
      inputPass === creds.password ||
      inputPass === 'trama2026' ||
      (creds.password === 'admin' && inputPass === 'admin')
    );

    if (isUserValid && isPassValid) {
      this.state.isAdmin = true;
      this._setStorage('trama_is_admin', 'true');
      this.state.user = {
        isLoggedIn: true,
        name: creds.name || "Camila Guimarães (Proprietária)",
        email: creds.email,
        role: "admin",
        phone: "(41) 99258-4033",
        savedMeasurements: { busto: 90, cintura: 70, quadril: 98, altura: 165 }
      };
      this.saveUser();
      this.notifyUpdate('adminAuth');
      return true;
    }
    return false;
  },

  adminLogout: function() {
    this.state.isAdmin = false;
    this.state.adminDirectEdit = false;
    this._removeStorage('trama_is_admin');
    this._removeStorage('trama_admin_direct_edit');
    this.notifyUpdate('adminAuth');
  },

  toggleAdminDirectEdit: function() {
    this.state.adminDirectEdit = !this.state.adminDirectEdit;
    this._setStorage('trama_admin_direct_edit', this.state.adminDirectEdit ? 'true' : 'false');
    this.notifyUpdate('adminAuth');
    return this.state.adminDirectEdit;
  },

  // --------------------------------------------------------------------------
  // PROCESSAMENTO E OTIMIZAÇÃO DE IMAGENS (CANVAS COMPRESSION)
  // --------------------------------------------------------------------------
  compressImageFile: function(file, maxDimension = 1000, quality = 0.82) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error("Arquivo inválido"));

      // Se for SVG ou GIF, lê diretamente como DataURL
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = err => reject(err);
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          try {
            let width = img.width;
            let height = img.height;

            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              } else {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            // Fundo suave para evitar transparências pretas ao converter para JPEG
            ctx.fillStyle = '#F2F0EC';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            const compressed = canvas.toDataURL('image/jpeg', quality);
            resolve(compressed);
          } catch (canvasErr) {
            console.warn("Fallback de compressão para imagem original:", canvasErr);
            resolve(e.target.result);
          }
        };
        img.onerror = function() {
          resolve(e.target.result);
        };
        img.src = e.target.result;
      };
      reader.onerror = err => reject(err);
      reader.readAsDataURL(file);
    });
  },

  // --------------------------------------------------------------------------
  // GERENCIAMENTO DE PEÇAS & PERSISTÊNCIA (CMS EXCLUSIVO DA DONA)
  // --------------------------------------------------------------------------
  saveCatalog: function(notify = true) {
    try {
      this._setStorage('trama_catalog', JSON.stringify(TramaData.products));
      if (notify) this.notifyUpdate('catalog');
    } catch (e) {
      console.error("Erro ao salvar catálogo no localStorage:", e);
      if (e.name === 'QuotaExceededError') {
        alert("O limite de armazenamento de imagens do seu navegador foi atingido. Tente usar imagens menores ou links web.");
      }
    }
  },

  saveProduct: function(productData) {
    if (!productData) return null;

    const existingIndex = TramaData.products.findIndex(p => p.id === productData.id);

    if (existingIndex > -1) {
      // Atualizar peça existente
      TramaData.products[existingIndex] = {
        ...TramaData.products[existingIndex],
        ...productData
      };
      this.saveCatalog(true);
      if (typeof fetch !== 'undefined') {
        fetch(`${this.apiBaseUrl}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TramaData.products[existingIndex])
        }).catch(() => {});
      }
      return { action: 'updated', product: TramaData.products[existingIndex] };
    } else {
      // Adicionar nova peça
      const newProduct = {
        id: productData.id || this.slugify(productData.name) || `peca-${Date.now()}`,
        name: productData.name || "Nova Peça Trama",
        subtitle: productData.subtitle || "Peça autoral feita sob encomenda",
        category: productData.category || "vestidos",
        aesthetics: productData.aesthetics || "fluido",
        price: parseFloat(productData.price) || 450,
        leadTime: productData.leadTime || "20–30 dias úteis",
        images: Array.isArray(productData.images) && productData.images.length > 0 ? productData.images : [],
        description: productData.description || "Confeccionada sob medida com tecidos naturais nobres e acabamento artesanal sem resíduos.",
        fabrics: productData.fabrics || [
          { id: "linho-puro", name: "Linho Puro 100%", priceDiff: 0, origin: "Cultivo nacional sem irrigação química" }
        ],
        colors: productData.colors || [
          { id: "offwhite", name: "Off-White Natural", hex: "#F2F0EC" },
          { id: "midnight", name: "Midnight Negro", hex: "#090F15" }
        ],
        impact: productData.impact || {
          waterSaved: "850 litros preservados",
          wastePercent: "0% resíduo têxtil",
          traceability: "Fios sustentáveis certificados"
        },
        reviewsSummary: {
          score: 5.0,
          count: 1,
          fit: { small: 0, right: 100, large: 0 }
        }
      };

      TramaData.products.unshift(newProduct);
      this.saveCatalog(true);
      if (typeof fetch !== 'undefined') {
        fetch(`${this.apiBaseUrl}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct)
        }).catch(() => {});
      }
      return { action: 'created', product: newProduct };
    }
  },

  deleteProduct: function(productId) {
    const index = TramaData.products.findIndex(p => p.id === productId);
    if (index > -1) {
      const removed = TramaData.products.splice(index, 1)[0];
      this.saveCatalog(true);
      if (typeof fetch !== 'undefined') {
        fetch(`${this.apiBaseUrl}/api/products/${productId}`, { method: 'DELETE' }).catch(() => {});
      }
      return removed;
    }
    return null;
  },

  // Gerenciamento e Persistência do Lookbook
  saveLookbook: function(notify = true) {
    try {
      this._setStorage('trama_lookbook', JSON.stringify(TramaData.lookbook || []));
      if (notify) this.notifyUpdate('lookbook');
    } catch (e) {
      console.error("Erro ao salvar lookbook no localStorage:", e);
      if (e.name === 'QuotaExceededError') {
        alert("O limite de armazenamento de imagens do seu navegador foi atingido. Tente usar imagens menores ou links web.");
      }
    }
  },

  getLookbook: function() {
    return TramaData.lookbook || [];
  },

  saveLook: function(lookData) {
    if (!lookData) return null;
    if (!TramaData.lookbook) TramaData.lookbook = [];

    const existingIndex = TramaData.lookbook.findIndex(l => l.id === lookData.id);

    if (existingIndex > -1) {
      TramaData.lookbook[existingIndex] = {
        ...TramaData.lookbook[existingIndex],
        ...lookData
      };
      this.saveLookbook(true);
      if (typeof fetch !== 'undefined') {
        fetch(`${this.apiBaseUrl}/api/lookbook`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TramaData.lookbook[existingIndex])
        }).catch(() => {});
      }
      return { action: 'updated', look: TramaData.lookbook[existingIndex] };
    } else {
      const newLook = {
        id: lookData.id || `look-${Date.now()}`,
        title: lookData.title || "Novo Ensaio",
        subtitle: lookData.subtitle || "",
        image: lookData.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80",
        items: Array.isArray(lookData.items) ? lookData.items : []
      };
      TramaData.lookbook.push(newLook);
      this.saveLookbook(true);
      if (typeof fetch !== 'undefined') {
        fetch(`${this.apiBaseUrl}/api/lookbook`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newLook)
        }).catch(() => {});
      }
      return { action: 'created', look: newLook };
    }
  },

  deleteLook: function(lookId) {
    if (!TramaData.lookbook) return null;
    const index = TramaData.lookbook.findIndex(l => l.id === lookId);
    if (index > -1) {
      const removed = TramaData.lookbook.splice(index, 1)[0];
      this.saveLookbook(true);
      if (typeof fetch !== 'undefined') {
        fetch(`${this.apiBaseUrl}/api/lookbook/${lookId}`, { method: 'DELETE' }).catch(() => {});
      }
      return removed;
    }
    return null;
  },

  resetCatalogToDefaults: function() {
    this._removeStorage('trama_catalog');
    this._removeStorage('trama_lookbook');
    this._removeStorage('trama_site_content');
    location.reload();
  },

  saveSiteContent: function(newContent) {
    this.state.siteContent = {
      ...this.state.siteContent,
      ...newContent
    };
    try {
      this._setStorage('trama_site_content', JSON.stringify(this.state.siteContent));
      this.notifyUpdate('siteContent');
    } catch (e) {
      console.error("Erro ao salvar conteúdos:", e);
    }
  },

  slugify: function(text) {
    return (text || '').toString().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  },

  // --------------------------------------------------------------------------
  // DEMAIS OPERAÇÕES DA LOJA (Sacola, Pedidos, Favoritos)
  // --------------------------------------------------------------------------
  saveCart: function() {
    this._setStorage('trama_cart', JSON.stringify(this.state.cart));
    this.notifyUpdate('cart');
  },

  saveWishlist: function() {
    this._setStorage('trama_wishlist', JSON.stringify(this.state.wishlist));
    this.notifyUpdate('wishlist');
  },

  saveUser: function() {
    this._setStorage('trama_user', JSON.stringify(this.state.user));
    this.notifyUpdate('user');
  },

  saveOrders: function() {
    this._setStorage('trama_orders', JSON.stringify(this.state.orders));
    this.notifyUpdate('orders');
  },

  addToCart: function(item) {
    const existingIndex = this.state.cart.findIndex(i => 
      i.productId === item.productId &&
      i.sizeMode === item.sizeMode &&
      i.fabric === item.fabric &&
      i.color === item.color &&
      JSON.stringify(i.measurements || {}) === JSON.stringify(item.measurements || {})
    );

    if (existingIndex > -1) {
      this.state.cart[existingIndex].qty += (item.qty || 1);
    } else {
      this.state.cart.push({
        id: "item-" + Date.now(),
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        sizeMode: item.sizeMode || "M",
        measurements: item.measurements || null,
        fabric: item.fabric,
        color: item.color,
        leadTime: item.leadTime || "20–30 dias úteis",
        qty: item.qty || 1
      });
    }

    this.saveCart();

    if (typeof TramaApp !== 'undefined') {
      TramaApp.triggerRabbitPawTap();
      TramaApp.showToast(`"${item.name}" adicionado à sacola.`);
      TramaApp.openCartDrawer();
    }
  },

  updateCartQty: function(itemId, delta) {
    const item = this.state.cart.find(i => i.id === itemId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      this.state.cart = this.state.cart.filter(i => i.id !== itemId);
      if (typeof TramaApp !== 'undefined') TramaApp.showToast("Peça removida da sacola.");
    }
    this.saveCart();
  },

  removeFromCart: function(itemId) {
    this.state.cart = this.state.cart.filter(i => i.id !== itemId);
    this.saveCart();
    if (typeof TramaApp !== 'undefined') TramaApp.showToast("Peça removida da sacola.");
  },

  clearCart: function() {
    this.state.cart = [];
    this.saveCart();
  },

  getCartSubtotal: function() {
    return this.state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  },

  getCartTotalCount: function() {
    return this.state.cart.reduce((sum, item) => sum + item.qty, 0);
  },

  applyCoupon: function(code) {
    const clean = (code || '').trim().toUpperCase();
    if (clean === "TRAMA10" || clean === "PRIMEIRACOMPRA") {
      this.state.coupon = { code: clean, discountPercent: 10 };
      if (typeof TramaApp !== 'undefined') TramaApp.showToast("Cupom de 10% de desconto ativado!");
      this.notifyUpdate('cart');
      return true;
    } else {
      if (typeof TramaApp !== 'undefined') TramaApp.showToast("Cupom inválido ou expirado.", "error");
      return false;
    }
  },

  toggleWishlist: function(productId) {
    const index = this.state.wishlist.indexOf(productId);
    if (index > -1) {
      this.state.wishlist.splice(index, 1);
      if (typeof TramaApp !== 'undefined') TramaApp.showToast("Peça removida dos seus favoritos.");
    } else {
      this.state.wishlist.push(productId);
      if (typeof TramaApp !== 'undefined') TramaApp.showToast("Peça salva nos seus favoritos.");
    }
    this.saveWishlist();
  },

  isWishlisted: function(productId) {
    return this.state.wishlist.includes(productId);
  },

  createOrder: function(orderDetails) {
    const newOrder = {
      id: "TRM-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleDateString('pt-BR'),
      statusIndex: 0,
      statusName: "Pedido recebido",
      estimatedDelivery: "Pronta em 20–30 dias úteis",
      trackingCode: "TRM-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      customer: {
        name: orderDetails.name,
        email: orderDetails.email,
        phone: orderDetails.phone,
        cpf: orderDetails.cpf
      },
      shippingAddress: orderDetails.address,
      items: [...this.state.cart],
      subtotal: this.getCartSubtotal(),
      shippingCost: orderDetails.shippingCost || 0,
      discount: orderDetails.discount || 0,
      pixDiscount: orderDetails.pixDiscount || 0,
      total: orderDetails.total,
      paymentMethod: orderDetails.paymentMethod
    };

    this.state.weeklyCapacity.booked += 1;
    this.state.orders.unshift(newOrder);
    this.saveOrders();
    this.clearCart();

    return newOrder;
  },

  advanceOrderStatus: function(orderId) {
    const stages = [
      "Pedido recebido",
      "Tecido separado",
      "Em corte",
      "Em costura",
      "Acabamento & Revisão",
      "Enviado com Rastreio",
      "Entregue"
    ];

    const order = this.state.orders.find(o => o.id === orderId);
    if (order && order.statusIndex < stages.length - 1) {
      order.statusIndex += 1;
      order.statusName = stages[order.statusIndex];
      this.saveOrders();
      if (typeof TramaApp !== 'undefined') TramaApp.showToast(`Pedido ${orderId} avançou para: "${order.statusName}".`);
      return order;
    }
    return null;
  },

  updateSavedMeasurements: function(measurements) {
    if (!this.state.user) {
      this.state.user = { isLoggedIn: true, name: "Cliente Trama", email: "cliente@trama.com.br" };
    }
    this.state.user.savedMeasurements = { ...measurements };
    this.saveUser();
    if (typeof TramaApp !== 'undefined') TramaApp.showToast("Medidas salvas na sua conta com segurança.");
  },

  listeners: [],
  subscribe: function(callback) {
    this.listeners.push(callback);
  },
  notifyUpdate: function(topic) {
    this.listeners.forEach(fn => fn(topic, this.state));
  }
};

TramaStore.init();

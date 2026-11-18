/* ==========================================================================
   PROJETO TRAMA - CONTROLADOR PRINCIPAL DA APLICAÇÃO (APP & ROUTER)
   Com suporte completo a CMS (Adicionar Peças, Mudar Fotos e Editar Conteúdos)
   ========================================================================== */

const TramaApp = {
  selectedFabricDiff: 0,
  selectedFabricName: "Linho Puro 100%",
  selectedColorName: "Off-White Natural",
  selectedSizeMode: "custom",
  selectedStandardSizeValue: "M",
  selectedPaymentMethod: "pix",
  lastScrollTop: 0,

  // Estado do Editor Visual (CMS)
  currentEditingProductId: null,
  currentEditingImages: [],

  // Inicialização Geral
  init: function() {
    this.initRouter();
    this.initScrollHeader();
    this.initKeyboardAccessibility();
    this.initCookieBanner();
    this.updateHeaderBadges();
    this.updateAdminHeaderBadge();

    // Inscrever-se para mudanças na Store
    TramaStore.subscribe((topic) => {
      this.updateHeaderBadges();
      this.updateAdminHeaderBadge();
      if (topic === 'cart') {
        this.renderDrawerContent();
      }
      if (topic === 'catalog' || topic === 'siteContent' || topic === 'adminAuth') {
        this.refreshCurrentRoute();
      }
    });

    // Renderizar conteúdo inicial do carrinho
    this.renderDrawerContent();
  },

  updateAdminHeaderBadge: function() {
    const badge = document.getElementById('header-admin-badge');
    if (badge) {
      badge.style.display = TramaStore.isAdminLoggedIn() ? 'inline-flex' : 'none';
    }
  },

  // --------------------------------------------------------------------------
  // ROUTER (Hash-Based SPA)
  // --------------------------------------------------------------------------
  initRouter: function() {
    const handleRoute = () => {
      this.refreshCurrentRoute();
    };

    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('DOMContentLoaded', handleRoute);
  },

  refreshCurrentRoute: function() {
    const hash = window.location.hash || '#/';
    const appContainer = document.getElementById('app-content');
    if (!appContainer) return;

    // Atualizar classe ativa no menu
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === hash.split('?')[0]) {
        link.classList.add('active');
      }
    });

    this.closeMobileMenu();

    const [path, query] = hash.split('?');
    const params = new URLSearchParams(query || '');

    if (path === '#/' || path === '#' || path === '') {
      appContainer.innerHTML = TramaPages.renderHome();
    } else if (path === '#/sob-encomenda') {
      const estetica = params.get('estetica') || 'todos';
      appContainer.innerHTML = TramaPages.renderCatalog(estetica);
    } else if (path.startsWith('#/produto/')) {
      const id = path.replace('#/produto/', '');
      appContainer.innerHTML = TramaPages.renderPDP(id);
    } else if (path === '#/sacola') {
      appContainer.innerHTML = TramaPages.renderCheckout();
    } else if (path === '#/checkout') {
      appContainer.innerHTML = TramaPages.renderCheckout();
    } else if (path.startsWith('#/pedido/')) {
      const id = path.replace('#/pedido/', '');
      appContainer.innerHTML = TramaPages.renderOrderSuccess(id);
    } else if (path === '#/conta') {
      appContainer.innerHTML = TramaPages.renderAccount();
    } else if (path === '#/login') {
      appContainer.innerHTML = TramaPages.renderAuth('login');
    } else if (path === '#/cadastro') {
      appContainer.innerHTML = TramaPages.renderAuth('register');
    } else if (path === '#/admin') {
      const tab = params.get('tab') || 'produtos';
      appContainer.innerHTML = TramaPages.renderAdmin(tab);
    } else if (path === '#/sobre') {
      appContainer.innerHTML = TramaPages.renderAbout();
    } else if (path === '#/sustentabilidade') {
      appContainer.innerHTML = TramaPages.renderSustainability();
    } else if (path === '#/como-e-feita') {
      appContainer.innerHTML = TramaPages.renderHowItIsMade();
    } else if (path === '#/lookbook') {
      appContainer.innerHTML = TramaPages.renderLookbook();
    } else if (path === '#/guia-de-medidas') {
      appContainer.innerHTML = TramaPages.renderMeasurementGuide();
    } else if (path === '#/faq') {
      appContainer.innerHTML = TramaPages.renderFAQ();
    } else if (path === '#/trocas-e-envio') {
      appContainer.innerHTML = TramaPages.renderShippingReturns();
    } else if (path === '#/contato') {
      appContainer.innerHTML = TramaPages.renderContact();
    } else if (path === '#/politicas') {
      appContainer.innerHTML = TramaPages.renderPolicies('privacidade');
    } else if (path === '#/termos') {
      appContainer.innerHTML = TramaPages.renderPolicies('termos');
    } else {
      appContainer.innerHTML = TramaPages.render404();
    }
  },

  // --------------------------------------------------------------------------
  // HEADER DINÂMICO & SCROLL
  // --------------------------------------------------------------------------
  initScrollHeader: function() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > 100) {
        if (currentScroll > this.lastScrollTop) {
          header.classList.add('header-hidden');
        } else {
          header.classList.remove('header-hidden');
        }
      } else {
        header.classList.remove('header-hidden');
      }

      this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });
  },

  updateHeaderBadges: function() {
    const cartCount = TramaStore.getCartTotalCount();
    const bagBadge = document.getElementById('header-bag-count');
    if (bagBadge) {
      bagBadge.textContent = cartCount;
      bagBadge.style.display = cartCount > 0 ? 'flex' : 'none';
    }

    const wishCount = TramaStore.state.wishlist.length;
    const wishBadge = document.getElementById('header-wish-count');
    if (wishBadge) {
      wishBadge.textContent = wishCount;
      wishBadge.style.display = wishCount > 0 ? 'flex' : 'none';
    }
  },

  // --------------------------------------------------------------------------
  // SACOLA LATERAL (DRAWER 420px) & ANIMAÇÃO DO COELHO
  // --------------------------------------------------------------------------
  openCartDrawer: function() {
    this.renderDrawerContent();
    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  closeCartDrawer: function() {
    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  },

  renderDrawerContent: function() {
    const items = TramaStore.state.cart;
    const container = document.getElementById('drawer-items-list');
    const footerContainer = document.getElementById('drawer-footer-content');
    const meterFill = document.getElementById('drawer-shipping-fill');
    const meterText = document.getElementById('drawer-shipping-text');

    const subtotal = TramaStore.getCartSubtotal();
    const threshold = TramaData.brand.freeShippingThreshold;

    if (meterFill && meterText) {
      if (subtotal >= threshold) {
        meterFill.style.width = '100%';
        meterFill.style.backgroundColor = 'var(--vinho-500)';
        meterText.innerHTML = `🎉 <strong>Parabéns!</strong> Você ganhou <strong>Frete Grátis</strong> para todo o Brasil.`;
      } else {
        const percent = Math.min(100, (subtotal / threshold) * 100);
        const remaining = (threshold - subtotal).toFixed(2);
        meterFill.style.width = `${percent}%`;
        meterText.innerHTML = `Faltam <strong>R$ ${remaining}</strong> para você garantir <strong>Frete Grátis</strong>.`;
      }
    }

    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <div style="margin-bottom: 20px;">
            ${RabbitSVGs.rabbitSleeping('#6C6D74', '#4D0C0C', 72)}
          </div>
          <h3 class="serif-italic" style="font-size: 22px; margin-bottom: 8px;">Sua sacola está leve demais.</h3>
          <p style="font-size: 13px; color: var(--apres-ski); margin-bottom: 24px;">Nenhuma peça sob encomenda adicionada ainda.</p>
          <a href="#/sob-encomenda" class="btn btn-primary btn-sm" onclick="TramaApp.closeCartDrawer()">Explorar Vitrine</a>
        </div>
      `;
      if (footerContainer) footerContainer.style.display = 'none';
      return;
    }

    if (footerContainer) footerContainer.style.display = 'flex';

    container.innerHTML = items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-custom-tags">
            ${item.sizeMode === 'Sob Medida' ? `
              <span style="color: var(--vinho-500); font-weight: 600;">• Sob Medida Exclusiva</span><br/>
              Busto: ${item.measurements?.busto || '-'}cm | Cintura: ${item.measurements?.cintura || '-'}cm<br/>
              Quadril: ${item.measurements?.quadril || '-'}cm | Altura: ${item.measurements?.altura || '-'}cm
            ` : `• Tamanho Padrão: ${item.sizeMode}`}<br/>
            • ${item.fabric}<br/>
            • ${item.color}
          </div>
          <div class="cart-item-leadtime">✓ ${item.leadTime}</div>

          <div class="cart-item-qty">
            <button class="qty-btn" onclick="TramaStore.updateCartQty('${item.id}', -1)">-</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="TramaStore.updateCartQty('${item.id}', 1)">+</button>
          </div>
        </div>

        <div class="cart-item-price-col">
          <div style="font-weight: 700; font-size: 14px;">R$ ${(item.price * item.qty).toFixed(2)}</div>
          <button class="cart-item-remove" onclick="TramaStore.removeFromCart('${item.id}')">Remover</button>
        </div>
      </div>
    `).join('');

    const totalElem = document.getElementById('drawer-subtotal-val');
    if (totalElem) {
      const pixTotal = (subtotal * 0.95).toFixed(2);
      totalElem.innerHTML = `
        <span>R$ ${subtotal.toFixed(2)}</span>
        <span style="display: block; font-size: 11px; color: var(--vinho-500); font-weight: 600; margin-top: 2px;">
          ou R$ ${pixTotal} no Pix (-5% off)
        </span>
      `;
    }
  },

  triggerRabbitPawTap: function() {
    const animContainer = document.getElementById('drawer-paw-microinteraction');
    if (!animContainer) return;

    animContainer.style.display = 'flex';
    animContainer.innerHTML = `
      <div class="paw-tap-animation-wrap">
        ${RabbitSVGs.rabbitTapping("#090F15", "#4D0C0C", 48)}
        <div class="paw-tap-text">Aprovado pelo ateliê • Peça agendada</div>
      </div>
    `;

    setTimeout(() => {
      if (animContainer) animContainer.style.display = 'none';
    }, 3500);
  },

  // --------------------------------------------------------------------------
  // TOAST NOTIFICATIONS
  // --------------------------------------------------------------------------
  showToast: function(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span style="color: var(--vinho-500); font-weight: bold;">★</span>
      <span>${message}</span>
      <button class="toast-btn-undo" onclick="this.parentElement.remove()">OK</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      if (toast && toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(16px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  },

  // --------------------------------------------------------------------------
  // CMS: EDITOR VISUAL DE PEÇAS & UPLOAD DE IMAGENS NO PRÓPRIO SITE
  // --------------------------------------------------------------------------
  openProductEditor: function(productId = null) {
    this.currentEditingProductId = productId;
    const modal = document.getElementById('product-editor-modal');
    const titleElem = document.getElementById('editor-modal-title');
    const deleteBtn = document.getElementById('btn-delete-prod');

    if (!modal) return;

    if (productId) {
      const product = TramaData.products.find(p => p.id === productId);
      if (!product) return;

      if (titleElem) titleElem.textContent = `Editar: ${product.name}`;
      if (deleteBtn) deleteBtn.style.display = 'block';

      document.getElementById('edit-prod-id').value = product.id;
      document.getElementById('edit-prod-name').value = product.name;
      document.getElementById('edit-prod-price').value = product.price;
      document.getElementById('edit-prod-subtitle').value = product.subtitle || '';
      document.getElementById('edit-prod-category').value = product.category || 'vestidos';
      document.getElementById('edit-prod-aesthetics').value = product.aesthetics || 'fluido';
      document.getElementById('edit-prod-leadtime').value = product.leadTime || '20–30 dias úteis';
      document.getElementById('edit-prod-desc').value = product.description || '';
      
      const fabricStr = (product.fabrics && product.fabrics.length > 0) ? product.fabrics[0].name : '';
      document.getElementById('edit-prod-fabric').value = fabricStr;

      const colorsStr = (product.colors && product.colors.length > 0) ? product.colors.map(c => c.name).join(', ') : '';
      document.getElementById('edit-prod-colors').value = colorsStr;

      this.currentEditingImages = Array.isArray(product.images) ? [...product.images] : [];
    } else {
      if (titleElem) titleElem.textContent = "Adicionar Nova Peça à Venda";
      if (deleteBtn) deleteBtn.style.display = 'none';

      document.getElementById('product-editor-form').reset();
      document.getElementById('edit-prod-id').value = '';
      document.getElementById('edit-prod-leadtime').value = '20–30 dias úteis';
      this.currentEditingImages = [];
    }

    this.renderEditingImagesPreview();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  closeProductEditor: function() {
    const modal = document.getElementById('product-editor-modal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  },

  renderEditingImagesPreview: function() {
    const grid = document.getElementById('editor-images-preview-grid');
    if (!grid) return;

    if (this.currentEditingImages.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 24px; text-align: center; background: var(--bg); border: 1px dashed var(--slopes);">
          <span style="font-size: 13px; color: var(--apres-ski);">
            📷 Nenhuma imagem carregada ainda.<br/>
            Clique abaixo para escolher do computador ou arraste arquivos para a caixa.
          </span>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.currentEditingImages.map((img, idx) => {
      const isMain = idx === 0;
      const isHover = idx === 1;
      const tagText = isMain ? "1. Foto Capa" : (isHover ? "2. Foto Hover" : `Foto ${idx + 1}`);

      return `
        <div style="border: 1px solid var(--midnight); background: var(--bg); padding: 8px; position: relative; display: flex; flex-direction: column;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--vinho-500); margin-bottom: 4px; display: flex; justify-content: space-between;">
            <span>${tagText}</span>
            <span style="color: var(--apres-ski); font-weight: 400;">#${idx + 1}</span>
          </div>
          <img src="${img}" style="width: 100%; aspect-ratio: 3/4; object-fit: cover; border: 1px solid var(--slopes);" />
          <div style="display: flex; gap: 4px; margin-top: 6px; flex-wrap: wrap;">
            ${idx > 0 ? `
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 9px; padding: 2px 6px;" onclick="TramaApp.moveEditingImage(${idx}, -1)" title="Mover para a esquerda">
                ◀
              </button>
            ` : ''}
            ${idx < this.currentEditingImages.length - 1 ? `
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 9px; padding: 2px 6px;" onclick="TramaApp.moveEditingImage(${idx}, 1)" title="Mover para a direita">
                ▶
              </button>
            ` : ''}
            ${!isMain ? `
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 9px; padding: 2px 5px; flex: 1;" onclick="TramaApp.setEditingImageAsMain(${idx})" title="Definir como foto de capa">
                ⭐ Capa
              </button>
            ` : ''}
            <button type="button" class="btn btn-secondary btn-sm" style="font-size: 9px; padding: 2px 6px; color: var(--vinho-500); margin-left: auto;" onclick="TramaApp.removeEditingImage(${idx})" title="Remover imagem">
              ✕
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  moveEditingImage: function(index, delta) {
    const newIndex = index + delta;
    if (newIndex < 0 || newIndex >= this.currentEditingImages.length) return;
    const item = this.currentEditingImages.splice(index, 1)[0];
    this.currentEditingImages.splice(newIndex, 0, item);
    this.renderEditingImagesPreview();
  },

  compressImageFile: function(file, maxDimension, quality) {
    return TramaStore.compressImageFile(file, maxDimension, quality);
  },

  // Upload local de fotos com compressão inteligente via Canvas (Suporta clique ou Drag & Drop)
  handleImageFilesUpload: async function(eventOrFiles) {
    let files = [];
    if (eventOrFiles instanceof Event || (eventOrFiles && eventOrFiles.target && eventOrFiles.target.files)) {
      files = eventOrFiles.target.files;
    } else if (eventOrFiles && (eventOrFiles instanceof FileList || Array.isArray(eventOrFiles) || eventOrFiles.length)) {
      files = eventOrFiles;
    }
    if (!files || files.length === 0) return;

    this.showToast(`Processando e otimizando ${files.length} foto(s)...`);

    for (let i = 0; i < files.length; i++) {
      try {
        const compressedDataUrl = await TramaStore.compressImageFile(files[i], 1000, 0.82);
        this.currentEditingImages.push(compressedDataUrl);
      } catch (err) {
        console.error("Erro no processamento da imagem:", err);
      }
    }

    this.renderEditingImagesPreview();
    this.showToast("Foto(s) adicionada(s) à pré-visualização!");
    const fileInput = document.getElementById('edit-file-input');
    if (fileInput) fileInput.value = '';
  },

  addImageFromUrlInput: function() {
    const input = document.getElementById('edit-image-url-input');
    if (!input) return;
    const url = input.value.trim();

    if (!url) {
      this.showToast("Por favor, cole uma URL válida de imagem.", "error");
      return;
    }

    this.currentEditingImages.push(url);
    input.value = '';
    this.renderEditingImagesPreview();
    this.showToast("Foto por link adicionada com sucesso!");
  },

  removeEditingImage: function(index) {
    this.currentEditingImages.splice(index, 1);
    this.renderEditingImagesPreview();
  },

  setEditingImageAsMain: function(index) {
    if (index > 0 && index < this.currentEditingImages.length) {
      const selected = this.currentEditingImages.splice(index, 1)[0];
      this.currentEditingImages.unshift(selected);
      this.renderEditingImagesPreview();
      this.showToast("Imagem principal definida como capa!");
    }
  },

  saveProductFromModal: function() {
    const name = document.getElementById('edit-prod-name')?.value.trim();
    const rawPrice = (document.getElementById('edit-prod-price')?.value || '').toString().replace(/[^\d.,]/g, '').replace(',', '.');
    const price = parseFloat(rawPrice);
    const id = document.getElementById('edit-prod-id')?.value.trim();
    const subtitle = document.getElementById('edit-prod-subtitle')?.value.trim();
    const category = document.getElementById('edit-prod-category')?.value;
    const aesthetics = document.getElementById('edit-prod-aesthetics')?.value;
    const leadTime = document.getElementById('edit-prod-leadtime')?.value.trim() || '20–30 dias úteis';
    const description = document.getElementById('edit-prod-desc')?.value.trim();
    const fabricText = document.getElementById('edit-prod-fabric')?.value.trim() || 'Linho Puro 100%';
    const colorsText = document.getElementById('edit-prod-colors')?.value.trim();

    if (!name || isNaN(price) || price <= 0) {
      this.showToast("Preencha ao menos o nome e um preço válido para a peça.", "error");
      return;
    }

    // Processar tecidos
    const fabrics = [
      { id: "fab-1", name: fabricText, priceDiff: 0, origin: "Cultivo sustentável nacional" }
    ];

    // Processar cores
    let colors = [
      { id: "offwhite", name: "Off-White Natural", hex: "#F2F0EC" },
      { id: "midnight", name: "Midnight Negro", hex: "#090F15" }
    ];
    if (colorsText) {
      colors = colorsText.split(',').map((c, i) => {
        const cName = c.trim();
        return {
          id: `color-${i}`,
          name: cName,
          hex: cName.toLowerCase().includes('vinho') ? '#4D0C0C' : (cName.toLowerCase().includes('preto') || cName.toLowerCase().includes('midnight') ? '#090F15' : '#F2F0EC')
        };
      });
    }

    const productData = {
      id: id || TramaStore.slugify(name) || `prod-${Date.now()}`,
      name,
      price,
      subtitle,
      category,
      aesthetics,
      leadTime,
      description,
      images: this.currentEditingImages,
      fabrics,
      colors
    };

    const res = TramaStore.saveProduct(productData);
    this.closeProductEditor();

    if (res && res.action === 'created') {
      this.showToast(`Nova peça "${name}" adicionada ao catálogo com sucesso!`);
      window.location.hash = `#/produto/${res.product.id}`;
    } else {
      this.showToast(`Peça "${name}" e fotos atualizadas no site!`);
      this.refreshCurrentRoute();
    }
  },

  // --------------------------------------------------------------------------
  // CONTROLE DE ACESSO DO ATELIÊ (LOGIN, LOGOUT, TOGGLE EDIÇÃO)
  // --------------------------------------------------------------------------
  submitAdminLogin: function() {
    const input = document.getElementById('admin-password-input');
    const pwd = input ? input.value : '';
    if (!pwd) {
      this.showToast("Digite a senha de acesso do ateliê.", "error");
      return;
    }
    const success = TramaStore.adminLogin(pwd);
    if (success) {
      this.showToast("Acesso autorizado! Bem-vinda ao Painel do Ateliê.");
      this.updateAdminHeaderBadge();
      this.refreshCurrentRoute();
    } else {
      this.showToast("Senha incorreta. Tente novamente.", "error");
      if (input) {
        input.value = '';
        input.focus();
      }
    }
  },

  handleAdminLogout: function() {
    TramaStore.adminLogout();
    this.updateAdminHeaderBadge();
    this.showToast("Você saiu do Modo Ateliê. Exibição pública restaurada.");
    window.location.hash = '#/';
  },

  toggleDirectEditMode: function() {
    const active = TramaStore.toggleAdminDirectEdit();
    if (active) {
      this.showToast("Edição rápida na vitrine ATIVADA! Botões de edição visíveis.");
    } else {
      this.showToast("Edição rápida na vitrine DESATIVADA.");
    }
    this.refreshCurrentRoute();
  },

  deleteCurrentProductFromModal: function() {
    const id = document.getElementById('edit-prod-id')?.value;
    if (!id) return;
    this.deleteProductPrompt(id);
    this.closeProductEditor();
  },

  deleteProductPrompt: function(productId) {
    const product = TramaData.products.find(p => p.id === productId);
    const pName = product ? product.name : productId;

    if (confirm(`Tem certeza que deseja excluir a peça "${pName}" do catálogo?`)) {
      TramaStore.deleteProduct(productId);
      this.showToast(`Peça "${pName}" excluída.`);
      if (window.location.hash.includes(productId)) {
        window.location.hash = '#/sob-encomenda';
      } else {
        this.refreshCurrentRoute();
      }
    }
  },

  // --------------------------------------------------------------------------
  // CMS: EDITOR VISUAL DE TEXTOS DO SITE (Hero, Barra de Aviso, Sustentabilidade)
  // --------------------------------------------------------------------------
  openContentEditor: function() {
    const modal = document.getElementById('site-content-editor-modal');
    if (!modal) return;

    const content = TramaStore.state.siteContent || {};
    const heroFluid = content.heroFluid || {};
    const heroStraight = content.heroStraight || {};

    document.getElementById('edit-site-announcement').value = content.announcement || '';
    document.getElementById('edit-site-hero-fluid-title').value = heroFluid.title || '';
    document.getElementById('edit-site-hero-fluid-desc').value = heroFluid.desc || '';
    document.getElementById('edit-site-hero-straight-title').value = heroStraight.title || '';
    document.getElementById('edit-site-hero-straight-desc').value = heroStraight.desc || '';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  closeContentEditor: function() {
    const modal = document.getElementById('site-content-editor-modal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  },

  saveSiteContentFromModal: function() {
    const announcement = document.getElementById('edit-site-announcement')?.value.trim();
    const heroFluidTitle = document.getElementById('edit-site-hero-fluid-title')?.value.trim();
    const heroFluidDesc = document.getElementById('edit-site-hero-fluid-desc')?.value.trim();
    const heroStraightTitle = document.getElementById('edit-site-hero-straight-title')?.value.trim();
    const heroStraightDesc = document.getElementById('edit-site-hero-straight-desc')?.value.trim();

    TramaStore.saveSiteContent({
      announcement,
      heroFluid: {
        tag: "A Linha Fluida • Leveza & Caimento",
        title: heroFluidTitle,
        desc: heroFluidDesc
      },
      heroStraight: {
        tag: "A Linha Reta • Estrutura & Impacto",
        title: heroStraightTitle,
        desc: heroStraightDesc
      }
    });

    const topAnnouncementElem = document.querySelector('.announcement-text');
    if (topAnnouncementElem && announcement) {
      topAnnouncementElem.textContent = announcement;
    }

    this.closeContentEditor();
    this.showToast("Conteúdos do site atualizados com sucesso!");
    this.refreshCurrentRoute();
  },

  switchAdminTab: function(tabName) {
    window.location.hash = `#/admin?tab=${tabName}`;
  },

  // --------------------------------------------------------------------------
  // INTERAÇÕES DA PDP (CONFIGURADOR SOB MEDIDA)
  // --------------------------------------------------------------------------
  toggleSizeMode: function(mode) {
    this.selectedSizeMode = mode;
    const stdBox = document.getElementById('size-standard-box');
    const cstBox = document.getElementById('size-custom-box');
    const btnStd = document.getElementById('btn-mode-standard');
    const btnCst = document.getElementById('btn-mode-custom');

    if (mode === 'standard') {
      if (stdBox) stdBox.style.display = 'block';
      if (cstBox) cstBox.style.display = 'none';
      if (btnStd) { btnStd.className = 'btn btn-sm btn-primary'; }
      if (btnCst) { btnCst.className = 'btn btn-sm btn-secondary'; }
    } else {
      if (stdBox) stdBox.style.display = 'none';
      if (cstBox) cstBox.style.display = 'block';
      if (btnStd) { btnStd.className = 'btn btn-sm btn-secondary'; }
      if (btnCst) { btnCst.className = 'btn btn-sm btn-primary'; }
    }
  },

  selectStandardSize: function(button, size) {
    document.querySelectorAll('#size-standard-box .size-btn').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    this.selectedStandardSizeValue = size;
  },

  selectSwatch: function(button, type, value) {
    button.parentElement.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    if (type === 'color') this.selectedColorName = value;
  },

  selectFabric: function(element, basePrice, priceDiff, fabricName) {
    document.querySelectorAll('#pdp-fabric-selector .swatch-btn').forEach(b => b.classList.remove('active'));
    element.classList.add('active');
    this.selectedFabricDiff = priceDiff;
    this.selectedFabricName = fabricName;

    const display = document.getElementById('pdp-price-display');
    if (display) {
      const finalPrice = basePrice + priceDiff;
      display.textContent = `R$ ${finalPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    }
  },

  fillSavedMeasurements: function() {
    const user = TramaStore.state.user;
    if (!user || !user.savedMeasurements) {
      this.showToast("Nenhuma medida salva encontrada na conta.");
      return;
    }
    const m = user.savedMeasurements;
    if (document.getElementById('input-busto')) document.getElementById('input-busto').value = m.busto || '';
    if (document.getElementById('input-cintura')) document.getElementById('input-cintura').value = m.cintura || '';
    if (document.getElementById('input-quadril')) document.getElementById('input-quadril').value = m.quadril || '';
    if (document.getElementById('input-altura')) document.getElementById('input-altura').value = m.altura || '';
    this.showToast("Medidas salvas da sua conta preenchidas com sucesso!");
  },

  simulateShipping: function() {
    const cepInput = document.getElementById('pdp-cep-input');
    const resultBox = document.getElementById('pdp-shipping-result');
    if (!cepInput || !resultBox) return;

    const cep = cepInput.value.replace(/\D/g, '');
    if (cep.length !== 8) {
      this.showToast("Por favor, digite um CEP válido com 8 dígitos.", "error");
      return;
    }

    resultBox.style.display = 'block';
    resultBox.innerHTML = `
      <div style="border-top: 1px dashed var(--slopes); padding-top: 10px; margin-top: 8px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>• Correios SEDEX (2 dias úteis de envio):</span>
          <strong>R$ 28,00</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>• Retirada no Ateliê (Vila Madalena, SP):</span>
          <strong style="color: var(--vinho-500);">Grátis</strong>
        </div>
        <div style="font-size: 11px; color: var(--vinho-600); margin-top: 6px;">
          ★ Prazo total: 20–30 dias de produção artesanal + 2 dias de transporte.
        </div>
      </div>
    `;
  },

  addToBagFromPDP: function(productId) {
    const product = TramaData.products.find(p => p.id === productId);
    if (!product) return;

    let measurements = null;
    let sizeMode = "M";

    if (this.selectedSizeMode === 'custom') {
      const busto = parseInt(document.getElementById('input-busto')?.value);
      const cintura = parseInt(document.getElementById('input-cintura')?.value);
      const quadril = parseInt(document.getElementById('input-quadril')?.value);
      const altura = parseInt(document.getElementById('input-altura')?.value);

      if (!busto || !cintura || !quadril || !altura) {
        this.showToast("Por favor, preencha todas as medidas para a confecção sob medida.", "error");
        return;
      }

      measurements = { busto, cintura, quadril, altura };
      sizeMode = "Sob Medida";
    } else {
      sizeMode = this.selectedStandardSizeValue;
    }

    const itemPrice = product.price + (this.selectedFabricDiff || 0);
    const itemImg = TramaPages.getProductImage(product, 0);

    TramaStore.addToCart({
      productId: product.id,
      name: product.name,
      price: itemPrice,
      image: itemImg,
      sizeMode: sizeMode,
      measurements: measurements,
      fabric: this.selectedFabricName,
      color: this.selectedColorName,
      leadTime: product.leadTime,
      qty: 1
    });
  },

  switchTab: function(button, tabId) {
    document.querySelectorAll('.tab-nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    button.classList.add('active');
    const target = document.getElementById(tabId);
    if (target) target.style.display = 'block';
  },

  // --------------------------------------------------------------------------
  // FLUXO DE CHECKOUT COM DESCONTO DINÂMICO NO PIX (-5%)
  // --------------------------------------------------------------------------
  switchPaymentMethod: function(method) {
    this.selectedPaymentMethod = method;
    const btnPix = document.getElementById('btn-pay-pix');
    const btnCard = document.getElementById('btn-pay-card');
    const btnBoleto = document.getElementById('btn-pay-boleto');

    const boxPix = document.getElementById('pay-box-pix');
    const boxCard = document.getElementById('pay-box-card');
    const boxBoleto = document.getElementById('pay-box-boleto');

    [btnPix, btnCard, btnBoleto].forEach(b => { if (b) b.className = 'btn btn-sm btn-secondary'; });
    [boxPix, boxCard, boxBoleto].forEach(b => { if (b) b.style.display = 'none'; });

    const isPix = method === 'pix';
    if (isPix) {
      if (btnPix) btnPix.className = 'btn btn-sm btn-primary';
      if (boxPix) boxPix.style.display = 'block';
    } else if (method === 'card') {
      if (btnCard) btnCard.className = 'btn btn-sm btn-primary';
      if (boxCard) boxCard.style.display = 'block';
    } else {
      if (btnBoleto) btnBoleto.className = 'btn btn-sm btn-primary';
      if (boxBoleto) boxBoleto.style.display = 'block';
    }

    // Recalcular totais no Checkout em tempo real com desconto Pix 5%
    const subtotal = TramaStore.getCartSubtotal();
    const couponPercent = TramaStore.state.coupon ? TramaStore.state.coupon.discountPercent : 0;
    const couponDiscount = subtotal * (couponPercent / 100);
    const isFreeShipping = subtotal >= TramaData.brand.freeShippingThreshold;
    const shipping = isFreeShipping ? 0 : 28.0;

    const pixDiscount = isPix ? ((subtotal - couponDiscount) * 0.05) : 0;
    const totalDiscount = couponDiscount + pixDiscount;
    const total = subtotal - totalDiscount + shipping;

    // Atualizar linha do Desconto Pix no Resumo
    const pixRow = document.getElementById('chk-pix-discount-row');
    const pixVal = document.getElementById('chk-pix-discount-val');
    if (pixRow && pixVal) {
      if (isPix) {
        pixRow.style.display = 'flex';
        pixVal.textContent = `- R$ ${pixDiscount.toFixed(2)}`;
      } else {
        pixRow.style.display = 'none';
      }
    }

    // Atualizar Total exibido
    const totalDisplay = document.getElementById('chk-total-display');
    if (totalDisplay) {
      totalDisplay.textContent = `R$ ${total.toFixed(2)}`;
    }

    // Atualizar parcelas se for cartão
    if (method === 'card') {
      const cardTotal = subtotal - couponDiscount + shipping;
      const selectInstallment = document.getElementById('chk-card-installments');
      if (selectInstallment) {
        selectInstallment.innerHTML = `
          <option>1x de R$ ${cardTotal.toFixed(2)} à vista</option>
          <option>2x de R$ ${(cardTotal / 2).toFixed(2)} sem juros</option>
          <option>3x de R$ ${(cardTotal / 3).toFixed(2)} sem juros</option>
          <option>4x de R$ ${(cardTotal / 4).toFixed(2)} sem juros</option>
          <option>5x de R$ ${(cardTotal / 5).toFixed(2)} sem juros</option>
          <option>6x de R$ ${(cardTotal / 6).toFixed(2)} sem juros</option>
        `;
      }
    }
  },

  copyPixCode: function(code) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        this.showToast("Código Pix Copia e Cola copiado com sucesso!");
      }).catch(() => {
        this.showToast("Código Pix copiado!");
      });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showToast("Código Pix copiado!");
    }
  },

  lookupAddressByCEP: function(rawCep) {
    const cep = rawCep.replace(/\D/g, '');
    if (cep.length !== 8) return;

    this.showToast("Buscando endereço pelo CEP...");
    setTimeout(() => {
      const street = document.getElementById('chk-street');
      const neighborhood = document.getElementById('chk-neighborhood');
      if (street && !street.value) street.value = "Rua Harmonia";
      if (neighborhood && !neighborhood.value) neighborhood.value = "Vila Madalena";
      this.showToast("Endereço localizado: São Paulo - SP");
    }, 400);
  },

  processCheckout: function() {
    const name = document.getElementById('chk-name')?.value;
    const email = document.getElementById('chk-email')?.value;
    const phone = document.getElementById('chk-phone')?.value;
    const cpf = document.getElementById('chk-cpf')?.value;
    const street = document.getElementById('chk-street')?.value;
    const number = document.getElementById('chk-number')?.value;
    const comp = document.getElementById('chk-comp')?.value;
    const neighborhood = document.getElementById('chk-neighborhood')?.value;
    const cep = document.getElementById('chk-cep')?.value;

    if (!name || !email || !cpf || !street || !number) {
      this.showToast("Por favor, preencha todos os campos obrigatórios.", "error");
      return;
    }

    const method = this.selectedPaymentMethod || 'pix';
    const isPix = method === 'pix';

    const subtotal = TramaStore.getCartSubtotal();
    const couponPercent = TramaStore.state.coupon ? TramaStore.state.coupon.discountPercent : 0;
    const couponDiscount = subtotal * (couponPercent / 100);
    const pixDiscount = isPix ? ((subtotal - couponDiscount) * 0.05) : 0;
    const totalDiscount = couponDiscount + pixDiscount;

    const isFreeShipping = subtotal >= TramaData.brand.freeShippingThreshold;
    const shipping = isFreeShipping ? 0 : 28.0;
    const total = subtotal - totalDiscount + shipping;

    const paymentMethodText = isPix 
      ? "Pix (-5% de desconto aplicado)" 
      : (method === 'card' ? "Cartão de Crédito" : "Boleto Bancário");

    const newOrder = TramaStore.createOrder({
      name,
      email,
      phone,
      cpf,
      address: {
        street,
        number,
        complement: comp,
        neighborhood,
        cep,
        city: "São Paulo",
        state: "SP"
      },
      subtotal,
      discount: totalDiscount,
      pixDiscount: pixDiscount,
      shippingCost: shipping,
      total,
      paymentMethod: paymentMethodText
    });

    this.showToast("Pedido confirmado com sucesso! Redirecionando...");
    window.location.hash = `#/pedido/${newOrder.id}`;
  },

  // --------------------------------------------------------------------------
  // ÁREA DA CLIENTE
  // --------------------------------------------------------------------------
  switchAccountTab: function(tabName) {
    document.querySelectorAll('.account-layout > div:last-child > div').forEach(d => d.style.display = 'none');
    document.querySelectorAll('.account-layout > div:first-child .btn').forEach(b => b.className = 'btn btn-block btn-secondary');

    const targetTab = document.getElementById(`acc-tab-${tabName}`);
    if (targetTab) targetTab.style.display = 'block';

    const currentBtn = event?.currentTarget;
    if (currentBtn) currentBtn.className = 'btn btn-block btn-primary';
  },

  saveAccountMeasurements: function() {
    const busto = parseInt(document.getElementById('acc-busto')?.value);
    const cintura = parseInt(document.getElementById('acc-cintura')?.value);
    const quadril = parseInt(document.getElementById('acc-quadril')?.value);
    const altura = parseInt(document.getElementById('acc-altura')?.value);

    TramaStore.updateSavedMeasurements({ busto, cintura, quadril, altura });
  },

  exportUserData: function() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(TramaStore.state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "trama_dados_pessoais_lgpd.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    this.showToast("Arquivo de dados exportado conforme LGPD.");
  },

  deleteUserAccount: function() {
    if (confirm("Tem certeza que deseja excluir sua conta e todas as medidas salvas? Esta ação é irreversível.")) {
      TramaStore.state.user = null;
      TramaStore.saveUser();
      this.showToast("Conta excluída definitivamente conforme solicitado.");
      window.location.hash = '#/';
    }
  },

  logout: function() {
    if (TramaStore.state.user) {
      TramaStore.state.user.isLoggedIn = false;
      TramaStore.saveUser();
    }
    this.showToast("Sessão finalizada com sucesso.");
    window.location.hash = '#/login';
  },

  socialLoginGoogle: function() {
    this.showToast("Autenticando via Google Seguro...");
    setTimeout(() => {
      TramaStore.state.user = {
        isLoggedIn: true,
        name: "Camila Guimarães",
        email: "camila@google.com",
        phone: "(41) 99258-4033",
        savedMeasurements: { busto: 92, cintura: 72, quadril: 101, altura: 168 }
      };
      TramaStore.saveUser();
      this.showToast("Login com Google concluído!");
      window.location.hash = '#/conta';
    }, 600);
  },

  handleAuthSubmit: function() {
    const email = document.getElementById('auth-email')?.value;
    const name = document.getElementById('auth-name')?.value || "Cliente Trama";

    TramaStore.state.user = {
      isLoggedIn: true,
      name: name,
      email: email,
      phone: "(41) 99258-4033",
      savedMeasurements: { busto: 90, cintura: 70, quadril: 98, altura: 165 }
    };
    TramaStore.saveUser();
    this.showToast(`Bem-vinda à Trama, ${name}!`);
    window.location.hash = '#/conta';
  },

  // --------------------------------------------------------------------------
  // MODAIS
  // --------------------------------------------------------------------------
  openMeasurementModal: function() {
    const modal = document.getElementById('measurement-modal');
    if (modal) modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  closeMeasurementModal: function() {
    const modal = document.getElementById('measurement-modal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  },

  openSearchModal: function(initialQuery = '') {
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('modal-search-input');
    if (modal) modal.classList.add('open');
    if (input) {
      input.value = initialQuery;
      input.focus();
      this.handleSearchInput(initialQuery);
    }
    document.body.style.overflow = 'hidden';
  },

  closeSearchModal: function() {
    const modal = document.getElementById('search-modal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  },

  handleSearchInput: function(query) {
    const resultsContainer = document.getElementById('search-live-results');
    if (!resultsContainer) return;

    const q = query.trim().toLowerCase();
    if (!q) {
      resultsContainer.innerHTML = `
        <div style="font-size: 13px; color: var(--apres-ski); padding: 20px 0;">
          Experimente buscar por: <em>"vestido"</em>, <em>"linho"</em>, <em>"blazer"</em>, <em>"reto"</em>, <em>"colete"</em>...
        </div>
      `;
      return;
    }

    const matches = TramaData.products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.aesthetics.toLowerCase().includes(q) ||
      (p.fabrics && p.fabrics.some(f => f.name.toLowerCase().includes(q))) ||
      (p.colors && p.colors.some(c => c.name.toLowerCase().includes(q)))
    );

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div style="padding: 24px 0; text-align: center;">
          <p style="color: var(--apres-ski); font-size: 14px;">Nenhuma peça encontrada para "${query}".</p>
          <p style="font-size: 12px; color: var(--mountainside); margin-top: 6px;">Sugestão: Confira nossos modelos em <a href="#/sob-encomenda" onclick="TramaApp.closeSearchModal()" class="link-underlined">Linho Puro</a> ou <a href="#/sob-encomenda" onclick="TramaApp.closeSearchModal()" class="link-underlined">Alfaiataria</a>.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 16px;">
        ${matches.map(p => {
          const img = TramaPages.getProductImage(p, 0);
          return `
            <a href="#/produto/${p.id}" onclick="TramaApp.closeSearchModal()" style="display: flex; gap: 16px; align-items: center; padding: 10px; border: 1px solid var(--slopes); background: var(--card-bg);">
              <img src="${img}" style="width: 50px; aspect-ratio: 3/4; object-fit: cover;" alt="${p.name}" />
              <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 14px;">${p.name}</div>
                <div style="font-size: 12px; color: var(--apres-ski);">Linha ${p.aesthetics} • ${p.leadTime}</div>
              </div>
              <div style="font-weight: 700; font-size: 14px;">R$ ${p.price.toFixed(2)}</div>
            </a>
          `;
        }).join('')}
      </div>
    `;
  },

  initKeyboardAccessibility: function() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeCartDrawer();
        this.closeMeasurementModal();
        this.closeSearchModal();
        this.closeProductEditor();
        this.closeContentEditor();
        this.closeMobileMenu();
      }
    });
  },

  initCookieBanner: function() {
    const banner = document.getElementById('cookie-consent-banner');
    if (!banner) return;

    const consent = localStorage.getItem('trama_cookie_consent');
    if (!consent) {
      banner.style.display = 'flex';
    } else {
      banner.style.display = 'none';
    }
  },

  setCookieConsent: function(choice) {
    localStorage.setItem('trama_cookie_consent', choice);
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) banner.style.display = 'none';
    this.showToast(`Preferências de privacidade salvas (${choice}).`);
  },

  toggleMobileMenu: function() {
    const nav = document.getElementById('header-nav-list');
    if (nav) nav.classList.toggle('mobile-open');
  },

  closeMobileMenu: function() {
    const nav = document.getElementById('header-nav-list');
    if (nav) nav.classList.remove('mobile-open');
  }
};

window.TramaApp = TramaApp;

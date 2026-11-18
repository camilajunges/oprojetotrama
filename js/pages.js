/* ==========================================================================
   PROJETO TRAMA - RENDERIZADORES DE PÁGINAS & FLUXOS COMPLETOS
   Com suporte a CMS (Adicionar Peças, Mudar Fotos e Editar Conteúdos no Site)
   ========================================================================== */

const TramaPages = {

  // Helper para imagem segura: garante que mesmo peças sem foto tenham visual perfeito
  getProductImage: function(product, index = 0) {
    if (product && Array.isArray(product.images) && product.images.length > index && product.images[index]) {
      return product.images[index];
    }
    if (product && Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
      return product.images[0];
    }
    return this.getPlaceholderImage(product?.name || "Peça Trama");
  },

  getPlaceholderImage: function(title = "Peça Trama") {
    const encodedTitle = encodeURIComponent(title);
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'%3E%3Crect width='600' height='800' fill='%23D3D1CE'/%3E%3Crect x='20' y='20' width='560' height='760' fill='none' stroke='%23B3B7BA' stroke-width='1'/%3E%3Ctext x='50%25' y='42%25' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%236C6D74' letter-spacing='3'%3EPROJETO TRAMA%3C/text%3E%3Ctext x='50%25' y='48%25' text-anchor='middle' font-family='serif' font-size='22' font-style='italic' fill='%23090F15'%3E${encodedTitle}%3C/text%3E%3Cpolygon points='300,420 306,438 325,438 310,449 316,467 300,455 284,467 290,449 275,438 294,438' fill='%234D0C0C'/%3E%3Ctext x='50%25' y='530' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%234D0C0C' letter-spacing='1'%3E%5B CLIQUE EM EDITAR PARA ADICIONAR FOTO %5D%3C/text%3E%3C/svg%3E`;
  },
  
  // --------------------------------------------------------------------------
  // 1. HOME PAGE (Hero Dividido, Manifesto, Vitrine, 4 Passos, Sustentabilidade)
  // --------------------------------------------------------------------------
  renderHome: function() {
    const featured = TramaData.products.slice(0, 4);
    const content = TramaStore.state.siteContent || {};
    const heroFluid = content.heroFluid || {
      tag: "A Linha Fluida • Leveza & Caimento",
      title: "O movimento livre do tecido que respira.",
      desc: "Peças feitas sob encomenda em linho cru e pura seda. Sem sobras, sem pressa, respeitando o tempo orgânico da matéria."
    };
    const heroStraight = content.heroStraight || {
      tag: "A Linha Reta • Estrutura & Impacto",
      title: "A precisão geométrica do corte afiado.",
      desc: "Alfaiataria rigorosa construída para resistir aos anos. Ombros definidos, costuras limpas e atitude arquitetônica."
    };

    return `
      <!-- Faixa do Hero Dividido ao Meio (Fluido x Reto) -->
      <section class="split-hero">
        <!-- Metade Fluida (Esquerda, Clara) -->
        <div class="hero-half hero-fluid">
          <div class="hero-content animate-fade-in">
            <span class="hero-tag caps-label">${heroFluid.tag}</span>
            <h1 class="hero-title serif-italic">${heroFluid.title}</h1>
            <p class="hero-desc">${heroFluid.desc}</p>
            <div>
              <a href="#/sob-encomenda?estetica=fluido" class="btn btn-secondary">Explorar Linha Fluida</a>
            </div>
          </div>
        </div>

        <!-- Metade Reta (Direita, Escura) -->
        <div class="hero-half hero-straight">
          <div class="hero-content animate-fade-in" style="animation-delay: 0.15s;">
            <span class="hero-tag caps-label">${heroStraight.tag}</span>
            <h1 class="hero-title font-serif">${heroStraight.title}</h1>
            <p class="hero-desc">${heroStraight.desc}</p>
            <div>
              <a href="#/sob-encomenda?estetica=reto" class="btn btn-primary">Encomendar Alfaiataria</a>
            </div>
          </div>
        </div>

        <!-- Símbolo Central na Linha Divisória: Coelho com Estrela Vinho -->
        <div class="hero-center-emblem" title="Dualidade Trama: Fluido x Reto">
          ${RabbitSVGs.symbol("#090F15", "#4D0C0C", 38)}
          <span style="font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 4px;">TRAMA</span>
        </div>
      </section>

      <!-- 2. Manifesto Curto (#1C010C) -->
      <section class="bg-impact section-spacing-sm text-center">
        <div class="container" style="max-width: 820px;">
          <span class="caps-label" style="color: var(--slopes); display: block; margin-bottom: 16px;">Nosso Conceito Fundamental</span>
          <h2 class="serif-italic" style="font-size: clamp(24px, 3.8vw, 38px); line-height: 1.3; margin-bottom: 24px; color: var(--offwhite);">
            "A alma da Trama habita no equilíbrio entre o delicado e o forte. O tecido encontra o corte; a curva acolhe a linha reta."
          </h2>
          <p style="color: var(--arctic); font-size: 16px; margin-bottom: 28px;">
            Não criamos estoques que envelhecem em prateleiras. Cada peça começa a existir apenas depois do seu pedido, com as suas medidas exatas.
          </p>
          <a href="#/sobre" class="link-underlined caps-label" style="color: var(--offwhite);">Conheça o Manifesto da Marca →</a>
        </div>
      </section>

      <!-- 3. Vitrine Sob Encomenda (Destaques) -->
      <section class="section-spacing">
        <div class="container">
          <div class="flex-between flex-wrap gap-sm" style="margin-bottom: 48px;">
            <div>
              <span class="caps-label text-muted">Feito para você sob encomenda</span>
              <h2 class="font-serif" style="margin-top: 6px;">Peças em Produção</h2>
            </div>
            <div style="display: flex; gap: 10px;">
              ${(TramaStore.isAdminLoggedIn() && TramaStore.state.adminDirectEdit) ? `
                <button class="btn btn-sm btn-secondary" onclick="TramaApp.openProductEditor()">+ Adicionar Nova Peça</button>
              ` : ''}
              <a href="#/sob-encomenda" class="btn btn-primary btn-sm">Ver Catálogo Completo</a>
            </div>
          </div>

          <div class="product-grid">
            ${featured.map(p => this.renderProductCard(p)).join('')}
          </div>
        </div>
      </section>

      <!-- 4. Como Funciona (4 Passos Ilustrados do Made-to-Order) -->
      <section style="background-color: var(--card-bg-subtle); padding: 96px 0;">
        <div class="container">
          <div class="text-center" style="max-width: 640px; margin: 0 auto 60px auto;">
            <span class="caps-label text-muted">Transparência Radical</span>
            <h2 class="font-serif" style="margin-top: 8px;">Como sua peça ganha vida</h2>
            <p style="margin-top: 12px; color: var(--apres-ski);">Do primeiro clique à entrega em suas mãos, sem desperdício de matéria-prima.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 32px;">
            <div style="padding: 28px; background: var(--bg); border: 1px solid var(--slopes);">
              <div style="color: var(--vinho-500); margin-bottom: 16px;">${RabbitSVGs.icon('scissors', 28)}</div>
              <span class="caps-label text-muted">Passo 01 • 1 Dia</span>
              <h3 style="font-size: 18px; margin: 8px 0 10px 0;">1. Escolha & Tecido</h3>
              <p style="font-size: 14px; color: var(--mountainside);">Selecione o corte ideal e as fibras nobres nacionais que melhor se adequam ao seu toque.</p>
            </div>

            <div style="padding: 28px; background: var(--bg); border: 1px solid var(--slopes);">
              <div style="color: var(--vinho-500); margin-bottom: 16px;">${RabbitSVGs.icon('ruler', 28)}</div>
              <span class="caps-label text-muted">Passo 02 • Imediato</span>
              <h3 style="font-size: 18px; margin: 8px 0 10px 0;">2. Suas Medidas</h3>
              <p style="font-size: 14px; color: var(--mountainside);">Informe suas medidas corporais ou use seus dados salvos para modelagem exclusiva.</p>
            </div>

            <div style="padding: 28px; background: var(--bg); border: 1px solid var(--slopes);">
              <div style="color: var(--vinho-500); margin-bottom: 16px;">${RabbitSVGs.icon('leaf', 28)}</div>
              <span class="caps-label text-muted">Passo 03 • 20 a 30 Dias</span>
              <h3 style="font-size: 18px; margin: 8px 0 10px 0;">3. Confecção Artesanal</h3>
              <p style="font-size: 14px; color: var(--mountainside);">Corte individual a laser e costura refinada por nossas mestras alfaiates em São Paulo.</p>
            </div>

            <div style="padding: 28px; background: var(--bg); border: 1px solid var(--slopes);">
              <div style="color: var(--vinho-500); margin-bottom: 16px;">${RabbitSVGs.icon('truck', 28)}</div>
              <span class="caps-label text-muted">Passo 04 • 2 a 5 Dias</span>
              <h3 style="font-size: 18px; margin: 8px 0 10px 0;">4. Envio Sustentável</h3>
              <p style="font-size: 14px; color: var(--mountainside);">Embalagem biodegradável de algodão cru, entregue com código de rastreamento direto.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Blocos Fluido / Reto / Encontro -->
      <section class="section-spacing">
        <div class="container">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
            <!-- Bloco Fluido -->
            <a href="#/sob-encomenda?estetica=fluido" style="padding: 48px 36px; background: #EAE8E4; border: 1px solid var(--slopes); display: flex; flex-direction: column; justify-content: space-between; min-height: 280px; transition: var(--transition-fast);">
              <div>
                <span class="badge badge-fluido">Estética Fluida</span>
                <h3 class="serif-italic" style="font-size: 28px; margin: 16px 0 8px 0;">Drapeados & Movimento</h3>
                <p style="font-size: 14px; color: var(--apres-ski);">Silhuetas que acompanham o ar, tecidos que não aprisionam.</p>
              </div>
              <span class="caps-label link-underlined" style="margin-top: 24px;">Filtrar Peças Fluidas →</span>
            </a>

            <!-- Bloco Reto -->
            <a href="#/sob-encomenda?estetica=reto" style="padding: 48px 36px; background: var(--midnight); color: var(--offwhite); border: 1px solid var(--mountainside); display: flex; flex-direction: column; justify-content: space-between; min-height: 280px; transition: var(--transition-fast);">
              <div>
                <span class="badge badge-reto">Estética Reta</span>
                <h3 class="font-serif" style="font-size: 28px; margin: 16px 0 8px 0; color: var(--offwhite);">Linhas & Rigor</h3>
                <p style="font-size: 14px; color: var(--arctic);">Geometria pura, alfaiataria firme e presença imponente.</p>
              </div>
              <span class="caps-label link-underlined" style="margin-top: 24px; color: var(--offwhite);">Filtrar Peças Retas →</span>
            </a>

            <!-- Bloco Encontro -->
            <a href="#/sob-encomenda?estetica=encontro" style="padding: 48px 36px; background: var(--bg); border: 1px solid var(--midnight); display: flex; flex-direction: column; justify-content: space-between; min-height: 280px; transition: var(--transition-fast);">
              <div>
                <span class="badge badge-encontro">O Encontro</span>
                <h3 class="serif-italic" style="font-size: 28px; margin: 16px 0 8px 0;">A Dualidade Concreta</h3>
                <p style="font-size: 14px; color: var(--mountainside);">Peças híbridas onde o reto e o fluido se fundem na mesma costura.</p>
              </div>
              <span class="caps-label link-underlined" style="margin-top: 24px;">Filtrar O Encontro →</span>
            </a>
          </div>
        </div>
      </section>

      <!-- 6. Sustentabilidade em Números Reais -->
      <section class="section-spacing-sm" style="border-top: 1px solid var(--slopes); border-bottom: 1px solid var(--slopes);">
        <div class="container">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 40px; text-align: center;">
            ${(content.sustainability || TramaData.sustainabilityStats).map(s => `
              <div>
                <div class="font-serif" style="font-size: clamp(38px, 4vw, 54px); color: var(--vinho-500); margin-bottom: 8px;">${s.number}</div>
                <div class="caps-label" style="margin-bottom: 6px;">${s.label}</div>
                <div style="font-size: 13px; color: var(--apres-ski);">${s.detail}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- 7. Lookbook & Editorial Prévia -->
      <section class="section-spacing">
        <div class="container">
          <div class="flex-between flex-wrap gap-sm" style="margin-bottom: 36px;">
            <div>
              <span class="caps-label text-muted">Ensaios Visuais</span>
              <h2 class="font-serif">Lookbook & Composições</h2>
            </div>
            <a href="#/lookbook" class="link-underlined caps-label">Ver Lookbook Completo →</a>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            <div style="aspect-ratio: 4/5; overflow: hidden; position: relative;">
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80" style="width: 100%; height: 100%; object-fit: cover;" alt="Editorial Trama" />
            </div>
            <div style="aspect-ratio: 4/5; overflow: hidden; position: relative;">
              <img src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80" style="width: 100%; height: 100%; object-fit: cover;" alt="Editorial Trama" />
            </div>
            <div style="aspect-ratio: 4/5; overflow: hidden; position: relative;">
              <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80" style="width: 100%; height: 100%; object-fit: cover;" alt="Editorial Trama" />
            </div>
          </div>
        </div>
      </section>

      <!-- 8. Newsletter -->
      <section class="bg-midnight section-spacing text-center" style="border-top: 1px solid var(--mountainside);">
        <div class="container" style="max-width: 620px;">
          <div style="margin-bottom: 20px;">
            ${RabbitSVGs.symbol("#F2F0EC", "#4D0C0C", 40)}
          </div>
          <h2 class="serif-italic" style="color: var(--offwhite); margin-bottom: 12px;">"Lançamentos, bastidores e nada de excesso. Nem na sua caixa de entrada."</h2>
          <p style="color: var(--arctic); font-size: 14px; margin-bottom: 32px;">Receba cartas ocasionais sobre nossos novos tecidos, aberturas de vagas no ateliê e filosofia slow fashion.</p>

          <form onsubmit="event.preventDefault(); TramaApp.showToast('Inscrição confirmada com respeito à sua privacidade.'); this.reset();" style="text-align: left;">
            <div style="display: flex; gap: 8px;">
              <input type="email" required placeholder="Seu melhor e-mail" style="flex: 1; padding: 14px 16px; background: rgba(255,255,255,0.06); border: 1px solid var(--mountainside); color: var(--offwhite); font-family: var(--font-straight); font-size: 14px;" />
              <button type="submit" class="btn btn-primary">Inscrever</button>
            </div>
            <div class="checkbox-group" style="margin-top: 14px;">
              <input type="checkbox" id="lgpd-news" required checked />
              <label for="lgpd-news" class="checkbox-label" style="color: var(--slopes); font-size: 11px;">
                Concordo em receber comunicações exclusivas do Projeto Trama conforme a Lei Geral de Proteção de Dados (LGPD).
              </label>
            </div>
          </form>
        </div>
      </section>
    `;
  },

  // --------------------------------------------------------------------------
  // 2. CATÁLOGO / VITRINE SOB ENCOMENDA (Listagem, Filtros Combináveis, Ordenação)
  // --------------------------------------------------------------------------
  renderCatalog: function(selectedAesthetics = 'todos') {
    let filtered = TramaData.products;

    if (selectedAesthetics && selectedAesthetics !== 'todos') {
      filtered = filtered.filter(p => p.aesthetics === selectedAesthetics);
    }

    return `
      <section class="section-spacing-sm">
        <div class="container">
          <!-- Cabeçalho Institucional de 1 Linha com Botões de Ação Visual -->
          <div style="border-bottom: 1px solid var(--slopes); padding-bottom: 24px; margin-bottom: 36px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
            <div>
              <span class="caps-label text-muted">Vitrine Permanente Made-to-Order</span>
              <h1 class="serif-italic" style="font-size: clamp(28px, 4vw, 44px); margin: 8px 0 6px 0;">Sob Encomenda</h1>
              <p style="font-size: 16px; color: var(--mountainside); font-weight: 400;">
                "Produzimos sua peça depois do pedido. Nada sobra."
              </p>
            </div>
            
            <!-- Ações de CMS no Catálogo: Apenas para Administradora com Modo Rápido ativo -->
            ${(TramaStore.isAdminLoggedIn() && TramaStore.state.adminDirectEdit) ? `
              <div style="display: flex; gap: 10px;">
                <button class="btn btn-primary btn-sm" onclick="TramaApp.openProductEditor()">
                  + Adicionar Nova Peça à Venda
                </button>
                <a href="#/admin" class="btn btn-secondary btn-sm">
                  ⚙️ Painel do Ateliê
                </a>
              </div>
            ` : ''}
          </div>

          <!-- Barra de Filtros Combináveis & Ordenação -->
          <div class="flex-between flex-wrap gap-sm" style="margin-bottom: 32px; padding: 16px; background-color: var(--card-bg-subtle); border: 1px solid var(--slopes);">
            <!-- Filtro de Estética (Fluido / Reto / Encontro) -->
            <div class="flex-wrap gap-sm" style="display: flex; align-items: center;">
              <span class="caps-label" style="font-size: 11px; margin-right: 6px;">Estética:</span>
              <a href="#/sob-encomenda?estetica=todos" class="btn btn-sm ${selectedAesthetics === 'todos' ? 'btn-primary' : 'btn-secondary'}">Todos</a>
              <a href="#/sob-encomenda?estetica=fluido" class="btn btn-sm ${selectedAesthetics === 'fluido' ? 'btn-primary' : 'btn-secondary'}">Fluido</a>
              <a href="#/sob-encomenda?estetica=reto" class="btn btn-sm ${selectedAesthetics === 'reto' ? 'btn-primary' : 'btn-secondary'}">Reto</a>
              <a href="#/sob-encomenda?estetica=encontro" class="btn btn-sm ${selectedAesthetics === 'encontro' ? 'btn-primary' : 'btn-secondary'}">O Encontro</a>
            </div>

            <!-- Contador & Ordenação -->
            <div class="flex-center gap-sm">
              <span class="text-muted" style="font-size: 13px;">${filtered.length} peças encontradas</span>
              <select onchange="TramaApp.sortCatalog(this.value)" class="form-select" style="width: auto; padding: 6px 12px; font-size: 13px; border: 1px solid var(--slopes); background: var(--bg);">
                <option value="novidades">Ordenar: Novidades</option>
                <option value="menor-preco">Menor Preço</option>
                <option value="maior-preco">Maior Preço</option>
                <option value="mais-vendidos">Mais Vendidos</option>
              </select>
            </div>
          </div>

          <!-- Grid de Produtos -->
          <div class="product-grid" id="catalog-grid">
            ${filtered.map(p => this.renderProductCard(p)).join('')}
          </div>

          <!-- Paginação com Botão "Ver Mais" -->
          <div class="text-center" style="margin-top: 60px;">
            <p style="font-size: 12px; color: var(--apres-ski); margin-bottom: 12px;">Exibindo todas as peças disponíveis da coleção artesanal</p>
            <button class="btn btn-secondary" onclick="TramaApp.showToast('Você já está visualizando todo o catálogo autoral.');">Todas as peças carregadas</button>
          </div>
        </div>
      </section>
    `;
  },

  // --------------------------------------------------------------------------
  // CARD DE PRODUTO INDIVIDUAL (3:4, Troca de Imagem no Hover, Selos e Edição)
  // --------------------------------------------------------------------------
  renderProductCard: function(product) {
    const isFav = TramaStore.isWishlisted(product.id);
    const badgeEstetica = product.aesthetics === 'fluido' ? 'badge-fluido' : (product.aesthetics === 'reto' ? 'badge-reto' : 'badge-encontro');
    const labelEstetica = product.aesthetics === 'fluido' ? 'Fluido' : (product.aesthetics === 'reto' ? 'Reto' : 'Encontro');
    const img1 = this.getProductImage(product, 0);
    const img2 = this.getProductImage(product, 1) || img1;

    return `
      <div class="product-card" onclick="location.hash = '#/produto/${product.id}'">
        <div class="product-image-wrap">
          <img src="${img1}" alt="${product.name}" class="product-img" loading="lazy" />
          <img src="${img2}" alt="${product.name}" class="product-img product-img-secondary" loading="lazy" />
          
          <!-- Selos Obrigatórios -->
          <div class="card-badges">
            <span class="badge ${badgeEstetica}">${labelEstetica}</span>
            <span class="badge badge-sob-encomenda">Sob Encomenda</span>
          </div>

          <!-- Botões de Ação no Card: Favorito (e Editar apenas se Administradora com Modo Rápido ativo) -->
          <div style="position: absolute; top: 12px; right: 12px; display: flex; gap: 6px; z-index: 3;">
            ${(TramaStore.isAdminLoggedIn() && TramaStore.state.adminDirectEdit) ? `
              <button class="btn-favorite" onclick="event.stopPropagation(); TramaApp.openProductEditor('${product.id}')" title="Editar peça e fotos no site" style="position: static; font-size: 11px; width: auto; padding: 0 8px; height: 36px;">
                ✏️ Editar
              </button>
            ` : ''}
            <button class="btn-favorite ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); TramaStore.toggleWishlist('${product.id}');" title="Favoritar peça" style="position: static;">
              ${RabbitSVGs.icon('heart', 16)}
            </button>
          </div>
        </div>

        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <div class="product-name">${product.name}</div>
          <div class="product-price">R$ ${product.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
          <div class="product-production-time">${RabbitSVGs.icon('leaf', 12)} ${product.leadTime} • Feito para você</div>
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 3. PÁGINA DE PRODUTO (PDP) COM CONFIGURADOR SOB MEDIDA INTEGRAL & CMS DIRETO
  // --------------------------------------------------------------------------
  renderPDP: function(productId) {
    const product = TramaData.products.find(p => p.id === productId) || TramaData.products[0];
    const matchProduct = TramaData.products.find(p => p.id === product.matchWith) || TramaData.products[1] || product;
    const userMeasurements = TramaStore.state.user?.savedMeasurements || { busto: '', cintura: '', quadril: '', altura: '' };
    const pixPrice = (product.price * 0.95).toFixed(2);
    const installmentPrice = (product.price / 6).toFixed(2);

    const images = (product.images && product.images.length > 0)
      ? product.images
      : [this.getPlaceholderImage(product.name)];

    return `
      <div class="container section-spacing-sm">
        
        <!-- Barra de Ação Rápida de Edição do Ateliê: Apenas para Administradora com Modo Rápido ativo -->
        ${(TramaStore.isAdminLoggedIn() && TramaStore.state.adminDirectEdit) ? `
          <div style="background: var(--card-bg-subtle); border: 1px solid var(--slopes); padding: 12px 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge badge-sob-encomenda">Modo Ateliê Ativo</span>
              <span style="font-size: 13px; color: var(--mountainside);">Deseja trocar as imagens ou alterar o preço e textos desta peça?</span>
            </div>
            <button class="btn btn-sm btn-primary" onclick="TramaApp.openProductEditor('${product.id}')">
              ✏️ Editar Peça & Adicionar/Trocar Imagens
            </button>
          </div>
        ` : ''}

        <!-- Breadcrumbs -->
        <nav style="font-size: 12px; color: var(--apres-ski); margin-bottom: 24px; text-transform: uppercase; letter-spacing: var(--tracking-caps);">
          <a href="#/" class="link-underlined">Home</a> / 
          <a href="#/sob-encomenda" class="link-underlined">Sob Encomenda</a> / 
          <span style="color: var(--midnight);">${product.name}</span>
        </nav>

        <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 48px;" class="pdp-layout">
          <!-- Coluna Esquerda: Galeria Desktop + Mobile -->
          <div style="display: flex; gap: 16px;">
            <!-- Miniaturas Verticais -->
            <div style="display: flex; flex-direction: column; gap: 12px; width: 84px;" class="pdp-thumbs">
              ${images.map((img, idx) => `
                <img src="${img}" style="width: 84px; aspect-ratio: 3/4; object-fit: cover; cursor: pointer; border: 1px solid ${idx === 0 ? 'var(--midnight)' : 'var(--slopes)'};" onclick="document.getElementById('pdp-main-photo').src = '${img}';" alt="Miniatura ${idx + 1}" />
              `).join('')}
            </div>

            <!-- Imagem Principal com Zoom no Desktop -->
            <div style="flex: 1; aspect-ratio: 3/4; background: var(--arctic); border: 1px solid var(--slopes); overflow: hidden; position: relative;">
              <img id="pdp-main-photo" src="${images[0]}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" onmousemove="this.style.transform = 'scale(1.15)'" onmouseleave="this.style.transform = 'scale(1)'" />
              <div style="position: absolute; bottom: 12px; left: 12px; background: rgba(9,15,21,0.7); color: #FFF; font-size: 11px; padding: 4px 8px; text-transform: uppercase;">
                ${product.aesthetics} • Made-to-order
              </div>
            </div>
          </div>

          <!-- Coluna Direita: Informações & Configurador de Medidas -->
          <div>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
              <span class="badge ${product.aesthetics === 'fluido' ? 'badge-fluido' : (product.aesthetics === 'reto' ? 'badge-reto' : 'badge-encontro')}">
                Linha ${product.aesthetics}
              </span>
              <span class="badge badge-sob-encomenda">Feito Sob Encomenda</span>
            </div>

            <h1 class="serif-italic" style="font-size: clamp(26px, 3.5vw, 36px); margin-bottom: 6px;">${product.name}</h1>
            <p style="font-size: 14px; color: var(--apres-ski); margin-bottom: 16px;">${product.subtitle}</p>

            <!-- Preço e Formas de Pagamento -->
            <div style="padding: 16px; background-color: var(--card-bg-subtle); border: 1px solid var(--slopes); margin-bottom: 24px;">
              <div style="display: flex; align-items: baseline; gap: 12px;">
                <span style="font-size: 26px; font-weight: 700; color: var(--midnight);" id="pdp-price-display">
                  R$ ${product.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                </span>
                <span style="font-size: 13px; color: var(--vinho-500); font-weight: 600;">
                  (R$ ${pixPrice} no Pix com 5% de desconto)
                </span>
              </div>
              <div style="font-size: 12px; color: var(--apres-ski); margin-top: 4px;">
                ou até 6x de R$ ${installmentPrice} sem juros no cartão
              </div>
              <div style="font-size: 12px; color: var(--vinho-600); margin-top: 8px; font-weight: 500;">
                ✓ Prazo de produção: ${product.leadTime}. Nada sobra em estoque.
              </div>
            </div>

            <!-- Seletor de Cores com Nomes Poéticos em Serif Itálica -->
            ${product.colors && product.colors.length > 0 ? `
              <div style="margin-bottom: 20px;">
                <span class="caps-label">1. Escolha a Cor:</span>
                <div class="swatch-group" id="pdp-color-selector">
                  ${product.colors.map((c, i) => `
                    <button type="button" class="swatch-btn ${i === 0 ? 'active' : ''}" onclick="TramaApp.selectSwatch(this, 'color', '${c.name}')">
                      <span class="swatch-circle" style="background-color: ${c.hex};"></span>
                      <span class="serif-italic">${c.name}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Seletor de Tecido Nobre -->
            ${product.fabrics && product.fabrics.length > 0 ? `
              <div style="margin-bottom: 24px;">
                <span class="caps-label">2. Escolha o Tecido & Origem:</span>
                <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;" id="pdp-fabric-selector">
                  ${product.fabrics.map((f, i) => `
                    <div class="swatch-btn ${i === 0 ? 'active' : ''}" style="display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left; padding: 12px;" onclick="TramaApp.selectFabric(this, ${product.price}, ${f.priceDiff || 0}, '${f.name}')">
                      <div>
                        <div style="font-weight: 600; font-size: 14px;">${f.name}</div>
                        <div style="font-size: 12px; color: var(--apres-ski);">${f.origin || 'Fibras nobres nacionais'}</div>
                      </div>
                      <span style="font-size: 12px; font-weight: 600;">${f.priceDiff > 0 ? `+ R$ ${f.priceDiff}` : (f.priceDiff < 0 ? `- R$ ${Math.abs(f.priceDiff)}` : 'Incluso')}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- CONFIGURADOR DE MEDIDAS (Destaque Central da Diretiva) -->
            <div style="border: 1px solid var(--midnight); padding: 20px; background: var(--bg); margin-bottom: 28px;">
              <div class="flex-between" style="margin-bottom: 14px;">
                <span class="caps-label" style="color: var(--midnight);">3. Modelagem & Medidas</span>
                <button type="button" onclick="TramaApp.openMeasurementModal()" class="link-underlined caps-label" style="font-size: 11px; background: none; border: none; cursor: pointer;">
                  Guia: Como se medir →
                </button>
              </div>

              <!-- Alternador de Modo: Tamanho Padrão vs Sob Medida -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px;">
                <button type="button" id="btn-mode-standard" class="btn btn-sm btn-secondary" onclick="TramaApp.toggleSizeMode('standard')">Tamanho Padrão (PP-GG)</button>
                <button type="button" id="btn-mode-custom" class="btn btn-sm btn-primary" onclick="TramaApp.toggleSizeMode('custom')">Sob Medida (Exclusivo)</button>
              </div>

              <!-- Caixa 1: Tamanho Padrão (Quadrados 44px) -->
              <div id="size-standard-box" style="display: none;">
                <span style="font-size: 12px; color: var(--apres-ski);">Selecione um tamanho de referência:</span>
                <div class="size-selector">
                  ${['PP', 'P', 'M', 'G', 'GG'].map((sz, idx) => `
                    <button type="button" class="size-btn ${idx === 2 ? 'active' : ''}" onclick="TramaApp.selectStandardSize(this, '${sz}')">${sz}</button>
                  `).join('')}
                </div>
              </div>

              <!-- Caixa 2: Sob Medida -->
              <div id="size-custom-box">
                <div class="flex-between" style="margin-bottom: 12px; background: var(--card-bg-subtle); padding: 8px 12px;">
                  <span style="font-size: 12px; color: var(--mountainside);">Feito sob molde milimétrico para o seu corpo:</span>
                  <button type="button" onclick="TramaApp.fillSavedMeasurements()" style="background: none; border: none; text-decoration: underline; font-size: 11px; cursor: pointer; font-weight: 600; color: var(--vinho-500);">
                    Usar medidas salvas da conta
                  </button>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                  <div class="form-group" style="margin-bottom: 12px;">
                    <label class="form-label">Busto (70 - 140 cm)</label>
                    <input type="number" id="input-busto" min="70" max="140" value="${userMeasurements.busto || ''}" placeholder="Ex: 92" class="form-input" required />
                  </div>
                  <div class="form-group" style="margin-bottom: 12px;">
                    <label class="form-label">Cintura (50 - 120 cm)</label>
                    <input type="number" id="input-cintura" min="50" max="120" value="${userMeasurements.cintura || ''}" placeholder="Ex: 72" class="form-input" required />
                  </div>
                  <div class="form-group" style="margin-bottom: 12px;">
                    <label class="form-label">Quadril (70 - 150 cm)</label>
                    <input type="number" id="input-quadril" min="70" max="150" value="${userMeasurements.quadril || ''}" placeholder="Ex: 101" class="form-input" required />
                  </div>
                  <div class="form-group" style="margin-bottom: 12px;">
                    <label class="form-label">Altura (140 - 200 cm)</label>
                    <input type="number" id="input-altura" min="140" max="200" value="${userMeasurements.altura || ''}" placeholder="Ex: 168" class="form-input" required />
                  </div>
                </div>

                <div style="font-size: 11px; color: var(--apres-ski); margin-top: 4px;">
                  🔒 Tratamento seguro de dados corporais conforme LGPD (Art. 7º).
                </div>
              </div>
            </div>

            <!-- Simulador de CEP e Prazos Combinados -->
            <div style="padding: 16px; border: 1px solid var(--slopes); margin-bottom: 28px;">
              <span class="caps-label">Calcular Prazo de Entrega para seu CEP:</span>
              <div style="display: flex; gap: 8px; margin-top: 8px;">
                <input type="text" id="pdp-cep-input" placeholder="00000-000" maxlength="9" class="form-input" style="flex: 1; padding: 8px 0;" />
                <button type="button" class="btn btn-secondary btn-sm" onclick="TramaApp.simulateShipping()">Calcular</button>
              </div>
              <div id="pdp-shipping-result" style="margin-top: 10px; font-size: 12px; color: var(--apres-ski); display: none;"></div>
            </div>

            <!-- CTA Primário -->
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <button type="button" class="btn btn-primary btn-block" style="height: 52px; font-size: 13px;" onclick="TramaApp.addToBagFromPDP('${product.id}')">
                Encomendar Minha Peça
              </button>

              <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--apres-ski);">
                <span>✓ Primeiro ajuste gratuito no ateliê</span>
                <span>✓ Devolução em 7 dias garantida (CDC)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Abas Técnicas com Acordeão/Tabs -->
        <div style="margin-top: 80px; border-top: 1px solid var(--slopes);">
          <div class="tab-nav">
            <button class="tab-nav-btn active" onclick="TramaApp.switchTab(this, 'tab-desc')">Descrição & Caimento</button>
            <button class="tab-nav-btn" onclick="TramaApp.switchTab(this, 'tab-fabric')">Tecidos & Cuidados</button>
            <button class="tab-nav-btn" onclick="TramaApp.switchTab(this, 'tab-table')">Tabela de Medidas Padrão</button>
            <button class="tab-nav-btn" onclick="TramaApp.switchTab(this, 'tab-making')">Como é Feita</button>
            <button class="tab-nav-btn" onclick="TramaApp.switchTab(this, 'tab-returns')">Trocas & Ajustes</button>
          </div>

          <div id="tab-desc" class="tab-content">
            <p>${product.description}</p>
            <p style="margin-top: 12px;">Desenhada com base na dualidade entre o fluido e o reto. Costuras francesas embutidas com acabamento artesanal sem fios expostos.</p>
          </div>

          <div id="tab-fabric" class="tab-content" style="display: none;">
            <p><strong>Composição:</strong> 100% fibra natural cultivada no Brasil sem agrotóxicos.</p>
            <p style="margin-top: 8px;"><strong>Lavagem & Conservação:</strong> Lavar preferencialmente à mão ou no ciclo delicado com sabão neutro vegetal. Secar à sombra sobre superfície plana. Não usar alvejantes clorados.</p>
          </div>

          <div id="tab-table" class="tab-content" style="display: none;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
              <thead>
                <tr style="border-bottom: 2px solid var(--midnight);">
                  <th style="padding: 10px;">Tamanho</th>
                  <th style="padding: 10px;">Busto (cm)</th>
                  <th style="padding: 10px;">Cintura (cm)</th>
                  <th style="padding: 10px;">Quadril (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--slopes);"><td style="padding: 10px;">PP (34-36)</td><td style="padding: 10px;">80 - 84</td><td style="padding: 10px;">62 - 66</td><td style="padding: 10px;">90 - 94</td></tr>
                <tr style="border-bottom: 1px solid var(--slopes);"><td style="padding: 10px;">P (38)</td><td style="padding: 10px;">86 - 90</td><td style="padding: 10px;">68 - 72</td><td style="padding: 10px;">96 - 100</td></tr>
                <tr style="border-bottom: 1px solid var(--slopes);"><td style="padding: 10px;">M (40-42)</td><td style="padding: 10px;">92 - 96</td><td style="padding: 10px;">74 - 78</td><td style="padding: 10px;">102 - 106</td></tr>
                <tr style="border-bottom: 1px solid var(--slopes);"><td style="padding: 10px;">G (44)</td><td style="padding: 10px;">98 - 104</td><td style="padding: 10px;">80 - 86</td><td style="padding: 10px;">108 - 114</td></tr>
                <tr style="border-bottom: 1px solid var(--slopes);"><td style="padding: 10px;">GG (46-48)</td><td style="padding: 10px;">106 - 112</td><td style="padding: 10px;">88 - 94</td><td style="padding: 10px;">116 - 122</td></tr>
              </tbody>
            </table>
          </div>

          <div id="tab-making" class="tab-content" style="display: none;">
            <p>Cada peça é produzida em ateliê próprio com iluminação natural. O tecido descansa por 48 horas antes do corte milimétrico para estabilização de trama. As costuras são finalizadas uma a uma pela mesma artesã responsável por toda a peça.</p>
          </div>

          <div id="tab-returns" class="tab-content" style="display: none;">
            <p>Se sua peça sob medida necessitar de algum ajuste de caimento no busto, quadril ou barra, o primeiro ajuste é 100% gratuito em nosso ateliê com logística reversa por nossa conta.</p>
          </div>
        </div>

        <!-- Bloco "Impacto Desta Peça" -->
        <div style="background-color: var(--arctic); border: 1px solid var(--slopes); padding: 32px; margin: 60px 0;">
          <span class="caps-label" style="color: var(--vinho-500); margin-bottom: 8px; display: block;">Impacto Sustentável Desta Peça</span>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-top: 16px;">
            <div>
              <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px;">Água Preservada</div>
              <div style="font-size: 13px; color: var(--mountainside);">${product.impact?.waterSaved || '850 litros preservados'}</div>
            </div>
            <div>
              <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px;">Zero Resíduo Têxtil</div>
              <div style="font-size: 13px; color: var(--mountainside);">${product.impact?.wastePercent || '0% de resíduo têxtil'}</div>
            </div>
            <div>
              <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px;">Rastreabilidade</div>
              <div style="font-size: 13px; color: var(--mountainside);">${product.impact?.traceability || 'Fibras certificadas com selo ecológico'}</div>
            </div>
          </div>
        </div>

        <!-- Bloco "Combina com" -->
        <div style="margin: 60px 0;">
          <div style="margin-bottom: 24px;">
            <span class="caps-label text-muted">A Dualidade em Harmonia</span>
            <h2 class="serif-italic" style="font-size: 26px;">Combina com: O contraponto do corte</h2>
          </div>
          <div style="max-width: 320px;">
            ${this.renderProductCard(matchProduct)}
          </div>
        </div>
      </div>

      <!-- Barra Fixa Mobile de PDP -->
      <div class="mobile-pdp-sticky-bar">
        <div>
          <div style="font-weight: 700; font-size: 15px;">R$ ${product.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
          <div style="font-size: 10px; color: var(--apres-ski);">${product.leadTime}</div>
        </div>
        <button type="button" class="btn btn-primary btn-sm" onclick="TramaApp.addToBagFromPDP('${product.id}')">Encomendar</button>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 4. CHECKOUT EM 1 PÁGINA (3 Etapas: Identificação, Entrega, Pagamento Pix/Cartão/Boleto)
  // --------------------------------------------------------------------------
  renderCheckout: function() {
    const cart = TramaStore.state.cart;
    const subtotal = TramaStore.getCartSubtotal();
    const couponPercent = TramaStore.state.coupon ? TramaStore.state.coupon.discountPercent : 0;
    const couponDiscount = subtotal * (couponPercent / 100);
    const isFreeShipping = subtotal >= TramaData.brand.freeShippingThreshold;
    const shipping = isFreeShipping ? 0 : 28.00;
    const selectedMethod = TramaApp.selectedPaymentMethod || 'pix';
    const isPix = selectedMethod === 'pix';
    const pixDiscount = isPix ? ((subtotal - couponDiscount) * 0.05) : 0;
    const total = subtotal - couponDiscount - pixDiscount + shipping;
    const user = TramaStore.state.user || {};

    if (cart.length === 0) {
      return `
        <div class="container section-spacing text-center" style="max-width: 600px;">
          <div style="margin-bottom: 24px;">
            ${RabbitSVGs.rabbitSleeping('#6C6D74', '#4D0C0C', 84)}
          </div>
          <h1 class="serif-italic" style="font-size: 32px;">Sua sacola está leve demais.</h1>
          <p style="color: var(--apres-ski); margin: 16px 0 28px 0;">Nenhuma peça sob encomenda foi adicionada ainda.</p>
          <a href="#/sob-encomenda" class="btn btn-primary">Ir para a Vitrine</a>
        </div>
      `;
    }

    return `
      <div class="container section-spacing-sm">
        <div style="border-bottom: 1px solid var(--slopes); padding-bottom: 16px; margin-bottom: 36px;">
          <span class="caps-label text-muted">Finalização Segura</span>
          <h1 class="serif-italic" style="font-size: 32px; margin-top: 4px;">Checkout em 1 Página</h1>
          <p style="font-size: 13px; color: var(--apres-ski);">Compra como visitante permitida • Criptografia 256-bit</p>
        </div>

        <form id="checkout-form" onsubmit="event.preventDefault(); TramaApp.processCheckout();">
          <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 48px;" class="checkout-layout">
            
            <!-- Coluna Esquerda: As 3 Etapas -->
            <div>
              <!-- ETAPA 1: IDENTIFICAÇÃO -->
              <div style="border: 1px solid var(--slopes); padding: 24px; margin-bottom: 24px; background: var(--card-bg);">
                <div class="flex-between" style="margin-bottom: 16px;">
                  <span class="caps-label" style="font-size: 13px; font-weight: 700;">Etapa 1 • Identificação</span>
                  <span style="font-size: 11px; color: var(--apres-ski);">Compre como visitante ou membro</span>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                  <div class="form-group">
                    <label class="form-label">Nome Completo</label>
                    <input type="text" id="chk-name" value="${user.name || ''}" required placeholder="Seu nome completo" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">E-mail para Acompanhamento</label>
                    <input type="email" id="chk-email" value="${user.email || ''}" required placeholder="seu@email.com" class="form-input" />
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                  <div class="form-group">
                    <label class="form-label">CPF (Para Nota Fiscal Automática)</label>
                    <input type="text" id="chk-cpf" required placeholder="000.000.000-00" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">WhatsApp (Notificações da Peça)</label>
                    <input type="tel" id="chk-phone" value="${user.phone || ''}" required placeholder="(41) 99258-4033" class="form-input" />
                  </div>
                </div>
              </div>

              <!-- ETAPA 2: ENTREGA (Com preenchimento por CEP) -->
              <div style="border: 1px solid var(--slopes); padding: 24px; margin-bottom: 24px; background: var(--card-bg);">
                <div class="flex-between" style="margin-bottom: 16px;">
                  <span class="caps-label" style="font-size: 13px; font-weight: 700;">Etapa 2 • Endereço de Entrega</span>
                  <span style="font-size: 11px; color: var(--apres-ski);">ViaCEP Integrado</span>
                </div>

                <div style="display: grid; grid-template-columns: 140px 1fr; gap: 16px;">
                  <div class="form-group">
                    <label class="form-label">CEP</label>
                    <input type="text" id="chk-cep" value="${user.address?.cep || ''}" required placeholder="00000-000" maxlength="9" onblur="TramaApp.lookupAddressByCEP(this.value)" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Rua / Logradouro</label>
                    <input type="text" id="chk-street" value="${user.address?.street || ''}" required placeholder="Nome da rua" class="form-input" />
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 120px 1fr 1fr; gap: 16px;">
                  <div class="form-group">
                    <label class="form-label">Número</label>
                    <input type="text" id="chk-number" value="${user.address?.number || ''}" required placeholder="123" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Complemento</label>
                    <input type="text" id="chk-comp" value="${user.address?.complement || ''}" placeholder="Apto, Bloco" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Bairro</label>
                    <input type="text" id="chk-neighborhood" value="${user.address?.neighborhood || ''}" required placeholder="Bairro" class="form-input" />
                  </div>
                </div>

                <!-- Seleção de Envio -->
                <div style="margin-top: 16px;">
                  <span class="caps-label" style="font-size: 11px; margin-bottom: 8px; display: block;">Modalidade de Transporte:</span>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border: 1px solid var(--slopes); cursor: pointer;">
                      <div>
                        <input type="radio" name="chk-shipping-method" value="sedex" checked />
                        <span style="font-size: 13px; font-weight: 600; margin-left: 8px;">Correios SEDEX Express</span>
                        <div style="font-size: 11px; color: var(--apres-ski); margin-left: 24px;">2 dias úteis após a confecção</div>
                      </div>
                      <span style="font-size: 13px; font-weight: 700;">${isFreeShipping ? 'Grátis' : 'R$ 28,00'}</span>
                    </label>

                    <label style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border: 1px solid var(--slopes); cursor: pointer;">
                      <div>
                        <input type="radio" name="chk-shipping-method" value="atelie" />
                        <span style="font-size: 13px; font-weight: 600; margin-left: 8px;">Retirada no Ateliê (Vila Madalena, SP)</span>
                        <div style="font-size: 11px; color: var(--apres-ski); margin-left: 24px;">Experiência presencial com prova de caimento</div>
                      </div>
                      <span style="font-size: 13px; font-weight: 700; color: var(--vinho-500);">Grátis</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- ETAPA 3: PAGAMENTO -->
              <div style="border: 1px solid var(--slopes); padding: 24px; background: var(--card-bg);">
                <span class="caps-label" style="font-size: 13px; font-weight: 700; margin-bottom: 16px; display: block;">Etapa 3 • Forma de Pagamento</span>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                  <button type="button" class="btn btn-sm btn-primary" id="btn-pay-pix" onclick="TramaApp.switchPaymentMethod('pix')">Pix (-5% Off)</button>
                  <button type="button" class="btn btn-sm btn-secondary" id="btn-pay-card" onclick="TramaApp.switchPaymentMethod('card')">Cartão de Crédito</button>
                  <button type="button" class="btn btn-sm btn-secondary" id="btn-pay-boleto" onclick="TramaApp.switchPaymentMethod('boleto')">Boleto Bancário</button>
                </div>

                <!-- Bloco Pix -->
                <div id="pay-box-pix" style="padding: 18px; background-color: var(--card-bg-subtle); border: 1px solid var(--midnight);">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 700; font-size: 14px; color: var(--vinho-500);">Desconto Especial de 5% Aplicado no Pix</span>
                    <span style="font-weight: 700; font-size: 13px; color: var(--vinho-500);">Economia: R$ ${((subtotal - couponDiscount) * 0.05).toFixed(2)}</span>
                  </div>
                  <p style="font-size: 13px; color: var(--mountainside); margin-bottom: 10px;">Ao confirmar, você receberá a chave Copia e Cola e o QR Code oficial do Pix. O início da confecção da sua peça é agendado imediatamente após a confirmação bancária.</p>
                  <div style="font-size: 13px; font-weight: 600; color: var(--midnight);">Total a pagar no Pix: <strong>R$ ${total.toFixed(2)}</strong></div>
                </div>

                <!-- Bloco Cartão -->
                <div id="pay-box-card" style="display: none; padding: 16px; background-color: var(--card-bg-subtle); border: 1px solid var(--slopes);">
                  <div class="form-group">
                    <label class="form-label">Número do Cartão</label>
                    <input type="text" placeholder="0000 0000 0000 0000" class="form-input" />
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                    <div class="form-group">
                      <label class="form-label">Titular</label>
                      <input type="text" placeholder="Nome como no cartão" class="form-input" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Validade</label>
                      <input type="text" placeholder="MM/AA" class="form-input" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">CVV</label>
                      <input type="text" placeholder="123" class="form-input" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Parcelamento Sem Juros</label>
                    <select class="form-select" style="border-bottom: 1px solid var(--midnight);">
                      <option>1x de R$ ${total.toFixed(2)} à vista</option>
                      <option>2x de R$ ${(total/2).toFixed(2)} sem juros</option>
                      <option>3x de R$ ${(total/3).toFixed(2)} sem juros</option>
                      <option>4x de R$ ${(total/4).toFixed(2)} sem juros</option>
                      <option>5x de R$ ${(total/5).toFixed(2)} sem juros</option>
                      <option>6x de R$ ${(total/6).toFixed(2)} sem juros</option>
                    </select>
                  </div>
                </div>

                <!-- Bloco Boleto -->
                <div id="pay-box-boleto" style="display: none; padding: 16px; background-color: var(--card-bg-subtle); border: 1px solid var(--slopes);">
                  <p style="font-size: 13px; color: var(--mountainside);">O boleto bancário será gerado na tela seguinte com vencimento em 3 dias úteis. Compensação em até 48h.</p>
                </div>
              </div>
            </div>

            <!-- Coluna Direita: Resumo Fixo do Pedido com Prazos e Medidas -->
            <div>
              <div style="position: sticky; top: 88px; background: var(--card-bg); border: 1px solid var(--midnight); padding: 28px;">
                <h3 class="caps-label" style="font-size: 14px; margin-bottom: 16px; border-bottom: 1px solid var(--slopes); padding-bottom: 12px;">
                  Resumo da Confecção
                </h3>

                <!-- Lista de Itens -->
                <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
                  ${cart.map(item => `
                    <div style="display: flex; gap: 12px; font-size: 13px; border-bottom: 1px solid var(--slopes); padding-bottom: 12px;">
                      <img src="${item.image}" style="width: 50px; aspect-ratio: 3/4; object-fit: cover;" alt="${item.name}" />
                      <div style="flex: 1;">
                        <div style="font-weight: 600;">${item.name} (${item.qty}x)</div>
                        <div style="color: var(--apres-ski); font-size: 11px;">
                          ${item.sizeMode === 'Sob Medida' ? `Sob Medida (B:${item.measurements?.busto || '-'}, C:${item.measurements?.cintura || '-'}, Q:${item.measurements?.quadril || '-'}, A:${item.measurements?.altura || '-'})` : `Tamanho: ${item.sizeMode}`}
                        </div>
                        <div style="color: var(--apres-ski); font-size: 11px;">${item.fabric} • ${item.color}</div>
                      </div>
                      <div style="font-weight: 600;">R$ ${(item.price * item.qty).toFixed(2)}</div>
                    </div>
                  `).join('')}
                </div>

                <!-- Cupom de Desconto -->
                <div style="display: flex; gap: 8px; margin-bottom: 20px;">
                  <input type="text" id="chk-coupon-code" placeholder="Código de Cupom" style="flex: 1; padding: 6px 8px; font-size: 12px; border: 1px solid var(--slopes); background: transparent;" />
                  <button type="button" class="btn btn-secondary btn-sm" onclick="TramaStore.applyCoupon(document.getElementById('chk-coupon-code').value)">Aplicar</button>
                </div>

                <!-- Linhas de Totais -->
                <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; margin-bottom: 20px;">
                  <div class="flex-between">
                    <span>Subtotal</span>
                    <span>R$ ${subtotal.toFixed(2)}</span>
                  </div>
                  ${couponDiscount > 0 ? `
                    <div class="flex-between" style="color: var(--vinho-500); font-weight: 600;">
                      <span>Desconto Cupom (${couponPercent}%)</span>
                      <span>- R$ ${couponDiscount.toFixed(2)}</span>
                    </div>
                  ` : ''}
                  <div id="chk-pix-discount-row" class="flex-between" style="color: var(--vinho-500); font-weight: 600; display: ${isPix ? 'flex' : 'none'};">
                    <span>Desconto Pix (-5%)</span>
                    <span id="chk-pix-discount-val">- R$ ${((subtotal - couponDiscount) * 0.05).toFixed(2)}</span>
                  </div>
                  <div class="flex-between">
                    <span>Frete Calculado</span>
                    <span>${isFreeShipping ? 'Grátis (Pedido > R$ 600)' : `R$ ${shipping.toFixed(2)}`}</span>
                  </div>
                  <div class="flex-between" style="font-size: 18px; font-weight: 700; border-top: 1px solid var(--slopes); padding-top: 12px; margin-top: 4px;">
                    <span>Total</span>
                    <span id="chk-total-display">R$ ${total.toFixed(2)}</span>
                  </div>
                </div>

                <div style="padding: 12px; background-color: var(--arctic); border: 1px solid var(--slopes); margin-bottom: 24px; font-size: 12px;">
                  <div style="font-weight: 700; text-transform: uppercase; color: var(--vinho-600); margin-bottom: 4px;">
                    Prazo Total Transparente:
                  </div>
                  <div>Confecção no ateliê: <strong>20–30 dias úteis</strong></div>
                  <div>Transporte Sedex: <strong>2 dias úteis</strong></div>
                  <div style="margin-top: 4px; color: var(--midnight); font-weight: 600;">
                    Sua peça começa a existir logo após o pedido.
                  </div>
                </div>

                <button type="submit" class="btn btn-primary btn-block" style="height: 52px;">
                  Confirmar e Encomendar
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 5. PEDIDO CONFIRMADO & RASTREAMENTO DA LINHA DE PRODUÇÃO ARTESANAL
  // --------------------------------------------------------------------------
  renderOrderSuccess: function(orderId) {
    const order = TramaStore.state.orders.find(o => o.id === orderId) || TramaStore.state.orders[0];
    const stages = [
      { name: "Pedido recebido", desc: "Aprovado no sistema" },
      { name: "Tecido separado", desc: "Seleção do lote do tear" },
      { name: "Em corte", desc: "Corte individual do molde" },
      { name: "Em costura", desc: "Montagem artesanal" },
      { name: "Acabamento", desc: "Revisão e controle de qualidade" },
      { name: "Enviado", desc: "Em trânsito para seu endereço" },
      { name: "Entregue", desc: "Em suas mãos" }
    ];

    return `
      <div class="container section-spacing-sm">
        <div class="text-center" style="max-width: 680px; margin: 0 auto 48px auto;">
          <div style="margin-bottom: 20px;">
            ${RabbitSVGs.rabbitTapping("#090F15", "#4D0C0C", 64)}
          </div>
          <span class="caps-label" style="color: var(--vinho-500); font-weight: 700;">Pedido Confirmado • ${order.id}</span>
          <h1 class="serif-italic" style="font-size: clamp(28px, 4vw, 42px); margin: 12px 0 16px 0;">
            "Recebemos seu pedido. A partir de agora, sua peça começa a existir."
          </h1>
          <p style="color: var(--mountainside); font-size: 15px;">
            Agradecemos por escolher o slow fashion e apoiar a confecção consciente sem resíduos.
          </p>
        </div>

        ${(order.paymentMethod && order.paymentMethod.includes('Pix')) ? `
          <!-- Bloco Oficial de Pagamento Pix com Desconto de 5% -->
          <div style="background: var(--bg); border: 2px solid var(--midnight); padding: 28px; margin-bottom: 40px; text-align: center;">
            <span class="caps-label" style="color: var(--vinho-500); font-weight: 700;">Pagamento Instantâneo Pix • 5% de Desconto Aplicado</span>
            <h2 class="serif-italic" style="font-size: 26px; margin: 8px 0 12px 0;">Finalize seu pagamento para iniciar o corte</h2>
            <div style="font-size: 14px; color: var(--mountainside); max-width: 520px; margin: 0 auto 20px auto;">
              Total com 5% off no Pix: <strong style="font-size: 22px; color: var(--midnight);">R$ ${order.total.toFixed(2)}</strong>
            </div>

            <!-- Código Pix Copia e Cola -->
            <div style="max-width: 560px; margin: 0 auto 16px auto; background: var(--card-bg-subtle); border: 1px dashed var(--slopes); padding: 16px;">
              <div style="font-family: monospace; font-size: 11px; color: var(--midnight); word-break: break-all; margin-bottom: 12px; background: var(--bg); padding: 10px; border: 1px solid var(--slopes); user-select: all;">
                00020126580014BR.GOV.BCB.PIX0136oprojetotrama@gmail.com520400005303986540${order.total.toFixed(2)}5802BR5913PROJETO TRAMA6009SAO PAULO62070503***6304
              </div>
              <button type="button" class="btn btn-primary btn-sm" onclick="TramaApp.copyPixCode('00020126580014BR.GOV.BCB.PIX0136oprojetotrama@gmail.com520400005303986540${order.total.toFixed(2)}5802BR5913PROJETO TRAMA6009SAO PAULO62070503***6304')" style="width: 100%; justify-content: center;">
                📋 Copiar Código Pix Copia e Cola
              </button>
            </div>
            <div style="font-size: 12px; color: var(--apres-ski);">
              Chave Pix Oficial: <strong>oprojetotrama@gmail.com</strong> • Projeto Trama Confecções Artesanais
            </div>
          </div>
        ` : ''}

        <!-- Linha do Tempo da Produção Artesanal -->
        <div style="background: var(--card-bg); border: 1px solid var(--slopes); padding: 36px 24px; margin-bottom: 48px;">
          <div class="flex-between flex-wrap gap-sm" style="margin-bottom: 28px;">
            <div>
              <span class="caps-label text-muted">Status Vivo da Produção</span>
              <h2 style="font-size: 20px; font-weight: 700; margin-top: 4px;">Fase Atual: ${order.statusName}</h2>
            </div>
            <div style="text-align: right;">
              <span class="caps-label text-muted">Código de Rastreio</span>
              <div style="font-family: monospace; font-size: 14px; font-weight: 700; color: var(--vinho-500);">${order.trackingCode}</div>
            </div>
          </div>

          <div class="timeline-track">
            ${stages.map((stg, idx) => {
              const isCompleted = idx < order.statusIndex;
              const isCurrent = idx === order.statusIndex;
              return `
                <div class="timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}">
                  <div class="step-marker">${isCompleted ? '✓' : idx + 1}</div>
                  <div class="step-title">${stg.name}</div>
                  <div class="step-sub">${stg.desc}</div>
                </div>
              `;
            }).join('')}
          </div>

          <div style="font-size: 12px; color: var(--apres-ski); text-align: center; margin-top: 24px;">
            Você receberá avisos automáticos por e-mail e WhatsApp a cada etapa concluída pelo ateliê.
          </div>
        </div>

        <!-- Ficha de Produção Imprimível -->
        <div class="printable-production-sheet" style="background: var(--card-bg); border: 1px solid var(--midnight); padding: 32px; margin-bottom: 40px;">
          <div class="flex-between" style="border-bottom: 2px solid var(--midnight); padding-bottom: 16px; margin-bottom: 24px;">
            <div>
              <div style="font-size: 18px; font-weight: 700; letter-spacing: 0.12em;">PROJETO TRAMA • FICHA DE PRODUÇÃO DO ATELIÊ</div>
              <div style="font-size: 12px; color: var(--apres-ski);">Documento de corte milimétrico e confecção artesanal</div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.print()" style="gap: 6px;">
              ${RabbitSVGs.icon('printer', 16)} Imprimir Ficha de Produção
            </button>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; font-size: 13px; margin-bottom: 24px;">
            <div>
              <div><strong>Nº do Pedido:</strong> ${order.id}</div>
              <div><strong>Data do Pedido:</strong> ${order.date}</div>
              <div><strong>Cliente:</strong> ${order.customer?.name || 'Cliente Trama'}</div>
              <div><strong>Cidade/UF:</strong> ${order.shippingAddress?.city || 'São Paulo'} / ${order.shippingAddress?.state || 'SP'}</div>
            </div>
            <div>
              <div><strong>Previsão de Envio:</strong> ${order.estimatedDelivery}</div>
              <div><strong>Modo de Pagamento:</strong> ${order.paymentMethod}</div>
              <div><strong>Total Pago:</strong> R$ ${order.total.toFixed(2)}</div>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
            <thead>
              <tr style="border-bottom: 1px solid var(--midnight); background-color: var(--arctic);">
                <th style="padding: 10px;">Peça / Design</th>
                <th style="padding: 10px;">Tecido Selecionado</th>
                <th style="padding: 10px;">Cor</th>
                <th style="padding: 10px;">Especificação de Medidas</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(it => `
                <tr style="border-bottom: 1px solid var(--slopes);">
                  <td style="padding: 12px;"><strong>${it.name}</strong></td>
                  <td style="padding: 12px;">${it.fabric}</td>
                  <td style="padding: 12px;">${it.color}</td>
                  <td style="padding: 12px; font-family: monospace;">
                    ${it.sizeMode === 'Sob Medida' ? `
                      <strong>SOB MEDIDA:</strong><br/>
                      Busto: ${it.measurements?.busto || '-'} cm | Cintura: ${it.measurements?.cintura || '-'} cm<br/>
                      Quadril: ${it.measurements?.quadril || '-'} cm | Altura: ${it.measurements?.altura || '-'} cm
                    ` : `TAMANHO PADRÃO: ${it.sizeMode}`}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="text-center" style="margin-top: 32px;">
          <a href="#/conta" class="btn btn-secondary" style="margin-right: 12px;">Ver Meus Pedidos na Conta</a>
          <a href="#/" class="btn btn-primary">Voltar para a Página Inicial</a>
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 6. CONTA DA CLIENTE
  // --------------------------------------------------------------------------
  renderAccount: function(activeTab = 'pedidos') {
    const user = TramaStore.state.user;
    if (!user || !user.isLoggedIn) {
      return this.renderAuth('login');
    }

    const orders = TramaStore.state.orders;
    const wishlist = TramaStore.state.wishlist.map(id => TramaData.products.find(p => p.id === id)).filter(Boolean);
    const m = user.savedMeasurements || {};

    return `
      <div class="container section-spacing-sm">
        <div class="flex-between flex-wrap gap-sm" style="border-bottom: 1px solid var(--slopes); padding-bottom: 20px; margin-bottom: 36px;">
          <div>
            <span class="caps-label text-muted">Área Exclusiva da Cliente</span>
            <h1 class="serif-italic" style="font-size: 32px; margin-top: 4px;">Olá, ${user.name.split(' ')[0]}</h1>
            <p style="font-size: 13px; color: var(--apres-ski);">${user.email}</p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="TramaApp.logout()">Encerrar Sessão</button>
        </div>

        <div style="display: grid; grid-template-columns: 240px 1fr; gap: 40px;" class="account-layout">
          <!-- Menu Lateral da Conta -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button class="btn btn-block ${activeTab === 'pedidos' ? 'btn-primary' : 'btn-secondary'}" onclick="TramaApp.switchAccountTab('pedidos')" style="justify-content: flex-start;">
              ${RabbitSVGs.icon('scissors', 16)} Meus Pedidos & Fila
            </button>
            <button class="btn btn-block ${activeTab === 'medidas' ? 'btn-primary' : 'btn-secondary'}" onclick="TramaApp.switchAccountTab('medidas')" style="justify-content: flex-start;">
              ${RabbitSVGs.icon('ruler', 16)} Minhas Medidas Salvas
            </button>
            <button class="btn btn-block ${activeTab === 'favoritos' ? 'btn-primary' : 'btn-secondary'}" onclick="TramaApp.switchAccountTab('favoritos')" style="justify-content: flex-start;">
              ${RabbitSVGs.icon('heart', 16)} Peças Salvas (${wishlist.length})
            </button>
            <button class="btn btn-block ${activeTab === 'enderecos' ? 'btn-primary' : 'btn-secondary'}" onclick="TramaApp.switchAccountTab('enderecos')" style="justify-content: flex-start;">
              ${RabbitSVGs.icon('truck', 16)} Endereço de Entrega
            </button>
            <button class="btn btn-block ${activeTab === 'lgpd' ? 'btn-primary' : 'btn-secondary'}" onclick="TramaApp.switchAccountTab('lgpd')" style="justify-content: flex-start;">
              ${RabbitSVGs.icon('shield', 16)} Privacidade & LGPD
            </button>
          </div>

          <!-- Conteúdo da Aba Selecionada -->
          <div>
            <!-- ABA 1: PEDIDOS -->
            <div id="acc-tab-pedidos" style="${activeTab === 'pedidos' ? '' : 'display: none;'}">
              <h2 class="caps-label" style="font-size: 14px; margin-bottom: 20px;">Histórico de Encomendas & Produção</h2>
              ${orders.length === 0 ? `
                <div style="padding: 40px; background: var(--card-bg-subtle); text-align: center;">
                  <p style="color: var(--apres-ski);">Nenhum pedido realizado ainda.</p>
                  <a href="#/sob-encomenda" class="btn btn-primary btn-sm" style="margin-top: 16px;">Ver Peças</a>
                </div>
              ` : orders.map(ord => `
                <div style="background: var(--card-bg); border: 1px solid var(--slopes); padding: 24px; margin-bottom: 20px;">
                  <div class="flex-between flex-wrap gap-sm" style="border-bottom: 1px solid var(--slopes); padding-bottom: 12px; margin-bottom: 16px;">
                    <div>
                      <div style="font-weight: 700; font-size: 15px;">Pedido ${ord.id}</div>
                      <div style="font-size: 12px; color: var(--apres-ski);">Realizado em ${ord.date}</div>
                    </div>
                    <div style="text-align: right;">
                      <span class="badge badge-sob-encomenda">${ord.statusName}</span>
                      <div style="font-size: 12px; font-weight: 700; margin-top: 4px;">R$ ${ord.total.toFixed(2)}</div>
                    </div>
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
                    ${ord.items.map(it => `
                      <div style="font-size: 13px;">
                        • <strong>${it.name}</strong> (${it.sizeMode}) - ${it.fabric} - ${it.color}
                      </div>
                    `).join('')}
                  </div>

                  <a href="#/pedido/${ord.id}" class="btn btn-secondary btn-sm">Acompanhar Linha de Produção & Ficha</a>
                </div>
              `).join('')}
            </div>

            <!-- ABA 2: MINHAS MEDIDAS SALVAS -->
            <div id="acc-tab-medidas" style="${activeTab === 'medidas' ? '' : 'display: none;'}">
              <h2 class="caps-label" style="font-size: 14px; margin-bottom: 12px;">Suas Medidas Corporais Salvas</h2>
              <p style="font-size: 13px; color: var(--mountainside); margin-bottom: 24px;">
                Estas medidas ficam salvas no seu perfil e são sugeridas automaticamente ao configurar qualquer peça sob medida na loja.
              </p>

              <form onsubmit="event.preventDefault(); TramaApp.saveAccountMeasurements();" style="max-width: 500px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                  <div class="form-group">
                    <label class="form-label">Busto (cm)</label>
                    <input type="number" id="acc-busto" value="${m.busto || ''}" placeholder="Ex: 92" class="form-input" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Cintura (cm)</label>
                    <input type="number" id="acc-cintura" value="${m.cintura || ''}" placeholder="Ex: 72" class="form-input" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Quadril (cm)</label>
                    <input type="number" id="acc-quadril" value="${m.quadril || ''}" placeholder="Ex: 101" class="form-input" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Altura (cm)</label>
                    <input type="number" id="acc-altura" value="${m.altura || ''}" placeholder="Ex: 168" class="form-input" required />
                  </div>
                </div>

                <button type="submit" class="btn btn-primary" style="margin-top: 12px;">Salvar Alterações de Medidas</button>
              </form>
            </div>

            <!-- ABA 3: FAVORITOS -->
            <div id="acc-tab-favoritos" style="${activeTab === 'favoritos' ? '' : 'display: none;'}">
              <h2 class="caps-label" style="font-size: 14px; margin-bottom: 20px;">Sua Lista de Desejos</h2>
              ${wishlist.length === 0 ? `
                <div style="padding: 40px; background: var(--card-bg-subtle); text-align: center;">
                  <p style="color: var(--apres-ski);">Nenhuma peça favoritada no momento.</p>
                </div>
              ` : `
                <div class="product-grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));">
                  ${wishlist.map(p => this.renderProductCard(p)).join('')}
                </div>
              `}
            </div>

            <!-- ABA 4: ENDEREÇOS -->
            <div id="acc-tab-enderecos" style="${activeTab === 'enderecos' ? '' : 'display: none;'}">
              <h2 class="caps-label" style="font-size: 14px; margin-bottom: 20px;">Endereço de Entrega Padrão</h2>
              <div style="padding: 24px; background: var(--card-bg); border: 1px solid var(--slopes); max-width: 500px;">
                <p><strong>${user.name}</strong></p>
                <p style="font-size: 14px; color: var(--mountainside); margin-top: 4px;">
                  ${user.address?.street || 'Rua Harmonia'}, ${user.address?.number || '340'} - ${user.address?.complement || 'Apto 42'}<br/>
                  ${user.address?.neighborhood || 'Vila Madalena'} - ${user.address?.city || 'São Paulo'} / ${user.address?.state || 'SP'}<br/>
                  CEP: ${user.address?.cep || '05435-000'}
                </p>
              </div>
            </div>

            <!-- ABA 5: LGPD & PRIVACIDADE -->
            <div id="acc-tab-lgpd" style="${activeTab === 'lgpd' ? '' : 'display: none;'}">
              <h2 class="caps-label" style="font-size: 14px; margin-bottom: 12px;">Gestão de Dados Pessoais (LGPD)</h2>
              <p style="font-size: 13px; color: var(--mountainside); margin-bottom: 24px;">
                Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), suas medidas corporais são tratadas como dado de uso estritamente restrito para produção artesanal.
              </p>
              <div style="display: flex; gap: 16px;">
                <button class="btn btn-secondary" onclick="TramaApp.exportUserData()">Baixar Meus Dados (JSON)</button>
                <button class="btn btn-secondary" style="color: var(--vinho-500); border-color: var(--vinho-500);" onclick="TramaApp.deleteUserAccount()">Excluir Minha Conta Definitivamente</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 7. LOGIN & CADASTRO
  // --------------------------------------------------------------------------
  renderAuth: function(initialMode = 'login') {
    return `
      <div class="container section-spacing text-center" style="max-width: 460px;">
        <div style="margin-bottom: 24px;">
          ${RabbitSVGs.symbol("#090F15", "#4D0C0C", 48)}
        </div>

        <h1 class="serif-italic" style="font-size: 32px; margin-bottom: 8px;">
          ${initialMode === 'login' ? 'Acesse Sua Conta' : 'Criar Nova Conta'}
        </h1>
        <p style="font-size: 13px; color: var(--apres-ski); margin-bottom: 28px;">
          Acompanhe o status do ateliê e salve suas medidas para compras futuras.
        </p>

        <button class="btn btn-secondary btn-block" onclick="TramaApp.socialLoginGoogle()" style="margin-bottom: 24px; gap: 10px;">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg>
          Continuar com o Google
        </button>

        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
          <div style="flex: 1; height: 1px; background: var(--slopes);"></div>
          <span style="font-size: 11px; text-transform: uppercase; color: var(--apres-ski);">Ou com seu e-mail</span>
          <div style="flex: 1; height: 1px; background: var(--slopes);"></div>
        </div>

        <form onsubmit="event.preventDefault(); TramaApp.handleAuthSubmit();" style="text-align: left;">
          ${initialMode === 'register' ? `
            <div class="form-group">
              <label class="form-label">Nome Completo</label>
              <input type="text" id="auth-name" required placeholder="Como deseja ser chamada" class="form-input" />
            </div>
          ` : ''}

          <div class="form-group">
            <label class="form-label">E-mail</label>
            <input type="email" id="auth-email" required placeholder="seu@email.com" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Senha</label>
            <input type="password" id="auth-password" required placeholder="••••••••" class="form-input" />
          </div>

          <button type="submit" class="btn btn-primary btn-block" style="margin-top: 16px;">
            ${initialMode === 'login' ? 'Entrar na Conta' : 'Concluir Cadastro'}
          </button>
        </form>

        <div style="margin-top: 24px; font-size: 13px;">
          ${initialMode === 'login' ? `
            Não possui uma conta? <a href="#/cadastro" class="link-underlined" style="font-weight: 600;">Cadastre-se aqui</a>
          ` : `
            Já possui cadastro? <a href="#/login" class="link-underlined" style="font-weight: 600;">Faça login</a>
          `}
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 8. PAINEL ADMINISTRATIVO DO ATELIÊ & CMS (EXCLUSIVO DA CONTA ADMIN)
  // --------------------------------------------------------------------------
  renderAdmin: function(adminTab = 'produtos') {
    const adminCreds = TramaStore.getAdminAccount();

    // 1. SE NÃO ESTIVER AUTENTICADA: EXIBIR TELA DE LOGIN DA ADMINISTRADORA
    if (!TramaStore.isAdminLoggedIn()) {
      return `
        <div class="container section-spacing" style="max-width: 480px; margin: 40px auto; padding: 40px 24px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; margin-bottom: 16px;">
              ${RabbitSVGs.rabbitTapping("#090F15", "#4D0C0C", 64)}
            </div>
            <span class="caps-label" style="color: var(--vinho-500); font-weight: 700;">Área Restrita • Projeto Trama</span>
            <h1 class="serif-italic" style="font-size: 32px; margin-top: 6px;">Acesso da Administradora</h1>
            <p style="font-size: 14px; color: var(--mountainside); margin-top: 8px;">
              Apenas a conta de administradora pode gerenciar o catálogo, alterar fotos e editar dados das peças.
            </p>
          </div>

          <div style="border: 1px solid var(--midnight); padding: 32px; background: var(--bg);">
            <form onsubmit="event.preventDefault(); TramaApp.submitAdminLogin();">
              <div class="form-group" style="margin-bottom: 18px;">
                <label class="form-label" for="admin-email-input">E-mail da Administradora</label>
                <input type="text" id="admin-email-input" class="form-input" placeholder="Ex: ${adminCreds.email}" value="${adminCreds.email}" required autofocus style="font-size: 14px;" />
              </div>

              <div class="form-group" style="margin-bottom: 24px;">
                <label class="form-label" for="admin-password-input">Senha de Acesso</label>
                <div style="position: relative;">
                  <input type="password" id="admin-password-input" class="form-input" placeholder="Digite sua senha..." autocomplete="current-password" required style="padding-right: 40px; font-size: 15px;" />
                  <button type="button" onclick="const input = document.getElementById('admin-password-input'); input.type = input.type === 'password' ? 'text' : 'password';" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--apres-ski); font-size: 14px;" title="Mostrar/ocultar senha">👁️</button>
                </div>
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; justify-content: center; font-size: 13px;">
                Entrar no Painel do Ateliê →
              </button>

              <div style="margin-top: 18px; padding: 12px; background: var(--card-bg-subtle); border-left: 2px solid var(--vinho-500); font-size: 12px; color: var(--apres-ski);">
                🔒 <strong>Conta pré-configurada:</strong><br/>
                E-mail: <code>${adminCreds.email}</code><br/>
                Senha: <code>${adminCreds.password}</code> (ou <code>trama2026</code>)<br/>
                <em>Você pode alterar seu e-mail e senha na aba "⚙️ Conta da Administradora".</em>
              </div>
            </form>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="#/" style="font-size: 13px; color: var(--mountainside); text-decoration: underline;">← Voltar para a vitrine pública</a>
          </div>
        </div>
      `;
    }

    // 2. SE ESTIVER AUTENTICADA: EXIBIR O PAINEL DE CONTROLE COMPLETO
    const orders = TramaStore.state.orders;
    const products = TramaData.products;
    const capacity = TramaStore.state.weeklyCapacity;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const directEditActive = TramaStore.state.adminDirectEdit;

    return `
      <div class="container section-spacing-sm">
        
        <!-- Barra de Status do Modo Administradora -->
        <div style="background: var(--midnight); color: var(--offwhite); padding: 12px 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="color: var(--vinho-400); font-weight: 700; font-size: 14px;">👑 Administradora Conectada:</span>
            <span style="font-size: 13px; color: var(--arctic);">${adminCreds.name} (${adminCreds.email})</span>
          </div>

          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <!-- Alternador de Edição Rápida na Vitrine -->
            <button class="btn btn-sm ${directEditActive ? 'btn-primary' : 'btn-secondary'}" onclick="TramaApp.toggleDirectEditMode()" style="font-size: 11px; padding: 4px 10px;" title="Quando ativado, botões de edição rápida aparecem nos cards da vitrine pública">
              ${directEditActive ? '🟢 Edição na Vitrine: ATIVADA' : '⚪ Edição na Vitrine: DESATIVADA'}
            </button>
            <a href="#/" class="btn btn-sm btn-secondary" style="font-size: 11px; padding: 4px 10px; color: var(--offwhite); border-color: var(--slopes);">
              👁️ Ver Vitrine Pública
            </a>
            <button class="btn btn-sm btn-secondary" onclick="TramaApp.handleAdminLogout()" style="font-size: 11px; padding: 4px 10px; color: var(--vinho-400); border-color: var(--vinho-500);">
              🚪 Sair do Painel
            </button>
          </div>
        </div>

        <!-- Cabeçalho do Painel -->
        <div class="flex-between flex-wrap gap-sm" style="border-bottom: 2px solid var(--midnight); padding-bottom: 16px; margin-bottom: 28px;">
          <div>
            <span class="caps-label" style="color: var(--vinho-500); font-weight: 700;">Área de Gestão & Edição Visual</span>
            <h1 class="font-serif" style="font-size: 32px; margin-top: 4px;">Painel de Controle do Ateliê</h1>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <button class="btn btn-primary btn-sm" onclick="TramaApp.openProductEditor()">
              + Adicionar Nova Peça à Venda
            </button>
            <button class="btn btn-secondary btn-sm" onclick="TramaApp.openContentEditor()">
              ✏️ Editar Textos da Loja
            </button>
          </div>
        </div>

        <!-- Indicadores de Gestão Rápida -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px;">
          <div style="padding: 18px; background: var(--card-bg); border: 1px solid var(--slopes);">
            <div class="caps-label text-muted">Peças no Catálogo</div>
            <div style="font-size: 26px; font-weight: 700; color: var(--midnight); margin-top: 4px;">${products.length}</div>
          </div>
          <div style="padding: 18px; background: var(--card-bg); border: 1px solid var(--slopes);">
            <div class="caps-label text-muted">Pedidos na Fila</div>
            <div style="font-size: 26px; font-weight: 700; color: var(--midnight); margin-top: 4px;">${orders.length}</div>
          </div>
          <div style="padding: 18px; background: var(--card-bg); border: 1px solid var(--slopes);">
            <div class="caps-label text-muted">Faturamento Total</div>
            <div style="font-size: 26px; font-weight: 700; color: var(--vinho-500); margin-top: 4px;">R$ ${totalRevenue.toFixed(2)}</div>
          </div>
          <div style="padding: 18px; background: var(--card-bg); border: 1px solid var(--slopes);">
            <div class="caps-label text-muted">Vagas Restantes na Semana</div>
            <div style="font-size: 26px; font-weight: 700; color: var(--midnight); margin-top: 4px;">${capacity.total - capacity.booked}</div>
          </div>
        </div>

        <!-- Abas do Painel Administrativo -->
        <div class="tab-nav" style="margin-bottom: 24px;">
          <button class="tab-nav-btn ${adminTab === 'produtos' ? 'active' : ''}" onclick="TramaApp.switchAdminTab('produtos')">
            🛍️ Gestão de Peças & Imagens (${products.length})
          </button>
          <button class="tab-nav-btn ${adminTab === 'pedidos' ? 'active' : ''}" onclick="TramaApp.switchAdminTab('pedidos')">
            ✂️ Fila de Produção (${orders.length})
          </button>
          <button class="tab-nav-btn ${adminTab === 'conteudo' ? 'active' : ''}" onclick="TramaApp.switchAdminTab('conteudo')">
            🎨 Textos & Banners do Site
          </button>
          <button class="tab-nav-btn ${adminTab === 'conta' ? 'active' : ''}" onclick="TramaApp.switchAdminTab('conta')">
            ⚙️ Conta da Administradora
          </button>
        </div>

        <!-- ABA 1: GESTÃO DE PEÇAS & IMAGENS (CMS) -->
        <div id="admin-tab-produtos" style="${adminTab === 'produtos' ? '' : 'display: none;'}">
          <div style="background: var(--card-bg); border: 1px solid var(--midnight); padding: 24px;">
            <div class="flex-between flex-wrap gap-sm" style="margin-bottom: 20px;">
              <div>
                <h2 class="caps-label" style="font-size: 14px;">Peças Cadastradas para Venda</h2>
                <p style="font-size: 13px; color: var(--apres-ski);">Adicione peças novas, troque fotos ou altere preços e descrições diretamente aqui.</p>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-primary btn-sm" onclick="TramaApp.openProductEditor()">
                  + Nova Peça
                </button>
                <button class="btn btn-secondary btn-sm" onclick="if(confirm('Restaurar o catálogo original da marca?')) TramaStore.resetCatalogToDefaults()">
                  Restaurar Padrões
                </button>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${products.map(p => {
                const img = this.getProductImage(p, 0);
                return `
                  <div style="display: grid; grid-template-columns: 80px 1fr auto; gap: 20px; align-items: center; padding: 16px; border: 1px solid var(--slopes); background: var(--bg);">
                    <img src="${img}" style="width: 80px; aspect-ratio: 3/4; object-fit: cover; border: 1px solid var(--slopes);" alt="${p.name}" />
                    <div>
                      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <span class="badge ${p.aesthetics === 'fluido' ? 'badge-fluido' : (p.aesthetics === 'reto' ? 'badge-reto' : 'badge-encontro')}">${p.aesthetics}</span>
                        <span class="badge badge-sob-encomenda">${p.category}</span>
                        <span style="font-size: 11px; color: var(--apres-ski);">Fotos: ${p.images ? p.images.length : 0}</span>
                      </div>
                      <div style="font-size: 16px; font-weight: 700; color: var(--midnight);">${p.name}</div>
                      <div style="font-size: 13px; color: var(--apres-ski); margin: 2px 0;">${p.subtitle || ''}</div>
                      <div style="font-size: 14px; font-weight: 700; color: var(--vinho-500);">R$ ${p.price.toFixed(2)} • <span style="font-weight: 400; color: var(--apres-ski); font-size: 12px;">Prazo: ${p.leadTime}</span></div>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                      <a href="#/produto/${p.id}" class="btn btn-secondary btn-sm" title="Ver como fica na loja">👁️ Ver</a>
                      <button class="btn btn-primary btn-sm" onclick="TramaApp.openProductEditor('${p.id}')">✏️ Editar / Fotos</button>
                      <button class="btn btn-secondary btn-sm" style="color: var(--vinho-500); border-color: var(--vinho-500);" onclick="TramaApp.deleteProductPrompt('${p.id}')">🗑️</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- ABA 2: FILA DE PRODUÇÃO (PEDIDOS) -->
        <div id="admin-tab-pedidos" style="${adminTab === 'pedidos' ? '' : 'display: none;'}">
          <div style="background: var(--card-bg); border: 1px solid var(--midnight); padding: 24px;">
            <h2 class="caps-label" style="font-size: 14px; margin-bottom: 16px;">Fila de Pedidos Sob Encomenda</h2>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
              <thead>
                <tr style="border-bottom: 2px solid var(--midnight); background-color: var(--arctic);">
                  <th style="padding: 10px;">ID / Data</th>
                  <th style="padding: 10px;">Cliente</th>
                  <th style="padding: 10px;">Peças & Medidas</th>
                  <th style="padding: 10px;">Status Atual</th>
                  <th style="padding: 10px; text-align: right;">Ação do Ateliê</th>
                </tr>
              </thead>
              <tbody>
                ${orders.map(o => `
                  <tr style="border-bottom: 1px solid var(--slopes);">
                    <td style="padding: 12px;"><strong>${o.id}</strong><br/><span style="font-size: 11px; color: var(--apres-ski);">${o.date}</span></td>
                    <td style="padding: 12px;">${o.customer?.name || 'Cliente'}</td>
                    <td style="padding: 12px;">
                      ${o.items.map(i => `
                        <div>• ${i.name} - <em>${i.sizeMode}</em> (${i.fabric})</div>
                      `).join('')}
                    </td>
                    <td style="padding: 12px;"><span class="badge badge-sob-encomenda">${o.statusName}</span></td>
                    <td style="padding: 12px; text-align: right;">
                      <button class="btn btn-primary btn-sm" onclick="TramaStore.advanceOrderStatus('${o.id}'); location.reload();" style="margin-right: 6px;">
                        Avançar Status (1 Clique) →
                      </button>
                      <a href="#/pedido/${o.id}" class="btn btn-secondary btn-sm" title="Imprimir Ficha">Ficha</a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- ABA 3: CONTEÚDOS DA LOJA -->
        <div id="admin-tab-conteudo" style="${adminTab === 'conteudo' ? '' : 'display: none;'}">
          <div style="background: var(--card-bg); border: 1px solid var(--slopes); padding: 24px;">
            <div class="flex-between" style="margin-bottom: 20px;">
              <h2 class="caps-label" style="font-size: 14px;">Editar Textos Gerais do Site</h2>
              <button class="btn btn-primary btn-sm" onclick="TramaApp.openContentEditor()">Abrir Editor de Textos</button>
            </div>
            <p style="font-size: 14px; color: var(--mountainside); line-height: 1.6;">
              Você pode alterar a barra de aviso de frete grátis, as frases conceituais do Hero da Home e os números de impacto sustentável a qualquer momento.
            </p>
          </div>
        </div>

        <!-- ABA 4: CONFIGURAÇÃO DA CONTA DE ADMINISTRADORA -->
        <div id="admin-tab-conta" style="${adminTab === 'conta' ? '' : 'display: none;'}">
          <div style="background: var(--card-bg); border: 1px solid var(--midnight); padding: 32px; max-width: 680px;">
            <span class="caps-label" style="color: var(--vinho-500); font-weight: 700;">Segurança & Credenciais</span>
            <h2 class="font-serif" style="font-size: 26px; margin: 6px 0 16px 0;">Conta de Administradora do Site</h2>
            <p style="font-size: 14px; color: var(--mountainside); line-height: 1.6; margin-bottom: 24px;">
              Aqui você altera o e-mail e a senha que têm permissão para acessar o painel e gerenciar os produtos e fotos. Visitantes comuns do site nunca terão acesso a essas ferramentas.
            </p>

            <form onsubmit="event.preventDefault(); TramaApp.saveAdminAccountSettings();">
              <div class="form-group" style="margin-bottom: 18px;">
                <label class="form-label" for="cfg-admin-name">Nome da Proprietária / Administradora</label>
                <input type="text" id="cfg-admin-name" value="${adminCreds.name}" required class="form-input" />
              </div>

              <div class="form-group" style="margin-bottom: 18px;">
                <label class="form-label" for="cfg-admin-email">E-mail Oficial de Acesso da Administradora</label>
                <input type="email" id="cfg-admin-email" value="${adminCreds.email}" required class="form-input" />
                <span style="font-size: 11px; color: var(--apres-ski);">Apenas logins com este e-mail serão autorizados a editar o site.</span>
              </div>

              <div class="form-group" style="margin-bottom: 28px;">
                <label class="form-label" for="cfg-admin-pass">Senha de Acesso</label>
                <input type="text" id="cfg-admin-pass" value="${adminCreds.password}" required class="form-input" />
                <span style="font-size: 11px; color: var(--apres-ski);">Defina a senha que você usará para entrar no ateliê.</span>
              </div>

              <div style="display: flex; gap: 12px; align-items: center;">
                <button type="submit" class="btn btn-primary">
                  Salvar Nova Conta de Administradora
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 9. PÁGINAS INSTITUCIONAIS
  // --------------------------------------------------------------------------
  renderAbout: function() {
    return `
      <div class="container section-spacing-sm" style="max-width: 860px;">
        <span class="caps-label text-muted">Nossa Identidade & Alma</span>
        <h1 class="serif-italic" style="font-size: clamp(32px, 5vw, 54px); margin: 8px 0 24px 0;">O Projeto Trama</h1>
        
        <p style="font-size: 18px; line-height: 1.8; margin-bottom: 24px;">
          O Projeto Trama nasceu de uma inquietação silenciosa diante do excesso do mercado tradicional. Acreditamos que a roupa mais sustentável é aquela que é feita para durar uma vida inteira e que só passa a existir quando alguém realmente a deseja.
        </p>

        <div style="margin: 48px 0; padding: 32px; background: var(--vinho-900); color: var(--offwhite);">
          <h2 class="serif-italic" style="font-size: 28px; margin-bottom: 12px; color: var(--offwhite);">A Dualidade entre o Fluido e o Reto</h2>
          <p style="color: var(--arctic); line-height: 1.7;">
            O delicado e o fluido trazem a leveza do caimento, o sopro do vento no linho e a primeira impressão sensorial. O forte e o reto trazem a estrutura da alfaiataria, a precisão matemática das proporções e o impacto duradouro. Nenhuma peça da Trama é puramente curva nem puramente reta: o equilíbrio é o nosso ponto de encontro.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 120px 1fr; gap: 24px; align-items: center; margin: 48px 0; padding: 24px; border: 1px solid var(--slopes);">
          <div>${RabbitSVGs.symbol("#090F15", "#4D0C0C", 80)}</div>
          <div>
            <h3 class="font-serif" style="margin-bottom: 6px;">O Coelho e a Estrela Vinho</h3>
            <p style="font-size: 14px; color: var(--mountainside); line-height: 1.6;">
              O coelho representa a suavidade do toque e a calma atenta. A estrela geométrica de 5 pontas cravada em sua testa, no tom vinho (#4D0C0C), é o elemento reto que quebra a curva, simbolizando o foco, a força interior e a precisão do corte artesanal.
            </p>
          </div>
        </div>
      </div>
    `;
  },

  renderSustainability: function() {
    return `
      <div class="container section-spacing-sm" style="max-width: 860px;">
        <span class="caps-label text-muted">Sustentabilidade Tangível</span>
        <h1 class="serif-italic" style="font-size: clamp(32px, 5vw, 54px); margin: 8px 0 24px 0;">Dados Reais, Não Discurso Genérico</h1>
        
        <p style="font-size: 18px; line-height: 1.8; margin-bottom: 36px;">
          No Projeto Trama, sustentabilidade não é uma estratégia de marketing; é o nosso método de produção. Não queimamos coleções, não descartamos peças excedentes e não usamos fibras sintéticas que poluem as águas com microplásticos.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 48px;">
          <div style="padding: 24px; background: var(--arctic); border: 1px solid var(--slopes);">
            <h3 class="caps-label" style="font-size: 13px; margin-bottom: 8px;">Zero Estoque Parado</h3>
            <p style="font-size: 14px;">100% da produção é sob demanda. A matéria-prima só é transformada quando o destino já está traçado.</p>
          </div>
          <div style="padding: 24px; background: var(--arctic); border: 1px solid var(--slopes);">
            <h3 class="caps-label" style="font-size: 13px; margin-bottom: 8px;">Fibras Nacionais Rastreadas</h3>
            <p style="font-size: 14px;">Linho do Rio Grande do Sul, algodão agroecológico da Paraíba e seda sustentável do Paraná.</p>
          </div>
        </div>

        <h2 class="font-serif" style="margin-bottom: 16px;">Embalagem Compostável</h2>
        <p style="font-size: 15px; color: var(--mountainside); line-height: 1.7;">
          Sua encomenda chega embalada em saquinhos de algodão cru confeccionados com os próprios retalhos aproveitados do corte das peças, acompanhados de fita de cetim vegetal e papel craft reciclado com sementes de manjericão para plantar.
        </p>
      </div>
    `;
  },

  renderHowItIsMade: function() {
    return `
      <div class="container section-spacing-sm" style="max-width: 860px;">
        <span class="caps-label text-muted">Do Pedido à Entrega</span>
        <h1 class="serif-italic" style="font-size: clamp(32px, 5vw, 54px); margin: 8px 0 24px 0;">Como é Feita Cada Peça</h1>
        
        <div style="display: flex; flex-direction: column; gap: 36px; margin-top: 36px;">
          <div style="display: grid; grid-template-columns: 60px 1fr; gap: 20px;">
            <div style="font-family: var(--font-fluid); font-size: 36px; color: var(--vinho-500); font-style: italic;">01</div>
            <div>
              <h3 style="font-size: 18px; margin-bottom: 6px;">Descanso & Calibragem do Tecido</h3>
              <p style="font-size: 14px; color: var(--mountainside);">O rolo de fibra pura descansa 48h antes do corte para garantir que não haja encolhimento pós-lavagem.</p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 60px 1fr; gap: 20px;">
            <div style="font-family: var(--font-fluid); font-size: 36px; color: var(--vinho-500); font-style: italic;">02</div>
            <div>
              <h3 style="font-size: 18px; margin-bottom: 6px;">Graduação Anatômica do Molde</h3>
              <p style="font-size: 14px; color: var(--mountainside);">Suas medidas de busto, cintura, quadril e altura são inseridas no software de modelagem geométrica.</p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 60px 1fr; gap: 20px;">
            <div style="font-family: var(--font-fluid); font-size: 36px; color: var(--vinho-500); font-style: italic;">03</div>
            <div>
              <h3 style="font-size: 18px; margin-bottom: 6px;">Costura Francesa & Acabamento Manual</h3>
              <p style="font-size: 14px; color: var(--mountainside);">Uma única alfaiate é responsável por costurar a peça do início ao fim, assinando a ficha técnica que vai com a roupa.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderLookbook: function() {
    return `
      <div class="container section-spacing-sm">
        <div class="text-center" style="max-width: 680px; margin: 0 auto 48px auto;">
          <span class="caps-label text-muted">Campanhas Visuais</span>
          <h1 class="serif-italic" style="font-size: clamp(32px, 5vw, 54px); margin-top: 8px;">Lookbook: Compre o Look</h1>
          <p style="font-size: 15px; color: var(--mountainside); margin-top: 12px;">
            Veja as peças em harmonia. Clique nos produtos sugeridos abaixo de cada ensaio para configurar e encomendar.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 64px;">
          ${TramaData.lookbook.map(lb => `
            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 36px; align-items: center; border: 1px solid var(--slopes); padding: 24px; background: var(--card-bg);" class="lookbook-row">
              <div style="aspect-ratio: 4/5; overflow: hidden; position: relative;">
                <img src="${lb.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80'}" style="width: 100%; height: 100%; object-fit: cover;" alt="${lb.title}" />
              </div>
              <div>
                <span class="caps-label" style="color: var(--vinho-500);">${lb.id}</span>
                <h2 class="serif-italic" style="font-size: 32px; margin: 8px 0 12px 0;">${lb.title}</h2>
                <p style="font-size: 14px; color: var(--mountainside); margin-bottom: 24px;">${lb.subtitle}</p>

                <div style="border-top: 1px solid var(--slopes); padding-top: 16px;">
                  <span class="caps-label" style="font-size: 11px; margin-bottom: 12px; display: block;">Peças Deste Look:</span>
                  <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${lb.items.map(it => `
                      <a href="#/produto/${it.productId}" class="flex-between" style="padding: 10px 14px; border: 1px solid var(--slopes); background: var(--bg); font-size: 13px; font-weight: 600;">
                        <span>${it.title}</span>
                        <span style="color: var(--vinho-500);">Configurar →</span>
                      </a>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderMeasurementGuide: function() {
    return `
      <div class="container section-spacing-sm" style="max-width: 820px;">
        <span class="caps-label text-muted">Ajuste Anatômico Perfeito</span>
        <h1 class="serif-italic" style="font-size: clamp(30px, 4.5vw, 48px); margin: 8px 0 16px 0;">Guia Passo a Passo: Como se Medir</h1>
        <p style="font-size: 15px; color: var(--mountainside); margin-bottom: 36px;">
          Use uma fita métrica flexível. Mantenha a fita firme ao corpo, mas sem apertar. Se possível, vista roupas leves para maior precisão.
        </p>

        <div style="display: flex; flex-direction: column; gap: 24px;">
          ${TramaData.measurementGuide.map(mg => `
            <div style="display: grid; grid-template-columns: 80px 1fr; gap: 20px; padding: 24px; border: 1px solid var(--slopes); background: var(--card-bg);">
              <div style="width: 60px; height: 60px; background: var(--card-bg-subtle); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: var(--vinho-500);">
                0${mg.step}
              </div>
              <div>
                <div class="flex-between">
                  <h3 style="font-size: 18px; font-weight: 600;">${mg.part}</h3>
                  <span class="badge badge-sob-encomenda" style="font-size: 10px;">Faixa: ${mg.range}</span>
                </div>
                <p style="font-size: 14px; color: var(--mountainside); margin-top: 6px;">${mg.instruction}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderFAQ: function() {
    return `
      <div class="container section-spacing-sm" style="max-width: 820px;">
        <span class="caps-label text-muted">Dúvidas Frequentes</span>
        <h1 class="serif-italic" style="font-size: clamp(30px, 4.5vw, 48px); margin: 8px 0 24px 0;">Perguntas & Respostas</h1>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${TramaData.faq.map((item, idx) => `
            <div style="border: 1px solid var(--slopes); background: var(--card-bg); padding: 20px 24px;">
              <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 10px; color: var(--midnight);">${item.q}</h3>
              <p style="font-size: 14px; color: var(--mountainside); line-height: 1.6;">${item.a}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderShippingReturns: function() {
    return `
      <div class="container section-spacing-sm" style="max-width: 820px;">
        <span class="caps-label text-muted">Transparência & Direitos</span>
        <h1 class="serif-italic" style="font-size: clamp(30px, 4.5vw, 48px); margin: 8px 0 24px 0;">Prazos, Trocas & Devoluções</h1>

        <div style="padding: 24px; background: var(--arctic); border: 1px solid var(--slopes); margin-bottom: 28px;">
          <h2 class="caps-label" style="font-size: 13px; margin-bottom: 8px;">Direito de Arrependimento de 7 Dias (CDC Art. 49)</h2>
          <p style="font-size: 14px; color: var(--mountainside); line-height: 1.6;">
            Respeitamos integralmente o artigo 49 do Código de Defesa do Consumidor brasileiro. Mesmo sendo uma peça produzida sob encomenda para suas medidas, você tem 7 dias corridos após o recebimento para solicitar a devolução com estorno total.
          </p>
        </div>

        <h3 class="font-serif" style="margin-bottom: 10px;">Primeiro Ajuste de Caimento Gratuito</h3>
        <p style="font-size: 14px; color: var(--mountainside); line-height: 1.6; margin-bottom: 24px;">
          Se a peça sob medida necessitar de algum ajuste fino (barra, decote, cintura), nós realizamos a correção gratuitamente em nosso ateliê, com postagem de logística reversa custeada pelo Projeto Trama.
        </p>

        <h3 class="font-serif" style="margin-bottom: 10px;">Cálculo do Prazo Total</h3>
        <p style="font-size: 14px; color: var(--mountainside); line-height: 1.6;">
          Prazo total = Prazo de Confecção no Ateliê (20–30 dias úteis) + Prazo dos Correios/Transportadora (2 a 5 dias úteis).
        </p>
      </div>
    `;
  },

  renderContact: function() {
    return `
      <div class="container section-spacing-sm" style="max-width: 680px;">
        <span class="caps-label text-muted">Fale Conosco</span>
        <h1 class="serif-italic" style="font-size: clamp(30px, 4.5vw, 48px); margin: 8px 0 16px 0;">Atendimento Humanizado</h1>
        <p style="font-size: 15px; color: var(--mountainside); margin-bottom: 32px;">
          Dúvidas sobre tecidos, auxílio na tomada de medidas ou acompanhamento de encomenda.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px;">
          <a href="https://wa.me/5541992584033" target="_blank" class="btn btn-secondary" style="padding: 16px; height: auto; display: flex; flex-direction: column; align-items: center; gap: 8px;">
            ${RabbitSVGs.icon('whatsapp', 24)}
            <span style="font-weight: 700;">Atendimento WhatsApp</span>
            <span style="font-size: 11px; text-transform: none; color: var(--apres-ski);">${TramaData.brand.contact.whatsapp}</span>
          </a>

          <div class="btn btn-secondary" style="padding: 16px; height: auto; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: default;">
            ${RabbitSVGs.icon('user', 24)}
            <span style="font-weight: 700;">E-mail do Ateliê</span>
            <span style="font-size: 11px; text-transform: none; color: var(--apres-ski);">${TramaData.brand.contact.email}</span>
          </div>
        </div>

        <form onsubmit="event.preventDefault(); TramaApp.showToast('Mensagem enviada com sucesso ao nosso ateliê.'); this.reset();" style="border: 1px solid var(--slopes); padding: 28px; background: var(--card-bg);">
          <div class="form-group">
            <label class="form-label">Seu Nome</label>
            <input type="text" required placeholder="Nome completo" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Seu E-mail</label>
            <input type="email" required placeholder="seu@email.com" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Mensagem ou Dúvida</label>
            <textarea rows="4" required placeholder="Como podemos ajudar você com sua peça?" class="form-input" style="resize: vertical;"></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Enviar Mensagem</button>
        </form>
      </div>
    `;
  },

  renderPolicies: function(type = 'privacidade') {
    return `
      <div class="container section-spacing-sm" style="max-width: 820px;">
        <span class="caps-label text-muted">Legal & LGPD</span>
        <h1 class="serif-italic" style="font-size: clamp(30px, 4.5vw, 48px); margin: 8px 0 24px 0;">
          ${type === 'termos' ? 'Termos de Serviço' : 'Política de Privacidade & Cookies'}
        </h1>

        <div style="font-size: 14px; line-height: 1.8; color: var(--mountainside); display: flex; flex-direction: column; gap: 20px;">
          <p>${TramaData.policies.privacy}</p>
          <p>${TramaData.policies.terms}</p>
          <p>${TramaData.policies.returns}</p>
          <p><strong>Encarregado de Proteção de Dados (DPO):</strong> dpo@projetotrama.com.br</p>
          <p><strong>Identificação Legal:</strong> PROJETO TRAMA CONFECÇÕES LTDA (Conforme Decreto Federal 7.962/2013).</p>
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 10. PÁGINA 404 PERSONALIZADA
  // --------------------------------------------------------------------------
  render404: function() {
    return `
      <div class="container section-spacing text-center" style="max-width: 600px;">
        <div style="margin-bottom: 28px; overflow: hidden; padding: 20px 0;">
          ${RabbitSVGs.rabbitRunning("#090F15", "#4D0C0C", 110)}
        </div>
        <span class="caps-label" style="color: var(--vinho-500); font-weight: 700;">Erro 404</span>
        <h1 class="serif-italic" style="font-size: clamp(32px, 5vw, 46px); margin: 8px 0 16px 0;">
          "Essa página fugiu. Coelhos são rápidos."
        </h1>
        <p style="font-size: 15px; color: var(--mountainside); margin-bottom: 32px;">
          O endereço que você tentou acessar não existe ou mudou de lugar na esteira do nosso ateliê.
        </p>

        <div style="display: flex; gap: 8px; margin-bottom: 24px;">
          <input type="text" id="input-404-search" placeholder="Busque por vestido, linho, blazer..." class="form-input" style="flex: 1; padding: 10px 14px; background: var(--card-bg); border: 1px solid var(--slopes);" />
          <button class="btn btn-primary btn-sm" onclick="TramaApp.openSearchModal(document.getElementById('input-404-search').value)">Buscar</button>
        </div>

        <a href="#/" class="btn btn-secondary">Voltar para a Página Inicial</a>
      </div>
    `;
  }
};

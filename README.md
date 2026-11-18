# Projeto Trama — Loja Minimalista de Moda Sob Encomenda

Aplicação completa desenvolvida em estrita conformidade com a diretiva de produto e design system do **Projeto Trama** (Slow Fashion Made-to-Order), orientada pela **dualidade entre o fluido e o reto**.

Agora equipada com **Painel Visual de CMS integrado**: você pode **adicionar novas peças**, **trocar ou adicionar fotos direto do seu computador** e **editar qualquer conteúdo do site** diretamente pela interface, sem precisar mexer no código!

---

## 👑 Área Exclusiva da Administradora & Gestão de Peças

A vitrine pública da loja é **100% limpa e exclusiva para os clientes**: visitantes comuns **NÃO veem nenhum botão de editar, nem de adicionar peças**. 

As ferramentas de alteração e adição de peças estão **bloqueadas para a conta de administradora**.

### 1. Como a Administradora Acessa o Painel:
- No rodapé da loja, há um link discreto **`Acesso Ateliê`** (ou acesse diretamente pelo link `index.html#/admin`).
- Digite os dados da sua conta de administradora:
  - **E-mail padrão:** `oprojetotrama@gmail.com` (ou usuário `admin`)
  - **Senha padrão:** `trama2026` (ou `admin`)
- Clique em **Entrar no Painel do Ateliê**.

### 2. Como Alterar o E-mail e Senha da Administradora:
- No painel administrativo (`#/admin`), clique na aba **`⚙️ Conta da Administradora`**.
- Lá você pode alterar seu **Nome**, seu **E-mail oficial** e a sua **Senha de acesso**.
- Clique em **Salvar Nova Conta de Administradora**. A partir de então, apenas você com suas novas credenciais poderá acessar o painel!

### 3. Como Cadastrar Novas Peças ou Trocar Fotos:
- No Painel (`#/admin`), na aba **`🛍️ Gestão de Peças & Imagens`**:
  - Clique em **`+ Adicionar Nova Peça à Venda`** para cadastrar um novo produto.
  - Ou clique em **`✏️ Editar / Fotos`** em qualquer peça existente.
  - Para as fotos:
    - Arraste arquivos de imagem direto do computador ou clique em **`📁 Escolher Fotos do Computador`**.
    - Reordene fotos usando as setas `◀` e `▶`.
    - Defina qual será a foto de capa clicando em **`⭐ Capa`**.
  - O preço aceita vírgula ou ponto (ex: `480` ou `480,00`).
  - Ao salvar, as alterações entram no ar imediatamente na vitrine pública!

---

## ⚡ Desconto Especial no Pix (-5% Off)

- Ao selecionar **Pix** na etapa 3 do checkout, o desconto de 5% é **calculado e abatido automaticamente em tempo real** do total da compra.
- Ao clicar em confirmar, o cliente recebe o código oficial **Pix Copia e Cola** com o valor exato descontado e um botão com 1 clique para copiar a chave.
- No carrinho lateral e na página da peça, o valor com 5% de desconto no Pix também é destacado para incentivar a conversão.

---

## ✦ Identidade e Conceito da Marca

- **Conceito Central:** Moda sustentável sob encomenda sem estoque parado (zero desperdício).
- **Dualidade Fluido × Reto:**
  - *Fluido:* Caimento orgânico, curvas suaves, linho e seda pura.
  - *Reto:* Alfaiataria geométrica, cantos vivos (`border-radius: 0`), linhas de 1px, lã fria estruturada e tons Midnight.
- **Símbolo:** O coelho com a estrela de 5 pontas vinho (`#4D0C0C`) na testa.
  - *Microinteração:* No loading e ao adicionar uma peça à sacola, o coelho bate a pata ritmicamente (comportamento de alerta/aprovação).

---

## 🎨 Paleta de Cores e Tokens CSS

```css
:root {
  --midnight: #090F15;      /* Texto principal, seções retas */
  --mountainside: #262E36;  /* Fundos secundários escuros */
  --apres-ski: #6C6D74;     /* Texto secundário, ícones */
  --slopes: #B3B7BA;        /* Bordas, divisores finos de 1px */
  --arctic: #D3D1CE;        /* Cards claros e destaques */
  --offwhite: #F2F0EC;      /* Fundo principal da loja */
  --vinho-900: #1C010C;     /* Fundo de impacto e manifesto */
  --vinho-800: #2F0410;     /* Hover de botões vinho */
  --vinho-700: #3C050F;     /* Selo "Sob Encomenda" */
  --vinho-600: #40070D;     /* Estados ativos e sublinhados */
  --vinho-500: #4D0C0C;     /* Cor de destaque: CTA primário e estrela */
}
```

- **Tipografia:**
  - *Fluida:* Cormorant Garamond / Playfair Display (títulos, nomes de coleções, citações, itálico poético).
  - *Reta:* Inter / Space Grotesk (menu, preços, botões, formulários, números).

---

## 🗺️ Mapa do Site & Páginas Implementadas

O projeto inclui todas as **16 páginas e fluxos** solicitados na diretiva:

### 1. Loja
- **Home:** Hero dividido ao meio (fluido claro × reto escuro com coelho sobre a linha divisória), manifesto curto (`#1C010C`), vitrine de destaques sob encomenda, 4 passos do made-to-order, 3 blocos estéticos (Fluido, Reto, Encontro), sustentabilidade com números reais, lookbook e newsletter com aceite LGPD.
- **Sob Encomenda (Listagem):** Cabeçalho oficial, filtros combináveis, ordenação, botões rápidos de CMS para adicionar nova peça e cards 3:4 com troca de imagem no hover e botão de edição direta.
- **Página de Produto (PDP):**
  - Barra superior de edição rápida do ateliê.
  - Galeria de fotos com zoom dinâmico e suporte a miniaturas.
  - Seletor de tecidos e cores.
  - **Configurador de Medidas:** Alternador entre *Tamanho Padrão (PP ao GG)* e *Sob Medida* com validação de faixas para **Busto (70-140 cm)**, **Cintura (50-120 cm)**, **Quadril (70-150 cm)** e **Altura (140-200 cm)**.
  - Botão inteligente *"Usar medidas salvas da conta"*.
  - Simulador de CEP somando confecção + envio.
  - Abas técnicas e impacto ecológico com dados reais.
- **Lookbook / Editorial:** Ensaios fotográficos de alta costura com hotspots "Compre o Look".

### 2. Sacola, Checkout & Rastreamento
- **Sacola Lateral (Drawer 420px):** Barra de progresso para frete grátis, discriminação completa de todas as medidas corporais escolhidas e animação do coelho batendo a pata.
- **Checkout em 1 Página (3 Etapas):**
  1. *Identificação:* Compra como visitante ou com login.
  2. *Entrega:* Preenchimento automático por CEP (ViaCEP) e opções de Sedex ou Retirada no Ateliê.
  3. *Pagamento:* **Pix com 5% de desconto automático**, **Cartão de Crédito parcelado em até 6x** ou **Boleto Bancário**.
- **Página de Pedido Confirmado:** Frase oficial da marca, código de rastreamento e **Linha do Tempo da Produção Artesanal** com os 7 status:
  `Pedido recebido` → `Tecido separado` → `Em corte` → `Em costura` → `Acabamento` → `Enviado` → `Entregue`.
  - **Ficha de Produção Imprimível do Ateliê:** Botão para impressão da folha técnica de corte com as medidas do cliente.

### 3. Painel Administrativo do Ateliê (Modo Ateliê — `#/admin`)
- **Aba 1: Gestão de Peças & Imagens (CMS):** Visualização de todo o catálogo, botão `+ Nova Peça`, edição com upload de fotos do computador e botão de exclusão.
- **Aba 2: Fila de Produção:** Gestão de pedidos com avanço de etapa na esteira com **1 clique**.
- **Aba 3: Textos & Banners do Site:** Editor para alterar frases do Hero e avisos.

### 4. Conta da Cliente & Institucionais
- Login com Google Social e E-mail/Senha.
- Dashboard da cliente com medidas corporais salvas e conformidade LGPD.
- Sobre a Trama, Sustentabilidade, Como é Feita, Guia de Medidas, FAQ, Trocas (CDC 49) e Contato com WhatsApp oficial.

---

## 🚀 Como Executar Localmente

### Opção 1: Abrir diretamente no navegador
Dê um duplo clique no arquivo `index.html`.

### Opção 2: Servidor local com Python
No terminal da pasta do projeto (`C:\Users\Camila\.gemini\antigravity\scratch\projeto-trama`):
```bash
python -m http.server 3000
```
E abra no navegador em `http://localhost:3000`.

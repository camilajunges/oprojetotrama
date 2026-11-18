/* ==========================================================================
   PROJETO TRAMA - DADOS DO CATÁLOGO & CONTEÚDO
   Slow Fashion Made-to-Order | Dualidade Fluido x Reto
   ========================================================================== */

const TramaData = {
  // Configurações Gerais da Marca
  brand: {
    name: "Projeto Trama",
    tagline: "Leve como o tecido. Firme como o corte.",
    concept: "Dualidade entre o Fluido e o Reto",
    leadTime: "20–30 dias úteis",
    freeShippingThreshold: 600,
    pixDiscountPercent: 5,
    weeklyProductionLimit: 25,
    weeklyProductionBooked: 18,
    contact: {
      whatsapp: "+55 (41) 99258-4033",
      email: "oprojetotrama@gmail.com",
      // address: "Rua Harmonia, 128 - Vila Madalena, São Paulo - SP",
      // cnpj: "48.291.802/0001-94"
    },
    // Conta Oficial da Administradora (Defina aqui ou mude pelo painel do site)
    adminAccount: {
      email: "oprojetotrama@gmail.com",
      password: "admin", // Também aceita "trama2026"
      name: "Camila Guimarães (Proprietária)"
    }
  },

  // Sustentabilidade em Números Reais (Home e Página Institucional)
  sustainabilityStats: [
    { number: "1.420", label: "Peças feitas exclusivamente sob demanda", detail: "Zero peças paradas em estoque" },
    { number: "4.150 m", label: "De tecido nobre economizado", detail: "Corte geométrico inteligente sem resíduo" },
    { number: "0%", label: "De incineração ou queima de coleções", detail: "Produzimos apenas o que vai existir na vida de alguém" }
  ],

  // Catálogo de Peças Sob Encomenda
  products: [
    {
      id: "colete-estruturado-alfaitaria",
      name: "Colete Estruturado em Alfaitaria",
      subtitle: "Design moderno com detalhes artesanais",
      category: "coletes",
      aesthetics: "reto", 
      price: 480,
      leadTime: "20–30 dias úteis",
      images: [

      ],
      description: "Desenhado a partir do movimento natural da alfaiataria. O modelo une a leveza de uma silhueta solta com o caimento impecável que respeita as linhas singulares do seu corpo.",
      fabrics: [
        { id: "colete-linho-puro", name: "Linho Puro 100% (Gramatura Média)", priceDiff: 0, origin: "Cultivo sem irrigação química no Rio Grande do Sul" },
        { id: "colete-seda-linho", name: "Misto Linho com Fio de Seda Artesanal", priceDiff: 110, origin: "Casulo sustentável do Vale da Seda (PR)" }
      ],
      colors: [
        { id: "offwhite", name: "Off-White Natural", hex: "#F2F0EC" },
        { id: "areia", name: "Areia Lavada", hex: "#D3D1CE" },
        { id: "vinho", name: "Vinho Profundo", hex: "#4D0C0C" }
      ],
      impact: {
        waterSaved: "920 litros economizados vs. produção industrial em massa",
        wastePercent: "0% resíduo têxtil - retalhos se transformam na sacola da própria peça",
        traceability: "Tecelagem parceira certificada OEKO-TEX® Standard 100"
      },
      matchWith: "calca-alfaiataria-reta", 
      reviewsSummary: {
        score: 4.9,
        count: 28,
        fit: { small: 2, right: 96, large: 2 }
      }
    },
    {
      id: "calca-fluida-alfaiataria",
      name: "Calça Corte Fluido em Alfaitaria",
      subtitle: "Corte moderno",
      category: "calças",
      aesthetics: "fluido",
      price: 390,
      leadTime: "20–30 dias úteis",
      images: [
      ],
      description: "Calça de corte fluido em alfaiataria, com caimento leve e elegante que valoriza o movimento. Confeccionada em alfaiataria com elastano para oferecer conforto, respirabilidade e durabilidade.",
      fabrics: [
        { id: "calca-la-fria-super120", name: "Lã Fria Pura Super 120's", priceDiff: 0, origin: "Lã tosquiada com certificação de bem-estar animal RWS" },
        { id: "calca-la-com-algodao", name: "Lã Fria com Sarja de Algodão Estruturado", priceDiff: -50, origin: "Fiação nacional sustentável" }
      ],
      colors: [
        { id: "midnight", name: "Midnight Negro", hex: "#090F15" },
        { id: "carvao", name: "Carvão Grafite", hex: "#262E36" },
        { id: "slopes", name: "Cinza Névoa", hex: "#B3B7BA" }
      ],
      impact: {
        waterSaved: "1.250 litros preservados",
        wastePercent: "Corte a laser milimétrico guiado individualmente por molde de corte",
        traceability: "Fios biodegradáveis de lã natural compostável"
      },
      matchWith: "vestido-fluido-linho",
      reviewsSummary: {
        score: 5.0,
        count: 19,
        fit: { small: 0, right: 98, large: 2 }
      }
    },
    {
      id: "capri-larga",
      name: "Capri Wide Leg",
      subtitle: "Modelagem wide leg e caimento fluido para liberdade de movimento",
      category: "calças",
      aesthetics: "fluido",
      price: 390,
      leadTime: "20–30 dias úteis",
      images: [
      ],
      description: "Calça capri wide leg em seda crua lavada, com caimento fluido e amplo que acompanha os passos com leveza. A modelagem alongada valoriza o movimento e traz conforto sofisticado para o dia a dia.",
      fabrics: [
        { id: "capri-seda-pura-habotai", name: "Pura Seda Habotai Lavada", priceDiff: 0, origin: "Sericicultura sustentável brasileira" },
        { id: "capri-cupro-biodegradavel", name: "Cupro Ecológico 100% Regenerado", priceDiff: -80, origin: "Fibras de algodão reaproveitadas" }
      ],
      colors: [
        { id: "offwhite", name: "Off-White Perolado", hex: "#F2F0EC" },
        { id: "vinho", name: "Vinho Profundo", hex: "#4D0C0C" }
      ],
      impact: {
        waterSaved: "800 litros poupados no tingimento sem químicos pesados",
        wastePercent: "Molde com encaixe zero-waste",
        traceability: "Tingimento botânico à base de cascas e raízes"
      },
      matchWith: "calca-alfaiataria-reta",
      reviewsSummary: {
        score: 4.8,
        count: 15,
        fit: { small: 4, right: 93, large: 3 }
      }
    }
  ],

  // Campanhas do Lookbook (Compre o Look com Hotspots)
  lookbook: [
    {
      id: "look-dualidade-01",
      title: "O Silêncio da Forma",
      subtitle: "A estrutura do colete encontra o movimento da calça fluida em uma composição equilibrada.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80",
      items: [
        { productId: "colete-estruturado-alfaitaria", x: 48, y: 35, title: "Colete Estruturado em Alfaiataria" },
        { productId: "calca-fluida-alfaiataria", x: 52, y: 70, title: "Calça Corte Fluido em Alfaiataria" }
      ]
    },
    {
      id: "look-dualidade-02",
      title: "O Peso e o Ar",
      subtitle: "A geometria reta da jaqueta minimalista contrasta com a leveza translúcida da seda pura.",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80",
      items: [
        { productId: "jaqueta-reta-minimalista", x: 50, y: 40, title: "Jaqueta Reta Minimalista" },
        { productId: "camisa-fluida-seda", x: 50, y: 65, title: "Camisa Fluida em Pura Seda" }
      ]
    },
    {
      id: "look-dualidade-03",
      title: "O Encontro do Linho",
      subtitle: "Fluidez orgânica e corte milimétrico unidos no tom Off-White natural da fibra crua.",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=80",
      items: [
        { productId: "vestido-fluido-transpassado", x: 50, y: 50, title: "Vestido Linho Transpassado" }
      ]
    }
  ],

  // Dúvidas Frequentes (FAQ)
  faq: [
    {
      q: "O que significa 'Feito sob encomenda' (made-to-order)?",
      a: "Significa que nenhuma peça da Trama existe antes de você realizar seu pedido. Não possuímos depósitos de roupas prontas esperando compradores. Assim que você finaliza a compra com suas medidas, nossa equipe separa o tecido, corta seu molde individual e costura com atenção meticulosa a cada detalhe."
    },
    {
      q: "Como funciona a confecção 'Sob Medida'?",
      a: "Você pode optar pelo tamanho padrão (PP ao GG) ou escolher 'Sob Medida'. Ao escolher sob medida, você informa suas medidas de busto, cintura, quadril e altura. Ajustamos as proporções do molde especificamente para o seu corpo, garantindo caimento anatômico perfeito."
    },
    {
      q: "Qual é o prazo total entre o pedido e a chegada na minha casa?",
      a: "O prazo total é composto por: Prazo de Confecção no Ateliê (15 a 20 dias úteis) + Prazo de Transporte dos Correios/Transportadora (geralmente 2 a 5 dias úteis, conforme seu CEP). No carrinho você sempre vê a soma exata e transparente."
    },
    {
      q: "Posso trocar ou devolver uma peça feita sob medida?",
      a: "Sim! Respeitamos rigorosamente o Direito de Arrependimento de 7 dias previsto pelo Código de Defesa do Consumidor. Além disso, se a peça sob medida necessitar de um ajuste fino de caimento, oferecemos o primeiro ajuste gratuitamente em nosso ateliê com logística reversa custeada por nós."
    },
    {
      q: "Por que vocês limitam a 25 pedidos por semana?",
      a: "Cada costureira da nossa equipe trabalha com respeito, ergonomia e remuneração justa. Limitar o fluxo garante que nenhuma peça seja feita com pressa industrial e mantém nosso compromisso de zero defeito e sustentabilidade tangível."
    }
  ],

  // Guia de Medidas com Ilustrações e Instruções
  measurementGuide: [
    {
      part: "Busto / Tórax",
      instruction: "Passe a fita métrica pela parte mais saliente do busto, mantendo a fita reta nas costas, sem apertar.",
      range: "70 a 140 cm",
      step: 1
    },
    {
      part: "Cintura Natural",
      instruction: "Meça no ponto mais estreito do seu tronco, geralmente dois dedos acima do umbigo, respirando normalmente.",
      range: "50 a 120 cm",
      step: 2
    },
    {
      part: "Quadril",
      instruction: "Fique de pé com os calcanhares juntos. Passe a fita na parte mais volumosa dos quadris e glúteos.",
      range: "70 a 150 cm",
      step: 3
    },
    {
      part: "Altura Total",
      instruction: "Sua altura descalça, da cabeça aos pés. Usamos essa medida para calibrar proporções de gancho e comprimento.",
      range: "140 a 200 cm",
      step: 4
    }
  ],

  // Políticas e Obrigações Legais (LGPD, Decretos)
  policies: {
    privacy: "No Projeto Trama, tratamos suas medidas corporais e informações com a máxima seriedade como dados pessoais protegidos pela Lei Geral de Proteção de Dados (LGPD). Seus dados biométricos são utilizados única e exclusivamente para a modelagem artesanal e corte da sua peça. Você tem o direito de consultar, exportar ou excluir definitivamente seus dados a qualquer instante através do seu painel de conta.",
    terms: "Ao adquirir uma peça sob encomenda no Projeto Trama, você celebra um contrato de prestação de serviços de confecção artesanal personalizada. O prazo de produção inicia-se no primeiro dia útil subsequente à aprovação do pagamento.",
    returns: "Conforme o art. 49 do CDC, você pode exercer o direito de arrependimento em até 7 dias corridos após o recebimento. Para peças sob medida com pequenas divergências de ajuste corporal, oferecemos assistência técnica de alfaiataria com reajuste gratuito."
  }
};

// Exportar para escopo global com total compatibilidade
if (typeof window !== 'undefined') {
  window.TramaData = TramaData;
}
if (typeof globalThis !== 'undefined') {
  globalThis.TramaData = TramaData;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TramaData;
}

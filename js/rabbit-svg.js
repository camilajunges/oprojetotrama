/* ==========================================================================
   PROJETO TRAMA - SVGs DO SÍMBOLO & ÍCONES
   Símbolo: O Coelho com uma estrela vinho #4D0C0C na testa
   ========================================================================== */

const RabbitSVGs = {
  // Símbolo do Coelho com Estrela na Testa (Parado / Base)
  symbol: function(color = "#090F15", starColor = "#4D0C0C", size = 32) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Símbolo do Coelho Trama">
        <!-- Orelhas Minimalistas Retas/Curvas -->
        <path d="M25 6C23 15 24 28 27 34C28 26 29 14 31 6C29 5 27 5 25 6Z" fill="${color}" />
        <path d="M34 9C32 17 33 27 36 33C37 26 39 16 41 9C39 8 36 8 34 9Z" fill="${color}" />
        
        <!-- Cabeça e Focinho -->
        <path d="M24 33C20 37 18 43 21 47C23 50 28 50 33 49C40 47 43 41 42 35C41 31 35 30 29 31C27 31 25 32 24 33Z" fill="${color}" />
        
        <!-- Olho Delicado -->
        <circle cx="27" cy="38" r="1.5" fill="${color === '#090F15' ? '#F2F0EC' : '#090F15'}" />
        
        <!-- O Elemento Geométrico: Estrela de 5 Pontas Vinho na Testa -->
        <polygon points="34,31 35.5,34.5 39,34.5 36.2,36.5 37.2,40 34,37.8 30.8,40 31.8,36.5 29,34.5 32.5,34.5" fill="${starColor}" />
      </svg>
    `;
  },

  // Coelho de Corpo Inteiro com a Pata Dianteira Separada para Microinteração (@keyframes rabbit-paw-thump)
  rabbitTapping: function(color = "#090F15", starColor = "#4D0C0C", size = 72) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="rabbit-interactive">
        <g id="rabbit-body">
          <!-- Orelhas Altas -->
          <path d="M34 8C32 17 33 26 36 32C37 25 39 16 41 8C39 7 36 7 34 8Z" fill="${color}" />
          <path d="M43 11C41 19 42 27 45 32C46 25 48 17 50 11C48 10 45 10 43 11Z" fill="${color}" />
          
          <!-- Cabeça -->
          <path d="M32 30C28 34 26 40 29 44C31 47 36 47 41 46C47 44 49 38 48 33C47 29 40 28 35 29C34 29 33 30 32 30Z" fill="${color}" />
          
          <!-- Estrela Vinho na Testa -->
          <polygon points="41,29 42.2,31.8 45,31.8 42.7,33.5 43.6,36.2 41,34.5 38.4,36.2 39.3,33.5 37,31.8 39.8,31.8" fill="${starColor}" class="star-pulsing" />
          
          <!-- Tronco e Dorso -->
          <path d="M36 44C33 48 31 56 32 63C33 67 36 70 41 71C49 72 58 69 61 62C64 54 62 45 54 42C48 40 41 41 36 44Z" fill="${color}" />
          
          <!-- Rabinho Pom-pom Macio -->
          <circle cx="63" cy="60" r="4.5" fill="${color}" />
          
          <!-- Pata Traseira Reta Apoiada -->
          <rect x="42" y="68" width="16" height="4" fill="${color}" />
        </g>
        
        <!-- Pata Dianteira que Bate no Chão (Animada!) -->
        <g class="rabbit-paw-animated">
          <path d="M28 50C28 50 25 58 24 64C24 66 22 69 19 69C17 69 16 68 18 66C20 64 22 58 24 50H28Z" fill="${color}" />
          <!-- Marca do impacto na pata -->
          <line x1="16" y1="71" x2="24" y2="71" stroke="${starColor}" stroke-width="2" />
        </g>
      </svg>
    `;
  },

  // Coelho Correndo (Para página 404: "Essa página fugiu. Coelhos são rápidos.")
  rabbitRunning: function(color = "#090F15", starColor = "#4D0C0C", size = 84) {
    return `
      <svg width="${size}" height="${size * 0.6}" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="rabbit-running">
        <!-- Orelhas Inclinadas com a Velocidade -->
        <path d="M46 16C37 14 26 12 18 10C24 16 32 20 40 22C42 20 44 18 46 16Z" fill="${color}" />
        <path d="M50 20C42 19 32 18 24 17C29 22 36 24 44 25C46 23 48 22 50 20Z" fill="${color}" />
        
        <!-- Cabeça Esticada -->
        <path d="M60 22C68 24 74 27 76 31C77 34 74 36 68 36C60 36 53 32 50 27C52 24 56 22 60 22Z" fill="${color}" />
        
        <!-- Estrela Vinho -->
        <polygon points="68,23 69,25.5 71.5,25.5 69.5,27 70.2,29.5 68,28 65.8,29.5 66.5,27 64.5,25.5 67,25.5" fill="${starColor}" />
        
        <!-- Corpo Alongado no Salto -->
        <path d="M32 30C40 26 50 27 58 31C54 39 42 43 32 41C24 39 20 34 26 31C28 30 30 30 32 30Z" fill="${color}" />
        
        <!-- Patas Dianteiras Estendidas -->
        <line x1="62" y1="35" x2="80" y2="44" stroke="${color}" stroke-width="3" stroke-linecap="square" />
        
        <!-- Patas Traseiras no Voo -->
        <line x1="28" y1="38" x2="10" y2="48" stroke="${color}" stroke-width="3.5" stroke-linecap="square" />
        <line x1="26" y1="36" x2="6" y2="42" stroke="${color}" stroke-width="2.5" stroke-linecap="square" />
        
        <!-- Rabinho -->
        <circle cx="21" cy="31" r="3.5" fill="${color}" />
      </svg>
    `;
  },

  // Coelho Dormindo / Descansando (Para Sacola Vazia: "Sua sacola está leve demais.")
  rabbitSleeping: function(color = "#6C6D74", starColor = "#4D0C0C", size = 80) {
    return `
      <svg width="${size}" height="${size * 0.7}" viewBox="0 0 80 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Corpo Encolhido em Curva Suave -->
        <path d="M20 38C16 32 18 22 26 18C36 14 54 15 62 23C70 31 68 44 58 48C46 52 26 50 20 38Z" fill="${color}" />
        <!-- Orelhas Deitadas Sobre as Costas -->
        <path d="M48 20C42 22 34 25 24 25C28 28 36 29 44 28L48 20Z" fill="${color === '#6C6D74' ? '#92949B' : color}" />
        <!-- Focinho Apoiado -->
        <circle cx="56" cy="35" r="7" fill="${color}" />
        <!-- Olhinho Fechado (Linha Curva de Sono) -->
        <path d="M53 35C54 37 57 37 58 35" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" fill="none" />
        <!-- Estrela Vinho -->
        <polygon points="52,29 53,30.5 54.8,30.5 53.3,31.7 53.8,33.5 52,32.3 50.2,33.5 50.7,31.7 49.2,30.5 51,30.5" fill="${starColor}" />
        <!-- Rabinho Pom-pom -->
        <circle cx="17" cy="35" r="4" fill="${color}" />
      </svg>
    `;
  },

  // Ícones do Sistema com Traço Fino de 1.5px (Conforme Diretiva)
  icon: function(name, size = 20, strokeColor = "currentColor") {
    const icons = {
      search: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>`,
      bag: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.5"><path d="M5 8H19L20 21H4L5 8Z"/><path d="M8 8V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V8"/></svg>`,
      user: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.5"><circle cx="12" cy="7" r="4"/><path d="M4 21C4 17.5 7.5 15 12 15C16.5 15 20 17.5 20 21"/></svg>`,
      heart: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.5"><path d="M12 20.5L3.8 12.3C1.4 9.9 1.4 6 3.8 3.6C6.2 1.2 10.1 1.2 12.5 3.6L12 4.1L11.5 3.6C13.9 1.2 17.8 1.2 20.2 3.6C22.6 6 22.6 9.9 20.2 12.3L12 20.5Z"/></svg>`,
      close: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
      arrowRight: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.5"><line x1="4" y1="12" x2="20" y2="12"/><polyline points="14 6 20 12 14 18"/></svg>`,
      arrowLeft: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.5"><line x1="20" y1="12" x2="4" y2="12"/><polyline points="10 18 4 12 10 6"/></svg>`,
      check: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
      ruler: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.5"><path d="M3 17L17 3L21 7L7 21L3 17Z"/><line x1="7.5" y1="6.5" x2="9" y2="8"/><line x1="10.5" y1="9.5" x2="13" y2="12"/><line x1="13.5" y1="12.5" x2="15" y2="14"/></svg>`,
      scissors: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.5"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="8.5" y1="7.5" x2="20" y2="19"/><line x1="8.5" y1="16.5" x2="20" y2="5"/></svg>`,
      leaf: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.5"><path d="M12 21C12 21 4 17 4 9C4 4 9 3 12 3C15 3 20 4 20 9C20 17 12 21 12 21Z"/><line x1="12" y1="3" x2="12" y2="21"/></svg>`,
      truck: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.5"><rect x="1" y="5" width="14" height="11"/><polygon points="15 8 19 8 22 11 22 16 15 16 15 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
      shield: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.5"><path d="M12 2L4 6V11C4 16.5 7.5 20.7 12 22C16.5 20.7 20 16.5 20 11V6L12 2Z"/></svg>`,
      printer: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.5"><polyline points="6 9 6 3 18 3 18 9"/><path d="M6 18H4C2.9 18 2 17.1 2 16V11C2 9.9 2.9 9 4 9H20C21.1 9 22 9.9 22 11V16C22 17.1 21.1 18 20 18H18"/><rect x="6" y="14" width="12" height="7"/></svg>`,
      menu: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.5"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>`,
      whatsapp: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`
    };
    return icons[name] || '';
  }
};

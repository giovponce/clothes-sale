import fs from 'fs';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'public', 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Icon path data for different clothing types to render clean minimalist illustrations
const PATHS = {
  coat: '<path d="M12 4v16M8 4h8M8 4l-4 4v12h16V8l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M4 8h16M10 12h4M10 16h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  jacket: '<path d="M12 4v16M6 4h12l2 6v10H4V10l2-6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M12 8l-3 3M12 12l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  dress: '<path d="M9 4h6l4 3-2 13H7L5 7l4-3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M9 4c0 2 6 2 6 0M7 7h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  pants: '<path d="M8 4h8l3 16h-5l-2-8-2 8H5L8 4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M8 8h8" stroke="currentColor" stroke-width="1.5"/>',
  sweater: '<path d="M9 4h6l5 3-1 4-2-1v10H7V10L5 11l-1-4 5-3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M9 4v3m6-3v3M7 14h10M7 17h10" stroke="currentColor" stroke-width="1.5"/>',
  shirt: '<path d="M9 4h6l5 2-1 5-3-1v10H8V10L5 11l-1-5 5-2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M9 4l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  shoes: '<path d="M4 16h14l2-4-3-3-4 1-3-3H6L4 16z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M11 11h4M6 13h2" stroke="currentColor" stroke-width="1.5"/>',
  bag: '<rect x="5" y="9" width="14" height="11" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M9 9V6a3 3 0 016 0v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  beanie: '<path d="M12 4a6 6 0 016 6v6H6v-6a6 6 0 016-6z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M5 16h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2a1 1 0 011-1z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="3" r="1" stroke="currentColor" fill="currentColor"/>'
};

const itemsData = [
  { name: "abrigo-lana-1.svg", type: "coat", bg: "#E6DAC1", color: "#5C8362", text: "Abrigo Lana - Vista Frontal" },
  { name: "abrigo-lana-2.svg", type: "coat", bg: "#D4C1A0", color: "#47684C", text: "Abrigo Lana - Detalle Cuello" },
  { name: "chaqueta-patagonia-1.svg", type: "jacket", bg: "#7DA182", color: "#FAF8F5", text: "Cortavientos Patagonia" },
  { name: "vestido-lino-1.svg", type: "dress", bg: "#FAF8F5", color: "#B18B5F", text: "Vestido Lino - Vista Frontal" },
  { name: "vestido-lino-2.svg", type: "dress", bg: "#F3EDD7", color: "#A17650", text: "Vestido Lino - Espalda" },
  { name: "vestido-lino-3.svg", type: "dress", bg: "#FAF8F5", color: "#D4C1A0", text: "Vestido Lino - Detalle Tela" },
  { name: "jeans-levis-1.svg", type: "pants", bg: "#304433", color: "#E6DAC1", text: "Jeans Levi's 501" },
  { name: "jersey-mango-1.svg", type: "sweater", bg: "#C1A47D", color: "#FAF8F5", text: "Jersey Terracota" },
  { name: "jersey-mango-2.svg", type: "sweater", bg: "#FAF8F5", color: "#C1A47D", text: "Jersey - Textura Punto" },
  { name: "camisa-uniqlo-1.svg", type: "shirt", bg: "#FAF8F5", color: "#5C8362", text: "Camisa Oxford Blanca" },
  { name: "sandalias-birkenstock-1.svg", type: "shoes", bg: "#E6DAC1", color: "#5B3E30", text: "Sandalias Birkenstock" },
  { name: "bolso-zara-1.svg", type: "bag", bg: "#29392c", color: "#FAF8F5", text: "Bolso Baguette Zara" },
  { name: "pantalon-cargo-1.svg", type: "pants", bg: "#7DA182", color: "#FAF8F5", text: "Cargo Verde Olivo" },
  { name: "gorro-patagonia-1.svg", type: "beanie", bg: "#D4C1A0", color: "#865D41", text: "Gorro Patagonia Mostaza" }
];

itemsData.forEach(item => {
  const filePath = path.join(imagesDir, item.name);
  const svgContent = `
<svg width="600" height="800" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo con degradado sutil de estilo tierra -->
  <defs>
    <linearGradient id="grad-${item.name.replace('.svg', '')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${item.bg}" />
      <stop offset="100%" stop-color="${adjustBrightness(item.bg, -10)}" />
    </linearGradient>
  </defs>
  
  <rect width="100%" height="100%" fill="url(#grad-${item.name.replace('.svg', '')})" />
  
  <!-- Patrón de fondo muy sutil (cuadrícula orgánica) -->
  <g opacity="0.05" stroke="${item.color}" stroke-width="1">
    <path d="M 50,0 V 800 M 150,0 V 800 M 250,0 V 800 M 350,0 V 800 M 450,0 V 800 M 550,0 V 800" />
    <path d="M 0,100 H 600 M 0,200 H 600 M 0,300 H 600 M 0,400 H 600 M 0,500 H 600 M 0,600 H 600 M 0,700 H 600" />
  </g>

  <!-- Círculo decorativo en el centro -->
  <circle cx="300" cy="380" r="160" fill="none" stroke="${item.color}" stroke-width="1" stroke-dasharray="5,5" opacity="0.3" />
  <circle cx="300" cy="380" r="140" fill="${item.color}" opacity="0.05" />

  <!-- Ilustración del Item -->
  <g transform="translate(180, 260) scale(10)" stroke="${item.color}" color="${item.color}">
    ${PATHS[item.type] || PATHS.shirt}
  </g>

  <!-- Tarjeta de Texto o Sello -->
  <g transform="translate(300, 640)">
    <!-- Etiqueta minimalista -->
    <rect x="-180" y="0" width="360" height="70" rx="35" fill="#FAF8F5" fill-opacity="0.9" stroke="${item.color}" stroke-width="1.5" />
    <text x="0" y="32" font-family="system-ui, sans-serif" font-size="14" font-weight="600" letter-spacing="1.5" fill="#2D2A26" text-anchor="middle" dominant-baseline="middle">
      ${item.text.toUpperCase()}
    </text>
    <text x="0" y="48" font-family="system-ui, sans-serif" font-size="10" font-weight="400" letter-spacing="2" fill="${item.color}" text-anchor="middle" dominant-baseline="middle" opacity="0.8">
      PRENDA SELECCIONADA
    </text>
  </g>

  <!-- Detalle decorativo de esquina (Venta de Garage) -->
  <text x="30" y="50" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="${item.color}" letter-spacing="2" opacity="0.6">CLOSET SALE</text>
  <line x1="30" y1="60" x2="150" y2="60" stroke="${item.color}" stroke-width="1" opacity="0.4" />
</svg>
`;

  fs.writeFileSync(filePath, svgContent.trim());
  console.log(`Generated SVG: ${item.name}`);
});

// Helper to darken colors for gradients
function adjustBrightness(hex, percent) {
  let R = parseInt(hex.substring(1, 3), 16);
  let G = parseInt(hex.substring(3, 5), 16);
  let B = parseInt(hex.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  R = (R > 0) ? R : 0;
  G = (G > 0) ? G : 0;
  B = (B > 0) ? B : 0;

  const rHex = R.toString(16).padStart(2, '0');
  const gHex = G.toString(16).padStart(2, '0');
  const bHex = B.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

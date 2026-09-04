// Nuvela · Italian Design — Premium Mattress Site
// Single-file React component (App.jsx) — bilingual ES/EN
//
// Requirements (paste into Vite/CRA/Next.js project):
//   1. React 18+
//   2. Tailwind CSS configured (utility classes used throughout)
//   3. Google Fonts: Marcellus + Jost (loaded via @import in <style> below)
//
// Brand palette: Gold #B8963E · Cream #FAF8F3 · Graphite #3D3D3D · Ink #1A1A1A
// Tagline: "Duerme Bien Siempre."

import React, { useState, useEffect, useRef } from 'react';

/* =================== Helper Components =================== */

function GoldRule({ center = false, className = '' }) {
  return (
    <span
      className={`block ${className}`}
      style={{
        width: 64,
        height: 1,
        background: '#B8963E',
        marginLeft: center ? 'auto' : 0,
        marginRight: center ? 'auto' : 0,
      }}
    />
  );
}

function Eyebrow({ children, light = false, className = '' }) {
  return (
    <p
      className={className}
      style={{
        fontFamily: 'Jost, sans-serif',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.32em',
        fontSize: '0.72rem',
        color: light ? '#D4B665' : '#B8963E',
      }}
    >
      {children}
    </p>
  );
}

function FaqItem({ id, q, a, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <div className="faq-q" onClick={() => onToggle(id)}>
        <span className="font-serif text-lg text-ink">{q}</span>
        <span className="icon">+</span>
      </div>
      <div className="faq-a">
        <div className="faq-a-inner">{a}</div>
      </div>
    </div>
  );
}

function Layer({ num, title, dim, ml = 0, dark = false }) {
  const bg = dark ? 'bg-graphite text-white' : 'bg-pearl-tinted border border-pearl';
  return (
    <div
      className={`layer flex items-center justify-between p-5 ${bg}`}
      style={{ marginLeft: ml }}
    >
      <div>
        <p className={`eyebrow ${dark ? 'text-gold-light' : 'text-gold'}`}>{num}</p>
        <p className={`font-serif text-lg mt-1 ${dark ? '' : 'text-ink'}`}>{title}</p>
      </div>
      <span className={`text-xs tracking-[0.2em] uppercase ${dark ? 'text-white/60' : 'text-mist'}`}>{dim}</span>
    </div>
  );
}

/* =================== Product catalog data =================== */
// Everything the "Productos" tab, the product detail page and the "Precios"
// page show comes from THIS array (kept identical to the PRODUCTS array in
// the static index.html so both files stay in sync). To add a new product,
// copy one of the objects below and change its values.
//
// IMAGES: paths are relative "images/..." the same way index.html uses them.
// This project doesn't have a Vite/build setup yet, so once one exists these
// will likely need to move under a "public/images" folder — ask Claude to
// adjust the paths at that point.
const PRODUCTS = [
  {
    id: 'nuvela-clasico',
    category: { es: 'Colchones', en: 'Mattresses' },
    name: { es: 'Colchón Nuvela', en: 'Nuvela Mattress' },
    eyebrow: { es: 'Colchón Premium', en: 'Premium Mattress' },
    tagline: { es: 'Resortes Encapsulados · Memory Foam · 30 cm', en: 'Encapsulated Springs · Memory Foam · 30 cm' },
    cardText: {
      es: 'El clásico de Nuvela: resortes encapsulados, memory foam multidensidad y tela de enfriamiento en una construcción de 30 cm.',
      en: 'The Nuvela classic: encapsulated springs, multi-density memory foam and cooling fabric in a 30 cm build.'
    },
    description: {
      es: 'El colchón Nuvela combina resortes encapsulados individuales con memory foam multidensidad y una tela superior de enfriamiento. El resultado es una superficie de descanso que se moldea, sostiene y respira — diseñada para ofrecerte el descanso más profundo de tu vida, cada noche.',
      en: 'The Nuvela mattress combines individually encapsulated springs with multi-density memory foam and a cooling top fabric. The result is a sleep surface that contours, supports and breathes — engineered to deliver the deepest rest of your life, every night.'
    },
    mainImage: 'images/colchon.png',
    gallery: ['images/colchon.png', 'images/zipper.png', 'images/detalle.png', 'images/estructura.png', 'images/base.png'],
    stats: [
      { value: '7/10', label: { es: 'Firmeza', en: 'Firmness' } },
      { value: { es: 'Resortes Encapsulados + Memory Foam', en: 'Encapsulated Springs + Memory Foam' }, label: { es: 'Relleno', en: 'Fill' } },
      { value: 'Memory Foam', label: { es: 'Material', en: 'Material' } },
      { value: { es: 'Ice Cooling Fabric Desfundable', en: 'Ice Cooling Fabric (Removable Cover)' }, label: { es: 'Tela', en: 'Fabric' } },
      { value: '30 cm', label: { es: 'Altura', en: 'Height' } },
      { value: '5', label: { es: 'Capas', en: 'Layers' } },
      { value: { es: 'No', en: 'No' }, label: { es: 'Impermeable', en: 'Waterproof' } },
      { value: '10y', label: { es: 'Garantía', en: 'Warranty' } },
    ],
    variants: [
      { name: 'Imperial', detail: { es: '0.97 × 1.91 m · 364 resortes encapsulados', en: '0.97 × 1.91 m · 364 encapsulated springs' }, price: 4900 },
      { name: 'Matrimonial', detail: { es: '1.37 × 1.91 m · 560 resortes encapsulados', en: '1.37 × 1.91 m · 560 encapsulated springs' }, price: 5900 },
      { name: 'Queen', detail: { es: '1.52 × 2.03 m · 660 resortes encapsulados', en: '1.52 × 2.03 m · 660 encapsulated springs' }, price: 6900, featured: true },
      { name: 'King', detail: { es: '1.93 × 2.03 m · 840 resortes encapsulados', en: '1.93 × 2.03 m · 840 encapsulated springs' }, price: 7900 },
    ],
    benefits: [
      { title: { es: 'Alivio de Presión', en: 'Pressure Relief' }, text: { es: 'El memory foam moldea la columna y dispersa los puntos de presión.', en: 'Memory foam contours the spine and disperses pressure points.' } },
      { title: { es: 'Balance Térmico', en: 'Thermal Balance' }, text: { es: 'La tela de enfriamiento y el gel mantienen la temperatura estable toda la noche.', en: 'Cooling fabric and gel infusions keep temperature steady all night.' } },
      { title: { es: 'Aislamiento de Movimiento', en: 'Motion Isolation' }, text: { es: 'Los resortes encapsulados responden de forma independiente — sin movimiento de pareja.', en: 'Encapsulated springs respond independently — no partner disturbance.' } },
      { title: { es: 'Soporte Postural', en: 'Postural Support' }, text: { es: 'La espuma 40D alinea el cuerpo y sostiene la postura natural del descanso.', en: '40D foam aligns the body and supports natural sleep posture.' } },
    ],
    faqs: [
      { q: { es: '¿Qué firmeza tiene el colchón Nuvela?', en: 'How firm is the Nuvela mattress?' }, a: { es: 'El colchón Nuvela ofrece doble firmeza para adaptarse a distintas preferencias de descanso.', en: 'The Nuvela mattress offers dual firmness to suit different sleep preferences.' } },
      { q: { es: '¿Cuánto tarda el envío?', en: 'How long does shipping take?' }, a: { es: 'Zona metropolitana: 3–5 días hábiles. Departamentos: 5–10 días hábiles.', en: 'Metropolitan zone: 3–5 business days. Departments: 5–10 business days.' } },
      { q: { es: '¿Qué garantía tiene?', en: 'What warranty does it have?' }, a: { es: '10 años de garantía por defectos de fabricación.', en: '10-year warranty against manufacturing defects.' } },
      { q: { es: '¿El pillow top se puede desfundar para lavarlo?', en: 'Can the pillow top cover be removed for washing?' }, a: { es: 'Sí, el pillow top es desfundable.', en: 'Yes, the pillow top cover is removable.' } },
    ],
  },
  {
    id: 'nuvela-hotel',
    category: { es: 'Colchones', en: 'Mattresses' },
    name: { es: 'Nuvela Hotel', en: 'Nuvela Hotel' },
    eyebrow: { es: 'Colchón Nuvela Hotel', en: 'Nuvela Hotel Mattress' },
    tagline: { es: 'Resortes Encapsulados · Espuma Alta Densidad · 35 cm', en: 'Encapsulated Springs · High-Density Foam · 35 cm' },
    cardText: {
      es: 'Diseñado para hotelería y Airbnb: soporte uniforme, pillow top acolchado y estructura reforzada para uso frecuente.',
      en: 'Built for hotels and Airbnb: even support, a cushioned pillow top and a reinforced structure for frequent use.'
    },
    description: {
      es: 'El colchón Nuvela Hotel está diseñado para ofrecer una experiencia de descanso premium, resistente y confortable para huéspedes exigentes. Su tecnología híbrida combina resortes encapsulados independientes, que reducen la transferencia de movimiento y brindan soporte uniforme, con capas de espuma de alta densidad que se adaptan al cuerpo sin perder firmeza. Cuenta con pillow top acolchado, tela fresca al tacto y estructura reforzada para un uso frecuente.',
      en: 'The Nuvela Hotel mattress is designed to deliver a premium, durable and comfortable sleep experience for demanding guests. Its hybrid technology combines independent encapsulated springs — which reduce motion transfer and provide even support — with high-density foam layers that contour to the body without losing firmness. It features a cushioned pillow top, cool-to-the-touch fabric and a reinforced structure built for frequent use.'
    },
    mainImage: 'images/nuvela-hotel-principal.png',
    gallery: [
      'images/nuvela-hotel-principal.png',
      'images/nuvela-hotel-vista-2.png',
      'images/nuvela-hotel-vista-3.png',
      'images/nuvela-hotel-vista-4.png',
    ],
    stats: [
      { value: '6/10', label: { es: 'Firmeza', en: 'Firmness' } },
      { value: { es: 'Resortes Encapsulados + Memory Foam', en: 'Encapsulated Springs + Memory Foam' }, label: { es: 'Relleno', en: 'Fill' } },
      { value: 'Memory Foam', label: { es: 'Material', en: 'Material' } },
      { value: { es: 'Ice Cooling Fabric No Desfundable', en: 'Ice Cooling Fabric (Fixed Cover)' }, label: { es: 'Tela', en: 'Fabric' } },
      { value: '35 cm', label: { es: 'Altura', en: 'Height' } },
      { value: '5', label: { es: 'Capas', en: 'Layers' } },
      { value: { es: 'No', en: 'No' }, label: { es: 'Impermeable', en: 'Waterproof' } },
      { value: '10y', label: { es: 'Garantía', en: 'Warranty' } },
    ],
    variants: [
      { name: 'Imperial', detail: { es: '0.97 × 1.91 m · 364 resortes encapsulados', en: '0.97 × 1.91 m · 364 encapsulated springs' }, price: 5900 },
      { name: 'Matrimonial', detail: { es: '1.37 × 1.91 m · 560 resortes encapsulados', en: '1.37 × 1.91 m · 560 encapsulated springs' }, price: 6900 },
      { name: 'Queen', detail: { es: '1.52 × 2.03 m · 660 resortes encapsulados', en: '1.52 × 2.03 m · 660 encapsulated springs' }, price: 7900, featured: true },
      { name: 'King', detail: { es: '1.93 × 2.03 m · 840 resortes encapsulados', en: '1.93 × 2.03 m · 840 encapsulated springs' }, price: 8900 },
    ],
    benefits: [
      { title: { es: 'Soporte Personalizado', en: 'Personalized Support' }, text: { es: 'Sus resortes encapsulados se adaptan al cuerpo y reducen la transferencia de movimiento.', en: 'Encapsulated springs contour to the body and reduce motion transfer.' } },
      { title: { es: 'Mayor Confort', en: 'Greater Comfort' }, text: { es: 'Combina espumas de alta densidad con pillow top para una sensación cómoda y equilibrada.', en: 'High-density foams combine with a pillow top for a comfortable, balanced feel.' } },
      { title: { es: 'Descanso Más Fresco', en: 'Cooler Sleep' }, text: { es: 'Su tela superior ayuda a mantener una sensación agradable durante la noche.', en: 'The top fabric helps maintain a pleasant feel throughout the night.' } },
      { title: { es: 'Hecho Para Durar', en: 'Built to Last' }, text: { es: 'Estructura reforzada y materiales premium, respaldados por 10 años de garantía.', en: 'Reinforced structure and premium materials, backed by a 10-year warranty.' } },
    ],
    faqs: [],
  },
  {
    // Precio real Q550 confirmado por Eduardo — se muestra "Próximamente"
    // (price: 0) hasta que las fotos estén listas. Cambia price a 550
    // en la variante de abajo cuando quieras publicarlo.
    id: 'almohada-memory-foam-1',
    category: { es: 'Almohadas', en: 'Pillows' },
    name: { es: 'Ariana', en: 'Ariana' },
    eyebrow: { es: 'Almohada', en: 'Pillow' },
    tagline: { es: 'Memory foam de doble capa · Densidad 50D', en: 'Double-layer memory foam · 50D density' },
    cardText: { es: 'Almohada 100% memory foam de doble capa, densidad 50D, con funda exterior tipo malla y cierre.', en: 'Double-layer 100% memory foam pillow, 50D density, with a zip mesh outer cover.' },
    description: { es: '', en: '' },
    mainImage: 'images/almohada-memoryfoam-1-principal.png',
    gallery: ['images/almohada-memoryfoam-1-principal.png', 'images/almohada-memoryfoam-1-vista-2.png'],
    stats: [
      { value: '50D', label: { es: 'Densidad', en: 'Density' } },
      { value: { es: 'Memory foam de doble capa', en: 'Double-layer memory foam' }, label: { es: 'Material', en: 'Material' } },
      { value: '40 x 70 x 10 cm', label: { es: 'Medidas', en: 'Dimensions' } },
    ],
    variants: [
      { name: 'Estándar', detail: { es: '40 x 70 x 10 cm', en: '40 x 70 x 10 cm' }, price: 0 },
    ],
    benefits: [],
    faqs: [],
  },
  {
    // Precio real Q550 confirmado por Eduardo — se muestra "Próximamente"
    // (price: 0) hasta que las fotos estén listas. Cambia price a 550
    // en la variante de abajo cuando quieras publicarlo.
    id: 'almohada-memory-foam-2',
    category: { es: 'Almohadas', en: 'Pillows' },
    name: { es: 'Amanda', en: 'Amanda' },
    eyebrow: { es: 'Almohada', en: 'Pillow' },
    tagline: { es: 'Memory foam hidrofílico · Densidad 75–80D', en: 'Hydrophilic memory foam · 75–80D density' },
    cardText: { es: 'Almohada de memory foam hidrofílico, densidad 75–80D, con funda exterior tipo malla y cierre.', en: 'Hydrophilic memory foam pillow, 75–80D density, with a zip mesh outer cover.' },
    description: { es: '', en: '' },
    // Placeholder: usa el logo mientras Eduardo sube las fotos reales del
    // producto. Cambia mainImage/gallery a los archivos reales cuando los
    // tengas listos.
    mainImage: 'images/logosinfondo.png',
    gallery: ['images/logosinfondo.png'],
    stats: [
      { value: '75–80D', label: { es: 'Densidad', en: 'Density' } },
      { value: { es: 'Memory foam hidrofílico', en: 'Hydrophilic memory foam' }, label: { es: 'Material', en: 'Material' } },
      { value: '40 x 70 x 12 cm', label: { es: 'Medidas', en: 'Dimensions' } },
    ],
    variants: [
      { name: 'Estándar', detail: { es: '40 x 70 x 12 cm', en: '40 x 70 x 12 cm' }, price: 0 },
    ],
    benefits: [],
    faqs: [],
  },
  {
    // Precio real Q600 confirmado por Eduardo — se muestra "Próximamente"
    // (price: 0) hasta que las fotos estén listas. Cambia price a 600
    // en la variante de abajo cuando quieras publicarlo.
    id: 'almohada-plumas',
    category: { es: 'Almohadas', en: 'Pillows' },
    name: { es: 'Almohada de Plumas', en: 'Feather-Style Pillow' },
    eyebrow: { es: 'Almohada', en: 'Pillow' },
    tagline: { es: 'Núcleo para hotelería · Relleno de microfibra 1000 g', en: 'Hotel-grade core · 1000g microfiber fill' },
    cardText: { es: 'Núcleo de almohada para hotelería con relleno de microfibra de 1000 gramos y funda 100% de algodón.', en: 'Hotel-grade pillow core with 1000-gram microfiber filling and a 100% cotton fabric cover.' },
    description: { es: '', en: '' },
    // Placeholder: usa el logo mientras Eduardo sube las fotos reales del
    // producto. Cambia mainImage/gallery a los archivos reales cuando los
    // tengas listos.
    mainImage: 'images/logosinfondo.png',
    gallery: ['images/logosinfondo.png'],
    stats: [
      { value: '1000 g', label: { es: 'Relleno (microfibra)', en: 'Fill (microfiber)' } },
      { value: { es: '100% algodón', en: '100% cotton' }, label: { es: 'Tela', en: 'Fabric' } },
      { value: '40 x 74 cm', label: { es: 'Medidas', en: 'Dimensions' } },
    ],
    variants: [
      { name: 'Estándar', detail: { es: '40 x 74 cm', en: '40 x 74 cm' }, price: 0 },
    ],
    benefits: [],
    faqs: [],
  },
  {
    id: 'duvet-nuvela',
    category: { es: 'Accesorios para Cama', en: 'Bed Accessories' },
    name: { es: 'Duvet Nuvela', en: 'Nuvela Duvet' },
    eyebrow: { es: 'Duvet', en: 'Duvet' },
    tagline: { es: '', en: '' },
    cardText: { es: 'Disponible en tamaño Queen (180 x 220 cm) y King (220 x 240 cm).', en: 'Available in Queen (180 x 220 cm) and King (220 x 240 cm) sizes.' },
    description: { es: '', en: '' },
    mainImage: 'images/duvet-principal.png',
    gallery: ['images/duvet-principal.png', 'images/duvet-vista-2.png'],
    stats: [],
    variants: [
      { name: 'Queen', detail: { es: '180 x 220 cm', en: '180 x 220 cm' }, price: 1890 },
      { name: 'King', detail: { es: '220 x 240 cm', en: '220 x 240 cm' }, price: 2250 },
    ],
    benefits: [],
    faqs: [],
  },
  {
    // Solo Queen y King por ahora (Eduardo no dio medidas de Imperial ni
    // Matrimonial para el protector) — agrega esas variantes si luego
    // las confirma.
    id: 'protector-colchon',
    category: { es: 'Accesorios para Cama', en: 'Bed Accessories' },
    name: { es: 'Cobertor / Protector de Colchón', en: 'Mattress Protector' },
    eyebrow: { es: 'Protector', en: 'Protector' },
    tagline: { es: '', en: '' },
    cardText: { es: 'Disponible en tamaño Queen (153 x 203 x 30 cm) y King (193 x 203 x 30 cm). Precio próximamente.', en: 'Available in Queen (153 x 203 x 30 cm) and King (193 x 203 x 30 cm) sizes. Price coming soon.' },
    description: { es: '', en: '' },
    // Placeholder: usa el logo mientras Eduardo sube las fotos reales del
    // producto. Cambia mainImage/gallery a los archivos reales cuando los
    // tengas listos.
    mainImage: 'images/logosinfondo.png',
    gallery: ['images/logosinfondo.png'],
    stats: [],
    variants: [
      { name: 'Queen', detail: { es: '153 x 203 x 30 cm', en: '153 x 203 x 30 cm' }, price: 0 },
      { name: 'King', detail: { es: '193 x 203 x 30 cm', en: '193 x 203 x 30 cm' }, price: 0 },
    ],
    benefits: [],
    faqs: [],
  },
  {
    id: 'camastron-nuvela',
    category: { es: 'Camastrones', en: 'Loungers' },
    name: { es: 'Olivia Bed', en: 'Olivia Bed' },
    eyebrow: { es: 'Camastrón', en: 'Lounger' },
    tagline: { es: 'Camastrón de madera de Conacaste · Bajo pedido', en: 'Conacaste wood lounger · Made to order' },
    cardText: { es: 'Camastrón de madera de Conacaste, hecho bajo pedido. Disponible en Queen y King.', en: 'Conacaste wood lounger, made to order. Available in Queen and King.' },
    description: { es: '', en: '' },
    mainImage: 'images/oliviabed1.png',
    gallery: ['images/oliviabed1.png', 'images/oliviabed2.png', 'images/oliviabed3.png'],
    stats: [
      { value: { es: 'Madera de Conacaste', en: 'Conacaste wood' }, label: { es: 'Material', en: 'Material' } },
      { value: { es: 'Bajo pedido', en: 'Made to order' }, label: { es: 'Disponibilidad', en: 'Availability' } },
    ],
    variants: [
      { name: 'Queen', detail: { es: '178 cm ancho x 221 cm largo x 94 cm alto', en: '178 cm wide x 221 cm long x 94 cm high' }, price: 9900 },
      { name: 'King', detail: { es: '216 cm ancho x 221 cm largo x 94 cm alto', en: '216 cm wide x 221 cm long x 94 cm high' }, price: 12900 },
    ],
    benefits: [],
    faqs: [],
  },
];

function getCategories() {
  const seen = new Map();
  PRODUCTS.forEach((p) => { if (!seen.has(p.category.es)) seen.set(p.category.es, p.category); });
  return Array.from(seen.values());
}
// Línea Hotelera: mattresses, pillows, bed accessories (duvets/protectors) and loungers.
const HOTEL_CATEGORIES = ['Colchones', 'Almohadas', 'Accesorios para Cama', 'Camastrones'];

// Each product's pricing block gets its own HD texture background so the
// sections read as separate segments instead of one repeated tile image.
// ⚠️ EDUARDO: si prefieres usar tus propias fotos de textura en vez de las
// generadas, solo reemplaza el archivo en images/ (mismo nombre) o cambia
// la ruta aquí abajo.
const PRODUCT_TEXTURES = {
  'nuvela-clasico': 'images/textura-colchon-nuvela.jpg',
  'nuvela-hotel': 'images/textura-nuvela-hotel.jpg',
  'almohada-memory-foam-1': 'images/textura-almohada-memoryfoam-1.jpg',
  'almohada-memory-foam-2': 'images/textura-almohada-memoryfoam-2.jpg',
  'almohada-plumas': 'images/textura-almohada-plumas.jpg',
  'duvet-nuvela': 'images/textura-duvet-nuvela.jpg',
  'protector-colchon': 'images/textura-protector-colchon.jpg',
  'camastron-nuvela': 'images/textura-camastron.jpg',
};
function priceFrom(product) {
  const priced = product.variants.filter((v) => v.price);
  if (!priced.length) return null;
  return Math.min(...priced.map((v) => v.price));
}

// Comparar Productos: looks a stat up by its label.es, which works as an
// internal key regardless of the current display language. Returns the raw
// stat value (string, or {es,en} for a bilingual value) — call statVal() on
// it (inside the component, where `pick`/lang are available) to display it.
function getStat(p, labelEs) {
  const s = (p.stats || []).find((st) => st.label && st.label.es === labelEs);
  return s ? s.value : '–';
}

/* =================== Main App =================== */

export default function App() {
  const [lang, setLang] = useState(() =>
    typeof window !== 'undefined' ? (localStorage.getItem('nuvela-lang') || 'es') : 'es'
  );
  const [page, setPage] = useState('home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openFaqs, setOpenFaqs] = useState({});
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [activeThumb, setActiveThumb] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  // Comparar Productos: which size/variant is "in view" per product, for
  // products that come in multiple sizes (e.g. mattresses) — productId -> variant name.
  const [compareSizeSelection, setCompareSizeSelection] = useState({});

  const t = (es, en) => (lang === 'es' ? es : en);
  const pick = (field) => (field ? t(field.es, field.en) : '');
  const statVal = (v) => (v && typeof v === 'object' ? pick(v) : v);
  const formatPrice = (price) => (price ? `Q${price.toLocaleString('en-US')}` : t('Próximamente', 'Coming soon'));
  const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId) || null;
  const visibleProducts = activeCategory === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category.es === activeCategory);
  const hotelProducts = PRODUCTS.filter((p) => HOTEL_CATEGORIES.includes(p.category.es));

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      const p = PRODUCTS.find((x) => x.id === id);
      if (p && p.variants && p.variants.length > 1) {
        setCompareSizeSelection((sel) => (sel[id] ? sel : { ...sel, [id]: (p.variants.find((v) => v.featured) || p.variants[0]).name }));
      }
      return [...prev, id];
    });
  };
  const removeCompare = (id) => setCompareIds((prev) => prev.filter((x) => x !== id));
  const setCompareSize = (id, sizeName) => setCompareSizeSelection((prev) => ({ ...prev, [id]: sizeName }));

  // The variant "in view" for a product inside the comparison table — the one
  // the shopper picked with the size selector, or the featured/first one.
  const compareVariant = (p) => {
    if (!p.variants || !p.variants.length) return null;
    const chosen = compareSizeSelection[p.id];
    return p.variants.find((v) => v.name === chosen) || p.variants.find((v) => v.featured) || p.variants[0];
  };
  const compareMeasure = (p) => {
    const v = compareVariant(p);
    if (!v) return getStat(p, 'Medidas');
    const detail = pick(v.detail);
    return detail ? detail.split(' · ')[0] : '–';
  };
  const comparePrice = (p) => {
    const v = compareVariant(p);
    return v ? formatPrice(v.price) : formatPrice(priceFrom(p));
  };
  // Spring count lives inside the variant detail string (e.g. "1.52 × 2.03 m ·
  // 660 resortes encapsulados"), right after the measurement — same size
  // selector the shopper already used for "Medidas".
  const compareSprings = (p) => {
    const v = compareVariant(p);
    if (!v) return '–';
    const detail = pick(v.detail);
    const parts = detail ? detail.split(' · ') : [];
    return parts.length > 1 ? parts[1] : '–';
  };

  // Comparar Productos: master list of spec rows. Each row knows how to read
  // its own value from a product; missing specs fall back to "–".
  const SPEC_ROWS = [
    { es: 'Precio', en: 'Price', price: true, get: (p) => comparePrice(p) },
    { es: 'Categoría', en: 'Category', get: (p) => pick(p.category) },
    { es: 'Medidas', en: 'Dimensions', get: (p) => compareMeasure(p) },
    { es: 'Resortes', en: 'Springs', get: (p) => compareSprings(p) },
    { es: 'Firmeza', en: 'Firmness', get: (p) => statVal(getStat(p, 'Firmeza')) },
    { es: 'Relleno', en: 'Fill', get: (p) => statVal(getStat(p, 'Relleno')) },
    { es: 'Material', en: 'Material', get: (p) => statVal(getStat(p, 'Material')) },
    { es: 'Tela', en: 'Fabric', get: (p) => statVal(getStat(p, 'Tela')) },
    { es: 'Altura', en: 'Height', get: (p) => statVal(getStat(p, 'Altura')) },
    { es: 'Capas', en: 'Layers', get: (p) => statVal(getStat(p, 'Capas')) },
    { es: 'Impermeable', en: 'Waterproof', get: (p) => statVal(getStat(p, 'Impermeable')) },
    { es: 'Garantía', en: 'Warranty', get: (p) => statVal(getStat(p, 'Garantía')) },
    { es: 'Presentaciones', en: 'Available sizes', get: (p) => (p.variants && p.variants.length ? p.variants.map((v) => v.name).join(' · ') : '–') },
  ];
  const compareProducts = compareIds.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);

  // ==== Carrito de compras ====
  const WHATSAPP_NUMBER = '50259661383';
  const [cart, setCart] = useState([]); // { productId, variantName, qty }[]

  const cartLine = (entry) => {
    const p = PRODUCTS.find((x) => x.id === entry.productId);
    if (!p) return null;
    const v = (p.variants || []).find((x) => x.name === entry.variantName) || p.variants[0];
    if (!v) return null;
    return { p, v, qty: entry.qty };
  };
  const cartCount = () => cart.reduce((sum, e) => sum + e.qty, 0);
  const cartTotal = () =>
    cart.reduce((sum, e) => {
      const line = cartLine(e);
      if (!line || !line.v.price) return sum;
      return sum + line.v.price * line.qty;
    }, 0);

  const addToCart = (productId, variantName, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((e) => e.productId === productId && e.variantName === variantName);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { productId, variantName, qty }];
    });
  };
  const removeFromCart = (productId, variantName) =>
    setCart((prev) => prev.filter((e) => !(e.productId === productId && e.variantName === variantName)));
  const setCartQty = (productId, variantName, qty) => {
    if (qty <= 0) { removeFromCart(productId, variantName); return; }
    setCart((prev) => prev.map((e) => (e.productId === productId && e.variantName === variantName ? { ...e, qty } : e)));
  };

  // Checkout: customer/billing/shipping details + installment plan.
  const CUOTA_OPTIONS = [1, 3, 6, 9, 12];
  const [checkoutForm, setCheckoutForm] = useState({
    nombre: '', telefono: '', facturaNombre: '', nit: '', direccionFactura: '', direccionEntrega: '', cuotas: 1,
  });
  const [checkoutError, setCheckoutError] = useState('');
  const updateCheckoutField = (key, value) => {
    setCheckoutForm((prev) => ({ ...prev, [key]: value }));
    if (checkoutError) setCheckoutError('');
  };
  const installmentAmount = (total, cuotas) => (cuotas > 1 ? Math.ceil(total / cuotas) : total);
  const paymentSummaryText = () => {
    const total = cartTotal();
    const n = checkoutForm.cuotas;
    if (n <= 1) return t(`Pago de contado — ${formatPrice(total)}`, `One-time payment — ${formatPrice(total)}`);
    const per = installmentAmount(total, n);
    return t(`${n} cuotas de ${formatPrice(per)} c/u (total ${formatPrice(total)})`, `${n} installments of ${formatPrice(per)} each (total ${formatPrice(total)})`);
  };

  const buildWhatsAppOrderText = () => {
    const lines = cart.map((e) => {
      const line = cartLine(e);
      if (!line) return '';
      const { p: prod, v, qty } = line;
      const priceLabel = v.price ? formatPrice(v.price * qty) : t('cotización pendiente', 'quote pending');
      return `• ${pick(prod.name)} (${v.name}) x${qty} — ${priceLabel}`;
    }).join('\n');
    const total = cartTotal();
    const totalLine = total > 0
      ? t(`\n\nTotal estimado: ${formatPrice(total)}`, `\n\nEstimated total: ${formatPrice(total)}`)
      : '';
    const intro = t('¡Hola Nuvela! 👋 Quiero hacer este pedido:\n\n', 'Hello Nuvela! 👋 I would like to place this order:\n\n');

    const facturaNombre = checkoutForm.facturaNombre.trim() || t('Consumidor Final', 'Final Consumer');
    const nit = checkoutForm.nit.trim() || 'C/F';
    const direccionFactura = checkoutForm.direccionFactura.trim() || '—';
    const customerBlock = t(
      `\n\n—— Datos del cliente ——\nNombre: ${checkoutForm.nombre.trim()}\nTeléfono: ${checkoutForm.telefono.trim()}\nNombre de factura: ${facturaNombre}\nNIT: ${nit}\nDirección de facturación: ${direccionFactura}\nDirección de entrega: ${checkoutForm.direccionEntrega.trim()}`,
      `\n\n—— Customer details ——\nName: ${checkoutForm.nombre.trim()}\nPhone: ${checkoutForm.telefono.trim()}\nInvoice name: ${facturaNombre}\nNIT: ${nit}\nBilling address: ${direccionFactura}\nDelivery address: ${checkoutForm.direccionEntrega.trim()}`
    );
    const paymentBlock = t(`\n\nMétodo de pago: ${paymentSummaryText()}`, `\n\nPayment method: ${paymentSummaryText()}`);

    return intro + lines + totalLine + customerBlock + paymentBlock;
  };

  const checkoutViaWhatsApp = () => {
    if (!cart.length) return;
    const required = ['nombre', 'telefono', 'direccionEntrega'];
    const missing = required.some((k) => !checkoutForm[k] || !checkoutForm[k].trim());
    if (missing) {
      setCheckoutError(t('Completa nombre, teléfono y dirección de entrega para continuar.', 'Please fill in name, phone and delivery address to continue.'));
      return;
    }
    setCheckoutError('');
    const text = buildWhatsAppOrderText();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  // ==== Línea Hotelera: solicitud de cotización de varios productos ====
  const [quoteCart, setQuoteCart] = useState([]); // { productId, variantName, qty }[] — no prices
  const [quoteSizeSelection, setQuoteSizeSelection] = useState({}); // productId -> chosen variant name
  const [quoteForm, setQuoteForm] = useState({ nombre: '', telefono: '', empresa: '', comentarios: '' });
  const [quoteError, setQuoteError] = useState('');
  const updateQuoteField = (key, value) => {
    setQuoteForm((prev) => ({ ...prev, [key]: value }));
    if (quoteError) setQuoteError('');
  };

  const quoteLine = (entry) => {
    const p = PRODUCTS.find((x) => x.id === entry.productId);
    if (!p) return null;
    const v = (p.variants || []).find((x) => x.name === entry.variantName) || (p.variants && p.variants[0]);
    return { p, v: v || null, qty: entry.qty };
  };
  const quoteCount = () => quoteCart.reduce((sum, e) => sum + e.qty, 0);

  const addToQuote = (productId, variantName, qty = 1) => {
    setQuoteCart((prev) => {
      const idx = prev.findIndex((e) => e.productId === productId && e.variantName === variantName);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { productId, variantName, qty }];
    });
  };
  const removeFromQuote = (productId, variantName) =>
    setQuoteCart((prev) => prev.filter((e) => !(e.productId === productId && e.variantName === variantName)));
  const setQuoteQty = (productId, variantName, qty) => {
    if (qty <= 0) { removeFromQuote(productId, variantName); return; }
    setQuoteCart((prev) => prev.map((e) => (e.productId === productId && e.variantName === variantName ? { ...e, qty } : e)));
  };

  const buildWhatsAppQuoteText = () => {
    const lines = quoteCart.map((e) => {
      const line = quoteLine(e);
      if (!line) return '';
      const { p: prod, v, qty } = line;
      const sizeLabel = v ? ` (${v.name})` : '';
      return `• ${pick(prod.name)}${sizeLabel} x${qty}`;
    }).join('\n');
    const intro = t(
      '¡Hola Nuvela! 👋 Quisiera solicitar cotización para hotelería/proyecto de estos productos:\n\n',
      'Hello Nuvela! 👋 I would like a quote for a hospitality/project order of these products:\n\n'
    );
    const empresaLine = quoteForm.empresa.trim() ? t(`\nHotel / Empresa: ${quoteForm.empresa.trim()}`, `\nHotel / Company: ${quoteForm.empresa.trim()}`) : '';
    const comentariosLine = quoteForm.comentarios.trim() ? t(`\nComentarios: ${quoteForm.comentarios.trim()}`, `\nNotes: ${quoteForm.comentarios.trim()}`) : '';
    const contactBlock = t(
      `\n\n—— Datos de contacto ——\nNombre: ${quoteForm.nombre.trim()}\nTeléfono: ${quoteForm.telefono.trim()}${empresaLine}${comentariosLine}`,
      `\n\n—— Contact details ——\nName: ${quoteForm.nombre.trim()}\nPhone: ${quoteForm.telefono.trim()}${empresaLine}${comentariosLine}`
    );
    return intro + lines + contactBlock;
  };

  const requestQuoteViaWhatsApp = () => {
    if (!quoteCart.length) return;
    const required = ['nombre', 'telefono', 'empresa'];
    const missing = required.some((k) => !quoteForm[k] || !quoteForm[k].trim());
    if (missing) {
      setQuoteError(t('Completa nombre, teléfono y hotel/empresa para continuar.', 'Please fill in name, phone and hotel/company to continue.'));
      return;
    }
    setQuoteError('');
    const text = buildWhatsAppQuoteText();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  // ==== Agenda tu Cita ====
  // Step 1 is a static form — same WhatsApp-notify pattern as the cart/quote
  // flows above. Step 2 shows one card per advisor, each linking out to
  // THEIR OWN Google Calendar "Appointment Schedule" page (hours Mon–Sat
  // 9am–5pm, 1-hour slots) — every advisor sets one up once inside their
  // own Google Calendar and gives Eduardo the booking-page link, pasted
  // into the `url` field below. Those pages refuse to be embedded in an
  // <iframe> (Google sends X-Frame-Options), so instead of embedding them
  // we show a button that opens the right one in a new tab. Real
  // availability + real bookings are handled entirely by Google — no
  // backend needed on our side. An advisor whose `url` is still empty
  // falls back to a WhatsApp button instead of a broken link.
  // Each advisor's `whatsapp` is their own personal number (used only for
  // the WhatsApp fallback while their `url` is still empty); it defaults
  // to the shared business WHATSAPP_NUMBER when not set.
  const CITA_ADVISORS = [
    { name: 'Manuel M.', role: { es: 'Ventas', en: 'Sales' }, url: '', whatsapp: '50235465165' },
    { name: 'Eduardo R.', role: { es: 'Ventas y Asesoría', en: 'Sales & Advisory' }, url: 'https://calendar.app.google/xZu4UZwHHBW5KjG69', whatsapp: '' },
    { name: 'Alvaro L.', role: { es: 'Administración', en: 'Administration' }, url: '', whatsapp: '50230216323' },
  ];

  const [citaForm, setCitaForm] = useState({ nombre: '', telefono: '', interes: 'Aún no estoy seguro / Quiero asesoría', comentarios: '' });
  const [citaError, setCitaError] = useState('');
  const updateCitaField = (key, value) => {
    setCitaForm((prev) => ({ ...prev, [key]: value }));
    if (citaError) setCitaError('');
  };

  const CITA_INTERES_OPTIONS = [
    { value: 'Colchón Nuvela', es: 'Colchón Nuvela', en: 'Nuvela Mattress' },
    { value: 'Nuvela Hotel', es: 'Nuvela Hotel', en: 'Nuvela Hotel Mattress' },
    { value: 'Almohadas', es: 'Almohadas', en: 'Pillows' },
    { value: 'Duvet Nuvela', es: 'Duvet Nuvela', en: 'Nuvela Duvet' },
    { value: 'Protector de Colchón', es: 'Protector de Colchón', en: 'Mattress Protector' },
    { value: 'Camastrón', es: 'Camastrón', en: 'Lounger' },
    { value: 'Proyecto de Hotelería', es: 'Proyecto de Hotelería', en: 'Hospitality Project' },
    { value: 'Aún no estoy seguro / Quiero asesoría', es: 'Aún no estoy seguro / Quiero asesoría', en: "Not sure yet / I'd like advice" },
  ];

  const buildWhatsAppCitaText = () => {
    const intro = t('¡Hola Nuvela! 👋 Quisiera agendar una cita/asesoría:\n\n', 'Hello Nuvela! 👋 I would like to book an appointment/consultation:\n\n');
    const interesOpt = CITA_INTERES_OPTIONS.find((o) => o.value === citaForm.interes);
    const interesText = interesOpt ? t(interesOpt.es, interesOpt.en) : citaForm.interes;
    const comentariosLine = citaForm.comentarios.trim() ? t(`\nComentarios: ${citaForm.comentarios.trim()}`, `\nNotes: ${citaForm.comentarios.trim()}`) : '';
    const lines = t(
      `Nombre: ${citaForm.nombre.trim()}\nTeléfono: ${citaForm.telefono.trim()}\nInterés: ${interesText}${comentariosLine}`,
      `Name: ${citaForm.nombre.trim()}\nPhone: ${citaForm.telefono.trim()}\nInterest: ${interesText}${comentariosLine}`
    );
    const note = t(
      '\n\nVoy a elegir mi horario en el calendario de la página (Lunes a Sábado, 9:00am–5:00pm).',
      "\n\nI'll pick my time slot on the site's calendar (Monday to Saturday, 9:00am–5:00pm)."
    );
    return intro + lines + note;
  };

  const requestCitaViaWhatsApp = () => {
    const missing = !citaForm.nombre.trim() || !citaForm.telefono.trim();
    if (missing) {
      setCitaError(t('Completa nombre y teléfono para continuar.', 'Please fill in name and phone to continue.'));
      return;
    }
    setCitaError('');
    const text = buildWhatsAppCitaText();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  // ==== Reseñas de Google ====
  // Reviews are pulled 100% client-side from Nuvela's Google Business
  // Profile using the Maps JavaScript API + Places library — no backend
  // needed. To go live, fill in the three constants below:
  //   GOOGLE_PLACES_API_KEY   — a browser API key from Google Cloud,
  //                             restricted to this site's domain.
  //   GOOGLE_PLACE_ID         — Nuvela's unique Google Places ID
  //                             (found with Google's "Place ID Finder").
  //   GOOGLE_MAPS_PROFILE_URL — the link to Nuvela's Google Maps profile,
  //                             used for the "see all reviews" button.
  // Until all three are set, a fallback links straight to Google instead
  // of showing an empty or broken block.
  const GOOGLE_PLACES_API_KEY = 'AIzaSyDpdyuUrRWYYBFVskcU-ybwqrSjWZaL28c';
  const GOOGLE_PLACE_ID = 'ChIJ_2ZvJ3ehiYURryjarZbKilI';
  const GOOGLE_MAPS_PROFILE_URL = 'https://maps.app.goo.gl/7jxuZavDRfuQANMd8';

  const [placeDetails, setPlaceDetails] = useState(null);
  const [reviewsStatus, setReviewsStatus] = useState('idle'); // idle | loading | ready | error
  const googleMapsScriptRequestedRef = useRef(false);

  const starString = (rating) => {
    const rounded = Math.max(0, Math.min(5, Math.round(rating || 0)));
    return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
  };

  const loadGoogleMapsScript = (cb) => {
    if (window.google && window.google.maps && window.google.maps.places) { cb(); return; }
    if (googleMapsScriptRequestedRef.current) {
      const check = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          clearInterval(check);
          cb();
        }
      }, 150);
      setTimeout(() => clearInterval(check), 8000);
      return;
    }
    googleMapsScriptRequestedRef.current = true;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_PLACES_API_KEY)}&libraries=places`;
    script.async = true;
    script.onload = cb;
    script.onerror = () => setReviewsStatus('error');
    document.head.appendChild(script);
  };

  useEffect(() => {
    if (page !== 'resenas') return;
    if (!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACE_ID) return;
    if (placeDetails || reviewsStatus === 'loading') return;
    setReviewsStatus('loading');
    loadGoogleMapsScript(() => {
      try {
        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
        service.getDetails({ placeId: GOOGLE_PLACE_ID, fields: ['name', 'rating', 'user_ratings_total', 'reviews', 'url'] }, (place, status) => {
          if (status !== window.google.maps.places.PlacesServiceStatus.OK || !place) {
            setReviewsStatus('error');
            return;
          }
          setPlaceDetails(place);
          setReviewsStatus('ready');
        });
      } catch (e) {
        setReviewsStatus('error');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Product-detail purchase controls: which size and quantity is "in view"
  // for the "Añadir al Carrito" button.
  const [pdSelectedVariant, setPdSelectedVariant] = useState(null);
  const [pdQty, setPdQty] = useState(1);
  const [pdAddFeedback, setPdAddFeedback] = useState(false);
  const pdFeedbackTimer = useRef(null);

  // Quick "Añadir al Carrito" feedback for the Precios page's per-size buttons.
  const [addedFeedback, setAddedFeedback] = useState({});
  const flashAdded = (key) => {
    setAddedFeedback((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setAddedFeedback((prev) => ({ ...prev, [key]: false })), 1200);
  };

  // "+ Agregar a Cotización" feedback for the Línea Hotelera cards.
  const [quoteAddedFeedback, setQuoteAddedFeedback] = useState({});
  const flashQuoteAdded = (key) => {
    setQuoteAddedFeedback((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setQuoteAddedFeedback((prev) => ({ ...prev, [key]: false })), 1200);
  };

  // Shared product card markup — used by both the main catalog and Línea Hotelera.
  // hideRetailPrice: hotel/B2B cards hide the retail price and prompt the shopper
  // to add the product (with a chosen size) to their consolidated quote request.
  const ProductCard = (p, opts) => {
    opts = opts || {};
    const from = priceFrom(p);
    const quoteVariant = quoteSizeSelection[p.id] || (p.variants && p.variants.length && (p.variants.find((v) => v.featured) || p.variants[0]).name);
    return (
      <div key={p.id} className="bg-white border border-pearl reveal flex flex-col overflow-hidden">
        <div className="aspect-square overflow-hidden bg-cream img-fallback">
          <img className="w-full h-full object-cover" src={p.mainImage} alt={pick(p.name)} onError={imgFallback} />
        </div>
        <div className="p-8 flex flex-col flex-grow">
          <Eyebrow>{pick(p.eyebrow)}</Eyebrow>
          <h3 className="font-serif text-2xl text-ink mt-3">{pick(p.name)}</h3>
          <p className="text-graphite text-sm mt-3 leading-relaxed flex-grow">{pick(p.cardText)}</p>
          {opts.hideRetailPrice ? (
            <>
              <p className="text-graphite text-sm mt-6 leading-relaxed">{t('Precios especiales por volumen para proyectos de hospitalidad.', 'Special volume pricing for hospitality projects.')}</p>
              {p.variants && p.variants.length > 1 && (
                <select
                  className="mt-4 border border-pearl px-3 py-2.5 text-sm bg-white"
                  aria-label={t('Presentación', 'Size')}
                  value={quoteVariant}
                  onChange={(e) => setQuoteSizeSelection((prev) => ({ ...prev, [p.id]: e.target.value }))}
                >
                  {p.variants.map((v) => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                </select>
              )}
              <button
                onClick={() => { addToQuote(p.id, quoteVariant, 1); flashQuoteAdded(p.id); }}
                disabled={!!quoteAddedFeedback[p.id]}
                className="btn-gold mt-4 w-full"
              >
                {quoteAddedFeedback[p.id] ? t('✓ Agregada', '✓ Added') : t('+ Agregar a Cotización', '+ Add to Quote Request')}
              </button>
            </>
          ) : (
            <>
              <p className="text-mist text-xs tracking-[0.18em] uppercase mt-6">{t('Desde', 'From')}</p>
              <p className="font-price text-3xl text-gold mt-1">{from ? `Q${from.toLocaleString('en-US')}` : t('Próximamente', 'Coming soon')}</p>
              <button onClick={() => openProduct(p.id)} className="btn-outline mt-6 w-full">{t('Ver Detalle', 'View Details')}</button>
            </>
          )}
        </div>
      </div>
    );
  };

  /* persist language */
  useEffect(() => {
    localStorage.setItem('nuvela-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  /* page change: scroll top + reveal observer */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setDrawerOpen(false);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
        observer.observe(el);
      });
    }, 60);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [page]);

  /* testimonial autoplay (home only) */
  useEffect(() => {
    if (page !== 'home') return;
    const id = setInterval(() => setTestimonialIndex((i) => (i + 1) % 3), 6000);
    return () => clearInterval(id);
  }, [page]);

  /* navbar scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const go = (target) => {
    setPage(target);
    setDrawerOpen(false);
  };
  const toggleFaq = (id) => setOpenFaqs((p) => ({ ...p, [id]: !p[id] }));
  const openProduct = (id) => {
    setSelectedProductId(id);
    setActiveThumb(0);
    const p = PRODUCTS.find((x) => x.id === id);
    const def = p && p.variants && p.variants.length ? (p.variants.find((v) => v.featured) || p.variants[0]) : null;
    setPdSelectedVariant(def ? def.name : null);
    setPdQty(1);
    go('producto-detalle');
  };

  const navItems = [
    { id: 'home', es: 'Inicio', en: 'Home' },
    { id: 'historia', es: 'Historia', en: 'Story' },
    { id: 'producto', es: 'Productos', en: 'Products' },
    { id: 'linea-hotelera', es: 'Línea Hotelera', en: 'Hotel Line' },
    { id: 'comparar', es: 'Comparar Productos', en: 'Compare Products' },
    { id: 'tecnologia', es: 'Tecnología', en: 'Technology' },
    { id: 'precios', es: 'Precios', en: 'Pricing' },
    { id: 'carrito', es: 'Mi Carrito', en: 'My Cart' },
    { id: 'entregas', es: 'Entregas', en: 'Delivery' },
    { id: 'cita', es: 'Agenda tu Cita', en: 'Book an Appointment' },
    { id: 'resenas', es: 'Reseñas', en: 'Reviews' },
    { id: 'faq', es: 'FAQ', en: 'FAQ' },
    { id: 'contacto', es: 'Contáctanos', en: 'Contact' },
  ];

  const imgFallback = (e) => {
    const parent = e.currentTarget.parentNode;
    if (parent) parent.classList.add('img-fallback');
    e.currentTarget.style.display = 'none';
  };

  return (
    <div className="bg-white text-graphite font-sans">
      {/* ========== Global styles ========== */}
      <style>{globalCss}</style>

      {/* ========== Top bar ========== */}
      <div className="hidden md:block w-full bg-ink text-cream text-[0.68rem] tracking-[0.32em] uppercase">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <span>{t('Entrega white-glove gratis en Guatemala', 'Free white-glove delivery in Guatemala')}</span>
          <span className="text-gold-light">
            {t('Garantía 10 años · ISO 9001 · OEKO-TEX®', '10-Year Warranty · ISO 9001 · OEKO-TEX®')}
          </span>
        </div>
      </div>

      {/* ========== Navbar ========== */}
      <header className={`sticky top-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-white/10 transition-all ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <a onClick={() => go('home')} className="flex flex-col items-start cursor-pointer">
            <span className="wordmark text-white text-xl md:text-2xl">NUVELA</span>
            <span className="wordmark-sub mt-0.5">Italian Design</span>
          </a>

          <nav className="hidden lg:flex items-center gap-9">
            {navItems.map((item) => (
              <a
                key={item.id}
                onClick={() => go(item.id)}
                className={`nav-link ${page === item.id ? 'active' : ''} ${item.id === 'carrito' ? 'inline-flex items-center gap-1.5' : ''}`}
              >
                {t(item.es, item.en)}
                {item.id === 'carrito' && cartCount() > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-white text-[0.6rem] font-bold leading-none">
                    {cartCount() > 99 ? '99+' : cartCount()}
                  </span>
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center text-[0.7rem] tracking-[0.22em] uppercase font-medium">
              <button onClick={() => setLang('es')} className={`px-2 py-1 ${lang === 'es' ? 'text-gold' : 'text-mist'}`}>ES</button>
              <span className="text-mist">/</span>
              <button onClick={() => setLang('en')} className={`px-2 py-1 ${lang === 'en' ? 'text-gold' : 'text-mist'}`}>EN</button>
            </div>
            <button onClick={() => go('precios')} className="hidden md:inline-flex btn-gold !py-2.5 !px-5 !text-[0.7rem]">
              {t('Comprar', 'Shop Now')}
            </button>
            {/* Cart icon — always visible, so it's reachable even with the menu closed */}
            <button onClick={() => go('carrito')} className="relative p-2 text-white" aria-label="Carrito">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 6h15l-1.5 9h-12L6 6Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 6 5 3H2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9.5" cy="20" r="1.3" fill="currentColor" stroke="none" />
                <circle cx="17" cy="20" r="1.3" fill="currentColor" stroke="none" />
              </svg>
              {cartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-gold text-white text-[0.6rem] font-bold flex items-center justify-center leading-none">
                  {cartCount() > 99 ? '99+' : cartCount()}
                </span>
              )}
            </button>
            <button onClick={() => setDrawerOpen(true)} className="lg:hidden flex flex-col gap-[5px] p-2" aria-label="Menu">
              <span className="block w-6 h-px bg-white" />
              <span className="block w-6 h-px bg-white" />
              <span className="block w-4 h-px bg-white ml-auto" />
            </button>
          </div>
        </div>
      </header>

      {/* ========== Mobile drawer ========== */}
      <div className={`drawer fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[60] shadow-2xl overflow-y-auto ${drawerOpen ? 'open' : ''}`}>
        <div className="p-6 flex items-center justify-between border-b border-pearl">
          <div className="flex flex-col">
            <span className="wordmark text-ink text-lg">NUVELA</span>
            <span className="wordmark-sub mt-0.5">Italian Design</span>
          </div>
          <button onClick={() => setDrawerOpen(false)} className="text-2xl text-ink leading-none">&times;</button>
        </div>
        <nav className="flex flex-col py-4">
          {navItems.map((item) => (
            <a
              key={item.id}
              onClick={() => go(item.id)}
              className="px-6 py-4 border-b border-pearl text-sm tracking-[0.22em] uppercase font-medium cursor-pointer flex items-center justify-between"
            >
              <span>{t(item.es, item.en)}</span>
              {item.id === 'carrito' && cartCount() > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-white text-[0.6rem] font-bold flex items-center justify-center leading-none">
                  {cartCount() > 99 ? '99+' : cartCount()}
                </span>
              )}
            </a>
          ))}
        </nav>
        <div className="p-6 flex items-center gap-4 border-t border-pearl">
          <span className="text-xs tracking-[0.2em] uppercase text-mist">{t('Idioma', 'Language')}</span>
          <button onClick={() => setLang('es')} className={`text-xs tracking-[0.2em] uppercase ${lang === 'es' ? 'text-gold' : 'text-mist'}`}>ES</button>
          <span className="text-mist">/</span>
          <button onClick={() => setLang('en')} className={`text-xs tracking-[0.2em] uppercase ${lang === 'en' ? 'text-gold' : 'text-mist'}`}>EN</button>
        </div>
      </div>
      {drawerOpen && <div onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-ink/40 z-[55]" />}

      {/* ============================================ */}
      {/* ================ HOME PAGE ================= */}
      {/* ============================================ */}
      {page === 'home' && (
        <main className="page-fade">
          {/* HERO */}
          <section className="relative h-[92vh] min-h-[640px] overflow-hidden">
            <div className="absolute inset-0 img-fallback">
              <img
                className="kenburns w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=2000&q=85"
                alt="Colchón premium Nuvela Italian Design con tecnología híbrida en Guatemala"
                onError={imgFallback}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
              <div className="max-w-2xl">
                <Eyebrow light className="reveal">{t('Diseño Italiano · Descanso Premium', 'Italian Design · Premium Sleep')}</Eyebrow>
                <GoldRule className="mt-5 reveal reveal-delay-1" />
                <h1 className="text-white font-serif text-5xl md:text-7xl leading-[1.05] mt-8 reveal reveal-delay-1">
                  {t(<>Colchones premium en Guatemala<br />con tecnología híbrida.</>, <>Premium mattresses in Guatemala<br />with hybrid technology.</>)}
                </h1>
                <p className="text-white/80 text-base md:text-lg mt-6 leading-relaxed max-w-xl reveal reveal-delay-2">
                  {t(
                    'Descubre Nuvela Italian Design. Colchones premium en Guatemala con tecnología híbrida, memory foam, resortes encapsulados, diseño italiano y 10 años de garantía. Diseñados para brindar máximo confort, soporte y una experiencia de descanso superior.',
                    'Discover Nuvela Italian Design. Premium mattresses with hybrid technology, memory foam, pocket springs, Italian design and a 10-year warranty.'
                  )}
                </p>
                <div className="flex flex-wrap gap-4 mt-10 reveal reveal-delay-3">
                  <button onClick={() => go('precios')} className="btn-gold">{t('Ver Colchones', 'Explore Mattrresses')}</button>
                  <button onClick={() => go('tecnologia')} className="btn-outline-light">{t('Conocer Tecnología', 'Discover Technology')}</button>
                </div>
              </div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/70 text-[0.65rem] tracking-[0.32em] uppercase">
              <span>{t('Desliza', 'Scroll')}</span>
              <span className="w-px h-8 bg-white/50 float" />
            </div>
          </section>

          {/* TRUST STRIP */}
          <section className="bg-cream py-10 border-y border-pearl">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { v: '10', l: t('Años Garantía', 'Year Warranty') },
                { v: '840', l: t('Resortes Encapsulados (King)', 'Encapsulated Springs (King)') },
                { v: '5', l: t('Capas Premium', 'Premium Layers') },
                { v: '30', l: t('cm Altura Premium', 'cm Mattress Height') },
              ].map((s, i) => (
                <div key={i} className={`reveal reveal-delay-${i}`}>
                  <p className="font-serif text-3xl text-gold">{s.v}</p>
                  <p className="eyebrow !text-graphite mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FEATURED PRODUCT */}
          <section className="py-24 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
              <div className="reveal order-2 lg:order-1">
                <Eyebrow>{t('El Colchón', 'The Mattress')}</Eyebrow>
                <GoldRule className="mt-4" />
                <h2 className="font-serif text-4xl md:text-5xl text-ink mt-8 leading-tight">Colchón Nuvela.</h2>
                <p className="font-serif italic text-mist text-lg mt-3">{t('Crafted in Italian Style.', 'Crafted in Italian style.')}</p>
                <p className="text-graphite mt-6 leading-relaxed text-[0.98rem]">
                  {t(
                    'Cinco capas de ingeniería precisa, resortes encapsulados individuales y tejidos de enfriamiento transpirables — el colchón Nuvela es el descanso destilado a su forma más pura y lujosa.',
                    'Five precision-engineered layers, individually encapsulated springs and breathable cooling fabrics — the Nuvela mattress is sleep distilled to its purest, most luxurious form.'
                  )}
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    t('Tela de enfriamiento y Gel Memory Foam', 'Cooling fabric & gel memory foam top'),
                    t('Capas de espuma 40D y 35D de alta densidad', 'High-density 40D & 35D foam layers'),
                    t('Sistema de resortes encapsulados individuales', 'Individually encapsulated spring system'),
                    'ISO 9001 · OEKO-TEX® · Sanilized®',
                  ].map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-2 h-2 mt-2 bg-gold rotate-45 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-4 mt-10">
                  <button onClick={() => go('producto')} className="btn-gold">{t('Ver Productos', 'View Products')}</button>
                  <button onClick={() => go('tecnologia')} className="link-gold">{t('Explorar Tecnología →', 'Explore Technology →')}</button>
                </div>
              </div>
              <div className="reveal reveal-delay-2 order-1 lg:order-2 relative">
                <div className="aspect-[4/5] overflow-hidden bg-cream img-fallback">
                  <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=85" alt="Colchón Nuvela" onError={imgFallback} />
                </div>
                <div className="absolute -bottom-8 -left-8 bg-white shadow-xl p-6 max-w-[220px] hidden md:block">
                  <Eyebrow>Italian Design</Eyebrow>
                  <p className="font-serif text-xl text-ink mt-2 leading-tight">{t('Garantía de 10 años incluida.', '10-year warranty included.')}</p>
                </div>
              </div>
            </div>
          </section>

          {/* TECHNOLOGY SHOWCASE */}
          <section className="py-24 md:py-32 bg-ink text-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto reveal">
                <Eyebrow light>{t('Ingeniería del Descanso', 'Sleep Engineering')}</Eyebrow>
                <GoldRule center className="mt-5" />
                <h2 className="font-serif text-4xl md:text-5xl mt-8 leading-tight">{t('Cinco capas de confort puro.', 'Five layers of pure comfort.')}</h2>
                <p className="text-white/70 mt-6 leading-relaxed">
                  {t(
                    'Cada capa está diseñada con un único propósito: ofrecer alivio de presión, balance térmico y soporte duradero — noche tras noche.',
                    'Each layer is engineered with a single goal: to deliver pressure relief, thermal balance and lasting support — night after night.'
                  )}
                </p>
              </div>
              <div className="mt-16 grid lg:grid-cols-5 gap-4">
                {[
                  ['01', t('Tela de Enfriamiento', 'Cooling Fabric'), t('Tejido técnico de alta transpirabilidad que regula la temperatura corporal para un descanso fresco.', 'Breathable technical knit that regulates body temperature for fresh, undisturbed sleep.')],
                  ['02', t('Gel Memory Foam', 'Gel Memory Foam'), t('Capa superior viscoelástica con gel para absorción de presión y regulación térmica avanzada.', 'Top viscoelastic layer infused with gel for advanced pressure absorption and thermal balance.')],
                  ['03', t('Memory Foam 40D', 'Memory Foam 40D'), t('Capa intermedia de alta densidad que brinda soporte postural y moldea el cuerpo con precisión.', 'High-density middle layer that delivers postural support and contours the body with precision.')],
                  ['04', t('Memory Foam 35D', 'Memory Foam 35D'), t('Base de espuma de soporte que complementa el sistema de resortes y garantiza durabilidad.', 'Foundational support foam complementing the spring core for long-lasting durability.')],
                  ['05', t('Resortes Encapsulados', 'Encapsulated Springs'), t('Resortes individuales que responden de forma independiente, eliminando el movimiento de pareja.', 'Independent springs that respond on their own — eliminating partner movement and offering targeted support.')],
                ].map(([n, ti, d], i) => (
                  <div key={n} className={`layer bg-white/5 border border-white/10 p-6 reveal reveal-delay-${i}`}>
                    <p className="text-gold-light font-serif text-2xl">{n}</p>
                    <h3 className="font-serif text-xl mt-4">{ti}</h3>
                    <p className="text-white/60 text-sm mt-3 leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>

              {/* ANATOMY VIDEO: 5 layers assembling from particles, silent looping showcase */}
              <div className="mt-16 reveal">
                <div className="max-w-4xl mx-auto border border-white/10">
                  <video
                    className="w-full h-auto block"
                    src="images/nuvela-tecnologia-particulas.mp4"
                    poster="images/nuvela-tecnologia-particulas-poster.jpg"
                    autoPlay muted loop playsInline preload="metadata"
                    aria-label="Animación de las cinco capas del colchón Nuvela formándose"
                  />
                </div>
                <p className="text-center text-white/40 text-xs tracking-[0.18em] uppercase mt-5">{t('Anatomía del colchón Nuvela', 'Anatomy of the Nuvela mattress')}</p>
              </div>
            </div>
          </section>

          {/* WHY NUVELA */}
          <section className="py-24 md:py-32 bg-cream">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto reveal">
                <Eyebrow>{t('Por qué Nuvela', 'Why Nuvela')}</Eyebrow>
                <GoldRule center className="mt-5" />
                <h2 className="font-serif text-4xl md:text-5xl text-ink mt-8 leading-tight">{t('Un estándar, redefinido.', 'A standard, redefined.')}</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8 mt-16">
                {whyNuvelaItems(t).map((it, i) => (
                  <div key={i} className={`bg-white p-10 reveal ${i > 0 ? `reveal-delay-${i % 3}` : ''}`}>
                    <div className="w-12 h-12 border border-gold flex items-center justify-center text-gold">
                      {it.icon}
                    </div>
                    <h3 className="font-serif text-2xl text-ink mt-6">{it.title}</h3>
                    <p className="text-graphite mt-3 leading-relaxed text-[0.95rem]">{it.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="py-24 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto reveal">
                <Eyebrow>{t('Testimonios', 'Voices')}</Eyebrow>
                <GoldRule center className="mt-5" />
                <h2 className="font-serif text-4xl md:text-5xl text-ink mt-8 leading-tight">
                  {t('El descanso, contado por quienes lo viven.', 'Sleep, told by those who live it.')}
                </h2>
              </div>
              <div className="mt-16 relative overflow-hidden">
                <div
                  className="testimonial-track flex"
                  style={{ transform: `translateX(-${testimonialIndex * 100}%)` }}
                >
                  {testimonialsData(t).map((tm, i) => (
                    <div key={i} className="min-w-full px-6 md:px-20 text-center">
                      <p className="font-serif italic text-2xl md:text-3xl text-ink leading-snug max-w-3xl mx-auto">{tm.quote}</p>
                      <p className="eyebrow !text-graphite mt-8">{tm.name}</p>
                      <p className="text-mist text-xs tracking-[0.18em] uppercase mt-1">{tm.meta}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-3 mt-12">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      onClick={() => setTestimonialIndex(i)}
                      className={`w-8 h-px ${testimonialIndex === i ? 'bg-gold' : 'bg-pearl'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* INSTAGRAM */}
          <section className="py-24 md:py-32 bg-cream">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 reveal">
                <div>
                  <Eyebrow>Instagram</Eyebrow>
                  <GoldRule className="mt-4" />
                  <h2 className="font-serif text-4xl md:text-5xl text-ink mt-8 leading-tight">{t('Sigue nuestra historia.', 'Follow our story.')}</h2>
                  <a href="https://instagram.com/Nuvela.gt" target="_blank" rel="noopener noreferrer" className="link-gold mt-4 inline-block">@Nuvela.gt</a>
                </div>
                <a href="https://instagram.com/Nuvela.gt" target="_blank" rel="noopener noreferrer" className="btn-outline">{t('Seguir en Instagram', 'Follow on Instagram')}</a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mt-16">
                {[
                  'photo-1540518614846-7eded433c457',
                  'photo-1522771739844-6a9f6d5f14af',
                  'photo-1594040226829-7f251ab46d80',
                  'photo-1616137422495-1e9e46e2aa77',
                ].map((id, i) => (
                  <a
                    key={id}
                    href="https://instagram.com/Nuvela.gt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`aspect-square overflow-hidden bg-pearl group reveal reveal-delay-${i} img-fallback`}
                  >
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      src={`https://images.unsplash.com/${id}?w=600&q=80`}
                      alt=""
                      onError={imgFallback}
                    />
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* CONTACT CTA */}
          <section className="py-24 md:py-32 bg-ink text-white">
            <div className="max-w-4xl mx-auto px-6 text-center reveal">
              <Eyebrow light>{t('Listo para descansar', 'Ready to rest')}</Eyebrow>
              <GoldRule center className="mt-5" />
              <h2 className="font-serif text-4xl md:text-6xl mt-8 leading-tight">
                {t(<>Tu mejor noche<br />empieza esta noche.</>, <>Your best night<br />begins tonight.</>)}
              </h2>
              <p className="text-white/70 mt-6 max-w-xl mx-auto leading-relaxed">
                {t(
                  'Habla con nuestro equipo concierge. Te ayudamos a encontrar la medida correcta, la firmeza correcta y el descanso correcto — para ti.',
                  "Speak with our concierge team. We'll help you find the right size, the right firmness and the right sleep — for you."
                )}
              </p>
              <div className="flex flex-wrap gap-4 justify-center mt-10">
                <button onClick={() => go('contacto')} className="btn-gold">{t('Contáctanos', 'Contact Us')}</button>
                <button onClick={() => go('precios')} className="btn-outline-light">{t('Ver Precios', 'View Pricing')}</button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ============================================ */}
      {/* ================ HISTORIA ================== */}
      {/* ============================================ */}
      {page === 'historia' && (
        <main className="page-fade">
          <section className="relative h-[60vh] min-h-[460px] overflow-hidden">
            <div className="absolute inset-0 img-fallback">
              <img className="absolute inset-0 w-full h-full object-cover kenburns" src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=2000&q=85" alt="" onError={imgFallback} />
              <div className="absolute inset-0 bg-black/55" />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
              <Eyebrow light className="reveal">{t('Historia', 'Our Story')}</Eyebrow>
              <GoldRule className="mt-5 reveal reveal-delay-1" />
              <h1 className="text-white font-serif text-5xl md:text-7xl mt-8 leading-[1.05] max-w-3xl reveal reveal-delay-1">
                {t('Una filosofía del descanso.', 'A philosophy of rest.')}
              </h1>
            </div>
          </section>

          <section className="py-24 md:py-32 bg-white">
            <div className="max-w-4xl mx-auto px-6">
              <div className="reveal">
                <Eyebrow>{t('Visión', 'Vision')}</Eyebrow>
                <GoldRule className="mt-4" />
                <h2 className="font-serif text-3xl md:text-4xl text-ink mt-6 leading-tight">
                  {t('El descanso no es un lujo — es el fundamento de una vida bien vivida.', 'Sleep is not a luxury — it is the foundation of a well-lived life.')}
                </h2>
              </div>
              <p className="text-graphite mt-10 leading-loose text-lg reveal reveal-delay-1">
                {t(
                  'Nuvela nació de una convicción simple: la forma en que descansamos define cómo vivimos. Inspirados por la tradición italiana del oficio — donde cada detalle se considera, cada material se elige, cada acabado se refina — nos propusimos crear colchones que no solo se sintieran premium. Se sintieran inevitables.',
                  "Nuvela was born from a simple conviction: that the way we rest defines how we live. Inspired by the Italian tradition of craftsmanship — where every detail is considered, every material chosen, every finish refined — we set out to build mattresses that don't just feel premium. They feel inevitable."
                )}
              </p>
              <p className="text-graphite mt-6 leading-loose text-lg reveal reveal-delay-2">
                {t(
                  'Cada colchón Nuvela es producto de una ingeniería obsesiva. Cada capa — desde la tela superior de enfriamiento, pasando por el núcleo 40D de alta densidad, hasta los cientos de resortes encapsulados individualmente — está calibrada con un único fin: un descanso tan profundo, tan completo, que la mañana se convierte en una celebración.',
                  'Every Nuvela mattress is the product of obsessive engineering. Each layer — from the cooling top fabric to the high-density 40D core to the hundreds of independently encapsulated springs — is calibrated to a single end: a sleep so deep, so complete, that morning becomes a celebration.'
                )}
              </p>
            </div>
          </section>

          <section className="py-24 md:py-32 bg-cream">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
              {[
                { eb: t('Misión', 'Mission'), body: t('Ofrecer una experiencia de descanso digna de ser heredada — a través de la calidad, el diseño y la integridad inquebrantable.', 'Deliver a sleep experience worthy of being passed down — through quality, design and unwavering integrity.') },
                { eb: t('Filosofía', 'Philosophy'), body: t('Lo mejor es discreto. Un colchón debe desaparecer bajo ti, devolviendo tu cuerpo al equilibrio y tu mente al silencio.', 'The best things are quiet. A mattress should disappear beneath you, returning your body to balance and your mind to silence.') },
                { eb: t('Innovación', 'Innovation'), body: t('Probamos, refinamos y nos obsesionamos. La ciencia moderna del descanso se encuentra con siglos de oficio italiano — ese es el método Nuvela.', 'We test, refine and obsess. Modern sleep science meets centuries of Italian craftsmanship — that is the Nuvela method.') },
              ].map((c, i) => (
                <div key={i} className={`bg-white p-10 reveal reveal-delay-${i}`}>
                  <Eyebrow>{c.eb}</Eyebrow>
                  <GoldRule className="mt-4" />
                  <p className="text-graphite mt-6 leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="py-24 md:py-32 bg-white">
            <div className="max-w-5xl mx-auto px-6 text-center reveal">
              <p className="font-serif italic text-3xl md:text-4xl text-ink leading-snug">«Duerme Bien Siempre.»</p>
              <p className="eyebrow !text-graphite mt-6">Nuvela · Italian Design</p>
            </div>
          </section>
        </main>
      )}

      {/* ============================================ */}
      {/* ================ PRODUCTO ================== */}
      {/* ============================================ */}
      {page === 'producto' && (
        <main className="page-fade">
          <section className="bg-cream pt-28 pb-16">
            <div className="max-w-7xl mx-auto px-6 text-center reveal">
              <Eyebrow>{t('Nuestros Productos', 'Our Products')}</Eyebrow>
              <GoldRule center className="mt-4" />
              <h1 className="font-serif text-5xl md:text-6xl text-ink mt-8 leading-[1.05]">{t('Cada producto, un mismo estándar de descanso.', 'Every product, one standard of rest.')}</h1>
              <p className="text-graphite mt-6 leading-relaxed max-w-xl mx-auto">
                {t('Elige un producto para ver fotos, medidas, precios y ficha técnica completa.', 'Choose a product to see photos, sizes, prices and full specifications.')}
              </p>
            </div>
          </section>

          <section className="pb-24 md:pb-32 bg-cream">
            <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-3 mb-12">
              {[{ key: 'all', label: t('Todos', 'All') }, ...getCategories().map((c) => ({ key: c.es, label: pick(c) }))].map((b) => (
                <button
                  key={b.key}
                  onClick={() => setActiveCategory(b.key)}
                  className={`px-5 py-2 text-xs tracking-[0.22em] uppercase border transition-colors ${activeCategory === b.key ? 'bg-ink text-white border-ink' : 'border-pearl text-graphite hover:border-ink'}`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProducts.length === 0 && (
                <p className="col-span-full text-center text-mist py-10">{t('Próximamente en esta categoría.', 'Coming soon in this category.')}</p>
              )}
              {visibleProducts.map((p) => ProductCard(p))}
            </div>
          </section>
        </main>
      )}

      {/* ============================================ */}
      {/* ================ LÍNEA HOTELERA ============= */}
      {/* ============================================ */}
      {/* Página B2B para hoteles, Airbnb y proyectos de remodelación: colchones,   */}
      {/* almohadas, accesorios de cama (duvets/protectores) y camastrones.        */}
      {page === 'linea-hotelera' && (
        <main className="page-fade">
          <section className="bg-cream pt-28 pb-16">
            <div className="max-w-7xl mx-auto px-6 text-center reveal">
              <Eyebrow>{t('Línea Hotelera', 'Hotel Line')}</Eyebrow>
              <GoldRule center className="mt-4" />
              <h1 className="font-serif text-5xl md:text-6xl text-ink mt-8 leading-[1.05]">{t('Descanso, a la escala de la hospitalidad.', 'Rest, at hospitality scale.')}</h1>
              <p className="text-graphite mt-6 leading-relaxed max-w-xl mx-auto">
                {t('Colchones, almohadas, blancos de cama y camastrones para hoteles, Airbnbs y proyectos de remodelación — con precios por volumen y un concierge dedicado.', 'Mattresses, pillows, bedding and loungers for hotels, Airbnbs and renovation projects — with volume pricing and a dedicated concierge.')}
              </p>
            </div>
          </section>

          {/* QUOTE TRAY: products the shopper has flagged with "+ Agregar a Cotización". */}
          {/* Stays at the top of the page so it's visible as they keep browsing. */}
          <section className="pb-12 bg-white border-b border-pearl">
            <div className="max-w-5xl mx-auto px-6 pt-4">
              {quoteCart.length === 0 ? (
                <div className="text-center py-6">
                  <p className="font-serif text-xl text-ink">{t('Tu cotización está vacía.', 'Your quote request is empty.')}</p>
                  <p className="text-graphite text-sm mt-2">
                    {t('Agrega los productos que te interesan con "+ Agregar a Cotización".', 'Add the products you are interested in with "+ Add to Quote Request".')}
                  </p>
                </div>
              ) : (
                <>
                  <Eyebrow>{t('Tu Cotización', 'Your Quote Request')} ({quoteCount()})</Eyebrow>
                  <div className="mt-3">
                    {quoteCart.map((entry) => {
                      const line = quoteLine(entry);
                      if (!line) return null;
                      const { p: prod, v, qty } = line;
                      return (
                        <div key={`${prod.id}-${v ? v.name : ''}`} className="flex items-center gap-4 py-4 border-b border-pearl">
                          <div className="w-16 h-16 bg-cream overflow-hidden flex-shrink-0 img-fallback">
                            <img className="w-full h-full object-cover" src={prod.mainImage} alt={pick(prod.name)} onError={imgFallback} />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-serif text-base text-ink">{pick(prod.name)}</h3>
                            {v && <p className="text-mist text-xs mt-0.5">{v.name}</p>}
                          </div>
                          <div className="flex items-center border border-pearl">
                            <button type="button" onClick={() => setQuoteQty(prod.id, v ? v.name : '', qty - 1)} className="w-8 h-8 text-ink hover:bg-cream" aria-label="-">−</button>
                            <input
                              type="number"
                              min="1"
                              inputMode="numeric"
                              key={`qty-${prod.id}-${v ? v.name : ''}-${qty}`}
                              defaultValue={qty}
                              onBlur={(e) => {
                                const val = parseInt(e.target.value, 10);
                                setQuoteQty(prod.id, v ? v.name : '', isNaN(val) ? 0 : val);
                              }}
                              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
                              className="w-12 text-center font-price text-ink text-sm border-0 focus:outline-none focus:bg-cream"
                            />
                            <button type="button" onClick={() => setQuoteQty(prod.id, v ? v.name : '', qty + 1)} className="w-8 h-8 text-ink hover:bg-cream" aria-label="+">+</button>
                          </div>
                          <button
                            onClick={() => removeFromQuote(prod.id, v ? v.name : '')}
                            className="text-mist hover:text-ink text-[0.65rem] tracking-[0.12em] uppercase whitespace-nowrap"
                          >
                            {t('Quitar ✕', 'Remove ✕')}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-6 border-t border-pearl">
                    <Eyebrow>{t('Datos de Contacto', 'Contact Details')}</Eyebrow>
                    <div className="grid sm:grid-cols-2 gap-4 mt-5">
                      <div>
                        <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite">{t('Nombre Completo *', 'Full Name *')}</label>
                        <input
                          type="text"
                          autoComplete="name"
                          value={quoteForm.nombre}
                          onChange={(e) => updateQuoteField('nombre', e.target.value)}
                          className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite">{t('Teléfono *', 'Phone *')}</label>
                        <input
                          type="tel"
                          autoComplete="tel"
                          value={quoteForm.telefono}
                          onChange={(e) => updateQuoteField('telefono', e.target.value)}
                          className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite">{t('Hotel / Empresa *', 'Hotel / Company *')}</label>
                        <input
                          type="text"
                          value={quoteForm.empresa}
                          onChange={(e) => updateQuoteField('empresa', e.target.value)}
                          className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite">{t('Comentarios', 'Notes')}</label>
                        <input
                          type="text"
                          value={quoteForm.comentarios}
                          onChange={(e) => updateQuoteField('comentarios', e.target.value)}
                          className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none"
                        />
                      </div>
                    </div>
                    {quoteError && <p className="text-sm mt-5" style={{ color: '#B3261E' }}>{quoteError}</p>}
                    <button onClick={requestQuoteViaWhatsApp} className="btn-gold w-full mt-5 !py-4 !text-sm">
                      {t('Solicitar Cotización por WhatsApp', 'Request Quote via WhatsApp')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="pb-24 md:pb-32 bg-cream">
            <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotelProducts.length === 0 && (
                <p className="col-span-full text-center text-mist py-10">{t('Próximamente.', 'Coming soon.')}</p>
              )}
              {hotelProducts.map((p) => ProductCard(p, { hideRetailPrice: true }))}
            </div>
          </section>

          <section className="py-20 bg-white text-center">
            <div className="max-w-2xl mx-auto px-6 reveal">
              <Eyebrow>{t('Proyectos de Hospitalidad', 'Hospitality Projects')}</Eyebrow>
              <GoldRule center className="mt-4" />
              <h2 className="font-serif text-3xl text-ink mt-6">{t('Habla con nuestro concierge hotelero.', 'Talk to our hotel concierge.')}</h2>
              <p className="text-graphite mt-4 leading-relaxed">
                {t('Pedidos por volumen, medidas a la carta y calendarios de entrega para proyectos de hospitalidad de cualquier tamaño.', 'Volume orders, custom sizing and delivery schedules for hospitality projects of any size.')}
              </p>
              <button onClick={() => go('contacto')} className="btn-gold mt-8">{t('Hablar con Concierge', 'Contact Concierge')}</button>
            </div>
          </section>
        </main>
      )}

      {/* ============================================ */}
      {/* =============== COMPARAR PRODUCTOS =========== */}
      {/* ============================================ */}
      {/* Estilo comparador de Apple: hasta 3 productos, agrupados por sección  */}
      {/* arriba para elegirlos, tabla de especificaciones lado a lado abajo.  */}
      {page === 'comparar' && (
        <main className="page-fade">
          <section className="bg-cream pt-28 pb-16">
            <div className="max-w-7xl mx-auto px-6 text-center reveal">
              <Eyebrow>{t('Comparar Productos', 'Compare Products')}</Eyebrow>
              <GoldRule center className="mt-4" />
              <h1 className="font-serif text-5xl md:text-6xl text-ink mt-8 leading-[1.05]">{t('Compara, lado a lado.', 'Compare, side by side.')}</h1>
              <p className="text-graphite mt-6 leading-relaxed max-w-xl mx-auto">
                {t('Elige hasta 3 productos de cualquier sección para comparar sus fotos y especificaciones.', 'Choose up to 3 products from any section to compare their photos and specifications.')}
              </p>
            </div>
          </section>

          <section className="pb-16 bg-cream">
            <div className="max-w-7xl mx-auto px-6 space-y-8">
              {getCategories().map((cat) => {
                const items = PRODUCTS.filter((p) => p.category.es === cat.es);
                return (
                  <div key={cat.es}>
                    <div className="flex items-center gap-4 mb-4">
                      <h2 className="font-serif text-xl md:text-2xl text-ink whitespace-nowrap">{pick(cat)}</h2>
                      <span className="gold-rule !w-full" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {items.map((p) => {
                        const selected = compareIds.includes(p.id);
                        const disabled = !selected && compareIds.length >= 3;
                        const label = selected
                          ? t('✓ Agregado', '✓ Added')
                          : disabled
                            ? t('Máximo 3', 'Max 3')
                            : t('+ Comparar', '+ Compare');
                        const btnClass = selected
                          ? 'bg-gold text-white'
                          : disabled
                            ? 'bg-pearl text-mist cursor-not-allowed'
                            : 'border border-ink text-ink hover:bg-ink hover:text-white';
                        return (
                          <div key={p.id} className={`border ${selected ? 'border-gold' : 'border-pearl'} bg-white flex flex-col overflow-hidden transition-colors`}>
                            <div className="h-32 md:h-36 overflow-hidden bg-cream img-fallback">
                              <img className="w-full h-full object-cover" src={p.mainImage} alt={pick(p.name)} onError={imgFallback} />
                            </div>
                            <div className="p-3 flex flex-col flex-grow">
                              <h3 className="font-serif text-sm text-ink leading-snug">{pick(p.name)}</h3>
                              <p className="font-price text-base text-gold mt-1">{(() => { const fr = priceFrom(p); return fr ? `Q${fr.toLocaleString('en-US')}` : t('Próximamente', 'Coming soon'); })()}</p>
                              <button
                                onClick={() => !disabled && toggleCompare(p.id)}
                                disabled={disabled}
                                className={`mt-2 w-full text-[0.65rem] tracking-[0.12em] uppercase py-2 transition-colors ${btnClass}`}
                              >
                                {label}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="pb-24 md:pb-32 bg-white border-t border-pearl">
            <div className="max-w-6xl mx-auto px-6 pt-16">
              {compareProducts.length === 0 ? (
                <div className="text-center py-16">
                  <Eyebrow>{t('Tu comparación', 'Your comparison')}</Eyebrow>
                  <h2 className="font-serif text-3xl text-ink mt-4">{t('Selecciona hasta 3 productos arriba para compararlos aquí.', 'Select up to 3 products above to compare them here.')}</h2>
                </div>
              ) : (
                <>
                  <div className="text-center mb-10">
                    <Eyebrow>{t('Tu comparación', 'Your comparison')}</Eyebrow>
                    <h2 className="font-serif text-3xl md:text-4xl text-ink mt-3">{t('Especificaciones, lado a lado.', 'Specifications, side by side.')}</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="min-w-[520px]" style={{ display: 'grid', gridTemplateColumns: `150px repeat(${compareProducts.length}, minmax(190px, 1fr))` }}>
                      <div />
                      {compareProducts.map((p) => (
                        <div key={p.id} className="text-center px-3 pb-5 border-b-2 border-ink">
                          <button onClick={() => removeCompare(p.id)} className="text-mist hover:text-ink text-[0.65rem] tracking-[0.12em] uppercase mb-2">
                            {t('Quitar ✕', 'Remove ✕')}
                          </button>
                          <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-cream mb-2 overflow-hidden img-fallback border border-pearl">
                            <img className="w-full h-full object-cover" src={p.mainImage} alt={pick(p.name)} onError={imgFallback} />
                          </div>
                          <h3 className="font-serif text-sm md:text-base text-ink leading-snug">{pick(p.name)}</h3>
                          {p.variants && p.variants.length > 1 && (
                            <div className="flex flex-wrap justify-center gap-1 mt-2">
                              {p.variants.map((v) => (
                                <button
                                  key={v.name}
                                  onClick={() => setCompareSize(p.id, v.name)}
                                  className={`text-[0.6rem] tracking-wide uppercase px-2 py-1 border transition-colors ${compareSizeSelection[p.id] === v.name ? 'bg-ink text-white border-ink' : 'border-pearl text-graphite hover:border-ink'}`}
                                >
                                  {v.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      {SPEC_ROWS.map((row, ri) => (
                        <React.Fragment key={row.es}>
                          <div className={`py-4 px-2 text-xs tracking-[0.12em] uppercase text-graphite font-medium flex items-center ${ri % 2 === 1 ? 'bg-pearl/30' : ''} ${row.price ? 'bg-cream/60' : ''}`}>
                            {pick(row)}
                          </div>
                          {compareProducts.map((p) => (
                            <div
                              key={`${row.es}-${p.id}`}
                              className={`py-4 px-3 text-center border-l border-pearl flex items-center justify-center ${ri % 2 === 1 ? 'bg-pearl/30' : ''} ${row.price ? 'bg-cream/60 font-price text-gold text-base md:text-lg' : 'text-sm text-ink'}`}
                            >
                              {row.get(p)}
                            </div>
                          ))}
                        </React.Fragment>
                      ))}

                      <div />
                      {compareProducts.map((p) => (
                        <div key={`${p.id}-cta`} className="px-3 pt-6 border-l border-pearl">
                          <button onClick={() => openProduct(p.id)} className="btn-outline w-full">{t('Ver Detalle', 'View Details')}</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </main>
      )}

      {/* ============================================ */}
      {/* ======================= CARRITO ============= */}
      {/* ============================================ */}
      {page === 'carrito' && (
        <main className="page-fade">
          <section className="bg-cream pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-6 text-center reveal">
              <Eyebrow>{t('Mi Carrito', 'My Cart')}</Eyebrow>
              <GoldRule center className="mt-4" />
              <h1 className="font-serif text-5xl md:text-6xl text-ink mt-8 leading-[1.05]">{t('Revisa tu pedido.', 'Review your order.')}</h1>
              <p className="text-graphite mt-6 leading-relaxed max-w-xl mx-auto">
                {t('Agrega productos desde cualquier ficha, ajusta cantidades aquí y envíanos tu pedido directo por WhatsApp.', 'Add products from any product page, adjust quantities here, and send your order straight to us on WhatsApp.')}
              </p>
            </div>
          </section>

          <section className="pb-24 md:pb-32 bg-white border-t border-pearl">
            <div className="max-w-5xl mx-auto px-6 pt-16">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <p className="font-serif text-2xl text-ink">{t('Tu carrito está vacío.', 'Your cart is empty.')}</p>
                  <p className="text-graphite mt-3">{t('Explora nuestros productos y agrega los que te interesen.', 'Browse our products and add the ones you like.')}</p>
                  <button onClick={() => go('producto')} className="btn-gold mt-8">{t('Ver Productos', 'View Products')}</button>
                </div>
              ) : (
                <>
                  <div>
                    {cart.map((entry) => {
                      const line = cartLine(entry);
                      if (!line) return null;
                      const { p: prod, v, qty } = line;
                      const unitLabel = formatPrice(v.price);
                      const subtotalLabel = v.price ? formatPrice(v.price * qty) : t('Cotización', 'Quote');
                      return (
                        <div key={`${prod.id}-${v.name}`} className="flex flex-col sm:flex-row gap-6 py-7 border-b border-pearl">
                          <div className="w-full sm:w-40 h-52 sm:h-40 bg-cream overflow-hidden flex-shrink-0 img-fallback">
                            <img className="w-full h-full object-cover" src={prod.mainImage} alt={pick(prod.name)} onError={imgFallback} />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="font-serif text-xl text-ink">{pick(prod.name)}</h3>
                                <p className="text-ink text-sm mt-1"><strong>{v.name}</strong>{pick(v.detail) ? ` — ${pick(v.detail)}` : ''}</p>
                                <p className="text-mist text-sm mt-0.5">{t('Precio unitario', 'Unit price')}: {unitLabel}</p>
                              </div>
                              <button
                                onClick={() => removeFromCart(prod.id, v.name)}
                                className="text-mist hover:text-ink text-[0.65rem] tracking-[0.12em] uppercase whitespace-nowrap"
                              >
                                {t('Quitar ✕', 'Remove ✕')}
                              </button>
                            </div>
                            <div className="flex items-center justify-between mt-5">
                              <div className="flex items-center border border-pearl">
                                <button type="button" onClick={() => setCartQty(prod.id, v.name, qty - 1)} className="w-9 h-9 text-ink hover:bg-cream" aria-label="-">−</button>
                                <span className="w-9 text-center font-price text-ink text-sm">{qty}</span>
                                <button type="button" onClick={() => setCartQty(prod.id, v.name, qty + 1)} className="w-9 h-9 text-ink hover:bg-cream" aria-label="+">+</button>
                              </div>
                              <p className="font-price text-gold text-xl">{subtotalLabel}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
                    <p className="text-graphite text-sm max-w-sm">
                      {t('El envío se coordina por WhatsApp según tu dirección de entrega.', 'Shipping is coordinated over WhatsApp based on your delivery address.')}
                    </p>
                    <div className="text-right">
                      <p className="text-mist text-xs tracking-[0.18em] uppercase">{t('Total estimado', 'Estimated total')}</p>
                      <p className="font-price text-3xl text-gold">{formatPrice(cartTotal())}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-10 border-t border-pearl">
                    <Eyebrow>{t('Datos de Entrega y Facturación', 'Delivery & Billing Details')}</Eyebrow>
                    <div className="grid sm:grid-cols-2 gap-4 mt-5">
                      <div>
                        <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite">{t('Nombre Completo *', 'Full Name *')}</label>
                        <input
                          type="text"
                          autoComplete="name"
                          value={checkoutForm.nombre}
                          onChange={(e) => updateCheckoutField('nombre', e.target.value)}
                          className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite">{t('Teléfono *', 'Phone *')}</label>
                        <input
                          type="tel"
                          autoComplete="tel"
                          value={checkoutForm.telefono}
                          onChange={(e) => updateCheckoutField('telefono', e.target.value)}
                          className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite">{t('Nombre para Factura', 'Invoice Name')}</label>
                        <input
                          type="text"
                          placeholder={t('Consumidor Final', 'Final Consumer')}
                          value={checkoutForm.facturaNombre}
                          onChange={(e) => updateCheckoutField('facturaNombre', e.target.value)}
                          className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite">NIT</label>
                        <input
                          type="text"
                          placeholder="C/F"
                          value={checkoutForm.nit}
                          onChange={(e) => updateCheckoutField('nit', e.target.value)}
                          className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite">{t('Dirección de Facturación', 'Billing Address')}</label>
                        <input
                          type="text"
                          value={checkoutForm.direccionFactura}
                          onChange={(e) => updateCheckoutField('direccionFactura', e.target.value)}
                          className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite">{t('Dirección de Entrega *', 'Delivery Address *')}</label>
                        <input
                          type="text"
                          autoComplete="street-address"
                          value={checkoutForm.direccionEntrega}
                          onChange={(e) => updateCheckoutField('direccionEntrega', e.target.value)}
                          className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-10 border-t border-pearl">
                    <Eyebrow>{t('Método de Pago', 'Payment Method')}</Eyebrow>
                    <div className="flex flex-wrap gap-2 mt-5">
                      {CUOTA_OPTIONS.map((n) => {
                        const selected = checkoutForm.cuotas === n;
                        const label = n === 1 ? t('1 Pago', '1 Payment') : t(`${n} Cuotas`, `${n} Installments`);
                        return (
                          <button
                            key={n}
                            type="button"
                            onClick={() => updateCheckoutField('cuotas', n)}
                            className={`px-4 py-2 text-xs tracking-[0.12em] uppercase border transition-colors ${selected ? 'bg-gold text-white border-gold' : 'border-pearl text-graphite hover:border-gold'}`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-graphite text-sm mt-4">{paymentSummaryText()}</p>
                    <p className="text-mist text-xs mt-2">
                      {t('Cuota referencial, sin intereses incluidos — la tasa final depende del banco participante.', 'Reference installment amount, no interest included — the final rate depends on the participating bank.')}
                    </p>
                  </div>

                  {checkoutError && <p className="text-sm mt-6" style={{ color: '#B3261E' }}>{checkoutError}</p>}

                  <button onClick={checkoutViaWhatsApp} className="btn-gold w-full mt-6 !py-4 !text-sm">
                    {t('Finalizar Pedido por WhatsApp', 'Checkout via WhatsApp')}
                  </button>
                </>
              )}
            </div>
          </section>
        </main>
      )}

      {/* ============================================ */}
      {/* ============ PRODUCTO (DETALLE) ============= */}
      {/* ============================================ */}
      {page === 'producto-detalle' && selectedProduct && (
        <main className="page-fade">
          <section className="bg-cream pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-6">
              <button onClick={() => go('producto')} className="link-gold mb-10">{t('← Volver a Productos', '← Back to Products')}</button>

              <div className="grid lg:grid-cols-2 gap-16 items-start">
                <div className="reveal">
                  <div className="aspect-square overflow-hidden bg-white img-fallback">
                    <img
                      className="w-full h-full object-cover transition-opacity duration-500"
                      src={selectedProduct.gallery[activeThumb]}
                      alt={pick(selectedProduct.name)}
                      onError={imgFallback}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-3 mt-3">
                    {selectedProduct.gallery.map((src, i) => (
                      <button
                        key={src}
                        onClick={() => setActiveThumb(i)}
                        className={`aspect-square overflow-hidden ${activeThumb === i ? 'border border-gold' : 'border border-pearl'} img-fallback`}
                      >
                        <img className="w-full h-full object-cover" src={src} alt="" onError={imgFallback} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="reveal reveal-delay-1">
                  <Eyebrow>{pick(selectedProduct.eyebrow)}</Eyebrow>
                  <GoldRule className="mt-4" />
                  <h1 className="font-serif text-5xl md:text-6xl text-ink mt-6 leading-[1.05]">{pick(selectedProduct.name)}</h1>
                  <p className="font-serif italic text-mist text-lg mt-3">{pick(selectedProduct.tagline)}</p>

                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-center">
                    {selectedProduct.stats.map((s, i) => (
                      <div key={i} className="bg-white border border-pearl p-4">
                        <p className="font-serif text-base md:text-lg text-gold leading-snug">{statVal(s.value)}</p>
                        <p className="eyebrow !text-graphite text-[0.6rem] mt-1">{pick(s.label)}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-graphite mt-8 leading-relaxed">{pick(selectedProduct.description)}</p>

                  <div className="mt-10">
                    <Eyebrow>{t('Presentaciones disponibles — toca para elegir', 'Available options — tap to select')}</Eyebrow>
                    <div className="grid grid-cols-2 gap-3 mt-5">
                      {selectedProduct.variants.map((v) => (
                        <button
                          key={v.name}
                          type="button"
                          onClick={() => setPdSelectedVariant(v.name)}
                          className={`text-left border p-4 transition-colors ${pdSelectedVariant === v.name ? 'border-gold bg-cream' : 'border-pearl hover:border-gold'}`}
                        >
                          <p className="font-serif text-lg text-ink">{v.name}</p>
                          <p className="text-mist text-sm">{pick(v.detail)}</p>
                          <p className="font-price text-gold text-sm mt-1">{formatPrice(v.price)}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {(() => {
                    const pdVariant = selectedProduct.variants.find((v) => v.name === pdSelectedVariant) || selectedProduct.variants[0];
                    return (
                      <div className="mt-8">
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center border border-pearl">
                            <button type="button" onClick={() => setPdQty((q) => Math.max(1, q - 1))} className="w-10 h-10 text-lg text-ink hover:bg-cream" aria-label="-">−</button>
                            <span className="w-10 text-center font-price text-ink">{pdQty}</span>
                            <button type="button" onClick={() => setPdQty((q) => Math.min(20, q + 1))} className="w-10 h-10 text-lg text-ink hover:bg-cream" aria-label="+">+</button>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              addToCart(selectedProduct.id, pdVariant.name, pdQty);
                              setPdQty(1);
                              setPdAddFeedback(true);
                              clearTimeout(pdFeedbackTimer.current);
                              pdFeedbackTimer.current = setTimeout(() => setPdAddFeedback(false), 1800);
                            }}
                            className="btn-gold flex-grow sm:flex-grow-0"
                          >
                            {t('Añadir al Carrito', 'Add to Cart')}
                          </button>
                          {pdAddFeedback && (
                            <span className="text-xs tracking-[0.14em] uppercase text-gold">{t('✓ Agregado', '✓ Added')}</span>
                          )}
                        </div>
                        <p className="text-mist text-sm mt-3">
                          {t('Seleccionado', 'Selected')}: <strong className="text-ink">{pdVariant.name}</strong>
                          {pdQty > 1 && <> × {pdQty} — <strong className="text-ink">{formatPrice(pdVariant.price * pdQty)}</strong></>}
                        </p>
                      </div>
                    );
                  })()}

                  <div className="flex flex-wrap gap-4 mt-6">
                    <button onClick={() => go('precios')} className="btn-outline">{t('Ver Precios', 'View Pricing')}</button>
                    <button onClick={() => go('contacto')} className="btn-outline">{t('Hablar con Concierge', 'Contact Concierge')}</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {selectedProduct.benefits && selectedProduct.benefits.length > 0 && (
            <section className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto reveal">
                  <Eyebrow>{t('Beneficios', 'Benefits')}</Eyebrow>
                  <GoldRule center className="mt-4" />
                  <h2 className="font-serif text-4xl text-ink mt-8">{t('Diseñado en torno a ti.', 'Designed around you.')}</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                  {selectedProduct.benefits.map((b, i) => (
                    <div key={i} className={`bg-cream p-8 reveal reveal-delay-${i % 4}`}>
                      <Eyebrow>{String(i + 1).padStart(2, '0')}</Eyebrow>
                      <h3 className="font-serif text-xl text-ink mt-3">{pick(b.title)}</h3>
                      <p className="text-graphite text-sm mt-3 leading-relaxed">{pick(b.text)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="py-24 bg-cream">
            <div className="max-w-5xl mx-auto px-6">
              <div className="text-center reveal">
                <Eyebrow>{t('Especificaciones', 'Specifications')}</Eyebrow>
                <GoldRule center className="mt-4" />
                <h2 className="font-serif text-4xl text-ink mt-8">{t('Cada detalle, documentado.', 'Every detail, documented.')}</h2>
              </div>
              <div className="bg-white mt-16 overflow-hidden reveal">
                <div className="grid grid-cols-2 bg-gold text-white text-xs tracking-[0.22em] uppercase font-semibold">
                  <div className="p-4">{t('Presentación', 'Option')}</div>
                  <div className="p-4">{t('Detalle', 'Detail')}</div>
                </div>
                {selectedProduct.variants.map((v, i) => (
                  <div key={v.name} className={`grid grid-cols-2 border-b border-pearl ${i % 2 === 1 ? 'bg-pearl/30' : ''}`}>
                    <div className="p-4 font-serif text-lg text-ink">{v.name}</div>
                    <div className="p-4 text-graphite text-sm tracking-wide" style={{ fontFeatureSettings: "'tnum' 1, 'lnum' 1" }}>{pick(v.detail)}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {selectedProduct.faqs.length > 0 && (
            <section className="py-24 bg-white">
              <div className="max-w-3xl mx-auto px-6">
                <div className="text-center reveal">
                  <Eyebrow>{t('Preguntas', 'Questions')}</Eyebrow>
                  <GoldRule center className="mt-4" />
                  <h2 className="font-serif text-4xl text-ink mt-8">{t('Sobre este producto.', 'About this product.')}</h2>
                </div>
                <div className="mt-14">
                  {selectedProduct.faqs.map((f, i) => (
                    <FaqItem
                      key={i}
                      id={`pd-${selectedProduct.id}-${i}`}
                      q={pick(f.q)}
                      a={pick(f.a)}
                      isOpen={!!openFaqs[`pd-${selectedProduct.id}-${i}`]}
                      onToggle={toggleFaq}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      )}

      {/* ============================================ */}
      {/* ============== TECNOLOGÍA ================== */}
      {/* ============================================ */}
      {page === 'tecnologia' && (
        <main className="page-fade">
          <section className="relative h-[60vh] min-h-[460px] overflow-hidden">
            <div className="absolute inset-0 img-fallback">
              <img className="absolute inset-0 w-full h-full object-cover kenburns" src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=2000&q=85" alt="" onError={imgFallback} />
              <div className="absolute inset-0 bg-black/60" />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
              <Eyebrow light className="reveal">{t('Tecnología', 'Technology')}</Eyebrow>
              <GoldRule className="mt-5 reveal reveal-delay-1" />
              <h1 className="text-white font-serif text-5xl md:text-7xl mt-8 leading-[1.05] max-w-3xl reveal reveal-delay-1">
                {t('La ciencia del descanso, en capas.', 'The science of sleep, layered.')}
              </h1>
            </div>
          </section>

          <section className="py-24 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
              <div className="reveal">
                <Eyebrow>{t('Construcción', 'Construction')}</Eyebrow>
                <GoldRule className="mt-4" />
                <h2 className="font-serif text-4xl md:text-5xl text-ink mt-8 leading-tight">{t('Cinco capas, un único propósito.', 'Five layers, one purpose.')}</h2>
                <p className="text-graphite mt-6 leading-relaxed">
                  {t(
                    'Desde la tela de enfriamiento transpirable en la parte superior hasta el núcleo de resortes encapsulados en la base — cada capa está diseñada, probada y refinada para ofrecer un descanso perfecto.',
                    'From the breathable cooling fabric on top to the encapsulated spring core at the base — every layer is engineered, tested and refined to deliver perfect rest.'
                  )}
                </p>
              </div>
              <div className="space-y-2 reveal reveal-delay-1">
                <Layer num="01" title={t('Tela de Enfriamiento', 'Cooling Fabric')} dim="3 mm" />
                <Layer num="02" title={t('Gel Memory Foam', 'Gel Memory Foam')} dim="3 cm" ml={16} />
                <Layer num="03" title={t('Memory Foam 40D', 'Memory Foam 40D')} dim="5 cm" ml={32} />
                <Layer num="04" title={t('Memory Foam 35D', 'Memory Foam 35D')} dim="5 cm" ml={48} />
                <Layer num="05" title={t('Resortes Encapsulados', 'Encapsulated Springs')} dim="14 cm" ml={64} dark />
              </div>
            </div>
          </section>

          <section className="py-24 md:py-32 bg-cream">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {techGridItems(t).map((it, i) => (
                  <div key={i} className={`bg-white p-10 reveal ${i > 0 ? `reveal-delay-${i % 3}` : ''}`}>
                    <div className="w-12 h-12 border border-gold flex items-center justify-center text-gold">{it.icon}</div>
                    <h3 className="font-serif text-2xl text-ink mt-6">{it.title}</h3>
                    <p className="text-graphite mt-3 leading-relaxed text-sm">{it.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 bg-ink text-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto reveal">
                <Eyebrow light>{t('Certificaciones', 'Certifications')}</Eyebrow>
                <GoldRule center className="mt-4" />
                <h2 className="font-serif text-4xl mt-8">{t('Certificación internacional.', 'Internationally certified.')}</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8 mt-16">
                {[
                  ['ISO 9001', t('Estándar internacional de gestión de calidad.', 'International quality management standard.')],
                  ['OEKO-TEX®', t('Textiles libres de sustancias nocivas.', 'Textiles tested for harmful substances.')],
                  ['Sanilized®', t('Protección antimicrobiana activa.', 'Active antimicrobial protection.')],
                ].map(([name, desc], i) => (
                  <div key={name} className={`border border-white/15 p-10 text-center reveal reveal-delay-${i}`}>
                    <p className="font-serif text-3xl text-gold-light">{name}</p>
                    <p className="text-white/70 text-sm mt-4 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ============================================ */}
      {/* ================ PRECIOS =================== */}
      {/* ============================================ */}
      {page === 'precios' && (
        <main className="page-fade">
          <section className="bg-cream pt-28 pb-16">
            <div className="max-w-7xl mx-auto px-6 text-center reveal">
              <Eyebrow>{t('Precios Transparentes', 'Transparent Pricing')}</Eyebrow>
              <GoldRule center className="mt-4" />
              <h1 className="font-serif text-5xl md:text-6xl text-ink mt-8 leading-[1.05]">
                {t(<>Cada producto.<br />Cada medida perfecta.</>, <>Every product.<br />Every perfect size.</>)}
              </h1>
              <p className="text-graphite mt-6 leading-relaxed max-w-xl mx-auto">
                {t(
                  'Cada colchón Nuvela incluye entrega white-glove, prueba de 100 noches y garantía de 10 años — sin costo adicional.',
                  'Every Nuvela mattress includes white-glove delivery, a 100-night trial and a 10-year warranty — at no additional cost.'
                )}
              </p>
            </div>
          </section>

          {PRODUCTS.map((p, pi) => (
            <section
              key={p.id}
              className={`relative py-20 md:py-28 bg-cover bg-center bg-no-repeat overflow-hidden ${pi > 0 ? 'border-t border-pearl' : ''}`}
              style={{ backgroundImage: `url('${PRODUCT_TEXTURES[p.id] || 'images/colchas.png'}')` }}
            >
              <div className="absolute inset-0 bg-white/55" />
              <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="text-center mb-10">
                  <Eyebrow>{pick(p.eyebrow)}</Eyebrow>
                  <h2 className="font-serif text-3xl md:text-4xl text-ink mt-3">{pick(p.name)}</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {p.variants.map((v, i) => (
                    <div
                      key={v.name}
                      className={`price-card bg-white p-8 reveal reveal-delay-${i % 4} flex flex-col relative ${v.featured ? 'featured border-2' : 'border border-pearl'}`}
                    >
                      {v.featured && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-[0.65rem] tracking-[0.32em] uppercase px-4 py-1.5">
                          {t('Más Vendido', 'Most Popular')}
                        </span>
                      )}
                      <Eyebrow>{pick(p.eyebrow)}</Eyebrow>
                      <h3 className="font-serif text-3xl text-ink mt-3">{v.name}</h3>
                      <div className="my-8">
                        <p className="text-mist text-xs tracking-[0.18em] uppercase">{t('Desde', 'From')}</p>
                        <p className={`font-price text-5xl mt-1 ${v.featured ? 'text-gold' : 'text-ink'}`}>
                          {v.price ? `Q${v.price.toLocaleString('en-US')}` : t('Próximamente', 'Coming soon')}
                        </p>
                      </div>
                      <ul className="space-y-2 text-sm text-graphite flex-grow">
                        <li className="flex gap-2"><span className="text-gold">◆</span><span>{pick(v.detail)}</span></li>
                        {p.stats.map((s, si) => (
                          <li key={si} className="flex gap-2"><span className="text-gold">◆</span><span><strong className="text-ink">{pick(s.label)}:</strong> {statVal(s.value)}</span></li>
                        ))}
                      </ul>
                      <button
                        onClick={() => { addToCart(p.id, v.name, 1); flashAdded(`${p.id}__${v.name}`); }}
                        className={`mt-8 w-full ${v.featured ? 'btn-gold' : 'btn-outline'}`}
                      >
                        {addedFeedback[`${p.id}__${v.name}`] ? t('✓ Agregado', '✓ Added') : t('Añadir al Carrito', 'Add to Cart')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}

          <section className="py-24 bg-white">
            <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
              <div className="reveal">
                <Eyebrow>{t('Financiamiento', 'Financing')}</Eyebrow>
                <GoldRule className="mt-4" />
                <h2 className="font-serif text-4xl text-ink mt-8 leading-tight">{t('Paga a tu manera.', 'Pay your way.')}</h2>
                <p className="text-graphite mt-6 leading-relaxed">
                  {t(
                    'Opciones de financiamiento flexibles. Hasta 12 pagos mensuales sin intereses con bancos participantes. Habla con nuestro equipo concierge para conocer los términos completos.',
                    'Flexible financing options available. Up to 12 interest-free monthly payments with participating banks. Speak to our concierge team for full terms.'
                  )}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 reveal reveal-delay-1">
                {[3, 6, 9, 12].map((m) => (
                  <div key={m} className="bg-cream p-6 text-center">
                    <p className="font-serif text-2xl text-gold">{m}</p>
                    <p className="text-xs tracking-[0.2em] uppercase text-graphite mt-1">{t('Meses', 'Months')}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ============================================ */}
      {/* ================ ENTREGAS ================== */}
      {/* ============================================ */}
      {page === 'entregas' && (
        <main className="page-fade">
          <section className="relative h-[55vh] min-h-[420px] overflow-hidden">
            <div className="absolute inset-0 img-fallback">
              <img className="absolute inset-0 w-full h-full object-cover kenburns" src="https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?w=2000&q=85" alt="" onError={imgFallback} />
              <div className="absolute inset-0 bg-black/55" />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
              <Eyebrow light className="reveal">{t('Entregas', 'Delivery')}</Eyebrow>
              <GoldRule className="mt-5 reveal reveal-delay-1" />
              <h1 className="text-white font-serif text-5xl md:text-6xl mt-8 leading-[1.05] max-w-3xl reveal reveal-delay-1">
                {t(<>Servicio white-glove.<br />De nuestra puerta a la tuya.</>, <>White-glove service.<br />From our door to yours.</>)}
              </h1>
            </div>
          </section>

          <section className="py-24 md:py-32 bg-white">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
              {[
                ['01', t('Áreas de Cobertura', 'Delivery Areas'), t('Entrega white-glove gratuita en Ciudad de Guatemala y área metropolitana. Servicio nacional disponible — pueden aplicar cargos adicionales fuera del área metropolitana.', 'Free white-glove delivery throughout Guatemala City and metropolitan area. Nationwide service available — additional charges may apply outside the metropolitan zone.')],
                ['02', t('Tiempos Estimados', 'Estimated Times'), t('Área metropolitana: 3–5 días hábiles. Departamentos: 5–10 días hábiles. Nuestro concierge confirmará la ventana de entrega al confirmar tu pedido.', 'Metropolitan zone: 3–5 business days. Departments: 5–10 business days. Our concierge will confirm your delivery window once your order is placed.')],
                ['03', t('La Experiencia', 'The Experience'), t('Entregamos, instalamos en la habitación de tu preferencia y retiramos todo el empaque. Retiro opcional de tu colchón anterior sin costo adicional.', 'We deliver, install in your room of choice and remove all packaging. Optional removal of your previous mattress at no extra charge.')],
              ].map(([n, ti, d], i) => (
                <div key={n} className={`reveal reveal-delay-${i}`}>
                  <p className="font-serif text-4xl text-gold">{n}</p>
                  <h3 className="font-serif text-2xl text-ink mt-3">{ti}</h3>
                  <p className="text-graphite mt-4 leading-relaxed text-sm">{d}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="py-24 md:py-32 bg-cream">
            <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
              <div className="reveal">
                <Eyebrow>{t('Empaque', 'Packaging')}</Eyebrow>
                <GoldRule className="mt-4" />
                <h2 className="font-serif text-4xl text-ink mt-8 leading-tight">{t('Una primera impresión que vale conservar.', 'A first impression worth keeping.')}</h2>
                <p className="text-graphite mt-6 leading-relaxed">
                  {t(
                    'Cada colchón Nuvela llega en un empaque premium protector — sin plásticos innecesarios, diseñado para resguardar el producto, y elegante como un unboxing.',
                    'Each Nuvela mattress arrives in protective premium packaging — free of unnecessary plastics, designed to safeguard the product, and elegant enough to feel like an unboxing.'
                  )}
                </p>
              </div>
              <div className="aspect-[4/3] overflow-hidden bg-white reveal reveal-delay-1 img-fallback">
                <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&q=85" alt="" onError={imgFallback} />
              </div>
            </div>
          </section>

          <section className="py-24 bg-white">
            <div className="max-w-3xl mx-auto px-6">
              <div className="text-center reveal">
                <Eyebrow>{t('FAQ Entregas', 'Delivery FAQ')}</Eyebrow>
                <GoldRule center className="mt-4" />
                <h2 className="font-serif text-4xl text-ink mt-8">{t('Preguntas frecuentes.', 'Common questions.')}</h2>
              </div>
              <div className="mt-12">
                {[
                  { q: t('¿Cobran por la entrega?', 'Do you charge for delivery?'), a: t('No. La entrega white-glove está incluida sin costo en el área metropolitana de Ciudad de Guatemala.', 'No. White-glove delivery is included at no charge within the Guatemala City metropolitan area.') },
                  { q: t('¿Pueden retirar mi colchón anterior?', 'Can you remove my old mattress?'), a: t('Sí, sin costo. Solo solicita el servicio al programar tu entrega.', 'Yes, free of charge. Just request the service when scheduling your delivery.') },
                  { q: t('¿Qué pasa si no estoy en casa para la entrega?', "What if I'm not home for delivery?"), a: t('No hay problema. Nuestro concierge confirmará una ventana de entrega de 2 horas con anticipación y podemos reagendar si es necesario.', "No problem. Our concierge will confirm a 2-hour delivery window in advance and we'll reschedule if needed.") },
                ].map((f, i) => (
                  <FaqItem key={i} id={`del-${i}`} q={f.q} a={f.a} isOpen={!!openFaqs[`del-${i}`]} onToggle={toggleFaq} />
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ============================================ */}
      {/* ================ AGENDA TU CITA ============= */}
      {/* ============================================ */}
      {page === 'cita' && (
        <main className="page-fade">
          <section className="bg-cream pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-6 text-center reveal">
              <Eyebrow>{t('Agenda tu Cita', 'Book an Appointment')}</Eyebrow>
              <GoldRule center className="mt-4" />
              <h1 className="font-serif text-5xl md:text-6xl text-ink mt-8 leading-[1.05]">{t('Visítanos o agenda una asesoría.', 'Visit us, or talk to an advisor.')}</h1>
              <p className="text-graphite mt-6 leading-relaxed max-w-xl mx-auto">
                {t('Cuéntanos qué buscas y agenda tu horario con un clic — Lunes a Sábado, de 9:00am a 5:00pm, citas de una hora.', "Tell us what you're looking for and book your time in one click — Monday to Saturday, 9:00am to 5:00pm, one-hour appointments.")}
              </p>
            </div>
          </section>

          {/* STEP 1: quick intent form -> notifies the business WhatsApp */}
          <section className="pb-20 bg-white border-t border-pearl">
            <div className="max-w-2xl mx-auto px-6 pt-16">
              <p className="font-serif text-3xl text-gold">01</p>
              <h2 className="font-serif text-2xl md:text-3xl text-ink mt-3">{t('Cuéntanos qué buscas', "Tell us what you're looking for")}</h2>
              <p className="text-graphite text-sm mt-3 leading-relaxed">
                {t('Esto nos avisa por WhatsApp lo que te interesa, para tenerlo listo antes de tu visita.', "This sends your interest straight to our WhatsApp, so we're ready before your visit.")}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                <div>
                  <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite">{t('Nombre Completo *', 'Full Name *')}</label>
                  <input
                    type="text"
                    autoComplete="name"
                    value={citaForm.nombre}
                    onChange={(e) => updateCitaField('nombre', e.target.value)}
                    className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite">{t('Teléfono *', 'Phone *')}</label>
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={citaForm.telefono}
                    onChange={(e) => updateCitaField('telefono', e.target.value)}
                    className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite">{t('Producto o tamaño de tu interés', "Product or size you're interested in")}</label>
                  <select
                    value={citaForm.interes}
                    onChange={(e) => updateCitaField('interes', e.target.value)}
                    className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none"
                  >
                    {CITA_INTERES_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{t(o.es, o.en)}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite">{t('Comentarios (opcional)', 'Notes (optional)')}</label>
                  <input
                    type="text"
                    value={citaForm.comentarios}
                    onChange={(e) => updateCitaField('comentarios', e.target.value)}
                    className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none"
                  />
                </div>
              </div>

              {citaError && <p className="text-sm mt-5" style={{ color: '#B3261E' }}>{citaError}</p>}
              <button onClick={requestCitaViaWhatsApp} className="btn-gold w-full mt-6 !py-4 !text-sm">
                {t('Enviar por WhatsApp', 'Send via WhatsApp')}
              </button>
            </div>
          </section>

          {/* STEP 2: choose an advisor -> their own live Google Calendar */}
          <section className="pb-24 md:pb-32 bg-cream border-t border-pearl">
            <div className="max-w-4xl mx-auto px-6 pt-16">
              <p className="font-serif text-3xl text-gold">02</p>
              <h2 className="font-serif text-2xl md:text-3xl text-ink mt-3">{t('Elige tu asesor y tu horario', 'Choose your advisor and your time')}</h2>
              <p className="text-graphite text-sm mt-3 leading-relaxed">
                {t('Lunes a Sábado, 9:00am – 5:00pm · Citas de una hora. Se abre en una pestaña nueva y recibirás un correo de confirmación apenas agendes.', "Monday to Saturday, 9:00am – 5:00pm · One-hour appointments. It opens in a new tab, and you'll get an email confirmation as soon as you book.")}
              </p>

              <div className="mt-8 grid sm:grid-cols-3 gap-6">
                {CITA_ADVISORS.map((advisor) => (
                  <div key={advisor.name} className="border border-pearl bg-white p-6 text-center flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-gold/15 text-gold flex items-center justify-center font-serif text-xl">
                      {(advisor.name || '?').trim().charAt(0).toUpperCase() || '?'}
                    </div>
                    <p className="font-serif text-lg text-ink mt-4">{advisor.name}</p>
                    <p className="text-graphite text-xs uppercase tracking-wide mt-1">{advisor.role[lang]}</p>
                    {advisor.url ? (
                      <a href={advisor.url} target="_blank" rel="noopener noreferrer" className="btn-outline mt-5 !py-2.5 !px-5 !text-[0.7rem] w-full">{t('Ver horarios y agendar', 'View times and book')}</a>
                    ) : (
                      <>
                        <a href={`https://wa.me/${advisor.whatsapp || WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="btn-outline mt-5 !py-2.5 !px-5 !text-[0.7rem] w-full">{t('Escríbenos por WhatsApp', 'Message us on WhatsApp')}</a>
                        <p className="text-graphite/50 text-[0.65rem] mt-2">{t('Calendario próximamente', 'Calendar coming soon')}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ============================================ */}
      {/* ================ RESEÑAS ==================== */}
      {/* ============================================ */}
      {page === 'resenas' && (
        <main className="page-fade">
          <section className="bg-cream pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-6 text-center reveal">
              <Eyebrow>{t('Reseñas', 'Reviews')}</Eyebrow>
              <GoldRule center className="mt-4" />
              <h1 className="font-serif text-5xl md:text-6xl text-ink mt-8 leading-[1.05]">{t('Lo que dicen quienes ya duermen mejor.', 'What people already sleeping better are saying.')}</h1>
              <p className="text-graphite mt-6 leading-relaxed max-w-xl mx-auto">{t('Reseñas reales, directo de nuestro perfil de Google.', 'Real reviews straight from our Google Business profile.')}</p>
            </div>
          </section>

          <section className="pb-24 md:pb-32 bg-white border-t border-pearl">
            <div className="max-w-5xl mx-auto px-6 pt-16">
              {(!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACE_ID) ? (
                <div className="border border-pearl bg-cream p-10 text-center">
                  <p className="font-serif text-xl text-ink">{t('Muy pronto verás aquí nuestras reseñas de Google.', 'Our Google reviews will appear here soon.')}</p>
                  <p className="text-graphite text-sm mt-3">{t('Mientras tanto, puedes verlas directamente en nuestro perfil de Google.', 'In the meantime, you can see them directly on our Google profile.')}</p>
                  {GOOGLE_MAPS_PROFILE_URL && (
                    <a href={GOOGLE_MAPS_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="btn-gold mt-6 inline-block">{t('Ver reseñas en Google', 'See reviews on Google')}</a>
                  )}
                </div>
              ) : reviewsStatus === 'error' ? (
                <div className="border border-pearl bg-cream p-10 text-center">
                  <p className="font-serif text-xl text-ink">{t('No pudimos cargar las reseñas justo ahora.', "We couldn't load reviews right now.")}</p>
                  <p className="text-graphite text-sm mt-3">{t('Puedes verlas directamente en nuestro perfil de Google.', 'You can see them directly on our Google profile.')}</p>
                  {(GOOGLE_MAPS_PROFILE_URL || (placeDetails && placeDetails.url)) && (
                    <a href={GOOGLE_MAPS_PROFILE_URL || placeDetails.url} target="_blank" rel="noopener noreferrer" className="btn-gold mt-6 inline-block">{t('Ver reseñas en Google', 'See reviews on Google')}</a>
                  )}
                </div>
              ) : placeDetails ? (
                <>
                  <div className="border border-pearl bg-cream p-8 md:p-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-10 text-center sm:text-left">
                    <div className="flex items-center gap-4">
                      <span className="font-serif text-5xl text-ink">{(placeDetails.rating || 0).toFixed(1)}</span>
                      <div>
                        <div className="text-gold text-lg tracking-wide">{starString(placeDetails.rating)}</div>
                        <p className="text-graphite text-xs mt-1">{placeDetails.user_ratings_total || 0} {t('reseñas en Google', 'reviews on Google')}</p>
                      </div>
                    </div>
                    {(GOOGLE_MAPS_PROFILE_URL || placeDetails.url) && (
                      <a href={GOOGLE_MAPS_PROFILE_URL || placeDetails.url} target="_blank" rel="noopener noreferrer" className="btn-outline shrink-0">{t('Ver todas en Google', 'See all on Google')}</a>
                    )}
                  </div>
                  {(placeDetails.reviews || []).length ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(placeDetails.reviews || []).slice(0, 5).map((r, i) => {
                        const text = (r.text || '').trim();
                        const truncated = text.length > 220 ? text.slice(0, 217).trim() + '…' : text;
                        return (
                          <div key={i} className="border border-pearl bg-white p-6 flex flex-col h-full">
                            <div className="flex items-center gap-3">
                              {r.profile_photo_url ? (
                                <img src={r.profile_photo_url} alt="" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gold/15 text-gold flex items-center justify-center font-serif text-sm">{(r.author_name || '?').trim().charAt(0).toUpperCase() || '?'}</div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-ink">{r.author_name || t('Cliente de Google', 'Google customer')}</p>
                                <p className="text-graphite text-xs">{r.relative_time_description || ''}</p>
                              </div>
                            </div>
                            <div className="text-gold text-sm mt-3 tracking-wide">{starString(r.rating)}</div>
                            <p className="text-graphite text-sm mt-3 leading-relaxed flex-1">{truncated}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-graphite text-sm text-center">{t('Aún no hay reseñas para mostrar.', 'No reviews to show yet.')}</p>
                  )}
                  <p className="text-graphite/50 text-[0.65rem] text-center mt-8">{t('Reseñas mostradas a través de Google.', 'Reviews shown via Google.')}</p>
                </>
              ) : (
                <p className="text-graphite text-sm text-center py-10">{t('Cargando reseñas…', 'Loading reviews…')}</p>
              )}
            </div>
          </section>
        </main>
      )}

      {/* ============================================ */}
      {/* ================== FAQ ===================== */}
      {/* ============================================ */}
      {page === 'faq' && (
        <main className="page-fade">
          <section className="bg-cream pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-6 text-center reveal">
              <Eyebrow>{t('Preguntas Frecuentes', 'Frequently Asked')}</Eyebrow>
              <GoldRule center className="mt-4" />
              <h1 className="font-serif text-5xl md:text-6xl text-ink mt-8 leading-[1.05]">{t('Respuestas, por adelantado.', 'Answers, in advance.')}</h1>
              <p className="text-graphite mt-6 max-w-xl mx-auto leading-relaxed">
                {t('Todo lo que podrías querer saber — sobre Nuvela, nuestros materiales, nuestro servicio y nuestra promesa.', 'Everything you might want to know — about Nuvela, our materials, our service and our promise.')}
              </p>
            </div>
          </section>

          <section className="bg-white py-20">
            <div className="max-w-3xl mx-auto px-6">
              {faqGroups(t).map((group, gi) => (
                <div key={gi} className={gi > 0 ? 'mt-12' : ''}>
                  <Eyebrow className="mb-4">{group.title}</Eyebrow>
                  {group.items.map((it, ii) => (
                    <FaqItem
                      key={ii}
                      id={`faq-${gi}-${ii}`}
                      q={it.q}
                      a={it.a}
                      isOpen={!!openFaqs[`faq-${gi}-${ii}`]}
                      onToggle={toggleFaq}
                    />
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="py-20 bg-ink text-white">
            <div className="max-w-3xl mx-auto px-6 text-center reveal">
              <p className="font-serif text-3xl">{t('¿Aún tienes preguntas?', 'Still have questions?')}</p>
              <p className="text-white/70 mt-4">{t('Habla con nuestro concierge — respondemos en horas.', 'Speak with our concierge — we respond within hours.')}</p>
              <button onClick={() => go('contacto')} className="btn-gold mt-8">{t('Contáctanos', 'Contact Us')}</button>
            </div>
          </section>
        </main>
      )}

      {/* ============================================ */}
      {/* ================ CONTACTO ================== */}
      {/* ============================================ */}
      {page === 'contacto' && (
        <main className="page-fade">
          <section className="pt-28 pb-16 bg-cream">
            <div className="max-w-4xl mx-auto px-6 text-center reveal">
              <Eyebrow>{t('Contáctanos', 'Contact')}</Eyebrow>
              <GoldRule center className="mt-4" />
              <h1 className="font-serif text-5xl md:text-6xl text-ink mt-8 leading-[1.05]">{t('Hablemos del descanso.', "Let's talk sleep.")}</h1>
              <p className="text-graphite mt-6 max-w-xl mx-auto leading-relaxed">
                {t('Nuestro equipo concierge está aquí para ayudarte — por mensaje, llamada o en persona.', "Our concierge team is here to help — by message, by call, or in person.")}
              </p>
            </div>
          </section>

          <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
              <form
                className="reveal"
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSubmitted(true);
                }}
              >
                <Eyebrow>{t('Envíanos un mensaje', 'Send a message')}</Eyebrow>
                <GoldRule className="mt-4" />
                {!formSubmitted ? (
                  <div className="mt-10 space-y-6">
                    <input className="luxe-input" type="text" placeholder={t('Nombre completo', 'Full name')} required />
                    <input className="luxe-input" type="email" placeholder={t('Correo electrónico', 'Email')} required />
                    <input className="luxe-input" type="tel" placeholder={t('Teléfono (opcional)', 'Phone (optional)')} />
                    <select className="luxe-input" required defaultValue="">
                      <option value="" disabled>{t('Asunto', 'Subject')}</option>
                      <option>{t('Consulta de producto', 'Product inquiry')}</option>
                      <option>{t('Precios y financiamiento', 'Pricing & financing')}</option>
                      <option>{t('Entregas', 'Delivery')}</option>
                      <option>{t('Garantía', 'Warranty')}</option>
                      <option>{t('Otro', 'Other')}</option>
                    </select>
                    <textarea className="luxe-input" rows="4" placeholder={t('¿Cómo podemos ayudarte?', 'How can we help?')}></textarea>
                    <button className="btn-gold w-full md:w-auto mt-4" type="submit">{t('Enviar Mensaje', 'Send Message')}</button>
                  </div>
                ) : (
                  <div className="mt-10 p-6 border border-gold bg-cream">
                    <p className="font-serif text-xl text-ink">{t('Gracias.', 'Thank you.')}</p>
                    <p className="text-graphite mt-2 leading-relaxed">
                      {t('Tu mensaje fue recibido. Nuestro concierge se pondrá en contacto en menos de 24 horas.', 'Your message has been received. Our concierge will be in touch within 24 hours.')}
                    </p>
                  </div>
                )}
              </form>

              <div className="reveal reveal-delay-1">
                <Eyebrow>{t('Directo', 'Direct')}</Eyebrow>
                <GoldRule className="mt-4" />
                <div className="mt-10 space-y-8">
                  <a href="https://wa.me/50259661383" className="block group">
                    <p className="eyebrow !text-graphite">WhatsApp</p>
                    <p className="font-serif text-2xl text-ink mt-2 group-hover:text-gold transition-colors">+502 0000 0000</p>
                    <p className="text-mist text-sm mt-1">{t('Toca para chatear', 'Tap to chat')}</p>
                  </a>
                  <div>
                    <p className="eyebrow !text-graphite">{t('Correo', 'Email')}</p>
                    <a href="mailto:hola@nuvela.com.gt" className="font-serif text-2xl text-ink mt-2 hover:text-gold transition-colors block">hola@nuvela.com.gt</a>
                  </div>
                  <div>
                    <p className="eyebrow !text-graphite">{t('Teléfono', 'Phone')}</p>
                    <a href="tel:+50200000000" className="font-serif text-2xl text-ink mt-2 hover:text-gold transition-colors block">+502 0000 0000</a>
                  </div>
                  <div>
                    <p className="eyebrow !text-graphite">Showroom</p>
                    <p className="font-serif text-xl text-ink mt-2 leading-snug">
                      {t(<>Zona 14, Ciudad de Guatemala<br />Lun–Sáb · 10:00 — 19:00</>, <>Zona 14, Guatemala City<br />Mon–Sat · 10:00 — 19:00</>)}
                    </p>
                  </div>
                  <div>
                    <p className="eyebrow !text-graphite">Instagram</p>
                    <a href="https://instagram.com/Nuvela.gt" target="_blank" rel="noopener noreferrer" className="font-serif text-2xl text-ink mt-2 hover:text-gold transition-colors block">@Nuvela.gt</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-cream py-20">
            <div className="max-w-7xl mx-auto px-6">
              <Eyebrow className="text-center">{t('Encuéntranos', 'Find us')}</Eyebrow>
              <GoldRule center className="mt-4" />
              <div className="mt-10 aspect-[16/7] bg-graphite/10 relative overflow-hidden">
                <iframe
                  className="w-full h-full grayscale"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-90.55%2C14.58%2C-90.45%2C14.65&layer=mapnik&marker=14.6%2C-90.51"
                  title="Nuvela Showroom"
                />
                <div className="absolute top-6 left-6 bg-white p-5 max-w-xs">
                  <Eyebrow>Nuvela Showroom</Eyebrow>
                  <p className="font-serif text-lg text-ink mt-2 leading-snug">
                    {t(<>Zona 14<br />Ciudad de Guatemala</>, <>Zona 14<br />Guatemala City</>)}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ============================================ */}
      {/* ================ PRIVACIDAD ================ */}
      {/* ============================================ */}
      {page === 'privacidad' && (
        <main className="page-fade">
          <section className="pt-28 pb-16 bg-cream">
            <div className="max-w-4xl mx-auto px-6 reveal">
              <Eyebrow>Legal</Eyebrow>
              <GoldRule className="mt-4" />
              <h1 className="font-serif text-5xl text-ink mt-8 leading-[1.05]">{t('Política de Privacidad', 'Privacy Policy')}</h1>
              <p className="text-mist text-sm tracking-[0.18em] uppercase mt-6">{t('Última actualización · Mayo 2026', 'Last updated · May 2026')}</p>
            </div>
          </section>
          <section className="py-16 bg-white">
            <div className="max-w-3xl mx-auto px-6">
              <div className="space-y-8 text-graphite leading-loose">
                {privacySections(t).map((s, i) => (
                  <div key={i}>
                    <h2 className="font-serif text-2xl text-ink mb-3">{s.title}</h2>
                    <p>{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ============================================ */}
      {/* ================== FOOTER ================== */}
      {/* ============================================ */}
      <footer className="bg-ink text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <span className="wordmark text-2xl">NUVELA</span>
            <span className="block wordmark-sub mt-1 !text-gold-light">Italian Design</span>
            <p className="text-white/60 text-sm mt-6 leading-relaxed max-w-xs">
              {t('Colchones premium con diseño italiano. El descanso es el fundamento de una vida bien vivida.', 'Premium mattresses crafted in Italian style. Sleep is the foundation of a well-lived life.')}
            </p>
            <p className="font-serif italic text-gold-light text-sm mt-6">"Duerme Bien Siempre."</p>
          </div>
          <div>
            <Eyebrow light>{t('Explora', 'Explore')}</Eyebrow>
            <ul className="mt-6 space-y-3 text-white/70 text-sm">
              {['historia', 'producto', 'linea-hotelera', 'comparar', 'tecnologia', 'precios', 'carrito'].map((p) => {
                const item = navItems.find((n) => n.id === p);
                return (
                  <li key={p}><a onClick={() => go(p)} className="hover:text-gold-light cursor-pointer">{t(item.es, item.en)}</a></li>
                );
              })}
            </ul>
          </div>
          <div>
            <Eyebrow light>{t('Servicio', 'Service')}</Eyebrow>
            <ul className="mt-6 space-y-3 text-white/70 text-sm">
              {['entregas', 'cita', 'resenas', 'faq', 'contacto'].map((p) => {
                const item = navItems.find((n) => n.id === p);
                return (
                  <li key={p}><a onClick={() => go(p)} className="hover:text-gold-light cursor-pointer">{t(item.es, item.en)}</a></li>
                );
              })}
              <li><a onClick={() => go('privacidad')} className="hover:text-gold-light cursor-pointer">{t('Privacidad', 'Privacy Policy')}</a></li>
            </ul>
          </div>
          <div>
            <Eyebrow light>{t('Conecta', 'Connect')}</Eyebrow>
            <ul className="mt-6 space-y-3 text-white/70 text-sm">
              <li><a href="https://instagram.com/Nuvela.gt" target="_blank" rel="noopener noreferrer" className="hover:text-gold-light">Instagram · @Nuvela.gt</a></li>
              <li><a href="mailto:hola@nuvela.com.gt" className="hover:text-gold-light">hola@nuvela.com.gt</a></li>
              <li><a href="https://wa.me/50259661383" className="hover:text-gold-light">WhatsApp</a></li>
              <li><a href="tel:+50200000000" className="hover:text-gold-light">+502 0000 0000</a></li>
            </ul>
            <div className="flex gap-3 mt-6">
              <a href="https://instagram.com/Nuvela.gt" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" /></svg>
              </a>
              <a href="https://wa.me/50259661383" className="w-9 h-9 border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12a9 9 0 1 1-3.5-7.1L21 4l-1.1 3.5A9 9 0 0 1 21 12Z" /><path d="M9 9c0 5 3 8 7 8l-1-3-3-1-1 1c-1 0-3-2-3-3l1-1-1-3-3 0c0 1 0 1 0 2" /></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-white/50 text-xs tracking-[0.18em] uppercase">
          <span>© 2026 Nuvela · Italian Design · {t('Todos los derechos reservados', 'All rights reserved')}</span>
          <span>Crafted in Italian Style · nuvela.com.gt</span>
        </div>
      </footer>

      {/* WhatsApp floating */}
      <a
        href="https://wa.me/50259661383"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gold text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform float"
        aria-label="WhatsApp"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 12a9 9 0 1 1-3.5-7.1L21 4l-1.1 3.5A9 9 0 0 1 21 12Z" />
          <path d="M9 9c0 5 3 8 7 8l-1-3-3-1-1 1c-1 0-3-2-3-3l1-1-1-3-3 0c0 1 0 1 0 2" />
        </svg>
      </a>
    </div>
  );
}

/* =================== Data helpers =================== */

function whyNuvelaItems(t) {
  const Diamond = (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 3h12l4 6-10 12L2 9l4-6Z" /><path d="M2 9h20" /></svg>);
  const Truck = (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7h13l5 5v5h-2" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /><path d="M5 17h0M9 17h6" /></svg>);
  const Shield = (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z" /><path d="m9 12 2 2 4-4" /></svg>);
  const Cross = (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19" /></svg>);
  const Eye = (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12c2-3 5-5 9-5s7 2 9 5c-2 3-5 5-9 5s-7-2-9-5Z" /><circle cx="12" cy="12" r="2" /></svg>);
  const Clock = (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>);
  return [
    { icon: Diamond, title: t('Confort de Lujo', 'Luxury Comfort'), desc: t('Diseño italiano y materiales premium diseñados para una experiencia de descanso sin compromisos.', 'Italian design and premium materials engineered for an uncompromising sleep experience.') },
    { icon: Truck, title: t('Entrega White-Glove', 'White-Glove Delivery'), desc: t('Servicio de entrega premium en todo el país. Lo instalamos y retiramos el colchón anterior.', 'Premium concierge delivery service nationwide. We bring it in, set it up, take the old one out.') },
    { icon: Shield, title: t('Garantía 10 años', '10-Year Warranty'), desc: t('Respaldado por una década de cobertura ante defectos de fabricación. Construido para durar.', 'Backed by a decade of coverage against manufacturing defects. Built to last, guaranteed to perform.') },
    { icon: Cross, title: t('Certificaciones Internacionales', 'International Certifications'), desc: t('Gestión de calidad ISO 9001, textiles OEKO-TEX® y protección antimicrobiana Sanilized®.', 'ISO 9001 quality management, OEKO-TEX® textiles and Sanilized® antimicrobial protection.') },
    { icon: Eye, title: t('Innovación del Descanso', 'Modern Sleep Innovation'), desc: t('Investigación continua en materiales, ergonomía y regulación térmica para redefinir el descanso premium.', 'Continuous research in materials, ergonomics and thermal regulation to redefine premium sleep.') },
    { icon: Clock, title: t('Prueba 100 Noches', '100-Night Trial'), desc: t('Pruébalo durante 100 noches. Si no es perfecto, lo solucionamos.', "Sleep on it for 100 nights. If it isn't perfect, we'll make it right.") },
  ];
}

function techGridItems(t) {
  return [
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v3M12 19v3M5 5l2 2M17 17l2 2M2 12h3M19 12h3M5 19l2-2M17 7l2-2" /><circle cx="12" cy="12" r="4" /></svg>, title: t('Sistema de Enfriamiento', 'Cooling System'), desc: t('Tejido transpirable junto a memory foam con gel mantiene la temperatura corporal en el rango ideal de descanso.', 'Breathable knit fabric paired with gel-infused memory foam keeps body temperature in the ideal sleep range.') },
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7Z" /><circle cx="12" cy="12" r="3" /></svg>, title: t('Alivio de Presión', 'Pressure Relief'), desc: t('Espumas viscoelásticas multidensidad se moldean a tu cuerpo, dispersando la presión por toda la superficie.', 'Multi-density viscoelastic foams contour to your body, dispersing pressure across the sleep surface.') },
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h2v16H4zM10 4h2v16h-2zM16 4h2v16h-2z" /></svg>, title: t('Arquitectura de Resortes', 'Spring Architecture'), desc: t('Cientos de resortes individuales encapsulados responden a micro-movimientos — sostienen donde lo necesitas, ceden donde no.', "Hundreds of individually pocketed springs respond to micro-movements — supporting where you need it, yielding where you don't.") },
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12c4 0 4-4 8-4s4 4 8 4M3 16c4 0 4-4 8-4s4 4 8 4M3 8c4 0 4-4 8-4s4 4 8 4" /></svg>, title: t('Soporte Ergonómico', 'Ergonomic Support'), desc: t('La progresión de densidades alinea la columna y sostiene la curva natural del cuerpo.', 'Engineered density progression aligns the spine and supports the natural curve of the body.') },
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 4-4" /></svg>, title: t('Materiales Higiénicos', 'Hygienic Materials'), desc: t('Textiles certificados OEKO-TEX® y protección antimicrobiana Sanilized® / Actifresh — limpio, seguro y duradero.', 'OEKO-TEX® certified textiles and Sanilized® / Actifresh antimicrobial protection — clean, safe, durable.') },
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22V8M5 8h14M5 8l3-6h8l3 6" /></svg>, title: t('Oficio Italiano', 'Italian Craftsmanship'), desc: t('Cada colchón Nuvela está diseñado bajo estrictos estándares de diseño italiano — desde la selección de materiales hasta la última puntada.', 'Each Nuvela mattress is engineered to exacting Italian design standards — from material selection to final stitch.') },
  ];
}

function testimonialsData(t) {
  return [
    { quote: t('«La primera noche fue el sueño más profundo que he tenido en años. Nuvela no es un colchón — es un ritual.»', "“The first night was the deepest sleep I've had in years. Nuvela isn't a mattress — it's a ritual.”"), name: 'María Fernanda L.', meta: t('King · Ciudad de Guatemala', 'King · Guatemala City') },
    { quote: t('«Los resortes encapsulados se notan desde la primera noche. Mi pareja se mueve y yo no siento nada.»', '“The encapsulated springs are noticeable from night one. My partner moves and I feel nothing.”'), name: 'Andrés & Camila R.', meta: t('Queen · Antigua', 'Queen · Antigua') },
    { quote: t('«Fresco, con soporte, hermoso. La entrega white-glove de Nuvela fue tan elegante como el colchón mismo.»', "“Cool, supportive, beautiful. Nuvela's white-glove delivery was as elegant as the mattress itself.”"), name: 'Sofía P.', meta: t('Matrimonial · Quetzaltenango', 'Matrimonial · Quetzaltenango') },
  ];
}

function faqGroups(t) {
  return [
    {
      title: t('Garantía', 'Warranty'),
      items: [
        { q: t('¿Qué cubre la garantía?', 'What does the warranty cover?'), a: t('Nuestra garantía de 10 años cubre defectos de fabricación en materiales y mano de obra. Los términos completos se detallan en el documento de garantía que se entrega con tu colchón.', 'Our 10-year warranty covers manufacturing defects in materials and workmanship. Full terms are detailed in the warranty document delivered with your mattress.') },
        { q: t('¿Cómo activo mi garantía?', 'How do I activate my warranty?'), a: t('Tu garantía se activa automáticamente con la fecha de entrega. Conserva tu factura como prueba de compra.', 'Your warranty activates automatically with your delivery date. Keep your invoice as proof of purchase.') },
      ],
    },
    {
      title: t('Periodo de Prueba', 'Trial Period'),
      items: [
        { q: t('¿Cómo funciona la prueba de 100 noches?', 'How does the 100-night trial work?'), a: t('Duerme sobre tu Nuvela durante 100 noches. Si no es lo correcto para ti, contacta a nuestro concierge y arreglaremos un reemplazo o reembolso. Recomendamos al menos 30 noches para que tu cuerpo se adapte por completo.', "Sleep on your Nuvela for 100 nights. If it isn't right for you, contact our concierge and we'll arrange a replacement or refund. We recommend at least 30 nights for your body to fully adjust.") },
      ],
    },
    {
      title: t('Devoluciones', 'Returns'),
      items: [
        { q: t('¿Cuál es la política de devolución?', 'What is your return policy?'), a: t('Las devoluciones están disponibles dentro del periodo de prueba de 100 noches. El retiro es gratuito en el área metropolitana; los reembolsos se procesan en 7–10 días hábiles tras la devolución.', 'Returns are available within the 100-night trial period. Pickup is free in the metropolitan area; refunds are processed within 7–10 business days of return.') },
      ],
    },
    {
      title: t('Firmeza', 'Firmness'),
      items: [
        { q: t('¿Qué tan firme es el colchón Nuvela?', 'How firm is the Nuvela mattress?'), a: t('Nuvela está diseñado con firmeza media — la más cómoda de forma universal, ideal para todas las posiciones de descanso y la mayoría de tipos de cuerpo.', 'Nuvela is engineered as medium-firm — the most universally comfortable firmness, ideal for all sleep positions and most body types.') },
      ],
    },
    {
      title: t('Materiales', 'Materials'),
      items: [
        { q: t('¿Los materiales son seguros y certificados?', 'Are the materials safe and certified?'), a: t('Sí. Nuestros textiles están certificados OEKO-TEX® (libres de sustancias nocivas), el tratamiento antimicrobiano es Sanilized®, y la fabricación sigue estándares de calidad ISO 9001.', 'Yes. Our textiles are OEKO-TEX® certified (free of harmful substances), our antimicrobial treatment is Sanilized®, and our manufacturing follows ISO 9001 quality standards.') },
      ],
    },
    {
      title: t('Limpieza', 'Cleaning'),
      items: [
        { q: t('¿Cómo limpio y cuido mi colchón?', 'How do I clean and care for my mattress?'), a: t('Usa un protector de colchón de calidad. Para derrames: limpia con un paño seco y una solución suave. Aspira cada pocos meses. Gira el colchón cabecera-pies cada 3 meses para un desgaste uniforme.', 'Use a quality mattress protector. For spills: spot-clean with a dry cloth and a mild solution. Vacuum every few months. Rotate head-to-toe every 3 months for even wear.') },
      ],
    },
    {
      title: t('Entregas', 'Delivery'),
      items: [
        { q: t('¿Cuánto tarda la entrega?', 'How long does delivery take?'), a: t('3–5 días hábiles en el área metropolitana de Ciudad de Guatemala, 5–10 días hábiles en los departamentos. Confirmaremos una ventana específica tras tu pedido.', "3–5 business days within the Guatemala City metropolitan area, 5–10 business days for departments. We'll confirm a specific window after your order.") },
      ],
    },
  ];
}

function privacySections(t) {
  return [
    { title: t('Introducción', 'Introduction'), body: t('Nuvela · Italian Design respeta tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal cuando visitas nuvela.com.gt o interactúas con nuestros servicios.', 'Nuvela · Italian Design respects your privacy. This policy describes how we collect, use and protect personal information when you visit nuvela.com.gt or interact with our services.') },
    { title: t('Información que recopilamos', 'Information we collect'), body: t('Recopilamos la información que tú proporcionas directamente (como nombre, correo, teléfono y dirección de entrega) cuando nos contactas, realizas un pedido o te suscribes a nuestras comunicaciones. También podemos recopilar datos técnicos como tipo de navegador y páginas visitadas para mejorar nuestros servicios.', 'We collect information you provide directly (such as name, email, phone and delivery address) when you contact us, place an order or sign up for communications. We may also collect technical data such as browser type and pages visited to improve our services.') },
    { title: t('Uso de tu información', 'How we use your information'), body: t('Usamos tu información para procesar pedidos, comunicarnos contigo, brindar servicio al cliente, gestionar garantías y mejorar nuestros productos y sitio web. No vendemos tu información personal.', 'We use your information to fulfill orders, communicate with you, provide customer service, process warranty claims and improve our products and website. We do not sell your personal information.') },
    { title: t('Protección de datos', 'Data protection'), body: t('Implementamos medidas administrativas, técnicas y físicas para proteger la información personal contra acceso no autorizado, divulgación o pérdida.', 'We implement administrative, technical and physical safeguards to protect personal information against unauthorized access, disclosure or loss.') },
    { title: t('Tus derechos', 'Your rights'), body: t('Puedes solicitar acceso, corrección o eliminación de tu información personal en cualquier momento escribiéndonos a hola@nuvela.com.gt.', 'You may request access, correction or deletion of your personal information at any time by contacting us at hola@nuvela.com.gt.') },
    { title: t('Contacto', 'Contact'), body: t('Para preguntas sobre esta política de privacidad, por favor contacta hola@nuvela.com.gt.', 'For questions regarding this privacy policy, please contact hola@nuvela.com.gt.') },
  ];
}

/* =================== Global CSS =================== */

const globalCss = `
@import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500;600;700&display=swap');

:root {
  --gold: #B8963E;
  --gold-light: #D4B665;
  --gold-dark: #8E7430;
  --graphite: #3D3D3D;
  --mist: #9E9E9E;
  --cream: #FAF8F3;
  --pearl: #F5F1E8;
  --ink: #1A1A1A;
}

html { scroll-behavior: smooth; }
body {
  font-family: 'Jost', system-ui, sans-serif;
  color: var(--graphite);
  background: #ffffff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Brand color utilities (paired with Tailwind) */
.bg-gold { background-color: #B8963E !important; }
.bg-gold-light { background-color: #D4B665 !important; }
.bg-cream { background-color: #FAF8F3 !important; }
.bg-pearl { background-color: #F5F1E8 !important; }
.bg-ink { background-color: #1A1A1A !important; }
.bg-graphite { background-color: #3D3D3D !important; }
.bg-pearl-tinted { background-color: #FAF6EC; }
.text-gold { color: #B8963E !important; }
.text-gold-light { color: #D4B665 !important; }
.text-cream { color: #FAF8F3 !important; }
.text-pearl { color: #F5F1E8 !important; }
.text-ink { color: #1A1A1A !important; }
.text-graphite { color: #3D3D3D !important; }
.text-mist { color: #9E9E9E !important; }
.border-gold { border-color: #B8963E !important; }
.border-pearl { border-color: #F5F1E8 !important; }
.border-ink { border-color: #1A1A1A !important; }
.font-serif { font-family: 'Marcellus', Georgia, serif !important; }
.font-sans { font-family: 'Jost', system-ui, sans-serif !important; }
.font-mono { font-family: 'Courier New', monospace !important; }
.font-price { font-family: 'Jost', system-ui, sans-serif !important; font-weight: 700; font-feature-settings: 'lnum' 1, 'tnum' 1; letter-spacing: -0.005em; }

h1, h2, h3, h4 { font-family: 'Marcellus', Georgia, serif; font-weight: 400; }

.gold-rule { width: 64px; height: 1px; background: var(--gold); display: block; }

.eyebrow {
  font-family: 'Jost', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.32em;
  font-size: 0.72rem;
  color: var(--gold);
}

.btn-gold {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0.95rem 2rem;
  background: var(--gold); color: #fff;
  font-weight: 500; letter-spacing: 0.16em;
  text-transform: uppercase; font-size: 0.78rem;
  border: 1px solid var(--gold);
  transition: all .35s ease; cursor: pointer;
}
.btn-gold:hover { background: var(--gold-dark); border-color: var(--gold-dark); transform: translateY(-1px); }

.btn-outline {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0.95rem 2rem;
  background: transparent; color: var(--ink);
  font-weight: 500; letter-spacing: 0.16em;
  text-transform: uppercase; font-size: 0.78rem;
  border: 1px solid var(--ink);
  transition: all .35s ease; cursor: pointer;
}
.btn-outline:hover { background: var(--ink); color: #fff; transform: translateY(-1px); }

.btn-outline-light {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0.95rem 2rem;
  background: transparent; color: #fff;
  font-weight: 500; letter-spacing: 0.16em;
  text-transform: uppercase; font-size: 0.78rem;
  border: 1px solid rgba(255,255,255,0.7);
  transition: all .35s ease; cursor: pointer;
}
.btn-outline-light:hover { background: #fff; color: var(--ink); }

.link-gold {
  color: var(--gold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 0.72rem;
  font-weight: 600;
  position: relative;
  padding-bottom: 4px;
  cursor: pointer;
}
.link-gold::after {
  content: ''; position: absolute; bottom: 0; left: 0;
  width: 100%; height: 1px; background: var(--gold);
  transform-origin: right; transform: scaleX(1);
  transition: transform .4s ease;
}
.link-gold:hover::after { transform-origin: left; transform: scaleX(0); }

.nav-link {
  color: rgba(255,255,255,0.88);
  font-size: 0.74rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 500;
  padding: 6px 0;
  position: relative;
  cursor: pointer;
  transition: color .3s ease;
}
.nav-link::after {
  content: ''; position: absolute; bottom: 0; left: 50%;
  width: 0; height: 1px; background: var(--gold);
  transition: all .35s ease; transform: translateX(-50%);
}
.nav-link:hover, .nav-link.active { color: var(--gold); }
.nav-link:hover::after, .nav-link.active::after { width: 100%; }

.page-fade { animation: fadePage .55s ease both; }
@keyframes fadePage { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

.reveal { opacity: 0; transform: translateY(28px); transition: opacity .9s ease, transform .9s ease; will-change: opacity, transform; }
.reveal.visible { opacity: 1; transform: none; }
.reveal-delay-0 { transition-delay: 0s; }
.reveal-delay-1 { transition-delay: .1s; }
.reveal-delay-2 { transition-delay: .25s; }
.reveal-delay-3 { transition-delay: .4s; }
.reveal-delay-4 { transition-delay: .55s; }

@keyframes kenburns { from { transform: scale(1.04); } to { transform: scale(1.12); } }
.kenburns { animation: kenburns 18s ease-in-out infinite alternate; }

@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
.float { animation: float 6s ease-in-out infinite; }

.layer { position: relative; transition: transform .5s ease, box-shadow .5s ease; box-shadow: 0 1px 0 rgba(0,0,0,0.04); }
.layer:hover { transform: translateX(8px); box-shadow: -8px 8px 24px -12px rgba(184,150,62,0.35); }

.testimonial-track { transition: transform .8s cubic-bezier(.6,.05,.2,1); }

.faq-item { border-bottom: 1px solid #EFE9DC; }
.faq-q { cursor: pointer; padding: 1.6rem 0; display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
.faq-q .icon {
  width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--gold);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: all .35s ease; color: var(--gold);
}
.faq-item.open .faq-q .icon { background: var(--gold); color: #fff; transform: rotate(45deg); }
.faq-a { max-height: 0; overflow: hidden; transition: max-height .5s ease; }
.faq-item.open .faq-a { max-height: 400px; }
.faq-a-inner { padding: 0 0 1.6rem 0; color: var(--graphite); line-height: 1.75; }

.drawer { transform: translateX(100%); transition: transform .45s cubic-bezier(.6,.05,.2,1); }
.drawer.open { transform: translateX(0); }

::selection { background: var(--gold); color: #fff; }

.luxe-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid #DDD3BC;
  padding: 14px 0;
  font-family: 'Jost', sans-serif;
  font-size: 0.95rem;
  color: var(--ink);
  transition: border-color .3s ease;
}
.luxe-input:focus { outline: none; border-bottom-color: var(--gold); }
.luxe-input::placeholder { color: var(--mist); }

.wordmark { font-family: 'Marcellus', Georgia, serif; letter-spacing: 0.42em; font-weight: 400; }
.wordmark-sub {
  font-family: 'Jost', sans-serif;
  letter-spacing: 0.42em;
  font-size: 0.55rem;
  text-transform: uppercase;
  color: var(--gold);
  font-weight: 500;
}

.price-card { transition: transform .5s ease, box-shadow .5s ease, border-color .5s ease; }
.price-card:hover { transform: translateY(-6px); box-shadow: 0 30px 60px -30px rgba(184,150,62,0.35); border-color: var(--gold); }
.price-card.featured { border-color: var(--gold); box-shadow: 0 30px 60px -30px rgba(184,150,62,0.35); }

.img-fallback { background: linear-gradient(135deg, #EFE6D2 0%, #C9B584 50%, #8E7430 100%); }
`;

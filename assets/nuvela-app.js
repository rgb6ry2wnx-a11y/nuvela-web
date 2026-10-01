/* Nuvela — catálogo, carrito, idioma y navegación. */

    // ==== State ====
    let currentLang = localStorage.getItem('nuvela-lang') || 'es';
    const NV_PAGE = document.body.dataset.nvPage || 'home';
    const NV_PRODUCT = document.body.dataset.nvProduct || null;
    // Sitio multi-página: cada "página" ahora es una dirección propia.
    const NV_ROUTES = {"home": "/", "producto": "/colchones", "precios": "/colchones", "linea-hotelera": "/linea-hotelera", "cita": "/showroom", "historia": "/historia", "tecnologia": "/colchon-hibrido", "entregas": "/envios", "resenas": "/resenas", "faq": "/preguntas-frecuentes", "contacto": "/contacto", "comparar": "/comparar", "carrito": "/carrito", "privacidad": "/privacidad"};
    const NV_PRODUCT_URLS = {"nuvela-clasico": "/colchones/colchon-nuvela", "nuvela-hotel": "/colchones/nuvela-diamond", "almohada-memory-foam-1": "/almohadas/ariana", "almohada-memory-foam-2": "/almohadas/amanda", "almohada-plumas": "/almohadas/almohada-de-plumas", "duvet-nuvela": "/accesorios-para-cama/duvet-nuvela", "protector-colchon": "/accesorios-para-cama/protector-de-colchon", "camastron-nuvela": "/camastrones/olivia-bed"};
    const NV_CAT_URLS = {"Colchones": "/colchones", "Almohadas": "/almohadas", "Accesorios para Cama": "/accesorios-para-cama", "Camastrones": "/camastrones"};
    function nvProductUrl(id) { return NV_PRODUCT_URLS[id] || '/colchones'; }
    function nvSafe(fn) { try { fn(); } catch (e) { console.warn('[Nuvela]', e); } }
    // El carrito, la cotización y el comparador se guardan en el navegador
    // para que no se pierdan al pasar de una página a otra.
    function nvSaveState() {
      try { localStorage.setItem('nuvela-state', JSON.stringify({ cart, quoteCart, compareIds, compareSizeSelection, quoteSizeSelection })); } catch (e) { /* modo privado */ }
    }
    function nvGo(url) { nvSaveState(); window.location.href = url; }
    let currentProductId = null; // which product is showing on the "producto-detalle" page
    let pdSelectedVariant = null; // which size/variant is selected for "Añadir al Carrito"
    let pdQty = 1;

    // ======================================================================
    // ==== PRODUCT CATALOG DATA ============================================
    // ======================================================================
    // Everything the "Productos" tab, the product detail page and the
    // "Precios" page show comes from THIS array. To add a new product, copy
    // one of the objects below, change its values, and it will automatically
    // appear in the catalog grid, get its own detail page, and show up on
    // the Precios page — no other part of the code needs to change.
    //
    // IMAGES: each product points to image files that must exist inside the
    // "images" folder with EXACTLY the same file names used here. See the
    // list Eduardo received alongside this file for the exact names to use
    // for the new model's photos.
    // Each product has:
    //   category  → {es,en} — which tab it appears under in the catalog filters
    //   stats     → small tiles at the top of the detail page (2-3 items, whatever fits the product)
    //   variants  → the different "versions" you can buy: sizes for a mattress, models
    //               for a pillow, etc. Each variant has a name, a short bilingual
    //               "detail" description and a price. Add/remove variants freely.
    // null = ninguna categoría elegida todavía: en la página de Productos primero
    // se muestran las categorías (como apple.com/iphone) y solo al elegir una se
    // despliega la cuadrícula, para no mostrar todo el catálogo de una vez.
    let activeCategory = document.body.dataset.nvCat || null;
    let cart = []; // { productId, variantName, qty }[]
    let checkoutForm = { nombre: '', telefono: '', facturaNombre: '', nit: '', direccionFactura: '', direccionEntrega: '', cuotas: 1 };
    const CUOTA_OPTIONS = [1, 3, 6, 9, 12];
    let quoteCart = []; // { productId, variantName, qty }[] — Línea para Hoteles quote requests (no prices)
    let quoteSizeSelection = {}; // productId -> variant name currently chosen on the hotel card
    let quoteForm = { nombre: '', telefono: '', empresa: '', correo: '', comentarios: '' };
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
        mainImage: '/images/colchon.jpg',
        gallery: ['/images/colchon.jpg', '/images/zipper.jpg', '/images/detalle.jpg', '/images/estructura.jpg', '/images/base.jpg'],
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
          { q: { es: '¿Qué firmeza tiene el colchón Nuvela?', en: 'How firm is the Nuvela mattress?' }, a: { es: 'El Colchón Nuvela tiene una firmeza de 7/10: soporte firme con una superficie que se moldea al cuerpo.', en: 'The Nuvela mattress has a 7/10 firmness: firm support with a surface that contours to the body.' } },
          { q: { es: '¿Cuánto tarda el envío?', en: 'How long does shipping take?' }, a: { es: 'Zona metropolitana: 3–5 días hábiles. Departamentos: 5–10 días hábiles.', en: 'Metropolitan zone: 3–5 business days. Departments: 5–10 business days.' } },
          { q: { es: '¿Qué garantía tiene?', en: 'What warranty does it have?' }, a: { es: '10 años de garantía por defectos de fabricación.', en: '10-year warranty against manufacturing defects.' } },
          { q: { es: '¿El pillow top se puede desfundar para lavarlo?', en: 'Can the pillow top cover be removed for washing?' }, a: { es: 'Sí, el pillow top es desfundable.', en: 'Yes, the pillow top cover is removable.' } },
        ],
      },
      {
        id: 'nuvela-hotel',
        category: { es: 'Colchones', en: 'Mattresses' },
        name: { es: 'Nuvela Diamond', en: 'Nuvela Diamond' },
        eyebrow: { es: 'Colchón Nuvela Diamond', en: 'Nuvela Diamond Mattress' },
        tagline: { es: 'Resortes Encapsulados · Espuma Alta Densidad · 35 cm', en: 'Encapsulated Springs · High-Density Foam · 35 cm' },
        cardText: {
          es: 'Diseñado para hotelería y Airbnb: soporte uniforme, pillow top acolchado y estructura reforzada para uso frecuente.',
          en: 'Built for hotels and Airbnb: even support, a cushioned pillow top and a reinforced structure for frequent use.'
        },
        description: {
          es: 'El colchón Nuvela Diamond está diseñado para ofrecer una experiencia de descanso premium, resistente y confortable para huéspedes exigentes. Su tecnología híbrida combina resortes encapsulados independientes, que reducen la transferencia de movimiento y brindan soporte uniforme, con capas de espuma de alta densidad que se adaptan al cuerpo sin perder firmeza. Cuenta con pillow top acolchado, tela fresca al tacto y estructura reforzada para un uso frecuente.',
          en: 'The Nuvela Diamond mattress is designed to deliver a premium, durable and comfortable sleep experience for demanding guests. Its hybrid technology combines independent encapsulated springs — which reduce motion transfer and provide even support — with high-density foam layers that contour to the body without losing firmness. It features a cushioned pillow top, cool-to-the-touch fabric and a reinforced structure built for frequent use.'
        },
        mainImage: '/images/nuvela-hotel-principal.jpg',
        gallery: [
          '/images/nuvela-hotel-principal.jpg',
          '/images/nuvela-hotel-vista-2.jpg',
          '/images/nuvela-hotel-vista-3.jpg',
          '/images/nuvela-hotel-vista-4.jpg',
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
          { name: 'Imperial', detail: { es: '0.97 × 1.91 m · 364 resortes encapsulados', en: '0.97 × 1.91 m · 364 encapsulated springs' }, price: 6900 },
          { name: 'Matrimonial', detail: { es: '1.37 × 1.91 m · 560 resortes encapsulados', en: '1.37 × 1.91 m · 560 encapsulated springs' }, price: 7900 },
          { name: 'Queen', detail: { es: '1.52 × 2.03 m · 660 resortes encapsulados', en: '1.52 × 2.03 m · 660 encapsulated springs' }, price: 9900, featured: true },
          { name: 'King', detail: { es: '1.93 × 2.03 m · 840 resortes encapsulados', en: '1.93 × 2.03 m · 840 encapsulated springs' }, price: 11900 },
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
        mainImage: '/images/almohada-memoryfoam-1-principal.jpg',
        gallery: ['/images/almohada-memoryfoam-1-principal.jpg', '/images/almohada-memoryfoam-1-vista-2.jpg'],
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
        mainImage: '/images/logosinfondo.png',
        gallery: ['/images/logosinfondo.png'],
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
        mainImage: '/images/logosinfondo.png',
        gallery: ['/images/logosinfondo.png'],
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
        mainImage: '/images/duvet-principal.jpg',
        gallery: ['/images/duvet-principal.jpg', '/images/duvet-vista-2.jpg'],
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
        mainImage: '/images/logosinfondo.png',
        gallery: ['/images/logosinfondo.png'],
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
        category: { es: 'Camastrones', en: 'Wooden Bed Frames' },
        name: { es: 'Olivia Bed', en: 'Olivia Bed' },
        eyebrow: { es: 'Camastrón', en: 'Wooden Bed Frame' },
        tagline: { es: 'Camastrón de madera de Conacaste · Bajo pedido', en: 'Conacaste wood bed frame · Made to order' },
        cardText: { es: 'Camastrón de madera de Conacaste, hecho bajo pedido. Disponible en Queen y King.', en: 'Conacaste wood bed frame, made to order. Available in Queen and King.' },
        description: { es: '', en: '' },
        mainImage: '/images/oliviabed1.jpg',
        gallery: ['/images/oliviabed1.jpg', '/images/oliviabed2.jpg', '/images/oliviabed3.jpg'],
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

    // ==== Product helpers ====
    function pick(field) {
      if (!field) return '';
      return field[currentLang] || field.es || field.en || '';
    }
    function priceFrom(product) {
      const priced = product.variants.filter(v => v.price);
      if (!priced.length) return currentLang === 'es' ? 'Próximamente' : 'Coming soon';
      const min = Math.min(...priced.map(v => v.price));
      return 'Q' + min.toLocaleString('en-US');
    }
    function formatPrice(price) {
      return price ? 'Q' + price.toLocaleString('en-US') : (currentLang === 'es' ? 'Próximamente' : 'Coming soon');
    }
    function getCategories() {
      const seen = new Map();
      PRODUCTS.forEach(p => { if (!seen.has(p.category.es)) seen.set(p.category.es, p.category); });
      return Array.from(seen.values());
    }

    // ==== Render: category tiles above the catalog grid (estilo apple.com/iphone: ====
    // primero se elige la categoría —con una foto representativa—, y solo entonces
    // aparece la cuadrícula de esa categoría más abajo.
    function renderCategoryFilters() {
      const el = document.getElementById('products-filter');
      if (!el) return;
      const quizTile = `
        <button type="button" id="quiz-tile-btn" class="group relative overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-ink border border-ink text-left rounded-2xl">
          <div class="absolute inset-0 flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-5 text-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B8963E" stroke-width="1.6" class="sm:w-7 sm:h-7"><path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.33c-.86.34-1.4 1.2-1.4 2.17v.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="17.5" r="0.9" fill="#B8963E" stroke="none"/></svg>
            <p class="font-serif text-sm sm:text-xl text-white leading-tight">${currentLang === 'es' ? 'Examen de Productos' : 'Product Quiz'}</p>
            <p class="text-gold text-[0.55rem] sm:text-[0.65rem] tracking-[0.18em] uppercase">${currentLang === 'es' ? 'Encuentra el tuyo' : 'Find your match'}</p>
          </div>
        </button>
      `;
      const tiles = quizTile + getCategories().map(c => {
        const sample = PRODUCTS.find(p => p.category.es === c.es);
        const count = PRODUCTS.filter(p => p.category.es === c.es).length;
        const isActive = activeCategory === c.es;
        return `
          <a href="${NV_CAT_URLS[c.es] || '/colchones'}" class="js-filter-category block group relative overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-cream border ${isActive ? 'border-gold border-2' : 'border-pearl'} text-left rounded-2xl" data-category="${c.es}">
            <img src="${sample ? sample.mainImage : ''}" alt="${pick(c)}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onerror="this.style.display='none';" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"></div>
            <div class="absolute inset-0 flex flex-col justify-end p-3 sm:p-5">
              <p class="font-serif text-sm sm:text-xl text-white leading-tight">${pick(c)}</p>
              <p class="text-white/75 text-[0.55rem] sm:text-[0.65rem] tracking-[0.18em] uppercase mt-1">${count} ${count === 1 ? (currentLang === 'es' ? 'modelo' : 'model') : (currentLang === 'es' ? 'modelos' : 'models')}</p>
            </div>
            ${isActive ? '<span class="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gold flex items-center justify-center text-white text-[0.65rem]">&#10003;</span>' : ''}
          </a>
        `;
      }).join('');
      el.innerHTML = tiles;
    }

    // ==== Render: "Productos" nav dropdown — agrupado por categoría (Colchones, ====
    // Almohadas, Accesorios para Cama, Camastrones) para que el cliente entre
    // directo al producto que busca. "Comparar Productos" va justo debajo del
    // Examen de Productos (antes quedaba hasta el final, después de listar TODOS
    // los productos, y era fácil que el cliente no lo viera sin hacer scroll).
    function renderNavProductsDropdown() {
      const targets = document.querySelectorAll('.js-nav-products-list');
      if (!targets.length) return;
      const quizHtml = `
        <div class="pb-2 mb-1 border-b border-white/10">
          <button type="button" class="js-nav-quiz-btn w-full text-left px-5 py-2.5 text-sm text-gold hover:text-gold-light hover:bg-white/5 transition-colors flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="flex-shrink-0"><path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.33c-.86.34-1.4 1.2-1.4 2.17v.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="17.5" r="0.9" fill="currentColor" stroke="none"/></svg>
            ${currentLang === 'es' ? 'Examen de Productos' : 'Product Quiz'}
          </button>
        </div>
      `;
      const groupsHtml = getCategories().map(cat => {
        const items = PRODUCTS.filter(p => p.category.es === cat.es);
        if (!items.length) return '';
        return `
          <div class="nav-cat-section">
            <button type="button" class="js-nav-cat-toggle w-full flex items-center justify-between gap-2 px-5 pt-3 pb-1 text-[0.62rem] tracking-[0.2em] uppercase text-mist hover:text-gold-light transition-colors" aria-expanded="false">
              <span>${pick(cat)}</span>
              <svg class="nav-cat-chevron flex-shrink-0" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="nav-cat-body">
              ${items.map(p => `<a href="${nvProductUrl(p.id)}" class="js-view-product nv-abtn block w-full text-left px-5 py-2 text-sm text-cream/90 hover:text-gold hover:bg-white/5 transition-colors" data-product-id="${p.id}">${pick(p.name)}</a>`).join('')}
            </div>
          </div>
        `;
      }).join('');
      const compareHtml = `
        <div class="border-t border-white/10 mt-2 pt-2">
          <a class="block px-5 py-2.5 text-sm text-gold hover:text-gold-light hover:bg-white/5 transition-colors cursor-pointer" data-page="comparar">${currentLang === 'es' ? 'Comparar Productos' : 'Compare Products'}</a>
        </div>
      `;
      const html = quizHtml + compareHtml + groupsHtml;
      targets.forEach(el => { el.innerHTML = html; });
    }

    // ==== Shared product card markup (used by the main catalog and Línea para Hoteles) ====
    function productCardHTML(p, opts) {
      opts = opts || {};
      // Hotel/B2B cards hide the retail price and prompt a quote request instead
      // of jumping straight to the (retail-priced) product detail page.
      // Textos y botones más compactos en móvil (2 columnas): en sm: y arriba
      // recuperan el tamaño original de escritorio.
      const priceBlock = opts.hideRetailPrice ? `
            <p class="hidden sm:block text-graphite text-sm mt-6 leading-relaxed">${currentLang === 'es' ? 'Precios especiales por volumen para proyectos de hospitalidad.' : 'Special volume pricing for hospitality projects.'}</p>
            ${p.variants && p.variants.length > 1 ? `
            <select class="js-quote-size-select mt-2 sm:mt-4 border border-pearl px-2 sm:px-3 py-1.5 sm:py-2.5 text-xs sm:text-sm bg-white w-full" data-product-id="${p.id}" aria-label="${currentLang === 'es' ? 'Presentación' : 'Size'}">
              ${p.variants.map(v => `<option value="${v.name}" ${quoteSizeSelection[p.id] === v.name ? 'selected' : ''}>${v.name}</option>`).join('')}
            </select>
            ` : ''}
            <button class="js-add-quote btn-gold mt-2 sm:mt-4 w-full !text-[0.65rem] sm:!text-xs !py-2 sm:!py-3" data-product-id="${p.id}">${currentLang === 'es' ? '+ Agregar a Cotización' : '+ Add to Quote Request'}</button>
            <button class="js-view-quote-cart btn-outline mt-2 sm:mt-3 w-full !text-[0.65rem] sm:!text-xs !py-2 sm:!py-3">${currentLang === 'es' ? 'Ver mi Cotización' : 'View My Quote'}</button>
      ` : `
            <p class="text-mist text-[0.6rem] sm:text-xs tracking-[0.18em] uppercase mt-3 sm:mt-6">${currentLang === 'es' ? 'Desde' : 'From'}</p>
            <p class="font-price text-xl sm:text-3xl text-gold mt-1">${priceFrom(p)}</p>
            <a href="${nvProductUrl(p.id)}" class="js-view-product nv-abtn btn-outline mt-3 sm:mt-6 w-full !text-[0.65rem] sm:!text-xs !py-2 sm:!py-3" data-product-id="${p.id}">${currentLang === 'es' ? 'Ver Detalle' : 'View Details'}</a>
      `;
      return `
        <div class="product-card bg-white border border-pearl reveal flex flex-col overflow-hidden rounded-2xl">
          <!-- Eduardo dijo que en pantallas grandes la foto seguia         -->
          <!-- quedando muy alta -- comparo con verla en zoom 75% del        -->
          <!-- navegador, donde sí cabe la foto completa junto con el texto. -->
          <!-- En movil (2 columnas) 4:3 ya se veía bien, así que se queda   -->
          <!-- igual ahí; en pantallas mas anchas (sm: en adelante) ahora es -->
          <!-- mas baja (16:9) para que quepa mas contenido sin scroll.      -->
          <div class="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden bg-cream">
            <img src="${p.mainImage}" alt="${pick(p.name)}" class="w-full h-full object-cover img-hover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=85';" />
            <div class="card-shimmer" aria-hidden="true"></div>
          </div>
          <div class="p-3 sm:p-8 flex flex-col flex-grow">
            <p class="eyebrow !text-[0.6rem] sm:!text-[0.72rem] !tracking-[0.16em] sm:!tracking-[0.32em]">${pick(p.eyebrow)}</p>
            <h3 class="font-serif text-base sm:text-2xl text-ink mt-1 sm:mt-3 leading-tight">${pick(p.name)}</h3>
            <p class="hidden sm:block text-graphite text-sm mt-3 leading-relaxed flex-grow">${pick(p.cardText)}</p>
            ${priceBlock}
          </div>
        </div>
      `;
    }

    // ==== Render: Productos catalog grid ====
    // activeCategory === null → todavía no eligieron categoría: no se muestra nada
    // aquí abajo, solo las categorías de arriba (como apple.com/iphone antes de
    // elegir el modelo). 'all' muestra el catálogo completo; cualquier otro valor
    // filtra por esa categoría.
    function renderProductsGrid() {
      const grid = document.getElementById('products-grid');
      const heading = document.getElementById('products-grid-heading');
      if (!grid) return;
      if (activeCategory === null) {
        grid.innerHTML = '';
        if (heading) heading.innerHTML = '';
        return;
      }
      const list = activeCategory === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category.es === activeCategory);
      if (heading) {
        const catObj = activeCategory === 'all' ? null : getCategories().find(c => c.es === activeCategory);
        const label = activeCategory === 'all' ? (currentLang === 'es' ? 'Todos los Productos' : 'All Products') : (catObj ? pick(catObj) : '');
        heading.innerHTML = `<h3 class="font-serif text-2xl sm:text-3xl text-ink">${label}</h3>`;
      }
      if (!list.length) {
        grid.innerHTML = `<p class="col-span-full text-center text-mist py-10">${currentLang === 'es' ? 'Próximamente en esta categoría.' : 'Coming soon in this category.'}</p>`;
        return;
      }
      grid.innerHTML = list.map(p => productCardHTML(p)).join('');
    }

    // ==== EXAMEN DE PRODUCTOS / PRODUCT QUIZ ====================================
    // Ayuda al cliente a encontrar el producto Nuvela ideal respondiendo unas
    // preguntas cortas. Primero elige categoría (colchón, almohada o duvet),
    // luego responde preguntas específicas de esa categoría, y al final se le
    // muestra el producto real (de PRODUCTS) que mejor coincide con sus
    // respuestas, según las especificaciones reales de cada producto.
    //
    // Para agregar/editar preguntas: edita QUIZ_QUESTIONS[categoria]. Cada
    // opción puede sumar puntos a uno o más IDs de producto en "scores"; al
    // final el producto con más puntos dentro de QUIZ_CANDIDATES[categoria]
    // gana. "exclusive: true" = si se elige esa opción se deseleccionan las
    // demás (ej. "Ninguna de estas").
    const QUIZ_CATEGORY_QUESTION = {
      id: 'categoria',
      multi: false,
      es: { title: '¿Qué estás buscando?', subtitle: 'Elige una categoría para empezar.' },
      en: { title: 'What are you looking for?', subtitle: 'Choose a category to get started.' },
      options: [
        { value: 'colchon', es: 'Colchón', en: 'Mattress' },
        { value: 'almohada', es: 'Almohada', en: 'Pillow' },
        { value: 'duvet', es: 'Duvet', en: 'Duvet' },
      ],
    };

    const QUIZ_QUESTIONS = {
      colchon: [
        {
          id: 'molestia', multi: true,
          es: { title: '¿Qué se interpone entre tú y una noche de sueño increíble?', subtitle: 'Elige todas las que apliquen.' },
          en: { title: "What stands between you and an amazing night's sleep?", subtitle: 'Select all that apply.' },
          options: [
            { value: 'espalda', es: 'Dolor de espalda o cuello', en: 'Back or neck pain', scores: { 'nuvela-clasico': 1 } },
            { value: 'caliente', es: 'Se siente muy caliente', en: 'Sleeps too hot', scores: {} },
            { value: 'soporte', es: 'Ya perdió soporte', en: 'Lost its support', scores: { 'nuvela-clasico': 1, 'nuvela-hotel': 1 } },
            { value: 'movimiento', es: 'El movimiento de mi pareja me despierta', en: 'Partner movement wakes me up', scores: { 'nuvela-clasico': 1, 'nuvela-hotel': 1 } },
            { value: 'ninguna', es: 'Ninguna de estas', en: 'None of these', exclusive: true, scores: {} },
          ],
        },
        {
          id: 'posicion', multi: false,
          es: { title: '¿En qué posición te duermes normalmente?', subtitle: '' },
          en: { title: 'What position do you primarily fall asleep in?', subtitle: '' },
          options: [
            { value: 'lado', es: 'De lado', en: 'Side', scores: { 'nuvela-hotel': 2 } },
            { value: 'espalda', es: 'Boca arriba', en: 'Back', scores: { 'nuvela-clasico': 2 } },
            { value: 'estomago', es: 'Boca abajo', en: 'Stomach', scores: { 'nuvela-clasico': 2 } },
            { value: 'combinacion', es: 'Combinación', en: 'Combination', scores: { 'nuvela-clasico': 1, 'nuvela-hotel': 1 } },
            { value: 'no-se', es: 'No estoy seguro', en: "I don't know", scores: {} },
          ],
        },
        {
          id: 'firmeza', multi: false,
          es: { title: '¿Cómo te gusta que se sienta tu colchón?', subtitle: '' },
          en: { title: 'How do you like your mattress to feel?', subtitle: '' },
          options: [
            { value: 'firme', es: 'Firme', en: 'Firm', scores: { 'nuvela-clasico': 3 } },
            { value: 'medio-firme', es: 'Medio firme', en: 'Medium-Firm', scores: { 'nuvela-clasico': 2, 'nuvela-hotel': 1 } },
            { value: 'medio', es: 'Término medio', en: 'Medium', scores: { 'nuvela-hotel': 2, 'nuvela-clasico': 1 } },
            { value: 'suave', es: 'Suave y acolchado', en: 'Soft & plush', scores: { 'nuvela-hotel': 3 } },
            { value: 'no-se', es: 'No estoy seguro', en: "I'm not sure", scores: {} },
          ],
        },
        {
          id: 'extra', multi: false,
          es: { title: '¿Buscas alguna característica adicional?', subtitle: '' },
          en: { title: 'Are there any additional features you are looking for?', subtitle: '' },
          options: [
            { value: 'desfundable', es: 'Funda desfundable y lavable', en: 'Removable, washable cover', scores: { 'nuvela-clasico': 2 } },
            { value: 'pillowtop', es: 'Mayor altura y sensación acolchada (pillow top)', en: 'Extra height & plush pillow-top feel', scores: { 'nuvela-hotel': 2 } },
            { value: 'ninguna', es: 'Sin preferencia adicional', en: 'No additional preference', scores: {} },
          ],
        },
      ],
      almohada: [
        {
          id: 'posicion', multi: false,
          es: { title: '¿En qué posición te duermes normalmente?', subtitle: '' },
          en: { title: 'What position do you primarily fall asleep in?', subtitle: '' },
          options: [
            { value: 'lado', es: 'De lado', en: 'Side', scores: { 'almohada-memory-foam-2': 2 } },
            { value: 'espalda', es: 'Boca arriba', en: 'Back', scores: { 'almohada-memory-foam-1': 2 } },
            { value: 'estomago', es: 'Boca abajo', en: 'Stomach', scores: { 'almohada-plumas': 2 } },
            { value: 'combinacion', es: 'Combinación', en: 'Combination', scores: { 'almohada-memory-foam-1': 1 } },
          ],
        },
        {
          id: 'sensacion', multi: false,
          es: { title: '¿Cómo te gusta que se sienta tu almohada?', subtitle: '' },
          en: { title: 'How do you like your pillow to feel?', subtitle: '' },
          options: [
            { value: 'suave', es: 'Suave y esponjada', en: 'Soft & fluffy', scores: { 'almohada-plumas': 3 } },
            { value: 'firme', es: 'Firme, con soporte de cuello', en: 'Firm, with neck support', scores: { 'almohada-memory-foam-2': 3 } },
            { value: 'medio', es: 'Término medio', en: 'Medium', scores: { 'almohada-memory-foam-1': 3 } },
          ],
        },
        {
          id: 'molestia', multi: true,
          es: { title: '¿Qué te ha molestado de tus almohadas actuales?', subtitle: 'Elige todas las que apliquen.' },
          en: { title: 'What has bothered you about your current pillows?', subtitle: 'Select all that apply.' },
          options: [
            { value: 'pierde-forma', es: 'Pierde forma rápido', en: 'Loses shape quickly', scores: { 'almohada-memory-foam-2': 1 } },
            { value: 'sin-soporte', es: 'No da suficiente soporte', en: "Doesn't give enough support", scores: { 'almohada-memory-foam-2': 1 } },
            { value: 'caliente', es: 'Se siente caliente', en: 'Sleeps too hot', scores: {} },
            { value: 'ninguna', es: 'Ninguna de estas', en: 'None of these', exclusive: true, scores: {} },
          ],
        },
      ],
      duvet: [
        {
          id: 'tamano', multi: false,
          es: { title: '¿Qué tamaño de cama tienes?', subtitle: '' },
          en: { title: 'What size is your bed?', subtitle: '' },
          options: [
            { value: 'queen', es: 'Queen', en: 'Queen', variant: 'Queen', scores: { 'duvet-nuvela': 1 } },
            { value: 'king', es: 'King', en: 'King', variant: 'King', scores: { 'duvet-nuvela': 1 } },
          ],
        },
      ],
    };

    const QUIZ_CANDIDATES = {
      colchon: ['nuvela-clasico', 'nuvela-hotel'],
      almohada: ['almohada-memory-foam-1', 'almohada-memory-foam-2', 'almohada-plumas'],
      duvet: ['duvet-nuvela'],
    };

    const RESULT_BLURBS = {
      'nuvela-clasico': {
        es: 'El Colchón Nuvela es tu mejor opción: firmeza 7/10, funda desfundable y lavable, y resortes encapsulados que aíslan el movimiento de tu pareja.',
        en: 'The Nuvela Mattress is your best match: 7/10 firmness, a removable washable cover, and encapsulated springs that isolate your partner\'s movement.',
      },
      'nuvela-hotel': {
        es: 'El Nuvela Diamond es tu mejor opción: firmeza 6/10 con pillow top acolchado, 35 cm de altura y estructura reforzada para un descanso más suave.',
        en: 'The Nuvela Diamond is your best match: 6/10 firmness with a cushioned pillow top, 35 cm of height, and a reinforced build for a plusher feel.',
      },
      'almohada-memory-foam-1': {
        es: 'Ariana es tu mejor opción: memory foam de doble capa con una sensación balanceada, ideal para combinar posiciones.',
        en: 'Ariana is your best match: double-layer memory foam with a balanced feel, ideal if you switch positions through the night.',
      },
      'almohada-memory-foam-2': {
        es: 'Amanda es tu mejor opción: memory foam hidrofílico de mayor densidad (75–80D) y más altura, con mejor soporte de cuello para dormir de lado.',
        en: 'Amanda is your best match: higher-density (75–80D) hydrophilic memory foam with extra height and stronger neck support for side sleeping.',
      },
      'almohada-plumas': {
        es: 'La Almohada de Plumas es tu mejor opción: sensación suave y esponjada de bajo perfil, ideal si duermes boca abajo.',
        en: 'The Feather-Style Pillow is your best match: a soft, fluffy, low-profile feel that suits stomach sleepers best.',
      },
      'duvet-nuvela': {
        es: 'El Duvet Nuvela en tu talla es la opción perfecta para tu cama.',
        en: 'The Nuvela Duvet in your size is the perfect fit for your bed.',
      },
    };

    let quizState = { open: false, phase: 'category', category: null, qIndex: 0, answers: {}, result: null };

    function quizQuestions() {
      return quizState.category ? (QUIZ_QUESTIONS[quizState.category] || []) : [];
    }

    function quizCurrentQuestion() {
      if (quizState.phase === 'category') return QUIZ_CATEGORY_QUESTION;
      if (quizState.phase === 'questions') return quizQuestions()[quizState.qIndex];
      return null;
    }

    function quizProgressFraction() {
      const qs = quizQuestions();
      const total = 1 + qs.length + 1; // categoría + preguntas + reveal/resultado
      let current = 0;
      if (quizState.phase === 'questions') current = 1 + quizState.qIndex;
      else if (quizState.phase === 'reveal' || quizState.phase === 'result') current = 1 + qs.length;
      return Math.round((current / total) * 100);
    }

    function openQuiz() {
      quizState = { open: true, phase: 'category', category: null, qIndex: 0, answers: {}, result: null };
      const overlay = document.getElementById('quiz-overlay');
      if (overlay) overlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      renderQuiz();
    }

    function closeQuiz() {
      quizState.open = false;
      const overlay = document.getElementById('quiz-overlay');
      if (overlay) overlay.classList.add('hidden');
      document.body.style.overflow = '';
    }

    function quizSelect(value) {
      const q = quizCurrentQuestion();
      if (!q) return;
      const key = q.id;
      const opt = q.options.find(o => o.value === value);
      if (!opt) return;
      if (q.multi) {
        let current = quizState.answers[key] || [];
        if (opt.exclusive) {
          current = current.includes(value) ? [] : [value];
        } else {
          current = current.filter(v => {
            const o = q.options.find(oo => oo.value === v);
            return !(o && o.exclusive);
          });
          current = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
        }
        quizState.answers[key] = current;
      } else {
        quizState.answers[key] = [value];
      }
      renderQuiz();
    }

    function computeQuizResult() {
      const candidates = QUIZ_CANDIDATES[quizState.category] || [];
      const scores = {};
      candidates.forEach(id => { scores[id] = 0; });
      const qs = quizQuestions();
      let variantHint = null;
      qs.forEach(q => {
        const chosen = quizState.answers[q.id] || [];
        chosen.forEach(val => {
          const opt = q.options.find(o => o.value === val);
          if (!opt) return;
          if (opt.scores) {
            Object.keys(opt.scores).forEach(pid => {
              if (scores.hasOwnProperty(pid)) scores[pid] += opt.scores[pid];
            });
          }
          if (opt.variant) variantHint = opt.variant;
        });
      });
      let bestId = candidates[0];
      let bestScore = -Infinity;
      candidates.forEach(id => { if (scores[id] > bestScore) { bestScore = scores[id]; bestId = id; } });
      return { productId: bestId, variantHint };
    }

    function quizNext() {
      if (quizState.phase === 'category') {
        const chosen = (quizState.answers['categoria'] || [])[0];
        if (!chosen) return;
        quizState.category = chosen;
        quizState.phase = 'questions';
        quizState.qIndex = 0;
        renderQuiz();
        return;
      }
      if (quizState.phase === 'questions') {
        const q = quizCurrentQuestion();
        if (!q || !(quizState.answers[q.id] || []).length) return;
        const qs = quizQuestions();
        if (quizState.qIndex < qs.length - 1) {
          quizState.qIndex++;
        } else {
          quizState.result = computeQuizResult();
          quizState.phase = 'reveal';
        }
        renderQuiz();
        return;
      }
    }

    function quizBack() {
      if (quizState.phase === 'questions') {
        if (quizState.qIndex > 0) quizState.qIndex--;
        else { quizState.phase = 'category'; quizState.category = null; }
        renderQuiz();
        return;
      }
      if (quizState.phase === 'reveal') {
        quizState.phase = 'questions';
        quizState.qIndex = quizQuestions().length - 1;
        renderQuiz();
        return;
      }
      if (quizState.phase === 'result') {
        quizState.phase = 'reveal';
        renderQuiz();
        return;
      }
      closeQuiz();
    }

    function renderQuiz() {
      const eyebrowEl = document.getElementById('quiz-eyebrow');
      const progressEl = document.getElementById('quiz-progress-fill');
      const bodyEl = document.getElementById('quiz-body');
      const footerEl = document.getElementById('quiz-footer');
      const nextBtn = document.getElementById('quiz-next-btn');
      if (!bodyEl || !eyebrowEl || !progressEl || !footerEl || !nextBtn) return;
      progressEl.style.width = quizProgressFraction() + '%';

      if (quizState.phase === 'category' || quizState.phase === 'questions') {
        const q = quizCurrentQuestion();
        if (!q) return;
        eyebrowEl.textContent = currentLang === 'es' ? 'Examen de Productos' : 'Product Quiz';
        footerEl.style.display = '';
        const t = q[currentLang] || q.es;
        const isMulti = !!q.multi;
        const answered = (quizState.answers[q.id] || []).length > 0;
        bodyEl.innerHTML = `
          <h3 class="font-serif text-2xl sm:text-3xl text-ink text-center leading-snug">${t.title}</h3>
          ${t.subtitle ? `<p class="text-mist text-sm text-center mt-2">${t.subtitle}</p>` : ''}
          <div class="grid ${q.options.length > 4 ? 'sm:grid-cols-2' : 'grid-cols-1'} gap-3 mt-8">
            ${q.options.map(o => {
              const label = o[currentLang] || o.es;
              const isSelected = (quizState.answers[q.id] || []).includes(o.value);
              const markerHtml = isMulti
                ? `<span class="w-5 h-5 border ${isSelected ? 'bg-gold border-gold' : 'border-mist'} flex items-center justify-center text-white text-[0.65rem] flex-shrink-0 ml-3">${isSelected ? '&#10003;' : ''}</span>`
                : `<span class="w-4 h-4 rounded-full border ${isSelected ? 'border-gold' : 'border-mist'} flex items-center justify-center flex-shrink-0 ml-3">${isSelected ? '<span class="w-2 h-2 rounded-full bg-gold block"></span>' : ''}</span>`;
              return `
                <button type="button" class="js-quiz-option text-left border ${isSelected ? 'border-gold bg-cream' : 'border-pearl hover:border-gold'} p-4 transition-colors flex items-center justify-between rounded-xl" data-value="${o.value}">
                  <span class="text-ink text-sm sm:text-base">${label}</span>
                  ${markerHtml}
                </button>
              `;
            }).join('')}
          </div>
        `;
        nextBtn.classList.toggle('opacity-40', !answered);
        nextBtn.classList.toggle('pointer-events-none', !answered);
        nextBtn.innerHTML = currentLang === 'es' ? 'Siguiente' : 'Next';
        return;
      }

      if (quizState.phase === 'reveal') {
        eyebrowEl.textContent = currentLang === 'es' ? 'Examen de Productos' : 'Product Quiz';
        footerEl.style.display = 'none';
        bodyEl.innerHTML = `
          <div class="text-center py-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B8963E" stroke-width="1.4" class="mx-auto mb-4"><path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.33c-.86.34-1.4 1.2-1.4 2.17v.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="17.5" r="0.9" fill="#B8963E" stroke="none"/></svg>
            <h3 class="font-serif text-2xl sm:text-3xl text-ink">${currentLang === 'es' ? 'Tu resultado está listo' : 'Your result is ready'}</h3>
            <p class="text-graphite text-sm mt-3 max-w-sm mx-auto leading-relaxed">${currentLang === 'es' ? 'Analizamos tus respuestas junto a las especificaciones de cada producto Nuvela.' : "We matched your answers against every Nuvela product's specifications."}</p>
            <button type="button" id="quiz-reveal-btn" class="btn-gold mt-8 !px-10">${currentLang === 'es' ? 'Ver mi resultado' : 'See my result'}</button>
          </div>
        `;
        return;
      }

      if (quizState.phase === 'result') {
        footerEl.style.display = 'none';
        const p = PRODUCTS.find(x => x.id === (quizState.result && quizState.result.productId));
        eyebrowEl.textContent = currentLang === 'es' ? 'Tu Match' : 'Your Match';
        if (!p) { bodyEl.innerHTML = ''; return; }
        const blurbObj = RESULT_BLURBS[p.id];
        const blurb = blurbObj ? (blurbObj[currentLang] || blurbObj.es) : pick(p.cardText);
        bodyEl.innerHTML = `
          <div class="text-center">
            <p class="eyebrow">${currentLang === 'es' ? 'Tu producto ideal' : 'Your ideal product'}</p>
            <div class="aspect-[4/3] max-w-xs mx-auto mt-4 bg-cream overflow-hidden border border-pearl">
              <img src="${p.mainImage}" alt="${pick(p.name)}" class="w-full h-full object-cover" onerror="this.style.display='none';" />
            </div>
            <h3 class="font-serif text-2xl sm:text-3xl text-ink mt-5">${pick(p.name)}</h3>
            <p class="text-graphite text-sm mt-3 max-w-md mx-auto leading-relaxed">${blurb}</p>
            <p class="text-mist text-[0.6rem] tracking-[0.18em] uppercase mt-5">${currentLang === 'es' ? 'Desde' : 'From'}</p>
            <p class="font-price text-2xl text-gold mt-1">${priceFrom(p)}</p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <button type="button" id="quiz-view-product-btn" class="btn-gold !px-8" data-product-id="${p.id}" ${quizState.result.variantHint ? `data-variant="${quizState.result.variantHint}"` : ''}>${currentLang === 'es' ? 'Ver Producto' : 'View Product'}</button>
              <button type="button" id="quiz-cita-btn" class="btn-outline !px-8">${currentLang === 'es' ? 'Agendar Cita' : 'Book a Visit'}</button>
            </div>
            <button type="button" id="quiz-restart-btn" class="text-xs tracking-[0.18em] uppercase text-mist hover:text-gold underline underline-offset-4 mt-6">${currentLang === 'es' ? 'Volver a hacer el examen' : 'Retake the quiz'}</button>
          </div>
        `;
        return;
      }
    }

    // ==== Render: Línea para Hoteles grid (mattresses, pillows, bed accessories, loungers) ====
    const HOTEL_CATEGORIES = ['Colchones', 'Almohadas', 'Accesorios para Cama', 'Camastrones'];
    function renderHotelGrid() {
      const grid = document.getElementById('hotel-products-grid');
      if (!grid) return;
      const list = PRODUCTS.filter(p => HOTEL_CATEGORIES.includes(p.category.es));
      list.forEach(p => {
        if (p.variants && p.variants.length && !quoteSizeSelection[p.id]) {
          quoteSizeSelection[p.id] = (p.variants.find(v => v.featured) || p.variants[0]).name;
        }
      });
      if (!list.length) {
        grid.innerHTML = `<p class="col-span-full text-center text-mist py-10">${currentLang === 'es' ? 'Próximamente.' : 'Coming soon.'}</p>`;
        return;
      }
      grid.innerHTML = list.map(p => productCardHTML(p, { hideRetailPrice: true })).join('');
    }

    // ==== Comparar Productos (estilo Apple) ====
    // El cliente elige hasta 3 productos (de cualquier sección) y ve una tabla
    // de especificaciones lado a lado. SPEC_ROWS es la lista maestra de filas;
    // cada fila sabe cómo leer su valor de un producto (getStat busca por el
    // label.es del stat, que funciona como llave interna aunque cambie el idioma).
    let compareIds = [];
    let compareSizeSelection = {}; // productId -> chosen variant name, for products with sizes

    function statVal(v) {
      return (v && typeof v === 'object') ? pick(v) : v;
    }

    function getStat(p, labelEs) {
      const s = (p.stats || []).find(st => st.label && st.label.es === labelEs);
      return s ? statVal(s.value) : '–';
    }

    // Which variant is "in view" for a product inside the comparison table —
    // the one the shopper picked with the size selector, or the featured/first one.
    function compareVariant(p) {
      if (!p.variants || !p.variants.length) return null;
      const chosen = compareSizeSelection[p.id];
      return p.variants.find(v => v.name === chosen) || p.variants.find(v => v.featured) || p.variants[0];
    }

    function compareMeasure(p) {
      const v = compareVariant(p);
      if (!v) return getStat(p, 'Medidas');
      const detail = pick(v.detail);
      return detail ? detail.split(' · ')[0] : '–';
    }

    function comparePrice(p) {
      const v = compareVariant(p);
      return v ? formatPrice(v.price) : priceFrom(p);
    }

    // Spring count lives inside the variant detail string (e.g. "1.52 × 2.03 m ·
    // 660 resortes encapsulados"), right after the measurement — same size
    // selector the shopper already used for "Medidas".
    function compareSprings(p) {
      const v = compareVariant(p);
      if (!v) return '–';
      const detail = pick(v.detail);
      const parts = detail ? detail.split(' · ') : [];
      return parts.length > 1 ? parts[1] : '–';
    }

    const SPEC_ROWS = [
      { es: 'Precio', en: 'Price', price: true, get: p => comparePrice(p) },
      { es: 'Categoría', en: 'Category', get: p => pick(p.category) },
      { es: 'Medidas', en: 'Dimensions', get: p => compareMeasure(p) },
      { es: 'Resortes', en: 'Springs', get: p => compareSprings(p) },
      { es: 'Firmeza', en: 'Firmness', get: p => getStat(p, 'Firmeza') },
      { es: 'Relleno', en: 'Fill', get: p => getStat(p, 'Relleno') },
      { es: 'Material', en: 'Material', get: p => getStat(p, 'Material') },
      { es: 'Tela', en: 'Fabric', get: p => getStat(p, 'Tela') },
      { es: 'Altura', en: 'Height', get: p => getStat(p, 'Altura') },
      { es: 'Capas', en: 'Layers', get: p => getStat(p, 'Capas') },
      { es: 'Impermeable', en: 'Waterproof', get: p => getStat(p, 'Impermeable') },
      { es: 'Garantía', en: 'Warranty', get: p => getStat(p, 'Garantía') },
      { es: 'Presentaciones', en: 'Available sizes', get: p => (p.variants && p.variants.length) ? p.variants.map(v => v.name).join(' · ') : '–' },
    ];

    function toggleCompare(id) {
      const idx = compareIds.indexOf(id);
      if (idx > -1) {
        compareIds.splice(idx, 1);
      } else {
        if (compareIds.length >= 3) return;
        compareIds.push(id);
        const p = PRODUCTS.find(x => x.id === id);
        if (p && p.variants && p.variants.length > 1 && !compareSizeSelection[id]) {
          const def = p.variants.find(v => v.featured) || p.variants[0];
          compareSizeSelection[id] = def.name;
        }
      }
      renderComparePicker();
      renderCompareTable();
      setTimeout(initReveal, 50);
    }

    function removeCompare(id) {
      compareIds = compareIds.filter(x => x !== id);
      renderComparePicker();
      renderCompareTable();
    }

    function setCompareSize(id, sizeName) {
      compareSizeSelection[id] = sizeName;
      renderCompareTable();
    }

    function renderComparePicker() {
      const wrap = document.getElementById('compare-picker');
      if (!wrap) return;
      wrap.innerHTML = getCategories().map(cat => {
        const items = PRODUCTS.filter(p => p.category.es === cat.es);
        return `
          <div>
            <div class="flex items-center gap-4 mb-4">
              <h3 class="font-serif text-xl md:text-2xl text-ink whitespace-nowrap">${pick(cat)}</h3>
              <span class="gold-rule !w-full"></span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              ${items.map(p => {
                const selected = compareIds.includes(p.id);
                const disabled = !selected && compareIds.length >= 3;
                const label = selected
                  ? (currentLang === 'es' ? '✓ Agregado' : '✓ Added')
                  : disabled
                    ? (currentLang === 'es' ? 'Máximo 3' : 'Max 3')
                    : (currentLang === 'es' ? '+ Comparar' : '+ Compare');
                const btnClass = selected
                  ? 'bg-gold text-white'
                  : disabled
                    ? 'bg-pearl text-mist cursor-not-allowed'
                    : 'border border-ink text-ink hover:bg-ink hover:text-white';
                return `
                <div class="border ${selected ? 'border-gold' : 'border-pearl'} bg-white flex flex-col overflow-hidden transition-colors">
                  <div class="h-32 md:h-36 overflow-hidden bg-cream">
                    <img src="${p.mainImage}" alt="${pick(p.name)}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80';" />
                  </div>
                  <div class="p-3 flex flex-col flex-grow">
                    <h3 class="font-serif text-sm text-ink leading-snug">${pick(p.name)}</h3>
                    <p class="font-price text-base text-gold mt-1">${priceFrom(p)}</p>
                    <button class="js-toggle-compare mt-2 w-full text-[0.65rem] tracking-[0.12em] uppercase py-2 transition-colors ${btnClass}" data-product-id="${p.id}" ${disabled ? 'disabled' : ''}>${label}</button>
                  </div>
                </div>`;
              }).join('')}
            </div>
          </div>
        `;
      }).join('');
    }

    function renderCompareTable() {
      const wrap = document.getElementById('compare-table-wrap');
      if (!wrap) return;
      if (!compareIds.length) {
        wrap.innerHTML = `
          <div class="text-center py-16">
            <p class="eyebrow">${currentLang === 'es' ? 'Tu comparación' : 'Your comparison'}</p>
            <h3 class="font-serif text-3xl text-ink mt-4">${currentLang === 'es' ? 'Selecciona hasta 3 productos arriba para compararlos aquí.' : 'Select up to 3 products above to compare them here.'}</h3>
          </div>
        `;
        return;
      }
      const products = compareIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
      const cols = products.length;
      const gridCols = `grid-template-columns: 150px repeat(${cols}, minmax(190px, 1fr));`;
      wrap.innerHTML = `
        <div class="text-center mb-10">
          <p class="eyebrow">${currentLang === 'es' ? 'Tu comparación' : 'Your comparison'}</p>
          <h3 class="font-serif text-3xl md:text-4xl text-ink mt-3">${currentLang === 'es' ? 'Especificaciones, lado a lado.' : 'Specifications, side by side.'}</h3>
        </div>
        <div class="overflow-x-auto">
          <div class="min-w-[520px]">
            <div class="grid" style="${gridCols}">
              <div></div>
              ${products.map(p => `
                <div class="text-center px-3 pb-5 border-b-2 border-ink">
                  <button class="js-remove-compare text-mist hover:text-ink text-[0.65rem] tracking-[0.12em] uppercase mb-2" data-product-id="${p.id}">${currentLang === 'es' ? 'Quitar ✕' : 'Remove ✕'}</button>
                  <div class="w-20 h-20 md:w-24 md:h-24 mx-auto bg-cream mb-2 overflow-hidden border border-pearl">
                    <img src="${p.mainImage}" alt="${pick(p.name)}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80';" />
                  </div>
                  <h3 class="font-serif text-sm md:text-base text-ink leading-snug">${pick(p.name)}</h3>
                  ${p.variants && p.variants.length > 1 ? `
                    <div class="flex flex-wrap justify-center gap-1 mt-2">
                      ${p.variants.map(v => `
                        <button class="js-compare-size text-[0.6rem] tracking-wide uppercase px-2 py-1 border transition-colors ${compareSizeSelection[p.id] === v.name ? 'bg-ink text-white border-ink' : 'border-pearl text-graphite hover:border-ink'}" data-product-id="${p.id}" data-size="${v.name}">${v.name}</button>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
            ${SPEC_ROWS.map((row, ri) => `
              <div class="grid ${ri % 2 === 1 ? 'bg-pearl/30' : ''} ${row.price ? 'bg-cream/60' : ''}" style="${gridCols}">
                <div class="py-4 px-2 text-xs tracking-[0.12em] uppercase text-graphite font-medium flex items-center">${pick(row)}</div>
                ${products.map(p => `<div class="py-4 px-3 text-center border-l border-pearl flex items-center justify-center ${row.price ? 'font-price text-gold text-base md:text-lg' : 'text-sm text-ink'}">${row.get(p)}</div>`).join('')}
              </div>
            `).join('')}
            <div class="grid" style="${gridCols}">
              <div></div>
              ${products.map(p => `
                <div class="px-3 pt-6 border-l border-pearl">
                  <a href="${nvProductUrl(p.id)}" class="js-view-product nv-abtn btn-outline w-full" data-product-id="${p.id}">${currentLang === 'es' ? 'Ver Detalle' : 'View Details'}</a>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // ==== Carrito de compras ====
    const WHATSAPP_NUMBER = '50253984599';

    function cartLine(entry) {
      const p = PRODUCTS.find(x => x.id === entry.productId);
      if (!p) return null;
      const v = (p.variants || []).find(x => x.name === entry.variantName) || p.variants[0];
      if (!v) return null;
      return { p, v, qty: entry.qty };
    }

    function cartCount() {
      return cart.reduce((sum, e) => sum + e.qty, 0);
    }

    function cartTotal() {
      return cart.reduce((sum, e) => {
        const line = cartLine(e);
        if (!line || !line.v.price) return sum;
        return sum + line.v.price * line.qty;
      }, 0);
    }

    // ==== Carrito: código de descuento ====
    // Cada código puede exigir que el carrito tenga al menos un producto de
    // cierta categoría (ej. "Colchones") para aplicar. Si no se cumple, el
    // código queda guardado pero inactivo hasta que se agregue lo requerido.
    const DISCOUNT_CODES = {
      'EXPOBODA2026': { amount: 500, requiresCategory: { es: 'Colchones', en: 'Mattresses' } },
    };
    let appliedDiscountCode = null; // ej. 'EXPOBODA2026', o null si no se ha aplicado nada

    function cartHasCategory(categoryEs) {
      return cart.some(e => {
        const line = cartLine(e);
        return !!(line && line.p.category && line.p.category.es === categoryEs);
      });
    }

    // Descuento activo en este momento (null si no hay código aplicado o si el
    // carrito ya no cumple su requisito, ej. se quitó el colchón del pedido).
    function activeDiscount() {
      if (!appliedDiscountCode) return null;
      const def = DISCOUNT_CODES[appliedDiscountCode];
      if (!def) return null;
      if (def.requiresCategory && !cartHasCategory(def.requiresCategory.es)) return null;
      return def;
    }

    function discountAmount() {
      const d = activeDiscount();
      if (!d) return 0;
      return Math.min(d.amount, cartTotal());
    }

    // Total final después de aplicar el descuento (si corresponde) — este es
    // el que se muestra, se manda por WhatsApp y se usa para calcular cuotas.
    function finalCartTotal() {
      return Math.max(0, cartTotal() - discountAmount());
    }

    function applyDiscountCode() {
      const input = document.getElementById('co-discount-code');
      const raw = (input ? input.value : '').trim().toUpperCase();
      if (!raw) return;
      appliedDiscountCode = raw; // DISCOUNT_CODES lookup below decides if it's real
      renderCart();
    }

    function renderDiscountStatus() {
      const msg = document.getElementById('discount-message');
      if (!msg) return;
      if (!appliedDiscountCode) {
        msg.classList.add('hidden');
        msg.textContent = '';
        msg.style.color = '';
        return;
      }
      msg.classList.remove('hidden');
      const def = DISCOUNT_CODES[appliedDiscountCode];
      if (!def) {
        // Código escrito no coincide con ninguno válido.
        msg.style.color = '#B3261E';
        msg.textContent = currentLang === 'es' ? 'Código no válido.' : 'Invalid code.';
        return;
      }
      if (cartHasCategory(def.requiresCategory.es)) {
        msg.style.color = '#53575A';
        msg.textContent = currentLang === 'es'
          ? `✓ Código ${appliedDiscountCode} aplicado: -${formatPrice(def.amount)}`
          : `✓ Code ${appliedDiscountCode} applied: -${formatPrice(def.amount)}`;
      } else {
        msg.style.color = '#B3261E';
        msg.textContent = currentLang === 'es'
          ? 'Este código solo es válido al agregar un colchón a tu pedido.'
          : 'This code is only valid when a mattress is added to your order.';
      }
    }

    function updateCartBadge() {
      const count = cartCount();
      const label = count > 99 ? '99+' : String(count);
      ['cart-badge', 'cart-badge-drawer'].forEach(id => {
        const badge = document.getElementById(id);
        if (!badge) return;
        badge.textContent = label;
        badge.classList.toggle('hidden', count === 0);
      });
    }

    function addToCart(productId, variantName, qty) {
      qty = qty || 1;
      const existing = cart.find(e => e.productId === productId && e.variantName === variantName);
      if (existing) existing.qty += qty;
      else cart.push({ productId, variantName, qty });
      updateCartBadge();
      renderCart();
      showCartToast(productId);
    }

    // ==== Toast "Agregado al carrito" ====
    let cartToastTimer = null;
    function showCartToast(productId) {
      const p = PRODUCTS.find(x => x.id === productId);
      const name = p ? pick(p.name) : '';
      const textEl = document.getElementById('cart-toast-text');
      if (textEl) {
        textEl.textContent = currentLang === 'es'
          ? (name ? `${name} agregado al carrito` : 'Agregado al carrito')
          : (name ? `${name} added to cart` : 'Added to cart');
      }
      const toast = document.getElementById('cart-toast');
      if (!toast) return;
      toast.classList.add('show');
      clearTimeout(cartToastTimer);
      cartToastTimer = setTimeout(hideCartToast, 5000);
    }
    function hideCartToast() {
      clearTimeout(cartToastTimer);
      const toast = document.getElementById('cart-toast');
      if (toast) toast.classList.remove('show');
    }

    function removeFromCart(productId, variantName) {
      cart = cart.filter(e => !(e.productId === productId && e.variantName === variantName));
      updateCartBadge();
      renderCart();
    }

    function setCartQty(productId, variantName, qty) {
      const entry = cart.find(e => e.productId === productId && e.variantName === variantName);
      if (!entry) return;
      if (qty <= 0) { removeFromCart(productId, variantName); return; }
      entry.qty = qty;
      updateCartBadge();
      renderCart();
    }

    function installmentAmount(total, cuotas) {
      return cuotas > 1 ? Math.ceil(total / cuotas) : total;
    }

    function paymentSummaryText() {
      const total = finalCartTotal();
      const n = checkoutForm.cuotas;
      if (n <= 1) {
        return currentLang === 'es' ? `Pago de contado — ${formatPrice(total)}` : `One-time payment — ${formatPrice(total)}`;
      }
      const perInstallment = installmentAmount(total, n);
      return currentLang === 'es'
        ? `${n} cuotas de ${formatPrice(perInstallment)} c/u (total ${formatPrice(total)})`
        : `${n} installments of ${formatPrice(perInstallment)} each (total ${formatPrice(total)})`;
    }

    function buildWhatsAppOrderText() {
      const lines = cart.map(e => {
        const line = cartLine(e);
        if (!line) return '';
        const { p, v, qty } = line;
        const priceLabel = v.price ? formatPrice(v.price * qty) : (currentLang === 'es' ? 'cotización pendiente' : 'quote pending');
        return `• ${pick(p.name)} (${v.name}) x${qty} — ${priceLabel}`;
      }).join('\n');
      const subtotal = cartTotal();
      const discount = discountAmount();
      const total = finalCartTotal();
      let totalLine = '';
      if (discount > 0) {
        totalLine = currentLang === 'es'
          ? `\n\nSubtotal: ${formatPrice(subtotal)}\nDescuento (${appliedDiscountCode}): -${formatPrice(discount)}\nTotal estimado: ${formatPrice(total)}`
          : `\n\nSubtotal: ${formatPrice(subtotal)}\nDiscount (${appliedDiscountCode}): -${formatPrice(discount)}\nEstimated total: ${formatPrice(total)}`;
      } else if (total > 0) {
        totalLine = currentLang === 'es' ? `\n\nTotal estimado: ${formatPrice(total)}` : `\n\nEstimated total: ${formatPrice(total)}`;
      }
      const intro = currentLang === 'es' ? '¡Hola Nuvela! 👋 Quiero hacer este pedido:\n\n' : 'Hello Nuvela! 👋 I would like to place this order:\n\n';

      const facturaNombre = checkoutForm.facturaNombre.trim() || (currentLang === 'es' ? 'Consumidor Final' : 'Final Consumer');
      const nit = checkoutForm.nit.trim() || 'C/F';
      const direccionFactura = checkoutForm.direccionFactura.trim() || '—';
      const customerBlock = currentLang === 'es'
        ? `\n\n—— Datos del cliente ——\nNombre: ${checkoutForm.nombre.trim()}\nTeléfono: ${checkoutForm.telefono.trim()}\nNombre de factura: ${facturaNombre}\nNIT: ${nit}\nDirección de facturación: ${direccionFactura}\nDirección de entrega: ${checkoutForm.direccionEntrega.trim()}`
        : `\n\n—— Customer details ——\nName: ${checkoutForm.nombre.trim()}\nPhone: ${checkoutForm.telefono.trim()}\nInvoice name: ${facturaNombre}\nNIT: ${nit}\nBilling address: ${direccionFactura}\nDelivery address: ${checkoutForm.direccionEntrega.trim()}`;

      const paymentBlock = currentLang === 'es'
        ? `\n\nMétodo de pago: ${paymentSummaryText()}`
        : `\n\nPayment method: ${paymentSummaryText()}`;

      return intro + lines + totalLine + customerBlock + paymentBlock;
    }

    function checkoutViaWhatsApp() {
      if (!cart.length) return;
      const required = ['nombre', 'telefono', 'direccionEntrega'];
      const missing = required.some(k => !checkoutForm[k] || !checkoutForm[k].trim());
      if (missing) {
        const err = document.getElementById('checkout-error');
        if (err) {
          err.textContent = currentLang === 'es'
            ? 'Completa nombre, teléfono y dirección de entrega para continuar.'
            : 'Please fill in name, phone and delivery address to continue.';
          err.classList.remove('hidden');
          err.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      const err = document.getElementById('checkout-error');
      if (err) err.classList.add('hidden');
      const text = buildWhatsAppOrderText();
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener');
    }

    // ==== Carrito: cuotas (installment) selector ====
    function renderCuotasSelector() {
      const el = document.getElementById('cuotas-selector');
      if (!el) return;
      el.innerHTML = CUOTA_OPTIONS.map(n => {
        const selected = checkoutForm.cuotas === n;
        const label = n === 1
          ? (currentLang === 'es' ? '1 Pago' : '1 Payment')
          : (currentLang === 'es' ? `${n} Cuotas` : `${n} Installments`);
        return `<button type="button" class="js-select-cuotas px-4 py-2 text-xs tracking-[0.12em] uppercase border transition-colors ${selected ? 'bg-gold text-white border-gold' : 'border-pearl text-graphite hover:border-gold'}" data-cuotas="${n}">${label}</button>`;
      }).join('');
    }

    function renderCuotasSummary() {
      const el = document.getElementById('cuotas-summary');
      if (!el) return;
      if (!cart.length) { el.innerHTML = ''; return; }
      el.innerHTML = paymentSummaryText().replace(/(Q[\d,]+)/g, '<strong class="text-ink">$1</strong>');
    }

    function renderCart() {
      const wrap = document.getElementById('cart-content');
      const extra = document.getElementById('checkout-extra');
      if (!wrap) return;
      if (!cart.length) {
        wrap.innerHTML = `
          <div class="text-center py-16">
            <p class="font-serif text-2xl text-ink">${currentLang === 'es' ? 'Tu carrito está vacío.' : 'Your cart is empty.'}</p>
            <p class="text-graphite mt-3">${currentLang === 'es' ? 'Explora nuestros productos y agrega los que te interesen.' : 'Browse our products and add the ones you like.'}</p>
            <button data-page="producto" class="btn-gold mt-8">${currentLang === 'es' ? 'Ver Productos' : 'View Products'}</button>
          </div>`;
        if (extra) extra.classList.add('hidden');
        return;
      }
      if (extra) extra.classList.remove('hidden');
      const rows = cart.map(e => {
        const line = cartLine(e);
        if (!line) return '';
        const { p, v, qty } = line;
        const unitLabel = formatPrice(v.price);
        const subtotalLabel = v.price ? formatPrice(v.price * qty) : (currentLang === 'es' ? 'Cotización' : 'Quote');
        return `
          <div class="flex flex-col sm:flex-row gap-6 py-7 border-b border-pearl">
            <div class="w-full sm:w-40 h-52 sm:h-40 bg-cream overflow-hidden flex-shrink-0">
              <img src="${p.mainImage}" alt="${pick(p.name)}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80';" />
            </div>
            <div class="flex-grow">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="font-serif text-xl text-ink">${pick(p.name)}</h3>
                  <p class="text-ink text-sm mt-1"><strong>${v.name}</strong>${pick(v.detail) ? ` — ${pick(v.detail)}` : ''}</p>
                  <p class="text-mist text-sm mt-0.5">${currentLang === 'es' ? 'Precio unitario' : 'Unit price'}: ${unitLabel}</p>
                </div>
                <button class="js-cart-remove text-mist hover:text-ink text-[0.65rem] tracking-[0.12em] uppercase whitespace-nowrap" data-product-id="${p.id}" data-variant="${v.name}">${currentLang === 'es' ? 'Quitar ✕' : 'Remove ✕'}</button>
              </div>
              <div class="flex items-center justify-between mt-5">
                <div class="flex items-center border border-pearl">
                  <button type="button" class="js-cart-qty-minus w-9 h-9 text-ink hover:bg-cream" data-product-id="${p.id}" data-variant="${v.name}" aria-label="-">−</button>
                  <span class="w-9 text-center font-price text-ink text-sm">${qty}</span>
                  <button type="button" class="js-cart-qty-plus w-9 h-9 text-ink hover:bg-cream" data-product-id="${p.id}" data-variant="${v.name}" aria-label="+">+</button>
                </div>
                <p class="font-price text-gold text-xl">${subtotalLabel}</p>
              </div>
            </div>
          </div>`;
      }).join('');

      const subtotal = cartTotal();
      const discount = discountAmount();
      const total = finalCartTotal();
      const discountRow = discount > 0
        ? `<p class="text-graphite text-sm mt-1">${currentLang === 'es' ? 'Subtotal' : 'Subtotal'}: ${formatPrice(subtotal)} &nbsp;·&nbsp; ${currentLang === 'es' ? 'Descuento' : 'Discount'} (${appliedDiscountCode}): <span style="color:#B3261E;">-${formatPrice(discount)}</span></p>`
        : '';
      wrap.innerHTML = `
        <div>${rows}</div>
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p class="text-graphite text-sm max-w-sm">${currentLang === 'es' ? 'El envío se coordina por WhatsApp según tu dirección de entrega.' : 'Shipping is coordinated over WhatsApp based on your delivery address.'}</p>
          <div class="text-right">
            <p class="text-mist text-xs tracking-[0.18em] uppercase">${currentLang === 'es' ? 'Total estimado' : 'Estimated total'}</p>
            <p class="font-price text-3xl text-gold">${formatPrice(total)}</p>
            ${discountRow}
          </div>
        </div>
      `;
      renderCuotasSelector();
      renderCuotasSummary();
      renderDiscountStatus();
    }

    // ==== Línea para Hoteles: solicitud de cotización de varios productos ====
    function quoteLine(entry) {
      const p = PRODUCTS.find(x => x.id === entry.productId);
      if (!p) return null;
      const v = (p.variants || []).find(x => x.name === entry.variantName) || (p.variants && p.variants[0]);
      return { p, v: v || null, qty: entry.qty };
    }

    function quoteCount() {
      return quoteCart.reduce((sum, e) => sum + e.qty, 0);
    }

    function addToQuote(productId, variantName, qty) {
      qty = qty || 1;
      const existing = quoteCart.find(e => e.productId === productId && e.variantName === variantName);
      if (existing) existing.qty += qty;
      else quoteCart.push({ productId, variantName, qty });
      renderQuoteCart();
    }

    function removeFromQuote(productId, variantName) {
      quoteCart = quoteCart.filter(e => !(e.productId === productId && e.variantName === variantName));
      renderQuoteCart();
    }

    function setQuoteQty(productId, variantName, qty) {
      const entry = quoteCart.find(e => e.productId === productId && e.variantName === variantName);
      if (!entry) return;
      if (qty <= 0) { removeFromQuote(productId, variantName); return; }
      entry.qty = qty;
      renderQuoteCart();
    }

    function buildWhatsAppQuoteText() {
      const lines = quoteCart.map(e => {
        const line = quoteLine(e);
        if (!line) return '';
        const { p, v, qty } = line;
        const sizeLabel = v ? ` (${v.name})` : '';
        return `• ${pick(p.name)}${sizeLabel} x${qty}`;
      }).join('\n');
      const intro = currentLang === 'es'
        ? '¡Hola Nuvela! 👋 Quisiera solicitar cotización para hotelería/proyecto de estos productos:\n\n'
        : 'Hello Nuvela! 👋 I would like a quote for a hospitality/project order of these products:\n\n';

      const empresaLine = quoteForm.empresa.trim()
        ? (currentLang === 'es' ? `\nHotel / Empresa: ${quoteForm.empresa.trim()}` : `\nHotel / Company: ${quoteForm.empresa.trim()}`)
        : '';
      const correoLine = quoteForm.correo.trim()
        ? (currentLang === 'es' ? `\nCorreo: ${quoteForm.correo.trim()}` : `\nEmail: ${quoteForm.correo.trim()}`)
        : '';
      const comentariosLine = quoteForm.comentarios.trim()
        ? (currentLang === 'es' ? `\nComentarios: ${quoteForm.comentarios.trim()}` : `\nNotes: ${quoteForm.comentarios.trim()}`)
        : '';
      const contactBlock = currentLang === 'es'
        ? `\n\n—— Datos de contacto ——\nNombre: ${quoteForm.nombre.trim()}\nTeléfono: ${quoteForm.telefono.trim()}${empresaLine}${correoLine}${comentariosLine}`
        : `\n\n—— Contact details ——\nName: ${quoteForm.nombre.trim()}\nPhone: ${quoteForm.telefono.trim()}${empresaLine}${correoLine}${comentariosLine}`;

      return intro + lines + contactBlock;
    }

    function requestQuoteViaWhatsApp() {
      if (!quoteCart.length) return;
      const required = ['nombre', 'telefono', 'empresa', 'correo'];
      const missing = required.some(k => !quoteForm[k] || !quoteForm[k].trim());
      if (missing) {
        const err = document.getElementById('quote-error');
        if (err) {
          err.textContent = currentLang === 'es'
            ? 'Completa nombre, teléfono, hotel/empresa y correo para continuar.'
            : 'Please fill in name, phone, hotel/company and email to continue.';
          err.classList.remove('hidden');
          err.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      const err = document.getElementById('quote-error');
      if (err) err.classList.add('hidden');
      const text = buildWhatsAppQuoteText();
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener');
    }

    function renderQuoteCart() {
      const wrap = document.getElementById('quote-cart-content');
      const extra = document.getElementById('quote-form-extra');
      if (!wrap) return;
      if (!quoteCart.length) {
        wrap.innerHTML = `
          <div class="text-center py-6">
            <p class="font-serif text-xl text-ink">${currentLang === 'es' ? 'Tu cotización está vacía.' : 'Your quote request is empty.'}</p>
            <p class="text-graphite text-sm mt-2">${currentLang === 'es' ? 'Agrega los productos que te interesan con "+ Agregar a Cotización".' : 'Add the products you are interested in with "+ Add to Quote Request".'}</p>
          </div>`;
        if (extra) extra.classList.add('hidden');
        return;
      }
      if (extra) extra.classList.remove('hidden');
      const rows = quoteCart.map(e => {
        const line = quoteLine(e);
        if (!line) return '';
        const { p, v, qty } = line;
        return `
          <div class="quote-row flex items-center gap-4 py-4 border-b border-pearl" data-quote-row="${p.id}::${v ? v.name : ''}">
            <div class="w-16 h-16 bg-cream overflow-hidden flex-shrink-0">
              <img src="${p.mainImage}" alt="${pick(p.name)}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80';" />
            </div>
            <div class="flex-grow">
              <h3 class="font-serif text-base text-ink">${pick(p.name)}</h3>
              ${v ? `<p class="text-mist text-xs mt-0.5">${v.name}</p>` : ''}
            </div>
            <div class="flex items-center border border-pearl">
              <button type="button" class="js-quote-qty-minus w-8 h-8 text-ink hover:bg-cream" data-product-id="${p.id}" data-variant="${v ? v.name : ''}" aria-label="-">−</button>
              <input type="number" min="1" inputmode="numeric" class="js-quote-qty-input w-12 text-center font-price text-ink text-sm border-0 focus:outline-none focus:bg-cream" data-product-id="${p.id}" data-variant="${v ? v.name : ''}" value="${qty}" />
              <button type="button" class="js-quote-qty-plus w-8 h-8 text-ink hover:bg-cream" data-product-id="${p.id}" data-variant="${v ? v.name : ''}" aria-label="+">+</button>
            </div>
            <button class="js-quote-remove text-mist hover:text-ink text-[0.65rem] tracking-[0.12em] uppercase whitespace-nowrap" data-product-id="${p.id}" data-variant="${v ? v.name : ''}">${currentLang === 'es' ? 'Quitar ✕' : 'Remove ✕'}</button>
          </div>`;
      }).join('');
      wrap.innerHTML = `
        <p class="eyebrow">${currentLang === 'es' ? 'Tu Cotización' : 'Your Quote Request'} (${quoteCount()})</p>
        <div class="mt-3">${rows}</div>
      `;
    }

    // ==== Agenda tu Cita ====
    // One shared Google Calendar "Appointment Schedule" for the whole team
    // (owned by comercial@nuvelagt.com) — the showroom only has one room, so
    // everyone books off the SAME calendar; that's what guarantees two
    // advisors can never be booked for the same hour (see
    // CITA_SHOWROOM_CALENDAR_URL below). Google's own booking form already
    // asks the client which advisor they prefer (a custom question Eduardo
    // added inside Google Calendar's settings), so CITA_ADVISORS here is
    // just "meet the team" — plain cards with no individual booking link —
    // and there's ONE button underneath that opens the shared calendar.
    // Earlier this showed a separate booking button per advisor (each their
    // own calendar), which double-booked the one room; before that it was
    // fixed by pointing all 3 buttons to the same calendar, but that still
    // asked "which advisor" twice (card, then Google's form) — confusing —
    // so as of Sept 2026 there's only one prompt, inside Google. If
    // CITA_SHOWROOM_CALENDAR_URL is ever emptied, the button falls back to
    // WHATSAPP_NUMBER instead of a broken link.
    const CITA_SHOWROOM_CALENDAR_URL = 'https://calendar.app.google/Tgxa44AVsYCLJELc6';
    const CITA_ADVISORS = [
      { name: 'Manuel M.', role: { es: 'Ventas', en: 'Sales' } },
      { name: 'Eduardo R.', role: { es: 'Ventas y Asesoría', en: 'Sales & Advisory' } },
      { name: 'Carlo C.', role: { es: 'Ventas', en: 'Sales' } },
      { name: 'Alvaro L.', role: { es: 'Administración', en: 'Administration' } },
    ];

    function renderCitaAsesores() {
      const wrap = document.getElementById('cita-calendar-wrap');
      if (!wrap) return;
      const cardsHtml = CITA_ADVISORS.map((advisor) => {
        const initial = escapeHtml((advisor.name || '?').trim().charAt(0).toUpperCase() || '?');
        const roleText = escapeHtml((advisor.role && advisor.role[currentLang]) || '');
        return `
          <div class="border border-pearl bg-white p-6 text-center flex flex-col items-center rounded-2xl">
            <div class="w-14 h-14 rounded-full bg-gold/15 text-gold flex items-center justify-center font-serif text-xl">${initial}</div>
            <p class="font-serif text-lg text-ink mt-4">${escapeHtml(advisor.name)}</p>
            <p class="text-graphite text-xs uppercase tracking-wide mt-1">${roleText}</p>
          </div>`;
      }).join('');
      const ctaHtml = CITA_SHOWROOM_CALENDAR_URL
        ? `<a href="${CITA_SHOWROOM_CALENDAR_URL}" target="_blank" rel="noopener" class="btn-gold mt-8 !py-3.5 !px-10 inline-block">${currentLang === 'es' ? 'Ver horarios y agendar' : 'View times and book'}</a>`
        : `<a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener" class="btn-gold mt-8 !py-3.5 !px-10 inline-block">${currentLang === 'es' ? 'Escríbenos por WhatsApp' : 'Message us on WhatsApp'}</a>
           <p class="text-graphite/50 text-[0.65rem] mt-2">${currentLang === 'es' ? 'Calendario próximamente' : 'Calendar coming soon'}</p>`;
      wrap.innerHTML = `<div class="grid sm:grid-cols-3 gap-6">${cardsHtml}</div><div class="text-center">${ctaHtml}</div>`;
    }

    // ==== Sucursales / Google Maps ====
    // Each branch gets an embedded Google Maps card (no API key needed —
    // the classic "output=embed" trick) plus a "Cómo llegar" button that
    // opens real Google Maps directions in a new tab. Today there's only
    // one branch (Zona 9), but this is a list so adding a second location
    // later is just one more entry in SUCURSALES.
    //
    // IMPORTANT — two things learned the hard way, keep both:
    // 1) The embed iframe (`q=...&output=embed`) is built from `lat`/`lng`
    //    coordinates, NOT text. Text search ("Nuvela, 1A Avenida...") can
    //    match similarly-named businesses (Nabla, INVELA) instead of the
    //    real one, and a raw "place_id:" is not understood by this
    //    key-free endpoint at all — it silently centers on (0,0), off the
    //    coast of Africa. Coordinates are unambiguous.
    // 2) The "Cómo llegar" button uses Google's official Directions URL
    //    (`/maps/dir/?api=1`), which DOES support `destination_place_id`
    //    properly — so it opens turn-by-turn directions straight to the
    //    real "Nuvela" listing (name, hours, photo) instead of a bare pin.
    // To find a new branch's lat/lng + placeId: open its Google Maps
    // listing in a browser, and read them out of the address bar URL
    // (.../place/Name/@LAT,LNG,17z/.../1s<PLACE_ID>...).
    const SUCURSALES = [
      {
        name: { es: 'Nuvela Zona 9', en: 'Nuvela Zone 9' },
        detail: {
          es: 'Zona 9, Ciudad de Guatemala · Dentro de condominio, ingreso independiente. Atención bajo cita previa.',
          en: 'Zone 9, Guatemala City · Inside a condominium, independent entrance. By appointment only.',
        },
        lat: 14.606778,
        lng: -90.525179,
        placeId: 'ChIJ_2ZvJ3ehiYURryjarZbKiII',
      },
    ];

    function renderCitaSucursales() {
      const wrap = document.getElementById('cita-sucursales');
      if (!wrap) return;
      wrap.innerHTML = SUCURSALES.map((s) => {
        const embedSrc = `https://www.google.com/maps?q=${s.lat},${s.lng}&output=embed`;
        const mapsLink = s.placeId
          ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(pick(s.name))}&destination_place_id=${s.placeId}`
          : `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`;
        return `
          <div class="border border-pearl bg-cream overflow-hidden sm:flex">
            <div class="sm:w-1/2 aspect-[4/3] sm:aspect-auto bg-pearl">
              <iframe src="${embedSrc}" class="w-full h-full min-h-[240px] border-0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${escapeHtml(pick(s.name))}"></iframe>
            </div>
            <div class="sm:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
              <p class="font-serif text-xl text-ink">${escapeHtml(pick(s.name))}</p>
              <p class="text-graphite text-sm mt-2 leading-relaxed">${escapeHtml(pick(s.detail))}</p>
              <a href="${mapsLink}" target="_blank" rel="noopener" class="btn-gold mt-5 !px-6 self-start">${currentLang === 'es' ? 'Cómo llegar' : 'Get Directions'}</a>
            </div>
          </div>
        `;
      }).join('');
    }

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
    const GOOGLE_PLACE_ID = 'ChIJ_2ZvJ3ehiYURryjarZbKiII';
    const GOOGLE_MAPS_PROFILE_URL = 'https://maps.app.goo.gl/7jxuZavDRfuQANMd8';

    let googleMapsScriptRequested = false;
    let cachedPlaceDetails = null; // avoids re-billing the Places API on every language toggle / page revisit

    function escapeHtml(str) {
      return String(str == null ? '' : str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function starString(rating) {
      const rounded = Math.max(0, Math.min(5, Math.round(rating || 0)));
      return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
    }

    function renderResenasFallback(wrap) {
      wrap.innerHTML = `
        <div class="border border-pearl bg-cream p-10 text-center rounded-2xl">
          <p class="font-serif text-xl text-ink">${currentLang === 'es' ? 'Muy pronto verás aquí nuestras reseñas de Google.' : 'Our Google reviews will appear here soon.'}</p>
          <p class="text-graphite text-sm mt-3">${currentLang === 'es' ? 'Mientras tanto, puedes verlas directamente en nuestro perfil de Google.' : 'In the meantime, you can see them directly on our Google profile.'}</p>
          ${GOOGLE_MAPS_PROFILE_URL ? `<a href="${GOOGLE_MAPS_PROFILE_URL}" target="_blank" rel="noopener" class="btn-gold mt-6 inline-block">${currentLang === 'es' ? 'Ver reseñas en Google' : 'See reviews on Google'}</a>` : ''}
        </div>`;
    }

    function loadGoogleMapsScript(cb) {
      if (window.google && window.google.maps && window.google.maps.places) { cb(); return; }
      if (googleMapsScriptRequested) {
        const check = setInterval(() => {
          if (window.google && window.google.maps && window.google.maps.places) {
            clearInterval(check);
            cb();
          }
        }, 150);
        setTimeout(() => clearInterval(check), 8000);
        return;
      }
      googleMapsScriptRequested = true;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_PLACES_API_KEY)}&libraries=places`;
      script.async = true;
      script.onload = cb;
      script.onerror = () => {
        const wrap = document.getElementById('resenas-wrap');
        if (wrap) renderResenasFallback(wrap);
      };
      document.head.appendChild(script);
    }

    function renderReviewsFromPlace(wrap, place) {
      const mapsUrl = GOOGLE_MAPS_PROFILE_URL || place.url || '';
      const reviews = (place.reviews || []).slice(0, 5);
      const cardsHtml = reviews.map((r) => {
        const text = (r.text || '').trim();
        const truncated = text.length > 220 ? text.slice(0, 217).trim() + '…' : text;
        const initial = escapeHtml((r.author_name || '?').trim().charAt(0).toUpperCase() || '?');
        const avatar = r.profile_photo_url
          ? `<img src="${r.profile_photo_url}" alt="" class="w-10 h-10 rounded-full object-cover" referrerpolicy="no-referrer" />`
          : `<div class="w-10 h-10 rounded-full bg-gold/15 text-gold flex items-center justify-center font-serif text-sm">${initial}</div>`;
        return `
          <div class="border border-pearl bg-white p-6 flex flex-col h-full rounded-2xl">
            <div class="flex items-center gap-3">
              ${avatar}
              <div>
                <p class="text-sm font-medium text-ink">${escapeHtml(r.author_name || (currentLang === 'es' ? 'Cliente de Google' : 'Google customer'))}</p>
                <p class="text-graphite text-xs">${escapeHtml(r.relative_time_description || '')}</p>
              </div>
            </div>
            <div class="text-gold text-sm mt-3 tracking-wide">${starString(r.rating)}</div>
            <p class="text-graphite text-sm mt-3 leading-relaxed flex-1">${escapeHtml(truncated)}</p>
          </div>`;
      }).join('');
      wrap.innerHTML = `
        <div class="border border-pearl bg-cream p-8 md:p-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-10 text-center sm:text-left rounded-2xl">
          <div class="flex items-center gap-4">
            <span class="font-serif text-5xl text-ink">${(place.rating || 0).toFixed(1)}</span>
            <div>
              <div class="text-gold text-lg tracking-wide">${starString(place.rating)}</div>
              <p class="text-graphite text-xs mt-1">${place.user_ratings_total || 0} ${currentLang === 'es' ? 'reseñas en Google' : 'reviews on Google'}</p>
            </div>
          </div>
          ${mapsUrl ? `<a href="${mapsUrl}" target="_blank" rel="noopener" class="btn-outline shrink-0">${currentLang === 'es' ? 'Ver todas en Google' : 'See all on Google'}</a>` : ''}
        </div>
        ${reviews.length ? `<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${cardsHtml}</div>` : `<p class="text-graphite text-sm text-center">${currentLang === 'es' ? 'Aún no hay reseñas para mostrar.' : 'No reviews to show yet.'}</p>`}
        <p class="text-graphite/50 text-[0.65rem] text-center mt-8">${currentLang === 'es' ? 'Reseñas mostradas a través de Google.' : 'Reviews shown via Google.'}</p>`;
    }

    function renderGoogleReviews() {
      const wrap = document.getElementById('resenas-wrap');
      if (!wrap) return;
      if (!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACE_ID) {
        renderResenasFallback(wrap);
        return;
      }
      // Serve from cache when we already fetched once this session — avoids
      // re-billing the Places API on every language toggle / page revisit.
      if (cachedPlaceDetails) {
        renderReviewsFromPlace(wrap, cachedPlaceDetails);
        return;
      }
      wrap.innerHTML = `<p class="text-graphite text-sm text-center py-10">${currentLang === 'es' ? 'Cargando reseñas…' : 'Loading reviews…'}</p>`;
      loadGoogleMapsScript(() => {
        try {
          const service = new google.maps.places.PlacesService(document.createElement('div'));
          service.getDetails({ placeId: GOOGLE_PLACE_ID, fields: ['name', 'rating', 'user_ratings_total', 'reviews', 'url'] }, (place, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
              renderResenasFallback(wrap);
              return;
            }
            cachedPlaceDetails = place;
            renderReviewsFromPlace(wrap, place);
          });
        } catch (e) {
          renderResenasFallback(wrap);
        }
      });
    }

    // ==== Render: Producto detalle (single product page) ====
    function renderProductDetailContent(id) {
      const p = PRODUCTS.find(x => x.id === id);
      if (!p) return;
      const isSameProduct = currentProductId === id;
      currentProductId = id;

      const mainImg = document.getElementById('pd-main-img');
      mainImg.src = p.mainImage;
      mainImg.alt = pick(p.name);
      document.getElementById('pd-eyebrow').textContent = pick(p.eyebrow);
      document.getElementById('pd-title').textContent = pick(p.name);
      document.getElementById('pd-tagline').textContent = pick(p.tagline);
      document.getElementById('pd-description').textContent = pick(p.description);

      document.getElementById('pd-thumbs').innerHTML = p.gallery.map((src, i) => `
        <button class="thumb aspect-square overflow-hidden border ${i === 0 ? 'border-gold' : 'border-pearl'}" data-src="${src}">
          <img class="w-full h-full object-cover" src="${src}" alt="${pick(p.name)} — foto ${i + 1}" />
        </button>
      `).join('');

      const statsEl = document.getElementById('pd-stats');
      statsEl.innerHTML = p.stats.map(s => `
        <div class="bg-white border border-pearl p-4 rounded-xl"><p class="font-serif text-base md:text-lg text-gold leading-snug">${statVal(s.value)}</p><p class="eyebrow !text-graphite text-[0.6rem] mt-1">${pick(s.label)}</p></div>
      `).join('');

      // Keep the shopper's selected size across a language toggle; only reset
      // it (and the quantity) when this is actually a different product.
      if (!isSameProduct || !p.variants.some(v => v.name === pdSelectedVariant)) {
        pdSelectedVariant = (p.variants.find(v => v.featured) || p.variants[0]).name;
        pdQty = 1;
      }
      renderPdSizes();
      renderPdPurchase();

      document.getElementById('pd-benefits').innerHTML = p.benefits.map((b, i) => `
        <div class="bg-cream p-8 reveal"><p class="eyebrow">0${i + 1}</p><h3 class="font-serif text-xl text-ink mt-3">${pick(b.title)}</h3><p class="text-graphite text-sm mt-3 leading-relaxed">${pick(b.text)}</p></div>
      `).join('');
      document.getElementById('pd-benefits-section').style.display = (p.benefits && p.benefits.length) ? '' : 'none';

      const specsHeader = `
        <div class="grid grid-cols-2 bg-gold text-white text-xs tracking-[0.22em] uppercase font-semibold">
          <div class="p-4">${currentLang === 'es' ? 'Presentación' : 'Option'}</div>
          <div class="p-4">${currentLang === 'es' ? 'Detalle' : 'Detail'}</div>
        </div>`;
      const specsRows = p.variants.map((v, i) => `
        <div class="grid grid-cols-2 border-b border-pearl ${i % 2 === 1 ? 'bg-pearl/30' : ''}"><div class="p-4 font-serif text-lg text-ink">${v.name}</div><div class="p-4 text-graphite text-sm tracking-wide" style="font-feature-settings: 'tnum' 1, 'lnum' 1;">${pick(v.detail)}</div></div>
      `).join('');
      document.getElementById('pd-specs-table').innerHTML = specsHeader + specsRows;

      document.getElementById('pd-faq').innerHTML = (p.faqs || []).map(f => `
        <div class="faq-item">
          <div class="faq-q"><span class="font-serif text-lg text-ink">${pick(f.q)}</span><span class="icon">+</span></div>
          <div class="faq-a"><div class="faq-a-inner">${pick(f.a)}</div></div>
        </div>
      `).join('');
      document.getElementById('pd-faq-section').style.display = (p.faqs && p.faqs.length) ? '' : 'none';
    }

    function openProductDetail(id) {
      if (NV_PAGE !== 'producto-detalle' || NV_PRODUCT !== id) { nvGo(nvProductUrl(id)); return; }
      renderProductDetailContent(id);
      // Beneficios/Especificaciones: que cada producto arranque plegado en móvil.
      document.querySelectorAll('#page-producto-detalle .mobile-collapse-section').forEach(el => {
        el.classList.remove('open');
        const btn = el.querySelector('.js-mobile-collapse-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      showPage('producto-detalle');
    }

    // ==== Render: size/variant picker on the product detail page ====
    function renderPdSizes() {
      const el = document.getElementById('pd-sizes');
      if (!el) return;
      const p = PRODUCTS.find(x => x.id === currentProductId);
      if (!p) return;
      el.innerHTML = p.variants.map(v => `
        <button type="button" class="js-pd-size text-left border p-4 transition-colors rounded-xl ${pdSelectedVariant === v.name ? 'border-gold bg-cream' : 'border-pearl hover:border-gold'}" data-variant="${v.name}">
          <p class="font-serif text-lg text-ink">${v.name}</p>
          <p class="text-mist text-sm">${pick(v.detail)}</p>
          <p class="font-price text-gold text-sm mt-1">${formatPrice(v.price)}</p>
        </button>
      `).join('');
    }

    // ==== Render: quantity stepper + "Añadir al Carrito" on the product detail page ====
    function renderPdPurchase() {
      const wrap = document.getElementById('pd-purchase');
      if (!wrap) return;
      const p = PRODUCTS.find(x => x.id === currentProductId);
      if (!p) { wrap.innerHTML = ''; return; }
      const variant = p.variants.find(v => v.name === pdSelectedVariant) || p.variants[0];
      const subtotal = variant.price ? formatPrice(variant.price * pdQty) : formatPrice(0);
      wrap.innerHTML = `
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center border border-pearl">
            <button type="button" class="js-pd-qty-minus w-10 h-10 text-lg text-ink hover:bg-cream" aria-label="-">−</button>
            <span class="w-10 text-center font-price text-ink">${pdQty}</span>
            <button type="button" class="js-pd-qty-plus w-10 h-10 text-lg text-ink hover:bg-cream" aria-label="+">+</button>
          </div>
          <button type="button" class="js-pd-add-cart btn-gold flex-grow sm:flex-grow-0" data-product-id="${p.id}">${currentLang === 'es' ? 'Añadir al Carrito' : 'Add to Cart'}</button>
          <span id="pd-add-feedback" class="text-xs tracking-[0.14em] uppercase text-gold hidden">${currentLang === 'es' ? '✓ Agregado' : '✓ Added'}</span>
        </div>
        <p class="text-mist text-sm mt-3">${currentLang === 'es' ? 'Seleccionado' : 'Selected'}: <strong class="text-ink">${variant.name}</strong>${pdQty > 1 ? ` × ${pdQty} — <strong class="text-ink">${subtotal}</strong>` : ''}</p>
      `;
    }

    // ==== Render: Precios page (grouped by product) ====
    // Each product's pricing block gets its own HD texture background so the
    // sections read as separate segments instead of one repeated tile image.
    // ⚠️ EDUARDO: si prefieres usar tus propias fotos de textura en vez de las
    // generadas, solo reemplaza el archivo en images/ (mismo nombre) o cambia
    // la ruta aquí abajo.
    const PRODUCT_TEXTURES = {
      'nuvela-clasico': '/images/textura-colchon-nuvela.jpg',
      'nuvela-hotel': '/images/textura-nuvela-hotel.jpg',
      'almohada-memory-foam-1': '/images/textura-almohada-memoryfoam-1.jpg',
      'almohada-memory-foam-2': '/images/textura-almohada-memoryfoam-2.jpg',
      'almohada-plumas': '/images/textura-almohada-plumas.jpg',
      'duvet-nuvela': '/images/textura-duvet-nuvela.jpg',
      'protector-colchon': '/images/textura-protector-colchon.jpg',
      'camastron-nuvela': '/images/textura-camastron.jpg',
    };

    function renderPricing() {
      const container = document.getElementById('precios-container');
      if (!container) return;
      container.innerHTML = PRODUCTS.map((p, i) => {
        const texture = PRODUCT_TEXTURES[p.id] || '/images/colchas.jpg';
        return `
        <section class="relative py-12 md:py-28 bg-cover bg-center bg-no-repeat overflow-hidden ${i > 0 ? 'border-t border-pearl' : ''}" style="background-image: url('${texture}');">
          <div class="absolute inset-0 bg-white/55"></div>
          <div class="relative z-10 max-w-7xl mx-auto px-6">
            <div class="text-center mb-10">
              <p class="eyebrow">${pick(p.eyebrow)}</p>
              <h3 class="font-serif text-3xl md:text-4xl text-ink mt-3">${pick(p.name)}</h3>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              ${p.variants.map(v => `
                <div class="price-card ${v.featured ? 'featured' : ''} bg-white border ${v.featured ? 'border-2' : 'border-pearl'} p-8 reveal flex flex-col relative">
                  ${v.featured ? `<span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-[0.65rem] tracking-[0.32em] uppercase px-4 py-1.5">${currentLang === 'es' ? 'Más Vendido' : 'Most Popular'}</span>` : ''}
                  <p class="eyebrow">${pick(p.eyebrow)}</p>
                  <h3 class="font-serif text-3xl text-ink mt-3">${v.name}</h3>
                  <div class="my-8">
                    <p class="text-mist text-xs tracking-[0.18em] uppercase">${currentLang === 'es' ? 'Desde' : 'From'}</p>
                    <p class="font-price text-5xl ${v.featured ? 'text-gold' : 'text-ink'} mt-1">${formatPrice(v.price)}</p>
                  </div>
                  <ul class="space-y-2 text-sm text-graphite flex-grow">
                    <li class="flex gap-2"><span class="text-gold">◆</span><span>${pick(v.detail)}</span></li>
                    ${p.stats.map(s => `<li class="flex gap-2"><span class="text-gold">◆</span><span><strong class="text-ink">${pick(s.label)}:</strong> ${statVal(s.value)}</span></li>`).join('')}
                  </ul>
                  <button class="js-add-cart-variant ${v.featured ? 'btn-gold' : 'btn-outline'} mt-8 w-full" data-product-id="${p.id}" data-variant="${v.name}">${currentLang === 'es' ? 'Añadir al Carrito' : 'Add to Cart'}</button>
                  <button data-page="carrito" class="btn-outline mt-3 w-full">${currentLang === 'es' ? 'Ver mi Carrito' : 'View My Cart'}</button>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `;
      }).join('');
    }

    // ==== i18n ====
    function applyLang(lang) {
      currentLang = lang;
      localStorage.setItem('nuvela-lang', lang);
      document.documentElement.lang = lang;
      document.querySelectorAll('[data-en], [data-es]').forEach(el => {
        const txt = el.getAttribute(`data-${lang}`);
        if (txt !== null && txt !== undefined) el.innerHTML = txt;
      });
      document.querySelectorAll('[data-en-placeholder]').forEach(el => {
        const ph = el.getAttribute(`data-${lang}-placeholder`);
        if (ph) el.placeholder = ph;
      });
      // Toggle active state on lang buttons
      document.querySelectorAll('.lang-btn, .lang-btn-m').forEach(btn => {
        const isActive = btn.id.includes(lang);
        btn.classList.toggle('text-gold', isActive);
        btn.classList.toggle('text-mist', !isActive);
      });
      // Re-render dynamic product content in the new language
      nvSafe(renderCategoryFilters);
      nvSafe(renderNavProductsDropdown);
      nvSafe(renderProductsGrid);
      nvSafe(renderHotelGrid);
      nvSafe(renderPricing);
      nvSafe(renderComparePicker);
      nvSafe(renderCompareTable);
      nvSafe(renderCart);
      nvSafe(updateCartBadge);
      nvSafe(renderQuoteCart);
      nvSafe(renderCitaAsesores);
      nvSafe(renderCitaSucursales);
      nvSafe(renderGoogleReviews);
      nvSafe(renderMorphCardsContent);
      if (currentProductId) renderProductDetailContent(currentProductId);
      if (quizState.open) renderQuiz();
      // Home inmersivo: re-arma textos animados en el nuevo idioma
      if (window.NV && NV.onLang) NV.onLang(lang);
    }
    document.getElementById('lang-en').addEventListener('click', () => applyLang('en'));
    document.getElementById('lang-es').addEventListener('click', () => applyLang('es'));
    document.getElementById('lang-en-m').addEventListener('click', () => applyLang('en'));
    document.getElementById('lang-es-m').addEventListener('click', () => applyLang('es'));

    // ==== Page navigation ====
    function showPage(pageId) {
      if (pageId !== NV_PAGE) { nvGo(NV_ROUTES[pageId] || '/'); return; }
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const target = document.getElementById('page-' + pageId);
      if (target) target.classList.add('active');
      // Update nav active state
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageId);
      });
      // Scroll top
      if (window.NV && NV.scrollTop) NV.scrollTop(); else window.scrollTo({ top: 0, behavior: 'smooth' });
      // Home inmersivo: arma/desarma sus animaciones al entrar/salir
      if (window.NV && NV.onPage) NV.onPage(pageId);
      // Close drawer
      closeDrawer();
      // Re-trigger reveal observer
      setTimeout(initReveal, 50);
    }

    // Delegated click handling so this works for buttons that exist on page
    // load AND for ones injected later by renderProductsGrid/renderPricing/etc.
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-page]');
      if (!el) return;
      // Enlaces reales (<a href>): el navegador hace la navegación solo.
      if (el.tagName === 'A' && el.getAttribute('href') && el.dataset.page !== NV_PAGE) { nvSaveState(); return; }
      e.preventDefault();
      showPage(el.dataset.page);
    });

    // Los 2 botones del toast "Agregado al carrito" (Revisar Carrito /
    // Seguir Comprando) siempre cierran el toast. "Revisar Carrito" ademas
    // navega a la pagina del carrito via su atributo data-page (lo maneja
    // el listener delegado de arriba).
    document.addEventListener('click', (e) => {
      if (e.target.closest('.js-cart-toast-review') || e.target.closest('.js-cart-toast-continue')) {
        hideCartToast();
      }
    });

    // Acordeon del menu "Productos" del navbar -- abre/cierra la categoria
    // en la que se hizo click (Colchones, Almohadas, etc.). Empiezan todas
    // cerradas; se puede tener varias abiertas a la vez.
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('.js-nav-cat-toggle');
      if (!toggle) return;
      e.preventDefault();
      const section = toggle.closest('.nav-cat-section');
      if (!section) return;
      const isOpen = section.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-view-product');
      if (!btn) return;
      if (btn.tagName === 'A' && btn.getAttribute('href')) { nvSaveState(); return; }
      e.preventDefault();
      openProductDetail(btn.dataset.productId);
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-filter-category');
      if (!btn) return;
      if (NV_CAT_URLS[btn.dataset.category] && btn.dataset.category !== document.body.dataset.nvCat) {
        if (btn.tagName === 'A' && btn.getAttribute('href')) { nvSaveState(); return; }
        e.preventDefault(); nvGo(NV_CAT_URLS[btn.dataset.category]); return;
      }
      e.preventDefault();
      activeCategory = btn.dataset.category;
      renderCategoryFilters();
      renderProductsGrid();
      setTimeout(initReveal, 50);
      // Llevar la vista a la cuadrícula recién revelada, para que el cliente
      // vea de inmediato los productos de la categoría que acaba de elegir.
      setTimeout(() => {
        const wrap = document.getElementById('products-grid-wrap');
        if (wrap && window.NV && NV.lenis) NV.lenis.scrollTo(wrap, { offset: -110, duration: 1.4 });
        else if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    });

    // ==== Examen de Productos / Product Quiz ====
    document.addEventListener('click', (e) => {
      if (e.target.closest('#quiz-tile-btn') || e.target.closest('.js-nav-quiz-btn')) { e.preventDefault(); openQuiz(); return; }
      if (e.target.closest('#quiz-close-btn') || e.target.closest('#quiz-overlay-backdrop')) { e.preventDefault(); closeQuiz(); return; }
      const optBtn = e.target.closest('.js-quiz-option');
      if (optBtn) { e.preventDefault(); quizSelect(optBtn.dataset.value); return; }
      if (e.target.closest('#quiz-next-btn')) { e.preventDefault(); quizNext(); return; }
      if (e.target.closest('#quiz-back-btn')) { e.preventDefault(); quizBack(); return; }
      if (e.target.closest('#quiz-reveal-btn')) { e.preventDefault(); quizState.phase = 'result'; renderQuiz(); return; }
      if (e.target.closest('#quiz-restart-btn')) { e.preventDefault(); openQuiz(); return; }
      const viewBtn = e.target.closest('#quiz-view-product-btn');
      if (viewBtn) {
        e.preventDefault();
        const pid = viewBtn.dataset.productId;
        const variantHint = viewBtn.dataset.variant;
        closeQuiz();
        openProductDetail(pid);
        // openProductDetail() resets pdSelectedVariant to the featured/first
        // variant whenever the product changes, so the quiz's size hint (e.g.
        // Queen/King for the duvet) has to be re-applied AFTER that render.
        if (variantHint) {
          const p = PRODUCTS.find(x => x.id === pid);
          if (p && p.variants.some(v => v.name === variantHint)) {
            pdSelectedVariant = variantHint;
            renderPdSizes();
            renderPdPurchase();
          }
        }
        return;
      }
      if (e.target.closest('#quiz-cita-btn')) { e.preventDefault(); closeQuiz(); showPage('cita'); return; }
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-toggle-compare');
      if (!btn || btn.disabled) return;
      e.preventDefault();
      toggleCompare(btn.dataset.productId);
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-remove-compare');
      if (!btn) return;
      e.preventDefault();
      removeCompare(btn.dataset.productId);
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-compare-size');
      if (!btn) return;
      e.preventDefault();
      setCompareSize(btn.dataset.productId, btn.dataset.size);
    });

    // ==== Carrito: product-detail size picker + quantity + add ====
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-pd-size');
      if (!btn) return;
      e.preventDefault();
      pdSelectedVariant = btn.dataset.variant;
      renderPdSizes();
      renderPdPurchase();
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-pd-qty-minus');
      if (!btn) return;
      e.preventDefault();
      pdQty = Math.max(1, pdQty - 1);
      renderPdPurchase();
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-pd-qty-plus');
      if (!btn) return;
      e.preventDefault();
      pdQty = Math.min(20, pdQty + 1);
      renderPdPurchase();
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-pd-add-cart');
      if (!btn) return;
      e.preventDefault();
      const p = PRODUCTS.find(x => x.id === btn.dataset.productId);
      if (!p) return;
      const variant = p.variants.find(v => v.name === pdSelectedVariant) || p.variants[0];
      addToCart(p.id, variant.name, pdQty);
      pdQty = 1;
      renderPdPurchase();
      const fb = document.getElementById('pd-add-feedback');
      if (fb) {
        fb.classList.remove('hidden');
        clearTimeout(window.__pdFeedbackTimer);
        window.__pdFeedbackTimer = setTimeout(() => fb.classList.add('hidden'), 1800);
      }
    });

    // ==== Carrito: quick "Añadir al Carrito" from the Precios page ====
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-add-cart-variant');
      if (!btn) return;
      e.preventDefault();
      addToCart(btn.dataset.productId, btn.dataset.variant, 1);
      const original = btn.textContent;
      btn.textContent = currentLang === 'es' ? '✓ Agregado' : '✓ Added';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1200);
    });

    // ==== Carrito page: remove line, adjust quantity, checkout via WhatsApp ====
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-cart-remove');
      if (!btn) return;
      e.preventDefault();
      removeFromCart(btn.dataset.productId, btn.dataset.variant);
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-cart-qty-minus');
      if (!btn) return;
      e.preventDefault();
      const entry = cart.find(x => x.productId === btn.dataset.productId && x.variantName === btn.dataset.variant);
      if (entry) setCartQty(btn.dataset.productId, btn.dataset.variant, entry.qty - 1);
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-cart-qty-plus');
      if (!btn) return;
      e.preventDefault();
      const entry = cart.find(x => x.productId === btn.dataset.productId && x.variantName === btn.dataset.variant);
      if (entry) setCartQty(btn.dataset.productId, btn.dataset.variant, entry.qty + 1);
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#cart-checkout-btn');
      if (!btn) return;
      e.preventDefault();
      checkoutViaWhatsApp();
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#apply-discount-btn');
      if (!btn) return;
      e.preventDefault();
      applyDiscountCode();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const input = e.target.closest && e.target.closest('#co-discount-code');
      if (!input) return;
      e.preventDefault();
      applyDiscountCode();
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-select-cuotas');
      if (!btn) return;
      e.preventDefault();
      checkoutForm.cuotas = parseInt(btn.dataset.cuotas, 10);
      renderCuotasSelector();
      renderCuotasSummary();
    });

    // ==== Carrito: bind the checkout form's static inputs to checkoutForm ====
    // (bound once here, not re-rendered, so typed values survive cart updates)
    [
      ['co-nombre', 'nombre'],
      ['co-telefono', 'telefono'],
      ['co-factura-nombre', 'facturaNombre'],
      ['co-nit', 'nit'],
      ['co-direccion-factura', 'direccionFactura'],
      ['co-direccion-entrega', 'direccionEntrega'],
    ].forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', () => {
        checkoutForm[key] = el.value;
        const err = document.getElementById('checkout-error');
        if (err) err.classList.add('hidden');
      });
    });

    // ==== Línea para Hoteles: quote size selector, add/remove/qty, contact form, send ====
    document.addEventListener('change', (e) => {
      const sel = e.target.closest('.js-quote-size-select');
      if (!sel) return;
      quoteSizeSelection[sel.dataset.productId] = sel.value;
    });

    // Typeable quantity field: commits on blur/Enter (not on every keystroke) so
    // the customer can type a full number without the row re-rendering mid-type.
    document.addEventListener('change', (e) => {
      const input = e.target.closest('.js-quote-qty-input');
      if (!input) return;
      const val = parseInt(input.value, 10);
      setQuoteQty(input.dataset.productId, input.dataset.variant, isNaN(val) ? 0 : val);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const input = e.target.closest && e.target.closest('.js-quote-qty-input');
      if (!input) return;
      e.preventDefault();
      input.blur();
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-add-quote');
      if (!btn) return;
      e.preventDefault();
      const p = PRODUCTS.find(x => x.id === btn.dataset.productId);
      if (!p) return;
      const variantName = quoteSizeSelection[p.id] || (p.variants && p.variants[0] && p.variants[0].name);
      addToQuote(p.id, variantName, 1);
      const original = btn.textContent;
      btn.textContent = currentLang === 'es' ? '✓ Agregada' : '✓ Added';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1200);
      // Llevar el scroll a lo que se acaba de agregar en la cotización, arriba
      // de la página, para que el cliente vea de inmediato que se agregó —
      // luego puede volver a bajar y seguir agregando más productos.
      const rowKey = `${p.id}::${variantName || ''}`;
      setTimeout(() => {
        const row = document.querySelector(`[data-quote-row="${CSS.escape(rowKey)}"]`);
        if (row) {
          row.scrollIntoView({ behavior: 'smooth', block: 'center' });
          row.classList.add('bg-cream');
          setTimeout(() => row.classList.remove('bg-cream'), 1400);
        }
      }, 50);
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-quote-remove');
      if (!btn) return;
      e.preventDefault();
      removeFromQuote(btn.dataset.productId, btn.dataset.variant);
    });

    // "Ver mi Cotización" — navegación rápida desde cualquier línea de producto
    // hasta la bandeja de cotización, arriba de la página.
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-view-quote-cart');
      if (!btn) return;
      e.preventDefault();
      const section = document.getElementById('quote-tray-section');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-quote-qty-minus');
      if (!btn) return;
      e.preventDefault();
      const entry = quoteCart.find(x => x.productId === btn.dataset.productId && x.variantName === btn.dataset.variant);
      if (entry) setQuoteQty(btn.dataset.productId, btn.dataset.variant, entry.qty - 1);
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-quote-qty-plus');
      if (!btn) return;
      e.preventDefault();
      const entry = quoteCart.find(x => x.productId === btn.dataset.productId && x.variantName === btn.dataset.variant);
      if (entry) setQuoteQty(btn.dataset.productId, btn.dataset.variant, entry.qty + 1);
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#quote-request-btn');
      if (!btn) return;
      e.preventDefault();
      requestQuoteViaWhatsApp();
    });

    // (bound once here, not re-rendered, so typed values survive quote-cart updates)
    [
      ['qo-nombre', 'nombre'],
      ['qo-telefono', 'telefono'],
      ['qo-empresa', 'empresa'],
      ['qo-correo', 'correo'],
      ['qo-comentarios', 'comentarios'],
    ].forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', () => {
        quoteForm[key] = el.value;
        const err = document.getElementById('quote-error');
        if (err) err.classList.add('hidden');
      });
    });

    // ==== Mobile drawer ====
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('drawer-overlay');
    function openDrawer() { drawer.classList.add('open'); overlay.classList.remove('hidden'); }
    function closeDrawer() { drawer.classList.remove('open'); overlay.classList.add('hidden'); }
    document.getElementById('burger').addEventListener('click', openDrawer);
    document.getElementById('drawer-close').addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // ==== FAQ accordion (delegated — works for static AND product FAQs) ====
    document.addEventListener('click', (e) => {
      const q = e.target.closest('.faq-q');
      if (!q) return;
      q.parentElement.classList.toggle('open');
    });

    // ==== Secciones plegables en móvil (Beneficios / Especificaciones en la ====
    // ficha de producto): en escritorio el CSS las mantiene siempre abiertas,
    // así que este toggle solo tiene efecto visual en pantallas de teléfono.
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-mobile-collapse-toggle');
      if (!btn) return;
      const section = btn.closest('.mobile-collapse-section');
      if (!section) return;
      const nowOpen = section.classList.toggle('open');
      btn.setAttribute('aria-expanded', nowOpen ? 'true' : 'false');
    });

    // ==== Reveal on scroll ====
    let revealObserver = null;
    function initReveal() {
      if (revealObserver) revealObserver.disconnect();
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        // Only observe elements in active page
        if (el.closest('.page.active') || el.closest('header') || el.closest('footer')) {
          revealObserver.observe(el);
        }
      });
    }

    // ==== Product gallery thumbs (delegated) ====
    document.addEventListener('click', (e) => {
      const thumb = e.target.closest('#pd-thumbs .thumb');
      if (!thumb) return;
      const main = document.getElementById('pd-main-img');
      if (main && thumb.dataset.src) {
        main.style.opacity = '0';
        setTimeout(() => {
          main.src = thumb.dataset.src;
          main.style.opacity = '1';
        }, 300);
      }
      thumb.parentElement.querySelectorAll('.thumb').forEach(t => {
        t.classList.remove('border-gold');
        t.classList.add('border-pearl');
      });
      thumb.classList.add('border-gold');
      thumb.classList.remove('border-pearl');
    });

    // ==== Navbar scroll effect ====
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.classList.add('shadow-sm');
      } else {
        nav.classList.remove('shadow-sm');
      }
    });

    // ==== Colección — Scroll Morph Showcase ====
    // Vanilla-JS port of a React/framer-motion component Eduardo found
    // (scroll-morph-hero.tsx) — this site has no React/TypeScript/shadcn
    // build, so instead of the original file we recreate the same visual
    // effect (scatter -> line -> circle -> arc, driven by scroll, with a 3D
    // flip on hover) using real Nuvela photos and plain CSS transforms +
    // requestAnimationFrame. No new dependency, no build step. The
    // wheel/touch listeners are attached to #scroll-morph-container (not
    // window/document), so scrolling inside the frame never hijacks the
    // rest of the page — leaving it stays completely normal.
    //
    // Cada tarjeta ahora es un PRODUCTO real del catálogo (antes eran 8
    // fotos genéricas de la construcción del colchón) — se lee directo de
    // PRODUCTS, así que nunca se desincroniza de los datos reales, y al
    // hacer click/tap abre su página de detalle (misma clase
    // .js-view-product + data-product-id que usan las demás tarjetas de
    // producto del sitio — el listener delegado ya existente se encarga).
    //
    // Solo se incluyen productos con foto real (mainImage propia, no el
    // logo de relleno): Colchón Nuvela, Nuvela Diamond, Duvet, Ariana
    // (almohada) y Olivia Bed (camastrón). "Amanda" (almohada), la
    // Almohada de Plumas y el Protector de Colchón todavía usan el logo
    // como imagen de relleno — se agregan aquí automáticamente en cuanto
    // Eduardo suba sus fotos reales a esos productos en PRODUCTS.
    const MORPH_PRODUCT_IDS = [
      'nuvela-clasico',
      'nuvela-hotel',
      'duvet-nuvela',
      'almohada-memory-foam-1',
      'camastron-nuvela',
    ];
    let MORPH_TOTAL = 0;
    // Eduardo pidió que esta sección necesite la mitad del scroll de antes
    // (se sentía muy larga). Antes: MORPH_MAX_SCROLL 3000 / MORPH_MORPH_END 600.
    // Se redujeron ambos a la mitad para mantener la misma proporción entre
    // el "morphing" círculo->arco y el "shuffle" del arco después.
    const MORPH_MAX_SCROLL = 1500;
    // Progress (0–300) morphs circle -> arc; beyond 300, scroll shuffles the arc.
    const MORPH_MORPH_END = 300;

    let morphPhase = 'scatter'; // 'scatter' -> 'line' -> 'circle' (intro sequence, then scroll-driven)
    let morphScrollRaw = 0;
    let morphScrollSmooth = 0;
    let morphMouseXRaw = 0;
    let morphMouseXSmooth = 0;
    let morphContainerSize = { width: 0, height: 0 };
    let morphCardEls = [];
    let morphCurrent = []; // eased x/y/rotation/scale/opacity per card, for smooth motion
    let morphScatterPositions = [];
    let morphInited = false;
    let morphProducts = [];

    function morphLerp(a, b, t) { return a * (1 - t) + b * t; }

    function morphComputeTarget(i) {
      if (morphPhase === 'scatter') return morphScatterPositions[i];
      if (morphPhase === 'line') {
        const spacing = 70;
        const totalWidth = MORPH_TOTAL * spacing;
        return { x: i * spacing - totalWidth / 2, y: 0, rotation: 0, scale: 1, opacity: 1 };
      }
      // 'circle' phase: circle at rest, morphing into a bottom arc as the
      // user scrolls inside the container, then the arc "shuffles" further.
      // El círculo y el arco son más compactos que antes (antes: radio de
      // hasta 320px con tarjetas de 60x85px — el círculo era grande pero
      // las fotos se veían diminutas). Ahora las tarjetas base ya son más
      // grandes (ver CSS .morph-card-outer) y el círculo/arco son más
      // chicos, así que cada foto se distingue bien sin que el conjunto
      // se sienta enorme.
      const w = morphContainerSize.width || 800;
      const h = morphContainerSize.height || 460;
      const isMobile = w < 768;
      const minDim = Math.min(w, h);
      const morphProgress = Math.min(Math.max(morphScrollSmooth / MORPH_MORPH_END, 0), 1);

      // El radio ya NO se calcula como % del contenedor (eso fue lo que se
      // rompió al pasar de 20 tarjetas chiquitas a 5 tarjetas grandes: el
      // radio resultaba menor que el tamaño de las propias tarjetas y se
      // amontonaban). Ahora se calcula a partir del tamaño real de la
      // tarjeta (CSS) y de cuántas hay, para que el círculo sea siempre
      // justo lo bastante grande para que NO se encimen — ni más.
      const cardW = isMobile ? 92 : 128;
      const cardH = isMobile ? 124 : 172;
      const cardDiag = Math.sqrt(cardW * cardW + cardH * cardH);
      const angleStepRad = MORPH_TOTAL > 1 ? (2 * Math.PI) / MORPH_TOTAL : 0;
      const noOverlapRadius = angleStepRad > 0 ? (cardDiag * 0.46) / Math.sin(angleStepRad / 2) : 0;
      const circleRadius = Math.min(noOverlapRadius, minDim * 0.44);
      const circleAngleDeg = (i / MORPH_TOTAL) * 360;
      const circleRad = (circleAngleDeg * Math.PI) / 180;
      // rotation: 0 (derechas) — con 20 fotos pequeñas girar cada una según
      // su ángulo se veía bien (parecían pétalos), pero con pocas tarjetas
      // GRANDES de producto esa misma rotación las hacía ver inclinadas y
      // amontonadas, difíciles de leer. En reposo, un círculo de tarjetas
      // derechas se ve mucho más limpio y legible.
      const circlePos = {
        x: Math.cos(circleRad) * circleRadius,
        y: Math.sin(circleRad) * circleRadius,
        rotation: 0,
      };

      const baseRadius = Math.min(w, h * 1.5);
      const arcRadius = baseRadius * (isMobile ? 0.62 : 0.5);
      const arcApexY = h * (isMobile ? 0.32 : 0.22);
      const arcCenterY = arcApexY + arcRadius - h / 2;
      const spreadAngle = isMobile ? 100 : 130;
      const startAngle = -90 - spreadAngle / 2;
      const step = MORPH_TOTAL > 1 ? spreadAngle / (MORPH_TOTAL - 1) : 0;

      const scrollProgress = Math.min(Math.max((morphScrollSmooth - MORPH_MORPH_END) / (MORPH_MAX_SCROLL - MORPH_MORPH_END), 0), 1);
      const maxRotation = spreadAngle * 0.8;
      const boundedRotation = -scrollProgress * maxRotation;

      const currentArcAngle = startAngle + i * step + boundedRotation;
      const arcRad = (currentArcAngle * Math.PI) / 180;
      const arcPos = {
        x: Math.cos(arcRad) * arcRadius + morphMouseXSmooth,
        y: Math.sin(arcRad) * arcRadius + arcCenterY,
        rotation: currentArcAngle + 90,
        scale: isMobile ? 1.05 : 1.2,
      };

      return {
        x: morphLerp(circlePos.x, arcPos.x, morphProgress),
        y: morphLerp(circlePos.y, arcPos.y, morphProgress),
        rotation: morphLerp(circlePos.rotation, arcPos.rotation, morphProgress),
        scale: morphLerp(1, arcPos.scale, morphProgress),
        opacity: 1,
      };
    }

    function morphTick() {
      // Exponential smoothing toward the raw scroll/mouse values — a cheap
      // stand-in for the spring physics the original used (no extra library).
      morphScrollSmooth += (morphScrollRaw - morphScrollSmooth) * 0.08;
      morphMouseXSmooth += (morphMouseXRaw - morphMouseXSmooth) * 0.08;

      for (let i = 0; i < MORPH_TOTAL; i++) {
        const target = morphComputeTarget(i);
        const cur = morphCurrent[i];
        const ease = morphPhase === 'scatter' ? 1 : 0.12; // snap into place pre-intro, ease afterward
        cur.x += (target.x - cur.x) * ease;
        cur.y += (target.y - cur.y) * ease;
        cur.rotation += (target.rotation - cur.rotation) * ease;
        cur.scale += (target.scale - cur.scale) * ease;
        cur.opacity += (target.opacity - cur.opacity) * ease;
        const el = morphCardEls[i];
        if (el) {
          el.style.transform = `translate(${cur.x}px, ${cur.y}px) rotate(${cur.rotation}deg) scale(${cur.scale})`;
          el.style.opacity = String(cur.opacity);
        }
      }

      const morphProgress = Math.min(Math.max(morphScrollSmooth / MORPH_MORPH_END, 0), 1);
      const introEl = document.getElementById('morph-intro-text');
      const arcEl = document.getElementById('morph-arc-content');
      if (introEl) {
        introEl.style.opacity = (morphPhase === 'circle' && morphProgress < 0.5) ? String(1 - morphProgress * 2) : '0';
      }
      if (arcEl) {
        const t = Math.min(Math.max((morphProgress - 0.8) / 0.2, 0), 1);
        arcEl.style.opacity = String(t);
        arcEl.style.transform = `translate(-50%, ${morphLerp(20, 0, t)}px)`;
      }

      // Barra de progreso lateral: cuánto del scroll "atrapado" (0–MORPH_MAX_SCROLL)
      // se ha recorrido en total dentro de esta sección.
      const totalScrollProgress = Math.min(Math.max(morphScrollSmooth / MORPH_MAX_SCROLL, 0), 1);
      const progressFillEl = document.getElementById('morph-progress-fill');
      if (progressFillEl) {
        progressFillEl.style.height = (totalScrollProgress * 100) + '%';
      }

      requestAnimationFrame(morphTick);
    }

    // Construye/reconstruye las tarjetas a partir de morphProducts. Se usa
    // en el init y también se llama de nuevo desde applyLang() para que el
    // nombre del producto se actualice si el visitante cambia de idioma
    // (antes esto no pasaba: el texto quedaba fijo en el idioma inicial).
    function renderMorphCardsContent() {
      if (!morphInited) return; // aún no se ha construido la primera vez
      const cardsWrap = document.getElementById('morph-cards');
      if (!cardsWrap) return;
      cardsWrap.innerHTML = morphProducts.map((p, i) => `
        <div class="morph-card-outer js-view-product" data-i="${i}" data-product-id="${p.id}">
          <div class="morph-card-inner">
            <div class="morph-card-front">
              <img src="${p.mainImage}" alt="${pick(p.name)}" loading="lazy" />
              <p class="morph-card-name">${pick(p.name)}</p>
            </div>
            <div class="morph-card-back">
              <p class="morph-card-back-eyebrow">${pick(p.category)}</p>
              <p class="morph-card-back-label">${pick(p.name)}</p>
              <p class="morph-card-back-cta">${currentLang === 'es' ? 'Ver Producto →' : 'View Product →'}</p>
            </div>
          </div>
        </div>
      `).join('');
      morphCardEls = Array.from(cardsWrap.querySelectorAll('.morph-card-outer'));
    }

    function initScrollMorphHero() {
      if (morphInited) return;
      const wrap = document.getElementById('scroll-morph-container');
      const cardsWrap = document.getElementById('morph-cards');
      if (!wrap || !cardsWrap) return;

      morphProducts = MORPH_PRODUCT_IDS
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter(Boolean);
      if (!morphProducts.length) return; // PRODUCTS not ready yet — don't init on an empty set
      MORPH_TOTAL = morphProducts.length;
      morphInited = true;

      morphScatterPositions = morphProducts.map(() => ({
        x: (Math.random() - 0.5) * 900,
        y: (Math.random() - 0.5) * 460,
        rotation: (Math.random() - 0.5) * 180,
        scale: 0.6,
        opacity: 0,
      }));
      morphCurrent = morphProducts.map((s, i) => ({ ...morphScatterPositions[i] }));

      renderMorphCardsContent();

      const resize = () => {
        morphContainerSize = { width: wrap.clientWidth, height: wrap.clientHeight };
      };
      resize();
      window.addEventListener('resize', resize);

      // Antes esto atrapaba SIEMPRE el wheel con preventDefault(), incluso
      // cuando morphScrollRaw ya estaba al máximo (o al mínimo) — por eso
      // se sentía "trabado" al terminar: el mouse seguía sobre el recuadro
      // y cada scroll se quedaba atrapado sin mover nada. Ahora, al llegar
      // a un extremo, dejamos pasar el wheel sin bloquearlo para que la
      // página siga bajando (o subiendo) con normalidad.
      wrap.addEventListener('wheel', (e) => {
        const atMax = morphScrollRaw >= MORPH_MAX_SCROLL;
        const atMin = morphScrollRaw <= 0;
        if ((atMax && e.deltaY > 0) || (atMin && e.deltaY < 0)) {
          return; // deja que el scroll normal de la página continúe
        }
        e.preventDefault();
        morphScrollRaw = Math.min(Math.max(morphScrollRaw + e.deltaY, 0), MORPH_MAX_SCROLL);
      }, { passive: false });

      let morphTouchStartY = 0;
      wrap.addEventListener('touchstart', (e) => { morphTouchStartY = e.touches[0].clientY; }, { passive: true });
      wrap.addEventListener('touchmove', (e) => {
        const y = e.touches[0].clientY;
        const delta = morphTouchStartY - y;
        morphTouchStartY = y;
        morphScrollRaw = Math.min(Math.max(morphScrollRaw + delta, 0), MORPH_MAX_SCROLL);
      }, { passive: true });

      wrap.addEventListener('mousemove', (e) => {
        const rect = wrap.getBoundingClientRect();
        const rel = (e.clientX - rect.left) / rect.width;
        morphMouseXRaw = (rel * 2 - 1) * 100;
      });

      // Intro sequence: scatter -> line -> circle, then scroll takes over.
      setTimeout(() => { morphPhase = 'line'; }, 500);
      setTimeout(() => { morphPhase = 'circle'; }, 2500);

      requestAnimationFrame(morphTick);
    }

    // ==== Construcción — Scroll Crossfade (página Tecnología) ====
    // 8 fotos reales del colchón (capa1..capa8, images/mattress-scroll/) +
    // 1 ilustración propia tipo "plano técnico" (role: 'blueprint', SVG
    // dibujado a mano, ver el HTML de la sección) — no React, no
    // framer-motion. Cada capa se funde (crossfade) con la siguiente a
    // medida que el usuario hace scroll, con un leve giro 3D (rotateY,
    // ver constructionSetLayer) para que la transición se sienta como si
    // la cámara girara alrededor del colchón — la idea que Eduardo pidió
    // tras ver un reel de un barco donde la cámara "da la vuelta" — y con
    // un texto propio por capa. #construction-sticky se queda fijo vía CSS
    // `position: sticky` mientras #construction-scroll-space (700vh) se
    // desplaza por debajo; el progreso se lee cada frame con
    // getBoundingClientRect() — la misma técnica de las páginas de
    // producto de Apple — así que esto NUNCA atrapa ni bloquea el scroll
    // normal de la página, a diferencia de la sección "La Colección" de
    // arriba.
    const CONSTRUCTION_STAGES = [
      {
        role: 'capa1',
        eyebrow: { es: 'Nuvela', en: 'Nuvela' },
        title: { es: 'Diseño en cada ángulo.', en: 'Crafted from every angle.' },
        desc: { es: 'Silueta impecable y acabados de lujo — cada colchón Nuvela lleva su sello grabado.', en: 'A flawless silhouette and luxury finishes — every Nuvela mattress carries its own mark.' },
      },
      {
        role: 'capa2',
        eyebrow: { es: 'Nuvela', en: 'Nuvela' },
        title: { es: 'Precisión en cada costura.', en: 'Precision in every seam.' },
        desc: { es: 'El acolchado se distribuye en paneles uniformes, cosidos con precisión italiana.', en: 'The quilting is stitched into even panels with Italian precision.' },
      },
      {
        role: 'blueprint',
        eyebrow: { es: 'Plano técnico', en: 'Technical blueprint' },
        title: { es: 'Así lo diseñamos.', en: 'This is how we design it.' },
        desc: { es: 'Cada colchón Nuvela nace de un plano preciso — cada capa, medida antes de tomar forma.', en: 'Every Nuvela mattress starts as a precise blueprint — every layer measured before it takes shape.' },
      },
      {
        role: 'capa3',
        eyebrow: { es: 'Capa superior', en: 'Top layer' },
        title: { es: 'Pillow Top Acolchado', en: 'Quilted Pillow Top' },
        desc: { es: 'La primera capa que sientes: suave, mullida y pensada para amortiguar el contacto inicial.', en: 'The first layer you feel: soft, plush, and built to cushion initial contact.' },
      },
      {
        role: 'capa4',
        eyebrow: { es: 'Corte transversal', en: 'Cross-section' },
        title: { es: 'Así se combinan las capas.', en: 'How the layers come together.' },
        desc: { es: 'Espumas de distinta densidad trabajan en conjunto para transición, confort y soporte.', en: 'Foams of different densities work together for transition, comfort and support.' },
      },
      {
        role: 'capa5',
        eyebrow: { es: 'Espuma de soporte', en: 'Support foam' },
        title: { es: 'Alta Densidad 35D', en: 'High-Density Foam 35D' },
        desc: { es: 'Una base de espuma firme que estabiliza toda la estructura y evita el hundimiento prematuro.', en: 'A firm foam base that stabilizes the structure and prevents premature sagging.' },
      },
      {
        role: 'capa6',
        eyebrow: { es: 'Núcleo de resortes', en: 'Spring core' },
        title: { es: 'Resortes Encapsulados', en: 'Encapsulated Springs' },
        desc: { es: 'Cientos de resortes individuales se mueven de forma independiente y reducen la transferencia de movimiento.', en: 'Hundreds of individually pocketed springs move independently, minimizing motion transfer.' },
      },
      {
        role: 'capa7',
        eyebrow: { es: 'Soporte zonificado', en: 'Zoned support' },
        title: { es: 'Zonas de Soporte Diferenciadas', en: 'Zoned Support System' },
        desc: { es: 'Mayor firmeza en hombros y zona lumbar, donde el cuerpo necesita más sostén.', en: 'Firmer support at the shoulders and lower back, where your body needs it most.' },
      },
      {
        role: 'capa8',
        eyebrow: { es: 'Base y fundación', en: 'Base & foundation' },
        title: { es: 'Tejido de Base Antideslizante', en: 'Non-Slip Base Fabric' },
        desc: { es: 'La fundación que sostiene todo el sistema desde abajo, para estabilidad y durabilidad por años.', en: 'The foundation that holds the whole system from below, built for stability and years of durability.' },
      },
    ];

    let constructionLayerEls = {};
    let constructionDotEls = [];
    let constructionLastStage = -1;
    let constructionInited = false;

    function constructionSetLayer(role, opacity, rotationY) {
      const el = constructionLayerEls[role];
      if (!el) return;
      el.style.opacity = String(opacity);
      // rotationY gira la tarjeta en 3D mientras se funde con la siguiente
      // — la idea del "efecto que parezca que gira" que pidió Eduardo tras
      // ver el reel del barco: no es una rotación 360° real (necesitaría
      // fotos de turntable que aún no tenemos), pero al combinar el giro
      // con el crossfade entre ángulos reales del colchón, la transición
      // SE SIENTE como si la cámara estuviera girando alrededor del
      // producto en vez de solo cambiar de foto. #construction-stage tiene
      // `perspective` en su CSS para que este giro se vea en 3D real.
      el.style.transform = `rotateY(${rotationY}deg) scale(${0.97 + 0.03 * opacity})`;
    }

    function constructionUpdateCaption(stageIndex) {
      if (stageIndex === constructionLastStage) return;
      constructionLastStage = stageIndex;
      const stage = CONSTRUCTION_STAGES[stageIndex];
      if (!stage) return;
      const eyebrowEl = document.getElementById('construction-caption-eyebrow');
      const titleEl = document.getElementById('construction-caption-title');
      const descEl = document.getElementById('construction-caption-desc');
      if (eyebrowEl) eyebrowEl.textContent = stage.eyebrow[currentLang] || stage.eyebrow.es;
      if (titleEl) titleEl.textContent = stage.title[currentLang] || stage.title.es;
      if (descEl) descEl.textContent = stage.desc[currentLang] || stage.desc.es;
      constructionDotEls.forEach((dot, i) => dot.classList.toggle('active', i === stageIndex));
    }

    function constructionTick() {
      const space = document.getElementById('construction-scroll-space');
      if (space) {
        const rect = space.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const raw = -rect.top;
        const progress = total > 0 ? Math.min(Math.max(raw / total, 0), 1) : 0;

        const n = CONSTRUCTION_STAGES.length;
        const stageFloat = progress * (n - 1);

        const CONSTRUCTION_MAX_ROTATION = 14; // grados — sutil, no marea
        CONSTRUCTION_STAGES.forEach((stage, idx) => {
          const signedDelta = stageFloat - idx; // negativo = aún entrando, positivo = ya saliendo
          const opacity = Math.max(0, 1 - Math.abs(signedDelta));
          const rotationY = Math.max(-1, Math.min(1, signedDelta)) * CONSTRUCTION_MAX_ROTATION;
          constructionSetLayer(stage.role, opacity, rotationY);
        });

        constructionUpdateCaption(Math.min(n - 1, Math.round(stageFloat)));
      }
      requestAnimationFrame(constructionTick);
    }

    function initConstructionScroll() {
      const stage = document.getElementById('construction-stage');
      const dotsWrap = document.getElementById('construction-dots');
      if (!stage || !dotsWrap || constructionInited) return;
      constructionInited = true;

      constructionLayerEls = {};
      stage.querySelectorAll('.construction-layer[data-role]').forEach((el) => {
        constructionLayerEls[el.dataset.role] = el;
      });

      dotsWrap.innerHTML = CONSTRUCTION_STAGES.map(() => `<span class="construction-dot"></span>`).join('');
      constructionDotEls = Array.from(dotsWrap.querySelectorAll('.construction-dot'));

      requestAnimationFrame(constructionTick);
    }

    // ==== Hero (home) — foto de fondo fija (Eduardo la aprobó y pidió que  ====
    // ==== NO cambie a otras) + texto que se desvanece al hacer scroll,     ====
    // ==== estilo apple.com                                                 ====
    // Ya NO atrapa el scroll (antes sí, con una sección de 320vh). Ahora es
    // una sola pantalla (100svh) con un solo movimiento: el texto
    // (título/tagline/botones) se va desvaneciendo a medida que el
    // visitante hace scroll hacia la siguiente sección — un efecto simple
    // con la posición normal de scroll de la página, no una sección larga
    // que "atrapa" el scroll. La foto de fondo ya no rota (antes cambiaba
    // sola cada 4.5s entre 8 fotos); ahora es siempre images/hero-frontal.jpg,
    // con solo el zoom lento "kenburns" del CSS.
    let heroCycleInited = false;

    function heroFadeOnScroll() {
      const section = document.getElementById('hero-section');
      const content = document.querySelector('#hero-section .hero-content');
      const cue = document.querySelector('#hero-section .hero-cue');
      if (!section || !content) return;
      const h = section.offsetHeight || window.innerHeight;
      // Usamos la posición del hero en pantalla (getBoundingClientRect),
      // no window.scrollY directo — así el fundido es exacto sin importar
      // cuánto mida el navbar de arriba (antes se descontaba mal esa altura).
      const scrolledInto = -section.getBoundingClientRect().top;
      // A los 55% de la altura del hero ya está totalmente desvanecido —
      // así no hace falta scrollear mucho para "llegar" a la siguiente
      // sección con el texto ya fuera del camino.
      const p = Math.min(1, Math.max(0, scrolledInto / (h * 0.55)));
      content.style.opacity = String(1 - p);
      content.style.transform = `translateY(${p * -24}px)`;
      content.style.pointerEvents = p > 0.4 ? 'none' : 'auto';
      if (cue) cue.style.opacity = String(1 - Math.min(1, scrolledInto / (h * 0.18)));
    }

    function initHero() {
      const media = document.getElementById('hero-media');
      if (!media || heroCycleInited) return;
      heroCycleInited = true;

      // La foto ya trae la clase "is-active" en el HTML (es fija, no rota).
      window.addEventListener('scroll', heroFadeOnScroll, { passive: true });
      heroFadeOnScroll();
    }

    // ==== Rastro de estrellas del cursor (todo el sitio) ====
    // Canvas fijo a pantalla completa (#star-trail-canvas) que dibuja
    // pequeñas "estrellas fugaces" doradas siguiendo al mouse, que se
    // desvanecen solas. No usa ninguna librería nueva. Se desactiva solo
    // si el visitante tiene "reduce motion" activado en su sistema, o si
    // no tiene mouse/trackpad real (pantallas táctiles) — ahí no aporta
    // nada y solo gastaría batería.
    function initStarTrail() {
      const canvas = document.getElementById('star-trail-canvas');
      if (!canvas) return;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
      if (prefersReducedMotion || !hasFinePointer) return;

      const ctx = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let w = 0, h = 0;

      function resize() {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      window.addEventListener('resize', resize);

      const STAR_COLORS = ['#B8963E', '#D4B665', '#F5F1E8']; // gold, gold-light, pearl
      const MAX_PARTICLES = 70;
      let particles = [];
      let lastSpawn = 0;
      let lastX = null, lastY = null;

      function spawnStar(x, y) {
        if (particles.length >= MAX_PARTICLES) particles.shift();
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.3 - Math.random() * 0.4,
          size: 4 + Math.random() * 5,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.06,
          life: 0,
          maxLife: 550 + Math.random() * 350,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        });
      }

      function drawStar(p, alpha) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        const s = p.size * (0.4 + alpha * 0.6);
        // destello de 4 puntas (rombo curvado en cruz, tipo "sparkle")
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(s * 0.18, -s * 0.18, s, 0);
        ctx.quadraticCurveTo(s * 0.18, s * 0.18, 0, s);
        ctx.quadraticCurveTo(-s * 0.18, s * 0.18, -s, 0);
        ctx.quadraticCurveTo(-s * 0.18, -s * 0.18, 0, -s);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      let lastFrame = performance.now();
      function tick(now) {
        const dt = now - lastFrame;
        lastFrame = now;
        ctx.clearRect(0, 0, w, h);
        particles = particles.filter((p) => {
          p.life += dt;
          if (p.life >= p.maxLife) return false;
          p.x += p.vx * dt * 0.06;
          p.y += p.vy * dt * 0.06;
          p.rotation += p.spin;
          const t = p.life / p.maxLife;
          const alpha = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
          drawStar(p, Math.max(0, alpha));
          return true;
        });
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);

      window.addEventListener('mousemove', (e) => {
        const now = performance.now();
        if (lastX === null) { lastX = e.clientX; lastY = e.clientY; }
        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        if (now - lastSpawn > 45 || dist > 24) {
          spawnStar(e.clientX, e.clientY);
          lastSpawn = now;
          lastX = e.clientX;
          lastY = e.clientY;
        }
      }, { passive: true });
    }

    // ==== Popup de captura de leads (nombre + apellido + correo) ====
    // Eduardo pidió armar una base de datos de clientes: este popup
    // aparece una sola vez por visitante (se guarda una bandera en
    // localStorage) y manda los datos a una hoja de Google Sheets via un
    // Google Apps Script publicado como "Web App".
    //
    const LEADS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzFaqgmnO_scqK-bSYkKUY_IrK8h3ELIwZl6er5gAPzHd7dSev_iZwJCLg098aXK6kl/exec';
    // Debe ser EXACTAMENTE el mismo texto que SHARED_TOKEN en el Apps
    // Script — es solo un filtro simple contra envíos basura al link.
    const LEADS_SHARED_TOKEN = 'nuvela_2026_leads';

    function initLeadPopup() {
      const overlay = document.getElementById('lead-popup-overlay');
      if (!overlay) return;
      // Ya se mostró antes en este navegador (lo cerraron, lo enviaron o
      // le dieron "No, gracias") -- no molestar de nuevo.
      // Para probarlo de nuevo: abre la página con ?popup al final de la dirección
      const forcePopup = /[?&]popup/.test(window.location.search);
      if (!forcePopup && localStorage.getItem('nuvela-lead-popup-shown')) return;

      const backdrop = document.getElementById('lead-popup-backdrop');
      const closeBtn = document.getElementById('lead-popup-close');
      const skipBtn = document.getElementById('lead-popup-skip');
      const form = document.getElementById('lead-popup-form');
      const errorEl = document.getElementById('lead-popup-error');
      const submitBtn = document.getElementById('lead-popup-submit');
      const formWrap = document.getElementById('lead-popup-form-wrap');
      const successEl = document.getElementById('lead-popup-success');
      if (!backdrop || !closeBtn || !skipBtn || !form || !submitBtn || !formWrap || !successEl) return;

      function openPopup() {
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        if (window.NV && NV.lenis) NV.lenis.stop();
      }
      function closePopup(markHandled) {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
        if (window.NV && NV.lenis) NV.lenis.start();
        if (markHandled) localStorage.setItem('nuvela-lead-popup-shown', '1');
      }

      // 5.2 s: espera a que termine la intro animada del home nuevo
      setTimeout(openPopup, 5200);

      closeBtn.addEventListener('click', () => closePopup(true));
      backdrop.addEventListener('click', () => closePopup(true));
      skipBtn.addEventListener('click', () => closePopup(true));

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('lead-popup-nombre').value.trim();
        const apellido = document.getElementById('lead-popup-apellido').value.trim();
        const correo = document.getElementById('lead-popup-correo').value.trim();
        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

        if (!nombre || !apellido || !correoValido) {
          errorEl.classList.remove('hidden');
          return;
        }
        errorEl.classList.add('hidden');

        // No esperamos (no "await") a que el envío al Google Sheet termine
        // antes de mostrar "Gracias": esa petición a veces tarda unos
        // segundos, y de todas formas no podemos leer su respuesta desde
        // aquí (no-cors), así que mostramos el mensaje al instante y el
        // envío sigue solo en segundo plano.
        if (LEADS_WEBHOOK_URL && !LEADS_WEBHOOK_URL.startsWith('PEGA_AQUI')) {
          try {
            fetch(LEADS_WEBHOOK_URL, {
              method: 'POST',
              mode: 'no-cors',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({
                token: LEADS_SHARED_TOKEN,
                nombre, apellido, correo,
                pagina: window.location.href,
                fecha: new Date().toISOString(),
              }),
            }).catch((err) => console.warn('Nuvela: no se pudo enviar el lead al webhook.', err));
          } catch (err) {
            console.warn('Nuvela: no se pudo enviar el lead al webhook.', err);
          }
        } else {
          console.warn('Nuvela: falta configurar LEADS_WEBHOOK_URL para guardar los leads en Google Sheets.');
        }

        formWrap.classList.add('hidden');
        successEl.classList.remove('hidden');
        localStorage.setItem('nuvela-lead-popup-shown', '1');
        setTimeout(() => closePopup(false), 2500);
      });
    }

    // ==== Init ====
    // Recupera carrito / cotización / comparador guardados en el navegador.
    try {
      const st = JSON.parse(localStorage.getItem('nuvela-state') || 'null');
      const ok = (it) => it && PRODUCTS.some(p => p.id === it.productId);
      if (st) {
        if (Array.isArray(st.cart)) cart = st.cart.filter(ok);
        if (Array.isArray(st.quoteCart)) quoteCart = st.quoteCart.filter(ok);
        if (Array.isArray(st.compareIds)) compareIds = st.compareIds.filter(id => PRODUCTS.some(p => p.id === id));
        if (st.compareSizeSelection) Object.assign(compareSizeSelection, st.compareSizeSelection);
        if (st.quoteSizeSelection) Object.assign(quoteSizeSelection, st.quoteSizeSelection);
      }
    } catch (e) { /* sin datos guardados */ }
    window.addEventListener('pagehide', nvSaveState);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') nvSaveState(); });
    // Página de un producto: dibuja ese producto (y la medida si viene en la dirección: ?medida=King).
    if (NV_PAGE === 'producto-detalle' && NV_PRODUCT) {
      nvSafe(() => {
        renderProductDetailContent(NV_PRODUCT);
        const m = new URLSearchParams(window.location.search).get('medida');
        const p = PRODUCTS.find(x => x.id === NV_PRODUCT);
        if (m && p && p.variants.some(v => v.name === m)) pdSelectedVariant = m;
      });
    }
    nvSafe(() => applyLang(currentLang)); // also renders the products grid, pricing, etc.
    nvSafe(initReveal);
    nvSafe(initScrollMorphHero);
    nvSafe(initConstructionScroll);
    nvSafe(initHero);
    nvSafe(initStarTrail);
    nvSafe(initLeadPopup);

    // Marca en el menú la página en la que estamos
    document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === NV_PAGE));


/* Formulario de contacto */

  const contactForm = document.getElementById("contactForm");

  if (contactForm) contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formFields = contactForm.querySelector(".form-fields");
    const successMessage = contactForm.querySelector(".form-success");
    const originalButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Error al enviar");
      }

      formFields.classList.add("hidden");
      successMessage.classList.remove("hidden");
      contactForm.reset();
    } catch (error) {
      alert("No se pudo enviar el mensaje. Intenta nuevamente.");
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });

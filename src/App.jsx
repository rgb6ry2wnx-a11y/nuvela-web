// Nuvela · Italian Design — Premium Mattress Site
// Single-file React component (App.jsx) — bilingual ES/EN
//
// Requirements (paste into Vite/CRA/Next.js project):
//   1. React 18+
//   2. Tailwind CSS configured (utility classes used throughout)
//   3. Google Fonts: Playfair Display + Inter (loaded via @import in <style> below)
//
// Brand palette: Gold #B8963E · Cream #FAF8F3 · Graphite #3D3D3D · Ink #1A1A1A
// Tagline: "Duérmete bien. Vive mejor."

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
        fontFamily: 'Inter, sans-serif',
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

/* =================== Main App =================== */

export default function App() {
  const [lang, setLang] = useState(() =>
    typeof window !== 'undefined' ? (localStorage.getItem('nuvela-lang') || 'es') : 'es'
  );
  const [page, setPage] = useState('home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openFaqs, setOpenFaqs] = useState({});
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [productImg, setProductImg] = useState(
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85'
  );
  const [activeThumb, setActiveThumb] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t = (es, en) => (lang === 'es' ? es : en);

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

  const navItems = [
    { id: 'home', es: 'Inicio', en: 'Home' },
    { id: 'historia', es: 'Historia', en: 'Story' },
    { id: 'producto', es: 'Producto', en: 'Mattress' },
    { id: 'tecnologia', es: 'Tecnología', en: 'Technology' },
    { id: 'precios', es: 'Precios', en: 'Pricing' },
    { id: 'entregas', es: 'Entregas', en: 'Delivery' },
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
      <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pearl transition-all ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <a onClick={() => go('home')} className="flex flex-col items-start cursor-pointer">
            <span className="wordmark text-ink text-xl md:text-2xl">NUVELA</span>
            <span className="wordmark-sub mt-0.5">Italian Design</span>
          </a>

          <nav className="hidden lg:flex items-center gap-9">
            {navItems.map((item) => (
              <a
                key={item.id}
                onClick={() => go(item.id)}
                className={`nav-link ${page === item.id ? 'active' : ''}`}
              >
                {t(item.es, item.en)}
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
            <button onClick={() => setDrawerOpen(true)} className="lg:hidden flex flex-col gap-[5px] p-2" aria-label="Menu">
              <span className="block w-6 h-px bg-ink" />
              <span className="block w-6 h-px bg-ink" />
              <span className="block w-4 h-px bg-ink ml-auto" />
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
              className="px-6 py-4 border-b border-pearl text-sm tracking-[0.22em] uppercase font-medium cursor-pointer"
            >
              {t(item.es, item.en)}
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
                  <button onClick={() => go('producto')} className="btn-gold">{t('Ver Colchón', 'View Mattress')}</button>
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
              <p className="font-serif italic text-3xl md:text-4xl text-ink leading-snug">«Duérmete bien. Vive mejor.»</p>
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
          <section className="bg-cream pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
              <div className="reveal">
                <div className="aspect-square overflow-hidden bg-white img-fallback">
                  <img
                    className="w-full h-full object-cover transition-opacity duration-500"
                    src={productImg}
                    alt="Colchón Nuvela"
                    onError={imgFallback}
                  />
                </div>
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {[
                    'photo-1631049307264-da0ec9d70304',
                    'photo-1505693416388-ac5ce068fe85',
                    'photo-1540518614846-7eded433c457',
                    'photo-1594040226829-7f251ab46d80',
                  ].map((id, i) => (
                    <button
                      key={id}
                      onClick={() => {
                        setProductImg(`https://images.unsplash.com/${id}?w=1200&q=85`);
                        setActiveThumb(i);
                      }}
                      className={`aspect-square overflow-hidden ${activeThumb === i ? 'border border-gold' : 'border border-pearl'} img-fallback`}
                    >
                      <img className="w-full h-full object-cover" src={`https://images.unsplash.com/${id}?w=300&q=70`} alt="" onError={imgFallback} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="reveal reveal-delay-1">
                <Eyebrow>{t('Colchón Premium', 'Premium Mattress')}</Eyebrow>
                <GoldRule className="mt-4" />
                <h1 className="font-serif text-5xl md:text-6xl text-ink mt-6 leading-[1.05]">Colchón Nuvela</h1>
                <p className="font-serif italic text-mist text-lg mt-3">{t('Resortes Encapsulados · Memory Foam · 30 cm', 'Encapsulated Springs · Memory Foam · 30 cm')}</p>

                <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                  {[['30 cm', t('Altura', 'Height')], ['5', t('Capas', 'Layers')], ['10y', t('Garantía', 'Warranty')]].map(([v, l]) => (
                    <div key={v} className="bg-white border border-pearl p-4">
                      <p className="font-serif text-xl text-gold">{v}</p>
                      <p className="eyebrow !text-graphite text-[0.6rem] mt-1">{l}</p>
                    </div>
                  ))}
                </div>

                <p className="text-graphite mt-8 leading-relaxed">
                  {t(
                    'El colchón Nuvela combina resortes encapsulados individuales con memory foam multidensidad y una tela superior de enfriamiento. El resultado es una superficie de descanso que se moldea, sostiene y respira — diseñada para ofrecerte el descanso más profundo de tu vida, cada noche.',
                    'The Nuvela mattress combines individually encapsulated springs with multi-density memory foam and a cooling top fabric. The result is a sleep surface that contours, supports and breathes — engineered to deliver the deepest rest of your life, every night.'
                  )}
                </p>

                <div className="mt-10">
                  <Eyebrow>{t('Medidas disponibles', 'Available sizes')}</Eyebrow>
                  <div className="grid grid-cols-2 gap-3 mt-5">
                    {[
                      { n: 'Imperial', d: '0.97 × 1.90 m', s: 364 },
                      { n: 'Matrimonial', d: '1.37 × 2.03 m', s: 560 },
                      { n: 'Queen', d: '1.52 × 2.03 m', s: 660 },
                      { n: 'King', d: '1.93 × 2.03 m', s: 840 },
                    ].map((sz) => (
                      <div key={sz.n} className="border border-pearl p-4 hover:border-gold transition-colors">
                        <p className="font-serif text-lg text-ink">{sz.n}</p>
                        <p className="text-mist text-sm">{sz.d}</p>
                        <p className="text-gold text-xs tracking-[0.18em] uppercase mt-1">{sz.s} {t('resortes', 'springs')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-10">
                  <button onClick={() => go('precios')} className="btn-gold">{t('Ver Precios', 'View Pricing')}</button>
                  <button onClick={() => go('contacto')} className="btn-outline">{t('Hablar con Concierge', 'Contact Concierge')}</button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto reveal">
                <Eyebrow>{t('Beneficios', 'Benefits')}</Eyebrow>
                <GoldRule center className="mt-4" />
                <h2 className="font-serif text-4xl text-ink mt-8">{t('Diseñado en torno a ti.', 'Designed around you.')}</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                {[
                  ['01', t('Alivio de Presión', 'Pressure Relief'), t('El memory foam moldea la columna y dispersa los puntos de presión.', 'Memory foam contours the spine and disperses pressure points.')],
                  ['02', t('Balance Térmico', 'Thermal Balance'), t('La tela de enfriamiento y el gel mantienen la temperatura estable toda la noche.', 'Cooling fabric and gel infusions keep temperature steady all night.')],
                  ['03', t('Aislamiento de Movimiento', 'Motion Isolation'), t('Los resortes encapsulados responden de forma independiente — sin movimiento de pareja.', 'Encapsulated springs respond independently — no partner disturbance.')],
                  ['04', t('Soporte Postural', 'Postural Support'), t('La espuma 40D alinea el cuerpo y sostiene la postura natural del descanso.', '40D foam aligns the body and supports natural sleep posture.')],
                ].map(([n, ti, d], i) => (
                  <div key={n} className={`bg-cream p-8 reveal reveal-delay-${i}`}>
                    <Eyebrow>{n}</Eyebrow>
                    <h3 className="font-serif text-xl text-ink mt-3">{ti}</h3>
                    <p className="text-graphite text-sm mt-3 leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 bg-cream">
            <div className="max-w-5xl mx-auto px-6">
              <div className="text-center reveal">
                <Eyebrow>{t('Especificaciones', 'Specifications')}</Eyebrow>
                <GoldRule center className="mt-4" />
                <h2 className="font-serif text-4xl text-ink mt-8">{t('Cada detalle, documentado.', 'Every detail, documented.')}</h2>
              </div>
              <div className="bg-white mt-16 overflow-hidden reveal">
                <div className="grid grid-cols-3 bg-gold text-white text-xs tracking-[0.22em] uppercase font-semibold">
                  <div className="p-4">{t('Medida', 'Size')}</div>
                  <div className="p-4">{t('Dimensiones', 'Dimensions')}</div>
                  <div className="p-4 text-right">{t('Resortes', 'Springs')}</div>
                </div>
                {[
                  ['Imperial', '0.97 × 1.90 × 0.30 m', 364],
                  ['Matrimonial', '1.37 × 2.03 × 0.30 m', 560],
                  ['Queen', '1.52 × 2.03 × 0.30 m', 660],
                  ['King', '1.93 × 2.03 × 0.30 m', 840],
                ].map(([n, d, s], i) => (
                  <div key={n} className={`grid grid-cols-3 border-b border-pearl ${i % 2 === 1 ? 'bg-pearl/30' : ''}`}>
                    <div className="p-4 font-serif text-ink">{n}</div>
                    <div className="p-4 text-graphite font-mono text-sm">{d}</div>
                    <div className="p-4 text-right text-gold font-mono text-sm">{s}</div>
                  </div>
                ))}
              </div>
              <p className="text-mist text-xs mt-4 italic">
                {t('* Medidas en metros. Variación ±1–3 cm por materiales acolchonados.', '* Dimensions in meters. ±1–3 cm variation due to upholstery materials.')}
              </p>
            </div>
          </section>
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
                {t(<>Un solo colchón.<br />Cuatro medidas perfectas.</>, <>One mattress.<br />Four perfect sizes.</>)}
              </h1>
              <p className="text-graphite mt-6 leading-relaxed max-w-xl mx-auto">
                {t(
                  'Cada colchón Nuvela incluye entrega white-glove, prueba de 100 noches y garantía de 10 años — sin costo adicional.',
                  'Every Nuvela mattress includes white-glove delivery, a 100-night trial and a 10-year warranty — at no additional cost.'
                )}
              </p>
            </div>
          </section>

          <section className="bg-cream pb-24 md:pb-32">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { eb: t('Individual', 'Single'), name: 'Imperial', dim: '0.97 × 1.90 m', price: '3,900', springs: 364, featured: false },
                { eb: t('Matrimonial', 'Double'), name: 'Matrimonial', dim: '1.37 × 2.03 m', price: '4,900', springs: 560, featured: false },
                { eb: 'Queen', name: 'Queen', dim: '1.52 × 2.03 m', price: '5,900', springs: 660, featured: true },
                { eb: 'King', name: 'King', dim: '1.93 × 2.03 m', price: '6,900', springs: 840, featured: false },
              ].map((c, i) => (
                <div
                  key={c.name}
                  className={`price-card bg-white p-8 reveal reveal-delay-${i} flex flex-col relative ${c.featured ? 'featured border-2' : 'border border-pearl'}`}
                >
                  {c.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-[0.65rem] tracking-[0.32em] uppercase px-4 py-1.5">
                      {t('Más Vendido', 'Most Popular')}
                    </span>
                  )}
                  <Eyebrow>{c.eb}</Eyebrow>
                  <h3 className="font-serif text-3xl text-ink mt-3">{c.name}</h3>
                  <p className="text-mist text-sm mt-1">{c.dim}</p>
                  <div className="my-8">
                    <p className="text-mist text-xs tracking-[0.18em] uppercase">{t('Desde', 'From')}</p>
                    <p className={`font-serif text-5xl mt-1 ${c.featured ? 'text-gold' : 'text-ink'}`}>Q{c.price}</p>
                  </div>
                  <ul className="space-y-2 text-sm text-graphite flex-grow">
                    <li className="flex gap-2"><span className="text-gold">◆</span><span>{c.springs} {t('resortes encapsulados', 'encapsulated springs')}</span></li>
                    <li className="flex gap-2"><span className="text-gold">◆</span><span>{t('30 cm de altura', '30 cm height')}</span></li>
                    <li className="flex gap-2"><span className="text-gold">◆</span><span>{t('Garantía 10 años', '10-year warranty')}</span></li>
                    <li className="flex gap-2"><span className="text-gold">◆</span><span>{t('Entrega gratis', 'Free delivery')}</span></li>
                  </ul>
                  <button onClick={() => go('contacto')} className={`mt-8 w-full ${c.featured ? 'btn-gold' : 'btn-outline'}`}>
                    {t('Ordenar', 'Order Now')}
                  </button>
                </div>
              ))}
            </div>
          </section>

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
                  <a href="https://wa.me/50200000000" className="block group">
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
            <p className="font-serif italic text-gold-light text-sm mt-6">"Duérmete bien. Vive mejor."</p>
          </div>
          <div>
            <Eyebrow light>{t('Explora', 'Explore')}</Eyebrow>
            <ul className="mt-6 space-y-3 text-white/70 text-sm">
              {['historia', 'producto', 'tecnologia', 'precios'].map((p) => {
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
              {['entregas', 'faq', 'contacto'].map((p) => {
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
              <li><a href="https://wa.me/50200000000" className="hover:text-gold-light">WhatsApp</a></li>
              <li><a href="tel:+50200000000" className="hover:text-gold-light">+502 0000 0000</a></li>
            </ul>
            <div className="flex gap-3 mt-6">
              <a href="https://instagram.com/Nuvela.gt" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" /></svg>
              </a>
              <a href="https://wa.me/50200000000" className="w-9 h-9 border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-colors">
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
        href="https://wa.me/50200000000"
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
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

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
  font-family: 'Inter', system-ui, sans-serif;
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
.font-serif { font-family: 'Playfair Display', Georgia, serif !important; }
.font-sans { font-family: 'Inter', system-ui, sans-serif !important; }
.font-mono { font-family: 'Courier New', monospace !important; }

h1, h2, h3, h4 { font-family: 'Playfair Display', Georgia, serif; }

.gold-rule { width: 64px; height: 1px; background: var(--gold); display: block; }

.eyebrow {
  font-family: 'Inter', sans-serif;
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
  color: var(--graphite);
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
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: var(--ink);
  transition: border-color .3s ease;
}
.luxe-input:focus { outline: none; border-bottom-color: var(--gold); }
.luxe-input::placeholder { color: var(--mist); }

.wordmark { font-family: 'Playfair Display', Georgia, serif; letter-spacing: 0.42em; font-weight: 600; }
.wordmark-sub {
  font-family: 'Inter', sans-serif;
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

// Nuvela · Italian Design — sitio completo en React (diseño inmersivo 1/10/26)
// Un solo archivo (App.jsx), bilingüe ES/EN. Es el mismo diseño del sitio
// publicado (HTML), pasado a React.
//
// Cómo está armado, en simple:
//   1. El contenido de cada página es un componente de React (PageHome,
//      PageProductos, PageTecnologia, ...). Ahí se editan textos y fotos.
//   2. Los estilos van en NUVELA_CSS.
//   3. La lógica (catálogo PRODUCTS, carrito, idioma, quiz, animaciones) vive
//      en startNuvela(), que React ejecuta una sola vez al cargar (useEffect).
//      Los precios y productos se editan en el arreglo PRODUCTS, igual que antes.
//
// Qué necesita el proyecto (Vite / CRA / Next.js):
//   · React 18+. Nada más: Tailwind, GSAP, Lenis y las tipografías se cargan
//     solos desde internet al abrir la página.
//   · La carpeta "images" en la carpeta pública del proyecto (public/images).
//
// IMÁGENES que usa este archivo (nombres EXACTOS dentro de images/):
//   images/Fabricacion colchon.mp4
//   images/almohada-memoryfoam-1-principal.jpg
//   images/almohada-memoryfoam-1-vista-2.jpg
//   images/atardecer.jpg
//   images/base.jpg
//   images/cajas.jpg
//   images/cama.jpg
//   images/colchas.jpg
//   images/colchon.jpg
//   images/detalle.jpg
//   images/duvet-principal.jpg
//   images/duvet-vista-2.jpg
//   images/elasticidad.jpg
//   images/entrega.jpg
//   images/estructura.jpg
//   images/fabrica.jpg
//   images/hero-frontal.jpg
//   images/hero-mattress.jpg
//   images/home/nv-capa1.webp
//   images/home/nv-capa3.webp
//   images/home/nv-capa4.webp
//   images/home/nv-capa5.webp
//   images/home/nv-capa7.webp
//   images/home/pareja-dormida.png
//   images/logo-navbar-blanco.png
//   images/logo-navbar-negro.png
//   images/logosinfondo.png
//   images/nuvela-hotel-principal.jpg
//   images/nuvela-hotel-vista-2.jpg
//   images/nuvela-hotel-vista-3.jpg
//   images/nuvela-hotel-vista-4.jpg
//   images/oliviabed1.jpg
//   images/oliviabed2.jpg
//   images/oliviabed3.jpg
//   images/ondas.jpg
//   images/pareja.jpg
//   images/textura-almohada-memoryfoam-1.jpg
//   images/textura-almohada-memoryfoam-2.jpg
//   images/textura-almohada-plumas.jpg
//   images/textura-camastron.jpg
//   images/textura-colchon-nuvela.jpg
//   images/textura-duvet-nuvela.jpg
//   images/textura-nuvela-hotel.jpg
//   images/textura-protector-colchon.jpg
//   images/zipper.jpg
//
// Marca: negro #0D0D0D · marfil #F5F0E9 · dorado #B99B3F · "Duerme Bien Siempre."

import React, { useEffect } from 'react';

/* =================== Estilos =================== */
const NUVELA_CSS = String.raw`
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
      font-family: 'Inter', -apple-system, system-ui, sans-serif;
      color: var(--graphite);
      background: #ffffff;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Un solo tipo de letra en todo el sitio (Inter) — los títulos usan un   */
    /* peso más grueso (700) y el tracking bien cerrado a tamaños grandes,    */
    /* igual que hace Apple con SF Pro: se siente unido, no dos fuentes       */
    /* distintas peleando entre sí.                                          */
    h1, h2, h3, h4, .font-serif { font-family: 'Inter', -apple-system, sans-serif; font-weight: 700; letter-spacing: -0.02em; }
    h1.font-serif, h2.font-serif { letter-spacing: -0.03em; }
    .font-serif.text-5xl, .font-serif.text-6xl, .font-serif.text-7xl, .font-serif.text-8xl { letter-spacing: -0.04em; font-weight: 800; }
    /* Numeric displays — tabular figures for crisp numbers */
    .font-serif.text-gold, .price-card .font-serif { font-feature-settings: "lnum" 1, "tnum" 1; font-weight: 700; }
    /* Prices & CTAs — Inter Bold */
    .font-price { font-family: 'Inter', -apple-system, sans-serif; font-weight: 700; font-feature-settings: "lnum" 1, "tnum" 1; letter-spacing: -0.01em; }

    /* Brand divider */
    .gold-rule {
      width: 64px; height: 1px; background: var(--gold);
      display: block;
    }
    .gold-rule-center {
      margin-left: auto; margin-right: auto;
    }

    /* Section label */
    .eyebrow {
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.32em;
      font-size: 0.72rem;
      color: var(--gold);
    }

    /* ============== BUTTONS — ENHANCED MOTION ============== */
    /* Botones tipo "píldora" (bordes 100% redondeados, texto normal — no    */
    /* mayúsculas ni tracking ancho) como los de apple.com, en vez del       */
    /* estilo rectangular/uppercase que tenía el sitio antes.                */
    .btn-gold {
      display: inline-flex; align-items: center; justify-content: center;
      gap: 0.5rem;
      padding: 0.9rem 1.9rem;
      background: var(--gold);
      color: #fff;
      font-weight: 600;
      letter-spacing: -0.01em;
      text-transform: none;
      font-size: 1rem;
      border: 1px solid var(--gold);
      border-radius: 980px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      isolation: isolate;
      transition: transform .45s cubic-bezier(.4,0,.2,1), box-shadow .45s ease, border-color .35s ease;
    }
    .btn-gold::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, var(--gold-dark), var(--gold));
      transform: translateY(101%);
      transition: transform .5s cubic-bezier(.4,0,.2,1);
      z-index: -1;
    }
    .btn-gold::after {
      content: ''; position: absolute; top: 0; left: -75%;
      width: 50%; height: 100%;
      background: linear-gradient(120deg, transparent, rgba(255,255,255,0.45), transparent);
      transform: skewX(-20deg);
      transition: left .85s cubic-bezier(.25,.46,.45,.94);
      z-index: 0;
      pointer-events: none;
    }
    .btn-gold:hover {
      transform: translateY(-3px) scale(1.02);
      border-color: var(--gold-dark);
      box-shadow: 0 18px 36px -12px rgba(184,150,62,0.55), 0 0 0 1px rgba(184,150,62,0.15);
    }
    .btn-gold:hover::before { transform: translateY(0); }
    .btn-gold:hover::after { left: 125%; }
    .btn-gold:active { transform: translateY(-1px) scale(0.99); transition-duration: .12s; }

    .btn-outline {
      display: inline-flex; align-items: center; justify-content: center;
      gap: 0.5rem;
      padding: 0.9rem 1.9rem;
      background: transparent;
      color: var(--ink);
      font-weight: 600;
      letter-spacing: -0.01em;
      text-transform: none;
      font-size: 1rem;
      border: 1px solid var(--ink);
      border-radius: 980px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      isolation: isolate;
      transition: color .35s ease, transform .45s cubic-bezier(.4,0,.2,1), box-shadow .45s ease;
    }
    .btn-outline::before {
      content: ''; position: absolute; inset: 0;
      background: var(--ink);
      transform: scaleX(0); transform-origin: left;
      transition: transform .5s cubic-bezier(.4,0,.2,1);
      z-index: -1;
    }
    .btn-outline:hover {
      color: #fff;
      transform: translateY(-3px);
      box-shadow: 0 14px 28px -10px rgba(26,26,26,0.45);
    }
    .btn-outline:hover::before { transform: scaleX(1); }
    .btn-outline:active { transform: translateY(-1px); transition-duration: .12s; }

    .btn-outline-light {
      display: inline-flex; align-items: center; justify-content: center;
      gap: 0.5rem;
      padding: 0.9rem 1.9rem;
      background: transparent;
      color: #fff;
      font-weight: 600;
      letter-spacing: -0.01em;
      text-transform: none;
      font-size: 1rem;
      border: 1px solid rgba(255,255,255,0.7);
      border-radius: 980px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      isolation: isolate;
      transition: color .35s ease, transform .45s cubic-bezier(.4,0,.2,1), box-shadow .45s ease, border-color .35s ease;
    }
    .btn-outline-light::before {
      content: ''; position: absolute; inset: 0;
      background: #fff;
      transform: scaleX(0); transform-origin: left;
      transition: transform .5s cubic-bezier(.4,0,.2,1);
      z-index: -1;
    }
    .btn-outline-light:hover {
      color: var(--ink);
      border-color: #fff;
      transform: translateY(-3px);
      box-shadow: 0 14px 28px -10px rgba(255,255,255,0.25);
    }
    .btn-outline-light:hover::before { transform: scaleX(1); }
    .btn-outline-light:active { transform: translateY(-1px); transition-duration: .12s; }

    /* Link with arrow drift */
    .link-gold {
      color: var(--gold);
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-size: 0.72rem;
      font-weight: 600;
      position: relative;
      padding-bottom: 4px;
      display: inline-block;
      cursor: pointer;
      transition: transform .4s cubic-bezier(.4,0,.2,1), color .3s ease;
    }
    .link-gold::after {
      content: ''; position: absolute; bottom: 0; left: 0;
      width: 100%; height: 1px; background: var(--gold);
      transform-origin: right; transform: scaleX(1);
      transition: transform .45s cubic-bezier(.4,0,.2,1);
    }
    .link-gold:hover {
      color: var(--gold-dark);
      transform: translateX(6px);
    }
    .link-gold:hover::after { transform-origin: left; transform: scaleX(0); }

    /* Generic small lift for any button-like element not already styled */
    button { transition: transform .25s ease; }
    button:active:not(.btn-gold):not(.btn-outline):not(.btn-outline-light) { transform: scale(0.97); }

    /* Nav */
    .nav-link {
      color: rgba(255,255,255,0.88);
      font-size: 0.74rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      font-weight: 500;
      padding: 6px 0;
      position: relative;
      cursor: pointer;
      transition: color .3s ease, transform .3s cubic-bezier(.4,0,.2,1);
    }
    .nav-link::after {
      content: ''; position: absolute; bottom: 0; left: 50%;
      width: 0; height: 1px; background: var(--gold);
      transition: width .4s cubic-bezier(.4,0,.2,1); transform: translateX(-50%);
    }
    .nav-link:hover { color: var(--gold); transform: translateY(-1px); }
    .nav-link.active { color: var(--gold); }
    .nav-link:hover::after, .nav-link.active::after { width: 100%; }
    .drawer-link { transition: background .3s ease, padding-left .35s cubic-bezier(.4,0,.2,1), color .3s ease; }
    .drawer-link:hover { background: var(--cream); padding-left: 2.5rem !important; color: var(--gold); }

    /* Page system: show only the active page */
    .page { display: none; }
    .page.active { display: block; animation: fadePage .75s cubic-bezier(.16,.8,.24,1) both; }
    @keyframes fadePage { from { opacity:0; transform: translateY(10px);} to { opacity:1; transform: none;} }

    /* Reveal on scroll */
    .reveal {
      opacity: 0; transform: translateY(28px);
      transition: opacity .9s ease, transform .9s ease;
      will-change: opacity, transform;
    }
    .reveal.visible { opacity: 1; transform: none; }
    .reveal-delay-1 { transition-delay: .1s; }
    .reveal-delay-2 { transition-delay: .25s; }
    .reveal-delay-3 { transition-delay: .4s; }
    .reveal-delay-4 { transition-delay: .55s; }

    /* Hero ken-burns */
    @keyframes kenburns { from { transform: scale(1.04); } to { transform: scale(1.12);} }
    .kenburns { animation: kenburns 18s ease-in-out infinite alternate; }
    @media (max-width: 640px) {
      /* Solo la foto del hero (no las demas fotos con kenburns de otras */
      /* secciones) -- evita el acercamiento/zoom excesivo en celular.  */
      #hero-media .hero-layer {
        object-fit: contain;
        background: var(--ink);
      }
    }

    /* Float */
    @keyframes float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-8px);} }
    .float { animation: float 6s ease-in-out infinite; }

    /* ==== HERO — fusión (apple.com como referencia) ==== */
    /* Antes eran DOS secciones (una intro con tarjeta de foto + el hero      */
    /* clásico debajo) — Eduardo dijo que se sentía repetido y que no le      */
    /* gustaba el fondo blanco de la tarjeta. Ahora es UNA sola: la foto      */
    /* siempre ocupa TODA la pantalla (no hay tarjeta, no hay fondo blanco)   */
    /* y ya se está moviendo sola desde que carga la página (zoom lento +     */
    /* cambia de foto sola cada varios segundos) — no hace falta scroll para  */
    /* que "pase algo", como en apple.com. Es una sola pantalla de alto       */
    /* (100svh) y el scroll normal de la página te lleva derecho a la         */
    /* siguiente sección — no atrapa el scroll. Ver heroCycleTick() en el     */
    /* <script> de abajo.                                                    */
    #hero-section {
      position: relative;
      height: 100svh;
      min-height: 640px;
      overflow: hidden;
      background: var(--ink);
    }
    #hero-media {
      position: absolute;
      inset: 0;
    }
    .hero-layer {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 1.6s ease;
    }
    .hero-layer.is-active { opacity: 1; }
    #hero-media-scrim {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(to top, rgba(13,13,13,0.88) 0%, rgba(13,13,13,0.35) 42%, rgba(13,13,13,0.55) 100%),
        linear-gradient(to right, rgba(13,13,13,0.5) 0%, rgba(13,13,13,0.05) 45%);
    }
    .hero-content {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0 1.5rem;
      gap: 0.9rem;
    }
    #hero-title {
      color: #fff;
      font-size: clamp(3.25rem, 11vw, 7.5rem);
      line-height: 0.98;
      text-transform: uppercase;
      /* Logo "NUVELA": se queda en Cormorant Garamond (la tipografia real */
      /* del logo, confirmada por Eduardo) aunque el resto del sitio ahora */
      /* use Inter — esto no se toca.                                     */
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-weight: 500;
      letter-spacing: 0.01em;
    }
    #hero-tagline {
      color: rgba(255,255,255,0.88);
      font-size: clamp(1.15rem, 2.6vw, 1.65rem);
      font-weight: 500;
      letter-spacing: -0.01em;
    }
    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      margin-top: 0.6rem;
    }
    .hero-cue {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255,255,255,0.7);
      font-size: 0.65rem;
      letter-spacing: 0.32em;
      text-transform: uppercase;
    }

    /* ==== Entrada del hero (fade + rise) ================================
       El texto del hero (eyebrow, título, tagline, botones) entra con un
       desvanecimiento hacia arriba, uno después del otro (cascada) — lento
       y sutil, como pide la guía de marca. No toca el efecto que ya existe
       de "se desvanece al hacer scroll" (función heroFadeOnScroll más abajo
       en el <script>), solo la entrada inicial al cargar. */
    @keyframes heroRiseIn {
      from { opacity: 0; transform: translateY(22px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .hero-content .eyebrow {
      opacity: 0;
      animation: heroRiseIn 1.1s cubic-bezier(.16,.8,.24,1) .15s forwards;
    }
    .hero-content #hero-title {
      opacity: 0;
      animation: heroRiseIn 1.3s cubic-bezier(.16,.8,.24,1) .35s forwards;
    }
    .hero-content #hero-tagline {
      opacity: 0;
      animation: heroRiseIn 1.2s cubic-bezier(.16,.8,.24,1) .6s forwards;
    }
    .hero-content .hero-actions {
      opacity: 0;
      animation: heroRiseIn 1.1s cubic-bezier(.16,.8,.24,1) .85s forwards;
    }
    @media (prefers-reduced-motion: reduce) {
      .hero-content .eyebrow, .hero-content #hero-title,
      .hero-content #hero-tagline, .hero-content .hero-actions {
        animation: none; opacity: 1;
      }
    }

    /* Mattress layered visual */
    .layer {
      position: relative;
      border-radius: 20px;
      transition: transform .5s cubic-bezier(.4,0,.2,1), box-shadow .5s ease, border-color .35s ease;
      box-shadow: 0 1px 0 rgba(0,0,0,0.04);
    }
    .layer:hover {
      transform: translateX(12px) scale(1.015);
      box-shadow: -12px 12px 32px -10px rgba(184,150,62,0.45);
      border-color: var(--gold) !important;
    }

    /* Generic feature cards (Why Nuvela / Tech grid / Mision-Filosofia-Innovacion) */
    .bg-white.p-10 {
      border-radius: 24px;
      transition: transform .5s cubic-bezier(.4,0,.2,1), box-shadow .5s ease;
    }
    .bg-white.p-10:hover {
      transform: translateY(-8px);
      box-shadow: 0 30px 60px -25px rgba(184,150,62,0.3);
    }
    .bg-white.p-10:hover .border-gold {
      background: var(--gold);
      color: #fff;
      transform: rotate(45deg);
    }
    .bg-white.p-10 .border-gold {
      transition: background .4s ease, color .4s ease, transform .5s cubic-bezier(.4,0,.2,1);
    }

    /* Beneficios cards (cream bg) */
    .bg-cream.p-8 {
      border-radius: 20px;
      transition: transform .5s cubic-bezier(.4,0,.2,1), box-shadow .5s ease;
    }
    .bg-cream.p-8:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 40px -20px rgba(184,150,62,0.25);
    }

    /* Floating WhatsApp - more aggressive */
    .float-wa {
      transition: transform .4s cubic-bezier(.4,0,.2,1), box-shadow .4s ease;
    }
    .float-wa:hover {
      transform: scale(1.15) rotate(-8deg);
      box-shadow: 0 20px 40px -10px rgba(184,150,62,0.6);
    }

    /* Social icons (footer) */
    .social-icon {
      transition: transform .35s cubic-bezier(.4,0,.2,1), background .3s ease, border-color .3s ease;
    }
    .social-icon:hover {
      transform: translateY(-3px) rotate(-5deg);
    }

    /* Footer links */
    .footer-link {
      transition: color .3s ease, padding-left .35s cubic-bezier(.4,0,.2,1);
      display: inline-block;
    }
    .footer-link:hover { padding-left: 8px; }

    /* Image hover scale */
    .img-hover {
      transition: transform .8s cubic-bezier(.4,0,.2,1);
    }
    .img-hover:hover { transform: scale(1.04); }

    /* ==== Tarjetas de producto (hover) ===================================
       Además del zoom a la foto (.img-hover, arriba), la tarjeta completa
       se levanta un poco, el borde brilla en dorado, y un destello dorado
       cruza la foto — sutil, lento, de lujo. */
    .product-card {
      transition: transform .6s cubic-bezier(.16,.8,.24,1),
                  box-shadow .6s ease, border-color .6s ease;
    }
    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 28px 48px -24px rgba(13,13,13,.28);
      border-color: var(--gold);
    }
    .product-card .card-shimmer {
      position: absolute; inset: 0; pointer-events: none;
      background: linear-gradient(100deg, transparent 35%, rgba(185,155,63,.35) 50%, transparent 65%);
      transform: translateX(-120%);
      transition: transform 1s cubic-bezier(.16,.8,.24,1);
    }
    .product-card:hover .card-shimmer { transform: translateX(120%); }
    @media (prefers-reduced-motion: reduce) {
      .product-card, .product-card .card-shimmer { transition: none; }
    }

    /* Carousel dots */
    .t-dot {
      transition: width .4s ease, background .3s ease, transform .3s ease;
      cursor: pointer;
    }
    .t-dot:hover { transform: scaleY(2.5); }

    /* Lang button */
    .lang-btn, .lang-btn-m {
      transition: color .3s ease, transform .25s ease;
      cursor: pointer;
    }
    .lang-btn:hover, .lang-btn-m:hover { transform: scale(1.15); }

    /* Thumb buttons (product gallery) */
    .thumb { transition: border-color .35s ease, transform .35s cubic-bezier(.4,0,.2,1); cursor: pointer; }
    .thumb:hover { transform: scale(1.05); border-color: var(--gold) !important; }

    /* Burger menu lines animate on hover */
    #burger { transition: transform .3s ease; }
    #burger:hover { transform: scale(1.1); }
    #burger:hover span { background: var(--gold); }
    #burger span { transition: background .3s ease; }

    /* Carousel */
    .testimonial-track { transition: transform .8s cubic-bezier(.6,.05,.2,1); }

    /* FAQ — cada pregunta es su propia tarjeta con bordes redondeados      */
    /* (estilo apple.com) en vez de la línea divisoria de antes.            */
    .faq-item {
      background: var(--pearl);
      border-radius: 18px;
      padding: 0 1.5rem;
      margin-bottom: 0.75rem;
      transition: background-color .3s ease;
    }
    .faq-item:last-child { margin-bottom: 0; }
    .faq-item.open { background: var(--cream); }
    .faq-q { cursor: pointer; padding: 1.5rem 0; display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
    .faq-q .icon {
      width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--gold);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      transition: all .35s ease;
      color: var(--gold);
    }
    .faq-item.open .faq-q .icon { background: var(--gold); color: #fff; transform: rotate(45deg); }
    .faq-a { max-height: 0; overflow: hidden; transition: max-height .5s ease; }
    .faq-item.open .faq-a { max-height: 400px; }
    .faq-a-inner { padding: 0 0 1.5rem 0; color: var(--graphite); line-height: 1.75; }

    /* Secciones plegables en móvil: en pantallas grandes siempre se ve todo el
       contenido (como antes); en el teléfono el cliente las toca para abrirlas,
       así la página no obliga a hacer tanto scroll. */
    .mobile-collapse-body { overflow: hidden; max-height: 0; transition: max-height .5s ease; }
    .mobile-collapse-section.open .mobile-collapse-body { max-height: 3000px; }
    .mobile-collapse-section .chevron { transition: transform .3s ease; }
    .mobile-collapse-section.open .chevron { transform: rotate(180deg); }
    @media (min-width: 768px) {
      .mobile-collapse-toggle { pointer-events: none; cursor: default; }
      .mobile-collapse-body { max-height: none !important; overflow: visible !important; }
    }

    /* Mobile drawer */
    .drawer { transform: translateX(100%); transition: transform .45s cubic-bezier(.6,.05,.2,1); }
    .drawer.open { transform: translateX(0); }

    /* Acordeon del menu "Productos" del navbar -- Eduardo pidio que las  */
    /* categorias (Colchones, Almohadas, etc.) empiecen cerradas y solo   */
    /* muestren sus modelos al hacer click, para que el menu no sea tan   */
    /* largo. Ver renderNavProductsDropdown() y el listener de            */
    /* .js-nav-cat-toggle en el <script>.                                 */
    .nav-cat-body { overflow: hidden; max-height: 0; transition: max-height .35s ease; }
    .nav-cat-section.open .nav-cat-body { max-height: 480px; }
    .nav-cat-chevron { transition: transform .25s ease; }
    .nav-cat-section.open .nav-cat-chevron { transform: rotate(180deg); }

    /* Toast "Agregado al carrito" -- Eduardo pidio un aviso con 2 botones */
    /* (Revisar Carrito / Seguir Comprando) cada vez que se agrega un      */
    /* producto. Se abre/cierra con showCartToast()/hideCartToast() en el  */
    /* <script> de abajo; tambien se cierra solo despues de unos segundos. */
    #cart-toast {
      position: fixed;
      left: 50%;
      bottom: 1.25rem;
      transform: translate(-50%, 140%);
      z-index: 70;
      width: calc(100% - 2rem);
      max-width: 23rem;
      background: #fff;
      border: 1px solid var(--pearl);
      border-radius: 14px;
      box-shadow: 0 18px 40px rgba(26,26,26,0.18);
      padding: 1.1rem 1.25rem;
      transition: transform .45s cubic-bezier(.4,0,.2,1), opacity .4s ease;
      opacity: 0;
      pointer-events: none;
    }
    #cart-toast.show {
      transform: translate(-50%, 0);
      opacity: 1;
      pointer-events: auto;
    }

    /* Selection */
    ::selection { background: var(--gold); color: #fff; }

    /* Inputs */
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

    /* Logo wordmark */
    .wordmark {
      font-family: 'Inter', sans-serif;
      letter-spacing: 0.32em;
      font-weight: 700;
    }
    .wordmark-sub {
      font-family: 'Inter', sans-serif;
      letter-spacing: 0.42em;
      font-size: 0.55rem;
      text-transform: uppercase;
      color: var(--gold);
      font-weight: 500;
    }

    /* Price card hover — bordes redondeados estilo apple.com */
    .price-card {
      border-radius: 20px;
      transition: transform .5s ease, box-shadow .5s ease, border-color .5s ease;
    }
    .price-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 30px 60px -30px rgba(184,150,62,0.35);
      border-color: var(--gold);
    }
    .price-card.featured {
      border-color: var(--gold);
      box-shadow: 0 30px 60px -30px rgba(184,150,62,0.35);
    }

    /* Hide scrollbar (testimonial) */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { scrollbar-width: none; }

    /* Image fallback gradient */
    .img-fallback {
      background: linear-gradient(135deg, #EFE6D2 0%, #C9B584 50%, #8E7430 100%);
    }

    /* ==== Tech grid (Tecnología) — tarjetas cortas con ícono circular ==== */
    .tech-tile {
      transition: transform 0.35s ease, box-shadow 0.35s ease;
    }
    .tech-tile:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px -20px rgba(26,26,26,0.25);
    }
    .tech-tile { border-radius: 24px; }
    .tech-tile-icon {
      width: 3.25rem;
      height: 3.25rem;
      border-radius: 999px;
      background: rgba(184,150,62,0.1);
      border: 1px solid rgba(184,150,62,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--gold);
      transition: background 0.35s ease, transform 0.35s ease;
    }
    .tech-tile:hover .tech-tile-icon {
      background: var(--gold);
      color: #fff;
      transform: scale(1.08);
    }

    /* ==== Rastro de estrellas del cursor (todo el sitio) ==== */
    /* Canvas fijo, a pantalla completa, sin eventos de puntero — solo       */
    /* dibuja encima de todo. Ver initStarTrail() en el <script> de abajo.   */
    #star-trail-canvas {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
    }

    /* ==== Colección — Scroll Morph Showcase ==== */
    /* Container the wheel/touch listeners attach to — scoped to this box,   */
    /* so scrolling inside it never hijacks the rest of the page. Tarjetas   */
    /* más grandes en un círculo más compacto (antes: 60x85px en un radio    */
    /* de hasta 320px — las fotos casi no se veían). Cada tarjeta lleva un   */
    /* producto real y es clicable (.js-view-product) hacia su detalle.      */
    #scroll-morph-container {
      position: relative;
      width: 100%;
      height: 460px;
      overflow: hidden;
      background: var(--pearl);
      touch-action: none;
    }
    @media (min-width: 768px) {
      #scroll-morph-container { height: 560px; }
    }
    #morph-cards {
      position: absolute;
      inset: 0;
    }
    .morph-card-outer {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 92px;
      height: 124px;
      margin-left: -46px;
      margin-top: -62px;
      cursor: pointer;
      will-change: transform;
    }
    @media (min-width: 768px) {
      .morph-card-outer {
        width: 128px;
        height: 172px;
        margin-left: -64px;
        margin-top: -86px;
      }
    }
    .morph-card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .morph-card-outer:hover .morph-card-inner {
      transform: rotateY(180deg);
    }
    .morph-card-front, .morph-card-back {
      position: absolute;
      inset: 0;
      overflow: hidden;
      border-radius: 0.65rem;
      backface-visibility: hidden;
      box-shadow: 0 10px 22px -10px rgba(26,26,26,0.4);
    }
    .morph-card-front img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .morph-card-front::after {
      content: '';
      position: absolute; inset: 0;
      background: rgba(26,26,26,0.12);
      transition: background 0.3s ease;
    }
    .morph-card-outer:hover .morph-card-front::after { background: transparent; }
    /* Nombre del producto SIEMPRE visible sobre la foto (no solo al hacer  */
    /* hover) — así en móvil, donde no hay "hover" real, se sigue sabiendo  */
    /* qué producto es cada tarjeta sin necesidad de voltearla.             */
    .morph-card-name {
      position: absolute;
      left: 0; right: 0; bottom: 0;
      padding: 0.4rem 0.5rem 0.45rem;
      background: linear-gradient(to top, rgba(26,26,26,0.82), rgba(26,26,26,0));
      color: #fff;
      font-size: 0.6rem;
      line-height: 1.15;
      text-align: center;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      letter-spacing: 0.01em;
      pointer-events: none;
    }
    @media (min-width: 768px) {
      .morph-card-name { font-size: 0.72rem; padding: 0.55rem 0.6rem 0.6rem; }
    }
    .morph-card-back {
      transform: rotateY(180deg);
      background: var(--ink);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0.5rem;
      border: 1px solid rgba(184,150,62,0.4);
    }
    .morph-card-back-eyebrow {
      font-size: 0.52rem;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--gold-light);
      margin-bottom: 0.25rem;
    }
    .morph-card-back-label {
      font-size: 0.72rem;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      line-height: 1.25;
    }
    .morph-card-back-cta {
      font-size: 0.55rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--gold-light);
      margin-top: 0.5rem;
    }
    #morph-intro-text {
      position: absolute;
      z-index: 5;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      pointer-events: none;
      width: 100%;
      padding: 0 1.5rem;
      transition: opacity 0.4s ease;
    }
    #morph-arc-content {
      position: absolute;
      z-index: 10;
      top: 9%;
      left: 50%;
      transform: translate(-50%, 0);
      text-align: center;
      pointer-events: none;
      width: 100%;
      max-width: 640px;
      padding: 0 1.5rem;
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    /* Barra de progreso del scroll interno de "La Colección" — un carril */
    /* delgado a la par de las tarjetas, con un relleno dorado que crece   */
    /* de abajo hacia arriba conforme se avanza el scroll atrapado.        */
    #morph-progress-track {
      position: absolute;
      z-index: 6;
      right: 0.9rem;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 62%;
      background: rgba(28,27,25,0.1);
      border-radius: 999px;
      overflow: hidden;
    }
    @media (min-width: 768px) {
      #morph-progress-track { right: 1.75rem; height: 68%; width: 4px; }
    }
    #morph-progress-fill {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 0%;
      background: var(--gold);
      border-radius: 999px;
      transition: height 0.05s linear;
    }

    /* ==== Construcción — Scroll Crossfade (8 fotos + 1 plano técnico) ==== */
    /* Progreso calculado con getBoundingClientRect() sobre el scroll        */
    /* NORMAL de la página — nunca se atrapa el scroll aquí. Cada capa       */
    /* (capa1..capa8 + el plano "blueprint") se funde con la siguiente,      */
    /* con un leve rotateY 3D, a medida que se hace scroll.                  */
    #construction-scroll-space {
      height: 700vh;
      position: relative;
    }
    #construction-sticky {
      position: sticky;
      top: 0;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    #construction-stage {
      position: relative;
      width: min(90vw, 620px);
      aspect-ratio: 5 / 4;
      flex-shrink: 0;
      /* Antes: fondo crema — se veía como una caja blanca en cualquier       */
      /* instante en que las fotos no cubrían el 100% de opacidad durante el  */
      /* crossfade (justo lo que a Eduardo no le gustó del hero nuevo). Con   */
      /* fondo oscuro, ese instante se funde con la sección en vez de         */
      /* notarse como un recuadro claro.                                     */
      background: var(--ink);
      border-radius: 1.25rem;
      overflow: hidden;
      box-shadow: 0 30px 70px -20px rgba(0,0,0,0.5);
      /* perspective en el contenedor — así el rotateY() que aplicamos a     */
      /* cada .construction-layer (ver constructionSetLayer()) se ve como    */
      /* un giro real en 3D y no como un simple achicamiento horizontal.     */
      perspective: 1200px;
    }
    .construction-layer {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      backface-visibility: hidden;
      will-change: transform, opacity;
    }
    .construction-layer svg { display: block; width: 100%; height: 100%; }
    @media (min-width: 768px) {
      #construction-stage { width: 560px; }
    }
    .construction-dot {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: var(--pearl);
      transition: background 0.3s ease, transform 0.3s ease;
    }
    .construction-dot.active {
      background: var(--gold);
      transform: scale(1.5);
    }


    /* ================================================================== */
    /* ======= PRODUCTOS + DETALLE DE PRODUCTO (estilo inmersivo) ======= */
    /* ================================================================== */
    /* Cursor dorado y grano también en estas páginas */
    body.nv-fine.nv-immersive #nv-cursor { display: flex; }
    body.nv-immersive #nv-grain { opacity: .05; }
    #page-producto.page.active, #page-producto-detalle.page.active { animation: nvPageFade .6s ease both; }
    .nv-prod, #page-producto-detalle { background: var(--nv-black); color: var(--nv-white); }
    .nv-prod .reveal, #page-producto-detalle .reveal { opacity: 1; transform: none; }

    /* ---- Encabezado de Productos ---- */
    .nv-prod-hero { position: relative; min-height: 62svh; display: flex; align-items: flex-end; overflow: hidden; padding: 0 0 7vh; }
    #nv-prod-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
    .nv-prod-hero::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 40%; background: linear-gradient(transparent, var(--nv-black)); pointer-events: none; }
    .nv-prod-hero-inner { position: relative; z-index: 2; max-width: 1280px; width: 100%; margin: 0 auto; padding: 0 max(24px, 6vw); }
    .nv-prod-title { font-size: clamp(2.6rem, min(7vw, 11vh), 6.4rem); font-weight: 700; }
    .nv-prod-body { padding: 2vh 0 clamp(90px, 14vh, 160px); }

    /* ---- Tarjetas de categoría ---- */
    .nv-cat-grid { max-width: 1280px; margin: 0 auto; padding: 0 max(24px, 6vw); display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; perspective: 1000px; }
    .nv-cat-grid > button { aspect-ratio: 3 / 4 !important; border-radius: 22px !important; border: 1px solid rgba(252, 249, 245, .1) !important; background: var(--nv-black-2) !important; transition: border-color .5s, box-shadow .5s; will-change: transform; }
    .nv-cat-grid > button:hover { border-color: rgba(205, 174, 85, .55) !important; box-shadow: 0 30px 60px -30px rgba(205, 174, 85, .35); }
    .nv-cat-grid > button.border-gold { border-color: var(--nv-gold-2) !important; box-shadow: 0 0 0 1px var(--nv-gold-2), 0 30px 60px -30px rgba(205, 174, 85, .5); }
    .nv-cat-grid > button img { transition: transform 1.4s var(--nv-ease) !important; }
    .nv-cat-grid > button:hover img { transform: scale(1.08); }
    .nv-cat-grid > button .font-serif { font-size: clamp(1rem, 1.5vw, 1.35rem) !important; letter-spacing: -.02em; }
    #quiz-tile-btn { background: radial-gradient(ellipse at 50% 30%, rgba(205, 174, 85, .22), transparent 70%), var(--nv-black-2) !important; }
    .nv-prod-all { text-align: center; margin: 2.2rem 0 3.5rem; }
    .nv-prod-all button { font-size: .72rem; letter-spacing: .26em; text-transform: uppercase; color: rgba(252, 249, 245, .6); transition: color .3s; }
    .nv-prod-all button:hover { color: var(--nv-gold-2); }
    .nv-prod-heading { margin-bottom: 2.2rem; }
    .nv-prod-heading h3 { font-family: 'Inter', sans-serif !important; font-weight: 700 !important; letter-spacing: -.035em !important; font-size: clamp(1.8rem, 3.4vw, 3rem) !important; color: var(--nv-white) !important; }

    /* ---- Tarjetas de producto ---- */
    .nv-prod-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; perspective: 1200px; }
    #page-producto .product-card { background: linear-gradient(170deg, #22201c, var(--nv-black-2)) !important; border: 1px solid rgba(252, 249, 245, .08) !important; border-radius: 26px !important; box-shadow: none !important; will-change: transform; transition: border-color .5s; }
    #page-producto .product-card:hover { border-color: rgba(205, 174, 85, .45) !important; transform: none; }
    #page-producto .product-card > div:first-child { aspect-ratio: 4 / 3.4 !important; background: #121110 !important; }
    #page-producto .product-card .img-hover { transition: transform 1.4s var(--nv-ease); }
    #page-producto .product-card:hover .img-hover { transform: scale(1.07); }
    #page-producto .product-card h3 { color: var(--nv-white) !important; font-weight: 700; letter-spacing: -.03em; }
    #page-producto .product-card .text-graphite { color: rgba(252, 249, 245, .6) !important; }
    #page-producto .product-card .text-mist { color: rgba(252, 249, 245, .45) !important; }
    #page-producto .product-card .text-gold { color: var(--nv-gold-2) !important; }
    #page-producto .btn-outline, #page-producto-detalle .btn-outline { color: var(--nv-white); border-color: rgba(252, 249, 245, .35); }
    #page-producto .btn-outline::before, #page-producto-detalle .btn-outline::before { background: var(--nv-gold); }
    #page-producto .btn-outline:hover, #page-producto-detalle .btn-outline:hover { color: #fff; border-color: var(--nv-gold); box-shadow: 0 14px 28px -12px rgba(185, 155, 63, .5); }

    /* ---- Detalle de producto ---- */
    #page-producto-detalle .bg-cream, #page-producto-detalle .bg-white { background: transparent !important; }
    #page-producto-detalle > section:first-child { position: relative; background: radial-gradient(ellipse at 28% 35%, rgba(205, 174, 85, .12), transparent 55%) !important; }
    #page-producto-detalle .text-ink { color: var(--nv-white) !important; }
    #page-producto-detalle .text-graphite { color: rgba(252, 249, 245, .66) !important; }
    #page-producto-detalle .text-mist { color: rgba(252, 249, 245, .45) !important; }
    #page-producto-detalle .text-gold { color: var(--nv-gold-2) !important; }
    #page-producto-detalle .border-pearl { border-color: rgba(252, 249, 245, .1) !important; }
    #page-producto-detalle h2, #page-producto-detalle h3 { font-weight: 700; letter-spacing: -.035em; }
    #pd-title { font-size: clamp(2.6rem, 5.4vw, 5rem) !important; line-height: 1 !important; }
    #pd-tagline { font-style: normal !important; font-size: .78rem !important; letter-spacing: .26em; text-transform: uppercase; color: rgba(252, 249, 245, .55) !important; margin-top: 1rem !important; }
    /* Galería: foto principal con lupa que sigue al mouse */
    .nv-pd-zoom { position: relative; border-radius: 28px; overflow: hidden; background: #121110 !important; cursor: zoom-in; box-shadow: 0 40px 80px -40px rgba(0, 0, 0, .8); }
    .nv-pd-zoom img { transition: transform .6s var(--nv-ease), opacity .5s; will-change: transform; }
    .nv-pd-zoom.is-zoom img { transform: scale(1.9); transition: transform .25s ease-out, opacity .5s; }
    .nv-pd-zoom-hint { position: absolute; right: 16px; bottom: 16px; font-size: .62rem; letter-spacing: .24em; text-transform: uppercase; color: rgba(252, 249, 245, .75); background: rgba(13, 13, 13, .55); padding: .45rem .8rem; border-radius: 980px; backdrop-filter: blur(6px); pointer-events: none; transition: opacity .4s; }
    .nv-pd-zoom.is-zoom .nv-pd-zoom-hint { opacity: 0; }
    #pd-thumbs .thumb { border-radius: 16px; overflow: hidden; background: #121110; border-width: 1px !important; opacity: .55; transition: opacity .4s, border-color .4s, transform .4s var(--nv-ease); }
    #pd-thumbs .thumb:hover { opacity: 1; transform: translateY(-3px); }
    #pd-thumbs .thumb.border-gold { opacity: 1; border-color: var(--nv-gold-2) !important; }
    /* Fichas (firmeza, altura, etc.) */
    #pd-stats > div { background: rgba(252, 249, 245, .04) !important; border: 1px solid rgba(205, 174, 85, .18) !important; border-radius: 16px !important; }
    #pd-stats .eyebrow { color: rgba(252, 249, 245, .5) !important; }
    /* Precio grande del tamaño elegido */
    .nv-pd-price { display: flex; align-items: baseline; gap: 14px; margin-top: 2.2rem; padding-top: 1.6rem; border-top: 1px solid rgba(252, 249, 245, .1); }
    .nv-pd-price span { font-size: .68rem; letter-spacing: .3em; text-transform: uppercase; color: rgba(252, 249, 245, .5); }
    .nv-pd-price b { font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(2.2rem, 3.6vw, 3.2rem); letter-spacing: -.04em; color: var(--nv-gold-2); font-variant-numeric: tabular-nums; line-height: 1; }
    .nv-pd-price em { font-style: normal; font-size: .85rem; color: rgba(252, 249, 245, .55); }
    /* Medidas */
    #pd-sizes .js-pd-size { background: rgba(252, 249, 245, .03) !important; border-radius: 18px !important; transition: border-color .4s, background .4s, transform .4s var(--nv-ease); }
    #pd-sizes .js-pd-size:hover { transform: translateY(-3px); }
    #pd-sizes .js-pd-size.border-gold { background: rgba(205, 174, 85, .1) !important; box-shadow: 0 0 0 1px var(--nv-gold-2), 0 20px 40px -24px rgba(205, 174, 85, .55); }
    #pd-sizes .js-pd-size .font-serif { color: var(--nv-white) !important; font-weight: 700; }
    /* Cantidad */
    #pd-purchase .border-pearl { border-radius: 980px; overflow: hidden; }
    #pd-purchase .js-pd-qty-minus, #pd-purchase .js-pd-qty-plus { color: var(--nv-white) !important; }
    #pd-purchase .js-pd-qty-minus:hover, #pd-purchase .js-pd-qty-plus:hover { background: rgba(205, 174, 85, .15) !important; }
    #pd-purchase strong { color: var(--nv-white) !important; }
    /* Beneficios, especificaciones y preguntas */
    #pd-benefits > div { background: linear-gradient(170deg, #22201c, var(--nv-black-2)) !important; border: 1px solid rgba(252, 249, 245, .08); border-radius: 22px; }
    #page-producto-detalle section:nth-of-type(3) { background: var(--nv-black-2) !important; }
    #pd-specs-table { border: 1px solid rgba(205, 174, 85, .25); border-radius: 20px; background: rgba(252, 249, 245, .02) !important; }
    #pd-specs-table > div:first-child { background: rgba(205, 174, 85, .14) !important; color: var(--nv-gold-2) !important; }
    #pd-specs-table .bg-pearl\/30 { background: rgba(252, 249, 245, .03) !important; }
    #page-producto-detalle .faq-item { background: rgba(252, 249, 245, .04); border: 1px solid rgba(252, 249, 245, .07); }
    #page-producto-detalle .faq-item.open { background: rgba(205, 174, 85, .08); border-color: rgba(205, 174, 85, .3); }
    #page-producto-detalle .faq-a-inner { color: rgba(252, 249, 245, .66); }
    #page-producto-detalle .link-gold { color: var(--nv-gold-2); }

    @media (max-width: 900px) {
      .nv-cat-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .nv-cat-grid > button { aspect-ratio: 4 / 4.6 !important; }
      .nv-prod-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .nv-prod-hero { min-height: 52svh; }
      .nv-pd-zoom { border-radius: 22px; cursor: default; }
      .nv-pd-zoom-hint { display: none; }
    }
    @media (max-width: 520px) {
      #page-producto .product-card { border-radius: 18px !important; }
    }
    /* Fichas: texto más chico para que nombres largos (Ice Cooling Fabric…) no se salgan */
    #pd-stats > div { padding: .9rem .6rem !important; overflow-wrap: anywhere; }
    #pd-stats .font-serif { font-size: .9rem !important; line-height: 1.25 !important; font-weight: 600; }
    /* Escritorio: fotos de producto más pequeñas y zoom más sutil (el celular queda igual) */
    @media (min-width: 901px) {
      .nv-pd-zoom.is-zoom img { transform: scale(1.35); }
      #page-producto-detalle .lg\:grid-cols-2 { grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); }
      .nv-pd-zoom, #pd-thumbs { max-width: 500px; }
      .nv-prod-grid { grid-template-columns: repeat(auto-fit, minmax(250px, 300px)); justify-content: center; }
      #page-producto .product-card > div:first-child { aspect-ratio: 4 / 3 !important; }
      #page-producto .product-card:hover .img-hover { transform: scale(1.03); }
      .nv-cat-grid { max-width: 1080px; }
      .nv-cat-grid > button:hover img { transform: scale(1.04); }
    }
    /* ---- Foto del producto más compacta (todas las pantallas) ----
       Formato horizontal 4:3 con alto máximo, sin lupa, y miniaturas en
       una sola fila pequeña: se llega rápido a precios e información. */
    .nv-pd-zoom { aspect-ratio: 4 / 3 !important; max-height: 50vh; width: 100%; margin: 0 auto; cursor: default; }
    .nv-pd-zoom img { transition: transform 1.2s var(--nv-ease), opacity .5s; }
    .nv-pd-zoom:hover img { transform: scale(1.03); }
    .nv-pd-zoom.is-zoom img { transform: scale(1.03); }
    #pd-thumbs { display: flex !important; gap: 10px !important; overflow-x: auto; padding: 4px 2px 6px; margin-top: 14px !important; scrollbar-width: none; }
    #pd-thumbs::-webkit-scrollbar { display: none; }
    #pd-thumbs .thumb { flex: 0 0 auto; width: 76px; height: 76px; aspect-ratio: 1 / 1; border-radius: 14px; }
    @media (min-width: 1024px) {
      .nv-pd-zoom, #pd-thumbs { max-width: 520px; }
      #page-producto-detalle .lg\:grid-cols-2 > div:first-child { position: sticky; top: 120px; }
    }
    @media (max-width: 1023px) {
      .nv-pd-zoom { max-width: 640px; max-height: 42vh; }
      #pd-thumbs { max-width: 640px; margin-left: auto; margin-right: auto; justify-content: flex-start; }
      #pd-thumbs .thumb { width: 64px; height: 64px; }
    }
    /* Foto vertical: se muestra vertical completa (no se corta) */
    .nv-pd-zoom.is-portrait { aspect-ratio: 3 / 4 !important; width: auto !important; height: min(62vh, 620px); max-height: none; }
    @media (max-width: 1023px) { .nv-pd-zoom.is-portrait { height: min(56vh, 560px); } }

    /* ================================================================== */
    /* ============ LÍNEA PARA HOTELES (estilo inmersivo) =============== */
    /* ================================================================== */
    #page-linea-hotelera.page.active { animation: nvPageFade .6s ease both; }
    .nv-hotel { background: var(--nv-black); color: var(--nv-white); }
    .nv-hotel .reveal { opacity: 1; transform: none; }

    /* Portada */
    .nv-hotel-hero { position: relative; min-height: calc(100svh - var(--nv-nav, 0px)); display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden; }
    .nv-hotel-hero-bg { position: absolute; inset: 0; }
    .nv-hotel-hero-bg img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.12); animation: nvKen 22s ease-in-out infinite alternate; }
    @keyframes nvKen { from { transform: scale(1.12) translate(0, 0); } to { transform: scale(1.2) translate(-2%, -1.5%); } }
    .nv-hotel-hero-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(13,13,13,.9) 0%, rgba(13,13,13,.55) 50%, rgba(13,13,13,.2) 100%), linear-gradient(0deg, var(--nv-black) 0%, transparent 45%); }
    .nv-hotel-hero-inner { position: relative; z-index: 2; max-width: 1280px; width: 100%; margin: 0 auto; padding: 14vh max(24px, 6vw) 5vh; }
    .nv-hotel-title { font-size: clamp(2.4rem, min(6.4vw, 10vh), 6rem); font-weight: 700; }
    .nv-hotel .nv-hotel-actions { justify-content: flex-start; }
    .nv-hotel-strip { position: relative; z-index: 2; max-width: 1280px; width: 100%; margin: 0 auto; padding: 0 max(24px, 6vw) 6vh; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .nv-hotel-strip > div { border-top: 1px solid rgba(205, 174, 85, .35); padding-top: 14px; }
    .nv-hotel-strip b { display: block; font-size: clamp(1.1rem, 1.8vw, 1.6rem); font-weight: 700; letter-spacing: -.03em; color: var(--nv-gold-2); }
    .nv-hotel-strip span { display: block; font-size: .66rem; letter-spacing: .24em; text-transform: uppercase; color: rgba(252, 249, 245, .6); margin-top: 4px; }

    /* Para quién */
    .nv-hotel-who { padding: clamp(80px, 14vh, 150px) 0 clamp(50px, 8vh, 90px); }
    .nv-who-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 3rem; perspective: 1000px; }
    .nv-who { position: relative; aspect-ratio: 3 / 4; border-radius: 24px; overflow: hidden; border: 1px solid rgba(252, 249, 245, .08); will-change: transform; }
    .nv-who img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; max-width: none; transition: transform 1.4s var(--nv-ease); filter: saturate(.85); }
    .nv-who:hover img { transform: scale(1.05); }
    .nv-who::after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(13,13,13,.92) 8%, rgba(13,13,13,.1) 60%); }
    .nv-who > div { position: absolute; left: 20px; right: 20px; bottom: 20px; z-index: 2; }
    .nv-who h4 { font-size: 1.25rem; font-weight: 700; letter-spacing: -.03em; color: var(--nv-white); }
    .nv-who p { font-size: .88rem; line-height: 1.5; color: rgba(252, 249, 245, .66); margin-top: .4rem; }

    /* Cotización */
    .nv-quote { padding: 0 max(24px, 6vw); scroll-margin-top: 110px; }
    .nv-quote-panel { max-width: 980px; margin: 0 auto; padding: 26px clamp(20px, 3vw, 40px); border-radius: 26px; background: linear-gradient(170deg, rgba(205,174,85,.09), rgba(252,249,245,.02)); border: 1px solid rgba(205, 174, 85, .28); backdrop-filter: blur(8px); }
    .nv-quote .text-ink, .nv-quote h3 { color: var(--nv-white) !important; }
    .nv-quote .text-graphite { color: rgba(252, 249, 245, .66) !important; }
    .nv-quote .text-mist { color: rgba(252, 249, 245, .5) !important; }
    .nv-quote .border-pearl { border-color: rgba(252, 249, 245, .12) !important; }
    .nv-quote .bg-cream { background: #121110 !important; border-radius: 12px; }
    .nv-quote input { background: rgba(252, 249, 245, .05) !important; color: var(--nv-white) !important; border-radius: 12px; }
    .nv-quote input:focus { border-color: var(--nv-gold-2) !important; }
    .nv-quote .js-quote-qty-minus, .nv-quote .js-quote-qty-plus { color: var(--nv-white) !important; }
    .nv-quote .js-quote-qty-input { background: transparent !important; border-radius: 0; }
    .nv-quote .flex.items-center.border { border-radius: 980px; overflow: hidden; }

    /* Catálogo */
    .nv-hotel-catalog { padding: clamp(80px, 12vh, 140px) 0 clamp(60px, 10vh, 120px); }
    #hotel-products-grid { margin-top: 3rem; }
    #page-linea-hotelera .product-card { background: linear-gradient(170deg, #22201c, var(--nv-black-2)) !important; border: 1px solid rgba(252, 249, 245, .08) !important; border-radius: 26px !important; box-shadow: none !important; will-change: transform; transition: border-color .5s; }
    #page-linea-hotelera .product-card:hover { border-color: rgba(205, 174, 85, .45) !important; transform: none; }
    #page-linea-hotelera .product-card > div:first-child { aspect-ratio: 4 / 3 !important; background: #121110 !important; }
    #page-linea-hotelera .product-card:hover .img-hover { transform: scale(1.03); }
    #page-linea-hotelera .product-card h3 { color: var(--nv-white) !important; font-weight: 700; letter-spacing: -.03em; }
    #page-linea-hotelera .product-card .text-graphite { color: rgba(252, 249, 245, .6) !important; }
    #page-linea-hotelera .product-card select { background: rgba(252, 249, 245, .05) !important; color: var(--nv-white); border-color: rgba(252, 249, 245, .15) !important; border-radius: 12px; }
    #page-linea-hotelera .product-card select option { color: #111; }
    #page-linea-hotelera .btn-outline { color: var(--nv-white); border-color: rgba(252, 249, 245, .35); }
    #page-linea-hotelera .btn-outline::before { background: var(--nv-gold); }
    #page-linea-hotelera .btn-outline:hover { color: #fff; border-color: var(--nv-gold); }

    /* Cómo trabajamos */
    .nv-hotel-steps { padding: clamp(80px, 12vh, 140px) 0; background: var(--nv-black-2); }
    .nv-steps { position: relative; list-style: none; padding: 0; margin: 3.5rem 0 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; }
    .nv-steps-line { position: absolute; left: 0; right: 0; top: 22px; height: 1px; background: rgba(252, 249, 245, .12); display: block; }
    .nv-steps-line i { display: block; height: 100%; width: 100%; background: linear-gradient(90deg, var(--nv-gold), var(--nv-gold-2)); transform: scaleX(0); transform-origin: left; }
    .nv-steps li { position: relative; padding-top: 0; }
    .nv-steps li span { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: var(--nv-black-2); border: 1px solid var(--nv-gold-2); color: var(--nv-gold-2); font-size: .7rem; letter-spacing: .12em; font-weight: 600; position: relative; z-index: 1; }
    .nv-steps h4 { font-size: 1.2rem; font-weight: 700; letter-spacing: -.03em; color: var(--nv-white); margin-top: 1.2rem; }
    .nv-steps p { font-size: .92rem; line-height: 1.55; color: rgba(252, 249, 245, .62); margin-top: .5rem; }

    /* Cierre */
    .nv-hotel-cta { padding: clamp(100px, 16vh, 180px) 0; text-align: center; background: radial-gradient(ellipse at 50% 60%, rgba(205,174,85,.14), transparent 60%), var(--nv-black); }
    .nv-hotel-cta-title { font-size: clamp(2.4rem, 6vw, 5.4rem); font-weight: 700; }

    /* Botón flotante "Mi cotización" */
    #nv-quote-pill { position: fixed; left: 24px; bottom: 24px; z-index: 45; display: inline-flex; align-items: center; gap: 10px; padding: .75rem .8rem .75rem 1.2rem; border-radius: 980px; background: rgba(13, 13, 13, .82); border: 1px solid rgba(205, 174, 85, .55); color: var(--nv-white); font-size: .85rem; font-weight: 600; backdrop-filter: blur(10px); cursor: pointer; opacity: 0; transform: translateY(20px); pointer-events: none; transition: opacity .5s var(--nv-ease), transform .5s var(--nv-ease); }
    #nv-quote-pill.is-on { opacity: 1; transform: none; pointer-events: auto; }
    #nv-quote-pill b { min-width: 26px; height: 26px; border-radius: 13px; background: var(--nv-gold-2); color: var(--nv-black); display: inline-flex; align-items: center; justify-content: center; font-size: .78rem; padding: 0 6px; }

    @media (max-width: 900px) {
      .nv-hotel-strip { grid-template-columns: repeat(2, 1fr); row-gap: 18px; }
      .nv-who-grid { grid-template-columns: 1fr; gap: 12px; }
      .nv-who { aspect-ratio: 16 / 10; }
      .nv-who > div { left: 18px; right: 18px; bottom: 16px; }
      .nv-hotel-hero-bg::after { background: linear-gradient(0deg, var(--nv-black) 5%, rgba(13,13,13,.78) 55%, rgba(13,13,13,.55) 100%); }
      .nv-steps { grid-template-columns: 1fr; gap: 26px; padding-left: 64px; }
      .nv-steps-line { left: 22px; right: auto; top: 0; bottom: 0; width: 1px; height: auto; }
      .nv-steps-line i { transform: scaleY(0); transform-origin: top; height: 100%; }
      .nv-steps li span { position: absolute; left: -64px; top: 0; }
      .nv-steps h4 { margin-top: .6rem; }
      #nv-quote-pill { left: 16px; bottom: 16px; }
    }
    @media (min-width: 901px) {
      #hotel-products-grid { grid-template-columns: repeat(auto-fit, minmax(250px, 300px)); justify-content: center; }
    }

    /* ================================================================== */
    /* ================ AGENDA TU CITA (estilo inmersivo) =============== */
    /* ================================================================== */
    #page-cita.page.active { animation: nvPageFade .6s ease both; }
    .nv-cita { background: var(--nv-black); color: var(--nv-white); }
    .nv-cita .reveal { opacity: 1; transform: none; }

    .nv-cita-hero { position: relative; min-height: calc(100svh - var(--nv-nav, 0px)); display: flex; align-items: center; overflow: hidden; padding: 8vh 0; }
    #nv-cita-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
    .nv-cita-grid { position: relative; z-index: 2; max-width: 1280px; width: 100%; margin: 0 auto; padding: 0 max(24px, 6vw); display: grid; grid-template-columns: 1.15fr .85fr; gap: clamp(32px, 5vw, 80px); align-items: center; }
    .nv-cita-title { font-size: clamp(2.4rem, min(4.6vw, 8.5vh), 5rem); font-weight: 700; }
    .nv-cita-chips { list-style: none; padding: 0; margin: 1.8rem 0 0; display: flex; flex-wrap: wrap; gap: 8px; }
    .nv-cita-chips li { font-size: .74rem; letter-spacing: .06em; padding: .5rem .9rem; border-radius: 980px; border: 1px solid rgba(205, 174, 85, .35); color: rgba(252, 249, 245, .82); background: rgba(205, 174, 85, .06); }
    .nv-cita .nv-cita-actions { justify-content: flex-start; }
    .nv-cita-photo { position: relative; border-radius: 30px; overflow: hidden; aspect-ratio: 4 / 4.6; max-height: 72vh; box-shadow: 0 50px 100px -40px rgba(0, 0, 0, .85); border: 1px solid rgba(252, 249, 245, .08); will-change: transform; }
    .nv-cita-photo img { width: 100%; height: 100%; object-fit: cover; object-position: 62% 50%; max-width: none; transform: scale(1.06); }
    .nv-cita-badge { position: absolute; left: 18px; bottom: 18px; padding: .8rem 1.1rem; border-radius: 18px; background: rgba(13, 13, 13, .7); border: 1px solid rgba(205, 174, 85, .4); backdrop-filter: blur(8px); }
    .nv-cita-badge b { display: block; color: var(--nv-gold-2); font-size: 1.1rem; letter-spacing: -.02em; }
    .nv-cita-badge span { display: block; font-size: .62rem; letter-spacing: .26em; text-transform: uppercase; color: rgba(252, 249, 245, .7); }

    .nv-cita-steps { padding: clamp(80px, 12vh, 140px) 0; background: var(--nv-black-2); }
    .nv-cita-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 3rem; perspective: 1000px; }
    .nv-cita-cards h4 { font-size: 1.35rem; font-weight: 700; letter-spacing: -.03em; color: var(--nv-white); margin-top: 2.2rem; }
    .nv-cita-cards p { color: rgba(252, 249, 245, .62); line-height: 1.6; margin-top: .6rem; font-size: .95rem; }

    /* Equipo (tarjetas que dibuja renderCitaAsesores) */
    .nv-cita-team { padding: clamp(80px, 12vh, 140px) 0; }
    #cita-calendar-wrap .grid { grid-template-columns: repeat(4, 1fr) !important; gap: 16px !important; }
    #cita-calendar-wrap .grid > div { background: linear-gradient(170deg, #22201c, var(--nv-black-2)) !important; border: 1px solid rgba(252, 249, 245, .08) !important; border-radius: 22px !important; padding: 28px 18px !important; transition: border-color .5s, transform .5s var(--nv-ease); }
    #cita-calendar-wrap .grid > div:hover { border-color: rgba(205, 174, 85, .45) !important; transform: translateY(-4px); }
    #cita-calendar-wrap .grid > div > div:first-child { width: 64px; height: 64px; background: radial-gradient(circle at 35% 30%, rgba(205,174,85,.4), rgba(205,174,85,.08)) !important; border: 1px solid rgba(205, 174, 85, .55); color: var(--nv-gold-2) !important; font-family: 'Cormorant Garamond', serif !important; font-size: 1.6rem !important; }
    #cita-calendar-wrap .text-ink { color: var(--nv-white) !important; font-weight: 700; }
    #cita-calendar-wrap .text-graphite { color: rgba(252, 249, 245, .55) !important; }
    #cita-calendar-wrap .text-center { margin-top: 1rem; }

    /* Mapa en modo oscuro */
    .nv-cita-map { padding: clamp(60px, 10vh, 120px) 0 clamp(100px, 16vh, 180px); background: var(--nv-black-2); }
    #cita-sucursales > div { background: linear-gradient(170deg, #22201c, var(--nv-black)) !important; border: 1px solid rgba(205, 174, 85, .25) !important; border-radius: 26px; }
    #cita-sucursales iframe { filter: invert(.92) hue-rotate(180deg) grayscale(.35) contrast(.92) brightness(.95); min-height: 320px; }
    #cita-sucursales .bg-pearl { background: #121110 !important; }
    #cita-sucursales .text-ink { color: var(--nv-white) !important; font-weight: 700; }
    #cita-sucursales .text-graphite { color: rgba(252, 249, 245, .66) !important; }

    @media (max-width: 900px) {
      .nv-cita-grid { grid-template-columns: 1fr; }
      .nv-cita-photo { aspect-ratio: 16 / 11; max-height: none; order: -1; }
      .nv-cita-hero { padding: 4vh 0 8vh; }
      .nv-cita-cards { grid-template-columns: 1fr; }
      #cita-calendar-wrap .grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
    }

    /* ================================================================== */
    /* ============== COMPARAR PRODUCTOS (estilo inmersivo) ============= */
    /* ================================================================== */
    #page-comparar.page.active { animation: nvPageFade .6s ease both; }
    .nv-cmp { background: var(--nv-black); color: var(--nv-white); padding-bottom: 90px; }
    .nv-cmp .reveal { opacity: 1; transform: none; }
    .nv-cmp-hero { position: relative; min-height: 52svh; display: flex; align-items: flex-end; overflow: hidden; padding-bottom: 6vh; }
    #nv-cmp-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
    .nv-cmp-hero::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 40%; background: linear-gradient(transparent, var(--nv-black)); pointer-events: none; }
    .nv-cmp-hero-inner { position: relative; z-index: 2; max-width: 1280px; width: 100%; margin: 0 auto; padding: 0 max(24px, 6vw); }
    .nv-cmp-title { font-size: clamp(2.6rem, min(6.4vw, 10vh), 6rem); font-weight: 700; }

    /* Selector de productos */
    .nv-cmp-pick { padding: 2vh 0 6vh; }
    #compare-picker { display: grid; gap: 44px; }
    #compare-picker h3 { font-family: 'Inter', sans-serif !important; font-weight: 700; letter-spacing: -.03em; color: var(--nv-white) !important; }
    #compare-picker .gold-rule { background: linear-gradient(90deg, rgba(205,174,85,.6), transparent); }
    #compare-picker .grid > div { background: linear-gradient(170deg, #22201c, var(--nv-black-2)) !important; border: 1px solid rgba(252, 249, 245, .08) !important; border-radius: 20px; transition: border-color .4s, transform .5s var(--nv-ease), box-shadow .4s; will-change: transform; }
    #compare-picker .grid > div:hover { transform: translateY(-4px); border-color: rgba(205, 174, 85, .4) !important; }
    #compare-picker .grid > div.border-gold { border-color: var(--nv-gold-2) !important; box-shadow: 0 0 0 1px var(--nv-gold-2), 0 24px 50px -28px rgba(205, 174, 85, .6); }
    #compare-picker .bg-cream { background: #121110 !important; }
    #compare-picker .text-ink { color: var(--nv-white) !important; font-weight: 600; }
    #compare-picker .text-gold { color: var(--nv-gold-2) !important; }
    #compare-picker .js-toggle-compare { border-radius: 980px; font-weight: 600; letter-spacing: .1em; }
    #compare-picker .js-toggle-compare.border-ink { border-color: rgba(252, 249, 245, .3) !important; color: var(--nv-white) !important; }
    #compare-picker .js-toggle-compare.border-ink:hover { background: var(--nv-gold) !important; border-color: var(--nv-gold) !important; color: #fff !important; }
    #compare-picker .js-toggle-compare.bg-gold { background: var(--nv-gold-2) !important; color: var(--nv-black) !important; }
    #compare-picker .js-toggle-compare.bg-pearl { background: rgba(252, 249, 245, .05) !important; color: rgba(252, 249, 245, .35) !important; }

    /* Tabla */
    .nv-cmp-table { padding: 4vh 0 10vh; scroll-margin-top: 100px; }
    #compare-table-wrap { padding-top: 0 !important; }
    #compare-table-wrap h3 { font-family: 'Inter', sans-serif !important; font-weight: 700; letter-spacing: -.035em; color: var(--nv-white) !important; }
    #compare-table-wrap .min-w-\[520px\] { border: 1px solid rgba(205, 174, 85, .22); border-radius: 26px; overflow: hidden; background: rgba(252, 249, 245, .02); padding-top: 18px; }
    #compare-table-wrap .text-ink { color: var(--nv-white) !important; }
    #compare-table-wrap .text-graphite { color: rgba(252, 249, 245, .55) !important; }
    #compare-table-wrap .text-mist { color: rgba(252, 249, 245, .45) !important; }
    #compare-table-wrap .text-gold { color: var(--nv-gold-2) !important; }
    #compare-table-wrap .border-ink { border-color: rgba(205, 174, 85, .45) !important; }
    #compare-table-wrap .border-pearl { border-color: rgba(252, 249, 245, .08) !important; }
    #compare-table-wrap .bg-pearl\/30 { background: rgba(252, 249, 245, .025) !important; }
    #compare-table-wrap .bg-cream\/60 { background: rgba(205, 174, 85, .07) !important; }
    #compare-table-wrap .bg-cream { background: #121110 !important; border-radius: 16px; }
    #compare-table-wrap .js-compare-size { border-radius: 980px; }
    #compare-table-wrap .js-compare-size.bg-ink { background: var(--nv-gold-2) !important; color: var(--nv-black) !important; border-color: var(--nv-gold-2) !important; }
    #compare-table-wrap .btn-outline { color: var(--nv-white); border-color: rgba(252, 249, 245, .35); }
    #compare-table-wrap .btn-outline::before { background: var(--nv-gold); }
    #compare-table-wrap .btn-outline:hover { color: #fff; border-color: var(--nv-gold); }
    #compare-table-wrap .min-w-\[520px\] > div:last-child { padding-bottom: 22px; }
    /* Filas iguales / diferentes */
    .nv-cmp-diff-toggle { display: inline-flex; align-items: center; gap: 10px; margin-top: 1.2rem; font-size: .78rem; font-weight: 600; color: rgba(252, 249, 245, .75); cursor: pointer; user-select: none; }
    .nv-cmp-diff-toggle i { width: 38px; height: 22px; border-radius: 11px; background: rgba(252, 249, 245, .15); position: relative; transition: background .3s; }
    .nv-cmp-diff-toggle i::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .35s var(--nv-ease); }
    #compare-table-wrap.nv-only-diff .nv-cmp-diff-toggle i { background: var(--nv-gold); }
    #compare-table-wrap.nv-only-diff .nv-cmp-diff-toggle i::after { transform: translateX(16px); }
    #compare-table-wrap.nv-only-diff .nv-same { display: none !important; }
    .nv-diff > div:first-child::before { content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--nv-gold-2); margin-right: 8px; flex-shrink: 0; }

    /* Barra flotante con los 3 espacios */
    #nv-cmp-tray { position: fixed; left: 50%; bottom: 22px; z-index: 46; display: flex; align-items: center; gap: 14px; padding: 10px 10px 10px 14px; border-radius: 980px; background: rgba(13, 13, 13, .86); border: 1px solid rgba(205, 174, 85, .45); backdrop-filter: blur(12px); box-shadow: 0 30px 60px -20px rgba(0, 0, 0, .8); translate: -50% 0; opacity: 0; transform: translateY(30px); pointer-events: none; transition: opacity .5s var(--nv-ease), transform .5s var(--nv-ease); }
    #nv-cmp-tray.is-on { opacity: 1; transform: none; pointer-events: auto; }
    .nv-cmp-slots { display: flex; gap: 8px; }
    .nv-cmp-slot { width: 46px; height: 46px; border-radius: 50%; overflow: hidden; border: 1px dashed rgba(252, 249, 245, .3); display: flex; align-items: center; justify-content: center; color: rgba(252, 249, 245, .35); font-size: .9rem; position: relative; }
    .nv-cmp-slot.is-full { border: 1px solid var(--nv-gold-2); }
    .nv-cmp-slot img { width: 100%; height: 100%; object-fit: cover; max-width: none; }
    #nv-cmp-tray .btn-gold { padding: .7rem 1.4rem; font-size: .9rem; }

    @media (max-width: 900px) {
      .nv-cmp-hero { min-height: 44svh; }
      #nv-cmp-tray { bottom: 16px; gap: 10px; left: 16px; translate: none; }
      .nv-cmp-slot { width: 40px; height: 40px; }
    }

    /* ================================================================== */
    /* ================== TECNOLOGÍA (estilo inmersivo) ================= */
    /* ================================================================== */
    #page-tecnologia.page.active { animation: nvPageFade .6s ease both; }
    .nv-tech { background: var(--nv-black); color: var(--nv-white); }
    .nv-tech .reveal { opacity: 1; transform: none; }

    /* Portada */
    .nv-tech-hero { position: relative; min-height: calc(86svh - var(--nv-nav, 0px)); display: flex; align-items: flex-end; overflow: hidden; padding-bottom: 9vh; }
    .nv-tech-hero-bg { position: absolute; inset: -10% 0 0 0; }
    .nv-tech-hero-bg img { width: 100%; height: 100%; object-fit: cover; max-width: none; filter: brightness(.42) saturate(.6) sepia(.25); animation: nvKen 24s ease-in-out infinite alternate; }
    .nv-tech-hero::after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, var(--nv-black) 0%, rgba(13,13,13,.2) 55%, rgba(13,13,13,.55) 100%); pointer-events: none; }
    #nv-tech-canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }
    .nv-tech-hero-inner { position: relative; z-index: 2; max-width: 1280px; width: 100%; margin: 0 auto; padding: 0 max(24px, 6vw); }
    .nv-tech-title { font-size: clamp(2.6rem, min(6.4vw, 10vh), 6rem); font-weight: 700; }

    /* Video */
    .nv-tech-video { padding: clamp(80px, 12vh, 140px) 0; }
    .nv-tech-video-grid { max-width: 1180px; margin: 0 auto; padding: 0 max(24px, 6vw); display: grid; grid-template-columns: 1.1fr .9fr; gap: clamp(32px, 6vw, 90px); align-items: center; }
    .nv-tech-video-frame { justify-self: center; width: 100%; max-width: 400px; border-radius: 26px; overflow: hidden; border: 1px solid rgba(205, 174, 85, .35); box-shadow: 0 50px 100px -40px rgba(0, 0, 0, .9), 0 0 60px -20px rgba(205, 174, 85, .25); background: #000; }
    .nv-tech-video-frame video { display: block; width: 100%; height: auto; max-height: 72vh; }

    /* Tarjetas de tecnología (las 6 de siempre, en oscuro) */
    #page-tecnologia section.bg-cream { background: var(--nv-black-2) !important; }
    #page-tecnologia .tech-tile { background: linear-gradient(170deg, #22201c, var(--nv-black)) !important; border: 1px solid rgba(252, 249, 245, .08); position: relative; overflow: hidden; will-change: transform; }
    #page-tecnologia .tech-tile::before { content: ''; position: absolute; inset: 0; background: radial-gradient(380px circle at var(--mx, 50%) var(--my, 0%), rgba(205, 174, 85, .16), transparent 45%); opacity: 0; transition: opacity .5s; pointer-events: none; }
    #page-tecnologia .tech-tile:hover { transform: none; box-shadow: none; border-color: rgba(205, 174, 85, .4); }
    #page-tecnologia .tech-tile:hover::before { opacity: 1; }
    #page-tecnologia .tech-tile h3 { color: var(--nv-white) !important; font-weight: 700; letter-spacing: -.03em; }
    #page-tecnologia .tech-tile p { color: rgba(252, 249, 245, .62) !important; }
    #page-tecnologia .tech-tile-icon { background: rgba(205, 174, 85, .1); border-color: rgba(205, 174, 85, .45); color: var(--nv-gold-2); }
    #page-tecnologia .tech-tile:hover .tech-tile-icon { background: var(--nv-gold-2); color: var(--nv-black); }

    /* Construcción capa por capa (la sección de siempre) */
    #construction-section { background: var(--nv-black) !important; }
    #construction-section h3 { font-family: 'Inter', sans-serif !important; font-weight: 700; letter-spacing: -.035em; }
    #construction-section .gold-rule { display: none; }
    #construction-stage { border: 1px solid rgba(205, 174, 85, .25); border-radius: 26px !important; box-shadow: 0 50px 100px -40px rgba(0, 0, 0, .9), 0 0 80px -30px rgba(205, 174, 85, .25) !important; }
    #construction-caption-title { font-family: 'Inter', sans-serif !important; font-weight: 700; letter-spacing: -.03em; }

    /* Certificaciones con borde dorado que gira */
    #page-tecnologia section.bg-ink:last-of-type { background: var(--nv-black-2) !important; }
    #page-tecnologia section.bg-ink:last-of-type h3 { font-family: 'Inter', sans-serif !important; font-weight: 700; letter-spacing: -.035em; }
    #page-tecnologia section.bg-ink:last-of-type .gold-rule { display: none; }
    #page-tecnologia section.bg-ink:last-of-type .grid > div { position: relative; border: 0 !important; border-radius: 24px; background: var(--nv-black); isolation: isolate; overflow: hidden; }
    #page-tecnologia section.bg-ink:last-of-type .grid > div::before { content: ''; position: absolute; inset: -60%; z-index: -2; background: conic-gradient(from 0deg, transparent 0 60%, rgba(205,174,85,.9) 75%, transparent 90%); animation: nvSpin 6s linear infinite; }
    #page-tecnologia section.bg-ink:last-of-type .grid > div::after { content: ''; position: absolute; inset: 1px; z-index: -1; border-radius: 23px; background: linear-gradient(170deg, #22201c, var(--nv-black)); }
    #page-tecnologia section.bg-ink:last-of-type .grid > div:nth-child(2)::before { animation-delay: -2s; }
    #page-tecnologia section.bg-ink:last-of-type .grid > div:nth-child(3)::before { animation-delay: -4s; }
    #page-tecnologia section.bg-ink:last-of-type .grid .font-serif { font-family: 'Inter', sans-serif !important; font-weight: 700; letter-spacing: -.03em; color: var(--nv-gold-2) !important; }
    @keyframes nvSpin { to { transform: rotate(360deg); } }

    @media (max-width: 900px) {
      .nv-tech-video-grid { grid-template-columns: 1fr; }
      .nv-tech-video-frame { max-width: 340px; }
      .nv-tech-hero { min-height: 70svh; }
    }

    /* ===== Opción A: Explorador de tecnología ===== */
    .nv-tx { padding: clamp(80px, 12vh, 140px) 0; background: var(--nv-black-2); }
    .nv-tx-grid { max-width: 1280px; margin: 3rem auto 0; padding: 0 max(24px, 6vw); display: grid; grid-template-columns: 1.05fr .95fr; gap: clamp(28px, 5vw, 80px); align-items: center; }
    .nv-tx-visual { position: relative; aspect-ratio: 4 / 4.2; max-height: 74vh; border-radius: 30px; overflow: hidden; background: radial-gradient(ellipse at 50% 55%, #2a2721, #121110 70%); border: 1px solid rgba(205, 174, 85, .22); box-shadow: 0 50px 100px -40px rgba(0, 0, 0, .9); }
    .nv-tx-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; max-width: none; opacity: 0; transform: scale(1.12); transition: opacity 1s var(--nv-ease), transform 6s ease-out; }
    .nv-tx-img.is-on { opacity: 1; transform: scale(1); }
    .nv-tx-img.nv-tx-cut { object-fit: contain; padding: 12%; filter: drop-shadow(0 30px 40px rgba(0,0,0,.6)); }
    .nv-tx-visual::after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(13,13,13,.55), transparent 40%); pointer-events: none; }
    .nv-tx-tag { position: absolute; left: 22px; bottom: 18px; z-index: 2; display: flex; align-items: baseline; gap: 6px; }
    .nv-tx-tag b { font-size: clamp(2.2rem, 4vw, 3.4rem); font-weight: 700; letter-spacing: -.05em; color: var(--nv-gold-2); line-height: 1; }
    .nv-tx-tag span { font-size: .8rem; letter-spacing: .2em; color: rgba(252, 249, 245, .6); }
    .nv-tx-list { list-style: none; padding: 0; margin: 0; }
    .nv-tx-item { position: relative; border-top: 1px solid rgba(252, 249, 245, .1); }
    .nv-tx-item:last-child { border-bottom: 1px solid rgba(252, 249, 245, .1); }
    .nv-tx-item button { width: 100%; display: flex; align-items: center; gap: 18px; padding: 20px 0; text-align: left; cursor: pointer; color: rgba(252, 249, 245, .45); transition: color .5s; }
    .nv-tx-item button:hover, .nv-tx-item.is-on button { color: var(--nv-white); }
    .nv-tx-n { font-size: .7rem; letter-spacing: .24em; color: var(--nv-gold-2); width: 26px; }
    .nv-tx-t { font-size: clamp(1.25rem, 2.1vw, 1.9rem); font-weight: 700; letter-spacing: -.035em; }
    .nv-tx-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .7s var(--nv-ease); }
    .nv-tx-body > p { overflow: hidden; color: rgba(252, 249, 245, .66); line-height: 1.6; padding-left: 44px; max-width: 30rem; }
    .nv-tx-item.is-on .nv-tx-body { grid-template-rows: 1fr; }
    .nv-tx-item.is-on .nv-tx-body > p { padding-bottom: 22px; }
    .nv-tx-bar { position: absolute; left: 0; right: 0; top: -1px; height: 1px; display: block; }
    .nv-tx-bar i { display: block; height: 100%; background: var(--nv-gold-2); transform: scaleX(0); transform-origin: left; }

    /* ===== Opción B: Bento ===== */
    .nv-bento-sec { padding: clamp(80px, 12vh, 140px) 0; background: var(--nv-black-2); }
    .nv-bento { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: clamp(190px, 24vh, 250px); gap: 16px; margin-top: 3rem; }
    .nv-b { position: relative; overflow: hidden; border-radius: 26px; background: linear-gradient(170deg, #24221d, var(--nv-black)); border: 1px solid rgba(252, 249, 245, .08); padding: 24px; display: flex; flex-direction: column; justify-content: flex-end; will-change: transform; transition: border-color .5s; }
    .nv-b:hover { border-color: rgba(205, 174, 85, .4); }
    .nv-b-springs { grid-column: span 2; grid-row: span 2; }
    .nv-b-height { grid-column: span 2; }
    .nv-b-cool { grid-column: span 2; }
    .nv-b-italy { grid-column: span 4; }
    .nv-b-txt { position: relative; z-index: 2; }
    .nv-b h4 { font-size: 1.05rem; font-weight: 600; letter-spacing: -.02em; color: var(--nv-white); }
    .nv-b p, .nv-b-note { position: relative; z-index: 2; font-size: .88rem; line-height: 1.5; color: rgba(252, 249, 245, .6); margin-top: .35rem; }
    .nv-b-big { display: block; font-size: clamp(3rem, 6vw, 5.6rem); font-weight: 700; letter-spacing: -.06em; line-height: .95; color: var(--nv-gold-2); font-variant-numeric: tabular-nums; }
    .nv-b-big small { font-size: .4em; letter-spacing: -.02em; margin-left: 4px; color: rgba(252, 249, 245, .7); }
    .nv-b-mid { font-size: clamp(1.6rem, 2.6vw, 2.4rem) !important; font-weight: 700 !important; letter-spacing: -.04em !important; }
    .nv-b-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
    .nv-b-springs::after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(13,13,13,.92) 10%, transparent 55%); pointer-events: none; }
    /* altura: capas que se apilan */
    .nv-b-stack { position: absolute; right: 26px; top: 50%; translate: 0 -50%; width: 38%; display: flex; flex-direction: column; gap: 5px; }
    .nv-b-stack i { display: block; height: 14px; border-radius: 6px; background: linear-gradient(90deg, rgba(205,174,85,.85), rgba(205,174,85,.35)); transform-origin: left; }
    .nv-b-stack i:nth-child(1) { background: linear-gradient(90deg, #f5f0e9, #cfc6b8); height: 18px; }
    .nv-b-stack i:nth-child(5) { background: linear-gradient(90deg, #53575A, #2a2c2d); }
    /* densidad: barras */
    .nv-b-density { justify-content: space-between; }
    .nv-b-bars { display: grid; gap: 10px; }
    .nv-b-bars > div { display: grid; grid-template-columns: 40px 1fr; align-items: center; gap: 10px; }
    .nv-b-bars span { font-size: .85rem; font-weight: 700; color: var(--nv-gold-2); }
    .nv-b-bars > div > i { display: block; height: 8px; border-radius: 4px; background: rgba(252, 249, 245, .08); overflow: hidden; }
    .nv-b-bars > div > i > i { display: block; height: 100%; width: calc(var(--w) * 100%); border-radius: 4px; background: linear-gradient(90deg, var(--nv-gold), var(--nv-gold-2)); transform: scaleX(0); transform-origin: left; }
    /* garantía: anillo */
    .nv-b-warranty { align-items: center; justify-content: center; text-align: center; }
    .nv-b-ring { width: 58%; max-width: 130px; transform: rotate(-90deg); }
    .nv-b-ring circle { fill: none; stroke: rgba(252, 249, 245, .1); stroke-width: 6; }
    .nv-b-ring .nv-b-ring-fill { stroke: var(--nv-gold-2); stroke-linecap: round; stroke-dasharray: 326.7; stroke-dashoffset: 326.7; }
    .nv-b-ring-txt { position: absolute; top: 50%; left: 50%; translate: -50% -78%; text-align: center; }
    .nv-b-ring-txt b { display: block; font-size: 2.4rem; font-weight: 700; letter-spacing: -.05em; color: var(--nv-white); line-height: 1; }
    .nv-b-ring-txt span { font-size: .62rem; letter-spacing: .24em; text-transform: uppercase; color: rgba(252, 249, 245, .6); }
    .nv-b-warranty .nv-b-note { margin-top: .6rem; }
    /* fotos */
    .nv-b-cool img, .nv-b-zip img, .nv-b-italy img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; max-width: none; transition: transform 1.6s var(--nv-ease); }
    .nv-b:hover img { transform: scale(1.05); }
    .nv-b-cool::after, .nv-b-zip::after, .nv-b-italy::after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(13,13,13,.88) 5%, rgba(13,13,13,.1) 65%); }
    .nv-b-italy::after { background: linear-gradient(90deg, rgba(13,13,13,.9) 15%, rgba(13,13,13,.1) 70%); }
    .nv-b-italy { justify-content: center; }
    .nv-b-italy .nv-b-txt { max-width: 420px; }
    .nv-b-cool-glow { position: absolute; inset: 0; z-index: 1; background: linear-gradient(110deg, transparent 30%, rgba(170, 210, 235, .22) 50%, transparent 70%); background-size: 250% 100%; animation: nvCool 5s ease-in-out infinite; mix-blend-mode: screen; }
    @keyframes nvCool { 0% { background-position: 120% 0; } 100% { background-position: -120% 0; } }
    /* doble firmeza */
    .nv-b-split { position: absolute; inset: 18px 18px auto 18px; height: 52%; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    .nv-b-split span { display: flex; align-items: center; justify-content: center; border-radius: 16px; font-size: .7rem; letter-spacing: .24em; text-transform: uppercase; color: rgba(252, 249, 245, .75); }
    .nv-b-split span:first-child { background: linear-gradient(160deg, rgba(245,240,233,.16), rgba(245,240,233,.04)); }
    .nv-b-split span:last-child { background: linear-gradient(160deg, rgba(205,174,85,.3), rgba(205,174,85,.08)); }

    @media (max-width: 900px) {
      .nv-tx-grid { grid-template-columns: 1fr; }
      .nv-tx-visual { aspect-ratio: 16 / 11; max-height: none; }
      .nv-bento { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 180px; gap: 12px; }
      .nv-b-height, .nv-b-cool, .nv-b-italy { grid-column: span 2; }
      .nv-b { padding: 18px; border-radius: 20px; }
      .nv-b-stack { right: 18px; width: 34%; }
    }
    .nv-static .nv-b-bars > div > i > i { transform: none; }
    .nv-static .nv-b-ring-fill { stroke-dashoffset: 0; }
    @media (max-width: 900px) {
      .nv-b-split { height: 38%; inset: 14px 14px auto 14px; }
      .nv-b-firm p, .nv-b-density .nv-b-note, .nv-b-warranty .nv-b-note { display: none; }
    }

    /* Certificaciones: siempre visibles (sin animación de entrada) */
    #page-tecnologia section.bg-ink:last-of-type .grid > div { opacity: 1 !important; transform: none !important; }
    #page-tecnologia section.bg-ink:last-of-type .grid > div p { color: rgba(252, 249, 245, .72) !important; position: relative; }
    #page-tecnologia section.bg-ink:last-of-type .grid > div .font-serif { position: relative; }

    /* ================================================================== */
    /* ===== Entregas, Reseñas, FAQ, Contáctanos + secciones "día" ====== */
    /* ================================================================== */
    :root { --nv-ink: #1C1B19; --nv-ink-2: rgba(28, 27, 25, .66); --nv-line: rgba(28, 27, 25, .1); --nv-gold-d: #8E7430; }
    #page-entregas.page.active, #page-resenas.page.active, #page-faq.page.active, #page-contacto.page.active { animation: nvPageFade .6s ease both; }
    .nv-page { background: var(--nv-black); color: var(--nv-white); }
    .nv-page .reveal { opacity: 1; transform: none; }
    .nv-sec { padding: clamp(80px, 12vh, 140px) 0; }
    .nv-sec-tight { padding: clamp(60px, 9vh, 100px) 0; }
    .nv-narrow { max-width: 860px; }
    .nv-center { text-align: center; }
    .nv-center-lead { margin-left: auto; margin-right: auto; }

    /* ---------- Sección "día" (marfil) reutilizable ---------- */
    .nv-light { background: var(--nv-ivory) !important; color: var(--nv-ink) !important; }
    .nv-light .nv-h2, .nv-light .nv-display, .nv-light h3, .nv-light h4 { color: var(--nv-ink) !important; }
    .nv-light .nv-eyebrow { color: var(--nv-gold-d) !important; }
    .nv-light .nv-lead, .nv-light p { color: var(--nv-ink-2); }
    .nv-lcard { background: var(--nv-white); border: 1px solid var(--nv-line); border-radius: 24px; padding: 28px 26px; box-shadow: 0 30px 60px -45px rgba(28, 27, 25, .45); transition: transform .5s var(--nv-ease), box-shadow .5s; }
    .nv-lcard:hover { transform: translateY(-4px); box-shadow: 0 40px 70px -40px rgba(28, 27, 25, .5); }

    /* ---------- Portadas de página ---------- */
    .nv-ph { position: relative; min-height: 64svh; display: flex; align-items: flex-end; overflow: hidden; padding-bottom: 8vh; background: var(--nv-black); }
    .nv-ph-plain { align-items: center; padding: 10vh 0; min-height: 58svh; }
    .nv-ph canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
    .nv-ph-bg { position: absolute; inset: -8% 0 0 0; }
    .nv-ph-bg img { width: 100%; height: 100%; object-fit: cover; max-width: none; animation: nvKen 24s ease-in-out infinite alternate; }
    .nv-ph-photo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(13,13,13,.88) 0%, rgba(13,13,13,.45) 55%, rgba(13,13,13,.2) 100%), linear-gradient(0deg, var(--nv-black) 0%, transparent 45%); }
    .nv-ph-inner { position: relative; z-index: 2; max-width: 1280px; width: 100%; margin: 0 auto; padding: 0 max(24px, 6vw); }
    .nv-ph-title { font-size: clamp(2.6rem, min(6.4vw, 10vh), 6rem); font-weight: 700; }
    .nv-center .nv-cita-chips { justify-content: center; }

    /* ---------- Entregas ---------- */
    .nv-del-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 3rem; }
    .nv-del-stats b { display: block; font-size: clamp(2.6rem, 5vw, 4.4rem); font-weight: 700; letter-spacing: -.05em; color: var(--nv-gold-d); line-height: 1; font-variant-numeric: tabular-nums; }
    .nv-del-stats h4 { font-size: .72rem !important; letter-spacing: .26em; text-transform: uppercase; margin-top: .7rem; color: var(--nv-ink) !important; }
    .nv-del-stats p { margin-top: .6rem; line-height: 1.55; font-size: .95rem; }
    .nv-split2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 6vw, 90px); align-items: center; }
    .nv-split2-img { border-radius: 28px; overflow: hidden; aspect-ratio: 4 / 3.2; box-shadow: 0 50px 90px -50px rgba(28, 27, 25, .6); }
    .nv-split2-img img { width: 100%; height: 100%; object-fit: cover; max-width: none; transition: transform 1.6s var(--nv-ease); }
    .nv-split2-img:hover img { transform: scale(1.04); }
    .nv-cta-band { padding: clamp(80px, 14vh, 150px) 0; text-align: center; background: radial-gradient(ellipse at 50% 70%, rgba(205,174,85,.14), transparent 60%), var(--nv-black); }
    .nv-cta-band .nv-h2 { margin-left: auto; margin-right: auto; }

    /* ---------- Preguntas (acordeón claro) ---------- */
    .nv-faq-list { margin-top: 2.5rem; }
    .nv-light .faq-item { background: var(--nv-white); border: 1px solid var(--nv-line); border-radius: 18px; padding: 0 1.5rem; margin-bottom: .7rem; transition: border-color .4s, box-shadow .4s; }
    .nv-light .faq-item:hover { border-color: rgba(142, 116, 48, .35); }
    .nv-light .faq-item.open { background: var(--nv-white); border-color: rgba(142, 116, 48, .5); box-shadow: 0 24px 50px -36px rgba(28, 27, 25, .45); }
    .nv-light .faq-q span:first-child { font-size: 1.05rem; font-weight: 600; letter-spacing: -.015em; color: var(--nv-ink); }
    .nv-light .faq-q .icon { border-color: var(--nv-gold-d); color: var(--nv-gold-d); }
    .nv-light .faq-item.open .faq-q .icon { background: var(--nv-gold-d); color: #fff; }
    .nv-light .faq-a-inner { color: var(--nv-ink-2); }
    .nv-faq-cat { font-size: .7rem; letter-spacing: .3em; text-transform: uppercase; color: var(--nv-gold-d) !important; margin: 2.2rem 0 .9rem; font-weight: 600; }
    .nv-faq-group:first-child .nv-faq-cat { margin-top: 0; }
    .nv-faq-search { display: flex; align-items: center; gap: 12px; max-width: 560px; margin: 2rem auto 0; padding: .95rem 1.3rem; border-radius: 980px; background: rgba(252, 249, 245, .06); border: 1px solid rgba(205, 174, 85, .35); color: var(--nv-gold-2); transition: border-color .3s, background .3s; }
    .nv-faq-search:focus-within { border-color: var(--nv-gold-2); background: rgba(252, 249, 245, .1); }
    .nv-faq-search input { flex: 1; background: transparent; border: 0; outline: none; color: var(--nv-white); font-size: 1rem; }
    .nv-faq-search input::placeholder { color: rgba(252, 249, 245, .45); }
    .nv-faq-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 1.2rem; }
    .nv-faq-chip { font-size: .78rem; padding: .5rem 1rem; border-radius: 980px; border: 1px solid rgba(252, 249, 245, .2); color: rgba(252, 249, 245, .75); transition: all .3s; cursor: pointer; }
    .nv-faq-chip:hover { border-color: var(--nv-gold-2); color: var(--nv-gold-2); }
    .nv-faq-chip.is-on { background: var(--nv-gold-2); border-color: var(--nv-gold-2); color: var(--nv-black); }
    .nv-faq-group.is-hidden, .faq-item.is-hidden { display: none; }
    .nv-faq-empty { display: none; text-align: center; margin-top: 2rem; }
    .nv-faq-empty.is-on { display: block; }
    mark.nv-hl { background: rgba(205, 174, 85, .35); color: inherit; border-radius: 3px; padding: 0 2px; }

    /* ---------- Reseñas ---------- */
    .nv-res-stars { display: flex; justify-content: center; gap: 10px; margin-bottom: 1.4rem; }
    .nv-res-stars i { font-style: normal; font-size: clamp(1.6rem, 3vw, 2.4rem); color: var(--nv-gold-2); text-shadow: 0 0 30px rgba(205, 174, 85, .6); display: inline-block; }
    #resenas-wrap .bg-cream, #resenas-wrap .bg-white { background: var(--nv-white) !important; }
    #resenas-wrap .border-pearl { border-color: var(--nv-line) !important; }
    #resenas-wrap > div:first-child { border-radius: 26px !important; box-shadow: 0 30px 60px -45px rgba(28,27,25,.45); }
    #resenas-wrap .font-serif { font-family: 'Inter', sans-serif !important; font-weight: 700; letter-spacing: -.04em; color: var(--nv-ink) !important; }
    #resenas-wrap .text-ink { color: var(--nv-ink) !important; }
    #resenas-wrap .text-graphite { color: var(--nv-ink-2) !important; }
    #resenas-wrap .text-gold { color: var(--nv-gold-d) !important; }
    #resenas-wrap .grid > div { border-radius: 22px !important; box-shadow: 0 30px 60px -48px rgba(28,27,25,.5); transition: transform .5s var(--nv-ease); }
    #resenas-wrap .grid > div:hover { transform: translateY(-4px); }

    /* ---------- Contáctanos ---------- */
    .nv-contact { display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100svh - var(--nv-nav, 0px)); }
    .nv-contact-left { position: relative; overflow: hidden; display: flex; align-items: center; }
    .nv-contact-left canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
    .nv-contact-left-inner { position: relative; z-index: 2; padding: 10vh max(24px, 6vw); width: 100%; max-width: 640px; margin-left: auto; }
    .nv-channels { margin-top: 2.4rem; border-top: 1px solid rgba(252, 249, 245, .12); }
    .nv-channel { width: 100%; display: grid; grid-template-columns: 110px 1fr auto; align-items: center; gap: 12px; padding: 18px 0; border-bottom: 1px solid rgba(252, 249, 245, .12); text-align: left; color: var(--nv-white); cursor: pointer; transition: padding .5s var(--nv-ease), color .3s; }
    .nv-channel span { font-size: .68rem; letter-spacing: .26em; text-transform: uppercase; color: rgba(252, 249, 245, .5); }
    .nv-channel b { font-size: clamp(1rem, 1.6vw, 1.3rem); font-weight: 600; letter-spacing: -.02em; overflow-wrap: anywhere; }
    .nv-channel i { font-style: normal; color: var(--nv-gold-2); transition: transform .5s var(--nv-ease); }
    .nv-channel:hover { padding-left: 10px; color: var(--nv-gold-2); }
    .nv-channel:hover i { transform: translateX(6px); }
    .nv-contact-right { display: flex; align-items: center; }
    .nv-form { width: 100%; max-width: 600px; padding: 10vh max(24px, 5vw); }
    .nv-form-title { font-size: clamp(1.8rem, 3vw, 2.8rem) !important; }
    .nv-form .form-fields { margin-top: 2rem; display: grid; gap: 14px; }
    .nv-field { position: relative; display: block; }
    .nv-form .luxe-input { width: 100%; background: var(--nv-white) !important; border: 1px solid var(--nv-line) !important; border-radius: 16px !important; padding: 1.35rem 1.1rem .55rem !important; color: var(--nv-ink) !important; font-size: 1rem; outline: none; transition: border-color .3s, box-shadow .3s; }
    .nv-form .luxe-input:focus { border-color: var(--nv-gold-d) !important; box-shadow: 0 0 0 4px rgba(185, 155, 63, .15); }
    .nv-field > span { position: absolute; left: 1.1rem; top: 1rem; font-size: .95rem; color: rgba(28, 27, 25, .5) !important; pointer-events: none; transition: all .3s var(--nv-ease); }
    .nv-field .luxe-input:focus + span, .nv-field .luxe-input:not(:placeholder-shown) + span { top: .45rem; font-size: .66rem; letter-spacing: .14em; text-transform: uppercase; color: var(--nv-gold-d) !important; }
    .nv-topics { display: flex; flex-wrap: wrap; gap: 8px; padding: 4px 0; }
    .nv-topics-label { width: 100%; font-size: .68rem; letter-spacing: .26em; text-transform: uppercase; color: var(--nv-gold-d) !important; font-weight: 600; }
    .nv-topics label { cursor: pointer; }
    .nv-topics input { position: absolute; opacity: 0; pointer-events: none; }
    .nv-topics span { display: inline-block; font-size: .85rem; padding: .55rem 1rem; border-radius: 980px; border: 1px solid var(--nv-line); background: var(--nv-white); color: var(--nv-ink) !important; transition: all .3s; }
    .nv-topics input:checked + span { background: var(--nv-ink); border-color: var(--nv-ink); color: var(--nv-white) !important; }
    .nv-topics input:focus-visible + span { box-shadow: 0 0 0 3px rgba(185, 155, 63, .4); }
    .nv-form .btn-gold { justify-self: start; margin-top: .6rem; }
    .nv-form .form-success { margin-top: 2rem; padding: 2rem; border-radius: 22px; background: var(--nv-white); border: 1px solid rgba(142, 116, 48, .4); }
    .nv-hours-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .nv-hours-grid b { display: block; margin-top: .6rem; font-size: 1.15rem; font-weight: 700; letter-spacing: -.02em; color: var(--nv-ink); }

    /* ================================================================== */
    /* ===== Ritmo noche → día: secciones existentes pasadas a marfil === */
    /* ================================================================== */
    /* Inicio: "Por qué Nuvela", testimonio y galería */
    #nv-why, #nv-voice, #nv-gallery { background: var(--nv-ivory) !important; color: var(--nv-ink); }
    #nv-voice { background: var(--nv-white) !important; }
    #nv-why .nv-h2, #nv-voice .nv-voice-text, #nv-gallery .nv-h2 { color: var(--nv-ink) !important; }
    #nv-why .nv-eyebrow, #nv-voice .nv-eyebrow, #nv-gallery .nv-eyebrow { color: var(--nv-gold-d) !important; }
    #nv-voice .nv-w.nv-gold { color: var(--nv-gold-d); }
    #nv-why .nv-card { background: var(--nv-white); border-color: var(--nv-line); box-shadow: 0 30px 60px -45px rgba(28,27,25,.4); }
    #nv-why .nv-card h3 { color: var(--nv-ink); }
    #nv-why .nv-card p { color: var(--nv-ink-2); }
    #nv-why .nv-card-num { color: var(--nv-gold-d); }
    #nv-why .nv-card::before { background: radial-gradient(420px circle at var(--mx) var(--my), rgba(185, 155, 63, .14), transparent 45%); }
    #nv-gallery .nv-btn-ghost { color: var(--nv-ink); border-color: rgba(28,27,25,.3); background: transparent; }
    #nv-gallery .nv-btn-ghost:hover { color: var(--nv-gold-d); border-color: var(--nv-gold-d); }

    /* Detalle de producto: beneficios, especificaciones y preguntas */
    #page-producto-detalle > section:not(:first-child) { background: var(--nv-ivory) !important; }
    #page-producto-detalle > section:nth-of-type(3) { background: var(--nv-white) !important; }
    #page-producto-detalle > section:not(:first-child) .text-ink, #page-producto-detalle > section:not(:first-child) h3 { color: var(--nv-ink) !important; }
    #page-producto-detalle > section:not(:first-child) .text-graphite { color: var(--nv-ink-2) !important; }
    #page-producto-detalle > section:not(:first-child) .eyebrow { color: var(--nv-gold-d) !important; }
    #page-producto-detalle > section:not(:first-child) .text-mist { color: rgba(28,27,25,.5) !important; }
    #page-producto-detalle #pd-benefits > div { background: var(--nv-white) !important; border-color: var(--nv-line) !important; box-shadow: 0 30px 60px -45px rgba(28,27,25,.4); }
    #pd-specs-table { background: var(--nv-white) !important; border-color: rgba(142,116,48,.35) !important; }
    #pd-specs-table > div:first-child { background: var(--nv-ink) !important; color: var(--nv-gold-2) !important; }
    #pd-specs-table .border-pearl { border-color: var(--nv-line) !important; }
    #pd-specs-table .bg-pearl\/30 { background: rgba(28,27,25,.03) !important; }
    #page-producto-detalle .faq-item { background: var(--nv-white); border-color: var(--nv-line); }
    #page-producto-detalle .faq-item.open { background: var(--nv-white); border-color: rgba(142,116,48,.5); }
    #page-producto-detalle .faq-item .faq-q span { color: var(--nv-ink) !important; }
    #page-producto-detalle .faq-a-inner { color: var(--nv-ink-2); }
    #page-producto-detalle .faq-q .icon { border-color: var(--nv-gold-d); color: var(--nv-gold-d); }

    /* Hoteles: "Para quién" y "Cómo trabajamos" */
    .nv-hotel-who, .nv-hotel-steps { background: var(--nv-ivory) !important; }
    .nv-hotel-steps { background: var(--nv-white) !important; }
    .nv-hotel-who .nv-h2, .nv-hotel-steps .nv-h2, .nv-hotel-steps h4 { color: var(--nv-ink) !important; }
    .nv-hotel-who .nv-eyebrow, .nv-hotel-steps .nv-eyebrow { color: var(--nv-gold-d) !important; }
    .nv-hotel-steps p { color: var(--nv-ink-2) !important; }
    .nv-hotel-steps .nv-steps-line { background: var(--nv-line); }
    .nv-hotel-steps .nv-steps li span { background: var(--nv-white); border-color: var(--nv-gold-d); color: var(--nv-gold-d); }

    /* Agenda tu Cita: "Tu visita" y "Tu equipo" */
    .nv-cita-steps, .nv-cita-team { background: var(--nv-ivory) !important; }
    .nv-cita-team { background: var(--nv-white) !important; }
    .nv-cita-steps .nv-h2, .nv-cita-team .nv-h2, .nv-cita-cards h4 { color: var(--nv-ink) !important; }
    .nv-cita-steps .nv-eyebrow, .nv-cita-team .nv-eyebrow { color: var(--nv-gold-d) !important; }
    .nv-cita-cards p, .nv-cita-team .nv-lead { color: var(--nv-ink-2) !important; }
    .nv-cita-cards .nv-card { background: var(--nv-white); border-color: var(--nv-line); box-shadow: 0 30px 60px -45px rgba(28,27,25,.4); }
    .nv-cita-cards .nv-card-num { color: var(--nv-gold-d); }
    #cita-calendar-wrap .grid > div { background: var(--nv-ivory) !important; border-color: var(--nv-line) !important; }
    #cita-calendar-wrap .text-ink { color: var(--nv-ink) !important; }
    #cita-calendar-wrap .text-graphite { color: var(--nv-ink-2) !important; }
    #cita-calendar-wrap .grid > div > div:first-child { color: var(--nv-gold-d) !important; border-color: rgba(142,116,48,.5); }

    /* Tecnología: la sección del video en marfil */
    .nv-tech-video { background: var(--nv-ivory); }
    .nv-tech-video .nv-h2 { color: var(--nv-ink) !important; }
    .nv-tech-video .nv-eyebrow { color: var(--nv-gold-d) !important; }
    .nv-tech-video .nv-lead { color: var(--nv-ink-2) !important; }

    /* Comparar: la tabla en marfil */
    .nv-cmp-table { background: var(--nv-ivory); }
    #compare-table-wrap h3 { color: var(--nv-ink) !important; }
    #compare-table-wrap .eyebrow { color: var(--nv-gold-d) !important; }
    #compare-table-wrap .min-w-\[520px\] { background: var(--nv-white) !important; border-color: rgba(142,116,48,.35) !important; }
    #compare-table-wrap .text-ink { color: var(--nv-ink) !important; }
    #compare-table-wrap .text-graphite { color: var(--nv-ink-2) !important; }
    #compare-table-wrap .text-mist { color: rgba(28,27,25,.5) !important; }
    #compare-table-wrap .text-gold { color: var(--nv-gold-d) !important; }
    #compare-table-wrap .border-ink { border-color: rgba(142,116,48,.5) !important; }
    #compare-table-wrap .border-pearl { border-color: var(--nv-line) !important; }
    #compare-table-wrap .bg-pearl\/30 { background: rgba(28,27,25,.03) !important; }
    #compare-table-wrap .bg-cream\/60 { background: rgba(185,155,63,.1) !important; }
    #compare-table-wrap .bg-cream { background: var(--nv-ivory) !important; }
    #compare-table-wrap .btn-outline { color: var(--nv-ink); border-color: rgba(28,27,25,.3); }
    #compare-table-wrap .js-compare-size { color: var(--nv-ink-2); }
    #compare-table-wrap .js-compare-size.bg-ink { background: var(--nv-ink) !important; color: var(--nv-white) !important; border-color: var(--nv-ink) !important; }
    .nv-cmp-diff-toggle { color: var(--nv-ink-2); }
    .nv-cmp-diff-toggle i { background: rgba(28,27,25,.15); }
    .nv-diff > div:first-child::before { background: var(--nv-gold-d); }

    @media (max-width: 900px) {
      .nv-del-stats, .nv-hours-grid { grid-template-columns: 1fr; }
      .nv-split2 { grid-template-columns: 1fr; }
      .nv-contact { grid-template-columns: 1fr; }
      .nv-contact-left-inner { padding: 8vh 24px 6vh; max-width: none; }
      .nv-form { padding: 8vh 24px; }
      .nv-channel { grid-template-columns: 90px 1fr auto; }
      .nv-ph { min-height: 54svh; }
    }

    /* ---- Recorrido del cliente: confianza, qué sigue, después de la compra ---- */
    .nv-trust { list-style: none; padding: 0; margin: 1.8rem 0 0; display: grid; gap: 0; border: 1px solid rgba(205, 174, 85, .28); border-radius: 18px; overflow: hidden; }
    .nv-trust li { display: grid; gap: 2px; padding: .85rem 1.1rem; border-top: 1px solid rgba(252, 249, 245, .08); }
    .nv-trust li[hidden] { display: none; }
    .nv-trust li:first-child, .nv-trust li[hidden] + li { border-top: 0; }
    .nv-trust b { font-size: .86rem; font-weight: 600; color: var(--nv-gold-2); }
    .nv-trust span { font-size: .84rem; line-height: 1.5; color: rgba(252, 249, 245, .7); }
    .nv-trust-links { display: flex; flex-wrap: wrap; gap: 8px 22px; margin-top: 1rem; }
    .nv-trust-links > * { font-size: .8rem; font-weight: 600; color: rgba(252, 249, 245, .85); border-bottom: 1px solid rgba(205, 174, 85, .5); padding-bottom: 2px; cursor: pointer; transition: color .3s; }
    .nv-trust-links > *:hover { color: var(--nv-gold-2); }
    .nv-after-grid .nv-lcard > b { display: block; font-size: .8rem; letter-spacing: .2em; color: var(--nv-gold-d); font-weight: 600; margin-bottom: .6rem; }
    .nv-after-grid h4 { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 1.1rem; letter-spacing: -.02em; color: var(--nv-ink); }
    .nv-after-grid p { margin-top: .5rem; font-size: .92rem; line-height: 1.6; }
    .nv-owner-link { display: inline-block; margin-top: .9rem; font-size: .84rem; font-weight: 600; color: var(--nv-gold-d); border-bottom: 1px solid currentColor; }
    @media (max-width: 900px) { .nv-after-grid { grid-template-columns: 1fr; } }

    /* ================================================================== */
    /* ======================== SORTEO NUVELA =========================== */
    /* ================================================================== */
    #page-sorteo.page.active { animation: nvPageFade .6s ease both; }
    .nv-sorteo-prizes .nv-lcard > b { letter-spacing: .16em; text-transform: uppercase; }
    .nv-sorteo-grid { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: clamp(32px, 6vw, 96px); align-items: start; }
    .nv-form.nv-sorteo-form { padding: 0; max-width: none; }
    .nv-form.nv-sorteo-form .form-fields { margin-top: 0; }
    .nv-check { display: flex; align-items: flex-start; gap: 12px; font-size: .92rem; line-height: 1.5; color: var(--nv-ink-2); cursor: pointer; }
    .nv-check input { flex-shrink: 0; width: 20px; height: 20px; margin-top: 2px; accent-color: #8E7430; cursor: pointer; }
    .nv-check a { color: var(--nv-gold-d); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
    .nv-sorteo-error { color: #B3261E !important; font-size: .88rem; }
    .nv-sorteo-panel { background: var(--nv-white); border: 1px solid rgba(142, 116, 48, .4); border-radius: 24px; padding: clamp(22px, 3vw, 36px); box-shadow: 0 30px 60px -45px rgba(28, 27, 25, .45); }
    .nv-sorteo-hello { font-size: 1.15rem; color: var(--nv-ink) !important; margin-top: .6rem; line-height: 1.5; }
    .nv-sorteo-points { display: flex; align-items: baseline; gap: 14px; margin-top: 1.2rem; padding: 1rem 0; border-top: 1px solid var(--nv-line); border-bottom: 1px solid var(--nv-line); }
    .nv-sorteo-points > b { font-size: clamp(3rem, 6vw, 4.6rem); font-weight: 800; letter-spacing: -.04em; line-height: 1; color: var(--nv-gold-d); }
    .nv-sorteo-points > span { display: grid; font-size: .8rem; letter-spacing: .2em; text-transform: uppercase; font-weight: 600; color: var(--nv-ink); }
    .nv-sorteo-points em { font-style: normal; letter-spacing: 0; text-transform: none; font-weight: 400; font-size: .86rem; color: var(--nv-ink-2); margin-top: 4px; }
    .nv-sorteo-label { font-size: .7rem !important; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: var(--nv-gold-d) !important; margin-top: 1.4rem; }
    .nv-sorteo-link { display: flex; gap: 8px; margin-top: .6rem; }
    .nv-sorteo-link input { flex: 1; min-width: 0; border: 1px solid var(--nv-line); border-radius: 14px; padding: .8rem 1rem; font-size: .88rem; color: var(--nv-ink); background: #F5F0E9; outline: none; }
    .nv-sorteo-link .btn-gold { padding: .8rem 1.3rem; font-size: .85rem; }
    .nv-sorteo-share { display: flex; flex-wrap: wrap; gap: 8px; margin-top: .8rem; }
    .nv-sorteo-btn { display: inline-block; padding: .65rem 1.15rem; border: 1px solid rgba(28, 27, 25, .2); border-radius: 980px; font-size: .82rem; font-weight: 600; color: var(--nv-ink); cursor: pointer; transition: background .35s, color .35s, border-color .35s; }
    .nv-sorteo-btn:hover { background: var(--nv-ink); color: #FCF9F5; border-color: var(--nv-ink); }
    .nv-rules { margin-top: 2rem; padding-left: 1.2rem; list-style: decimal; display: grid; gap: .8rem; color: var(--nv-ink-2); font-size: .92rem; line-height: 1.65; }
    .nv-rules li::marker { color: var(--nv-gold-d); font-weight: 600; }
    /* Aviso flotante del sorteo (todas las páginas menos la del sorteo) */
    .nv-sorteo-chip { position: fixed; left: 20px; bottom: 22px; z-index: 44; display: flex; align-items: stretch; background: rgba(13, 13, 13, .92); border: 1px solid rgba(205, 174, 85, .55); border-radius: 18px; backdrop-filter: blur(10px); box-shadow: 0 24px 50px -22px rgba(0, 0, 0, .8); opacity: 0; transform: translateY(24px); pointer-events: none; transition: opacity .6s var(--nv-ease), transform .6s var(--nv-ease); max-width: calc(100vw - 110px); }
    .nv-sorteo-chip.is-on { opacity: 1; transform: none; pointer-events: auto; }
    .nv-sorteo-chip a { display: grid; gap: 2px; padding: 12px 6px 12px 16px; }
    .nv-sorteo-chip a b { font-size: .62rem; letter-spacing: .22em; text-transform: uppercase; color: #CDAE55; font-weight: 600; }
    .nv-sorteo-chip a span { font-size: .92rem; font-weight: 600; color: #FCF9F5; }
    .nv-sorteo-chip button { padding: 0 14px; color: rgba(252, 249, 245, .55); font-size: 1.1rem; cursor: pointer; }
    .nv-sorteo-chip button:hover { color: #FCF9F5; }
    body:has(#page-sorteo.active) .nv-sorteo-chip, body:has(#page-carrito.active) .nv-sorteo-chip { display: none; }
    @media (max-width: 900px) {
      .nv-sorteo-grid { grid-template-columns: 1fr; }
      .nv-sorteo-chip { left: 14px; bottom: 16px; }
      .nv-sorteo-link { flex-direction: column; }
    }

    /* Tarjetas de premios del sorteo */
    .nv-prizes { display: grid; grid-template-columns: 1.35fr 1fr 1fr; gap: 20px; margin-top: 3rem; align-items: stretch; }
    .nv-prize { display: flex; flex-direction: column; background: var(--nv-white); border: 1px solid var(--nv-line); border-radius: 26px; overflow: hidden; box-shadow: 0 30px 60px -45px rgba(28, 27, 25, .45); transition: transform .5s var(--nv-ease), box-shadow .5s; }
    .nv-prize:hover { transform: translateY(-4px); box-shadow: 0 40px 70px -40px rgba(28, 27, 25, .5); }
    .nv-prize-1 { border-color: rgba(142, 116, 48, .55); box-shadow: 0 0 0 1px rgba(205, 174, 85, .45), 0 34px 70px -40px rgba(142, 116, 48, .55); }
    .nv-prize-media { position: relative; aspect-ratio: 4 / 3; overflow: hidden; background: #0D0D0D; flex: 1 1 auto; min-height: 220px; }
    .nv-prize-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; max-width: none; transition: transform 1.2s var(--nv-ease); }
    .nv-prize:hover .nv-prize-media img { transform: scale(1.05); }
    .nv-prize-rank { position: absolute; left: 16px; top: 16px; padding: .45rem .9rem; border-radius: 980px; background: rgba(13, 13, 13, .82); border: 1px solid rgba(205, 174, 85, .7); color: #CDAE55; font-size: .66rem; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; backdrop-filter: blur(6px); }
    .nv-prize-1 .nv-prize-rank { background: #CDAE55; color: #0D0D0D; border-color: #CDAE55; }
    .nv-prize-amount { display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(ellipse at 50% 40%, #2a2618 0%, #0D0D0D 70%); }
    .nv-prize-amount b { font-size: clamp(3.4rem, 6vw, 5.2rem); font-weight: 800; letter-spacing: -.05em; line-height: 1; color: #CDAE55; }
    .nv-prize-amount i { font-style: normal; margin-top: .5rem; font-size: .72rem; letter-spacing: .28em; text-transform: uppercase; color: rgba(252, 249, 245, .7); }
    .nv-prize-body { padding: 1.4rem 1.5rem 1.6rem; }
    .nv-prize-body h4 { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 1.3rem; letter-spacing: -.025em; line-height: 1.2; color: var(--nv-ink) !important; }
    .nv-prize-1 .nv-prize-body h4 { font-size: 1.65rem; }
    .nv-prize-body p { margin-top: .5rem; font-size: .95rem; line-height: 1.55; }
    .nv-prize-note { margin-top: 1.6rem; font-size: .86rem; color: var(--nv-ink-2) !important; }
    @media (max-width: 900px) { .nv-prizes { grid-template-columns: 1fr; } .nv-prize-media { min-height: 0; } }

    .nv-so-hint { font-size: .82rem !important; line-height: 1.5; color: var(--nv-ink-2) !important; margin-top: -4px; }
    .nv-so-hint a { color: var(--nv-gold-d); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; white-space: nowrap; }
    .nv-so-textbtn { justify-self: start; font-size: .84rem; font-weight: 600; color: var(--nv-gold-d); border-bottom: 1px solid currentColor; padding-bottom: 1px; cursor: pointer; margin-top: .4rem; }
    .nv-sorteo-panel .nv-so-textbtn { display: inline-block; margin-top: 1.2rem; }

    /* Sorteo en el menú principal */
    .nav-link.nv-nav-sorteo { color: #CDAE55 !important; position: relative; padding-left: 14px; }
    .nav-link.nv-nav-sorteo::before { content: ''; position: absolute; left: 0; top: 50%; width: 6px; height: 6px; margin-top: -3px; border-radius: 50%; background: #CDAE55; }
    .drawer-link.nv-drawer-sorteo { color: #8E7430 !important; font-weight: 700; }
    .nav-link { white-space: nowrap; }
    @media (min-width: 1024px) and (max-width: 1260px) {
      #navbar nav { gap: 1.15rem !important; }
      #navbar .nav-link { letter-spacing: .12em !important; font-size: .68rem !important; }
    }

    /* ================================================================== */
    /* ================ HOME INMERSIVO (rediseño 1/10/26) =============== */
    /* ================================================================== */
    /* Colores oficiales de la guía de marca Nuvela.                      */
    :root {
      --nv-black: #0D0D0D;
      --nv-black-2: #1C1B19;
      --nv-ivory: #F5F0E9;
      --nv-white: #FCF9F5;
      --nv-gold: #B99B3F;
      --nv-gold-2: #CDAE55;
      --nv-graphite: #53575A;
      --nv-ease: cubic-bezier(.16, 1, .3, 1);
    }
    html.lenis, html.lenis body { height: auto; }
    html.lenis { scroll-behavior: auto !important; }
    .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
    .lenis.lenis-stopped { overflow: hidden; }

    /* El home ya no usa la animación de entrada con "translateY" del resto */
    /* de páginas: un transform en el contenedor rompe las secciones que se */
    /* quedan fijas ("pin") mientras haces scroll.                          */
    #page-home.page.active { animation: nvPageFade .6s ease both; }
    @keyframes nvPageFade { from { opacity: 0; } to { opacity: 1; } }

    .nv-home { background: var(--nv-black); color: var(--nv-white); overflow-x: clip; }
    .nv-dark { position: relative; background: var(--nv-black); color: var(--nv-white); }
    .nv-wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
    .nv-eyebrow {
      font-family: 'Inter', sans-serif; font-weight: 600; text-transform: uppercase;
      letter-spacing: .32em; font-size: .7rem; color: var(--nv-gold-2);
    }
    .nv-h2 {
      font-family: 'Inter', sans-serif; font-weight: 700; letter-spacing: -.035em;
      font-size: clamp(2.1rem, min(5vw, 8.5vh), 4.2rem); line-height: 1.02; color: var(--nv-white); margin-top: 1.1rem;
    }
    .nv-display {
      font-family: 'Inter', sans-serif; font-weight: 800; letter-spacing: -.045em;
      font-size: clamp(2.6rem, 8vw, 7.5rem); line-height: .95; color: var(--nv-white); margin-top: 1.2rem;
    }
    .nv-lead { color: rgba(252, 249, 245, .68); font-size: clamp(1rem, 1.3vw, 1.15rem); line-height: 1.65; margin-top: 1.4rem; max-width: 34rem; }
    .nv-fineprint { color: rgba(252, 249, 245, .38); font-size: .72rem; margin-top: .6rem; letter-spacing: .02em; }
    .nv-link { color: var(--nv-gold-2); font-weight: 600; margin-top: 1.6rem; display: inline-block; background: none; border: 0; cursor: pointer; position: relative; padding: 0; }
    .nv-link::after { content: ''; position: absolute; left: 0; right: 0; bottom: -4px; height: 1px; background: currentColor; transform: scaleX(.25); transform-origin: left; transition: transform .6s var(--nv-ease); }
    .nv-link:hover::after { transform: scaleX(1); }

    .nv-btn-ghost {
      display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
      padding: .9rem 1.9rem; border-radius: 980px; border: 1px solid rgba(252, 249, 245, .35);
      color: var(--nv-white); font-weight: 600; font-size: 1rem; letter-spacing: -.01em;
      background: rgba(252, 249, 245, .02); backdrop-filter: blur(6px); cursor: pointer;
      transition: border-color .4s ease, background .4s ease, color .4s ease;
    }
    .nv-btn-ghost:hover { border-color: var(--nv-gold-2); color: var(--nv-gold-2); background: rgba(185, 155, 63, .08); }
    .nv-magnetic { will-change: transform; }

    /* ---------- Intro de carga ---------- */
    #nv-intro {
      position: fixed; inset: 0; z-index: 200; background: var(--nv-black);
      display: flex; align-items: center; justify-content: center; pointer-events: all;
      clip-path: inset(0 0 0 0);
    }
    #nv-intro.nv-gone { display: none; }
    .nv-intro-center { width: min(560px, 84vw); }
    .nv-intro-word {
      display: flex; justify-content: space-between; overflow: hidden;
      font-family: 'Cormorant Garamond', serif; font-weight: 500; color: var(--nv-white);
      font-size: clamp(3rem, 12vw, 7rem); line-height: 1;
    }
    .nv-intro-word span { display: inline-block; transform: translateY(110%); }
    .nv-intro-line { height: 1px; background: rgba(252, 249, 245, .12); margin-top: 1.4rem; overflow: hidden; }
    .nv-intro-line i { display: block; height: 100%; width: 100%; background: linear-gradient(90deg, var(--nv-gold), var(--nv-gold-2)); transform: scaleX(0); transform-origin: left; }
    .nv-intro-meta { display: flex; justify-content: space-between; margin-top: .9rem; font-size: .68rem; letter-spacing: .32em; text-transform: uppercase; color: rgba(252, 249, 245, .55); font-variant-numeric: tabular-nums; }

    /* ---------- Barra de progreso, cursor y grano ---------- */
    #nv-progress { position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 120; pointer-events: none; opacity: 0; transition: opacity .4s; }
    body.nv-on-home #nv-progress { opacity: 1; }
    #nv-progress i { display: block; height: 100%; background: linear-gradient(90deg, var(--nv-gold), var(--nv-gold-2)); transform: scaleX(0); transform-origin: left; }
    #nv-cursor {
      position: fixed; left: 0; top: 0; z-index: 130; pointer-events: none; width: 38px; height: 38px;
      margin: -19px 0 0 -19px; border-radius: 50%; border: 1px solid rgba(205, 174, 85, .7);
      display: none; align-items: center; justify-content: center;
      transition: width .45s var(--nv-ease), height .45s var(--nv-ease), margin .45s var(--nv-ease), background .3s, border-color .3s;
    }
    #nv-cursor span { font-size: .62rem; letter-spacing: .2em; text-transform: uppercase; color: var(--nv-black); opacity: 0; font-weight: 700; transition: opacity .3s; }
    body.nv-fine.nv-on-home #nv-cursor { display: flex; }
    #nv-cursor.is-hover { width: 64px; height: 64px; margin: -32px 0 0 -32px; background: rgba(205, 174, 85, .12); }
    #nv-cursor.is-view { width: 92px; height: 92px; margin: -46px 0 0 -46px; background: var(--nv-gold-2); border-color: var(--nv-gold-2); }
    #nv-cursor.is-view span { opacity: 1; }
    #nv-grain {
      position: fixed; inset: -50%; z-index: 110; pointer-events: none; opacity: 0; transition: opacity .6s;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.9'/></svg>");
      animation: nvGrain 1.2s steps(6) infinite;
    }
    body.nv-on-home #nv-grain { opacity: .055; }
    @keyframes nvGrain {
      0% { transform: translate(0, 0); } 20% { transform: translate(-3%, 2%); } 40% { transform: translate(2%, -4%); }
      60% { transform: translate(-4%, -2%); } 80% { transform: translate(3%, 3%); } 100% { transform: translate(0, 0); }
    }

    /* ---------- 1. Hero ---------- */
    #nv-hero { height: calc(100svh - var(--nv-nav, 0px)); min-height: 380px; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; }
    #nv-hero-canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; }
    .nv-hero-photo { position: absolute; left: 50%; bottom: -4%; width: min(1150px, 120vw, 150vh); translate: -50% 0; z-index: 1; perspective: 1200px; }
    .nv-hero-photo img {
      width: 100%; display: block; opacity: 0;
      -webkit-mask-image: radial-gradient(ellipse 58% 62% at 50% 56%, #000 55%, transparent 100%);
              mask-image: radial-gradient(ellipse 58% 62% at 50% 56%, #000 55%, transparent 100%);
    }
    .nv-hero-copy { position: relative; z-index: 3; text-shadow: 0 2px 24px rgba(0,0,0,.6); text-align: center; padding-top: clamp(28px, 7vh, 80px); pointer-events: none; width: 100%; }
    .nv-hero-copy button, .nv-hero-copy a { pointer-events: auto; }
    .nv-wordmark-slot { height: clamp(70px, min(15vw, 24vh), 210px); }
    .nv-hero-sub { font-size: .68rem; letter-spacing: .5em; text-transform: uppercase; color: rgba(252, 249, 245, .7); margin-top: .2rem; }
    .nv-hero-tagline { font-family: 'Inter', sans-serif; font-weight: 600; letter-spacing: -.02em; font-size: clamp(1.15rem, 2.2vw, 1.6rem); color: var(--nv-white); margin-top: 1.4rem; }
    .nv-hero-actions { display: flex; flex-wrap: wrap; gap: .9rem; justify-content: center; margin-top: 2rem; }
    .nv-hero-eyebrow, .nv-hero-sub, .nv-hero-tagline, .nv-hero-actions > * { opacity: 0; }
    .nv-scroll-cue { position: absolute; bottom: 22px; left: 50%; translate: -50% 0; z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 10px; font-size: .62rem; letter-spacing: .32em; text-transform: uppercase; color: rgba(252, 249, 245, .55); }
    .nv-scroll-cue i { width: 1px; height: 44px; background: linear-gradient(var(--nv-gold-2), transparent); transform-origin: top; animation: nvCue 2.2s var(--nv-ease) infinite; }
    @keyframes nvCue { 0% { transform: scaleY(0); } 50% { transform: scaleY(1); transform-origin: top; } 51% { transform-origin: bottom; } 100% { transform: scaleY(0); transform-origin: bottom; } }

    /* ---------- 2. Manifiesto ---------- */
    #nv-manifesto { min-height: 100svh; display: flex; align-items: center; overflow: hidden; }
    #nv-waves-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
    .nv-manifesto-inner { position: relative; z-index: 2; max-width: 1180px; margin: 0 auto; padding: 0 24px; }
    .nv-manifesto-text { font-family: 'Inter', sans-serif; font-weight: 700; letter-spacing: -.04em; font-size: clamp(2rem, 5.6vw, 5.2rem); line-height: 1.04; margin-top: 1.6rem; }
    .nv-w { display: inline-block; opacity: .13; transition: none; }
    .nv-w.nv-gold { color: var(--nv-gold-2); }

    /* ---------- 3. Revelación ---------- */
    #nv-reveal { height: 100svh; overflow: hidden; }
    .nv-reveal-stage { position: relative; height: 100%; width: 100%; }
    .nv-reveal-media { position: absolute; inset: 0; clip-path: inset(22% 30% 22% 30% round 28px); will-change: clip-path; }
    .nv-reveal-media img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.35); will-change: transform; }
    .nv-reveal-scrim { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(13,13,13,.86) 0%, rgba(13,13,13,.45) 45%, rgba(13,13,13,.05) 75%), linear-gradient(0deg, rgba(13,13,13,.85), transparent 40%); opacity: 0; }
    .nv-reveal-content { position: absolute; inset: 0; z-index: 2; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 max(24px, 6vw) 6vh; gap: clamp(20px, 5vh, 56px); }
    .nv-reveal-copy { max-width: min(760px, 88vw); opacity: 0; }
    .nv-reveal-copy .nv-display { font-size: clamp(2.2rem, min(5.6vw, 8.5vh), 5.6rem); font-weight: 700; letter-spacing: -.04em; line-height: 1; }
    .nv-reveal-copy .nv-lead { margin-top: 1rem; }
    .nv-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; border-top: 1px solid rgba(252, 249, 245, .18); padding-top: 20px; opacity: 0; }
    .nv-stat b { display: block; font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(1.6rem, min(3.4vw, 6vh), 3rem); letter-spacing: -.04em; color: var(--nv-gold-2); font-variant-numeric: tabular-nums; line-height: 1; }
    .nv-stat span { display: block; font-size: .68rem; letter-spacing: .24em; text-transform: uppercase; color: rgba(252, 249, 245, .66); margin-top: .5rem; }

    /* ---------- 4. Colchón desarmado (interactivo: tocar una capa) ---------- */
    #nv-layers { background: radial-gradient(ellipse at 60% 50%, #1f1d18 0%, var(--nv-black) 65%); }
    .nv-layers-pin { position: relative; height: 100svh; min-height: 620px; overflow: hidden; }
    .nv-layers-head { position: absolute; left: max(24px, 6vw); top: 12vh; z-index: 3; max-width: 560px; }
    .nv-layers-stage { position: absolute; left: 60%; top: 54%; width: min(50vw, 720px, 70vh); aspect-ratio: 1.1 / 1; translate: -50% -50%; cursor: pointer; }
    .nv-layers-glow { position: absolute; inset: 10% 5%; background: radial-gradient(ellipse at center, rgba(205, 174, 85, .2), transparent 65%); filter: blur(30px); pointer-events: none; }
    .nv-layer-full, .nv-layer { position: absolute; left: 0; width: 100%; top: 50%; translate: 0 -50%; will-change: transform, opacity; }
    .nv-layer-full { filter: drop-shadow(0 30px 40px rgba(0, 0, 0, .55)); pointer-events: none; }
    .nv-layer { opacity: 0; pointer-events: none; }
    .nv-layer img { display: block; width: 100%; max-width: none; transition: filter .7s var(--nv-ease); filter: drop-shadow(0 30px 40px rgba(0, 0, 0, .55)); }
    .nv-layer.is-dim img { filter: brightness(.3) saturate(.4) drop-shadow(0 30px 40px rgba(0, 0, 0, .55)); }
    .nv-layer.is-active img { filter: brightness(1.06) drop-shadow(0 0 26px rgba(205, 174, 85, .35)) drop-shadow(0 30px 40px rgba(0, 0, 0, .55)); }
    .nv-hot {
      position: absolute; right: -3%; top: 46%; width: 42px; height: 42px; border-radius: 50%; pointer-events: auto;
      display: flex; align-items: center; justify-content: center; font-size: .66rem; letter-spacing: .12em; font-weight: 600;
      color: var(--nv-gold-2); background: rgba(13, 13, 13, .72); border: 1px solid rgba(205, 174, 85, .7); backdrop-filter: blur(6px);
      cursor: pointer; opacity: 0; transition: background .4s, color .4s, transform .4s var(--nv-ease);
    }
    .nv-hot::after { content: ''; position: absolute; inset: -6px; border-radius: 50%; border: 1px solid rgba(205, 174, 85, .5); animation: nvPulse 2.4s ease-out infinite; }
    .nv-hot:hover { transform: scale(1.1); }
    .nv-layer.is-active .nv-hot { background: var(--nv-gold-2); color: var(--nv-black); }
    .nv-layer.is-active .nv-hot::after { animation: none; opacity: 0; }
    @keyframes nvPulse { 0% { transform: scale(.85); opacity: .9; } 100% { transform: scale(1.5); opacity: 0; } }
    .nv-layer-captions { position: absolute; left: max(24px, 6vw); bottom: 11vh; z-index: 3; width: min(380px, 34vw); height: 170px; }
    .nv-layer-captions > * { position: absolute; left: 0; right: 0; bottom: 0; opacity: 0; transform: translateY(16px); transition: opacity .6s var(--nv-ease), transform .6s var(--nv-ease); pointer-events: none; }
    .nv-layer-captions > .is-on { opacity: 1; transform: none; }
    .nv-layer-hint { display: flex; align-items: center; gap: 12px; font-size: .72rem; letter-spacing: .26em; text-transform: uppercase; color: rgba(252, 249, 245, .6); }
    .nv-hint-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--nv-gold-2); box-shadow: 0 0 0 0 rgba(205,174,85,.6); animation: nvDot 2s infinite; }
    @keyframes nvDot { 0% { box-shadow: 0 0 0 0 rgba(205,174,85,.6); } 100% { box-shadow: 0 0 0 12px rgba(205,174,85,0); } }
    .nv-cap .nv-num { font-size: .7rem; letter-spacing: .3em; color: var(--nv-gold-2); }
    .nv-cap h3 { font-family: 'Inter', sans-serif; font-weight: 700; letter-spacing: -.03em; font-size: clamp(1.5rem, 2.4vw, 2.2rem); margin-top: .5rem; color: var(--nv-white); }
    .nv-cap p { color: rgba(252, 249, 245, .66); margin-top: .6rem; line-height: 1.6; }

    /* ---------- 5. Prueba de resortes ---------- */
    #nv-springs { padding: clamp(80px, 14vh, 160px) 0; background: var(--nv-black-2); }
    .nv-springs-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: 5fr 7fr; gap: clamp(32px, 5vw, 80px); align-items: center; }
    .nv-toggle { display: inline-flex; margin-top: 2rem; padding: 4px; border-radius: 980px; background: rgba(252, 249, 245, .06); border: 1px solid rgba(252, 249, 245, .12); }
    .nv-toggle button { padding: .65rem 1.2rem; border-radius: 980px; font-size: .88rem; font-weight: 600; color: rgba(252, 249, 245, .7); cursor: pointer; transition: background .4s, color .4s; }
    .nv-toggle button.is-on { background: var(--nv-gold); color: #fff; }
    .nv-meter { margin-top: 2rem; max-width: 420px; }
    .nv-meter-label { display: flex; justify-content: space-between; align-items: baseline; font-size: .82rem; color: rgba(252, 249, 245, .7); }
    .nv-meter-label b { font-size: 1.4rem; color: var(--nv-gold-2); font-variant-numeric: tabular-nums; }
    .nv-meter-bar { height: 4px; border-radius: 4px; background: rgba(252, 249, 245, .1); margin-top: .6rem; overflow: hidden; }
    .nv-meter-bar i { display: block; height: 100%; width: 0%; background: linear-gradient(90deg, var(--nv-gold), var(--nv-gold-2)); border-radius: 4px; }
    .nv-springs-bed { position: relative; aspect-ratio: 1.45 / 1; border-radius: 28px; overflow: hidden; background: radial-gradient(ellipse at 50% 40%, #24221d, #121110); border: 1px solid rgba(205, 174, 85, .18); touch-action: pan-y; }
    #nv-springs-canvas { position: absolute; inset: 0; width: 100%; height: 100%; cursor: none; }
    .nv-bed-tag { position: absolute; top: 18px; font-size: .62rem; letter-spacing: .3em; text-transform: uppercase; color: rgba(252, 249, 245, .6); padding: .4rem .8rem; border-radius: 980px; border: 1px solid rgba(252, 249, 245, .15); background: rgba(13, 13, 13, .5); pointer-events: none; }
    .nv-bed-you { left: 18px; }
    .nv-bed-partner { right: 18px; }

    /* ---------- 6. Colección horizontal ---------- */
    #nv-collection { overflow: hidden; }
    .nv-collection-pin { position: relative; height: 100svh; display: flex; align-items: center; }
    .nv-collection-head { position: absolute; left: max(24px, 6vw); top: 12vh; z-index: 2; }
    .nv-collection-track { display: flex; gap: clamp(18px, 2.4vw, 36px); padding-left: max(24px, 6vw); padding-right: 12vw; padding-top: 22vh; will-change: transform; }
    .nv-pcard { position: relative; flex: 0 0 auto; width: clamp(240px, min(30vw, 50vh), 440px); cursor: pointer; }
    .nv-pcard:first-child { margin-left: clamp(0px, 34vw, 520px); }
    .nv-pcard-media { position: relative; aspect-ratio: 4 / 5; border-radius: 24px; overflow: hidden; background: var(--nv-black-2); }
    .nv-pcard-media img { position: absolute; inset: -8% -8%; width: 116%; height: 116%; max-width: none; object-fit: cover; transition: transform 1.2s var(--nv-ease); will-change: transform; }
    .nv-pcard:hover .nv-pcard-media img { transform: scale(1.06); }
    .nv-pcard-media::after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(13,13,13,.55), transparent 45%); }
    .nv-pcard-idx { position: absolute; top: 16px; left: 18px; z-index: 2; font-size: .68rem; letter-spacing: .3em; color: rgba(252, 249, 245, .85); }
    .nv-pcard-info { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; margin-top: 1rem; }
    .nv-pcard-info h3 { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 1.35rem; letter-spacing: -.03em; color: var(--nv-white); }
    .nv-pcard-info p { font-size: .68rem; letter-spacing: .26em; text-transform: uppercase; color: var(--nv-gold-2); margin-bottom: .3rem; }
    .nv-pcard-price { font-size: .9rem; color: rgba(252, 249, 245, .7); white-space: nowrap; }

    /* ---------- 7. Marquesina ---------- */
    #nv-marquee { padding: clamp(48px, 9vh, 96px) 0; border-top: 1px solid rgba(205,174,85,.18); border-bottom: 1px solid rgba(205,174,85,.18); overflow: hidden; background: var(--nv-black); }
    .nv-marquee-row { overflow: hidden; white-space: nowrap; }
    .nv-marquee-inner { display: inline-flex; align-items: center; gap: clamp(28px, 3.5vw, 56px); padding-right: clamp(28px, 3.5vw, 56px); will-change: transform; }
    .nv-marquee-inner span { font-family: 'Inter', sans-serif; font-weight: 300; text-transform: uppercase; letter-spacing: .32em; font-size: clamp(1rem, 2.2vw, 1.9rem); line-height: 1.4; color: rgba(252, 249, 245, .78); }
        .nv-marquee-inner em { font-style: normal; color: var(--nv-gold-2); font-size: clamp(.7rem, 1.2vw, 1rem); }

    /* ---------- 8. Por qué Nuvela ---------- */
    #nv-why { padding: clamp(80px, 14vh, 160px) 0; }
    .nv-why-head { max-width: 760px; }
    .nv-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 3.5rem; perspective: 1000px; }
    .nv-card {
      --mx: 50%; --my: 50%;
      position: relative; padding: 2.2rem 2rem 2.4rem; border-radius: 24px; overflow: hidden;
      background: linear-gradient(160deg, rgba(252,249,245,.05), rgba(252,249,245,.015));
      border: 1px solid rgba(252, 249, 245, .09); transform-style: preserve-3d; will-change: transform;
      transition: border-color .5s;
    }
    .nv-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(420px circle at var(--mx) var(--my), rgba(205, 174, 85, .18), transparent 45%); opacity: 0; transition: opacity .5s; pointer-events: none; }
    .nv-card:hover { border-color: rgba(205, 174, 85, .4); }
    .nv-card:hover::before { opacity: 1; }
    .nv-card-num { font-size: .7rem; letter-spacing: .3em; color: var(--nv-gold-2); }
    .nv-card h3 { font-family: 'Inter', sans-serif; font-weight: 700; letter-spacing: -.03em; font-size: 1.45rem; margin-top: 2.6rem; color: var(--nv-white); }
    .nv-card p { color: rgba(252, 249, 245, .62); line-height: 1.6; margin-top: .7rem; font-size: .96rem; }

    /* ---------- 9. Testimonio ---------- */
    #nv-voice { padding: clamp(100px, 18vh, 200px) 0; background: var(--nv-black-2); text-align: center; }
    .nv-voice-inner { max-width: 1100px; }
    .nv-quote-mark { font-family: 'Cormorant Garamond', serif; font-size: clamp(6rem, 14vw, 11rem); line-height: .6; color: var(--nv-gold); display: block; height: .5em; }
    .nv-voice-text { font-family: 'Inter', sans-serif; font-weight: 600; letter-spacing: -.035em; font-size: clamp(1.6rem, 3.8vw, 3.4rem); line-height: 1.15; margin-top: 1.5rem; }
    .nv-voice-name { margin-top: 2.4rem; }

    /* ---------- 10. Galería ---------- */
    #nv-gallery { padding: clamp(80px, 14vh, 160px) 0 clamp(120px, 20vh, 220px); }
    .nv-gallery-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; }
    .nv-gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(14px, 2vw, 28px); margin-top: 4rem; }
    .nv-g { display: block; border-radius: 22px; overflow: hidden; aspect-ratio: 4 / 5; will-change: transform; }
    .nv-g:nth-child(3n+2) { margin-top: 12vh; }
    .nv-g img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.4s var(--nv-ease), filter .8s; filter: saturate(.85); }
    .nv-g:hover img { transform: scale(1.07); filter: saturate(1); }

    /* ---------- 11. Cierre ---------- */
    #nv-final { min-height: 100svh; display: flex; align-items: center; justify-content: center; overflow: hidden; text-align: center; }
    #nv-final-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
    .nv-final-inner { position: relative; z-index: 2; padding: 0 24px; }

    /* ---------- Teléfono ---------- */
    @media (max-width: 900px) {
      .nv-springs-inner { grid-template-columns: 1fr; }
      .nv-springs-bed { aspect-ratio: 0.95 / 1; border-radius: 22px; }
      .nv-toggle button { font-size: .78rem; padding: .6rem .85rem; white-space: nowrap; }
      .nv-why-grid { grid-template-columns: 1fr; }
      .nv-gallery-grid { grid-template-columns: repeat(2, 1fr); }
      .nv-g:nth-child(3n+2) { margin-top: 0; }
      .nv-g:nth-child(2n) { margin-top: 8vh; }
      .nv-stats { grid-template-columns: repeat(2, 1fr); row-gap: 20px; }
      .nv-reveal-content { padding-bottom: 4vh; }
      .nv-layers-head { top: 8vh; }
      .nv-layers-stage { left: 48%; top: 50%; width: min(80vw, 38svh); }
      .nv-hot { right: -6%; width: 36px; height: 36px; }
      .nv-layer-captions { width: auto; right: 88px; bottom: 5vh; height: 150px; }
      .nv-collection-pin { height: auto; display: block; padding: 90px 0 60px; }
      .nv-collection-head { position: static; padding: 0 24px; }
      .nv-collection-track { padding-top: 40px; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
      .nv-collection-track::-webkit-scrollbar { display: none; }
      .nv-pcard { width: 76vw; scroll-snap-align: start; }
      .nv-pcard:first-child { margin-left: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .nv-w { opacity: 1 !important; }
      .nv-hero-eyebrow, .nv-hero-sub, .nv-hero-tagline, .nv-hero-actions > *, .nv-hero-photo img { opacity: 1 !important; }
      #nv-grain { display: none; }
    }

    /* Respaldo: si las librerías de animación no cargan, todo se ve fijo. */
    .nv-static #nv-intro { display: none; }
    .nv-static .nv-w, .nv-static .nv-reveal-copy, .nv-static .nv-stats, .nv-static .nv-reveal-scrim,
    .nv-static .nv-hero-eyebrow, .nv-static .nv-hero-sub, .nv-static .nv-hero-tagline,
    .nv-static .nv-hero-actions > *, .nv-static .nv-hero-photo img { opacity: 1 !important; }
    .nv-static .nv-reveal-media { clip-path: none; }
    .nv-static .nv-reveal-media img { transform: none; }
    .nv-static .nv-layer { display: none; }
    .nv-static .nv-layer-captions { position: static; width: auto; height: auto; padding: 0 24px 60px; display: grid; gap: 24px; }
    .nv-static .nv-layer-captions > * { position: static; opacity: 1; transform: none; }
    .nv-static .nv-layer-hint { display: none; }
    .nv-static .nv-layers-pin { height: auto; min-height: 100svh; }
    .nv-static .nv-layers-stage { position: relative; left: auto; top: auto; translate: none; margin: 30vh auto 40px; }
    .nv-static .nv-collection-track { overflow-x: auto; }

    /* Navbar que se esconde al bajar y aparece al subir (solo en el home) */
    body.nv-on-home #navbar { transition: transform .6s var(--nv-ease), box-shadow .3s; }
    body.nv-on-home.nv-nav-hidden #navbar { transform: translateY(-110%); }
    /* Tarjeta final "Ver catálogo completo" del carrusel */
    .nv-pcard-more .nv-pcard-media { display: flex; align-items: center; justify-content: center; text-align: center; padding: 24px; border: 1px solid rgba(205, 174, 85, .45); background: radial-gradient(ellipse at center, rgba(205,174,85,.16), transparent 70%), var(--nv-black-2); }
    .nv-pcard-more .nv-pcard-media::after { display: none; }
    .nv-pcard-more span { font-family: 'Inter', sans-serif; font-weight: 700; letter-spacing: -.03em; font-size: clamp(1.4rem, 2.2vw, 2rem); color: var(--nv-gold-2); }

    /* Botón secundario del hero: fondo oscuro para que se lea sobre el colchón */
    #nv-hero .nv-btn-ghost, #nv-final .nv-btn-ghost { background: rgba(13, 13, 13, .55); border-color: rgba(252, 249, 245, .45); }
    /* Pantallas bajas (laptops): todo el texto del hero más compacto para que se vea el logo del colchón */
    @media (max-height: 760px) and (min-width: 901px) {
      .nv-hero-copy { padding-top: 3vh; }
      .nv-wordmark-slot { height: clamp(56px, min(15vw, 17vh), 210px); }
      .nv-hero-tagline { margin-top: .7rem; font-size: 1.15rem; }
      .nv-hero-actions { margin-top: 1.1rem; }
      .nv-hero-actions .btn-gold, .nv-hero-actions .nv-btn-ghost { padding: .7rem 1.5rem; font-size: .92rem; }
      .nv-scroll-cue { display: none; }
      .nv-hero-photo { width: min(1150px, 120vw, 125vh); bottom: -9%; }
    }

    /* Sombra suave detrás del texto del hero para que siempre se lea */
    .nv-hero-copy::before { content: ''; position: absolute; left: 50%; top: 62%; width: min(820px, 92vw); height: 62%; translate: -50% -50%; background: radial-gradient(ellipse at center, rgba(13, 13, 13, .78), rgba(13, 13, 13, 0) 70%); z-index: -1; pointer-events: none; }
  `;

/* Colores y tipografías de Tailwind (igual que el sitio HTML) */
function applyTailwindConfig() {
  const tailwind = window.tailwind;

    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'gold': '#B8963E',
            'gold-light': '#D4B665',
            'gold-dark': '#8E7430',
            'graphite': '#3D3D3D',
            'mist': '#9E9E9E',
            'cream': '#FAF8F3',
            'pearl': '#F5F1E8',
            'ink': '#1A1A1A',
          },
          fontFamily: {
            'serif': ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
            'sans': ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
          },
          letterSpacing: {
            'luxe': '0.18em',
            'wider-luxe': '0.32em',
          },
        }
      }
    };
  
}

/* =================== Páginas (contenido) =================== */
/* ---------- Intro de carga, barra superior, menú, menú móvil, aviso del carrito, quiz y popup ---------- */
function Chrome() {
  return (
    <>
      {/* ===== HOME INMERSIVO: intro de carga, barra de progreso y cursor ===== */}
      {/* La intro solo se ve al abrir el sitio (la primera vez en la sesión es */}
      {/* más larga). Ver NV.intro() en el <script> "HOME INMERSIVO". */}
      <div id="nv-intro" aria-hidden="true">
        {' '}
        <div className="nv-intro-center">
          {' '}
          <div className="nv-intro-word">
            <span>
              {"N"}
            </span>
            <span>
              {"U"}
            </span>
            <span>
              {"V"}
            </span>
            <span>
              {"E"}
            </span>
            <span>
              {"L"}
            </span>
            <span>
              {"A"}
            </span>
          </div>
          {' '}
          <div className="nv-intro-line">
            <i>
            </i>
          </div>
          {' '}
          <div className="nv-intro-meta">
            <span>
              {"Italian Design"}
            </span>
            <span id="nv-intro-num">
              {"000"}
            </span>
          </div>
          {' '}
        </div>
        {' '}
      </div>
      <div id="nv-progress" aria-hidden="true">
        <i>
        </i>
      </div>
      <div id="nv-cursor" aria-hidden="true">
        <span>
        </span>
      </div>
      <div id="nv-grain" aria-hidden="true">
      </div>
      {/* Rastro de estrellas del cursor — ver #star-trail-canvas / initStarTrail() */}
      <canvas id="star-trail-canvas" aria-hidden="true">
      </canvas>
      {/* =================== TOP BAR =================== */}
      <div className="hidden md:block w-full bg-ink text-cream text-[0.68rem] tracking-[0.32em] uppercase">
        {' '}
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          {' '}
          <span data-en="Nationwide delivery in Guatemala · From Q300" data-es="Envíos a todo Guatemala · Desde Q300">
            {"Envíos a todo Guatemala · Desde Q300"}
          </span>
          {' '}
          <span className="text-gold-light" data-en="10-Year Warranty · ISO 9001 · OEKO-TEX®" data-es="Garantía 10 años · ISO 9001 · OEKO-TEX®">
            {"Garantía 10 años · ISO 9001 · OEKO-TEX®"}
          </span>
          {' '}
        </div>
        {' '}
      </div>
      {/* =================== NAVBAR =================== */}
      <header id="navbar" className="sticky top-0 z-50 bg-[#0D0D0D] backdrop-blur-md border-b border-white/10 transition-all">
        {' '}
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {' '}
          {/* Logo */}
          {' '}
          <a href="#home" data-page="home" className="flex items-center">
            {' '}
            <img src="images/logo-navbar-blanco.png" alt="Nuvela Logo" className="h-10 w-auto md:h-14 lg:h-16" />
            {' '}
          </a>
          {' '}
          {/* Desktop nav */}
          {' '}
          {/* Consolidado: se dejan visibles solo los enlaces de mayor uso/conversión; */}
          {' '}
          {/* el resto vive en las subpestañas "Productos" y "Más" para aligerar el menú. */}
          {' '}
          <nav className="hidden lg:flex items-center gap-9">
            {' '}
            <a className="nav-link" data-page="home" data-en="Home" data-es="Inicio">
              {"Inicio"}
            </a>
            {' '}
            <div className="relative group">
              {' '}
              <a className="nav-link inline-flex items-center gap-1" data-page="producto">
                {' '}
                <span data-en="Products" data-es="Productos">
                  {"Productos"}
                </span>
                {' '}
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 opacity-70">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {' '}
              </a>
              {' '}
              {/* Subpestaña de productos: aparece al pasar el cursor sobre "Productos" */}
              {' '}
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                {' '}
                <div className="js-nav-products-list bg-[#0D0D0D] border border-white/10 min-w-[260px] max-h-[70vh] overflow-y-auto py-2 shadow-2xl">
                  {' '}
                  {/* injected by renderNavProductsDropdown() */}
                  {' '}
                </div>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
            <a className="nav-link" data-page="linea-hotelera" data-en="Hotel Line" data-es="Línea para Hoteles">
              {"Línea para Hoteles"}
            </a>
            {' '}
            {/* Eduardo pidio quitar el link de texto "Mi Carrito" de aqui --
             quedaba duplicado con el icono del carrito que ya esta siempre
             visible a la derecha (ver boton con id="cart-badge" mas abajo). */}
            {' '}
            <a className="nav-link" data-page="cita" data-en="Book an Appointment" data-es="Agenda tu Cita">
              {"Agenda tu Cita"}
            </a>
            {' '}
            <a className="nav-link nv-nav-sorteo" data-page="sorteo" data-en="Giveaway" data-es="Sorteo Nuvela">
              {"Sorteo Nuvela"}
            </a>
            {' '}
            <div className="relative group">
              {' '}
              <a className="nav-link inline-flex items-center gap-1 cursor-default">
                {' '}
                <span data-en="More" data-es="Más">
                  {"Más"}
                </span>
                {' '}
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 opacity-70">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {' '}
              </a>
              {' '}
              {/* Subpestaña "Más": historia, tecnología, entregas, reseñas, FAQ y contacto */}
              {' '}
              {/* (Comparar Productos vive ahora dentro de la subpestaña "Productos") */}
              {' '}
              <div className="absolute right-0 top-full pt-4 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                {' '}
                <div className="bg-[#0D0D0D] border border-white/10 min-w-[220px] py-2 shadow-2xl">
                  {' '}
                  <a className="block px-5 py-2.5 text-sm text-cream/90 hover:text-gold hover:bg-white/5 transition-colors cursor-pointer" data-page="historia" data-en="Story" data-es="Historia">
                    {"Historia"}
                  </a>
                  {' '}
                  <a className="block px-5 py-2.5 text-sm text-cream/90 hover:text-gold hover:bg-white/5 transition-colors cursor-pointer" data-page="tecnologia" data-en="Technology" data-es="Tecnología">
                    {"Tecnología"}
                  </a>
                  {' '}
                  <a className="block px-5 py-2.5 text-sm text-cream/90 hover:text-gold hover:bg-white/5 transition-colors cursor-pointer" data-page="entregas" data-en="Delivery" data-es="Entregas">
                    {"Entregas"}
                  </a>
                  {' '}
                  <a className="block px-5 py-2.5 text-sm text-cream/90 hover:text-gold hover:bg-white/5 transition-colors cursor-pointer" data-page="resenas" data-en="Reviews" data-es="Reseñas">
                    {"Reseñas"}
                  </a>
                  {' '}
                  <a className="block px-5 py-2.5 text-sm text-cream/90 hover:text-gold hover:bg-white/5 transition-colors cursor-pointer" data-page="faq" data-en="FAQ" data-es="FAQ">
                    {"FAQ"}
                  </a>
                  {' '}
                  <a className="block px-5 py-2.5 text-sm text-cream/90 hover:text-gold hover:bg-white/5 transition-colors cursor-pointer" data-page="contacto" data-en="Contact" data-es="Contáctanos">
                    {"Contáctanos"}
                  </a>
                  {' '}
                </div>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </nav>
          {' '}
          <div className="flex items-center gap-4">
            {' '}
            {/* Lang toggle */}
            {' '}
            <div className="hidden md:flex items-center text-[0.7rem] tracking-[0.22em] uppercase font-medium">
              {' '}
              <button id="lang-es" className="lang-btn px-2 py-1 text-gold">
                {"ES"}
              </button>
              {' '}
              <span className="text-mist">
                {"/"}
              </span>
              {' '}
              <button id="lang-en" className="lang-btn px-2 py-1 text-mist">
                {"EN"}
              </button>
              {' '}
            </div>
            {' '}
            {/* Shop CTA */}
            {' '}
            <button data-page="producto" className="hidden md:inline-flex btn-gold !py-2.5 !px-5 !text-[0.7rem]" data-en="Shop Now" data-es="Comprar">
              {"Comprar"}
            </button>
            {' '}
            {/* Cart icon (always visible, so it's reachable even with the menu closed) */}
            {' '}
            <button data-page="carrito" className="relative p-2 text-white" aria-label="Carrito">
              {' '}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 6h15l-1.5 9h-12L6 6Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 6 5 3H2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9.5" cy="20" r="1.3" fill="currentColor" stroke="none" />
                <circle cx="17" cy="20" r="1.3" fill="currentColor" stroke="none" />
              </svg>
              {' '}
              <span id="cart-badge" className="hidden absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-gold text-white text-[0.6rem] font-bold flex items-center justify-center leading-none">
                {"0"}
              </span>
              {' '}
            </button>
            {' '}
            {/* Mobile burger */}
            {' '}
            <button id="burger" className="lg:hidden flex flex-col gap-[5px] p-2" aria-label="Menu">
              {' '}
              <span className="block w-6 h-px bg-white">
              </span>
              {' '}
              <span className="block w-6 h-px bg-white">
              </span>
              {' '}
              <span className="block w-4 h-px bg-white ml-auto">
              </span>
              {' '}
            </button>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
      </header>
      {/* Mobile drawer */}
      <div id="drawer" className="drawer fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[60] shadow-2xl overflow-y-auto">
        {' '}
        <div className="p-6 flex items-center justify-between border-b border-pearl">
          {' '}
          <img src="images/logo-navbar-negro.png" alt="Nuvela" className="h-14 w-auto" onError={(e) => { (function () { this.style.display='none'; this.nextElementSibling.style.display='flex'; }).call(e.currentTarget); }} />
          {' '}
          <div className="flex-col" style={{ "display": "none" }}>
            {' '}
            <span className="wordmark text-ink text-lg">
              {"NUVELA"}
            </span>
            {' '}
            <span className="wordmark-sub mt-0.5">
              {"Italian Design"}
            </span>
            {' '}
          </div>
          {' '}
          <button id="drawer-close" className="text-2xl text-ink leading-none">
            {"×"}
          </button>
          {' '}
        </div>
        {' '}
        <nav className="flex flex-col py-4">
          {' '}
          <a className="drawer-link px-6 py-4 border-b border-pearl text-sm tracking-[0.22em] uppercase font-medium" data-page="home" data-en="Home" data-es="Inicio">
            {"Inicio"}
          </a>
          {' '}
          <a className="drawer-link nv-drawer-sorteo px-6 py-4 border-b border-pearl text-sm tracking-[0.22em] uppercase font-medium" data-page="sorteo" data-en="Nuvela Giveaway" data-es="Sorteo Nuvela">
            {"Sorteo Nuvela"}
          </a>
          {' '}
          <a className="drawer-link px-6 py-4 border-b border-pearl text-sm tracking-[0.22em] uppercase font-medium" data-page="historia" data-en="Story" data-es="Historia">
            {"Historia"}
          </a>
          {' '}
          <a className="drawer-link px-6 py-4 border-b border-pearl text-sm tracking-[0.22em] uppercase font-medium" data-page="producto" data-en="Products" data-es="Productos">
            {"Productos"}
          </a>
          {' '}
          <a className="drawer-link px-6 py-4 border-b border-pearl text-sm tracking-[0.22em] uppercase font-medium" data-page="linea-hotelera" data-en="Hotel Line" data-es="Línea para Hoteles">
            {"Línea para Hoteles"}
          </a>
          {' '}
          <a className="drawer-link px-6 py-4 border-b border-pearl text-sm tracking-[0.22em] uppercase font-medium" data-page="comparar" data-en="Compare Products" data-es="Comparar Productos">
            {"Comparar Productos"}
          </a>
          {' '}
          <a className="drawer-link px-6 py-4 border-b border-pearl text-sm tracking-[0.22em] uppercase font-medium" data-page="tecnologia" data-en="Technology" data-es="Tecnología">
            {"Tecnología"}
          </a>
          {' '}
          <a className="drawer-link px-6 py-4 border-b border-pearl text-sm tracking-[0.22em] uppercase font-medium flex items-center justify-between" data-page="carrito">
            <span data-en="My Cart" data-es="Mi Carrito">
              {"Mi Carrito"}
            </span>
            <span id="cart-badge-drawer" className="hidden min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-white text-[0.6rem] font-bold flex items-center justify-center leading-none">
              {"0"}
            </span>
          </a>
          {' '}
          <a className="drawer-link px-6 py-4 border-b border-pearl text-sm tracking-[0.22em] uppercase font-medium" data-page="entregas" data-en="Delivery" data-es="Entregas">
            {"Entregas"}
          </a>
          {' '}
          <a className="drawer-link px-6 py-4 border-b border-pearl text-sm tracking-[0.22em] uppercase font-medium" data-page="cita" data-en="Book an Appointment" data-es="Agenda tu Cita">
            {"Agenda tu Cita"}
          </a>
          {' '}
          <a className="drawer-link px-6 py-4 border-b border-pearl text-sm tracking-[0.22em] uppercase font-medium" data-page="resenas" data-en="Reviews" data-es="Reseñas">
            {"Reseñas"}
          </a>
          {' '}
          <a className="drawer-link px-6 py-4 border-b border-pearl text-sm tracking-[0.22em] uppercase font-medium" data-page="faq" data-en="FAQ" data-es="FAQ">
            {"FAQ"}
          </a>
          {' '}
          <a className="drawer-link px-6 py-4 border-b border-pearl text-sm tracking-[0.22em] uppercase font-medium" data-page="contacto" data-en="Contact" data-es="Contáctanos">
            {"Contáctanos"}
          </a>
          {' '}
        </nav>
        {' '}
        <div className="p-6 flex items-center gap-4 border-t border-pearl">
          {' '}
          <span className="text-xs tracking-[0.2em] uppercase text-mist" data-en="Language" data-es="Idioma">
            {"Idioma"}
          </span>
          {' '}
          <button id="lang-es-m" className="lang-btn-m text-xs tracking-[0.2em] uppercase text-gold">
            {"ES"}
          </button>
          {' '}
          <span className="text-mist">
            {"/"}
          </span>
          {' '}
          <button id="lang-en-m" className="lang-btn-m text-xs tracking-[0.2em] uppercase text-mist">
            {"EN"}
          </button>
          {' '}
        </div>
        {' '}
      </div>
      <div id="drawer-overlay" className="fixed inset-0 bg-ink/40 z-[55] hidden">
      </div>
      {/* Toast "Agregado al carrito" -- ver comentario de #cart-toast en el */}
      {/* Ver el bloque de estilos de arriba. Texto dinamico lo pone showCartToast() en JS. */}
      <div id="cart-toast" role="status" aria-live="polite">
        {' '}
        <div className="flex items-start gap-3">
          {' '}
          <span className="text-gold text-lg leading-none mt-0.5">
            {"✓"}
          </span>
          {' '}
          <div className="flex-1 min-w-0">
            {' '}
            <p id="cart-toast-text" className="text-sm font-medium text-ink">
              {"Agregado al carrito"}
            </p>
            {' '}
            <div className="flex gap-2 mt-3">
              {' '}
              <button type="button" data-page="carrito" className="js-cart-toast-review flex-1 !py-2 !text-xs btn-gold" data-en="View Cart" data-es="Revisar Carrito">
                {"Revisar Carrito"}
              </button>
              {' '}
              <button type="button" className="js-cart-toast-continue flex-1 !py-2 !text-xs btn-outline" data-en="Keep Shopping" data-es="Seguir Comprando">
                {"Seguir Comprando"}
              </button>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
      </div>
      {/* ====================================================== */}
      {/* =================== PRODUCT QUIZ ====================== */}
      {/* ====================================================== */}
      <div id="quiz-overlay" className="fixed inset-0 z-[90] hidden">
        {' '}
        <div id="quiz-overlay-backdrop" className="absolute inset-0 bg-ink/60">
        </div>
        {' '}
        <div className="relative h-full w-full flex items-center justify-center p-4 sm:p-6">
          {' '}
          <div className="relative bg-white border-2 border-gold w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-10 rounded-3xl">
            {' '}
            <button type="button" id="quiz-close-btn" className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-ink hover:text-gold" aria-label="Cerrar">
              {' '}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
              {' '}
            </button>
            {' '}
            <p id="quiz-eyebrow" className="eyebrow text-center">
            </p>
            {' '}
            <div className="max-w-xs mx-auto mt-3 h-1 bg-pearl">
              {' '}
              <div id="quiz-progress-fill" className="h-1 bg-gold transition-all duration-300" style={{ "width": "0%" }}>
              </div>
              {' '}
            </div>
            {' '}
            <div id="quiz-body" className="mt-10">
              {/* injected by renderQuiz() */}
            </div>
            {' '}
            <div id="quiz-footer" className="flex items-center justify-between mt-10 pt-6 border-t border-pearl">
              {' '}
              <button type="button" id="quiz-back-btn" className="btn-outline !px-6" data-en="Back" data-es="Atrás">
                {"Atrás"}
              </button>
              {' '}
              <button type="button" id="quiz-next-btn" className="btn-gold !px-8 ml-auto" data-en="Next" data-es="Siguiente">
                {"Siguiente"}
              </button>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
      </div>
      {/* ====================================================== */}
      {/* ============ POPUP: CAPTURA DE LEADS =================== */}
      {/* ====================================================== */}
      {/* Eduardo pidió un popup que aparezca al cargar la página pidiendo */}
      {/* nombre, apellido y correo, para ir armando una base de datos de */}
      {/* clientes. Aparece UNA sola vez por visitante (se recuerda con */}
      {/* localStorage, ver initLeadPopup() en el <script> de abajo) -- ni al */}
      {/* cerrarlo ni al enviarlo vuelve a aparecer en ese navegador. */}
      {/*  */}
      {/* IMPORTANTE PARA EDUARDO: todavía falta conectar esto a tu Google */}
      {/* Sheet real -- pega la URL de tu Google Apps Script en la constante */}
      {/* LEADS_WEBHOOK_URL (búscala en el <script> de abajo). Instrucciones */}
      {/* completas en el chat. */}
      <div id="lead-popup-overlay" className="fixed inset-0 z-[95] hidden">
        {' '}
        <div id="lead-popup-backdrop" className="absolute inset-0 bg-ink/60">
        </div>
        {' '}
        <div className="relative h-full w-full flex items-center justify-center p-4 sm:p-6">
          {' '}
          <div className="relative bg-white border-2 border-gold w-full max-w-md max-h-[90vh] overflow-y-auto p-8 sm:p-10 rounded-3xl">
            {' '}
            <button type="button" id="lead-popup-close" className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-ink hover:text-gold" aria-label="Cerrar">
              {' '}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
              {' '}
            </button>
            {' '}
            <div id="lead-popup-form-wrap">
              {' '}
              <p className="eyebrow text-gold-light" data-en="Stay in Touch" data-es="Mantente al Tanto">
                {"Mantente al Tanto"}
              </p>
              {' '}
              <span className="gold-rule mt-4">
              </span>
              {' '}
              <h3 className="font-serif text-2xl sm:text-3xl text-ink mt-6 leading-tight" data-en="Want to receive more information?" data-es="¿Quieres recibir más información?">
                {"¿Quieres recibir más información?"}
              </h3>
              {' '}
              <p className="text-graphite mt-3 leading-relaxed text-sm" data-en="Leave us your details and we'll keep you posted on new products, promotions and news from Nuvela." data-es="Déjanos tus datos y te mantendremos al tanto de nuevos productos, promociones y novedades de Nuvela.">
                {"Déjanos tus datos y te mantendremos al tanto de nuevos productos, promociones y novedades de Nuvela."}
              </p>
              {' '}
              <form id="lead-popup-form" className="mt-8 space-y-5" noValidate>
                <div className="grid grid-cols-2 gap-4">
                  {' '}
                  <input className="luxe-input" type="text" id="lead-popup-nombre" required placeholder="" data-en-placeholder="First name" data-es-placeholder="Nombre" />
                  {' '}
                  <input className="luxe-input" type="text" id="lead-popup-apellido" required placeholder="" data-en-placeholder="Last name" data-es-placeholder="Apellido" />
                  {' '}
                </div>
                <input className="luxe-input" type="email" id="lead-popup-correo" required placeholder="" data-en-placeholder="Email" data-es-placeholder="Correo electrónico" />
                <p id="lead-popup-error" className="hidden text-sm" style={{ "color": "#B3261E" }} data-en="Please fill in all fields with a valid email." data-es="Completa todos los campos con un correo válido.">
                  {"Completa todos los campos con un correo válido."}
                </p>
                <button type="submit" id="lead-popup-submit" className="btn-gold w-full" data-en="Send" data-es="Enviar">
                  {"Enviar"}
                </button>
                <button type="button" id="lead-popup-skip" className="w-full text-center text-[0.68rem] text-mist hover:text-graphite tracking-[0.14em] uppercase mt-1" data-en="No thanks" data-es="No, gracias">
                  {"No, gracias"}
                </button>
              </form>
              {' '}
            </div>
            {' '}
            <div id="lead-popup-success" className="hidden text-center py-8">
              {' '}
              <p className="font-serif text-2xl text-ink" data-en="Thank you!" data-es="¡Gracias!">
                {"¡Gracias!"}
              </p>
              {' '}
              <p className="text-graphite mt-3 leading-relaxed text-sm" data-en="We've received your information. We'll be in touch soon." data-es="Recibimos tu información. Nos pondremos en contacto contigo pronto.">
                {"Recibimos tu información. Nos pondremos en contacto contigo pronto."}
              </p>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
      </div>
      {/* ====================================================== */}
      {/* ============ HOME INMERSIVO (rediseño 1/10/26) ======== */}
      {/* ====================================================== */}
      {/* Todo este home nuevo usa clases que empiezan con "nv-" para no */}
      {/* chocar con el resto del sitio. Las animaciones viven en el bloque */}
      {/* <script> "HOME INMERSIVO" al final del archivo (busca "NV ="). */}
      {/* Fotos que usa esta página (deben existir en la carpeta images): */}
      {/* images/hero-frontal.jpg, images/atardecer.jpg, */}
      {/* images/home/nv-capa1.webp, nv-capa3.webp, nv-capa4.webp, */}
      {/* nv-capa5.webp, nv-capa7.webp (capas del colchón sin fondo), */}
      {/* images/pareja.jpg, images/cama.jpg, images/detalle.jpg, */}
      {/* images/zipper.jpg, images/fabrica.jpg, images/entrega.jpg */}
    </>
  );
}

/* ---------- Página "home" ---------- */
function PageHome() {
  return (
    <>
      <main id="page-home" className="page active nv-home">
        {' '}
        {/* 1. HERO — el logo NUVELA está hecho de partículas doradas que */}
        {' '}
        {/* se arman solas, huyen del mouse y se dispersan al hacer scroll. */}
        {' '}
        <section id="nv-hero" className="nv-dark" aria-label="Nuvela — Duerme Bien Siempre">
          {' '}
          <canvas id="nv-hero-canvas" aria-hidden="true">
          </canvas>
          {' '}
          <div className="nv-hero-photo" aria-hidden="true">
            {' '}
            <img src="images/hero-frontal.jpg" alt="Colchón híbrido Nuvela con pillow top y lateral negro, vista frontal" />
            {' '}
          </div>
          {' '}
          <div className="nv-hero-copy">
            {' '}
            <p className="nv-eyebrow nv-hero-eyebrow" data-en="Premium Mattresses · Guatemala" data-es="Colchones Premium · Guatemala">
              {"Colchones Premium · Guatemala"}
            </p>
            {' '}
            <h1 className="sr-only" data-en="Nuvela — Premium Mattresses in Guatemala" data-es="Nuvela — Colchones Premium en Guatemala">
              {"Nuvela — Colchones Premium en Guatemala"}
            </h1>
            {' '}
            {/* Espacio reservado: aquí el canvas dibuja "NUVELA" con partículas */}
            {' '}
            <div className="nv-wordmark-slot" aria-hidden="true">
            </div>
            {' '}
            <p className="nv-hero-sub">
              {"Italian Design"}
            </p>
            {' '}
            <p className="nv-hero-tagline" data-en="Sleep well. Always." data-es="Duerme Bien Siempre.">
              {"Duerme Bien Siempre."}
            </p>
            {' '}
            <div className="nv-hero-actions">
              {' '}
              <button data-page="producto" className="btn-gold nv-magnetic" data-en="Shop Now" data-es="Comprar Ahora">
                {"Comprar Ahora"}
              </button>
              {' '}
              <button data-page="cita" className="nv-btn-ghost nv-magnetic" data-en="Visit the Showroom" data-es="Agenda tu Visita">
                {"Agenda tu Visita"}
              </button>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
          <div className="nv-scroll-cue" aria-hidden="true">
            {' '}
            <span data-en="Scroll" data-es="Desliza">
              {"Desliza"}
            </span>
            {' '}
            <i>
            </i>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* 2. MANIFIESTO — las palabras se encienden mientras haces scroll, */}
        {' '}
        {/* sobre ondas doradas generativas (cambian con el mouse). */}
        {' '}
        <section id="nv-manifesto" className="nv-dark">
          {' '}
          <canvas id="nv-waves-canvas" aria-hidden="true">
          </canvas>
          {' '}
          <div className="nv-manifesto-inner">
            {' '}
            <p className="nv-eyebrow" data-en="Manifesto" data-es="Manifiesto">
              {"Manifiesto"}
            </p>
            {' '}
            <h2 className="nv-split nv-manifesto-text" data-nv-es="No es pagar por una etiqueta. Es invertir en cómo vas a *despertar* durante los próximos *años.*" data-nv-en="It's not paying for a label. It's investing in how you'll *wake* *up* for the years to *come.*">
            </h2>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* 3. REVELACIÓN — la foto se abre de una tarjeta a pantalla completa */}
        {' '}
        <section id="nv-reveal" className="nv-dark">
          {' '}
          <div className="nv-reveal-stage">
            {' '}
            <div className="nv-reveal-media">
              {' '}
              <img src="images/atardecer.jpg" alt="Colchón Nuvela en una habitación al atardecer" />
              {' '}
              <div className="nv-reveal-scrim">
              </div>
              {' '}
            </div>
            {' '}
            {/* Texto y cifras van en una sola columna: así nunca se enciman */}
            {' '}
            <div className="nv-reveal-content">
              {' '}
              <div className="nv-reveal-copy">
                {' '}
                <p className="nv-eyebrow" data-en="The Mattress" data-es="El Colchón">
                  {"El Colchón"}
                </p>
                {' '}
                <h2 className="nv-display" data-en={"Hybrid. Premium.<br/>Yours."} data-es={"Híbrido. Premium.<br/>Tuyo."}>
                  {"Híbrido. Premium."}
                  <br />
                  {"Tuyo."}
                </h2>
                {' '}
                <p className="nv-lead" data-en="Encapsulated springs, memory foam and Ice Cooling fabric in a 30 cm build — premium rest in every detail." data-es="Resortes encapsulados, memory foam y tela Ice Cooling en 30 cm de altura — descanso premium en cada detalle.">
                  {"Resortes encapsulados, memory foam y tela Ice Cooling en 30 cm de altura — descanso premium en cada detalle."}
                </p>
                {' '}
              </div>
              {' '}
              <div className="nv-stats">
                {' '}
                <div className="nv-stat">
                  <b data-count="10">
                    {"0"}
                  </b>
                  <span data-en="Year warranty" data-es="Años de garantía">
                    {"Años de garantía"}
                  </span>
                </div>
                {' '}
                <div className="nv-stat">
                  <b data-count="30">
                    {"0"}
                  </b>
                  <span data-en="cm of height" data-es="cm de altura">
                    {"cm de altura"}
                  </span>
                </div>
                {' '}
                <div className="nv-stat">
                  <b data-count="840">
                    {"0"}
                  </b>
                  <span data-en="Springs (King)" data-es="Resortes (King)">
                    {"Resortes (King)"}
                  </span>
                </div>
                {' '}
                <div className="nv-stat">
                  <b data-count="5">
                    {"0"}
                  </b>
                  <span data-en="Premium layers" data-es="Capas premium">
                    {"Capas premium"}
                  </span>
                </div>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* 4. COLCHÓN DESARMADO — al llegar, el colchón se abre solo en capas. */}
        {' '}
        {/* Luego el visitante TOCA una capa (o su número dorado) y le dice cuál */}
        {' '}
        {/* es. Ver NV.layers en el <script> "HOME INMERSIVO". */}
        {' '}
        <section id="nv-layers" className="nv-dark">
          {' '}
          <div className="nv-layers-pin">
            {' '}
            <div className="nv-layers-head">
              {' '}
              <p className="nv-eyebrow" data-en="Inside a Nuvela" data-es="Por dentro">
                {"Por dentro"}
              </p>
              {' '}
              <h2 className="nv-h2" data-en={"What you can't see,<br/>you feel."} data-es={"Lo que no ves,<br/>lo sientes."}>
                {"Lo que no ves,"}
                <br />
                {"lo sientes."}
              </h2>
              {' '}
            </div>
            {' '}
            <div className="nv-layers-stage">
              {' '}
              <div className="nv-layers-glow" aria-hidden="true">
              </div>
              {' '}
              <img className="nv-layer-full" src="images/home/nv-capa1.webp" alt="" aria-hidden="true" />
              {' '}
              <div className="nv-layer" data-l="3">
                <img src="images/home/nv-capa5.webp" alt="Capa 4 del colchón Nuvela: base de soporte" />
                <button type="button" className="nv-hot" data-l="3" aria-label="Capa 4: base de soporte">
                  {"04"}
                </button>
              </div>
              {' '}
              <div className="nv-layer" data-l="2">
                <img src="images/home/nv-capa7.webp" alt="Capa 3 del colchón Nuvela: resortes encapsulados" />
                <button type="button" className="nv-hot" data-l="2" aria-label="Capa 3: resortes encapsulados">
                  {"03"}
                </button>
              </div>
              {' '}
              <div className="nv-layer" data-l="1">
                <img src="images/home/nv-capa4.webp" alt="Capa 2 del colchón Nuvela: memory foam de confort" />
                <button type="button" className="nv-hot" data-l="1" aria-label="Capa 2: confort memory foam">
                  {"02"}
                </button>
              </div>
              {' '}
              <div className="nv-layer" data-l="0">
                <img src="images/home/nv-capa3.webp" alt="Capa 1 del colchón Nuvela: pillow top desfundable con tela Ice Cooling" />
                <button type="button" className="nv-hot" data-l="0" aria-label="Capa 1: pillow top">
                  {"01"}
                </button>
              </div>
              {' '}
            </div>
            {' '}
            <div className="nv-layer-captions" aria-live="polite">
              {' '}
              <p className="nv-layer-hint is-on">
                <span className="nv-hint-dot">
                </span>
                <span data-en="Tap any layer to discover it" data-es="Toca una capa para descubrirla">
                  {"Toca una capa para descubrirla"}
                </span>
              </p>
              {' '}
              <div className="nv-cap" data-c="0">
                {' '}
                <span className="nv-num">
                  {"01"}
                </span>
                {' '}
                <h3 data-en="Removable pillow top" data-es="Pillow top desfundable">
                  {"Pillow top desfundable"}
                </h3>
                {' '}
                <p data-en="Ice Cooling fabric: cool to the touch and removable for washing." data-es="Tela Ice Cooling: fresca al tacto y desfundable para lavarla.">
                  {"Tela Ice Cooling: fresca al tacto y desfundable para lavarla."}
                </p>
                {' '}
              </div>
              {' '}
              <div className="nv-cap" data-c="1">
                {' '}
                <span className="nv-num">
                  {"02"}
                </span>
                {' '}
                <h3 data-en="Memory foam comfort" data-es="Confort memory foam">
                  {"Confort memory foam"}
                </h3>
                {' '}
                <p data-en="Gel memory foam plus 40D and 35D layers that contour your body and relieve pressure." data-es="Gel memory foam y capas 40D y 35D que se moldean a tu cuerpo y alivian la presión.">
                  {"Gel memory foam y capas 40D y 35D que se moldean a tu cuerpo y alivian la presión."}
                </p>
                {' '}
              </div>
              {' '}
              <div className="nv-cap" data-c="2">
                {' '}
                <span className="nv-num">
                  {"03"}
                </span>
                {' '}
                <h3 data-en="Encapsulated springs" data-es="Resortes encapsulados">
                  {"Resortes encapsulados"}
                </h3>
                {' '}
                <p data-en="Each spring works on its own, with perimeter support: localized support and less partner motion." data-es="Cada resorte trabaja solo, con soporte perimetral: soporte localizado y menos movimiento de pareja.">
                  {"Cada resorte trabaja solo, con soporte perimetral: soporte localizado y menos movimiento de pareja."}
                </p>
                {' '}
              </div>
              {' '}
              <div className="nv-cap" data-c="3">
                {' '}
                <span className="nv-num">
                  {"04"}
                </span>
                {' '}
                <h3 data-en="Support base" data-es="Base de soporte">
                  {"Base de soporte"}
                </h3>
                {' '}
                <p data-en="A stable foundation that holds the whole system together, night after night." data-es="Una base estable que sostiene todo el sistema, noche tras noche.">
                  {"Una base estable que sostiene todo el sistema, noche tras noche."}
                </p>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* 5. PRUEBA INTERACTIVA — el visitante "se acuesta" con el mouse/dedo */}
        {' '}
        {/* y ve cuánto movimiento le llega a su pareja. Simulación ilustrativa. */}
        {' '}
        <section id="nv-springs" className="nv-dark">
          {' '}
          <div className="nv-springs-inner">
            {' '}
            <div className="nv-springs-copy">
              {' '}
              <p className="nv-eyebrow" data-en="Try it" data-es="Pruébalo">
                {"Pruébalo"}
              </p>
              {' '}
              <h2 className="nv-h2" data-en={"No perception<br/>of motion."} data-es={"Sin percepción<br/>de movimiento."}>
                {"Sin percepción"}
                <br />
                {"de movimiento."}
              </h2>
              {' '}
              <p className="nv-lead" data-en="Move your cursor (or finger) over the left side of the bed. Switch to traditional springs and compare how far the motion travels." data-es="Desliza el cursor o el dedo sobre el lado izquierdo de la cama. Cambia a resortes tradicionales y compara hasta dónde llega el movimiento.">
                {"Desliza el cursor o el dedo sobre el lado izquierdo de la cama. Cambia a resortes tradicionales y compara hasta dónde llega el movimiento."}
              </p>
              {' '}
              <div className="nv-toggle" role="group" aria-label="Tipo de resortes">
                {' '}
                <button type="button" className="is-on" data-mode="nuvela" data-en="Nuvela · Encapsulated" data-es="Nuvela · Encapsulados">
                  {"Nuvela · Encapsulados"}
                </button>
                {' '}
                <button type="button" data-mode="trad" data-en="Traditional" data-es="Tradicionales">
                  {"Tradicionales"}
                </button>
                {' '}
              </div>
              {' '}
              <div className="nv-meter">
                {' '}
                <div className="nv-meter-label">
                  {' '}
                  <span data-en="Motion reaching your partner" data-es="Movimiento que llega a tu pareja">
                    {"Movimiento que llega a tu pareja"}
                  </span>
                  {' '}
                  <b id="nv-meter-val">
                    {"—"}
                  </b>
                  {' '}
                </div>
                {' '}
                <div className="nv-meter-bar">
                  <i id="nv-meter-fill">
                  </i>
                </div>
                {' '}
                <p className="nv-fineprint" data-en="Illustrative simulation." data-es="Simulación ilustrativa.">
                  {"Simulación ilustrativa."}
                </p>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
            <div className="nv-springs-bed">
              {' '}
              <canvas id="nv-springs-canvas" aria-label="Simulación interactiva de resortes">
              </canvas>
              {' '}
              <span className="nv-bed-tag nv-bed-you" data-en="You" data-es="Tú">
                {"Tú"}
              </span>
              {' '}
              <span className="nv-bed-tag nv-bed-partner" data-en="Your partner" data-es="Tu pareja">
                {"Tu pareja"}
              </span>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* 6. COLECCIÓN — carrusel horizontal que avanza con el scroll. */}
        {' '}
        {/* Las tarjetas salen solas del arreglo PRODUCTS (solo productos con */}
        {' '}
        {/* foto real). Ver NV.renderCollection(). */}
        {' '}
        <section id="nv-collection" className="nv-dark">
          {' '}
          <div className="nv-collection-pin">
            {' '}
            <div className="nv-collection-head">
              {' '}
              <p className="nv-eyebrow" data-en="The Collection" data-es="La Colección">
                {"La Colección"}
              </p>
              {' '}
              <h2 className="nv-h2" data-en={"Everything for<br/>your rest."} data-es={"Todo para<br/>tu descanso."}>
                {"Todo para"}
                <br />
                {"tu descanso."}
              </h2>
              {' '}
              <button data-page="producto" className="nv-link" data-en="View full catalog →" data-es="Ver catálogo completo →">
                {"Ver catálogo completo →"}
              </button>
              {' '}
            </div>
            {' '}
            <div className="nv-collection-track" id="nv-collection-track">
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* 7. MARQUESINA — texto gigante que acelera con la velocidad del scroll */}
        {' '}
        <section id="nv-marquee" className="nv-dark" aria-hidden="true">
          {' '}
          <div className="nv-marquee-row" data-dir="-1">
            <div className="nv-marquee-inner">
              {' '}
              <span>
                {"Duerme Bien Siempre"}
              </span>
              <em>
                {"✦"}
              </em>
              <span>
                {"Italian Design"}
              </span>
              <em>
                {"✦"}
              </em>
              <span>
                {"Garantía 10 años"}
              </span>
              <em>
                {"✦"}
              </em>
              <span>
                {"Resortes encapsulados"}
              </span>
              <em>
                {"✦"}
              </em>
              <span>
                {"Duerme Bien Siempre"}
              </span>
              <em>
                {"✦"}
              </em>
              <span>
                {"Italian Design"}
              </span>
              <em>
                {"✦"}
              </em>
              <span>
                {"Garantía 10 años"}
              </span>
              <em>
                {"✦"}
              </em>
              <span>
                {"Resortes encapsulados"}
              </span>
              <em>
                {"✦"}
              </em>
              {' '}
            </div>
          </div>
          {' '}
        </section>
        {' '}
        {/* 8. POR QUÉ NUVELA — tarjetas con luz dorada que sigue al mouse */}
        {' '}
        <section id="nv-why" className="nv-dark">
          {' '}
          <div className="nv-wrap">
            {' '}
            <div className="nv-why-head">
              {' '}
              <p className="nv-eyebrow" data-en="Why Nuvela" data-es="Por qué Nuvela">
                {"Por qué Nuvela"}
              </p>
              {' '}
              <h2 className="nv-h2" data-en={"Compare the specs,<br/>not just the price."} data-es={"Compara las especificaciones,<br/>no solo el precio."}>
                {"Compara las especificaciones,"}
                <br />
                {"no solo el precio."}
              </h2>
              {' '}
            </div>
            {' '}
            <div className="nv-why-grid">
              {' '}
              <article className="nv-card nv-tilt">
                {' '}
                <span className="nv-card-num">
                  {"01"}
                </span>
                {' '}
                <h3 data-en="Visible hybrid technology" data-es="Tecnología híbrida a la vista">
                  {"Tecnología híbrida a la vista"}
                </h3>
                {' '}
                <p data-en="Encapsulated springs + memory foam. We show you what's inside, layer by layer." data-es="Resortes encapsulados + memory foam. Te enseñamos lo que hay adentro, capa por capa.">
                  {"Resortes encapsulados + memory foam. Te enseñamos lo que hay adentro, capa por capa."}
                </p>
                {' '}
              </article>
              {' '}
              <article className="nv-card nv-tilt">
                {' '}
                <span className="nv-card-num">
                  {"02"}
                </span>
                {' '}
                <h3 data-en="Rest as a couple" data-es="Descanso en pareja">
                  {"Descanso en pareja"}
                </h3>
                {' '}
                <p data-en="Independent springs mean less motion transfer when your partner turns over." data-es="Resortes independientes: menos movimiento cuando tu pareja cambia de posición.">
                  {"Resortes independientes: menos movimiento cuando tu pareja cambia de posición."}
                </p>
                {' '}
              </article>
              {' '}
              <article className="nv-card nv-tilt">
                {' '}
                <span className="nv-card-num">
                  {"03"}
                </span>
                {' '}
                <h3 data-en="10-year warranty" data-es="Garantía de 10 años">
                  {"Garantía de 10 años"}
                </h3>
                {' '}
                <p data-en="A decade of coverage against manufacturing defects." data-es="Una década de cobertura por defectos de fabricación.">
                  {"Una década de cobertura por defectos de fabricación."}
                </p>
                {' '}
              </article>
              {' '}
              <article className="nv-card nv-tilt">
                {' '}
                <span className="nv-card-num">
                  {"04"}
                </span>
                {' '}
                <h3 data-en="Italian design" data-es="Diseño italiano">
                  {"Diseño italiano"}
                </h3>
                {' '}
                <p data-en="Warm white pillow top, black side panel with zipper and the embroidered gold logo." data-es="Pillow top blanco cálido, lateral negro con zipper y el logo dorado bordado.">
                  {"Pillow top blanco cálido, lateral negro con zipper y el logo dorado bordado."}
                </p>
                {' '}
              </article>
              {' '}
              <article className="nv-card nv-tilt">
                {' '}
                <span className="nv-card-num">
                  {"05"}
                </span>
                {' '}
                <h3 data-en="Delivery across Guatemala" data-es="Envío a todo Guatemala">
                  {"Envío a todo Guatemala"}
                </h3>
                {' '}
                <p data-en="Home delivery in Guatemala City; we also ship to the rest of the country." data-es="A domicilio en la Ciudad de Guatemala; también enviamos al interior del país.">
                  {"A domicilio en la Ciudad de Guatemala; también enviamos al interior del país."}
                </p>
                {' '}
              </article>
              {' '}
              <article className="nv-card nv-tilt">
                {' '}
                <span className="nv-card-num">
                  {"06"}
                </span>
                {' '}
                <h3 data-en="Try it in person" data-es="Pruébalo en persona">
                  {"Pruébalo en persona"}
                </h3>
                {' '}
                <p data-en="Private showroom in Zone 9, by appointment." data-es="Showroom privado en Zona 9, con cita previa.">
                  {"Showroom privado en Zona 9, con cita previa."}
                </p>
                {' '}
              </article>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* 9. TESTIMONIO — la cita se enciende palabra por palabra */}
        {' '}
        <section id="nv-voice" className="nv-dark">
          {' '}
          <div className="nv-wrap nv-voice-inner">
            {' '}
            <span className="nv-quote-mark" aria-hidden="true">
              {"“"}
            </span>
            {' '}
            <blockquote className="nv-split nv-voice-text" data-nv-es="La primera noche confirmé mi compra porque logré *descansar* como debería. Nuvela no solo es un colchón — es *tecnología.*" data-nv-en="The first night confirmed my purchase — I finally *rested* the way I should. Nuvela isn't just a mattress — it's *technology.*">
            </blockquote>
            {' '}
            <p className="nv-eyebrow nv-voice-name">
              {"Paulina E. · King · "}
              <span data-en="Guatemala City" data-es="Ciudad de Guatemala">
                {"Ciudad de Guatemala"}
              </span>
            </p>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* 10. GALERÍA — fotos que se mueven a distintas velocidades */}
        {' '}
        <section id="nv-gallery" className="nv-dark">
          {' '}
          <div className="nv-wrap">
            {' '}
            <div className="nv-gallery-head">
              {' '}
              <div>
                {' '}
                <p className="nv-eyebrow">
                  {"Instagram"}
                </p>
                {' '}
                <h2 className="nv-h2" data-en="Follow our story." data-es="Sigue nuestra historia.">
                  {"Sigue nuestra historia."}
                </h2>
                {' '}
              </div>
              {' '}
              <a href="https://instagram.com/Nuvela.gt" target="_blank" rel="noopener" className="nv-btn-ghost nv-magnetic">
                {"@nuvela.gt"}
              </a>
              {' '}
            </div>
            {' '}
            <div className="nv-gallery-grid">
              {' '}
              <a href="https://instagram.com/Nuvela.gt" target="_blank" rel="noopener" className="nv-g" data-speed="-60">
                <img src="images/pareja.jpg" alt="Pareja despertando en un colchón Nuvela" loading="lazy" />
              </a>
              {' '}
              <a href="https://instagram.com/Nuvela.gt" target="_blank" rel="noopener" className="nv-g" data-speed="40">
                <img src="images/detalle.jpg" alt="Detalle del logo bordado Nuvela" loading="lazy" />
              </a>
              {' '}
              <a href="https://instagram.com/Nuvela.gt" target="_blank" rel="noopener" className="nv-g" data-speed="-30">
                <img src="images/cama.jpg" alt="Habitación con colchón Nuvela" loading="lazy" />
              </a>
              {' '}
              <a href="https://instagram.com/Nuvela.gt" target="_blank" rel="noopener" className="nv-g" data-speed="70">
                <img src="images/zipper.jpg" alt="Pillow top desfundable con zipper" loading="lazy" />
              </a>
              {' '}
              <a href="https://instagram.com/Nuvela.gt" target="_blank" rel="noopener" className="nv-g" data-speed="-50">
                <img src="images/fabrica.jpg" alt="Fabricación del colchón Nuvela" loading="lazy" />
              </a>
              {' '}
              <a href="https://instagram.com/Nuvela.gt" target="_blank" rel="noopener" className="nv-g" data-speed="30">
                <img src="images/entrega.jpg" alt="Entrega a domicilio Nuvela" loading="lazy" />
              </a>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* 11. CIERRE — ondas generativas que reaccionan al mouse */}
        {' '}
        <section id="nv-final" className="nv-dark">
          {' '}
          <canvas id="nv-final-canvas" aria-hidden="true">
          </canvas>
          {' '}
          <div className="nv-final-inner">
            {' '}
            <p className="nv-eyebrow" data-en="Ready to rest" data-es="Listo para descansar">
              {"Listo para descansar"}
            </p>
            {' '}
            <h2 className="nv-display" data-en={"Your best night<br/>starts here."} data-es={"Empieza tu<br/>mejor noche."}>
              {"Empieza tu"}
              <br />
              {"mejor noche."}
            </h2>
            {' '}
            <div className="nv-hero-actions">
              {' '}
              <button data-page="cita" className="btn-gold nv-magnetic" data-en="Book a Visit" data-es="Agenda tu Cita">
                {"Agenda tu Cita"}
              </button>
              {' '}
              <a href="https://wa.me/50253984599" target="_blank" rel="noopener" className="nv-btn-ghost nv-magnetic">
                {"WhatsApp"}
              </a>
              {' '}
              <button data-page="producto" className="nv-btn-ghost nv-magnetic" data-en="View Products" data-es="Ver Productos">
                {"Ver Productos"}
              </button>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
      </main>
    </>
  );
}

/* ---------- Página "historia" ---------- */
function PageHistoria() {
  return (
    <>
      <main id="page-historia" className="page">
        {' '}
        {/* Page header */}
        {' '}
        <section className="relative h-[10vh] min-h-[460px] overflow-hidden">
          {' '}
          <img className="absolute inset-0 w-full h-full object-cover kenburns" src="images/pareja.jpg" alt="Pareja disfrutando de un descanso cómodo gracias a un colchón Nuvela" />
          {' '}
          <div className="absolute inset-0 bg-black/40">
          </div>
          {' '}
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
            {' '}
            <p className="eyebrow text-gold-light reveal" data-en="Our Story" data-es="Historia">
              {"Historia"}
            </p>
            {' '}
            <span className="gold-rule mt-5 reveal reveal-delay-1">
            </span>
            {' '}
            <h2 className="text-white font-serif text-5xl md:text-7xl mt-8 leading-[1.05] max-w-3xl reveal reveal-delay-1" data-en="A philosophy of rest." data-es="Una filosofía del descanso.">
              {"Una filosofía del descanso."}
            </h2>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        <section className="py-14 md:py-32 bg-white">
          {' '}
          <div className="max-w-4xl mx-auto px-6">
            {' '}
            <div className="reveal">
              {' '}
              <p className="eyebrow" data-en="Vision" data-es="Visión">
                {"Visión"}
              </p>
              {' '}
              <span className="gold-rule mt-4">
              </span>
              {' '}
              <h3 className="font-serif text-3xl md:text-4xl text-ink mt-6 leading-tight" data-en="Sleep is not a luxury — it is the foundation of a well-lived life." data-es="El descanso no es un lujo — es el fundamento de una vida bien vivida.">
                {"El descanso no es un lujo — es el fundamento de una vida bien vivida."}
              </h3>
              {' '}
            </div>
            {' '}
            <p className="text-graphite mt-10 leading-loose text-lg reveal reveal-delay-1" data-en="Nuvela was born from a simple conviction: that the way we rest defines how we live. Inspired by the Italian tradition of craftsmanship — where every detail is considered, every material chosen, every finish refined — we set out to build mattresses that don't just feel premium. They feel inevitable." data-es="Nuvela nació de una convicción simple: la forma en que descansamos define cómo vivimos. Inspirados por la tradición italiana del oficio — donde cada detalle se considera, cada material se elige, cada acabado se refina — nos propusimos crear colchones que no solo se sintieran premium. Se sintieran inevitables.">
              {"Nuvela nació de una convicción simple: la forma en que descansamos define cómo vivimos. Inspirados por la tradición italiana del oficio — donde cada detalle se considera, cada material se elige, cada acabado se refina — nos propusimos crear colchones que no solo se sintieran premium. Se sintieran inevitables."}
            </p>
            {' '}
            <p className="text-graphite mt-6 leading-loose text-lg reveal reveal-delay-2" data-en="Every Nuvela mattress is the product of obsessive engineering. Each layer — from the cooling top fabric to the high-density 40D core to the hundreds of independently encapsulated springs — is calibrated to a single end: a sleep so deep, so complete, that morning becomes a celebration." data-es="Cada colchón Nuvela es producto de una ingeniería obsesiva. Cada capa — desde la tela superior de enfriamiento, pasando por el núcleo 40D de alta densidad, hasta los cientos de resortes encapsulados individualmente — está calibrada con un único fin: un descanso tan profundo, tan completo, que la mañana se convierte en una celebración.">
              {"Cada colchón Nuvela es producto de una ingeniería obsesiva. Cada capa — desde la tela superior de enfriamiento, pasando por el núcleo 40D de alta densidad, hasta los cientos de resortes encapsulados individualmente — está calibrada con un único fin: un descanso tan profundo, tan completo, que la mañana se convierte en una celebración."}
            </p>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        <section className="py-14 md:py-32 bg-cream">
          {' '}
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            {' '}
            <div className="bg-white p-10 reveal">
              {' '}
              <p className="eyebrow" data-en="Mission" data-es="Misión">
                {"Misión"}
              </p>
              {' '}
              <span className="gold-rule mt-4">
              </span>
              {' '}
              <p className="text-graphite mt-6 leading-relaxed" data-en="Deliver a sleep experience worthy of being passed down — through quality, design and unwavering integrity." data-es="Ofrecer una experiencia de descanso digna de ser heredada — a través de la calidad, el diseño y la integridad inquebrantable.">
                {"Ofrecer una experiencia de descanso digna de ser heredada — a través de la calidad, el diseño y la integridad inquebrantable."}
              </p>
              {' '}
            </div>
            {' '}
            <div className="bg-white p-10 reveal reveal-delay-1">
              {' '}
              <p className="eyebrow" data-en="Philosophy" data-es="Filosofía">
                {"Filosofía"}
              </p>
              {' '}
              <span className="gold-rule mt-4">
              </span>
              {' '}
              <p className="text-graphite mt-6 leading-relaxed" data-en="The best things are quiet. A mattress should disappear beneath you, returning your body to balance and your mind to silence." data-es="Lo mejor es discreto. Un colchón debe desaparecer bajo ti, devolviendo tu cuerpo al equilibrio y tu mente al silencio.">
                {"Lo mejor es discreto. Un colchón debe desaparecer bajo ti, devolviendo tu cuerpo al equilibrio y tu mente al silencio."}
              </p>
              {' '}
            </div>
            {' '}
            <div className="bg-white p-10 reveal reveal-delay-2">
              {' '}
              <p className="eyebrow" data-en="Innovation" data-es="Innovación">
                {"Innovación"}
              </p>
              {' '}
              <span className="gold-rule mt-4">
              </span>
              {' '}
              <p className="text-graphite mt-6 leading-relaxed" data-en="We test, refine and obsess. Modern sleep science meets centuries of Italian craftsmanship — that is the Nuvela method." data-es="Probamos, refinamos y nos obsesionamos. La ciencia moderna del descanso se encuentra con siglos de oficio italiano — ese es el método Nuvela.">
                {"Probamos, refinamos y nos obsesionamos. La ciencia moderna del descanso se encuentra con siglos de oficio italiano — ese es el método Nuvela."}
              </p>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        <section className="py-14 md:py-32 bg-gold">
          {' '}
          <div className="max-w-5xl mx-auto px-6 text-center reveal">
            {' '}
            <p className="font-serif italic text-3xl md:text-4xl text-ink leading-snug" data-en="“Sleep Well, Always.”" data-es="«Duerme Bien Siempre.»">
              {"«Duerme Bien Siempre.»"}
            </p>
            {' '}
            <p className="eyebrow !text-graphite mt-6">
              {"Nuvela · Italian Design"}
            </p>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
      </main>
    </>
  );
}

/* ---------- Página "producto" ---------- */
function PageProductos() {
  return (
    <>
      <main id="page-producto" className="page nv-prod">
        {' '}
        <section className="nv-prod-hero">
          {' '}
          <canvas id="nv-prod-canvas" aria-hidden="true">
          </canvas>
          {' '}
          <div className="nv-prod-hero-inner">
            {' '}
            <p className="nv-eyebrow" data-en="The Collection" data-es="La Colección">
              {"La Colección"}
            </p>
            {' '}
            <h2 className="nv-display nv-prod-title" data-en={"Premium is the<br/>new standard."} data-es={"Premium es el<br/>nuevo estándar."}>
              {"Premium es el"}
              <br />
              {"nuevo estándar."}
            </h2>
            {' '}
            <p className="nv-lead" data-en="Choose a category to see its models, sizes, prices and full specifications." data-es="Elige una categoría para ver sus modelos, medidas, precios y ficha técnica completa.">
              {"Elige una categoría para ver sus modelos, medidas, precios y ficha técnica completa."}
            </p>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Categorías + cuadrícula (las dibuja el JS a partir de PRODUCTS) */}
        {' '}
        <section className="nv-prod-body">
          {' '}
          <div id="products-filter" className="nv-cat-grid">
            {' '}
            {/* quiz tile + category tiles injected here by renderCategoryFilters() */}
            {' '}
          </div>
          {' '}
          <p className="nv-prod-all">
            {' '}
            <button type="button" className="js-filter-category" data-category="all" data-en="View all products →" data-es="Ver todos los productos →">
              {"Ver todos los productos →"}
            </button>
            {' '}
          </p>
          {' '}
          <div id="products-grid-wrap" className="nv-wrap">
            {' '}
            <div id="products-grid-heading" className="nv-prod-heading">
              {/* injected: selected category name */}
            </div>
            {' '}
            <div id="products-grid" className="nv-prod-grid">
              {' '}
              {/* product cards injected here by renderProductsGrid() */}
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
      </main>
    </>
  );
}

/* ---------- Página "linea-hotelera" ---------- */
function PageLineaHotelera() {
  return (
    <>
      <main id="page-linea-hotelera" className="page nv-hotel">
        {' '}
        {/* Portada */}
        {' '}
        <section className="nv-hotel-hero">
          {' '}
          <div className="nv-hotel-hero-bg" aria-hidden="true">
            <img src="images/nuvela-hotel-vista-2.jpg" alt="Colchón Nuvela Diamond sobre base negra en una habitación de hotel" />
          </div>
          {' '}
          <div className="nv-hotel-hero-inner">
            {' '}
            <p className="nv-eyebrow" data-en="Hotel Line · B2B" data-es="Línea para Hoteles · B2B">
              {"Línea para Hoteles · B2B"}
            </p>
            {' '}
            <h2 className="nv-display nv-hotel-title" data-en={"Rest, at hospitality<br/>scale."} data-es={"Descanso, a la escala<br/>de la hospitalidad."}>
              {"Descanso, a la escala"}
              <br />
              {"de la hospitalidad."}
            </h2>
            {' '}
            <p className="nv-lead" data-en="Mattresses, pillows, bedding and wooden bed frames for hotels, Airbnbs and renovation projects — with volume pricing and a dedicated concierge." data-es="Colchones, almohadas, blancos de cama y camastrones para hoteles, Airbnbs y proyectos de remodelación — con precios por volumen y un concierge dedicado.">
              {"Colchones, almohadas, blancos de cama y camastrones para hoteles, Airbnbs y proyectos de remodelación — con precios por volumen y un concierge dedicado."}
            </p>
            {' '}
            <div className="nv-hero-actions nv-hotel-actions">
              {' '}
              <button type="button" className="btn-gold nv-magnetic js-nv-goto" data-target="#hotel-products-grid" data-en="Build my quote" data-es="Armar mi cotización">
                {"Armar mi cotización"}
              </button>
              {' '}
              <a href="https://wa.me/50253984599?text=Hola%20Nuvela%2C%20me%20interesa%20la%20L%C3%ADnea%20para%20Hoteles" target="_blank" rel="noopener" className="nv-btn-ghost nv-magnetic" data-en="Talk to the concierge" data-es="Hablar con el concierge">
                {"Hablar con el concierge"}
              </a>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
          <div className="nv-hotel-strip">
            {' '}
            <div>
              <b data-en="Volume" data-es="Precios">
                {"Precios"}
              </b>
              <span data-en="pricing" data-es="por volumen">
                {"por volumen"}
              </span>
            </div>
            {' '}
            <div>
              <b>
                {"10"}
              </b>
              <span data-en="year warranty" data-es="años de garantía">
                {"años de garantía"}
              </span>
            </div>
            {' '}
            <div>
              <b data-en="Custom" data-es="Medidas">
                {"Medidas"}
              </b>
              <span data-en="sizing" data-es="a la carta">
                {"a la carta"}
              </span>
            </div>
            {' '}
            <div>
              <b data-en="Scheduled" data-es="Entregas">
                {"Entregas"}
              </b>
              <span data-en="deliveries" data-es="programadas">
                {"programadas"}
              </span>
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Para quién */}
        {' '}
        <section className="nv-hotel-who">
          {' '}
          <div className="nv-wrap">
            {' '}
            <p className="nv-eyebrow" data-en="Who it's for" data-es="Para quién">
              {"Para quién"}
            </p>
            {' '}
            <h3 className="nv-h2" data-en={"Every room<br/>deserves a Nuvela."} data-es={"Cada habitación<br/>merece un Nuvela."}>
              {"Cada habitación"}
              <br />
              {"merece un Nuvela."}
            </h3>
            {' '}
            <div className="nv-who-grid">
              {' '}
              <article className="nv-who nv-tilt-h">
                <img src="images/nuvela-hotel-vista-4.jpg" alt="Detalle del pillow top del colchón Nuvela Diamond para hoteles y suites" loading="lazy" />
                <div>
                  <h4 data-en="Hotels & suites" data-es="Hoteles y suites">
                    {"Hoteles y suites"}
                  </h4>
                  <p data-en="Upgrade the sleep experience in rooms and suites." data-es="Mejora la experiencia de descanso en habitaciones y suites.">
                    {"Mejora la experiencia de descanso en habitaciones y suites."}
                  </p>
                </div>
              </article>
              {' '}
              <article className="nv-who nv-tilt-h">
                <img src="images/cama.jpg" alt="Habitación clara con cama vestida, ideal para Airbnb premium" loading="lazy" />
                <div>
                  <h4 data-en="Premium Airbnb" data-es="Airbnb premium">
                    {"Airbnb premium"}
                  </h4>
                  <p data-en="Reviews that mention the bed, stay after stay." data-es="Reseñas que hablan de la cama, estadía tras estadía.">
                    {"Reseñas que hablan de la cama, estadía tras estadía."}
                  </p>
                </div>
              </article>
              {' '}
              <article className="nv-who nv-tilt-h">
                <img src="images/atardecer.jpg" alt="Colchón Nuvela en una habitación con vista al atardecer" loading="lazy" />
                <div>
                  <h4 data-en="Renovations & openings" data-es="Remodelaciones y aperturas">
                    {"Remodelaciones y aperturas"}
                  </h4>
                  <p data-en="Volume orders with delivery planned around your project." data-es="Pedidos por volumen con entregas planeadas según tu proyecto.">
                    {"Pedidos por volumen con entregas planeadas según tu proyecto."}
                  </p>
                </div>
              </article>
              {' '}
              <article className="nv-who nv-tilt-h">
                <img src="images/entrega.jpg" alt="Entrega a domicilio de un colchón Nuvela en su caja" loading="lazy" />
                <div>
                  <h4 data-en="Architects & developers" data-es="Arquitectos y desarrolladoras">
                    {"Arquitectos y desarrolladoras"}
                  </h4>
                  <p data-en="A premium differentiator for the homes you deliver." data-es="Un diferenciador premium para los espacios que entregas.">
                    {"Un diferenciador premium para los espacios que entregas."}
                  </p>
                </div>
              </article>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* QUOTE TRAY: productos marcados con "+ Agregar a Cotización" */}
        {' '}
        <section id="quote-tray-section" className="nv-quote">
          {' '}
          <div className="nv-quote-panel">
            {' '}
            <div id="quote-cart-content">
              {' '}
              {/* injected by renderQuoteCart() */}
              {' '}
            </div>
            {' '}
            <div id="quote-form-extra" className="hidden mt-6 pt-6 border-t border-pearl">
              {' '}
              <p className="eyebrow" data-en="Contact Details" data-es="Datos de Contacto">
                {"Datos de Contacto"}
              </p>
              {' '}
              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                {' '}
                <div>
                  {' '}
                  <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite" data-en="Full Name *" data-es="Nombre Completo *">
                    {"Nombre Completo *"}
                  </label>
                  {' '}
                  <input id="qo-nombre" type="text" autoComplete="name" className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none" />
                  {' '}
                </div>
                {' '}
                <div>
                  {' '}
                  <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite" data-en="Phone *" data-es="Teléfono *">
                    {"Teléfono *"}
                  </label>
                  {' '}
                  <input id="qo-telefono" type="tel" autoComplete="tel" className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none" />
                  {' '}
                </div>
                {' '}
                <div>
                  {' '}
                  <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite" data-en="Hotel / Company *" data-es="Hotel / Empresa *">
                    {"Hotel / Empresa *"}
                  </label>
                  {' '}
                  <input id="qo-empresa" type="text" className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none" />
                  {' '}
                </div>
                {' '}
                <div>
                  {' '}
                  <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite" data-en="Email *" data-es="Correo *">
                    {"Correo *"}
                  </label>
                  {' '}
                  <input id="qo-correo" type="email" autoComplete="email" className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none" />
                  {' '}
                </div>
                {' '}
                <div>
                  {' '}
                  <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite" data-en="Notes" data-es="Comentarios">
                    {"Comentarios"}
                  </label>
                  {' '}
                  <input id="qo-comentarios" type="text" className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none" />
                  {' '}
                </div>
                {' '}
              </div>
              {' '}
              <p id="quote-error" className="hidden text-sm mt-5" style={{ "color": "#E5736B" }}>
              </p>
              {' '}
              <button id="quote-request-btn" type="button" className="btn-gold w-full mt-5 !py-4 !text-sm" data-en="Request Quote via WhatsApp" data-es="Solicitar Cotización por WhatsApp">
                {"Solicitar Cotización por WhatsApp"}
              </button>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Catálogo para hoteles (lo dibuja renderHotelGrid() desde PRODUCTS) */}
        {' '}
        <section className="nv-hotel-catalog">
          {' '}
          <div className="nv-wrap">
            {' '}
            <p className="nv-eyebrow" data-en="Hotel catalog" data-es="Catálogo hotelero">
              {"Catálogo hotelero"}
            </p>
            {' '}
            <h3 className="nv-h2" data-en={"Choose the size,<br/>add it to your quote."} data-es={"Elige la medida,<br/>agrégala a tu cotización."}>
              {"Elige la medida,"}
              <br />
              {"agrégala a tu cotización."}
            </h3>
            {' '}
          </div>
          {' '}
          <div id="hotel-products-grid" className="nv-prod-grid nv-wrap">
            {' '}
            {/* product cards injected here by renderHotelGrid() */}
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Cómo trabajamos */}
        {' '}
        <section className="nv-hotel-steps">
          {' '}
          <div className="nv-wrap">
            {' '}
            <p className="nv-eyebrow" data-en="How we work" data-es="Cómo trabajamos">
              {"Cómo trabajamos"}
            </p>
            {' '}
            <h3 className="nv-h2" data-en={"From the first room<br/>to the last."} data-es={"De la primera habitación<br/>a la última."}>
              {"De la primera habitación"}
              <br />
              {"a la última."}
            </h3>
            {' '}
            <ol className="nv-steps">
              <i className="nv-steps-line" aria-hidden="true">
                <i>
                </i>
              </i>
              <li>
                <span>
                  {"01"}
                </span>
                <h4 data-en="Build your quote" data-es="Arma tu cotización">
                  {"Arma tu cotización"}
                </h4>
                <p data-en="Pick products and sizes here and send it by WhatsApp." data-es="Elige productos y medidas aquí y envíala por WhatsApp.">
                  {"Elige productos y medidas aquí y envíala por WhatsApp."}
                </p>
              </li>
              <li>
                <span>
                  {"02"}
                </span>
                <h4 data-en="Try it in person" data-es="Pruébalo en persona">
                  {"Pruébalo en persona"}
                </h4>
                <p data-en="Visit our private showroom in Zone 9, by appointment." data-es="Visita nuestro showroom privado en Zona 9, con cita.">
                  {"Visita nuestro showroom privado en Zona 9, con cita."}
                </p>
              </li>
              <li>
                <span>
                  {"03"}
                </span>
                <h4 data-en="Volume proposal" data-es="Propuesta por volumen">
                  {"Propuesta por volumen"}
                </h4>
                <p data-en="Pricing and sizes tailored to your project." data-es="Precios y medidas a la medida de tu proyecto.">
                  {"Precios y medidas a la medida de tu proyecto."}
                </p>
              </li>
              <li>
                <span>
                  {"04"}
                </span>
                <h4 data-en="Scheduled delivery" data-es="Entrega programada">
                  {"Entrega programada"}
                </h4>
                <p data-en="We coordinate dates with your opening or renovation." data-es="Coordinamos fechas con tu apertura o remodelación.">
                  {"Coordinamos fechas con tu apertura o remodelación."}
                </p>
              </li>
            </ol>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Cierre */}
        {' '}
        <section className="nv-hotel-cta">
          {' '}
          <div className="nv-wrap">
            {' '}
            <p className="nv-eyebrow" data-en="Hospitality Projects" data-es="Proyectos de Hospitalidad">
              {"Proyectos de Hospitalidad"}
            </p>
            {' '}
            <h3 className="nv-display nv-hotel-cta-title" data-en={"Talk to our<br/>hotel concierge."} data-es={"Habla con nuestro<br/>concierge hotelero."}>
              {"Habla con nuestro"}
              <br />
              {"concierge hotelero."}
            </h3>
            {' '}
            <div className="nv-hero-actions">
              {' '}
              <a href="https://wa.me/50253984599?text=Hola%20Nuvela%2C%20me%20interesa%20la%20L%C3%ADnea%20para%20Hoteles" target="_blank" rel="noopener" className="btn-gold nv-magnetic">
                {"WhatsApp"}
              </a>
              {' '}
              <button data-page="cita" className="nv-btn-ghost nv-magnetic" data-en="Book a showroom visit" data-es="Agendar visita al showroom">
                {"Agendar visita al showroom"}
              </button>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Botón flotante con el total de la cotización (aparece al agregar algo) */}
        {' '}
        <button type="button" id="nv-quote-pill" className="js-nv-goto" data-target="#quote-tray-section" aria-live="polite">
          {' '}
          <span data-en="My quote" data-es="Mi cotización">
            {"Mi cotización"}
          </span>
          <b id="nv-quote-count">
            {"0"}
          </b>
          {' '}
        </button>
        {' '}
      </main>
    </>
  );
}

/* ---------- Página "comparar" ---------- */
function PageComparar() {
  return (
    <>
      <main id="page-comparar" className="page nv-cmp">
        {' '}
        <section className="nv-cmp-hero">
          {' '}
          <canvas id="nv-cmp-canvas" aria-hidden="true">
          </canvas>
          {' '}
          <div className="nv-cmp-hero-inner">
            {' '}
            <p className="nv-eyebrow" data-en="Compare Products" data-es="Comparar Productos">
              {"Comparar Productos"}
            </p>
            {' '}
            <h2 className="nv-display nv-cmp-title" data-en={"Compare,<br/>side by side."} data-es={"Compara,<br/>lado a lado."}>
              {"Compara,"}
              <br />
              {"lado a lado."}
            </h2>
            {' '}
            <p className="nv-lead" data-en="Choose up to 3 products from any section to compare their photos and specifications." data-es="Elige hasta 3 productos de cualquier sección para comparar sus fotos y especificaciones.">
              {"Elige hasta 3 productos de cualquier sección para comparar sus fotos y especificaciones."}
            </p>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* PICKER (lo dibuja renderComparePicker) */}
        {' '}
        <section className="nv-cmp-pick">
          {' '}
          <div id="compare-picker" className="nv-wrap">
            {' '}
            {/* injected by renderComparePicker() */}
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* TABLA (la dibuja renderCompareTable) */}
        {' '}
        <section className="nv-cmp-table" id="nv-cmp-table-section">
          {' '}
          <div id="compare-table-wrap" className="nv-wrap">
            {' '}
            {/* injected by renderCompareTable() */}
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Barra flotante: los 3 espacios de la comparación */}
        {' '}
        <div id="nv-cmp-tray" aria-live="polite">
          {' '}
          <div className="nv-cmp-slots">
          </div>
          {' '}
          <button type="button" className="btn-gold js-nv-goto" data-target="#nv-cmp-table-section" data-en="Compare" data-es="Comparar">
            {"Comparar"}
          </button>
          {' '}
        </div>
        {' '}
      </main>
    </>
  );
}

/* ---------- Página "carrito" ---------- */
function PageCarrito() {
  return (
    <>
      <main id="page-carrito" className="page">
        {' '}
        <section className="bg-cream pt-28 pb-16">
          {' '}
          <div className="max-w-4xl mx-auto px-6 text-center reveal">
            {' '}
            <p className="eyebrow" data-en="My Cart" data-es="Mi Carrito">
              {"Mi Carrito"}
            </p>
            {' '}
            <span className="gold-rule gold-rule-center mt-4">
            </span>
            {' '}
            <h2 className="font-serif text-5xl md:text-6xl text-ink mt-8 leading-[1.05]" data-en="Review your order." data-es="Revisa tu pedido.">
              {"Revisa tu pedido."}
            </h2>
            {' '}
            <p className="text-graphite mt-6 leading-relaxed max-w-xl mx-auto" data-en="Add products from any product page, adjust quantities here, and send your order straight to us on WhatsApp." data-es="Agrega productos desde cualquier ficha, ajusta cantidades aquí y envíanos tu pedido directo por WhatsApp.">
              {"Agrega productos desde cualquier ficha, ajusta cantidades aquí y envíanos tu pedido directo por WhatsApp."}
            </p>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        <section className="pb-24 md:pb-32 bg-white border-t border-pearl">
          {' '}
          <div className="max-w-5xl mx-auto px-6 pt-16">
            {' '}
            <div id="cart-content">
              {' '}
              {/* injected by renderCart() */}
              {' '}
            </div>
            {' '}
            {/* Static shell — never re-rendered by renderCart(), so the customer's */}
            {' '}
            {/* typed info survives every quantity/remove update. Shown/hidden via */}
            {' '}
            {/* the "hidden" class from renderCart(). */}
            {' '}
            <div id="checkout-extra" className="hidden mt-4">
              {' '}
              <div className="pt-2">
                {' '}
                <p className="eyebrow" data-en="Discount Code" data-es="Código de Descuento">
                  {"Código de Descuento"}
                </p>
                {' '}
                <div className="flex flex-col sm:flex-row gap-3 mt-5">
                  {' '}
                  <input id="co-discount-code" type="text" autoCapitalize="characters" autoComplete="off" data-en-placeholder="Enter your code" data-es-placeholder="Ingresa tu código" placeholder="Ingresa tu código" className="w-full sm:flex-1 border border-pearl px-3 py-2.5 text-sm bg-white focus:border-gold outline-none uppercase" />
                  {' '}
                  <button id="apply-discount-btn" type="button" className="btn-outline !py-2.5 !px-6 whitespace-nowrap" data-en="Apply" data-es="Aplicar">
                    {"Aplicar"}
                  </button>
                  {' '}
                </div>
                {' '}
                <p id="discount-message" className="hidden text-sm mt-3 font-medium">
                </p>
                {' '}
              </div>
              {' '}
              <div className="mt-4 pt-10 border-t border-pearl">
                {' '}
                <p className="eyebrow" data-en="Delivery & Billing Details" data-es="Datos de Entrega y Facturación">
                  {"Datos de Entrega y Facturación"}
                </p>
                {' '}
                <div className="grid sm:grid-cols-2 gap-4 mt-5">
                  {' '}
                  <div>
                    {' '}
                    <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite" data-en="Full Name *" data-es="Nombre Completo *">
                      {"Nombre Completo *"}
                    </label>
                    {' '}
                    <input id="co-nombre" type="text" autoComplete="name" className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none" />
                    {' '}
                  </div>
                  {' '}
                  <div>
                    {' '}
                    <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite" data-en="Phone *" data-es="Teléfono *">
                      {"Teléfono *"}
                    </label>
                    {' '}
                    <input id="co-telefono" type="tel" autoComplete="tel" className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none" />
                    {' '}
                  </div>
                  {' '}
                  <div>
                    {' '}
                    <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite" data-en="Invoice Name" data-es="Nombre para Factura">
                      {"Nombre para Factura"}
                    </label>
                    {' '}
                    <input id="co-factura-nombre" type="text" data-en-placeholder="Final Consumer" data-es-placeholder="Consumidor Final" placeholder="Consumidor Final" className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none" />
                    {' '}
                  </div>
                  {' '}
                  <div>
                    {' '}
                    <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite">
                      {"NIT"}
                    </label>
                    {' '}
                    <input id="co-nit" type="text" placeholder="C/F" className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none" />
                    {' '}
                  </div>
                  {' '}
                  <div>
                    {' '}
                    <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite" data-en="Billing Address" data-es="Dirección de Facturación">
                      {"Dirección de Facturación"}
                    </label>
                    {' '}
                    <input id="co-direccion-factura" type="text" className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none" />
                    {' '}
                  </div>
                  {' '}
                  <div>
                    {' '}
                    <label className="text-[0.65rem] tracking-[0.14em] uppercase text-graphite" data-en="Delivery Address *" data-es="Dirección de Entrega *">
                      {"Dirección de Entrega *"}
                    </label>
                    {' '}
                    <input id="co-direccion-entrega" type="text" autoComplete="street-address" className="w-full border border-pearl px-3 py-2.5 mt-1.5 text-sm bg-white focus:border-gold outline-none" />
                    {' '}
                  </div>
                  {' '}
                </div>
                {' '}
              </div>
              {' '}
              <div className="mt-10 pt-10 border-t border-pearl">
                {' '}
                <p className="eyebrow" data-en="Payment Method" data-es="Método de Pago">
                  {"Método de Pago"}
                </p>
                {' '}
                <div id="cuotas-selector" className="flex flex-wrap gap-2 mt-5">
                  {' '}
                  {/* injected by renderCuotasSelector() */}
                  {' '}
                </div>
                {' '}
                <p id="cuotas-summary" className="text-graphite text-sm mt-4">
                </p>
                {' '}
                <p className="text-mist text-xs mt-2" data-en="Reference installment amount, no interest included — the final rate depends on the participating bank." data-es="Cuota referencial, sin intereses incluidos — la tasa final depende del banco participante.">
                  {"Cuota referencial, sin intereses incluidos — la tasa final depende del banco participante."}
                </p>
                {' '}
              </div>
              {' '}
              <p id="checkout-error" className="hidden text-sm mt-6" style={{ "color": "#B3261E" }}>
              </p>
              {' '}
              <button id="cart-checkout-btn" type="button" className="btn-gold w-full mt-6 !py-4 !text-sm" data-en="Checkout via WhatsApp" data-es="Finalizar Pedido por WhatsApp">
                {"Finalizar Pedido por WhatsApp"}
              </button>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Qué pasa después de enviar el pedido */}
        {' '}
        <section className="nv-light nv-sec nv-after">
          {' '}
          <div className="nv-wrap">
            {' '}
            <p className="nv-eyebrow" data-en="After your order" data-es="Después de tu pedido">
              {"Después de tu pedido"}
            </p>
            {' '}
            <h3 className="nv-h2" data-en="What happens next." data-es="Qué sigue después.">
              {"Qué sigue después."}
            </h3>
            {' '}
            <div className="nv-del-stats nv-after-grid">
              {' '}
              <article className="nv-lcard">
                <b>
                  {"01"}
                </b>
                <h4 data-en="You send your order by WhatsApp" data-es="Envías tu pedido por WhatsApp">
                  {"Envías tu pedido por WhatsApp"}
                </h4>
                <p data-en="With the products and details you filled in here." data-es="Con los productos y los datos que llenaste aquí.">
                  {"Con los productos y los datos que llenaste aquí."}
                </p>
              </article>
              {' '}
              <article className="nv-lcard">
                <b>
                  {"02"}
                </b>
                <h4 data-en="An advisor confirms with you" data-es="Un asesor confirma contigo">
                  {"Un asesor confirma contigo"}
                </h4>
                <p data-en="Availability, delivery address and payment method: bank transfer, Visa Cuotas or one-time card payment." data-es="Disponibilidad, dirección de entrega y forma de pago: transferencia bancaria, Visa Cuotas o pago de contado con tarjeta.">
                  {"Disponibilidad, dirección de entrega y forma de pago: transferencia bancaria, Visa Cuotas o pago de contado con tarjeta."}
                </p>
              </article>
              {' '}
              <article className="nv-lcard">
                <b>
                  {"03"}
                </b>
                <h4 data-en="We schedule your delivery" data-es="Coordinamos tu entrega">
                  {"Coordinamos tu entrega"}
                </h4>
                <p data-en="3–5 business days in the metropolitan area and 5–10 in the departments, in a window agreed with you." data-es="De 3 a 5 días hábiles en el área metropolitana y de 5 a 10 en departamentos, en una ventana acordada contigo.">
                  {"De 3 a 5 días hábiles en el área metropolitana y de 5 a 10 en departamentos, en una ventana acordada contigo."}
                </p>
              </article>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
      </main>
    </>
  );
}

/* ---------- Página "producto-detalle" ---------- */
function PageProductoDetalle() {
  return (
    <>
      <main id="page-producto-detalle" className="page">
        {' '}
        <section className="bg-cream pt-28 pb-12 md:pb-20">
          {' '}
          <div className="max-w-7xl mx-auto px-6">
            {' '}
            <button data-page="producto" className="link-gold mb-6 md:mb-10" data-en="← Back to Products" data-es="← Volver a Productos">
              {"← Volver a Productos"}
            </button>
            {' '}
            {/* Botón principal centrado: hace lo mismo que "Comparar Productos" del menú */}
            {' '}
            <div className="flex justify-center mb-6 md:mb-10">
              {' '}
              <button data-page="comparar" className="btn-gold !px-8" data-en="Compare Products" data-es="Comparar Productos">
                {"Comparar Productos"}
              </button>
              {' '}
            </div>
            {' '}
            <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-start">
              {' '}
              {/* Gallery */}
              {' '}
              <div className="reveal">
                {' '}
                {/* nv-pd-zoom: foto principal en formato horizontal y tamaño contenido */}
                {' '}
                <div className="nv-pd-zoom aspect-square overflow-hidden bg-white">
                  {' '}
                  <img id="pd-main-img" className="w-full h-full object-cover transition-opacity duration-500" alt="" />
                  {' '}
                </div>
                {' '}
                <div id="pd-thumbs" className="grid grid-cols-4 gap-3 mt-3">
                  {' '}
                  {/* thumbnail buttons injected by renderProductDetail() */}
                  {' '}
                </div>
                {' '}
              </div>
              {' '}
              {/* Info */}
              {' '}
              <div className="reveal reveal-delay-1">
                {' '}
                <p id="pd-eyebrow" className="eyebrow">
                </p>
                {' '}
                <span className="gold-rule mt-4">
                </span>
                {' '}
                <h2 id="pd-title" className="font-serif text-5xl md:text-6xl text-ink mt-6 leading-[1.05]">
                </h2>
                {' '}
                <p id="pd-tagline" className="font-serif italic text-mist text-lg mt-3">
                </p>
                {' '}
                <div id="pd-stats" className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-center">
                  {' '}
                  {/* stat tiles injected by renderProductDetail() */}
                  {' '}
                </div>
                {' '}
                <p id="pd-description" className="text-graphite mt-8 leading-relaxed">
                </p>
                {' '}
                {/* Precio grande del tamaño elegido (lo actualiza NV) */}
                {' '}
                <div className="nv-pd-price">
                  <span data-en="Price" data-es="Precio">
                    {"Precio"}
                  </span>
                  <b id="nv-pd-price">
                    {"—"}
                  </b>
                  <em id="nv-pd-price-size">
                  </em>
                </div>
                {' '}
                {/* Sizes */}
                {' '}
                <div className="mt-8">
                  {' '}
                  <p className="eyebrow" data-en="Available options — tap to select" data-es="Presentaciones disponibles — toca para elegir">
                    {"Presentaciones disponibles — toca para elegir"}
                  </p>
                  {' '}
                  <div id="pd-sizes" className="grid grid-cols-2 gap-3 mt-5">
                    {' '}
                    {/* size tiles injected by renderPdSizes() */}
                    {' '}
                  </div>
                  {' '}
                </div>
                {' '}
                {/* Quantity + Add to Cart */}
                {' '}
                <div id="pd-purchase" className="mt-8">
                  {' '}
                  {/* injected by renderPdPurchase() */}
                  {' '}
                </div>
                {' '}
                <div className="flex flex-wrap gap-4 mt-6">
                  {' '}
                  <button data-page="contacto" className="btn-outline w-full sm:w-auto" data-en="Contact Concierge" data-es="Hablar con Concierge">
                    {"Hablar con Concierge"}
                  </button>
                  {' '}
                </div>
                {' '}
                {/* Confianza junto al botón de compra (garantía solo se muestra en colchones: lo decide NV) */}
                {' '}
                <ul className="nv-trust">
                  <li className="nv-trust-warranty">
                    <b data-en="10-year warranty" data-es="Garantía de 10 años">
                      {"Garantía de 10 años"}
                    </b>
                    <span data-en="Against manufacturing defects." data-es="Por defectos de fabricación.">
                      {"Por defectos de fabricación."}
                    </span>
                  </li>
                  <li>
                    <b data-en="Delivery across Guatemala" data-es="Envío a todo Guatemala">
                      {"Envío a todo Guatemala"}
                    </b>
                    <span data-en="From Q300 · 3–5 business days in the metropolitan area, 5–10 in the departments." data-es="Desde Q300 · 3–5 días hábiles en el área metropolitana, 5–10 en departamentos.">
                      {"Desde Q300 · 3–5 días hábiles en el área metropolitana, 5–10 en departamentos."}
                    </span>
                  </li>
                  <li>
                    <b data-en="Payment methods" data-es="Formas de pago">
                      {"Formas de pago"}
                    </b>
                    <span data-en="Bank transfer, Visa Cuotas installments or one-time card payment." data-es="Transferencia bancaria, Visa Cuotas o pago de contado con tarjeta.">
                      {"Transferencia bancaria, Visa Cuotas o pago de contado con tarjeta."}
                    </span>
                  </li>
                </ul>
                {' '}
                <p className="nv-trust-links">
                  <button data-page="resenas" data-en="Customer reviews →" data-es="Opiniones de clientes →">
                    {"Opiniones de clientes →"}
                  </button>
                  <button data-page="cita" data-en="Try it at the showroom →" data-es="Pruébalo en el showroom →">
                    {"Pruébalo en el showroom →"}
                  </button>
                </p>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* BENEFITS */}
        {' '}
        {/* En móvil, esta sección se pliega: el cliente la toca para abrirla y ver los */}
        {' '}
        {/* beneficios; en pantallas grandes siempre se ve completa, igual que antes. */}
        {' '}
        <section id="pd-benefits-section" className="py-14 md:py-24 bg-white">
          {' '}
          <div className="max-w-7xl mx-auto px-6">
            {' '}
            <div className="mobile-collapse-section reveal">
              {' '}
              <button type="button" className="js-mobile-collapse-toggle mobile-collapse-toggle w-full flex flex-col items-center text-center max-w-2xl mx-auto cursor-pointer md:cursor-default" aria-expanded="false">
                {' '}
                <p className="eyebrow" data-en="Benefits" data-es="Beneficios">
                  {"Beneficios"}
                </p>
                {' '}
                <span className="gold-rule gold-rule-center mt-4">
                </span>
                {' '}
                <h3 className="font-serif text-4xl text-ink mt-8 flex items-center gap-3">
                  {' '}
                  <span data-en="Designed around you." data-es="Diseñado en torno a ti.">
                    {"Diseñado en torno a ti."}
                  </span>
                  {' '}
                  <svg className="chevron w-5 h-5 md:hidden flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {' '}
                </h3>
                {' '}
                <span className="md:hidden text-[0.65rem] tracking-[0.2em] uppercase text-gold mt-2" data-en="Tap to view" data-es="Toca para ver">
                  {"Toca para ver"}
                </span>
                {' '}
              </button>
              {' '}
              <div className="mobile-collapse-body">
                {' '}
                <div id="pd-benefits" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                  {' '}
                  {/* benefit cards injected by renderProductDetail() */}
                  {' '}
                </div>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* SPECS TABLE */}
        {' '}
        {/* Igual: plegada por defecto en móvil, siempre visible en escritorio. */}
        {' '}
        <section className="py-14 md:py-24 bg-cream">
          {' '}
          <div className="max-w-5xl mx-auto px-6">
            {' '}
            <div className="mobile-collapse-section reveal">
              {' '}
              <button type="button" className="js-mobile-collapse-toggle mobile-collapse-toggle w-full flex flex-col items-center text-center cursor-pointer md:cursor-default" aria-expanded="false">
                {' '}
                <p className="eyebrow" data-en="Specifications" data-es="Especificaciones">
                  {"Especificaciones"}
                </p>
                {' '}
                <span className="gold-rule gold-rule-center mt-4">
                </span>
                {' '}
                <h3 className="font-serif text-4xl text-ink mt-8 flex items-center gap-3">
                  {' '}
                  <span data-en="Every detail, documented." data-es="Cada detalle, documentado.">
                    {"Cada detalle, documentado."}
                  </span>
                  {' '}
                  <svg className="chevron w-5 h-5 md:hidden flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {' '}
                </h3>
                {' '}
                <span className="md:hidden text-[0.65rem] tracking-[0.2em] uppercase text-gold mt-2" data-en="Tap to view" data-es="Toca para ver">
                  {"Toca para ver"}
                </span>
                {' '}
              </button>
              {' '}
              <div className="mobile-collapse-body">
                {' '}
                <div id="pd-specs-table" className="bg-white mt-16 overflow-hidden reveal">
                  {' '}
                  <div className="grid grid-cols-3 bg-gold text-white text-xs tracking-[0.22em] uppercase font-semibold">
                    {' '}
                    <div className="p-4" data-en="Size" data-es="Medida">
                      {"Medida"}
                    </div>
                    {' '}
                    <div className="p-4" data-en="Dimensions" data-es="Dimensiones">
                      {"Dimensiones"}
                    </div>
                    {' '}
                    <div className="p-4 text-right" data-en="Springs" data-es="Resortes">
                      {"Resortes"}
                    </div>
                    {' '}
                  </div>
                  {' '}
                  {/* spec rows injected by renderProductDetail() */}
                  {' '}
                </div>
                {' '}
                <p className="text-mist text-xs mt-4 italic" data-en="* Dimensions in meters. ±1–3 cm variation due to upholstery materials." data-es="* Medidas en metros. Variación ±1–3 cm por materiales acolchonados.">
                  {"* Medidas en metros. Variación ±1–3 cm por materiales acolchonados."}
                </p>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* PRODUCT FAQ */}
        {' '}
        <section id="pd-faq-section" className="py-14 md:py-24 bg-white">
          {' '}
          <div className="max-w-3xl mx-auto px-6">
            {' '}
            <div className="text-center reveal">
              {' '}
              <p className="eyebrow" data-en="Questions" data-es="Preguntas">
                {"Preguntas"}
              </p>
              {' '}
              <span className="gold-rule gold-rule-center mt-4">
              </span>
              {' '}
              <h3 className="font-serif text-4xl text-ink mt-8" data-en="About this product." data-es="Sobre este producto.">
                {"Sobre este producto."}
              </h3>
              {' '}
            </div>
            {' '}
            <div id="pd-faq" className="mt-14">
              {' '}
              {/* faq items injected by renderProductDetail() */}
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
      </main>
    </>
  );
}

/* ---------- Página "tecnologia" ---------- */
function PageTecnologia() {
  return (
    <>
      <main id="page-tecnologia" className="page nv-tech">
        {' '}
        <section className="nv-tech-hero">
          {' '}
          <div className="nv-tech-hero-bg" aria-hidden="true">
            <img src="images/elasticidad.jpg" alt="Superficie de memory foam de un colchón híbrido Nuvela" />
          </div>
          {' '}
          <canvas id="nv-tech-canvas" aria-hidden="true">
          </canvas>
          {' '}
          <div className="nv-tech-hero-inner">
            {' '}
            <p className="nv-eyebrow" data-en="Technology" data-es="Tecnología">
              {"Tecnología"}
            </p>
            {' '}
            <h2 className="nv-display nv-tech-title" data-en={"The science of sleep,<br/>layered."} data-es={"La ciencia del descanso,<br/>en capas."}>
              {"La ciencia del descanso,"}
              <br />
              {"en capas."}
            </h2>
            {' '}
            <ul className="nv-cita-chips">
              <li data-en="30 cm hybrid" data-es="Híbrido de 30 cm">
                {"Híbrido de 30 cm"}
              </li>
              <li data-en="Encapsulated springs" data-es="Resortes encapsulados">
                {"Resortes encapsulados"}
              </li>
              <li data-en="Memory foam 40D · 35D" data-es="Memory foam 40D · 35D">
                {"Memory foam 40D · 35D"}
              </li>
              <li data-en="Ice Cooling fabric" data-es="Tela Ice Cooling">
                {"Tela Ice Cooling"}
              </li>
            </ul>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Detrás de escena: texto + video de fabricación */}
        {' '}
        <section className="nv-tech-video">
          {' '}
          <div className="nv-tech-video-grid">
            {' '}
            <div>
              {' '}
              <p className="nv-eyebrow" data-en="Behind the Scenes" data-es="Detrás de Escena">
                {"Detrás de Escena"}
              </p>
              {' '}
              <h3 className="nv-h2" data-en={"This is how a Nuvela<br/>mattress is made."} data-es={"Así se fabrica<br/>un colchón Nuvela."}>
                {"Así se fabrica"}
                <br />
                {"un colchón Nuvela."}
              </h3>
              {' '}
              <p className="nv-lead" data-en="Manufactured in top-tier factories under the highest quality standards, from material selection to every finish." data-es="Fabricado en las mejores fábricas bajo los más altos estándares de calidad, desde la selección de materiales hasta cada acabado.">
                {"Fabricado en las mejores fábricas bajo los más altos estándares de calidad, desde la selección de materiales hasta cada acabado."}
              </p>
              {' '}
            </div>
            {' '}
            <div className="nv-tech-video-frame">
              {' '}
              <video controls playsInline preload="metadata" aria-label="Proceso de fabricación del colchón Nuvela">
                <source src="images/Fabricacion colchon.mp4" type="video/mp4" />
              </video>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* ===== OPCIÓN B: "Bento" — cifras que se mueven ===== */}
        {' '}
        {/* Cuadrícula de tarjetas tipo Apple, cada una con su propia mini */}
        {' '}
        {/* animación. Fotos: images/ondas.jpg, images/zipper.jpg, */}
        {' '}
        {/* images/detalle.jpg */}
        {' '}
        <section className="nv-bento-sec">
          {' '}
          <div className="nv-wrap">
            {' '}
            <p className="nv-eyebrow" data-en="Nuvela technology" data-es="Tecnología Nuvela">
              {"Tecnología Nuvela"}
            </p>
            {' '}
            <h3 className="nv-h2" data-en={"The numbers<br/>behind your rest."} data-es={"Los números<br/>detrás de tu descanso."}>
              {"Los números"}
              <br />
              {"detrás de tu descanso."}
            </h3>
            {' '}
            <div className="nv-bento">
              {' '}
              <article className="nv-b nv-b-springs">
                {' '}
                <canvas className="nv-b-canvas" aria-hidden="true">
                </canvas>
                {' '}
                <div className="nv-b-txt">
                  <b className="nv-b-big" data-count="840">
                    {"0"}
                  </b>
                  <h4 data-en="encapsulated springs (King)" data-es="resortes encapsulados (King)">
                    {"resortes encapsulados (King)"}
                  </h4>
                  <p data-en="Each one works on its own. Move your cursor over them." data-es="Cada uno trabaja de forma independiente. Desliza el cursor sobre ellos.">
                    {"Cada uno trabaja de forma independiente. Desliza el cursor sobre ellos."}
                  </p>
                </div>
                {' '}
              </article>
              {' '}
              <article className="nv-b nv-b-height">
                {' '}
                <div className="nv-b-stack" aria-hidden="true">
                  <i>
                  </i>
                  <i>
                  </i>
                  <i>
                  </i>
                  <i>
                  </i>
                  <i>
                  </i>
                </div>
                {' '}
                <div className="nv-b-txt">
                  <b className="nv-b-big">
                    <span data-count="30">
                      {"0"}
                    </span>
                    <small>
                      {"cm"}
                    </small>
                  </b>
                  <h4 data-en="of hybrid height" data-es="de altura híbrida">
                    {"de altura híbrida"}
                  </h4>
                  <p data-en="5 premium layers, from pillow top to base." data-es="5 capas premium, del pillow top a la base.">
                    {"5 capas premium, del pillow top a la base."}
                  </p>
                </div>
                {' '}
              </article>
              {' '}
              <article className="nv-b nv-b-density">
                {' '}
                <div className="nv-b-txt">
                  <h4 data-en="Memory foam density" data-es="Densidad del memory foam">
                    {"Densidad del memory foam"}
                  </h4>
                </div>
                {' '}
                <div className="nv-b-bars">
                  {' '}
                  <div>
                    <span>
                      {"40D"}
                    </span>
                    <i>
                      <i style={{ "--w": ".92" }}>
                      </i>
                    </i>
                  </div>
                  {' '}
                  <div>
                    <span>
                      {"35D"}
                    </span>
                    <i>
                      <i style={{ "--w": ".8" }}>
                      </i>
                    </i>
                  </div>
                  {' '}
                </div>
                {' '}
                <p className="nv-b-note" data-en="Contours your body and relieves pressure." data-es="Se moldea a tu cuerpo y alivia la presión.">
                  {"Se moldea a tu cuerpo y alivia la presión."}
                </p>
                {' '}
              </article>
              {' '}
              <article className="nv-b nv-b-warranty">
                {' '}
                <svg className="nv-b-ring" viewBox="0 0 120 120" aria-hidden="true">
                  <circle cx="60" cy="60" r="52" />
                  <circle className="nv-b-ring-fill" cx="60" cy="60" r="52" />
                </svg>
                {' '}
                <div className="nv-b-ring-txt">
                  <b data-count="10">
                    {"0"}
                  </b>
                  <span data-en="years" data-es="años">
                    {"años"}
                  </span>
                </div>
                {' '}
                <p className="nv-b-note" data-en="Warranty against manufacturing defects." data-es="De garantía por defectos de fabricación.">
                  {"De garantía por defectos de fabricación."}
                </p>
                {' '}
              </article>
              {' '}
              <article className="nv-b nv-b-cool">
                {' '}
                <img src="images/ondas.jpg" alt="Textura de la tela Ice Cooling del colchón Nuvela" loading="lazy" />
                {' '}
                <div className="nv-b-cool-glow" aria-hidden="true">
                </div>
                {' '}
                <div className="nv-b-txt">
                  <h4 className="nv-b-mid">
                    {"Ice Cooling"}
                  </h4>
                  <p data-en="Fabric and gel memory foam that stay fresh all night." data-es="Tela y gel memory foam que se mantienen frescos toda la noche.">
                    {"Tela y gel memory foam que se mantienen frescos toda la noche."}
                  </p>
                </div>
                {' '}
              </article>
              {' '}
              <article className="nv-b nv-b-zip">
                {' '}
                <img src="images/zipper.jpg" alt="Pillow top desfundable con zipper del colchón Nuvela" loading="lazy" />
                {' '}
                <div className="nv-b-txt">
                  <h4 data-en="Removable pillow top" data-es="Pillow top desfundable">
                    {"Pillow top desfundable"}
                  </h4>
                </div>
                {' '}
              </article>
              {' '}
              <article className="nv-b nv-b-firm">
                {' '}
                <div className="nv-b-split" aria-hidden="true">
                  <span data-en="Soft" data-es="Suave">
                    {"Suave"}
                  </span>
                  <span data-en="Firm" data-es="Firme">
                    {"Firme"}
                  </span>
                </div>
                {' '}
                <div className="nv-b-txt">
                  <h4 data-en="Dual firmness" data-es="Doble firmeza">
                    {"Doble firmeza"}
                  </h4>
                  <p data-en="Each side, the feel you prefer." data-es="Cada lado, con la sensación que prefieras.">
                    {"Cada lado, con la sensación que prefieras."}
                  </p>
                </div>
                {' '}
              </article>
              {' '}
              <article className="nv-b nv-b-italy">
                {' '}
                <img src="images/detalle.jpg" alt="Logo dorado bordado en el lateral del colchón Nuvela" loading="lazy" />
                {' '}
                <div className="nv-b-txt">
                  <h4 className="nv-b-mid">
                    {"Italian Design"}
                  </h4>
                  <p data-en="Made in top-tier factories under the highest quality standards." data-es="Fabricado en las mejores fábricas bajo los más altos estándares de calidad.">
                    {"Fabricado en las mejores fábricas bajo los más altos estándares de calidad."}
                  </p>
                </div>
                {' '}
              </article>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* CERTIFICATIONS */}
        {' '}
        <section className="py-14 md:py-24 bg-ink text-white">
          {' '}
          <div className="max-w-7xl mx-auto px-6">
            {' '}
            <div className="text-center max-w-2xl mx-auto reveal">
              {' '}
              <p className="eyebrow text-gold-light" data-en="Certifications" data-es="Certificaciones">
                {"Certificaciones"}
              </p>
              {' '}
              <span className="gold-rule gold-rule-center mt-4">
              </span>
              {' '}
              <h3 className="font-serif text-4xl mt-8" data-en="Internationally certified." data-es="Certificación internacional.">
                {"Certificación internacional."}
              </h3>
              {' '}
            </div>
            {' '}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              {' '}
              <div className="border border-white/15 p-10 text-center reveal">
                {' '}
                <p className="font-serif text-3xl text-gold-light">
                  {"ISO 9001"}
                </p>
                {' '}
                <p className="text-white/70 text-sm mt-4 leading-relaxed" data-en="International quality management standard." data-es="Estándar internacional de gestión de calidad.">
                  {"Estándar internacional de gestión de calidad."}
                </p>
                {' '}
              </div>
              {' '}
              <div className="border border-white/15 p-10 text-center reveal reveal-delay-1">
                {' '}
                <p className="font-serif text-3xl text-gold-light">
                  {"OEKO-TEX®"}
                </p>
                {' '}
                <p className="text-white/70 text-sm mt-4 leading-relaxed" data-en="Textiles tested for harmful substances." data-es="Textiles libres de sustancias nocivas.">
                  {"Textiles libres de sustancias nocivas."}
                </p>
                {' '}
              </div>
              {' '}
              <div className="border border-white/15 p-10 text-center reveal reveal-delay-2">
                {' '}
                <p className="font-serif text-3xl text-gold-light">
                  {"Sanilized®"}
                </p>
                {' '}
                <p className="text-white/70 text-sm mt-4 leading-relaxed" data-en="Active antimicrobial protection." data-es="Protección antimicrobiana activa.">
                  {"Protección antimicrobiana activa."}
                </p>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
      </main>
    </>
  );
}

/* ---------- Página "precios" ---------- */
function PagePrecios() {
  return (
    <>
      <main id="page-precios" className="page">
        {' '}
        <section className="relative pt-28 pb-16 bg-cover bg-center bg-fixed bg-no-repeat overflow-hidden" style={{ "backgroundImage": "url('images/ondas.jpg')" }}>
          {' '}
          <div className="absolute inset-0 bg-white/40">
          </div>
          {' '}
          <div className="relative z-10">
            {' '}
            <div className="max-w-7xl mx-auto px-6 text-center reveal">
              {' '}
              <p className="eyebrow" data-en="Mattress Prices" data-es="Precios Colchones">
                {"Precios Colchones"}
              </p>
              {' '}
              <span className="gold-rule gold-rule-center mt-4">
              </span>
              {' '}
              <h2 className="font-serif text-5xl md:text-6xl text-ink mt-8 leading-[1.05]" data-en={"Every product.<br/>Every perfect size."} data-es={"Cada producto.<br/>Cada medida perfecta."}>
                {"Cada producto."}
                <br />
                {"Cada medida perfecta."}
              </h2>
              {' '}
              <p className="text-graphite mt-6 leading-relaxed max-w-xl mx-auto" data-en="Every Nuvela mattress includes a 10-year warranty. Shipping is calculated separately — from Q300 depending on your location." data-es="Cada colchón Nuvela incluye garantía de 10 años. El envío se cotiza por separado — desde Q300 según tu ubicación.">
                {"Cada colchón Nuvela incluye garantía de 10 años. El envío se cotiza por separado — desde Q300 según tu ubicación."}
              </p>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* PRICE CARDS: rendered by JS from the PRODUCTS array (renderPricing in the script at the */}
        {' '}
        {/* bottom of the page). Each product gets its OWN full-width <section> with its own HD texture */}
        {' '}
        {/* background (see PRODUCT_TEXTURES below), so sections read as separate, not one repeated tile. */}
        {' '}
        <div id="precios-container">
          {' '}
          {/* one <section> per product injected here by renderPricing() */}
          {' '}
        </div>
        {' '}
        {/* FINANCING */}
        {' '}
        <section className="py-14 md:py-24 bg-white">
          {' '}
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            {' '}
            <div className="reveal">
              {' '}
              <p className="eyebrow" data-en="Financing" data-es="Financiamiento">
                {"Financiamiento"}
              </p>
              {' '}
              <span className="gold-rule mt-4">
              </span>
              {' '}
              <h3 className="font-serif text-4xl text-ink mt-8 leading-tight" data-en="Pay your way." data-es="Paga a tu manera.">
                {"Paga a tu manera."}
              </h3>
              {' '}
              <p className="text-graphite mt-6 leading-relaxed" data-en="Flexible monthly payments available — up to 12 installments. Interest rates vary depending on the term and the participating bank. Contact us via WhatsApp for the exact rate based on your preferred plan." data-es="Pagos mensuales flexibles disponibles — hasta 12 cuotas. Las tasas de interés varían según el plazo y el banco participante. Escríbenos por WhatsApp para conocer la tasa exacta según el plan que elijas.">
                {"Pagos mensuales flexibles disponibles — hasta 12 cuotas. Las tasas de interés varían según el plazo y el banco participante. Escríbenos por WhatsApp para conocer la tasa exacta según el plan que elijas."}
              </p>
              {' '}
            </div>
            {' '}
            <div className="reveal reveal-delay-1">
              {' '}
              <div className="grid grid-cols-2 gap-3">
                {' '}
                <div className="bg-cream p-6 text-center rounded-xl">
                  <p className="font-serif text-3xl text-gold">
                    {"3"}
                  </p>
                  <p className="text-xs tracking-[0.2em] uppercase text-graphite mt-1" data-en="Months" data-es="Meses">
                    {"Meses"}
                  </p>
                </div>
                {' '}
                <div className="bg-cream p-6 text-center rounded-xl">
                  <p className="font-serif text-3xl text-gold">
                    {"6"}
                  </p>
                  <p className="text-xs tracking-[0.2em] uppercase text-graphite mt-1" data-en="Months" data-es="Meses">
                    {"Meses"}
                  </p>
                </div>
                {' '}
                <div className="bg-cream p-6 text-center rounded-xl">
                  <p className="font-serif text-3xl text-gold">
                    {"9"}
                  </p>
                  <p className="text-xs tracking-[0.2em] uppercase text-graphite mt-1" data-en="Months" data-es="Meses">
                    {"Meses"}
                  </p>
                </div>
                {' '}
                <div className="bg-cream p-6 text-center rounded-xl">
                  <p className="font-serif text-3xl text-gold">
                    {"12"}
                  </p>
                  <p className="text-xs tracking-[0.2em] uppercase text-graphite mt-1" data-en="Months" data-es="Meses">
                    {"Meses"}
                  </p>
                </div>
                {' '}
              </div>
              {' '}
              <p className="text-mist text-xs italic mt-4 leading-relaxed" data-en="* Interest rates vary depending on the chosen term. Subject to bank approval." data-es="* Las tasas de interés varían según el plazo elegido. Sujeto a aprobación bancaria.">
                {"* Las tasas de interés varían según el plazo elegido. Sujeto a aprobación bancaria."}
              </p>
              {' '}
              <a href="https://wa.me/50253984599" target="_blank" rel="noopener" className="btn-outline mt-6 w-full md:w-auto" data-en="Quote your plan via WhatsApp" data-es="Cotiza tu plan por WhatsApp">
                {"Cotiza tu plan por WhatsApp"}
              </a>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
      </main>
    </>
  );
}

/* ---------- Página "entregas" ---------- */
function PageEntregas() {
  return (
    <>
      <main id="page-entregas" className="page nv-page">
        {' '}
        <section className="nv-ph nv-ph-photo">
          {' '}
          <div className="nv-ph-bg" aria-hidden="true">
            <img src="images/entrega.jpg" alt="Entrega a domicilio de un colchón Nuvela en su caja" />
          </div>
          {' '}
          <div className="nv-ph-inner">
            {' '}
            <p className="nv-eyebrow" data-en="Delivery" data-es="Entregas">
              {"Entregas"}
            </p>
            {' '}
            <h2 className="nv-display nv-ph-title" data-en={"From our door<br/>to yours."} data-es={"De nuestra puerta<br/>a la tuya."}>
              {"De nuestra puerta"}
              <br />
              {"a la tuya."}
            </h2>
            {' '}
            <ul className="nv-cita-chips">
              <li data-en="All of Guatemala" data-es="A todo Guatemala">
                {"A todo Guatemala"}
              </li>
              <li data-en="Shipping from Q300" data-es="Envío desde Q300">
                {"Envío desde Q300"}
              </li>
              <li data-en="Coordinated by WhatsApp" data-es="Coordinado por WhatsApp">
                {"Coordinado por WhatsApp"}
              </li>
            </ul>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Tiempos y costo */}
        {' '}
        <section className="nv-light nv-sec">
          {' '}
          <div className="nv-wrap">
            {' '}
            <p className="nv-eyebrow" data-en="Times & cost" data-es="Tiempos y costo">
              {"Tiempos y costo"}
            </p>
            {' '}
            <h3 className="nv-h2" data-en="Clear, from day one." data-es="Claro, desde el primer día.">
              {"Claro, desde el primer día."}
            </h3>
            {' '}
            <div className="nv-del-stats">
              {' '}
              <article className="nv-lcard">
                <b>
                  <span data-count="3">
                    {"0"}
                  </span>
                  {"–"}
                  <span data-count="5">
                    {"0"}
                  </span>
                </b>
                <h4 data-en="business days" data-es="días hábiles">
                  {"días hábiles"}
                </h4>
                <p data-en="Guatemala City metropolitan area." data-es="Área metropolitana de la Ciudad de Guatemala.">
                  {"Área metropolitana de la Ciudad de Guatemala."}
                </p>
              </article>
              {' '}
              <article className="nv-lcard">
                <b>
                  <span data-count="5">
                    {"0"}
                  </span>
                  {"–"}
                  <span data-count="10">
                    {"0"}
                  </span>
                </b>
                <h4 data-en="business days" data-es="días hábiles">
                  {"días hábiles"}
                </h4>
                <p data-en="Departments, with the fee adjusted to the destination." data-es="Departamentos, con el costo ajustado al destino.">
                  {"Departamentos, con el costo ajustado al destino."}
                </p>
              </article>
              {' '}
              <article className="nv-lcard">
                <b>
                  {"Q"}
                  <span data-count="300">
                    {"0"}
                  </span>
                </b>
                <h4 data-en="starting shipping fee" data-es="envío desde">
                  {"envío desde"}
                </h4>
                <p data-en="We quote the exact fee for your address by WhatsApp." data-es="Te cotizamos el costo exacto a tu dirección por WhatsApp.">
                  {"Te cotizamos el costo exacto a tu dirección por WhatsApp."}
                </p>
              </article>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Recorrido de tu pedido */}
        {' '}
        <section className="nv-dark nv-sec">
          {' '}
          <div className="nv-wrap">
            {' '}
            <p className="nv-eyebrow" data-en="Your order's journey" data-es="El camino de tu pedido">
              {"El camino de tu pedido"}
            </p>
            {' '}
            <h3 className="nv-h2" data-en={"Four steps<br/>to your first night."} data-es={"Cuatro pasos<br/>a tu primera noche."}>
              {"Cuatro pasos"}
              <br />
              {"a tu primera noche."}
            </h3>
            {' '}
            <ol className="nv-steps nv-del-steps">
              <i className="nv-steps-line" aria-hidden="true">
                <i>
                </i>
              </i>
              <li>
                <span>
                  {"01"}
                </span>
                <h4 data-en="Confirm your order" data-es="Confirmas tu pedido">
                  {"Confirmas tu pedido"}
                </h4>
                <p data-en="Online or with your advisor." data-es="En línea o con tu asesor.">
                  {"En línea o con tu asesor."}
                </p>
              </li>
              <li>
                <span>
                  {"02"}
                </span>
                <h4 data-en="We schedule together" data-es="Coordinamos contigo">
                  {"Coordinamos contigo"}
                </h4>
                <p data-en="We agree on a delivery window by WhatsApp." data-es="Acordamos una ventana de entrega por WhatsApp.">
                  {"Acordamos una ventana de entrega por WhatsApp."}
                </p>
              </li>
              <li>
                <span>
                  {"03"}
                </span>
                <h4 data-en="It travels protected" data-es="Viaja protegido">
                  {"Viaja protegido"}
                </h4>
                <p data-en="In its premium packaging, ready for an unboxing." data-es="En su empaque premium, cuidado en cada detalle.">
                  {"En su empaque premium, cuidado en cada detalle."}
                </p>
              </li>
              <li>
                <span>
                  {"04"}
                </span>
                <h4 data-en="Your first night" data-es="Tu primera noche">
                  {"Tu primera noche"}
                </h4>
                <p data-en="Sleep well. Always." data-es="Duerme Bien Siempre.">
                  {"Duerme Bien Siempre."}
                </p>
              </li>
            </ol>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Empaque */}
        {' '}
        <section className="nv-light nv-sec">
          {' '}
          <div className="nv-wrap nv-split2">
            {' '}
            <div>
              {' '}
              <p className="nv-eyebrow" data-en="Packaging" data-es="Empaque">
                {"Empaque"}
              </p>
              {' '}
              <h3 className="nv-h2" data-en={"A first impression<br/>worth keeping."} data-es={"Una primera impresión<br/>que vale conservar."}>
                {"Una primera impresión"}
                <br />
                {"que vale conservar."}
              </h3>
              {' '}
              <p className="nv-lead" data-en="Each Nuvela mattress arrives in protective premium packaging — free of unnecessary plastics, designed to safeguard the product, and elegant enough to feel like an unboxing." data-es="Cada colchón Nuvela llega en un empaque premium protector — sin plásticos innecesarios, diseñado para resguardar el producto, con una presentación a la altura del producto.">
                {"Cada colchón Nuvela llega en un empaque premium protector — sin plásticos innecesarios, diseñado para resguardar el producto, con una presentación a la altura del producto."}
              </p>
              {' '}
            </div>
            {' '}
            <div className="nv-split2-img">
              <img src="images/cajas.jpg" alt="Cajas de empaque Nuvela" loading="lazy" />
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Preguntas de entregas */}
        {' '}
        <section className="nv-light nv-sec nv-sec-tight">
          {' '}
          <div className="nv-wrap nv-narrow">
            {' '}
            <p className="nv-eyebrow" data-en="Delivery FAQ" data-es="Preguntas de entregas">
              {"Preguntas de entregas"}
            </p>
            {' '}
            <h3 className="nv-h2" data-en="Common questions." data-es="Preguntas frecuentes.">
              {"Preguntas frecuentes."}
            </h3>
            {' '}
            <div className="nv-faq-list">
              {' '}
              <div className="faq-item">
                {' '}
                <div className="faq-q">
                  <span data-en="How much does delivery cost?" data-es="¿Cuánto cuesta el envío?">
                    {"¿Cuánto cuesta el envío?"}
                  </span>
                  <span className="icon">
                    {"+"}
                  </span>
                </div>
                {' '}
                <div className="faq-a">
                  <div className="faq-a-inner" data-en="Delivery fee starts at Q300 and varies depending on your location. Contact us via WhatsApp for an exact quote." data-es="El envío inicia desde Q300 y varía según tu ubicación. Escríbenos por WhatsApp para cotizarte el costo exacto.">
                    {"El envío inicia desde Q300 y varía según tu ubicación. Escríbenos por WhatsApp para cotizarte el costo exacto."}
                  </div>
                </div>
                {' '}
              </div>
              {' '}
              <div className="faq-item">
                {' '}
                <div className="faq-q">
                  <span data-en="Do you deliver outside the metropolitan area?" data-es="¿Hacen envíos fuera del área metropolitana?">
                    {"¿Hacen envíos fuera del área metropolitana?"}
                  </span>
                  <span className="icon">
                    {"+"}
                  </span>
                </div>
                {' '}
                <div className="faq-a">
                  <div className="faq-a-inner" data-en="Yes — we deliver throughout Guatemala. The shipping fee is adjusted based on the destination." data-es="Sí — realizamos envíos a todo Guatemala. El costo de envío se ajusta según el destino.">
                    {"Sí — realizamos envíos a todo Guatemala. El costo de envío se ajusta según el destino."}
                  </div>
                </div>
                {' '}
              </div>
              {' '}
              <div className="faq-item">
                {' '}
                <div className="faq-q">
                  <span data-en="What if I'm not home for delivery?" data-es="¿Qué pasa si no estoy en casa para la entrega?">
                    {"¿Qué pasa si no estoy en casa para la entrega?"}
                  </span>
                  <span className="icon">
                    {"+"}
                  </span>
                </div>
                {' '}
                <div className="faq-a">
                  <div className="faq-a-inner" data-en="No problem. We'll coordinate a delivery window with you in advance via WhatsApp and reschedule if needed." data-es="Con gusto lo resolvemos. Coordinamos contigo por WhatsApp una ventana de entrega y podemos reagendar si es necesario.">
                    {"Con gusto lo resolvemos. Coordinamos contigo por WhatsApp una ventana de entrega y podemos reagendar si es necesario."}
                  </div>
                </div>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Para quien ya recibió su colchón */}
        {' '}
        <section className="nv-light nv-sec nv-owner">
          {' '}
          <div className="nv-wrap">
            {' '}
            <p className="nv-eyebrow" data-en="Already sleeping on a Nuvela?" data-es="¿Ya recibiste tu Nuvela?">
              {"¿Ya recibiste tu Nuvela?"}
            </p>
            {' '}
            <h3 className="nv-h2" data-en={"We stay with you<br/>after delivery."} data-es={"Te acompañamos<br/>después de la entrega."}>
              {"Te acompañamos"}
              <br />
              {"después de la entrega."}
            </h3>
            {' '}
            <div className="nv-del-stats nv-after-grid">
              {' '}
              <article className="nv-lcard">
                <h4 data-en="Care" data-es="Cuidado">
                  {"Cuidado"}
                </h4>
                <p data-en="Use a quality mattress protector, vacuum it every few months and rotate it head-to-foot every 3 months for even wear." data-es="Usa un protector de colchón de calidad, aspíralo cada pocos meses y gíralo cabecera-pies cada 3 meses para un desgaste uniforme.">
                  {"Usa un protector de colchón de calidad, aspíralo cada pocos meses y gíralo cabecera-pies cada 3 meses para un desgaste uniforme."}
                </p>
              </article>
              {' '}
              <article className="nv-lcard">
                <h4 data-en="Warranty" data-es="Garantía">
                  {"Garantía"}
                </h4>
                <p data-en="Your 10-year warranty is activated automatically on the delivery date. Keep your invoice as proof of purchase." data-es="Tu garantía de 10 años se activa automáticamente con la fecha de entrega. Conserva tu factura como prueba de compra.">
                  {"Tu garantía de 10 años se activa automáticamente con la fecha de entrega. Conserva tu factura como prueba de compra."}
                </p>
              </article>
              {' '}
              <article className="nv-lcard">
                <h4 data-en="Your opinion" data-es="Tu opinión">
                  {"Tu opinión"}
                </h4>
                <p data-en="Your review helps other people decide." data-es="Tu reseña ayuda a otras personas a decidir.">
                  {"Tu reseña ayuda a otras personas a decidir."}
                </p>
                <a className="nv-owner-link" href="https://maps.app.goo.gl/7jxuZavDRfuQANMd8" target="_blank" rel="noopener" data-en="Leave a review on Google →" data-es="Dejar una reseña en Google →">
                  {"Dejar una reseña en Google →"}
                </a>
              </article>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        <section className="nv-dark nv-cta-band">
          {' '}
          <div className="nv-wrap">
            {' '}
            <h3 className="nv-h2" data-en={"Quote the shipping<br/>to your address."} data-es={"Cotiza el envío<br/>a tu dirección."}>
              {"Cotiza el envío"}
              <br />
              {"a tu dirección."}
            </h3>
            {' '}
            <div className="nv-hero-actions">
              <a href="https://wa.me/50253984599?text=Hola%20Nuvela%2C%20quiero%20cotizar%20el%20env%C3%ADo%20a%20mi%20direcci%C3%B3n" target="_blank" rel="noopener" className="btn-gold nv-magnetic">
                {"WhatsApp"}
              </a>
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
      </main>
    </>
  );
}

/* ---------- Página "cita" ---------- */
function PageCita() {
  return (
    <>
      <main id="page-cita" className="page nv-cita">
        {' '}
        {/* Portada */}
        {' '}
        <section className="nv-cita-hero">
          {' '}
          <canvas id="nv-cita-canvas" aria-hidden="true">
          </canvas>
          {' '}
          <div className="nv-cita-grid">
            {' '}
            <div className="nv-cita-copy">
              {' '}
              <p className="nv-eyebrow" data-en="Book an Appointment" data-es="Agenda tu Cita">
                {"Agenda tu Cita"}
              </p>
              {' '}
              <h2 className="nv-display nv-cita-title" data-en={"Come feel it<br/>for yourself."} data-es={"Ven a sentirlo<br/>en persona."}>
                {"Ven a sentirlo"}
                <br />
                {"en persona."}
              </h2>
              {' '}
              <p className="nv-lead" data-en="A private showroom in Zone 9 where you can lie down, compare and decide calmly — with an advisor just for you." data-es="Un showroom privado en Zona 9 donde puedes acostarte, comparar y decidir con calma — con un asesor solo para ti.">
                {"Un showroom privado en Zona 9 donde puedes acostarte, comparar y decidir con calma — con un asesor solo para ti."}
              </p>
              {' '}
              <ul className="nv-cita-chips">
                <li data-en="Monday to Saturday" data-es="Lunes a Sábado">
                  {"Lunes a Sábado"}
                </li>
                <li data-en="11:00am – 5:00pm" data-es="11:00am – 5:00pm">
                  {"11:00am – 5:00pm"}
                </li>
                <li data-en="30-minute appointments" data-es="Citas de 30 min">
                  {"Citas de 30 min"}
                </li>
                <li data-en="Zone 9 · By appointment" data-es="Zona 9 · Con cita">
                  {"Zona 9 · Con cita"}
                </li>
              </ul>
              {' '}
              <div className="nv-hero-actions nv-cita-actions">
                {' '}
                <a href="https://calendar.app.google/Tgxa44AVsYCLJELc6" target="_blank" rel="noopener" className="btn-gold nv-magnetic" data-en="View times and book" data-es="Ver horarios y agendar">
                  {"Ver horarios y agendar"}
                </a>
                {' '}
                <a href="https://wa.me/50253984599?text=Hola%20Nuvela%2C%20quiero%20agendar%20una%20visita%20al%20showroom" target="_blank" rel="noopener" className="nv-btn-ghost nv-magnetic">
                  {"WhatsApp"}
                </a>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
            <div className="nv-cita-photo">
              {' '}
              <img src="images/hero-mattress.jpg" alt="Colchón Nuvela en una habitación" />
              {' '}
              <div className="nv-cita-badge">
                <b data-en="Private" data-es="Privado">
                  {"Privado"}
                </b>
                <span data-en="showroom" data-es="showroom">
                  {"showroom"}
                </span>
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Qué esperar */}
        {' '}
        <section className="nv-cita-steps">
          {' '}
          <div className="nv-wrap">
            {' '}
            <p className="nv-eyebrow" data-en="Your visit" data-es="Tu visita">
              {"Tu visita"}
            </p>
            {' '}
            <h3 className="nv-h2" data-en={"30 minutes that change<br/>how you sleep."} data-es={"30 minutos que cambian<br/>cómo duermes."}>
              {"30 minutos que cambian"}
              <br />
              {"cómo duermes."}
            </h3>
            {' '}
            <div className="nv-cita-cards">
              {' '}
              <article className="nv-card nv-tilt-c">
                <span className="nv-card-num">
                  {"01"}
                </span>
                <h4 data-en="Book your time" data-es="Elige tu horario">
                  {"Elige tu horario"}
                </h4>
                <p data-en="Pick a slot in the calendar; you'll get an email confirmation right away." data-es="Escoge un horario en el calendario; te llega un correo de confirmación al instante.">
                  {"Escoge un horario en el calendario; te llega un correo de confirmación al instante."}
                </p>
              </article>
              {' '}
              <article className="nv-card nv-tilt-c">
                <span className="nv-card-num">
                  {"02"}
                </span>
                <h4 data-en="Try it calmly" data-es="Pruébalo con calma">
                  {"Pruébalo con calma"}
                </h4>
                <p data-en="Lie down, feel the layers and the springs, and compare sizes and pillows." data-es="Acuéstate, siente las capas y los resortes, y compara medidas y almohadas.">
                  {"Acuéstate, siente las capas y los resortes, y compara medidas y almohadas."}
                </p>
              </article>
              {' '}
              <article className="nv-card nv-tilt-c">
                <span className="nv-card-num">
                  {"03"}
                </span>
                <h4 data-en="Decide without pressure" data-es="Decide a tu ritmo">
                  {"Decide a tu ritmo"}
                </h4>
                <p data-en="We help you with size, delivery and payment options." data-es="Te ayudamos con la medida, el envío y las formas de pago.">
                  {"Te ayudamos con la medida, el envío y las formas de pago."}
                </p>
              </article>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Equipo + botón del calendario (lo dibuja renderCitaAsesores) */}
        {' '}
        <section className="nv-cita-team">
          {' '}
          <div className="nv-wrap">
            {' '}
            <p className="nv-eyebrow" data-en="Your team" data-es="Tu equipo">
              {"Tu equipo"}
            </p>
            {' '}
            <h3 className="nv-h2" data-en={"Meet your team,<br/>then book your time."} data-es={"Conoce a tu equipo<br/>y agenda tu horario."}>
              {"Conoce a tu equipo"}
              <br />
              {"y agenda tu horario."}
            </h3>
            {' '}
            <p className="nv-lead" data-en="It opens in a new tab, and you'll tell us which advisor you prefer inside the calendar." data-es="Se abre en una pestaña nueva y nos dices a qué asesor prefieres dentro del calendario.">
              {"Se abre en una pestaña nueva y nos dices a qué asesor prefieres dentro del calendario."}
            </p>
            {' '}
            <div id="cita-calendar-wrap" className="mt-10">
              {' '}
              {/* injected by renderCitaAsesores() */}
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Sucursales -> mapa (lo dibuja renderCitaSucursales) */}
        {' '}
        <section className="nv-cita-map">
          {' '}
          <div className="nv-wrap">
            {' '}
            <p className="nv-eyebrow" data-en="Our Locations" data-es="Nuestras Sucursales">
              {"Nuestras Sucursales"}
            </p>
            {' '}
            <h3 className="nv-h2" data-en="Find us." data-es="Encuéntranos.">
              {"Encuéntranos."}
            </h3>
            {' '}
            <div id="cita-sucursales" className="mt-10 grid gap-8">
              {' '}
              {/* injected by renderCitaSucursales() */}
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
      </main>
    </>
  );
}

/* ---------- Página "resenas" ---------- */
function PageResenas() {
  return (
    <>
      <main id="page-resenas" className="page nv-page">
        {' '}
        <section className="nv-ph nv-ph-plain">
          {' '}
          <canvas id="nv-res-canvas" aria-hidden="true">
          </canvas>
          {' '}
          <div className="nv-ph-inner nv-center">
            {' '}
            <div className="nv-res-stars" aria-hidden="true">
              <i>
                {"★"}
              </i>
              <i>
                {"★"}
              </i>
              <i>
                {"★"}
              </i>
              <i>
                {"★"}
              </i>
              <i>
                {"★"}
              </i>
            </div>
            {' '}
            <p className="nv-eyebrow" data-en="Reviews" data-es="Reseñas">
              {"Reseñas"}
            </p>
            {' '}
            <h2 className="nv-display nv-ph-title" data-en={"Told by those<br/>who sleep better."} data-es={"Contado por quienes<br/>ya duermen mejor."}>
              {"Contado por quienes"}
              <br />
              {"ya duermen mejor."}
            </h2>
            {' '}
            <p className="nv-lead nv-center-lead" data-en="Real reviews straight from our Google Business profile." data-es="Reseñas reales, directo de nuestro perfil de Google.">
              {"Reseñas reales, directo de nuestro perfil de Google."}
            </p>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        <section className="nv-light nv-sec">
          {' '}
          <div className="nv-wrap">
            {' '}
            <div id="resenas-wrap">
              {' '}
              {/* injected by renderGoogleReviews() */}
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        <section className="nv-dark nv-cta-band">
          {' '}
          <div className="nv-wrap">
            {' '}
            <p className="nv-eyebrow" data-en="Already sleeping on Nuvela?" data-es="¿Ya duermes en Nuvela?">
              {"¿Ya duermes en Nuvela?"}
            </p>
            {' '}
            <h3 className="nv-h2" data-en={"Tell us how<br/>you wake up."} data-es={"Cuéntanos cómo<br/>despiertas."}>
              {"Cuéntanos cómo"}
              <br />
              {"despiertas."}
            </h3>
            {' '}
            <div className="nv-hero-actions">
              <a href="https://maps.app.goo.gl/7jxuZavDRfuQANMd8" target="_blank" rel="noopener" className="btn-gold nv-magnetic" data-en="Leave a review on Google" data-es="Déjanos tu reseña en Google">
                {"Déjanos tu reseña en Google"}
              </a>
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
      </main>
    </>
  );
}

/* ---------- Página "faq" ---------- */
function PageFaq() {
  return (
    <>
      <main id="page-faq" className="page nv-page">
        {' '}
        <section className="nv-ph nv-ph-plain">
          {' '}
          <canvas id="nv-faq-canvas" aria-hidden="true">
          </canvas>
          {' '}
          <div className="nv-ph-inner nv-center">
            {' '}
            <p className="nv-eyebrow" data-en="Frequently Asked" data-es="Preguntas Frecuentes">
              {"Preguntas Frecuentes"}
            </p>
            {' '}
            <h2 className="nv-display nv-ph-title" data-en={"Answers,<br/>in advance."} data-es={"Respuestas,<br/>por adelantado."}>
              {"Respuestas,"}
              <br />
              {"por adelantado."}
            </h2>
            {' '}
            <label className="nv-faq-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input id="nv-faq-input" type="search" placeholder="Busca tu pregunta…" data-en-placeholder="Search your question…" data-es-placeholder="Busca tu pregunta…" autoComplete="off" />
            </label>
            {' '}
            <div className="nv-faq-chips">
              <button type="button" className="nv-faq-chip is-on" data-cat="all" data-en="All" data-es="Todas">
                {"Todas"}
              </button>
              <button type="button" className="nv-faq-chip" data-cat="garantia" data-en="Warranty" data-es="Garantía">
                {"Garantía"}
              </button>
              <button type="button" className="nv-faq-chip" data-cat="envios" data-en="Shipping" data-es="Envíos">
                {"Envíos"}
              </button>
              <button type="button" className="nv-faq-chip" data-cat="pagos" data-en="Payments" data-es="Pagos">
                {"Pagos"}
              </button>
              <button type="button" className="nv-faq-chip" data-cat="firmeza" data-en="Firmness" data-es="Firmeza">
                {"Firmeza"}
              </button>
              <button type="button" className="nv-faq-chip" data-cat="materiales" data-en="Materials" data-es="Materiales">
                {"Materiales"}
              </button>
              <button type="button" className="nv-faq-chip" data-cat="limpieza" data-en="Cleaning" data-es="Limpieza">
                {"Limpieza"}
              </button>
              <button type="button" className="nv-faq-chip" data-cat="entregas" data-en="Delivery" data-es="Entregas">
                {"Entregas"}
              </button>
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        <section className="nv-light nv-sec nv-sec-tight">
          {' '}
          <div className="nv-wrap nv-narrow">
            {' '}
            <div className="nv-faq-list" id="nv-faq-all">
              {' '}
              <div className="nv-faq-group" data-cat="garantia">
                <p className="nv-faq-cat" data-en="Warranty" data-es="Garantía">
                  {"Garantía"}
                </p>
                <div className="faq-item">
                  {' '}
                  <div className="faq-q">
                    <span data-en="What does the warranty cover?" data-es="¿Qué cubre la garantía?">
                      {"¿Qué cubre la garantía?"}
                    </span>
                    <span className="icon">
                      {"+"}
                    </span>
                  </div>
                  {' '}
                  <div className="faq-a">
                    <div className="faq-a-inner" data-en="Our 10-year warranty covers manufacturing defects in materials and workmanship. Full terms are detailed in the warranty document delivered with your mattress." data-es="Nuestra garantía de 10 años cubre defectos de fabricación en materiales y mano de obra. Los términos completos se detallan en el documento de garantía que se entrega con tu colchón.">
                      {"Nuestra garantía de 10 años cubre defectos de fabricación en materiales y mano de obra. Los términos completos se detallan en el documento de garantía que se entrega con tu colchón."}
                    </div>
                  </div>
                  {' '}
                </div>
                <div className="faq-item">
                  {' '}
                  <div className="faq-q">
                    <span data-en="How do I activate my warranty?" data-es="¿Cómo activo mi garantía?">
                      {"¿Cómo activo mi garantía?"}
                    </span>
                    <span className="icon">
                      {"+"}
                    </span>
                  </div>
                  {' '}
                  <div className="faq-a">
                    <div className="faq-a-inner" data-en="Your warranty activates automatically with your delivery date. Keep your invoice as proof of purchase." data-es="Tu garantía se activa automáticamente con la fecha de entrega. Conserva tu factura como prueba de compra.">
                      {"Tu garantía se activa automáticamente con la fecha de entrega. Conserva tu factura como prueba de compra."}
                    </div>
                  </div>
                  {' '}
                </div>
              </div>
              {' '}
              <div className="nv-faq-group" data-cat="envios">
                <p className="nv-faq-cat" data-en="Shipping" data-es="Envíos">
                  {"Envíos"}
                </p>
                <div className="faq-item">
                  {' '}
                  <div className="faq-q">
                    <span data-en="How much does delivery cost?" data-es="¿Cuánto cuesta el envío?">
                      {"¿Cuánto cuesta el envío?"}
                    </span>
                    <span className="icon">
                      {"+"}
                    </span>
                  </div>
                  {' '}
                  <div className="faq-a">
                    <div className="faq-a-inner" data-en="Delivery starts at Q300 and varies depending on your location. We deliver throughout Guatemala. Contact us via WhatsApp for an exact quote." data-es="El envío inicia desde Q300 y varía según tu ubicación. Realizamos envíos a todo Guatemala. Escríbenos por WhatsApp para cotizarte exacto.">
                      {"El envío inicia desde Q300 y varía según tu ubicación. Realizamos envíos a todo Guatemala. Escríbenos por WhatsApp para cotizarte exacto."}
                    </div>
                  </div>
                  {' '}
                </div>
              </div>
              {' '}
              <div className="nv-faq-group" data-cat="pagos">
                <p className="nv-faq-cat" data-en="Payments" data-es="Pagos">
                  {"Pagos"}
                </p>
                <div className="faq-item">
                  {' '}
                  <div className="faq-q">
                    <span data-en="What payment methods do you accept?" data-es="¿Qué formas de pago aceptan?">
                      {"¿Qué formas de pago aceptan?"}
                    </span>
                    <span className="icon">
                      {"+"}
                    </span>
                  </div>
                  {' '}
                  <div className="faq-a">
                    <div className="faq-a-inner" data-en="We accept bank transfer, Visa Cuotas installments and one-time card payment. Your advisor confirms the payment method with you when confirming your order." data-es="Aceptamos transferencia bancaria, Visa Cuotas y pago de contado con tarjeta. Tu asesor confirma contigo la forma de pago al confirmar tu pedido.">
                      {"Aceptamos transferencia bancaria, Visa Cuotas y pago de contado con tarjeta. Tu asesor confirma contigo la forma de pago al confirmar tu pedido."}
                    </div>
                  </div>
                  {' '}
                </div>
              </div>
              {' '}
              <div className="nv-faq-group" data-cat="firmeza">
                <p className="nv-faq-cat" data-en="Firmness" data-es="Firmeza">
                  {"Firmeza"}
                </p>
                <div className="faq-item">
                  {' '}
                  <div className="faq-q">
                    <span data-en="How firm is the Nuvela mattress?" data-es="¿Qué tan firme es el colchón Nuvela?">
                      {"¿Qué tan firme es el colchón Nuvela?"}
                    </span>
                    <span className="icon">
                      {"+"}
                    </span>
                  </div>
                  {' '}
                  <div className="faq-a">
                    <div className="faq-a-inner" data-en="The Nuvela mattress has a 7/10 firmness and the Nuvela Diamond a 6/10, on a scale where 10 is the firmest. The best way to feel the difference is to try them at the showroom." data-es="El Colchón Nuvela tiene una firmeza de 7/10 y el Nuvela Diamond de 6/10, en una escala donde 10 es lo más firme. Lo mejor es probarlos en el showroom para sentir la diferencia.">
                      {"El Colchón Nuvela tiene una firmeza de 7/10 y el Nuvela Diamond de 6/10, en una escala donde 10 es lo más firme. Lo mejor es probarlos en el showroom para sentir la diferencia."}
                    </div>
                  </div>
                  {' '}
                </div>
              </div>
              {' '}
              <div className="nv-faq-group" data-cat="materiales">
                <p className="nv-faq-cat" data-en="Materials" data-es="Materiales">
                  {"Materiales"}
                </p>
                <div className="faq-item">
                  {' '}
                  <div className="faq-q">
                    <span data-en="Are the materials safe and certified?" data-es="¿Los materiales son seguros y certificados?">
                      {"¿Los materiales son seguros y certificados?"}
                    </span>
                    <span className="icon">
                      {"+"}
                    </span>
                  </div>
                  {' '}
                  <div className="faq-a">
                    <div className="faq-a-inner" data-en="Yes. Our textiles are OEKO-TEX® certified (free of harmful substances), our antimicrobial treatment is Sanilized®, and our manufacturing follows ISO 9001 quality standards." data-es="Sí. Nuestros textiles están certificados OEKO-TEX® (libres de sustancias nocivas), el tratamiento antimicrobiano es Sanilized®, y la fabricación sigue estándares de calidad ISO 9001.">
                      {"Sí. Nuestros textiles están certificados OEKO-TEX® (libres de sustancias nocivas), el tratamiento antimicrobiano es Sanilized®, y la fabricación sigue estándares de calidad ISO 9001."}
                    </div>
                  </div>
                  {' '}
                </div>
              </div>
              {' '}
              <div className="nv-faq-group" data-cat="limpieza">
                <p className="nv-faq-cat" data-en="Cleaning" data-es="Limpieza">
                  {"Limpieza"}
                </p>
                <div className="faq-item">
                  {' '}
                  <div className="faq-q">
                    <span data-en="How do I clean and care for my mattress?" data-es="¿Cómo limpio y cuido mi colchón?">
                      {"¿Cómo limpio y cuido mi colchón?"}
                    </span>
                    <span className="icon">
                      {"+"}
                    </span>
                  </div>
                  {' '}
                  <div className="faq-a">
                    <div className="faq-a-inner" data-en="Use a quality mattress protector. For spills: spot-clean with a dry cloth and a mild solution. Vacuum every few months. Rotate head-to-toe every 3 months for even wear." data-es="Usa un protector de colchón de calidad. Para derrames: limpia con un paño seco y una solución suave. Aspira cada pocos meses. Gira el colchón cabecera-pies cada 3 meses para un desgaste uniforme.">
                      {"Usa un protector de colchón de calidad. Para derrames: limpia con un paño seco y una solución suave. Aspira cada pocos meses. Gira el colchón cabecera-pies cada 3 meses para un desgaste uniforme."}
                    </div>
                  </div>
                  {' '}
                </div>
              </div>
              {' '}
              <div className="nv-faq-group" data-cat="entregas">
                <p className="nv-faq-cat" data-en="Delivery" data-es="Entregas">
                  {"Entregas"}
                </p>
                <div className="faq-item">
                  {' '}
                  <div className="faq-q">
                    <span data-en="How long does delivery take?" data-es="¿Cuánto tarda la entrega?">
                      {"¿Cuánto tarda la entrega?"}
                    </span>
                    <span className="icon">
                      {"+"}
                    </span>
                  </div>
                  {' '}
                  <div className="faq-a">
                    <div className="faq-a-inner" data-en="3–5 business days within the Guatemala City metropolitan area, 5–10 business days for departments. We'll confirm a specific window after your order." data-es="3–5 días hábiles en el área metropolitana de Ciudad de Guatemala, 5–10 días hábiles en los departamentos. Confirmaremos una ventana específica tras tu pedido.">
                      {"3–5 días hábiles en el área metropolitana de Ciudad de Guatemala, 5–10 días hábiles en los departamentos. Confirmaremos una ventana específica tras tu pedido."}
                    </div>
                  </div>
                  {' '}
                </div>
              </div>
              {' '}
            </div>
            {' '}
            <p className="nv-faq-empty" id="nv-faq-empty" data-en="No results. Try another word or write to us on WhatsApp." data-es="Sin resultados. Prueba otra palabra o escríbenos por WhatsApp.">
              {"Sin resultados. Prueba otra palabra o escríbenos por WhatsApp."}
            </p>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        <section className="nv-dark nv-cta-band">
          {' '}
          <div className="nv-wrap">
            {' '}
            <h3 className="nv-h2" data-en="Still have questions?" data-es="¿Aún tienes preguntas?">
              {"¿Aún tienes preguntas?"}
            </h3>
            {' '}
            <p className="nv-lead nv-center-lead" data-en="Speak with our concierge — we respond within hours." data-es="Habla con nuestro concierge — respondemos en horas.">
              {"Habla con nuestro concierge — respondemos en horas."}
            </p>
            {' '}
            <div className="nv-hero-actions">
              <a href="https://wa.me/50253984599" target="_blank" rel="noopener" className="btn-gold nv-magnetic">
                {"WhatsApp"}
              </a>
              <button data-page="contacto" className="nv-btn-ghost nv-magnetic" data-en="Contact Us" data-es="Contáctanos">
                {"Contáctanos"}
              </button>
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
      </main>
    </>
  );
}

/* ---------- Página "contacto" ---------- */
function PageContacto() {
  return (
    <>
      <main id="page-contacto" className="page nv-page">
        {' '}
        <section className="nv-contact">
          {' '}
          <div className="nv-contact-left nv-dark">
            {' '}
            <canvas id="nv-contact-canvas" aria-hidden="true">
            </canvas>
            {' '}
            <div className="nv-contact-left-inner">
              {' '}
              <p className="nv-eyebrow" data-en="Contact" data-es="Contáctanos">
                {"Contáctanos"}
              </p>
              {' '}
              <h2 className="nv-display nv-ph-title" data-en={"Let's talk<br/>sleep."} data-es={"Hablemos<br/>del descanso."}>
                {"Hablemos"}
                <br />
                {"del descanso."}
              </h2>
              {' '}
              <p className="nv-lead" data-en="Our concierge team is here to help — by message, by call, or in person." data-es="Nuestro equipo concierge está aquí para ayudarte — por mensaje, llamada o en persona.">
                {"Nuestro equipo concierge está aquí para ayudarte — por mensaje, llamada o en persona."}
              </p>
              {' '}
              <div className="nv-channels">
                {' '}
                <a className="nv-channel" href="https://wa.me/50253984599" target="_blank" rel="noopener">
                  <span>
                    {"WhatsApp"}
                  </span>
                  <b>
                    {"+502 5398 4599"}
                  </b>
                  <i>
                    {"→"}
                  </i>
                </a>
                {' '}
                <a className="nv-channel" href="mailto:comercial@nuvelagt.com">
                  <span data-en="Email" data-es="Correo">
                    {"Correo"}
                  </span>
                  <b>
                    {"comercial@nuvelagt.com"}
                  </b>
                  <i>
                    {"→"}
                  </i>
                </a>
                {' '}
                <a className="nv-channel" href="https://instagram.com/Nuvela.gt" target="_blank" rel="noopener">
                  <span>
                    {"Instagram"}
                  </span>
                  <b>
                    {"@nuvela.gt"}
                  </b>
                  <i>
                    {"→"}
                  </i>
                </a>
                {' '}
                <button type="button" className="nv-channel" data-page="cita">
                  <span data-en="Showroom" data-es="Showroom">
                    {"Showroom"}
                  </span>
                  <b data-en="Zone 9 · By appointment" data-es="Zona 9 · Con cita">
                    {"Zona 9 · Con cita"}
                  </b>
                  <i>
                    {"→"}
                  </i>
                </button>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
          <div className="nv-contact-right nv-light">
            {' '}
            <form id="contactForm" className="nv-form" action="https://formspree.io/f/xbdnzdpp" method="POST">
              <p className="nv-eyebrow" data-en="Send a message" data-es="Envíanos un mensaje">
                {"Envíanos un mensaje"}
              </p>
              <h3 className="nv-h2 nv-form-title" data-en={"We'll write back<br/>within 24 hours."} data-es={"Te respondemos<br/>en menos de 24 horas."}>
                {"Te respondemos"}
                <br />
                {"en menos de 24 horas."}
              </h3>
              <div className="form-fields">
                {' '}
                <label className="nv-field">
                  <input className="luxe-input" type="text" name="nombre" placeholder=" " required />
                  <span data-en="Full name" data-es="Nombre completo">
                    {"Nombre completo"}
                  </span>
                </label>
                {' '}
                <label className="nv-field">
                  <input className="luxe-input" type="email" name="email" placeholder=" " required />
                  <span data-en="Email" data-es="Correo electrónico">
                    {"Correo electrónico"}
                  </span>
                </label>
                {' '}
                <label className="nv-field">
                  <input className="luxe-input" type="tel" name="telefono" placeholder=" " />
                  <span data-en="Phone (optional)" data-es="Teléfono (opcional)">
                    {"Teléfono (opcional)"}
                  </span>
                </label>
                {' '}
                <div className="nv-topics" role="radiogroup" aria-label="Asunto">
                  {' '}
                  <p className="nv-topics-label" data-en="Subject" data-es="Asunto">
                    {"Asunto"}
                  </p>
                  {' '}
                  <label>
                    <input type="radio" name="asunto" value="Consulta de producto" required />
                    <span data-en="Product inquiry" data-es="Consulta de producto">
                      {"Consulta de producto"}
                    </span>
                  </label>
                  {' '}
                  <label>
                    <input type="radio" name="asunto" value="Precios y financiamiento" />
                    <span data-en="Pricing & financing" data-es="Precios y financiamiento">
                      {"Precios y financiamiento"}
                    </span>
                  </label>
                  {' '}
                  <label>
                    <input type="radio" name="asunto" value="Entregas" />
                    <span data-en="Delivery" data-es="Entregas">
                      {"Entregas"}
                    </span>
                  </label>
                  {' '}
                  <label>
                    <input type="radio" name="asunto" value="Garantía" />
                    <span data-en="Warranty" data-es="Garantía">
                      {"Garantía"}
                    </span>
                  </label>
                  {' '}
                  <label>
                    <input type="radio" name="asunto" value="Hoteles / B2B" />
                    <span data-en="Hotels / B2B" data-es="Hoteles / B2B">
                      {"Hoteles / B2B"}
                    </span>
                  </label>
                  {' '}
                  <label>
                    <input type="radio" name="asunto" value="Otro" />
                    <span data-en="Other" data-es="Otro">
                      {"Otro"}
                    </span>
                  </label>
                  {' '}
                </div>
                {' '}
                <label className="nv-field">
                  <textarea className="luxe-input" name="mensaje" rows="4" placeholder=" ">
                  </textarea>
                  <span data-en="How can we help?" data-es="¿Cómo podemos ayudarte?">
                    {"¿Cómo podemos ayudarte?"}
                  </span>
                </label>
                {' '}
                <button className="btn-gold nv-magnetic" type="submit" data-en="Send Message" data-es="Enviar Mensaje">
                  {"Enviar Mensaje"}
                </button>
                {' '}
              </div>
              <div className="form-success hidden">
                {' '}
                <p className="nv-h2" data-en="Thank you." data-es="Gracias.">
                  {"Gracias."}
                </p>
                {' '}
                <p className="nv-lead" data-en="Your message has been received. Our concierge will be in touch within 24 hours." data-es="Tu mensaje fue recibido. Nuestro concierge se pondrá en contacto en menos de 24 horas.">
                  {"Tu mensaje fue recibido. Nuestro concierge se pondrá en contacto en menos de 24 horas."}
                </p>
                {' '}
              </div>
            </form>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        <section className="nv-light nv-sec nv-sec-tight nv-hours">
          {' '}
          <div className="nv-wrap">
            {' '}
            <div className="nv-hours-grid">
              {' '}
              <div className="nv-lcard">
                <p className="nv-eyebrow" data-en="Customer service" data-es="Atención al cliente">
                  {"Atención al cliente"}
                </p>
                <b data-en="Mon–Sat · 9:00 — 19:00" data-es="Lun–Sáb · 9:00 — 19:00">
                  {"Lun–Sáb · 9:00 — 19:00"}
                </b>
              </div>
              {' '}
              <div className="nv-lcard">
                <p className="nv-eyebrow" data-en="Showroom" data-es="Showroom">
                  {"Showroom"}
                </p>
                <b data-en="Mon–Sat · 11:00 — 17:00" data-es="Lun–Sáb · 11:00 — 17:00">
                  {"Lun–Sáb · 11:00 — 17:00"}
                </b>
              </div>
              {' '}
              <div className="nv-lcard">
                <p className="nv-eyebrow" data-en="Coverage" data-es="Cobertura">
                  {"Cobertura"}
                </p>
                <b data-en="All of Guatemala · from Q300" data-es="Todo Guatemala · desde Q300">
                  {"Todo Guatemala · desde Q300"}
                </b>
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
      </main>
    </>
  );
}

/* ---------- Página "sorteo" ---------- */
function PageSorteo() {
  return (
    <>
      <main id="page-sorteo" className="page nv-page nv-sorteo">
        {' '}
        <section className="nv-ph nv-ph-photo">
          {' '}
          <div className="nv-ph-bg" aria-hidden="true">
            <img src="images/hero-frontal.jpg" alt="Colchón Nuvela King, primer premio del Sorteo Nuvela" />
          </div>
          {' '}
          <div className="nv-ph-inner">
            {' '}
            <p className="nv-eyebrow" data-en="Nuvela Giveaway" data-es="Sorteo Nuvela">
              {"Sorteo Nuvela"}
            </p>
            {' '}
            <h2 className="nv-display nv-ph-title" data-en={"Win a<br/>King mattress."} data-es={"Gana un<br/>colchón King."}>
              {"Gana un"}
              <br />
              {"colchón King."}
            </h2>
            {' '}
            <ul className="nv-cita-chips">
              <li data-en="Until December 31, 2026" data-es="Hasta el 31 de diciembre de 2026">
                {"Hasta el 31 de diciembre de 2026"}
              </li>
              <li data-en="Free to enter" data-es="Participar es gratis">
                {"Participar es gratis"}
              </li>
              <li data-en="3 prizes" data-es="3 premios">
                {"3 premios"}
              </li>
            </ul>
            {' '}
            <div className="nv-hero-actions">
              <a href="#nv-sorteo-form" className="btn-gold nv-magnetic js-nv-goto" data-target="#nv-sorteo-form" data-en="Enter now" data-es="Participar ahora">
                {"Participar ahora"}
              </a>
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Premios */}
        {' '}
        <section className="nv-light nv-sec">
          {' '}
          <div className="nv-wrap">
            {' '}
            <p className="nv-eyebrow" data-en="Prizes" data-es="Premios">
              {"Premios"}
            </p>
            {' '}
            <h3 className="nv-h2" data-en="Three winners." data-es="Tres ganadores.">
              {"Tres ganadores."}
            </h3>
            {' '}
            <div className="nv-prizes">
              {' '}
              <article className="nv-prize nv-prize-1">
                {' '}
                <div className="nv-prize-media">
                  <img src="images/colchon.jpg" alt="Colchón Nuvela King con pillow top, primer premio del sorteo" loading="lazy" />
                  <span className="nv-prize-rank" data-en="1st place" data-es="1.er lugar">
                    {"1.er lugar"}
                  </span>
                </div>
                {' '}
                <div className="nv-prize-body">
                  <h4 data-en="A King-size Nuvela Mattress" data-es="Un Colchón Nuvela King">
                    {"Un Colchón Nuvela King"}
                  </h4>
                  <p data-en="30 cm hybrid, 1.93 × 2.03 m, with a 10-year warranty." data-es="Híbrido de 30 cm, 1.93 × 2.03 m, con 10 años de garantía.">
                    {"Híbrido de 30 cm, 1.93 × 2.03 m, con 10 años de garantía."}
                  </p>
                </div>
                {' '}
              </article>
              {' '}
              <article className="nv-prize">
                {' '}
                <div className="nv-prize-media">
                  <img src="images/almohada-memoryfoam-1-principal.jpg" alt="Almohada Nuvela de memory foam, segundo premio del sorteo" loading="lazy" />
                  <span className="nv-prize-rank" data-en="2nd place" data-es="2.º lugar">
                    {"2.º lugar"}
                  </span>
                </div>
                {' '}
                <div className="nv-prize-body">
                  <h4 data-en="Two Nuvela pillows" data-es="Dos almohadas Nuvela">
                    {"Dos almohadas Nuvela"}
                  </h4>
                  <p data-en="To complete your rest." data-es="Para completar tu descanso.">
                    {"Para completar tu descanso."}
                  </p>
                </div>
                {' '}
              </article>
              {' '}
              <article className="nv-prize nv-prize-3">
                {' '}
                <div className="nv-prize-media nv-prize-amount" aria-hidden="true">
                  <b>
                    {"Q500"}
                  </b>
                  <i data-en="off" data-es="de descuento">
                    {"de descuento"}
                  </i>
                  <span className="nv-prize-rank" data-en="3rd place" data-es="3.er lugar">
                    {"3.er lugar"}
                  </span>
                </div>
                {' '}
                <div className="nv-prize-body">
                  <h4 data-en="Q500 off a Nuvela Mattress" data-es="Q500 de descuento en un Colchón Nuvela">
                    {"Q500 de descuento en un Colchón Nuvela"}
                  </h4>
                  <p data-en="Valid on the purchase of a Nuvela Mattress, in any size." data-es="Válido en la compra de un Colchón Nuvela, en cualquier medida.">
                    {"Válido en la compra de un Colchón Nuvela, en cualquier medida."}
                  </p>
                </div>
                {' '}
              </article>
              {' '}
            </div>
            {' '}
            <p className="nv-prize-note" data-en="Prizes apply to the Nuvela Mattress only; the Nuvela Diamond is not included." data-es="Los premios aplican únicamente al Colchón Nuvela; no incluyen el Nuvela Diamond.">
              {"Los premios aplican únicamente al Colchón Nuvela; no incluyen el Nuvela Diamond."}
            </p>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Cómo participar */}
        {' '}
        <section className="nv-dark nv-sec">
          {' '}
          <div className="nv-wrap">
            {' '}
            <p className="nv-eyebrow" data-en="How it works" data-es="Cómo participar">
              {"Cómo participar"}
            </p>
            {' '}
            <h3 className="nv-h2" data-en={"Three steps.<br/>More points, more chances."} data-es={"Tres pasos.<br/>Más puntos, más oportunidades."}>
              {"Tres pasos."}
              <br />
              {"Más puntos, más oportunidades."}
            </h3>
            {' '}
            <ol className="nv-steps nv-del-steps nv-sorteo-steps">
              <i className="nv-steps-line" aria-hidden="true">
                <i>
                </i>
              </i>
              <li>
                <span>
                  {"01"}
                </span>
                <h4 data-en="Sign up" data-es="Inscríbete">
                  {"Inscríbete"}
                </h4>
                <p data-en="Fill in the form on this page. You earn 1 point." data-es="Llena el formulario de esta página. Ganas 1 punto.">
                  {"Llena el formulario de esta página. Ganas 1 punto."}
                </p>
              </li>
              <li>
                <span>
                  {"02"}
                </span>
                <h4 data-en="Follow Nuvela" data-es="Sigue a Nuvela">
                  {"Sigue a Nuvela"}
                </h4>
                <p data-en="Follow @nuvela.gt on Instagram. We verify it before awarding a prize." data-es="Sigue a @nuvela.gt en Instagram. Lo verificamos antes de entregar un premio.">
                  {"Sigue a @nuvela.gt en Instagram. Lo verificamos antes de entregar un premio."}
                </p>
              </li>
              <li>
                <span>
                  {"03"}
                </span>
                <h4 data-en="Share your link" data-es="Comparte tu enlace">
                  {"Comparte tu enlace"}
                </h4>
                <p data-en="You earn 2 points for each person who signs up with your link." data-es="Ganas 2 puntos por cada persona que se inscriba con tu enlace.">
                  {"Ganas 2 puntos por cada persona que se inscriba con tu enlace."}
                </p>
              </li>
              <li>
                <span>
                  {"04"}
                </span>
                <h4 data-en="The draw" data-es="El sorteo">
                  {"El sorteo"}
                </h4>
                <p data-en="Each point is one ticket. The more points, the more chances to win." data-es="Cada punto es un boleto. Mientras más puntos, más oportunidades de ganar.">
                  {"Cada punto es un boleto. Mientras más puntos, más oportunidades de ganar."}
                </p>
              </li>
            </ol>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Formulario / panel del participante */}
        {' '}
        <section className="nv-light nv-sec" id="nv-sorteo-form">
          {' '}
          <div className="nv-wrap nv-sorteo-grid">
            {' '}
            <div>
              {' '}
              <p className="nv-eyebrow" data-en="Sign up" data-es="Inscripción">
                {"Inscripción"}
              </p>
              {' '}
              <h3 className="nv-h2" data-en={"Enter the<br/>Nuvela Giveaway."} data-es={"Participa en el<br/>Sorteo Nuvela."}>
                {"Participa en el"}
                <br />
                {"Sorteo Nuvela."}
              </h3>
              {' '}
              <p className="nv-lead" data-en="One sign-up per person. Your details are used only for the giveaway and to contact you about Nuvela." data-es="Una inscripción por persona. Tus datos se usan solo para el sorteo y para contactarte sobre Nuvela.">
                {"Una inscripción por persona. Tus datos se usan solo para el sorteo y para contactarte sobre Nuvela."}
              </p>
              {' '}
            </div>
            {' '}
            <div>
              {' '}
              {/* A) Formulario */}
              {' '}
              <form id="nv-sorteo-f" className="nv-form nv-sorteo-form" noValidate>
                <div className="form-fields">
                  {' '}
                  <label className="nv-field">
                    <input className="luxe-input" type="text" id="nv-so-nombre" autoComplete="given-name" placeholder=" " required />
                    <span data-en="First name" data-es="Nombre">
                      {"Nombre"}
                    </span>
                  </label>
                  {' '}
                  <label className="nv-field">
                    <input className="luxe-input" type="text" id="nv-so-apellido" autoComplete="family-name" placeholder=" " required />
                    <span data-en="Last name" data-es="Apellido">
                      {"Apellido"}
                    </span>
                  </label>
                  {' '}
                  <label className="nv-field">
                    <input className="luxe-input" type="email" id="nv-so-correo" autoComplete="email" placeholder=" " required />
                    <span data-en="Email" data-es="Correo electrónico">
                      {"Correo electrónico"}
                    </span>
                  </label>
                  {' '}
                  <label className="nv-field">
                    <input className="luxe-input" type="tel" id="nv-so-telefono" autoComplete="tel" inputMode="tel" placeholder=" " required />
                    <span data-en="Phone number" data-es="Número de teléfono">
                      {"Número de teléfono"}
                    </span>
                  </label>
                  {' '}
                  <label className="nv-field">
                    <input className="luxe-input" type="text" id="nv-so-ig" autoComplete="off" autoCapitalize="none" placeholder=" " required />
                    <span data-en="Your Instagram username" data-es="Tu usuario de Instagram">
                      {"Tu usuario de Instagram"}
                    </span>
                  </label>
                  {' '}
                  <p className="nv-so-hint">
                    <span data-en="We check that this account follows @nuvela.gt. If it doesn't, the sign-up is voided." data-es="Revisamos que esta cuenta siga a @nuvela.gt. Si no la sigue, la inscripción se anula.">
                      {"Revisamos que esta cuenta siga a @nuvela.gt. Si no la sigue, la inscripción se anula."}
                    </span>
                    {' '}
                    <a href="https://instagram.com/Nuvela.gt" target="_blank" rel="noopener" data-en="Follow @nuvela.gt →" data-es="Seguir a @nuvela.gt →">
                      {"Seguir a @nuvela.gt →"}
                    </a>
                  </p>
                  {' '}
                  <label className="nv-check">
                    <input type="checkbox" id="nv-so-edad" required />
                    <span data-en="I am 18 or older." data-es="Soy mayor de 18 años.">
                      {"Soy mayor de 18 años."}
                    </span>
                  </label>
                  {' '}
                  <label className="nv-check">
                    <input type="checkbox" id="nv-so-sigue" required />
                    <span>
                      <span data-en="I follow Nuvela on Instagram:" data-es="Sigo a Nuvela en Instagram:">
                        {"Sigo a Nuvela en Instagram:"}
                      </span>
                      {' '}
                      <a href="https://instagram.com/Nuvela.gt" target="_blank" rel="noopener">
                        {"@nuvela.gt"}
                      </a>
                    </span>
                  </label>
                  {' '}
                  <label className="nv-check">
                    <input type="checkbox" id="nv-so-bases" required />
                    <span data-en="I accept the giveaway rules and the use of my details to contact me." data-es="Acepto las bases del sorteo y el uso de mis datos para contactarme.">
                      {"Acepto las bases del sorteo y el uso de mis datos para contactarme."}
                    </span>
                  </label>
                  {' '}
                  <p id="nv-so-error" className="nv-sorteo-error hidden" role="alert">
                  </p>
                  {' '}
                  <button className="btn-gold nv-magnetic" type="submit" id="nv-so-submit" data-en="Enter the giveaway" data-es="Participar en el sorteo">
                    {"Participar en el sorteo"}
                  </button>
                  {' '}
                  <button type="button" id="nv-so-show-login" className="nv-so-textbtn" data-en="Already signed up? See my points" data-es="¿Ya te inscribiste? Ver mis puntos">
                    {"¿Ya te inscribiste? Ver mis puntos"}
                  </button>
                  {' '}
                </div>
              </form>
              {' '}
              {/* A2) Entrar para ver mis puntos (correo + teléfono con los que se inscribió) */}
              {' '}
              <form id="nv-sorteo-login" className="nv-form nv-sorteo-form hidden" noValidate>
                <div className="form-fields">
                  {' '}
                  <p className="nv-sorteo-hello" data-en="Enter the email and phone you signed up with." data-es="Escribe el correo y el teléfono con los que te inscribiste.">
                    {"Escribe el correo y el teléfono con los que te inscribiste."}
                  </p>
                  {' '}
                  <label className="nv-field">
                    <input className="luxe-input" type="email" id="nv-lo-correo" autoComplete="email" placeholder=" " required />
                    <span data-en="Email" data-es="Correo electrónico">
                      {"Correo electrónico"}
                    </span>
                  </label>
                  {' '}
                  <label className="nv-field">
                    <input className="luxe-input" type="tel" id="nv-lo-telefono" autoComplete="tel" inputMode="tel" placeholder=" " required />
                    <span data-en="Phone number" data-es="Número de teléfono">
                      {"Número de teléfono"}
                    </span>
                  </label>
                  {' '}
                  <p id="nv-lo-error" className="nv-sorteo-error hidden" role="alert">
                  </p>
                  {' '}
                  <button className="btn-gold nv-magnetic" type="submit" id="nv-lo-submit" data-en="See my points" data-es="Ver mis puntos">
                    {"Ver mis puntos"}
                  </button>
                  {' '}
                  <button type="button" id="nv-so-show-form" className="nv-so-textbtn" data-en="← Back to sign-up" data-es="← Volver a la inscripción">
                    {"← Volver a la inscripción"}
                  </button>
                  {' '}
                </div>
              </form>
              {' '}
              {/* B) Panel de quien ya está inscrito */}
              {' '}
              <div id="nv-sorteo-panel" className="nv-sorteo-panel hidden">
                {' '}
                <p className="nv-eyebrow" data-en="You're in" data-es="Ya estás participando">
                  {"Ya estás participando"}
                </p>
                {' '}
                <p className="nv-sorteo-hello">
                  <span data-en="Good luck," data-es="Mucha suerte,">
                    {"Mucha suerte,"}
                  </span>
                  {' '}
                  <b id="nv-so-name">
                  </b>
                  {"."}
                </p>
                {' '}
                <div className="nv-sorteo-points">
                  <b id="nv-so-points">
                    {"1"}
                  </b>
                  <span>
                    <span data-en="points" data-es="puntos">
                      {"puntos"}
                    </span>
                    <em id="nv-so-refs">
                    </em>
                  </span>
                </div>
                {' '}
                <p className="nv-sorteo-label" data-en="Your link — 2 points for each person who signs up with it" data-es="Tu enlace — 2 puntos por cada persona que se inscriba con él">
                  {"Tu enlace — 2 puntos por cada persona que se inscriba con él"}
                </p>
                {' '}
                <div className="nv-sorteo-link">
                  <input id="nv-so-link" type="text" readOnly aria-label="Tu enlace del sorteo" />
                  <button type="button" id="nv-so-copy" className="btn-gold" data-en="Copy" data-es="Copiar">
                    {"Copiar"}
                  </button>
                </div>
                {' '}
                <div className="nv-sorteo-share">
                  {' '}
                  <a id="nv-so-wa" className="nv-sorteo-btn" target="_blank" rel="noopener" data-en="Share on WhatsApp" data-es="Compartir por WhatsApp">
                    {"Compartir por WhatsApp"}
                  </a>
                  {' '}
                  <button type="button" id="nv-so-refresh" className="nv-sorteo-btn" data-en="Update my points" data-es="Actualizar mis puntos">
                    {"Actualizar mis puntos"}
                  </button>
                  {' '}
                </div>
                {' '}
                <p id="nv-so-note" className="nv-size-note">
                </p>
                {' '}
                <button type="button" id="nv-so-logout" className="nv-so-textbtn" data-en="Not you? Sign out" data-es="¿No eres tú? Salir">
                  {"¿No eres tú? Salir"}
                </button>
                {' '}
              </div>
              {' '}
              {/* C) Sorteo cerrado */}
              {' '}
              <div id="nv-sorteo-closed" className="nv-sorteo-panel hidden">
                {' '}
                <p className="nv-eyebrow" data-en="Giveaway closed" data-es="Sorteo finalizado">
                  {"Sorteo finalizado"}
                </p>
                {' '}
                <p className="nv-sorteo-hello" data-en="Sign-ups closed on December 31, 2026. Winners are announced on Instagram @nuvela.gt." data-es="Las inscripciones cerraron el 31 de diciembre de 2026. Los ganadores se anuncian en Instagram @nuvela.gt.">
                  {"Las inscripciones cerraron el 31 de diciembre de 2026. Los ganadores se anuncian en Instagram @nuvela.gt."}
                </p>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        {/* Bases */}
        {' '}
        <section className="nv-light nv-sec nv-sec-tight nv-sorteo-rules">
          {' '}
          <div className="nv-wrap nv-narrow">
            {' '}
            <p className="nv-eyebrow" data-en="Rules" data-es="Bases del sorteo">
              {"Bases del sorteo"}
            </p>
            {' '}
            <h3 className="nv-h2" data-en="Terms and conditions." data-es="Términos y condiciones.">
              {"Términos y condiciones."}
            </h3>
            {' '}
            <ol className="nv-rules">
              <li data-en="Organizer: Nuvela (Diseño y Confort, S.A.), Guatemala City." data-es="Organizador: Nuvela (Diseño y Confort, S.A.), Ciudad de Guatemala.">
                {"Organizador: Nuvela (Diseño y Confort, S.A.), Ciudad de Guatemala."}
              </li>
              <li data-en="Period: sign-ups are open until December 31, 2026 at 11:59 p.m. (Guatemala time)." data-es="Vigencia: las inscripciones están abiertas hasta el 31 de diciembre de 2026 a las 23:59 (hora de Guatemala).">
                {"Vigencia: las inscripciones están abiertas hasta el 31 de diciembre de 2026 a las 23:59 (hora de Guatemala)."}
              </li>
              <li data-en="Who can enter: people aged 18 or older. One sign-up per person; duplicate sign-ups with the same email or phone are not counted." data-es="Quién participa: personas mayores de 18 años. Una inscripción por persona; las inscripciones repetidas con el mismo correo o teléfono no cuentan.">
                {"Quién participa: personas mayores de 18 años. Una inscripción por persona; las inscripciones repetidas con el mismo correo o teléfono no cuentan."}
              </li>
              <li data-en="Requirement: follow Nuvela on Instagram (@nuvela.gt). When signing up you give your Instagram username; Nuvela checks that the account follows @nuvela.gt and voids sign-ups that do not. It is also verified before awarding each prize." data-es="Requisito: seguir a Nuvela en Instagram (@nuvela.gt). Al inscribirte indicas tu usuario de Instagram; Nuvela revisa que esa cuenta siga a @nuvela.gt y anula las inscripciones que no cumplan. También se verifica antes de entregar cada premio.">
                {"Requisito: seguir a Nuvela en Instagram (@nuvela.gt). Al inscribirte indicas tu usuario de Instagram; Nuvela revisa que esa cuenta siga a @nuvela.gt y anula las inscripciones que no cumplan. También se verifica antes de entregar cada premio."}
              </li>
              <li data-en="Points: 1 point for signing up and 2 points for each person who signs up using your personal link. Referred people must be real, of legal age and with their own details." data-es="Puntos: 1 punto por inscribirte y 2 puntos por cada persona que se inscriba usando tu enlace personal. Las personas referidas deben ser reales, mayores de edad y con sus propios datos.">
                {"Puntos: 1 punto por inscribirte y 2 puntos por cada persona que se inscriba usando tu enlace personal. Las personas referidas deben ser reales, mayores de edad y con sus propios datos."}
              </li>
              <li data-en="How winners are chosen: at random. Each point is one ticket, so more points mean more chances, but anyone signed up can win. Three different winners are drawn, in order: 1st, 2nd and 3rd place." data-es="Cómo se eligen los ganadores: al azar. Cada punto equivale a un boleto, así que más puntos dan más oportunidades, pero cualquier inscrito puede ganar. Se sortean tres ganadores distintos, en orden: 1.er, 2.º y 3.er lugar.">
                {"Cómo se eligen los ganadores: al azar. Cada punto equivale a un boleto, así que más puntos dan más oportunidades, pero cualquier inscrito puede ganar. Se sortean tres ganadores distintos, en orden: 1.er, 2.º y 3.er lugar."}
              </li>
              <li data-en="Prizes: 1st place, a King-size Nuvela Mattress; 2nd place, two Nuvela pillows; 3rd place, Q500 off the purchase of a Nuvela Mattress. Prizes apply to the Nuvela Mattress only (not the Nuvela Diamond), cannot be exchanged for cash and are not transferable." data-es="Premios: 1.er lugar, un Colchón Nuvela King; 2.º lugar, dos almohadas Nuvela; 3.er lugar, Q500 de descuento en la compra de un Colchón Nuvela. Los premios aplican únicamente al Colchón Nuvela (no al Nuvela Diamond), no son canjeables por dinero y no son transferibles.">
                {"Premios: 1.er lugar, un Colchón Nuvela King; 2.º lugar, dos almohadas Nuvela; 3.er lugar, Q500 de descuento en la compra de un Colchón Nuvela. Los premios aplican únicamente al Colchón Nuvela (no al Nuvela Diamond), no son canjeables por dinero y no son transferibles."}
              </li>
              <li data-en="Draw and announcement: the draw takes place in January 2027 and the winners are announced on Instagram @nuvela.gt. Each winner is contacted through the details they registered." data-es="Sorteo y anuncio: el sorteo se realiza en enero de 2027 y los ganadores se anuncian en Instagram @nuvela.gt. A cada ganador se le contacta por los datos que registró.">
                {"Sorteo y anuncio: el sorteo se realiza en enero de 2027 y los ganadores se anuncian en Instagram @nuvela.gt. A cada ganador se le contacta por los datos que registró."}
              </li>
              <li data-en="Verification: to receive a prize, the winner must show an ID proving they are of legal age and that their details match the sign-up. Nuvela may void sign-ups with false details, duplicates or invented referrals." data-es="Verificación: para recibir un premio, el ganador debe presentar un documento de identificación que confirme que es mayor de edad y que sus datos coinciden con la inscripción. Nuvela puede anular inscripciones con datos falsos, duplicadas o con referidos inventados.">
                {"Verificación: para recibir un premio, el ganador debe presentar un documento de identificación que confirme que es mayor de edad y que sus datos coinciden con la inscripción. Nuvela puede anular inscripciones con datos falsos, duplicadas o con referidos inventados."}
              </li>
              <li data-en="Delivery: prizes are delivered in Guatemala." data-es="Entrega: los premios se entregan en Guatemala.">
                {"Entrega: los premios se entregan en Guatemala."}
              </li>
              <li data-en="Your details: they are used only to run the giveaway and to contact you about Nuvela. They are not sold or shared with third parties." data-es="Tus datos: se usan únicamente para administrar el sorteo y para contactarte sobre Nuvela. No se venden ni se comparten con terceros.">
                {"Tus datos: se usan únicamente para administrar el sorteo y para contactarte sobre Nuvela. No se venden ni se comparten con terceros."}
              </li>
              <li data-en="This promotion is not sponsored, endorsed or administered by, or associated with, Instagram or Meta." data-es="Esta promoción no está patrocinada, avalada ni administrada por Instagram ni Meta, ni está asociada a ellos.">
                {"Esta promoción no está patrocinada, avalada ni administrada por Instagram ni Meta, ni está asociada a ellos."}
              </li>
            </ol>
            {' '}
            {/* PENDIENTE: fecha exacta del sorteo en enero de 2027; vigencia del descuento de Q500 (hasta cuándo se puede usar); modelo de las dos almohadas del 2.º lugar. */}
            {' '}
          </div>
          {' '}
        </section>
        {' '}
      </main>
    </>
  );
}

/* ---------- Página "privacidad" ---------- */
function PagePrivacidad() {
  return (
    <>
      <main id="page-privacidad" className="page">
        {' '}
        <section className="pt-28 pb-16 bg-cream">
          {' '}
          <div className="max-w-4xl mx-auto px-6 reveal">
            {' '}
            <p className="eyebrow" data-en="Legal" data-es="Legal">
              {"Legal"}
            </p>
            {' '}
            <span className="gold-rule mt-4">
            </span>
            {' '}
            <h2 className="font-serif text-5xl text-ink mt-8 leading-[1.05]" data-en="Privacy Policy" data-es="Política de Privacidad">
              {"Política de Privacidad"}
            </h2>
            {' '}
            <p className="text-mist text-sm tracking-[0.18em] uppercase mt-6" data-en="Last updated · May 2026" data-es="Última actualización · Mayo 2026">
              {"Última actualización · Mayo 2026"}
            </p>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        <section className="py-16 bg-white">
          {' '}
          <div className="max-w-3xl mx-auto px-6 prose prose-lg">
            {' '}
            <div className="space-y-8 text-graphite leading-loose">
              {' '}
              <div>
                {' '}
                <h3 className="font-serif text-2xl text-ink mb-3" data-en="Introduction" data-es="Introducción">
                  {"Introducción"}
                </h3>
                {' '}
                <p data-en="Nuvela · Italian Design respects your privacy. This policy describes how we collect, use and protect personal information when you visit nuvela.com.gt or interact with our services." data-es="Nuvela · Italian Design respeta tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal cuando visitas nuvela.com.gt o interactúas con nuestros servicios.">
                  {"Nuvela · Italian Design respeta tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal cuando visitas nuvela.com.gt o interactúas con nuestros servicios."}
                </p>
                {' '}
              </div>
              {' '}
              <div>
                {' '}
                <h3 className="font-serif text-2xl text-ink mb-3" data-en="Information we collect" data-es="Información que recopilamos">
                  {"Información que recopilamos"}
                </h3>
                {' '}
                <p data-en="We collect information you provide directly (such as name, email, phone and delivery address) when you contact us, place an order or sign up for communications. We may also collect technical data such as browser type and pages visited to improve our services." data-es="Recopilamos la información que tú proporcionas directamente (como nombre, correo, teléfono y dirección de entrega) cuando nos contactas, realizas un pedido o te suscribes a nuestras comunicaciones. También podemos recopilar datos técnicos como tipo de navegador y páginas visitadas para mejorar nuestros servicios.">
                  {"Recopilamos la información que tú proporcionas directamente (como nombre, correo, teléfono y dirección de entrega) cuando nos contactas, realizas un pedido o te suscribes a nuestras comunicaciones. También podemos recopilar datos técnicos como tipo de navegador y páginas visitadas para mejorar nuestros servicios."}
                </p>
                {' '}
              </div>
              {' '}
              <div>
                {' '}
                <h3 className="font-serif text-2xl text-ink mb-3" data-en="How we use your information" data-es="Uso de tu información">
                  {"Uso de tu información"}
                </h3>
                {' '}
                <p data-en="We use your information to fulfill orders, communicate with you, provide customer service, process warranty claims and improve our products and website. We do not sell your personal information." data-es="Usamos tu información para procesar pedidos, comunicarnos contigo, brindar servicio al cliente, gestionar garantías y mejorar nuestros productos y sitio web. No vendemos tu información personal.">
                  {"Usamos tu información para procesar pedidos, comunicarnos contigo, brindar servicio al cliente, gestionar garantías y mejorar nuestros productos y sitio web. No vendemos tu información personal."}
                </p>
                {' '}
              </div>
              {' '}
              <div>
                {' '}
                <h3 className="font-serif text-2xl text-ink mb-3" data-en="Data protection" data-es="Protección de datos">
                  {"Protección de datos"}
                </h3>
                {' '}
                <p data-en="We implement administrative, technical and physical safeguards to protect personal information against unauthorized access, disclosure or loss." data-es="Implementamos medidas administrativas, técnicas y físicas para proteger la información personal contra acceso no autorizado, divulgación o pérdida.">
                  {"Implementamos medidas administrativas, técnicas y físicas para proteger la información personal contra acceso no autorizado, divulgación o pérdida."}
                </p>
                {' '}
              </div>
              {' '}
              <div>
                {' '}
                <h3 className="font-serif text-2xl text-ink mb-3" data-en="Your rights" data-es="Tus derechos">
                  {"Tus derechos"}
                </h3>
                {' '}
                <p data-en="You may request access, correction or deletion of your personal information at any time by contacting us at comercial@nuvela.gt." data-es="Puedes solicitar acceso, corrección o eliminación de tu información personal en cualquier momento escribiéndonos a commercial@nuvela.gt.">
                  {"Puedes solicitar acceso, corrección o eliminación de tu información personal en cualquier momento escribiéndonos a commercial@nuvela.gt."}
                </p>
                {' '}
              </div>
              {' '}
              <div>
                {' '}
                <h3 className="font-serif text-2xl text-ink mb-3" data-en="Contact" data-es="Contacto">
                  {"Contacto"}
                </h3>
                {' '}
                <p data-en="For questions regarding this privacy policy, please contact comercial@nuvelagt.com." data-es="Para preguntas sobre esta política de privacidad, por favor contacta comercial@nuvelagt.com.">
                  {"Para preguntas sobre esta política de privacidad, por favor contacta nuvela.gt@hotmail.com."}
                </p>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </section>
        {' '}
      </main>
    </>
  );
}

/* ---------- Pie de página y botón flotante de WhatsApp ---------- */
function FooterYFlotantes() {
  return (
    <>
      {/* =================== FOOTER =================== */}
      <footer className="bg-ink text-white pt-20 pb-10">
        {' '}
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {' '}
          <div>
            {' '}
            <img src="images/logosinfondo.png" alt="Nuvela · Italian Design" className="h-28 w-auto" />
            {' '}
            <div style={{ "display": "none" }}>
              {' '}
              <span className="wordmark text-2xl">
                {"NUVELA"}
              </span>
              {' '}
              <span className="block wordmark-sub mt-1 !text-gold-light">
                {"Italian Design"}
              </span>
              {' '}
            </div>
            {' '}
            <p className="text-white/60 text-sm mt-6 leading-relaxed max-w-xs" data-en="Premium mattresses crafted in Italian style. Sleep is the foundation of a well-lived life." data-es="Colchones premium con diseño italiano. El descanso es el fundamento de una vida bien vivida.">
              {"Colchones premium con diseño italiano. El descanso es el fundamento de una vida bien vivida."}
            </p>
            {' '}
            <p className="font-serif italic text-gold-light text-sm mt-6">
              {"\"Duerme Bien Siempre.\""}
            </p>
            {' '}
          </div>
          {' '}
          <div>
            {' '}
            <p className="eyebrow text-gold-light" data-en="Explore" data-es="Explora">
              {"Explora"}
            </p>
            {' '}
            <ul className="mt-6 space-y-3 text-white/70 text-sm">
              <li>
                <a className="footer-link hover:text-gold-light cursor-pointer" data-page="historia" data-en="Story" data-es="Historia">
                  {"Historia"}
                </a>
              </li>
              <li>
                <a className="footer-link hover:text-gold-light cursor-pointer" data-page="producto" data-en="Products" data-es="Productos">
                  {"Productos"}
                </a>
              </li>
              <li>
                <a className="footer-link hover:text-gold-light cursor-pointer" data-page="linea-hotelera" data-en="Hotel Line" data-es="Línea para Hoteles">
                  {"Línea para Hoteles"}
                </a>
              </li>
              <li>
                <a className="footer-link hover:text-gold-light cursor-pointer" data-page="comparar" data-en="Compare Products" data-es="Comparar Productos">
                  {"Comparar Productos"}
                </a>
              </li>
              <li>
                <a className="footer-link hover:text-gold-light cursor-pointer" data-page="tecnologia" data-en="Technology" data-es="Tecnología">
                  {"Tecnología"}
                </a>
              </li>
              <li>
                <a className="footer-link hover:text-gold-light cursor-pointer" data-page="carrito" data-en="My Cart" data-es="Mi Carrito">
                  {"Mi Carrito"}
                </a>
              </li>
            </ul>
            {' '}
          </div>
          {' '}
          <div>
            {' '}
            <p className="eyebrow text-gold-light" data-en="Service" data-es="Servicio">
              {"Servicio"}
            </p>
            {' '}
            <ul className="mt-6 space-y-3 text-white/70 text-sm">
              <li>
                <a className="footer-link hover:text-gold-light cursor-pointer" data-page="sorteo" data-en="Nuvela Giveaway" data-es="Sorteo Nuvela">
                  {"Sorteo Nuvela"}
                </a>
              </li>
              <li>
                <a className="footer-link hover:text-gold-light cursor-pointer" data-page="entregas" data-en="Delivery" data-es="Entregas">
                  {"Entregas"}
                </a>
              </li>
              <li>
                <a className="footer-link hover:text-gold-light cursor-pointer" data-page="cita" data-en="Book an Appointment" data-es="Agenda tu Cita">
                  {"Agenda tu Cita"}
                </a>
              </li>
              <li>
                <a className="footer-link hover:text-gold-light cursor-pointer" data-page="resenas" data-en="Reviews" data-es="Reseñas">
                  {"Reseñas"}
                </a>
              </li>
              <li>
                <a className="footer-link hover:text-gold-light cursor-pointer" data-page="faq" data-en="FAQ" data-es="FAQ">
                  {"FAQ"}
                </a>
              </li>
              <li>
                <a className="footer-link hover:text-gold-light cursor-pointer" data-page="contacto" data-en="Contact" data-es="Contáctanos">
                  {"Contáctanos"}
                </a>
              </li>
              <li>
                <a className="footer-link hover:text-gold-light cursor-pointer" data-page="privacidad" data-en="Privacy Policy" data-es="Privacidad">
                  {"Privacidad"}
                </a>
              </li>
            </ul>
            {' '}
          </div>
          {' '}
          <div>
            {' '}
            <p className="eyebrow text-gold-light" data-en="Connect" data-es="Conecta">
              {"Conecta"}
            </p>
            {' '}
            <ul className="mt-6 space-y-3 text-white/70 text-sm">
              <li>
                <a href="https://instagram.com/Nuvela.gt" target="_blank" rel="noopener" className="hover:text-gold-light">
                  {"Instagram · @Nuvela.gt"}
                </a>
              </li>
              <li>
                <a href="mailto:comercial@nuvelagt.com" className="hover:text-gold-light">
                  {"comercial@nuvelagt.com"}
                </a>
              </li>
              <li>
                <a href="https://wa.me/50253984599" target="_blank" rel="noopener" className="hover:text-gold-light">
                  {"WhatsApp · +502 5398 4599"}
                </a>
              </li>
            </ul>
            {' '}
            <div className="flex gap-3 mt-6">
              {' '}
              <a href="https://instagram.com/Nuvela.gt" target="_blank" rel="noopener" className="social-icon w-9 h-9 border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold">
                {' '}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
                {' '}
              </a>
              {' '}
              <a href="https://wa.me/50253984599" className="social-icon w-9 h-9 border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold">
                {' '}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 12a9 9 0 1 1-3.5-7.1L21 4l-1.1 3.5A9 9 0 0 1 21 12Z" />
                  <path d="M9 9c0 5 3 8 7 8l-1-3-3-1-1 1c-1 0-3-2-3-3l1-1-1-3-3 0c0 1 0 1 0 2" />
                </svg>
                {' '}
              </a>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-white/50 text-xs tracking-[0.18em] uppercase">
          {' '}
          <span>
            {"© 2026 Nuvela · Italian Design · "}
            <span data-en="All rights reserved" data-es="Todos los derechos reservados">
              {"Todos los derechos reservados"}
            </span>
          </span>
          {' '}
          <span data-en="Crafted in Italian Style · nuvelagt.com" data-es="Crafted in Italian Style · nuvelagt.com">
            {"Crafted in Italian Style · nuvelagt.com"}
          </span>
          {' '}
        </div>
        {' '}
      </footer>
      {/* WhatsApp floating */}
      <a href="https://wa.me/50253984599" target="_blank" rel="noopener" className="float-wa fixed bottom-6 right-6 z-40 w-14 h-14 bg-gold text-white rounded-full flex items-center justify-center shadow-2xl float" aria-label="WhatsApp">
        {' '}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 12a9 9 0 1 1-3.5-7.1L21 4l-1.1 3.5A9 9 0 0 1 21 12Z" />
          <path d="M9 9c0 5 3 8 7 8l-1-3-3-1-1 1c-1 0-3-2-3-3l1-1-1-3-3 0c0 1 0 1 0 2" />
        </svg>
        {' '}
      </a>
    </>
  );
}

/* =================== Lógica del sitio =================== */
// Catálogo (PRODUCTS), carrito, cotización hotelera, comparador, idioma, quiz,
// popup y animaciones. Se ejecuta una sola vez, cuando React ya dibujó la página.
function startNuvela() {

    // ==== State ====
    let currentLang = localStorage.getItem('nuvela-lang') || 'es';
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
    let activeCategory = null;
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
        mainImage: 'images/colchon.jpg',
        gallery: ['images/colchon.jpg', 'images/zipper.jpg', 'images/detalle.jpg', 'images/estructura.jpg', 'images/base.jpg'],
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
        mainImage: 'images/nuvela-hotel-principal.jpg',
        gallery: [
          'images/nuvela-hotel-principal.jpg',
          'images/nuvela-hotel-vista-2.jpg',
          'images/nuvela-hotel-vista-3.jpg',
          'images/nuvela-hotel-vista-4.jpg',
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
        mainImage: 'images/almohada-memoryfoam-1-principal.jpg',
        gallery: ['images/almohada-memoryfoam-1-principal.jpg', 'images/almohada-memoryfoam-1-vista-2.jpg'],
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
        mainImage: 'images/duvet-principal.jpg',
        gallery: ['images/duvet-principal.jpg', 'images/duvet-vista-2.jpg'],
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
        category: { es: 'Camastrones', en: 'Wooden Bed Frames' },
        name: { es: 'Olivia Bed', en: 'Olivia Bed' },
        eyebrow: { es: 'Camastrón', en: 'Wooden Bed Frame' },
        tagline: { es: 'Camastrón de madera de Conacaste · Bajo pedido', en: 'Conacaste wood bed frame · Made to order' },
        cardText: { es: 'Camastrón de madera de Conacaste, hecho bajo pedido. Disponible en Queen y King.', en: 'Conacaste wood bed frame, made to order. Available in Queen and King.' },
        description: { es: '', en: '' },
        mainImage: 'images/oliviabed1.jpg',
        gallery: ['images/oliviabed1.jpg', 'images/oliviabed2.jpg', 'images/oliviabed3.jpg'],
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
          <button type="button" class="js-filter-category group relative overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-cream border ${isActive ? 'border-gold border-2' : 'border-pearl'} text-left rounded-2xl" data-category="${c.es}">
            <img src="${sample ? sample.mainImage : ''}" alt="${pick(c)}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onerror="this.style.display='none';" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"></div>
            <div class="absolute inset-0 flex flex-col justify-end p-3 sm:p-5">
              <p class="font-serif text-sm sm:text-xl text-white leading-tight">${pick(c)}</p>
              <p class="text-white/75 text-[0.55rem] sm:text-[0.65rem] tracking-[0.18em] uppercase mt-1">${count} ${count === 1 ? (currentLang === 'es' ? 'modelo' : 'model') : (currentLang === 'es' ? 'modelos' : 'models')}</p>
            </div>
            ${isActive ? '<span class="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gold flex items-center justify-center text-white text-[0.65rem]">&#10003;</span>' : ''}
          </button>
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
              ${items.map(p => `<button type="button" class="js-view-product block w-full text-left px-5 py-2 text-sm text-cream/90 hover:text-gold hover:bg-white/5 transition-colors" data-product-id="${p.id}">${pick(p.name)}</button>`).join('')}
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
            <button class="js-view-product btn-outline mt-3 sm:mt-6 w-full !text-[0.65rem] sm:!text-xs !py-2 sm:!py-3" data-product-id="${p.id}">${currentLang === 'es' ? 'Ver Detalle' : 'View Details'}</button>
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
                  <button class="js-view-product btn-outline w-full" data-product-id="${p.id}">${currentLang === 'es' ? 'Ver Detalle' : 'View Details'}</button>
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
          <img class="w-full h-full object-cover" src="${src}" alt="" />
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
      'nuvela-clasico': 'images/textura-colchon-nuvela.jpg',
      'nuvela-hotel': 'images/textura-nuvela-hotel.jpg',
      'almohada-memory-foam-1': 'images/textura-almohada-memoryfoam-1.jpg',
      'almohada-memory-foam-2': 'images/textura-almohada-memoryfoam-2.jpg',
      'almohada-plumas': 'images/textura-almohada-plumas.jpg',
      'duvet-nuvela': 'images/textura-duvet-nuvela.jpg',
      'protector-colchon': 'images/textura-protector-colchon.jpg',
      'camastron-nuvela': 'images/textura-camastron.jpg',
    };

    function renderPricing() {
      const container = document.getElementById('precios-container');
      if (!container) return;
      container.innerHTML = PRODUCTS.map((p, i) => {
        const texture = PRODUCT_TEXTURES[p.id] || 'images/colchas.jpg';
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
      renderCategoryFilters();
      renderNavProductsDropdown();
      renderProductsGrid();
      renderHotelGrid();
      renderPricing();
      renderComparePicker();
      renderCompareTable();
      renderCart();
      updateCartBadge();
      renderQuoteCart();
      renderCitaAsesores();
      renderCitaSucursales();
      renderGoogleReviews();
      renderMorphCardsContent();
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
      e.preventDefault();
      openProductDetail(btn.dataset.productId);
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-filter-category');
      if (!btn) return;
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
    applyLang(currentLang); // also renders the products grid, pricing, etc.
    initReveal();
    initScrollMorphHero();
    initConstructionScroll();
    initHero();
    initStarTrail();
    initLeadPopup();

    // Mark home active by default
    document.querySelector('.nav-link[data-page="home"]')?.classList.add('active');
  

  /* ---- Formulario de contacto ---- */

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


  /* ---- Animaciones e interacciones (GSAP + Lenis) ---- */
  const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger, Lenis = window.Lenis;

  (function () {
    'use strict';
    // NV = "Nuvela" — todo el código del home nuevo vive dentro de este objeto.
    const NV = (window.NV = {});
    const q = (s, r) => (r || document).querySelector(s);
    const qa = (s, r) => Array.from((r || document).querySelectorAll(s));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const hasGsap = !!(window.gsap && window.ScrollTrigger);
    const lang = () => (typeof currentLang !== 'undefined' ? currentLang : 'es');
    const isMobile = () => window.innerWidth <= 900;
    const GOLD = [[185, 155, 63], [205, 174, 85], [240, 222, 170]];

    if (!hasGsap) document.documentElement.classList.add('nv-static');
    if (fine) document.body.classList.add('nv-fine');

    // Ruido suave (para el "diseño generativo"): mezcla de senos, sin librerías.
    function noise(x, y, z) {
      return (Math.sin(x * 1.7 + z) * Math.cos(y * 1.3 - z * 0.7)
        + Math.sin((x + y) * 0.9 + z * 1.3) * 0.5
        + Math.sin(x * 0.5 - y * 2.1 + z * 0.4) * 0.35) / 1.85;
    }

    // ---------- Scroll suave (Lenis) ----------
    let lenis = null;
    if (hasGsap) gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis && !reduce) {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
      NV.lenis = lenis;
      if (hasGsap) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((t) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      } else {
        const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
    }
    // Zonas con su propio scroll (menú móvil, quiz, popup) — el scroll suave no las toca.
    qa('#drawer, #quiz-overlay, #lead-popup-overlay, .js-nav-products-list, #cart-toast')
      .forEach((el) => el.setAttribute('data-lenis-prevent', ''));

    NV.scrollTop = function () {
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    };

    // ---------- Mouse global ----------
    const mouse = { x: -9999, y: -9999, active: false };
    window.addEventListener('pointermove', (e) => {
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
    }, { passive: true });
    window.addEventListener('mouseout', (e) => { if (!e.relatedTarget) { mouse.active = false; mouse.x = mouse.y = -9999; } });

    // ---------- Motor de animación: un solo requestAnimationFrame ----------
    // Cada canvas solo se dibuja si está en pantalla y si el home está activo.
    const loops = [];
    function addLoop(el, fn) {
      const L = { el, fn, visible: false };
      loops.push(L);
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((ents) => ents.forEach((en) => { L.visible = en.isIntersecting; }), { rootMargin: '120px' }).observe(el);
      } else L.visible = true;
      return L;
    }
    function tick(t) {
      for (const L of loops) if (L.visible) L.fn(t);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    function fitCanvas(cv, maxDpr) {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr || 2);
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      const ctx = cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, w: r.width, h: r.height, rect: r };
    }

    // =====================================================================
    // 1. HERO — "NUVELA" en partículas doradas
    // =====================================================================
    const hero = (function () {
      const cv = q('#nv-hero-canvas');
      const sec = q('#nv-hero');
      const slot = q('.nv-wordmark-slot');
      if (!cv || !sec || !slot) return null;
      let ctx, w = 0, h = 0, pts = [], dust = [], assembled = false, built = false;
      const state = { explode: 0 };

      function build() {
        const fit = fitCanvas(cv, 2);
        ctx = fit.ctx; const nw = fit.w, nh = fit.h;
        if (!nw || !nh) return;
        const secR = sec.getBoundingClientRect();
        const sr = slot.getBoundingClientRect();
        const cy = sr.top - secR.top + sr.height / 2;
        const off = document.createElement('canvas');
        off.width = Math.ceil(nw); off.height = Math.ceil(nh);
        const o = off.getContext('2d');
        let fs = (sr.height * 0.86) / 0.64; // altura de mayúsculas ≈ 64% del tamaño de letra
        const letters = 'NUVELA'.split('');
        const measure = () => {
          o.font = `500 ${fs}px "Cormorant Garamond", serif`;
          const ws = letters.map((l) => o.measureText(l).width);
          const sp = fs * 0.1;
          return { ws, sp, total: ws.reduce((a, b) => a + b, 0) + sp * (letters.length - 1) };
        };
        let m = measure();
        const maxW = nw * (nw < 700 ? 0.86 : 0.74);
        if (m.total > maxW) { fs *= maxW / m.total; m = measure(); }
        o.fillStyle = '#fff';
        o.textBaseline = 'alphabetic';
        let x = (nw - m.total) / 2;
        letters.forEach((l, i) => { o.fillText(l, x, cy + fs * 0.32); x += m.ws[i] + m.sp; });
        const data = o.getImageData(0, 0, off.width, off.height).data;
        let step = nw < 700 ? 3 : nw < 1300 ? 4 : 5;
        let found = [];
        const sample = () => {
          found = [];
          for (let y = 0; y < off.height; y += step) {
            for (let xx = 0; xx < off.width; xx += step) {
              if (data[(y * off.width + xx) * 4 + 3] > 130) found.push([xx, y]);
            }
          }
        };
        sample();
        while (found.length > 5200) { step += 1; sample(); }
        const old = pts;
        pts = found.map(([hx, hy], i) => {
          const prev = old[i];
          const ang = Math.random() * Math.PI * 2;
          const rad = Math.max(nw, nh) * (0.35 + Math.random() * 0.6);
          const sx = nw / 2 + Math.cos(ang) * rad, sy = nh / 2 + Math.sin(ang) * rad * 0.7;
          return {
            hx, hy, sx, sy,
            x: prev ? prev.x : (assembled ? hx : sx), y: prev ? prev.y : (assembled ? hy : sy),
            vx: 0, vy: 0,
            s: (nw < 700 ? 0.9 : 1.1) + Math.random() * (nw < 700 ? 1.1 : 1.6),
            c: Math.random() < 0.12 ? 2 : Math.random() < 0.55 ? 1 : 0,
            ph: Math.random() * 6.283,
          };
        }).sort((a, b) => a.c - b.c);
        if (!dust.length || Math.abs(nw - w) > 40) {
          dust = Array.from({ length: nw < 700 ? 50 : 110 }, () => ({
            x: Math.random() * nw, y: Math.random() * nh,
            v: 0.08 + Math.random() * 0.35, r: 0.4 + Math.random() * 1.4, ph: Math.random() * 6.283,
          }));
        }
        w = nw; h = nh; built = true;
        if (reduce) draw(0, true);
      }

      function draw(t, still) {
        if (!built) return;
        const time = t * 0.001;
        const r = sec.getBoundingClientRect();
        const mx = mouse.x - r.left, my = mouse.y - r.top;
        const E = state.explode;
        ctx.clearRect(0, 0, w, h);
        // polvo dorado ambiental
        for (const d of dust) {
          if (!still) { d.y -= d.v; d.x += Math.sin(time * 0.5 + d.ph) * 0.15; if (d.y < -5) { d.y = h + 5; d.x = Math.random() * w; } }
          ctx.globalAlpha = 0.12 + 0.25 * (0.5 + 0.5 * Math.sin(time * 1.6 + d.ph));
          ctx.fillStyle = 'rgb(205,174,85)';
          ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fill();
        }
        // partículas del logo
        const k = assembled ? 0.04 : 0.006;
        const damp = assembled ? 0.86 : 0.94;
        const R = w < 700 ? 70 : 120, R2 = R * R;
        ctx.globalAlpha = Math.max(0, 1 - E * 1.05);
        let cur = -1;
        for (const p of pts) {
          let tx, ty;
          if (!assembled) {
            tx = p.sx + Math.sin(time * 0.4 + p.ph) * 30;
            ty = p.sy + Math.cos(time * 0.35 + p.ph) * 30;
          } else {
            tx = p.hx + Math.sin(time * 1.3 + p.ph) * 0.7;
            ty = p.hy + Math.cos(time * 1.1 + p.ph) * 0.7;
          }
          if (E > 0.001) {
            const a = noise(p.hx * 0.006, p.hy * 0.006, time * 0.25) * Math.PI * 2;
            tx += Math.cos(a) * E * w * 0.3 + (p.hx - w / 2) * E * 0.9;
            ty += Math.sin(a) * E * h * 0.3 - E * h * 0.35;
          }
          if (still) { p.x = tx; p.y = ty; }
          else {
            const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
            if (mouse.active && d2 < R2) {
              const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 5.5;
              p.vx += (dx / d) * f; p.vy += (dy / d) * f;
            }
            p.vx = (p.vx + (tx - p.x) * k) * damp;
            p.vy = (p.vy + (ty - p.y) * k) * damp;
            p.x += p.vx; p.y += p.vy;
          }
          if (p.c !== cur) { cur = p.c; const c = GOLD[cur]; ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`; }
          ctx.fillRect(p.x, p.y, p.s, p.s);
        }
        ctx.globalAlpha = 1;
      }

      addLoop(sec, (t) => { if (!reduce) draw(t); });
      return {
        state,
        build,
        assemble() { assembled = true; },
        assembleNow() { assembled = true; pts.forEach((p) => { p.x = p.hx; p.y = p.hy; p.vx = p.vy = 0; }); },
      };
    })();

    // =====================================================================
    // Ondas generativas (manifiesto y cierre)
    // =====================================================================
    function waves(cv, opts) {
      if (!cv) return null;
      const o = Object.assign({ lines: 18, spread: 0.6, amp: 46, alpha: 0.22, speed: 0.15, center: 0.5 }, opts || {});
      let ctx, w = 0, h = 0;
      const api = { boost: 0 };
      api.build = () => { const f = fitCanvas(cv, 1.5); ctx = f.ctx; w = f.w; h = f.h; };
      function draw(t) {
        if (!ctx) return;
        const time = t * 0.001 * o.speed * 6;
        const r = cv.getBoundingClientRect();
        const mx = mouse.x - r.left, my = mouse.y - r.top;
        const inside = mouse.active && mx > 0 && mx < w && my > 0 && my < h;
        ctx.clearRect(0, 0, w, h);
        ctx.lineWidth = 1;
        const step = w < 700 ? 10 : 14;
        for (let i = 0; i < o.lines; i++) {
          const f = i / (o.lines - 1);
          const y0 = h * (o.center - o.spread / 2 + f * o.spread);
          const mid = 1 - Math.abs(f - 0.5) * 2;
          ctx.strokeStyle = `rgba(205,174,85,${(0.04 + mid * o.alpha) * (1 + api.boost)})`;
          ctx.beginPath();
          for (let x = -10; x <= w + 10; x += step) {
            let y = y0 + noise(x * 0.0022, i * 0.18, time) * o.amp * (1 + api.boost)
              + Math.sin(x * 0.004 + time * 2 + i * 0.35) * o.amp * 0.35;
            if (inside) {
              const g = Math.exp(-((x - mx) ** 2) / (2 * 140 * 140));
              y += (my - y0) * 0.35 * g * mid;
            }
            if (x === -10) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }
      addLoop(cv, draw);
      return api;
    }
    const manifestoWaves = waves(q('#nv-waves-canvas'), { lines: 22, spread: 0.9, amp: 54, alpha: 0.16 });
    const finalWaves = waves(q('#nv-final-canvas'), { lines: 28, spread: 0.55, amp: 70, alpha: 0.3, center: 0.55 });

    // =====================================================================
    // 5. Simulación de resortes (encapsulados vs tradicionales)
    // =====================================================================
    const springs = (function () {
      const cv = q('#nv-springs-canvas');
      if (!cv) return null;
      let ctx, w = 0, h = 0, grid = [], sp = 20, mode = 'nuvela';
      const ptr = { x: 0, y: 0, on: false, I: 0, lx: -999, ly: -999 };
      const ripples = []; // ondas que salen del cursor cuando te mueves
      let shown = 0, frame = 0, lastAuto = 0, pm = 0, jolt = 0;
      const valEl = q('#nv-meter-val'), fillEl = q('#nv-meter-fill');

      // Foto opcional de la pareja dormida (vista desde arriba, PNG sin fondo).
      // Si existe images/home/pareja-dormida.png se usa esa; si no, se dibuja
      // una silueta elegante en dorado.
      const partnerImg = new Image();
      let partnerOk = false;
      partnerImg.onload = () => { partnerOk = true; };
      partnerImg.src = 'images/home/pareja-dormida.png';

      function build() {
        const f = fitCanvas(cv, 2); ctx = f.ctx; w = f.w; h = f.h;
        const cols = w < 500 ? 15 : 24;
        sp = w / cols;
        grid = [];
        const rowH = sp * 0.87;
        for (let r = 0, y = rowH * 0.9; y < h - rowH * 0.4; r++, y += rowH) {
          for (let x = (r % 2 ? sp : sp / 2); x < w; x += sp) grid.push({ x, y, d: 0 });
        }
      }
      function spawn(x, y, amp) {
        ripples.push({ x, y, t0: performance.now(), amp: Math.min(1.3, amp) });
        if (ripples.length > (mode === 'trad' ? 8 : 14)) ripples.shift();
      }
      function onPtr(e, force) {
        const r = cv.getBoundingClientRect();
        ptr.x = Math.min(e.clientX - r.left, w * 0.52); ptr.y = e.clientY - r.top; ptr.on = true;
        const dist = Math.hypot(ptr.x - ptr.lx, ptr.y - ptr.ly);
        if (force || dist > sp * 1.3) {
          spawn(ptr.x, ptr.y, force ? 0.9 : 0.3 + dist / (sp * 3.5));
          ptr.lx = ptr.x; ptr.ly = ptr.y;
        }
      }
      cv.addEventListener('pointermove', (e) => onPtr(e, false));
      cv.addEventListener('pointerdown', (e) => onPtr(e, true));
      cv.addEventListener('pointerleave', () => { ptr.on = false; });
      qa('.nv-toggle button').forEach((b) => b.addEventListener('click', () => {
        mode = b.dataset.mode;
        qa('.nv-toggle button').forEach((x) => x.classList.toggle('is-on', x === b));
      }));

      // Silueta de una mujer dormida vista desde arriba (cabeza arriba)
      function drawSleeper(cx, cy, u, time) {
        const shake = Math.sin(time * 26) * jolt * u * 0.05;
        const tilt = Math.sin(time * 19) * jolt * 0.07;
        const breathe = 1 + Math.sin(time * 1.6) * 0.012 * (1 - Math.min(1, jolt * 2));
        ctx.save();
        ctx.translate(cx + shake, cy);
        ctx.rotate(tilt);
        ctx.scale(breathe, breathe);
        if (partnerOk) {
          const ih = u * 1.05, iw = ih * (partnerImg.width / partnerImg.height);
          ctx.globalAlpha = 0.95;
          ctx.drawImage(partnerImg, -iw / 2, -ih / 2, iw, ih);
          ctx.globalAlpha = 1;
          ctx.restore();
          return;
        }
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        // almohada
        ctx.fillStyle = 'rgba(40,37,32,.9)'; ctx.strokeStyle = 'rgba(205,174,85,.5)'; ctx.lineWidth = 1;
        roundRect(-0.24 * u, -0.52 * u, 0.48 * u, 0.2 * u, 0.06 * u); ctx.fill(); ctx.stroke();
        // cabello largo extendido sobre la almohada
        ctx.fillStyle = 'rgba(185,155,63,.55)';
        ctx.beginPath();
        ctx.moveTo(-0.02 * u, -0.47 * u);
        ctx.bezierCurveTo(-0.16 * u, -0.5 * u, -0.2 * u, -0.38 * u, -0.17 * u, -0.3 * u);
        ctx.bezierCurveTo(-0.15 * u, -0.24 * u, -0.1 * u, -0.25 * u, -0.07 * u, -0.29 * u);
        ctx.bezierCurveTo(-0.02 * u, -0.27 * u, 0.06 * u, -0.27 * u, 0.09 * u, -0.31 * u);
        ctx.bezierCurveTo(0.14 * u, -0.27 * u, 0.2 * u, -0.33 * u, 0.15 * u, -0.41 * u);
        ctx.bezierCurveTo(0.12 * u, -0.49 * u, 0.04 * u, -0.5 * u, -0.02 * u, -0.47 * u);
        ctx.fill();
        // rostro (de lado, mirando a la izquierda)
        ctx.fillStyle = 'rgba(232,214,182,.9)';
        ctx.beginPath(); ctx.ellipse(-0.015 * u, -0.37 * u, 0.062 * u, 0.078 * u, -0.25, 0, 6.283); ctx.fill();
        // cobija (cuerpo de lado, hombro y cadera marcados)
        ctx.fillStyle = 'rgba(30,28,24,.88)'; ctx.strokeStyle = 'rgba(205,174,85,.8)'; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-0.17 * u, -0.27 * u);
        ctx.bezierCurveTo(-0.24 * u, -0.18 * u, -0.22 * u, -0.02 * u, -0.17 * u, 0.06 * u);
        ctx.bezierCurveTo(-0.24 * u, 0.16 * u, -0.22 * u, 0.36 * u, -0.14 * u, 0.5 * u);
        ctx.lineTo(0.14 * u, 0.5 * u);
        ctx.bezierCurveTo(0.2 * u, 0.32 * u, 0.2 * u, 0.12 * u, 0.15 * u, 0.02 * u);
        ctx.bezierCurveTo(0.2 * u, -0.08 * u, 0.2 * u, -0.22 * u, 0.13 * u, -0.27 * u);
        ctx.bezierCurveTo(0.05 * u, -0.25 * u, -0.08 * u, -0.25 * u, -0.17 * u, -0.27 * u);
        ctx.fill(); ctx.stroke();
        // brazo sobre la cobija
        ctx.strokeStyle = 'rgba(240,222,190,.85)'; ctx.lineWidth = Math.max(2, u * 0.035);
        ctx.beginPath(); ctx.moveTo(-0.12 * u, -0.2 * u);
        ctx.bezierCurveTo(-0.16 * u, -0.08 * u, -0.08 * u, 0.0, 0.04 * u, -0.02 * u); ctx.stroke();
        // pliegues de la cobija
        ctx.strokeStyle = 'rgba(205,174,85,.35)'; ctx.lineWidth = 1;
        [[-0.1, 0.12, 0.08, 0.16], [-0.12, 0.28, 0.1, 0.3], [-0.06, 0.4, 0.09, 0.43]].forEach(([x1, y1, x2, y2]) => {
          ctx.beginPath(); ctx.moveTo(x1 * u, y1 * u); ctx.quadraticCurveTo(0, (y1 + 0.04) * u, x2 * u, y2 * u); ctx.stroke();
        });
        ctx.restore();
      }
      function roundRect(x, y, ww, hh, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y); ctx.arcTo(x + ww, y, x + ww, y + hh, r); ctx.arcTo(x + ww, y + hh, x, y + hh, r);
        ctx.arcTo(x, y + hh, x, y, r); ctx.arcTo(x, y, x + ww, y, r); ctx.closePath();
      }

      function draw(t) {
        if (!ctx) return;
        const now = performance.now();
        const time = t * 0.001;
        let px, py, I;
        if (ptr.on) { px = ptr.x; py = ptr.y; I = 1; }
        else {
          // demo automática: alguien dándose vuelta en el lado izquierdo
          px = w * 0.25 + Math.sin(time * 0.7) * w * 0.12;
          py = h * 0.5 + Math.sin(time * 1.1) * h * 0.26;
          I = 0.65 + 0.35 * Math.sin(time * 2.2);
          if (now - lastAuto > 1100) { spawn(px, py, 0.7); lastAuto = now; }
        }
        ptr.I += (I - ptr.I) * 0.1;
        const trad = mode === 'trad';
        const sig = sp * 1.6, sig2 = 2 * sig * sig;
        const speed = trad ? 520 : 300;          // px por segundo de cada onda
        const band = sp * (trad ? 1.3 : 0.9);    // grosor de la onda
        // quitar ondas viejas
        for (let i = ripples.length - 1; i >= 0; i--) if ((now - ripples[i].t0) > (trad ? 2600 : 1100)) ripples.splice(i, 1);
        ctx.clearRect(0, 0, w, h);

        // anillos de las ondas (exagerados)
        for (const rp of ripples) {
          const age = (now - rp.t0) / 1000, rad = age * speed;
          const fade = trad ? Math.exp(-age * 1.1) : Math.exp(-age * 3.2) * Math.exp(-rad / (sp * 5));
          if (fade < 0.02) continue;
          for (let k = 0; k < (trad ? 3 : 2); k++) {
            const rr = rad - k * sp * 0.9;
            if (rr <= 0) continue;
            ctx.strokeStyle = `rgba(205,174,85,${fade * rp.amp * (0.38 - k * 0.12)})`;
            ctx.lineWidth = (trad ? 1.6 : 1.1) - k * 0.35;
            ctx.beginPath(); ctx.arc(rp.x, rp.y, rr, 0, 6.283); ctx.stroke();
          }
        }

        const zx = w * 0.62;
        let pSum = 0, pN = 0;
        for (const s of grid) {
          const dx = s.x - px, dy = s.y - py, dist2 = dx * dx + dy * dy;
          let target = ptr.I * Math.exp(-dist2 / sig2) * (trad ? 0.8 : 1.15);
          let push = 0;
          for (const rp of ripples) {
            const age = (now - rp.t0) / 1000, rad = age * speed;
            const dd = Math.hypot(s.x - rp.x, s.y - rp.y);
            const fade = trad ? Math.exp(-age * 1.1) : Math.exp(-age * 3.2) * Math.exp(-dd / (sp * 3.2));
            const wv = rp.amp * fade * Math.exp(-((dd - rad) ** 2) / (2 * band * band));
            target += wv * (trad ? 0.6 : 0.65);
            push += wv;
          }
          if (trad) target += ptr.I * 0.1 * Math.exp(-Math.sqrt(dist2) / (w * 0.6)) * (0.6 + 0.4 * Math.sin(Math.sqrt(dist2) * 0.05 - time * 9));
          s.d += (target - s.d) * 0.28;
          if (s.x > zx) { pSum += s.d; pN++; }
          const d = Math.min(1.4, s.d);
          const dn = Math.min(1, d);
          const rr = sp * 0.38 * (1 - dn * 0.5);
          const c0 = GOLD[1], c1 = GOLD[2];
          const cr = Math.round(c0[0] + (c1[0] - c0[0]) * dn), cg = Math.round(c0[1] + (c1[1] - c0[1]) * dn), cb = Math.round(c0[2] + (c1[2] - c0[2]) * dn);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${0.3 + dn * 0.7})`;
          ctx.lineWidth = 1 + dn * 0.8;
          ctx.beginPath(); ctx.arc(s.x, s.y, rr, 0, 6.283); ctx.stroke();
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(s.x, s.y, rr * 0.55, 0, 6.283); ctx.stroke();
          if (dn > 0.04) {
            ctx.fillStyle = `rgba(${cr},${cg},${cb},${dn * 0.6})`;
            ctx.beginPath(); ctx.arc(s.x, s.y, rr * 0.55, 0, 6.283); ctx.fill();
          }
          if (push > 0.35) { // destello en la cresta de la onda
            ctx.fillStyle = `rgba(255,240,200,${Math.min(0.3, push * 0.25)})`;
            ctx.beginPath(); ctx.arc(s.x, s.y, rr * 1.15, 0, 6.283); ctx.fill();
          }
        }

        // tú (el cursor)
        const g = ctx.createRadialGradient(px, py, 0, px, py, sp * 3.2);
        g.addColorStop(0, `rgba(252,249,245,${0.22 * ptr.I})`); g.addColorStop(1, 'rgba(252,249,245,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, sp * 3.2, 0, 6.283); ctx.fill();
        ctx.strokeStyle = 'rgba(252,249,245,.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(px, py, sp * 0.9, 0, 6.283); ctx.stroke();

        // tu pareja dormida
        pm = pN ? pSum / pN : 0;
        jolt += (Math.min(1, pm * 3.2) - jolt) * 0.12;
        ctx.setLineDash([4, 6]);
        ctx.strokeStyle = `rgba(205,174,85,${0.22 + Math.min(0.6, pm * 3)})`;
        ctx.strokeRect(zx, 14, w - zx - 14, h - 28);
        ctx.setLineDash([]);
        const u = Math.min((w - zx) * 1.25, h * 0.7);
        drawSleeper(zx + (w - zx - 14) / 2, h * 0.52, u, time);
        // "Zzz" cuando duerme tranquila
        const calm = Math.max(0, 1 - jolt * 2.5);
        if (calm > 0.05) {
          ctx.fillStyle = `rgba(205,174,85,${0.7 * calm})`;
          ctx.font = `600 ${Math.round(sp * 0.55)}px Inter, sans-serif`;
          for (let k = 0; k < 3; k++) {
            const ph = (time * 0.5 + k / 3) % 1;
            ctx.globalAlpha = calm * Math.sin(ph * Math.PI);
            ctx.fillText('z', zx + (w - zx) * 0.68 + ph * sp * 1.2, h * 0.2 - ph * sp * 1.6 + k * 2);
          }
          ctx.globalAlpha = 1;
        }

        // medidor
        const pct = Math.min(100, Math.round((pm / Math.max(0.2, ptr.I)) * 220));
        shown += (pct - shown) * 0.12;
        if (++frame % 6 === 0) {
          if (valEl) valEl.textContent = Math.round(shown) + '%';
          if (fillEl) fillEl.style.width = Math.round(shown) + '%';
        }
      }
      addLoop(cv, draw);
      return { build };
    })();

    // =====================================================================
    // Textos que se encienden palabra por palabra
    // =====================================================================
    function splitWords(el) {
      const txt = el.getAttribute('data-nv-' + lang()) || el.getAttribute('data-nv-es') || '';
      el.setAttribute('aria-label', txt.replace(/\*/g, ''));
      el.innerHTML = txt.split(/\s+/).map((word) => {
        const gold = /^\*.*\*$/.test(word);
        const clean = word.replace(/\*/g, '');
        return `<span class="nv-w${gold ? ' nv-gold' : ''}" aria-hidden="true">${clean}</span>`;
      }).join(' ');
    }

    // =====================================================================
    // 6. Colección (sale del arreglo PRODUCTS del catálogo)
    // =====================================================================
    NV.renderCollection = function () {
      const track = q('#nv-collection-track');
      if (!track || typeof PRODUCTS === 'undefined') return;
      const es = lang() === 'es';
      const list = PRODUCTS.filter((p) => p.mainImage && !/logosinfondo/.test(p.mainImage));
      track.innerHTML = list.map((p, i) => {
        const pf = typeof priceFrom === 'function' ? priceFrom(p) : '';
        const price = /^Q/.test(pf) ? (es ? 'Desde ' : 'From ') + pf : pf;
        const name = typeof pick === 'function' ? pick(p.name) : p.name.es;
        const cat = typeof pick === 'function' ? pick(p.category) : p.category.es;
        return `
          <article class="nv-pcard js-view-product" data-product-id="${p.id}" data-cursor="view">
            <div class="nv-pcard-media">
              <span class="nv-pcard-idx">${String(i + 1).padStart(2, '0')}</span>
              <img src="${p.mainImage}" alt="${name}" loading="lazy" />
            </div>
            <div class="nv-pcard-info">
              <div><p>${cat}</p><h3>${name}</h3></div>
              <span class="nv-pcard-price">${price}</span>
            </div>
          </article>`;
      }).join('') + `
          <article class="nv-pcard nv-pcard-more" data-page="producto" data-cursor="view">
            <div class="nv-pcard-media"><span>${es ? 'Ver catálogo completo →' : 'View full catalog →'}</span></div>
          </article>`;
    };

    // =====================================================================
    // Cursor dorado + botones magnéticos (solo con mouse)
    // =====================================================================
    if (fine && hasGsap) {
      const cur = q('#nv-cursor'), label = q('#nv-cursor span');
      const cx = gsap.quickTo(cur, 'x', { duration: 0.45, ease: 'power3' });
      const cy = gsap.quickTo(cur, 'y', { duration: 0.45, ease: 'power3' });
      window.addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); }, { passive: true });
      document.addEventListener('pointerover', (e) => {
        const view = e.target.closest('[data-cursor="view"]');
        const hov = e.target.closest('a, button, .nv-toggle, #nv-springs-canvas, .nv-layers-stage');
        cur.classList.toggle('is-view', !!view);
        cur.classList.toggle('is-hover', !view && !!hov);
        if (view) label.textContent = lang() === 'es' ? 'Ver' : 'View';
      });
      document.addEventListener('pointerover', (e) => {
        const m = e.target.closest('.nv-magnetic');
        if (!m || m._nvMag) return;
        m._nvMag = true;
        const xT = gsap.quickTo(m, 'x', { duration: 0.6, ease: 'power3' });
        const yT = gsap.quickTo(m, 'y', { duration: 0.6, ease: 'power3' });
        m.addEventListener('pointermove', (ev) => {
          const r = m.getBoundingClientRect();
          xT((ev.clientX - (r.left + r.width / 2)) * 0.32);
          yT((ev.clientY - (r.top + r.height / 2)) * 0.32);
        });
        m.addEventListener('pointerleave', () => {
          gsap.to(m, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, .4)' });
        });
      });
      // Tarjetas "Por qué Nuvela": inclinación 3D + luz que sigue al mouse
      qa('.nv-tilt').forEach((c) => {
        const rx = gsap.quickTo(c, 'rotationX', { duration: 0.6, ease: 'power3' });
        const ry = gsap.quickTo(c, 'rotationY', { duration: 0.6, ease: 'power3' });
        c.addEventListener('pointermove', (e) => {
          const r = c.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          c.style.setProperty('--mx', px * 100 + '%'); c.style.setProperty('--my', py * 100 + '%');
          ry((px - 0.5) * 10); rx(-(py - 0.5) * 10);
        });
        c.addEventListener('pointerleave', () => { rx(0); ry(0); });
      });
    }

    // =====================================================================
    // 4. Capas: tocar una capa (o su número) muestra cuál es
    // =====================================================================
    let layersReady = !hasGsap;
    let activeLayer = -1;
    function selectLayer(i) {
      if (!layersReady) return;
      activeLayer = (i === activeLayer) ? -1 : i;
      qa('.nv-layer[data-l]').forEach((el) => {
        const n = Number(el.dataset.l);
        el.classList.toggle('is-active', n === activeLayer);
        el.classList.toggle('is-dim', activeLayer >= 0 && n !== activeLayer);
        if (hasGsap) gsap.to(el, { x: n === activeLayer && !isMobile() ? -22 : 0, duration: 0.7, ease: 'expo.out' });
      });
      qa('.nv-cap').forEach((c) => c.classList.toggle('is-on', Number(c.dataset.c) === activeLayer));
      const hint = q('.nv-layer-hint');
      if (hint) hint.classList.toggle('is-on', activeLayer < 0);
    }
    (function () {
      const stage = q('.nv-layers-stage');
      if (!stage) return;
      stage.addEventListener('click', (e) => {
        const hot = e.target.closest('.nv-hot');
        if (hot) { selectLayer(Number(hot.dataset.l)); return; }
        // ¿Qué capa se tocó? La que tenga su centro más cerca del punto tocado.
        let best = -1, bestD = Infinity;
        qa('.nv-layer[data-l]', stage).forEach((el) => {
          const r = el.getBoundingClientRect();
          if (e.clientX < r.left || e.clientX > r.right) return;
          const d = Math.abs(e.clientY - (r.top + r.height / 2));
          if (d < bestD) { bestD = d; best = Number(el.dataset.l); }
        });
        if (best >= 0) selectLayer(best);
      });
    })();

    // =====================================================================
    // Animaciones de scroll del home (se crean al entrar al home y se
    // destruyen al salir, porque el sitio cambia de "página" sin recargar).
    // =====================================================================
    let gctx = null;
    function buildScroll() {
      if (!hasGsap) return;
      const mobile = isMobile();
      gctx = gsap.context(() => {
        // --- Hero: el logo se dispersa, la foto se acerca, el texto se va
        if (hero) {
          ScrollTrigger.create({
            trigger: '#nv-hero', start: 'top top', end: 'bottom top', scrub: true,
            onUpdate: (s) => { hero.state.explode = s.progress * s.progress * 1.4; },
          });
        }
        gsap.to('.nv-hero-photo', { scale: 1.35, yPercent: -12, ease: 'none', scrollTrigger: { trigger: '#nv-hero', start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to('.nv-hero-copy, .nv-scroll-cue', { opacity: 0, y: -80, ease: 'none', scrollTrigger: { trigger: '#nv-hero', start: 'top top', end: '55% top', scrub: true } });

        // --- Manifiesto: palabras que se encienden
        const mWords = qa('#nv-manifesto .nv-w');
        if (mWords.length) {
          gsap.timeline({ scrollTrigger: { trigger: '#nv-manifesto', start: 'top top', end: '+=130%', pin: true, scrub: 0.6,
            onUpdate: (s) => { if (manifestoWaves) manifestoWaves.boost = s.progress * 0.8; } } })
            .to(mWords, { opacity: 1, stagger: 0.12, ease: 'none', duration: 0.5 });
        }

        // --- Revelación de la foto
        const startClip = mobile ? 'inset(30% 8% 30% 8% round 22px)' : 'inset(22% 30% 22% 30% round 28px)';
        gsap.set('.nv-reveal-media', { clipPath: startClip });
        const counters = qa('.nv-stat b');
        const cObj = { p: 0 };
        gsap.timeline({ scrollTrigger: { trigger: '#nv-reveal', start: 'top top', end: '+=170%', pin: true, scrub: 0.8 } })
          .to('.nv-reveal-media', { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 4 }, 0)
          .to('.nv-reveal-media img', { scale: 1, ease: 'power2.inOut', duration: 4 }, 0)
          .to('.nv-reveal-scrim', { opacity: 1, duration: 1.5 }, 2.6)
          .fromTo('.nv-reveal-copy', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.5 }, 3)
          .fromTo('.nv-stats', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2 }, 3.8)
          .to(cObj, { p: 1, duration: 2, ease: 'power1.out', onUpdate: () => {
            counters.forEach((b) => { b.textContent = Math.round(cObj.p * Number(b.dataset.count)); });
          } }, 3.8)
          .to({}, { duration: 1.2 });

        // --- Colchón desarmado en capas
        // --- Colchón desarmado: se abre solo una vez al llegar; luego es interactivo
        const layers = qa('.nv-layer[data-l]').sort((a, b) => a.dataset.l - b.dataset.l);
        const stage = q('.nv-layers-stage');
        const spread = [-0.36, -0.12, 0.12, 0.35];
        // En el teléfono las capas se separan según el espacio libre que hay
        // entre el título y el texto de abajo, para que no queden pegadas.
        let offsets = () => spread.map((v) => v * stage.offsetWidth);
        if (mobile) {
          const head = q('.nv-layers-head'), caps = q('.nv-layer-captions');
          const band = () => ({ top: head.offsetTop + head.offsetHeight + 18, bottom: caps.offsetTop - 6 });
          const bd = band();
          gsap.set(stage, { top: (bd.top + bd.bottom) / 2 });
          offsets = () => {
            const b = band();
            const lh = Math.max.apply(null, layers.map((l) => l.offsetHeight)) * 0.9;
            const span = Math.max(0.7 * stage.offsetWidth, (b.bottom - b.top - lh) / 0.9);
            return [-0.5, -0.19, 0.15, 0.5].map((v) => v * span);
          };
        }
        layersReady = false;
        gsap.timeline({ scrollTrigger: { trigger: '#nv-layers', start: 'top 55%', once: true },
          onComplete: () => { layersReady = true; } })
          .fromTo('.nv-layers-head', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, 0)
          .fromTo('.nv-layer-full', { opacity: 0, scale: 0.9, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'expo.out' }, 0.1)
          .set(layers, { opacity: 1 }, 1.3)
          .set('.nv-layer-full', { opacity: 0 }, 1.32)
          .to(layers, { y: (i) => offsets()[i], duration: 1.6, ease: 'expo.inOut', stagger: 0.04 }, 1.32)
          .to(stage, { scale: mobile ? 0.9 : 0.92, duration: 1.6, ease: 'expo.inOut' }, 1.32)
          .to('.nv-hot', { opacity: 1, duration: 0.6, stagger: 0.08 }, 2.6);
        const track = q('#nv-collection-track');
        if (track && !mobile) {
          const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
          const htw = gsap.to(track, { x: () => -dist(), ease: 'none',
            scrollTrigger: { trigger: '#nv-collection', start: 'top top', end: () => '+=' + dist(), pin: '.nv-collection-pin', scrub: 0.8, invalidateOnRefresh: true } });
          qa('.nv-pcard-media img', track).forEach((img) => {
            gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: img.closest('.nv-pcard'), containerAnimation: htw, start: 'left right', end: 'right left', scrub: true } });
          });
          // El título se desvanece cuando las tarjetas pasan por debajo
          gsap.to('.nv-collection-head', { opacity: 0, x: -40, ease: 'none', scrollTrigger: { trigger: '#nv-collection', start: 'top top', end: () => '+=' + window.innerWidth * 0.3, scrub: true } });
          gsap.from('.nv-collection-head > *', { opacity: 0, y: 40, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '#nv-collection', start: 'top 70%' } });
        } else if (track) {
          gsap.from('.nv-pcard', { opacity: 0, x: 60, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: track, start: 'top 85%' } });
        }

        // --- Marquesina: acelera con la velocidad del scroll
        const rows = qa('.nv-marquee-row');
        const tweens = rows.map((row) => {
          const inner = q('.nv-marquee-inner', row);
          const dir = Number(row.dataset.dir);
          return gsap.fromTo(inner, { xPercent: dir < 0 ? 0 : -50 }, { xPercent: dir < 0 ? -50 : 0, duration: 60, ease: 'none', repeat: -1 });
        });
        ScrollTrigger.create({
          trigger: '#nv-marquee', start: 'top bottom', end: 'bottom top',
          onUpdate: (s) => {
            const v = Math.min(3, 1 + Math.abs(s.getVelocity()) / 600);
            tweens.forEach((tw) => gsap.to(tw, { timeScale: v, duration: 0.2, overwrite: true, onComplete: () => gsap.to(tw, { timeScale: 1, duration: 1.2 }) }));
          },
        });

        // --- Títulos que suben al aparecer
        qa('#nv-springs .nv-springs-copy > *, #nv-why .nv-why-head > *, #nv-gallery .nv-gallery-head > *, #nv-final .nv-final-inner > *').forEach((el) => {
          gsap.from(el, { opacity: 0, y: 50, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
        });
        gsap.from('.nv-springs-bed', { opacity: 0, scale: 0.92, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.nv-springs-bed', start: 'top 85%', toggleActions: 'play none none reverse' } });
        gsap.from('.nv-card', { opacity: 0, y: 80, rotationX: -14, stagger: 0.08, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.nv-why-grid', start: 'top 82%', toggleActions: 'play none none reverse' } });

        // --- Testimonio
        const vWords = qa('#nv-voice .nv-w');
        if (vWords.length) gsap.to(vWords, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '#nv-voice', start: 'top 70%', end: 'bottom 70%', scrub: 0.6 } });

        // --- Galería con parallax
        qa('.nv-g').forEach((g) => {
          const s = Number(g.dataset.speed || 0) * (mobile ? 0.5 : 1);
          gsap.fromTo(g, { y: s }, { y: -s, ease: 'none', scrollTrigger: { trigger: g, start: 'top bottom', end: 'bottom top', scrub: true } });
        });

        // --- Cierre: las ondas se intensifican al llegar
        ScrollTrigger.create({ trigger: '#nv-final', start: 'top bottom', end: 'center center', scrub: true,
          onUpdate: (s) => { if (finalWaves) finalWaves.boost = s.progress * 0.6; } });
      }, '#page-home');
    }

    // =====================================================================
    // PRODUCTOS y DETALLE DE PRODUCTO (mismo estilo inmersivo del home)
    // =====================================================================
    const prodWaves = waves(q('#nv-prod-canvas'), { lines: 30, spread: 1.05, amp: 80, alpha: 0.12, center: 0.55 });
    let pageCtx = null;

    function tiltCard(c, max) {
      if (!fine || !hasGsap || c._nvTilt) return;
      c._nvTilt = true;
      const rx = gsap.quickTo(c, 'rotationX', { duration: 0.6, ease: 'power3' });
      const ry = gsap.quickTo(c, 'rotationY', { duration: 0.6, ease: 'power3' });
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * max);
        rx(-((e.clientY - r.top) / r.height - 0.5) * max);
      });
      c.addEventListener('pointerleave', () => { rx(0); ry(0); });
    }

    // Tarjetas nuevas de la cuadrícula: entran con animación, se inclinan
    // con el mouse y muestran "Ver" en el cursor dorado.
    function animateCards(nodes) {
      const cards = nodes.filter((n) => n.nodeType === 1 && n.classList.contains('product-card'));
      if (!cards.length) return;
      cards.forEach((c) => { c.setAttribute('data-cursor', 'view'); tiltCard(c, 7); });
      if (hasGsap && !reduce) gsap.fromTo(cards, { opacity: 0, y: 60, rotationX: -10 }, { opacity: 1, y: 0, rotationX: 0, duration: 1.1, ease: 'expo.out', stagger: 0.07, clearProps: 'opacity,y' });
    }
    const pGrid = q('#products-grid');
    if (pGrid && 'MutationObserver' in window) {
      new MutationObserver((muts) => {
        if (!q('#page-producto.active')) return;
        animateCards(muts.flatMap((m) => Array.from(m.addedNodes)));
      }).observe(pGrid, { childList: true });
    }
    const pFilter = q('#products-filter');
    if (pFilter && 'MutationObserver' in window) {
      new MutationObserver(() => qa('#products-filter > button').forEach((b) => tiltCard(b, 9))).observe(pFilter, { childList: true });
    }

    // Precio grande del tamaño elegido (cuenta hacia el nuevo precio)
    const priceEl = q('#nv-pd-price'), priceSize = q('#nv-pd-price-size');
    const priceState = { v: 0 };
    function updatePrice() {
      if (!priceEl || typeof PRODUCTS === 'undefined' || typeof currentProductId === 'undefined') return;
      const p = PRODUCTS.find((x) => x.id === currentProductId);
      if (!p) return;
      const v = p.variants.find((x) => x.name === pdSelectedVariant) || p.variants[0];
      const tw = q('.nv-trust-warranty'); if (tw) tw.hidden = p.category.es !== 'Colchones';
      if (priceSize) priceSize.textContent = v ? v.name : '';
      if (!v || !v.price) { priceEl.textContent = typeof formatPrice === 'function' ? formatPrice(0) : ''; priceState.v = 0; return; }
      if (!hasGsap || reduce || !priceState.v) { priceState.v = v.price; priceEl.textContent = formatPrice(v.price); return; }
      gsap.to(priceState, { v: v.price, duration: 0.8, ease: 'power3.out', overwrite: true,
        onUpdate: () => { priceEl.textContent = formatPrice(Math.round(priceState.v / 10) * 10); },
        onComplete: () => { priceEl.textContent = formatPrice(v.price); } });
    }
    const pdSizes = q('#pd-sizes');
    if (pdSizes && 'MutationObserver' in window) new MutationObserver(updatePrice).observe(pdSizes, { childList: true });

    function enterProducts() {
      if (prodWaves) prodWaves.build();
      qa('#products-filter > button').forEach((b) => tiltCard(b, 9));
      if (!hasGsap || reduce) return;
      pageCtx = gsap.context(() => {
        gsap.fromTo('.nv-prod-hero-inner > *', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1 });
        gsap.fromTo('#products-filter > button', { opacity: 0, y: 70, rotationX: -14 }, { opacity: 1, y: 0, rotationX: 0, duration: 1.2, ease: 'expo.out', stagger: 0.07, delay: 0.25 });
      }, '#page-producto');
    }
    function enterDetail() {
      priceState.v = 0; updatePrice();
      if (!hasGsap || reduce) return;
      pageCtx = gsap.context(() => {
        gsap.fromTo('.nv-pd-zoom', { opacity: 0, scale: 0.94, clipPath: 'inset(6% 6% 6% 6% round 28px)' }, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.4, ease: 'expo.out' });
        gsap.fromTo('#pd-thumbs .thumb', { opacity: 0, y: 20 }, { opacity: (i, el) => (el.classList.contains('border-gold') ? 1 : 0.55), y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05, delay: 0.3, clearProps: 'opacity' });
        gsap.fromTo('#pd-eyebrow, #pd-title, #pd-tagline', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.1 });
        gsap.fromTo('#pd-stats > div', { opacity: 0, y: 24, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'expo.out', stagger: 0.04, delay: 0.35 });
        gsap.fromTo('.nv-pd-price, #pd-sizes > *, #pd-purchase', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05, delay: 0.5 });
        qa('#pd-benefits > div, #pd-specs-table, #pd-faq .faq-item').forEach((el) => {
          gsap.from(el, { opacity: 0, y: 50, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } });
        });
        qa('#pd-benefits > div').forEach((c) => tiltCard(c, 8));
      }, '#page-producto-detalle');
      ScrollTrigger.refresh();
    }
    // ---- Foto principal del producto: si es vertical, se muestra vertical ----
    (function () {
      const img = q('#pd-main-img'), box = q('.nv-pd-zoom');
      if (!img || !box) return;
      const check = () => { if (img.naturalWidth) box.classList.toggle('is-portrait', img.naturalHeight > img.naturalWidth * 1.05); };
      img.addEventListener('load', check);
      if (img.complete) check();
    })();

    // ---- Scroll suave para los botones que llevan a otra parte de la página ----
    const nativeSIV = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (opts) {
      if (lenis && opts && typeof opts === 'object' && opts.behavior === 'smooth') {
        const off = opts.block === 'center' ? -(window.innerHeight / 2 - this.offsetHeight / 2) : -110;
        lenis.scrollTo(this, { offset: off, duration: 1.2 });
      } else nativeSIV.call(this, opts);
    };
    document.addEventListener('click', (e) => {
      const b = e.target.closest('.js-nv-goto');
      if (!b) return;
      const t = q(b.dataset.target);
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // ---- Línea para Hoteles ----
    const pill = q('#nv-quote-pill'), pillCount = q('#nv-quote-count');
    function updatePill() {
      if (!pill) return;
      const n = typeof quoteCount === 'function' ? quoteCount() : 0;
      if (pillCount) pillCount.textContent = n;
      pill.classList.toggle('is-on', n > 0);
    }
    const qc = q('#quote-cart-content');
    if (qc && 'MutationObserver' in window) new MutationObserver(updatePill).observe(qc, { childList: true, subtree: true });
    function enterHotel() {
      updatePill();
      qa('#page-linea-hotelera .nv-tilt-h').forEach((c) => tiltCard(c, 8));
      qa('#hotel-products-grid .product-card').forEach((c) => tiltCard(c, 6));
      if (!hasGsap || reduce) return;
      const mobile = isMobile();
      pageCtx = gsap.context(() => {
        gsap.fromTo('.nv-hotel-hero-inner > *', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1 });
        gsap.fromTo('.nv-hotel-strip > div', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.5 });
        gsap.to('.nv-hotel-hero-bg', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.nv-hotel-hero', start: 'top top', end: 'bottom top', scrub: true } });
        qa('.nv-hotel-who .nv-eyebrow, .nv-hotel-who .nv-h2, .nv-hotel-catalog .nv-eyebrow, .nv-hotel-catalog .nv-h2, .nv-hotel-steps .nv-eyebrow, .nv-hotel-steps .nv-h2, .nv-hotel-cta .nv-wrap > *').forEach((el) => {
          gsap.from(el, { opacity: 0, y: 50, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
        });
        gsap.from('.nv-who', { opacity: 0, y: 70, rotationX: -12, duration: 1.2, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.nv-who-grid', start: 'top 82%', toggleActions: 'play none none reverse' } });
        gsap.from('.nv-quote-panel', { opacity: 0, y: 40, scale: 0.98, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.nv-quote-panel', start: 'top 90%' } });
        gsap.from('#hotel-products-grid .product-card', { opacity: 0, y: 60, rotationX: -10, duration: 1.1, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '#hotel-products-grid', start: 'top 85%' } });
        gsap.to('.nv-steps-line i', mobile ? { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.nv-steps', start: 'top 75%', end: 'bottom 60%', scrub: true } }
          : { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.nv-steps', start: 'top 80%', end: 'top 35%', scrub: true } });
        gsap.from('.nv-steps li', { opacity: 0, y: 40, duration: 1, ease: 'expo.out', stagger: 0.15, scrollTrigger: { trigger: '.nv-steps', start: 'top 80%', toggleActions: 'play none none reverse' } });
      }, '#page-linea-hotelera');
      ScrollTrigger.refresh();
    }

    // ---- Agenda tu Cita ----
    const citaWaves = waves(q('#nv-cita-canvas'), { lines: 24, spread: 0.9, amp: 60, alpha: 0.1, center: 0.5 });
    function enterCita() {
      if (citaWaves) citaWaves.build();
      qa('#page-cita .nv-tilt-c').forEach((c) => tiltCard(c, 8));
      const ph = q('.nv-cita-photo'); if (ph) tiltCard(ph, 5);
      if (!hasGsap || reduce) return;
      pageCtx = gsap.context(() => {
        gsap.fromTo('.nv-cita-copy > *', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08 });
        gsap.fromTo('.nv-cita-photo', { opacity: 0, clipPath: 'inset(12% 12% 12% 12% round 30px)' }, { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 30px)', duration: 1.6, ease: 'expo.out', delay: 0.15 });
        gsap.fromTo('.nv-cita-photo img', { scale: 1.25 }, { scale: 1.06, duration: 2.2, ease: 'expo.out', delay: 0.15 });
        gsap.fromTo('.nv-cita-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', delay: 0.9 });
        qa('#page-cita .nv-wrap > .nv-eyebrow, #page-cita .nv-wrap > .nv-h2, #page-cita .nv-wrap > .nv-lead').forEach((el) => {
          gsap.from(el, { opacity: 0, y: 50, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
        });
        gsap.from('.nv-cita-cards .nv-card', { opacity: 0, y: 70, rotationX: -12, duration: 1.2, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.nv-cita-cards', start: 'top 82%', toggleActions: 'play none none reverse' } });
        gsap.from('#cita-calendar-wrap .grid > div', { opacity: 0, y: 50, scale: 0.96, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '#cita-calendar-wrap', start: 'top 85%', toggleActions: 'play none none reverse' } });
        gsap.from('#cita-sucursales > div', { opacity: 0, y: 60, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '#cita-sucursales', start: 'top 85%' } });
      }, '#page-cita');
      ScrollTrigger.refresh();
    }

    // ---- Comparar productos ----
    const cmpWaves = waves(q('#nv-cmp-canvas'), { lines: 26, spread: 1, amp: 70, alpha: 0.11, center: 0.5 });
    let onlyDiff = false;
    function updateTray() {
      const tray = q('#nv-cmp-tray'), slots = q('.nv-cmp-slots');
      if (!tray || !slots || typeof compareIds === 'undefined') return;
      const ids = compareIds.slice(0, 3);
      slots.innerHTML = [0, 1, 2].map((i) => {
        const p = ids[i] ? PRODUCTS.find((x) => x.id === ids[i]) : null;
        return p ? `<span class="nv-cmp-slot is-full" title="${pick(p.name)}"><img src="${p.mainImage}" alt="" /></span>` : '<span class="nv-cmp-slot">+</span>';
      }).join('');
      tray.classList.toggle('is-on', ids.length > 0);
    }
    function decorateTable() {
      const wrap = q('#compare-table-wrap');
      if (!wrap) return;
      wrap.classList.toggle('nv-only-diff', onlyDiff);
      const body = q('.min-w-\\[520px\\]', wrap);
      if (!body) return;
      const rows = Array.from(body.children);
      const n = (typeof compareIds !== 'undefined') ? compareIds.length : 0;
      rows.slice(1, -1).forEach((row) => {
        const vals = Array.from(row.children).slice(1).map((c) => c.textContent.trim());
        const same = vals.every((v) => v === vals[0]);
        row.classList.toggle('nv-same', n > 1 && same);
        row.classList.toggle('nv-diff', n > 1 && !same);
      });
      const head = wrap.firstElementChild;
      if (head && n > 1 && !q('.nv-cmp-diff-toggle', head)) {
        head.insertAdjacentHTML('beforeend', `<div><label class="nv-cmp-diff-toggle" role="switch" tabindex="0"><i></i><span>${lang() === 'es' ? 'Ver solo diferencias' : 'Show only differences'}</span></label></div>`);
      }
      if (hasGsap && !reduce && q('#page-comparar.active')) {
        gsap.fromTo(rows, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.03, clearProps: 'opacity,transform' });
      }
    }
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nv-cmp-diff-toggle')) return;
      onlyDiff = !onlyDiff;
      const wrap = q('#compare-table-wrap'); if (wrap) wrap.classList.toggle('nv-only-diff', onlyDiff);
    });
    const cmpPick = q('#compare-picker'), cmpTable = q('#compare-table-wrap');
    if ('MutationObserver' in window) {
      if (cmpPick) new MutationObserver(() => { updateTray(); qa('#compare-picker .grid > div').forEach((c) => tiltCard(c, 6)); }).observe(cmpPick, { childList: true });
      if (cmpTable) new MutationObserver(decorateTable).observe(cmpTable, { childList: true });
    }
    function enterCompare() {
      if (cmpWaves) cmpWaves.build();
      updateTray(); decorateTable();
      qa('#compare-picker .grid > div').forEach((c) => tiltCard(c, 6));
      if (!hasGsap || reduce) return;
      pageCtx = gsap.context(() => {
        gsap.fromTo('.nv-cmp-hero-inner > *', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1 });
        qa('#compare-picker > div').forEach((g, i) => {
          gsap.from(qa('.grid > div', g), { opacity: 0, y: 50, rotationX: -10, duration: 1.1, ease: 'expo.out', stagger: 0.06, delay: i === 0 ? 0.3 : 0,
            scrollTrigger: i === 0 ? undefined : { trigger: g, start: 'top 88%' } });
        });
      }, '#page-comparar');
      ScrollTrigger.refresh();
    }

    // ---- Tecnología ----
    const techWaves = waves(q('#nv-tech-canvas'), { lines: 22, spread: 0.7, amp: 60, alpha: 0.12, center: 0.45 });
    qa('#page-tecnologia .tech-tile').forEach((c) => c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      c.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    }));
    // ---- Tecnología, opción A: explorador (lista + foto grande) ----
    let txTween = null, txAuto = true;
    function txSelect(i, fromUser) {
      const items = qa('.nv-tx-item');
      if (!items.length) return;
      if (fromUser) txAuto = false;
      items.forEach((it) => it.classList.toggle('is-on', Number(it.dataset.i) === i));
      qa('.nv-tx-img').forEach((im) => im.classList.toggle('is-on', Number(im.dataset.i) === i));
      const num = q('.nv-tx-tag-num'); if (num) num.textContent = String(i + 1).padStart(2, '0');
      if (txTween) { txTween.kill(); txTween = null; }
      qa('.nv-tx-bar i').forEach((b) => { b.style.transform = 'scaleX(0)'; });
      const bar = q(`.nv-tx-item[data-i="${i}"] .nv-tx-bar i`);
      if (!bar || !hasGsap) return;
      if (!txAuto) { bar.style.transform = 'scaleX(1)'; return; }
      txTween = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 6, ease: 'none', onComplete: () => txSelect((i + 1) % items.length, false) });
    }
    document.addEventListener('click', (e) => {
      const it = e.target.closest('.nv-tx-item');
      if (it) txSelect(Number(it.dataset.i), true);
    });

    // ---- Tecnología, opción B: bento (resortes interactivos + cifras) ----
    const bentoSprings = (function () {
      const cv = q('.nv-b-springs .nv-b-canvas');
      if (!cv) return null;
      let ctx, w = 0, h = 0, pts = [], sp = 22;
      const m = { x: -999, y: -999 };
      cv.parentElement.addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; });
      cv.parentElement.addEventListener('pointerleave', () => { m.x = m.y = -999; });
      function build() {
        const f = fitCanvas(cv, 2); ctx = f.ctx; w = f.w; h = f.h;
        sp = Math.max(18, w / 18); pts = [];
        for (let r = 0, y = sp * 0.7; y < h; r++, y += sp * 0.87) for (let x = (r % 2 ? sp : sp / 2); x < w; x += sp) pts.push({ x, y, d: 0 });
      }
      function draw(t) {
        if (!ctx) return;
        const time = t * 0.001;
        const ax = m.x > -900 ? m.x : w * (0.5 + 0.3 * Math.sin(time * 0.6));
        const ay = m.x > -900 ? m.y : h * (0.35 + 0.15 * Math.cos(time * 0.8));
        ctx.clearRect(0, 0, w, h);
        for (const p of pts) {
          const dd = (p.x - ax) ** 2 + (p.y - ay) ** 2;
          p.d += (Math.exp(-dd / (2 * (sp * 1.4) ** 2)) - p.d) * 0.15;
          const rr = sp * 0.36 * (1 - p.d * 0.45);
          ctx.strokeStyle = `rgba(205,174,85,${0.22 + p.d * 0.75})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, 6.283); ctx.stroke();
          ctx.beginPath(); ctx.arc(p.x, p.y, rr * 0.5, 0, 6.283); ctx.stroke();
          if (p.d > 0.05) { ctx.fillStyle = `rgba(240,222,170,${p.d * 0.5})`; ctx.beginPath(); ctx.arc(p.x, p.y, rr * 0.5, 0, 6.283); ctx.fill(); }
        }
      }
      addLoop(cv, draw);
      return { build };
    })();
    function bentoNumbers() {
      qa('.nv-bento [data-count]').forEach((el) => {
        const end = Number(el.dataset.count), o = { v: 0 };
        if (!hasGsap || reduce) { el.textContent = end; return; }
        gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); } });
      });
      if (!hasGsap || reduce) return;
      gsap.to('.nv-b-bars > div > i > i', { scaleX: 1, duration: 1.6, ease: 'expo.out', stagger: 0.15 });
      gsap.to('.nv-b-ring-fill', { strokeDashoffset: 0, duration: 2, ease: 'power3.out' });
      gsap.from('.nv-b-stack i', { scaleX: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1 });
    }

    const techVideo = q('.nv-tech-video-frame video');
    if (techVideo) techVideo.addEventListener('loadedmetadata', () => { if (hasGsap && q('#page-tecnologia.active')) ScrollTrigger.refresh(); });
    function enterTech() {
      if (techWaves) techWaves.build();
      if (bentoSprings) bentoSprings.build();
      qa('#page-tecnologia .nv-b').forEach((c) => tiltCard(c, 5));
      txAuto = true; if (q('.nv-tx-item')) txSelect(0, false);
      if (!hasGsap || reduce) { if (q('.nv-bento')) bentoNumbers(); return; }
      pageCtx = gsap.context(() => {
        gsap.fromTo('.nv-tech-hero-inner > *', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1 });
        gsap.to('.nv-tech-hero-bg', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.nv-tech-hero', start: 'top top', end: 'bottom top', scrub: true } });
        qa('.nv-tech-video-grid > div:first-child > *').forEach((el) => {
          gsap.from(el, { opacity: 0, y: 50, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
        });
        gsap.from('.nv-tech-video-frame', { opacity: 0, scale: 0.9, rotationY: -12, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.nv-tech-video-frame', start: 'top 85%' } });
        qa('.nv-tx-head > *, .nv-bento-sec .nv-wrap > .nv-eyebrow, .nv-bento-sec .nv-wrap > .nv-h2').forEach((el) => {
          gsap.from(el, { opacity: 0, y: 50, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
        });
        if (q('.nv-tx-grid')) {
          gsap.from('.nv-tx-visual', { opacity: 0, scale: 0.94, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.nv-tx-grid', start: 'top 80%' } });
          gsap.from('.nv-tx-item', { opacity: 0, x: 40, duration: 1, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '.nv-tx-grid', start: 'top 80%' } });
        }
        if (q('.nv-bento')) {
          gsap.from('.nv-b', { opacity: 0, y: 60, scale: 0.97, duration: 1.2, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: '.nv-bento', start: 'top 82%', once: true, onEnter: bentoNumbers } });
        }

      }, '#page-tecnologia');
      ScrollTrigger.refresh();
    }

    // ---- Entregas, Reseñas, FAQ, Contáctanos ----
    const resWaves = waves(q('#nv-res-canvas'), { lines: 24, spread: 0.8, amp: 60, alpha: 0.11 });
    const faqWaves = waves(q('#nv-faq-canvas'), { lines: 24, spread: 0.8, amp: 60, alpha: 0.11 });
    const contactWaves = waves(q('#nv-contact-canvas'), { lines: 26, spread: 0.9, amp: 70, alpha: 0.12 });

    // Buscador + filtros de Preguntas Frecuentes
    let faqCat = 'all';
    const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    function faqFilter() {
      const input = q('#nv-faq-input');
      const term = norm(input ? input.value.trim() : '');
      let shown = 0;
      qa('#nv-faq-all .nv-faq-group').forEach((g) => {
        const catOk = faqCat === 'all' || g.dataset.cat === faqCat;
        let any = false;
        qa('.faq-item', g).forEach((it) => {
          const ok = catOk && (!term || norm(it.textContent).includes(term));
          it.classList.toggle('is-hidden', !ok);
          if (ok) { any = true; shown++; if (term) it.classList.add('open'); }
        });
        g.classList.toggle('is-hidden', !any);
      });
      const empty = q('#nv-faq-empty'); if (empty) empty.classList.toggle('is-on', shown === 0);
    }
    document.addEventListener('input', (e) => { if (e.target && e.target.id === 'nv-faq-input') faqFilter(); });
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('.nv-faq-chip');
      if (!chip) return;
      faqCat = chip.dataset.cat;
      qa('.nv-faq-chip').forEach((c) => c.classList.toggle('is-on', c === chip));
      faqFilter();
    });

    function countUp(scope) {
      qa('[data-count]', scope).forEach((el) => {
        const end = Number(el.dataset.count), o = { v: 0 };
        if (!hasGsap || reduce) { el.textContent = end; return; }
        gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); } });
      });
    }
    function revealIn(scopeSel) {
      qa(`${scopeSel} .nv-sec .nv-eyebrow, ${scopeSel} .nv-sec .nv-h2, ${scopeSel} .nv-sec .nv-lead, ${scopeSel} .nv-cta-band .nv-wrap > *`).forEach((el) => {
        gsap.from(el, { opacity: 0, y: 46, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } });
      });
    }
    function enterSimple(pageId) {
      const scope = '#page-' + pageId;
      if (pageId === 'resenas' && resWaves) resWaves.build();
      if (pageId === 'faq' && faqWaves) faqWaves.build();
      if (pageId === 'contacto' && contactWaves) contactWaves.build();
      qa(`${scope} .nv-lcard`).forEach((c) => tiltCard(c, 5));
      if (pageId === 'faq') faqFilter();
      if (!hasGsap || reduce) { countUp(q(scope)); return; }
      pageCtx = gsap.context(() => {
        gsap.fromTo(`${scope} .nv-ph-inner > *, ${scope} .nv-contact-left-inner > *`, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08 });
        if (q(`${scope} .nv-ph-bg`)) gsap.to(`${scope} .nv-ph-bg`, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: `${scope} .nv-ph`, start: 'top top', end: 'bottom top', scrub: true } });
        if (pageId === 'resenas') gsap.fromTo('.nv-res-stars i', { opacity: 0, scale: 0.3, rotation: -40 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: 'back.out(2)', stagger: 0.08 });
        if (pageId === 'contacto') {
          gsap.fromTo('.nv-channel', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1, ease: 'expo.out', stagger: 0.07, delay: 0.4 });
          gsap.fromTo('.nv-form > *, .nv-form .form-fields > *', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.05, delay: 0.3 });
        }
        revealIn(scope);
        const stats = q(`${scope} .nv-del-stats`);
        if (stats) gsap.from(`${scope} .nv-del-stats .nv-lcard`, { opacity: 0, y: 60, duration: 1.1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: stats, start: 'top 85%', once: true, onEnter: () => countUp(stats) } });
        const steps = q(`${scope} .nv-steps`);
        if (steps) {
          const mobile = isMobile();
          gsap.to(`${scope} .nv-steps-line i`, mobile ? { scaleY: 1, ease: 'none', scrollTrigger: { trigger: steps, start: 'top 75%', end: 'bottom 60%', scrub: true } }
            : { scaleX: 1, ease: 'none', scrollTrigger: { trigger: steps, start: 'top 80%', end: 'top 35%', scrub: true } });
          gsap.from(`${scope} .nv-steps li`, { opacity: 0, y: 40, duration: 1, ease: 'expo.out', stagger: 0.15, scrollTrigger: { trigger: steps, start: 'top 80%' } });
        }
        if (q(`${scope} .nv-split2-img`)) gsap.from(`${scope} .nv-split2-img`, { opacity: 0, scale: 0.94, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: `${scope} .nv-split2-img`, start: 'top 85%' } });
        if (q(`${scope} .nv-hours-grid`)) gsap.from(`${scope} .nv-hours-grid .nv-lcard`, { opacity: 0, y: 40, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: `${scope} .nv-hours-grid`, start: 'top 92%' } });
      }, scope);
      ScrollTrigger.refresh();
    }

    NV.onOtherPage = function (pageId) {
      if (pageCtx) { pageCtx.revert(); pageCtx = null; }
      if (txTween) { txTween.kill(); txTween = null; }
      document.body.classList.toggle('nv-immersive', ['home', 'producto', 'producto-detalle', 'linea-hotelera', 'cita', 'comparar', 'tecnologia', 'entregas', 'resenas', 'faq', 'contacto', 'sorteo'].includes(pageId));
      if (pageId === 'producto') setTimeout(enterProducts, 30);
      if (pageId === 'producto-detalle') setTimeout(enterDetail, 30);
      if (pageId === 'linea-hotelera') setTimeout(enterHotel, 30);
      if (pageId === 'cita') setTimeout(enterCita, 30);
      if (pageId === 'comparar') setTimeout(enterCompare, 30);
      if (pageId === 'tecnologia') setTimeout(enterTech, 30);
      if (['entregas', 'resenas', 'faq', 'contacto', 'sorteo'].includes(pageId)) setTimeout(() => enterSimple(pageId), 30);
    };

    // =====================================================================
    // Entrada / salida del home
    // =====================================================================
    NV.active = false;
    function sizeAll() {
      // Alto del menú de arriba, para que el hero ocupe justo la pantalla visible
      const hs = q('#nv-hero');
      if (hs) document.documentElement.style.setProperty('--nv-nav', Math.max(0, hs.getBoundingClientRect().top + window.scrollY) + 'px');
      if (hero) hero.build();
      if (manifestoWaves) manifestoWaves.build();
      if (finalWaves) finalWaves.build();
      if (springs) springs.build();
    }
    function prepareTexts() {
      qa('#page-home .nv-split').forEach(splitWords);
      NV.renderCollection();
    }
    NV.build = function () {
      if (NV.active) return;
      NV.active = true;
      document.body.classList.add('nv-on-home');
      prepareTexts();
      sizeAll();
      buildScroll();
      if (hasGsap) ScrollTrigger.refresh();
      if (!hasGsap) qa('.nv-stat b').forEach((b) => { b.textContent = b.dataset.count; });
    };
    NV.destroy = function () {
      if (!NV.active) return;
      NV.active = false;
      document.body.classList.remove('nv-on-home', 'nv-nav-hidden');
      if (gctx) { gctx.revert(); gctx = null; }
      activeLayer = -1;
      qa('.nv-layer').forEach((el) => el.classList.remove('is-active', 'is-dim'));
      qa('.nv-cap').forEach((c) => c.classList.remove('is-on'));
      const hint = q('.nv-layer-hint'); if (hint) hint.classList.add('is-on');
    };
    NV.onPage = function (pageId) {
      NV.onOtherPage(pageId);
      if (pageId === 'home') {
        if (NV.active) return;
        setTimeout(() => { NV.build(); heroEnter(true); }, 30);
      } else NV.destroy();
    };
    NV.onLang = function () {
      if (!NV.active) { prepareTexts(); return; }
      NV.destroy(); NV.build();
    };

    // Barra de progreso de scroll del home
    const bar = q('#nv-progress i');
    function updateBar() {
      if (!NV.active || !bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      // Navbar: se esconde al bajar, aparece al subir
      const y = window.scrollY;
      if (y > lastY + 4 && y > 320) document.body.classList.add('nv-nav-hidden');
      else if (y < lastY - 4 || y < 120) document.body.classList.remove('nv-nav-hidden');
      lastY = y;
    }
    let lastY = 0;
    window.addEventListener('scroll', updateBar, { passive: true });

    // Re-medir canvases al cambiar el tamaño de la ventana
    let lastW = window.innerWidth, lastH = window.innerHeight, lastMobile = isMobile(), rT = null;
    window.addEventListener('resize', () => {
      clearTimeout(rT);
      rT = setTimeout(() => {
        const dw = Math.abs(window.innerWidth - lastW), dh = Math.abs(window.innerHeight - lastH);
        if (dw < 2 && dh < 120) return; // barra del navegador en el teléfono: ignorar
        lastW = window.innerWidth; lastH = window.innerHeight;
        if (!NV.active) return;
        if (isMobile() !== lastMobile) { lastMobile = isMobile(); NV.destroy(); NV.build(); return; }
        sizeAll();
        if (hasGsap) ScrollTrigger.refresh();
      }, 220);
    });

    // Animación de entrada del hero
    function heroEnter(quick) {
      if (hero) { if (quick) hero.assembleNow(); else hero.assemble(); }
      const items = qa('.nv-hero-eyebrow, .nv-hero-sub, .nv-hero-tagline, .nv-hero-actions > *');
      if (!hasGsap || reduce) { items.concat(qa('.nv-hero-photo img')).forEach((el) => { el.style.opacity = 1; }); return; }
      gsap.fromTo('.nv-hero-photo img', { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: quick ? 1.2 : 2.6, ease: 'power2.out', delay: quick ? 0 : 0.4 });
      gsap.fromTo(items, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.09, delay: quick ? 0.1 : 1.1 });
    }

    // Intro de carga
    function intro(done) {
      const el = q('#nv-intro');
      let seen = false;
      try { seen = sessionStorage.getItem('nv-intro') === '1'; sessionStorage.setItem('nv-intro', '1'); } catch (e) { /* modo privado */ }
      if (!el || !hasGsap || reduce) { if (el) el.classList.add('nv-gone'); done(); return; }
      if (lenis) lenis.stop();
      const spans = qa('.nv-intro-word span');
      const num = q('#nv-intro-num');
      const c = { v: 0 };
      const dur = seen ? 0.7 : 1.9;
      gsap.set(spans, { y: 0, yPercent: 110 });
      gsap.timeline()
        .to(spans, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.06 })
        .to('.nv-intro-line i', { scaleX: 1, duration: dur, ease: 'power2.inOut' }, 0.2)
        .to(c, { v: 100, duration: dur, ease: 'power2.inOut', onUpdate: () => { num.textContent = String(Math.round(c.v)).padStart(3, '0'); } }, 0.2)
        .to(spans, { yPercent: -110, duration: 0.7, ease: 'expo.in', stagger: 0.03 })
        .add(() => done(), '-=0.2')
        .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut', onComplete: () => { el.classList.add('nv-gone'); if (lenis) lenis.start(); } }, '-=0.25');
    }

    // ---------- Arranque ----------
    function start() {
      const onHome = !!q('#page-home.active');
      if (onHome) NV.build(); else prepareTexts();
      document.body.classList.toggle('nv-immersive', onHome);
      intro(() => heroEnter(false));
      updateBar();
    }
    // Esperamos la tipografía del logo para dibujar "NUVELA" con la letra correcta.
    const fontReady = document.fonts && document.fonts.load
      ? Promise.race([document.fonts.load('500 100px "Cormorant Garamond"'), new Promise((r) => setTimeout(r, 1800))])
      : Promise.resolve();
    fontReady.then(start, start);
    // Cuando terminan de cargar todas las fotos, se vuelven a medir las secciones.
    window.addEventListener('load', () => { if (NV.active && hasGsap) ScrollTrigger.refresh(); });
  })();

  /* ====================================================================== */
  /* ========================== SORTEO NUVELA ============================= */
  /* ====================================================================== */
  /* Inscripción, puntos y enlace personal del sorteo (página /sorteo).     */
  /*  · SORTEO_WEBHOOK_URL: enlace del Apps Script de la hoja "Sorteo"      */
  /*    (ver instrucciones en sorteo-google-apps-script.txt).               */
  /*  · SORTEO_FIN: cierre de inscripciones (31/12/2026 23:59, Guatemala).  */
  (function () {
    'use strict';
    const SORTEO_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzXJoBVwZcLeCn6SA2NAi4k4bC9a0cor71tAcIzFbEALjFJrabTtclh5NWbSlGbxF9R/exec';
    const SORTEO_TOKEN = 'nuvela-sorteo-2026';
    const SORTEO_FIN = new Date('2027-01-01T06:00:00Z'); // = 31 dic 2026, 24:00 en Guatemala
    const PUNTOS_BASE = 1, PUNTOS_REFERIDO = 2;
    const LINK_BASE = 'https://www.nuvelagt.com/sorteo?ref=';
    const KEY = 'nuvela-sorteo', REFKEY = 'nuvela-sorteo-ref';
    const $ = (id) => document.getElementById(id);
    const es = () => (document.documentElement.lang || 'es') !== 'en';
    const configurado = !!SORTEO_WEBHOOK_URL && !/^PEGA_AQUI/.test(SORTEO_WEBHOOK_URL);
    const cerrado = () => Date.now() >= SORTEO_FIN.getTime();
    const leer = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
    const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* modo privado */ } };

    // 1) ¿Llegó con el enlace de un amigo? (…/sorteo?ref=CODIGO) — se recuerda para cuando se inscriba.
    let refUrl = null;
    try { refUrl = new URLSearchParams(window.location.search).get('ref'); } catch (e) { /* navegador antiguo */ }
    if (refUrl && /^[A-Za-z0-9]{4,12}$/.test(refUrl)) {
      guardar(REFKEY, refUrl.toUpperCase());
      // En la versión de una sola página (React), abre directo la página del sorteo.
      if (!document.body.dataset.nvPage && typeof showPage === 'function') setTimeout(() => showPage('sorteo'), 400);
    }

    // 2) Aviso flotante en el resto del sitio
    if (!cerrado() && document.body.dataset.nvPage !== 'sorteo') {
      let visto = false;
      try { visto = sessionStorage.getItem('nv-sorteo-chip') === '1'; } catch (e) { /* modo privado */ }
      if (!visto) {
        const chip = document.createElement('div');
        chip.className = 'nv-sorteo-chip';
        chip.innerHTML = '<a href="/sorteo" data-page="sorteo"><b>' + (es() ? 'Sorteo Nuvela' : 'Nuvela Giveaway') + '</b><span>'
          + (es() ? 'Gana un colchón King →' : 'Win a King mattress →') + '</span></a><button type="button" aria-label="' + (es() ? 'Cerrar' : 'Close') + '">×</button>';
        document.body.appendChild(chip);
        chip.querySelector('button').addEventListener('click', () => {
          chip.classList.remove('is-on');
          try { sessionStorage.setItem('nv-sorteo-chip', '1'); } catch (e) { /* modo privado */ }
        });
        setTimeout(() => chip.classList.add('is-on'), 7000);
      }
    }

    // 3) Formulario, entrada para ver puntos y panel
    const form = $('nv-sorteo-f'), login = $('nv-sorteo-login'), panel = $('nv-sorteo-panel'), closed = $('nv-sorteo-closed');
    if (!form || !panel) return;
    const T = (a, b) => (es() ? a : b);

    function estado() { try { return JSON.parse(leer(KEY) || 'null'); } catch (e) { return null; } }
    function ver(cual) { [form, login, panel].forEach((el) => { if (el) el.classList.toggle('hidden', el !== cual); }); }
    function pintarPuntos(refs) {
      $('nv-so-points').textContent = String(PUNTOS_BASE + refs * PUNTOS_REFERIDO);
      $('nv-so-refs').textContent = es() ? (refs === 1 ? '1 persona inscrita con tu enlace' : refs + ' personas inscritas con tu enlace') : (refs === 1 ? '1 person signed up with your link' : refs + ' people signed up with your link');
    }
    // Pide algo a la hoja de Google y lee su respuesta.
    function pedir(datos) {
      datos.token = SORTEO_TOKEN;
      return fetch(SORTEO_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(datos) }).then((r) => r.json());
    }

    function consultar(codigo, intentos) {
      const note = $('nv-so-note');
      if (!configurado) { if (note) note.textContent = T('Tus puntos se actualizan aquí conforme se inscriban las personas que invites.', 'Your points update here as the people you invite sign up.'); return; }
      fetch(SORTEO_WEBHOOK_URL + '?codigo=' + encodeURIComponent(codigo))
        .then((r) => r.json())
        .then((d) => {
          if (d && d.registrado) {
            pintarPuntos(Number(d.referidos) || 0);
            if (note) note.textContent = d.anulada ? T('Tu inscripción está en revisión: no encontramos que tu cuenta de Instagram siga a @nuvela.gt. Síguela y escríbenos por WhatsApp para reactivarla.', 'Your sign-up is under review: we could not confirm your Instagram account follows @nuvela.gt. Follow it and message us on WhatsApp to reactivate it.') : '';
          } else if (intentos > 0) {
            setTimeout(() => consultar(codigo, intentos - 1), 3000);
          } else if (note) {
            note.textContent = T('No encontramos esta inscripción. Si necesitas ayuda, escríbenos por WhatsApp.', 'We could not find this sign-up. Message us on WhatsApp if you need help.');
          }
        })
        .catch(() => { if (note) note.textContent = T('No pudimos consultar tus puntos ahora. Intenta de nuevo en un momento.', 'We could not check your points right now. Please try again shortly.'); });
    }

    function mostrarPanel(st, intentos) {
      ver(panel);
      const link = LINK_BASE + st.codigo;
      $('nv-so-name').textContent = st.nombre || '';
      $('nv-so-link').value = link;
      $('nv-so-points').textContent = String(PUNTOS_BASE);
      $('nv-so-refs').textContent = '';
      $('nv-so-wa').href = 'https://wa.me/?text=' + encodeURIComponent(T('Participa en el Sorteo Nuvela y gana un colchón King: ', 'Enter the Nuvela Giveaway and win a King mattress: ') + link);
      consultar(st.codigo, intentos || 0);
    }

    if (cerrado()) {
      ver(null);
      if (closed) closed.classList.remove('hidden');
      return;
    }
    const previo = estado();
    if (previo && previo.codigo) mostrarPanel(previo, 0);

    function nuevoCodigo() {
      const abc = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sin letras/números que se confunden
      const arr = new Uint32Array(6);
      (window.crypto || window.msCrypto).getRandomValues(arr);
      return 'NV' + Array.from(arr, (n) => abc[n % abc.length]).join('');
    }
    function ocupado(btn, si, texto) { btn.disabled = si; if (si) { btn.dataset.txt = btn.textContent; btn.textContent = texto; } else if (btn.dataset.txt) btn.textContent = btn.dataset.txt; }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const err = $('nv-so-error'), btn = $('nv-so-submit');
      const nombre = $('nv-so-nombre').value.trim(), apellido = $('nv-so-apellido').value.trim();
      const correo = $('nv-so-correo').value.trim(), telefono = $('nv-so-telefono').value.trim();
      const instagram = $('nv-so-ig').value.trim().replace(/^@+/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/[/?].*$/, '');
      const digitos = telefono.replace(/\D/g, '');
      let msg = '';
      if (!nombre || !apellido) msg = T('Escribe tu nombre y tu apellido.', 'Enter your first and last name.');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) msg = T('Revisa tu correo electrónico.', 'Check your email address.');
      else if (digitos.length < 8) msg = T('Revisa tu número de teléfono (8 dígitos).', 'Check your phone number (8 digits).');
      else if (!/^[A-Za-z0-9._]{1,30}$/.test(instagram)) msg = T('Escribe tu usuario de Instagram (por ejemplo: maria.lopez).', 'Enter your Instagram username (for example: maria.lopez).');
      else if (!$('nv-so-edad').checked) msg = T('Para participar debes ser mayor de 18 años.', 'You must be 18 or older to enter.');
      else if (!$('nv-so-sigue').checked) msg = T('Para participar debes seguir a @nuvela.gt en Instagram.', 'You must follow @nuvela.gt on Instagram to enter.');
      else if (!$('nv-so-bases').checked) msg = T('Debes aceptar las bases del sorteo.', 'You must accept the giveaway rules.');
      if (msg) { err.textContent = msg; err.classList.remove('hidden'); return; }
      err.classList.add('hidden');

      const codigo = nuevoCodigo();
      const ref = leer(REFKEY) || '';
      const datos = {
        tipo: 'sorteo', nombre, apellido, correo, telefono, instagram, codigo,
        referido_por: ref && ref !== codigo ? ref : '',
        mayor18: 'sí', sigue: 'sí',
        pagina: window.location.origin + window.location.pathname,
        fecha: new Date().toISOString(),
      };
      const entrar = (st, intentos) => {
        guardar(KEY, JSON.stringify(st));
        mostrarPanel(st, intentos);
        const sec = $('nv-sorteo-form');
        if (sec && sec.scrollIntoView) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      const enSegundoPlano = (url) => {
        try {
          fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(datos) })
            .catch((er) => console.warn('Nuvela: no se pudo enviar la inscripción del sorteo.', er));
        } catch (er) { console.warn('Nuvela: no se pudo enviar la inscripción del sorteo.', er); }
      };

      if (configurado) {
        // Con la hoja conectada: se espera su respuesta (así se rechazan las inscripciones repetidas).
        ocupado(btn, true, T('Enviando…', 'Sending…'));
        pedir(datos).then((d) => {
          ocupado(btn, false);
          if (d && d.ok) { entrar({ codigo, nombre }, 0); return; }
          const motivo = d && d.motivo;
          err.textContent = motivo === 'repetido' ? T('Ya existe una inscripción con este correo, teléfono o usuario de Instagram. Usa "Ver mis puntos" para entrar.', 'There is already a sign-up with this email, phone or Instagram username. Use "See my points" to sign in.')
            : motivo === 'cerrado' ? T('Las inscripciones ya cerraron.', 'Sign-ups are closed.')
            : T('No pudimos registrar tu inscripción. Revisa tus datos e intenta de nuevo.', 'We could not register your sign-up. Check your details and try again.');
          err.classList.remove('hidden');
        }).catch(() => {
          // No se pudo leer la respuesta: se envía igual y se confirma después.
          ocupado(btn, false);
          datos.token = SORTEO_TOKEN;
          enSegundoPlano(SORTEO_WEBHOOK_URL);
          entrar({ codigo, nombre }, 3);
        });
      } else {
        if (typeof LEADS_WEBHOOK_URL !== 'undefined' && LEADS_WEBHOOK_URL && !/^PEGA_AQUI/.test(LEADS_WEBHOOK_URL)) {
          datos.token = typeof LEADS_SHARED_TOKEN !== 'undefined' ? LEADS_SHARED_TOKEN : '';
          enSegundoPlano(LEADS_WEBHOOK_URL);
          console.warn('Nuvela: falta configurar SORTEO_WEBHOOK_URL; la inscripción se envió a la hoja de contactos.');
        }
        entrar({ codigo, nombre }, 0);
      }
    });

    // Entrar con correo + teléfono para ver los puntos desde cualquier dispositivo
    $('nv-so-show-login').addEventListener('click', () => ver(login));
    $('nv-so-show-form').addEventListener('click', () => ver(form));
    $('nv-so-logout').addEventListener('click', () => { try { localStorage.removeItem(KEY); } catch (e) { /* modo privado */ } ver(form); });
    login.addEventListener('submit', (e) => {
      e.preventDefault();
      const err = $('nv-lo-error'), btn = $('nv-lo-submit');
      const correo = $('nv-lo-correo').value.trim(), telefono = $('nv-lo-telefono').value.trim();
      const falla = (m) => { err.textContent = m; err.classList.remove('hidden'); };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || telefono.replace(/\D/g, '').length < 8) { falla(T('Revisa tu correo y tu teléfono.', 'Check your email and phone.')); return; }
      if (!configurado) { falla(T('La consulta de puntos estará disponible muy pronto.', 'Points lookup will be available very soon.')); return; }
      err.classList.add('hidden');
      ocupado(btn, true, T('Buscando…', 'Searching…'));
      pedir({ tipo: 'consulta', correo, telefono }).then((d) => {
        ocupado(btn, false);
        if (d && d.registrado && d.codigo) {
          const st = { codigo: d.codigo, nombre: d.nombre || '' };
          guardar(KEY, JSON.stringify(st));
          mostrarPanel(st, 0);
        } else falla(T('No encontramos una inscripción con ese correo y ese teléfono.', 'We could not find a sign-up with that email and phone.'));
      }).catch(() => { ocupado(btn, false); falla(T('No pudimos consultar ahora. Intenta de nuevo en un momento.', 'We could not check right now. Please try again shortly.')); });
    });

    $('nv-so-copy').addEventListener('click', () => {
      const inp = $('nv-so-link'), btn = $('nv-so-copy');
      const listo = () => { btn.textContent = es() ? 'Copiado' : 'Copied'; setTimeout(() => { btn.textContent = es() ? 'Copiar' : 'Copy'; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(inp.value).then(listo, () => { inp.select(); document.execCommand('copy'); listo(); });
      else { inp.select(); document.execCommand('copy'); listo(); }
    });
    $('nv-so-refresh').addEventListener('click', () => { const st = estado(); if (st && st.codigo) consultar(st.codigo, 0); });
  })();
  
}

/* =================== Arranque =================== */
function loadScript(src) {
  return new Promise((resolve) => {
    if (document.querySelector('script[data-nv-src="' + src + '"]')) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src; s.async = false; s.dataset.nvSrc = src;
    s.onload = resolve; s.onerror = resolve; // si una librería no carga, el sitio sigue funcionando sin animaciones
    document.head.appendChild(s);
  });
}
function loadFont(href) {
  if (document.querySelector('link[href="' + href + '"]')) return;
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l);
}

let nuvelaStarted = false;

export default function App() {
  useEffect(() => {
    if (nuvelaStarted) return; // en modo desarrollo React llama dos veces: solo arrancamos una
    nuvelaStarted = true;
    document.documentElement.lang = 'es';
    document.body.classList.add('bg-white', 'text-graphite');
    loadFont('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    loadFont('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');
    (async () => {
      if (!window.tailwind) await loadScript('https://cdn.tailwindcss.com');
      try { applyTailwindConfig(); } catch (e) { /* Tailwind ya configurado en el proyecto */ }
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js');
      await loadScript('https://unpkg.com/lenis@1.1.13/dist/lenis.min.js');
      startNuvela();
    })();
  }, []);

  return (
    <>
      <style>{NUVELA_CSS}</style>
      <Chrome />
      <PageHome />
      <PageHistoria />
      <PageProductos />
      <PageLineaHotelera />
      <PageComparar />
      <PageCarrito />
      <PageProductoDetalle />
      <PageTecnologia />
      <PagePrecios />
      <PageEntregas />
      <PageCita />
      <PageResenas />
      <PageFaq />
      <PageContacto />
      <PageSorteo />
      <PagePrivacidad />
      <FooterYFlotantes />
    </>
  );
}

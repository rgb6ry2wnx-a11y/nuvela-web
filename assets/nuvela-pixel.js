/* Nuvela · Meta Pixel (ID 1661406725511677). Se carga en todas las páginas. */
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1661406725511677');
fbq('track', 'PageView');

// Registra un evento "Contact" cuando alguien escribe a Nuvela por WhatsApp.
// (No cuenta el botón de "compartir por WhatsApp" del sorteo: ese no es un contacto con Nuvela.)
(function () {
  function esContacto(url) { return /wa\.me\/\d|whatsapp\.com\/send\?phone=\d/.test(String(url || '')); }
  document.addEventListener('click', function (e) {
    var link = e.target && e.target.closest && e.target.closest('a[href*="wa.me"], a[href*="whatsapp"]');
    if (link && esContacto(link.href)) fbq('track', 'Contact');
  });
  // Los pedidos del carrito abren WhatsApp con window.open: también se cuentan.
  var abrir = window.open;
  window.open = function (url) {
    try { if (esContacto(url)) fbq('track', 'Contact'); } catch (err) {}
    return abrir.apply(window, arguments);
  };
})();

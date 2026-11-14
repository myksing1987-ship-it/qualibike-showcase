/* ===========================================================
   MORITE site runtime — header/footer injection, product
   rendering, reveal animations, inquiry form handling.
   No build step, no framework, no external dependency.
   =========================================================== */
(function () {
  'use strict';

  var D = window.MORITE || { brand: 'Morite', legalName: '', products: [] };
  var CONTACT_EMAIL = 'xufenglouis@163.com';
  /* Formspree endpoint. Replace YOUR_FORM_ID with the id from formspree.io.
     While the placeholder is present the form falls back to mailto so no lead is lost. */
  var FORM_ENDPOINT = 'https://formspree.io/f/mljbgelk';
  var FORM_READY = FORM_ENDPOINT.indexOf('YOUR_FORM_ID') === -1;
  var PHONE = '+86 137 7521 3851';

  /* ---------- inline icon helper ---------- */
  function icon(name, size) {
    var s = size || 18;
    var paths = {
      arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
      check: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
      globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
      shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
      clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
      box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
      gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
      truck: '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
      mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
      phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
      pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'
    };
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (paths[name] || '') + '</svg>';
  }
  window.moriteIcon = icon;

  /* ---------- resolve relative prefix (root vs /products/) ---------- */
  var inSub = /\/products\//.test(window.location.pathname);
  var P = inSub ? '../' : '';

  /* ---------- header ---------- */
  function buildHeader() {
    var el = document.querySelector('[data-header]');
    if (!el) return;
    el.className = 'site-header';
    el.innerHTML =
      '<div class="container"><nav class="nav">' +
        '<a class="brand" href="' + P + 'index.html">' +
          '<span class="brand-mark">M</span>' +
          '<span>' + D.brand + '<span class="brand-sub">E-Bike Manufacturing</span></span>' +
        '</a>' +
        '<div class="nav-links" id="navLinks">' +
          '<a href="' + P + 'index.html#products">Products</a>' +
          '<a href="' + P + 'index.html#capability">Capability</a>' +
          '<a href="' + P + 'index.html#quality">Quality</a>' +
          '<a href="' + P + 'index.html#process">How We Work</a>' +
          '<a href="' + P + 'index.html#about">About</a>' +
        '</div>' +
        '<div class="nav-cta">' +
          '<a class="btn btn-primary" href="' + P + 'index.html#inquiry">Request a Quote ' + icon('arrow', 16) + '</a>' +
          '<button class="nav-toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false"><span></span></button>' +
        '</div>' +
      '</nav></div>';

    var t = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    if (t && links) {
      t.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        t.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      links.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') links.classList.remove('open');
      });
    }
  }

  /* ---------- footer ---------- */
  function buildFooter() {
    var el = document.querySelector('[data-footer]');
    if (!el) return;
    el.className = 'site-footer';
    var year = new Date().getFullYear();
    el.innerHTML =
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<div class="brand"><span class="brand-mark">M</span><span>' + D.brand + '</span></div>' +
            '<p>' + (D.legalName || D.brand) + ' — electric bicycle manufacturing for distributors, ' +
            'brands and fleet buyers. OEM and ODM programs available.</p>' +
          '</div>' +
          '<div class="footer-col"><h4>Products</h4><ul>' +
            '<li><a href="' + P + 'index.html#products">All Models</a></li>' +
            '<li><a href="' + P + 'index.html#capability">OEM / ODM</a></li>' +
            '<li><a href="' + P + 'index.html#quality">Certifications</a></li>' +
          '</ul></div>' +
          '<div class="footer-col"><h4>Company</h4><ul>' +
            '<li><a href="' + P + 'index.html#about">About Us</a></li>' +
            '<li><a href="' + P + 'index.html#process">How We Work</a></li>' +
            '<li><a href="' + P + 'index.html#inquiry">Contact Sales</a></li>' +
          '</ul></div>' +
          '<div class="footer-col"><h4>Legal</h4><ul>' +
            '<li><a href="' + P + 'legal/privacy.html">Privacy Policy</a></li>' +
            '<li><a href="' + P + 'legal/terms.html">Terms of Sale</a></li>' +
            '<li><a href="' + P + 'legal/cookies.html">Cookie Notice</a></li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<span>&copy; ' + year + ' ' + (D.legalName || D.brand) + '. All rights reserved.</span>' +
          '<span>Product specifications subject to change without notice.</span>' +
        '</div>' +
      '</div>';
  }

  /* ---------- product card ---------- */
  function cardHTML(p) {
    var imgPath = P + 'assets/img/' + p.img;
    return '<article class="card reveal">' +
        '<a class="card-media" href="' + P + 'products/' + p.slug + '.html">' +
          '<span class="card-cat">' + p.cat + '</span>' +
          '<img src="' + imgPath + '" alt="' + p.alt + '" loading="lazy" width="800" height="600">' +
        '</a>' +
        '<div class="card-body">' +
          '<h3><a href="' + P + 'products/' + p.slug + '.html">' + p.name + '</a></h3>' +
          '<p class="card-desc">' + p.tagline + '</p>' +
          '<div class="card-foot">' +
            '<span class="card-moq">' + (p.specs && p.specs.motor ? p.specs.motor : 'OEM / ODM') + '</span>' +
            '<a class="card-link" href="' + P + 'products/' + p.slug + '.html">Details ' + icon('arrow', 14) + '</a>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderProducts() {
    var mount = document.querySelector('[data-products]');
    if (!mount) return;
    mount.innerHTML = D.products.map(cardHTML).join('');
  }

  /* ---------- reveal on scroll ---------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    Array.prototype.forEach.call(els, function (e) { io.observe(e); });

    // Fail-safe: force-show anything still hidden after 2.5s
    setTimeout(function () {
      Array.prototype.forEach.call(document.querySelectorAll('.reveal:not(.in)'), function (e) {
        e.classList.add('in');
      });
    }, 2500);
  }

  /* ---------- inquiry form ---------- */
  function initForm() {
    var form = document.querySelector('[data-inquiry-form]');
    if (!form) return;
    var status = form.querySelector('.form-status');

    // Prefill product select from data
    var sel = form.querySelector('select[name="product"]');
    if (sel) {
      D.products.forEach(function (p) {
        var o = document.createElement('option');
        o.value = p.name;
        o.textContent = p.name + ' — ' + p.cat;
        sel.appendChild(o);
      });
      var o2 = document.createElement('option');
      o2.value = 'Not sure / multiple models';
      o2.textContent = 'Not sure / multiple models';
      sel.appendChild(o2);
      var pre = new URLSearchParams(window.location.search).get('product');
      if (pre) {
        Array.prototype.forEach.call(sel.options, function (op) {
          if (op.value.toLowerCase() === pre.toLowerCase()) sel.value = op.value;
        });
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // honeypot
      var hp = form.querySelector('input[name="company_website"]');
      if (hp && hp.value.trim() !== '') return;

      var required = ['name', 'email', 'country', 'company'];
      for (var i = 0; i < required.length; i++) {
        var f = form.querySelector('[name="' + required[i] + '"]');
        if (!f || !f.value.trim()) {
          show('err', 'Please fill in all required fields.');
          if (f) f.focus();
          return;
        }
      }

      var email = form.querySelector('[name="email"]');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        show('err', 'Please enter a valid work email address.');
        email.focus();
        return;
      }

      var d = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        if (el.name && el.type !== 'submit') d[el.name] = el.value.trim();
      });

      if (!FORM_READY) {
        mailtoFallback(d, 'Opening your email client to send this request.');
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      if (btn && btn.disabled) return;
      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
      show('', '');

      var payload = {
        name: d.name,
        company: d.company,
        email: d.email,
        country: d.country,
        product: d.product || '(not specified)',
        quantity: d.quantity || '(not specified)',
        message: d.message || '(none)',
        _subject: 'Quote request - ' + d.company + ' (' + d.country + ')',
        page: window.location.href
      };

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json().catch(function () { return {}; });
      }).then(function () {
        form.reset();
        show('ok', 'Thank you - your enquiry has been received. We reply to qualified enquiries within one business day.');
        if (btn) { btn.disabled = false; btn.textContent = 'Sent'; }
        // analytics hook
        if (window.gtag) window.gtag('event', 'generate_lead', { form: 'inquiry' });
        if (window.dataLayer) window.dataLayer.push({ event: 'inquiry_submitted' });
        setTimeout(function () { if (btn) btn.textContent = label; }, 4000);
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = label; }
        mailtoFallback(d, 'Our form could not send automatically.');
      });
    });

    function mailtoFallback(d, prefix) {
      var body = [
        'Inquiry from website form',
        '--------------------------------',
        'Name: ' + d.name,
        'Company: ' + d.company,
        'Work email: ' + d.email,
        'Country: ' + d.country,
        'Product: ' + (d.product || ''),
        'Quantity: ' + (d.quantity || ''),
        'Message: ' + (d.message || '')
      ].join(String.fromCharCode(10));

      var href = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent('Quote request - ' + d.company + ' (' + d.country + ')') +
        '&body=' + encodeURIComponent(body);

      show('ok', prefix + ' Please send it by email - or write to ' + CONTACT_EMAIL + ' directly.');
      window.location.href = href;
    }

    function show(kind, msg) {
      if (!status) return;
      status.className = 'form-status ' + kind;
      status.textContent = msg;
    }
  }

  /* ---------- icon placeholders ---------- */
  function paintIcons() {
    // data-icon: empty elements get an icon. Elements with text keep it and prepend the icon.
    Array.prototype.forEach.call(document.querySelectorAll('[data-icon]'), function (el) {
      if (el.querySelector('svg')) return;
      el.innerHTML = icon(el.getAttribute('data-icon'), 18) + el.innerHTML;
    });
    // [ICON:name] text placeholders inside .cap-icon
    Array.prototype.forEach.call(document.querySelectorAll('.cap-icon'), function (el) {
      var m = el.textContent.match(/\[ICON:(\w+)\]/);
      if (m) el.innerHTML = icon(m[1], 22);
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    buildHeader();
    buildFooter();
    renderProducts();
    paintIcons();
    initReveal();
    initForm();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

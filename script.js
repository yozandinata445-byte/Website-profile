/**
 * script.js
 * Fungsi:
 * - Toggle tema (dark/light) dan simpan di localStorage
 * - Hamburger menu untuk mobile
 * - Smooth scroll untuk anchor internal
 * - Scroll reveal (IntersectionObserver)
 * - Lightbox untuk memperbesar gambar
 * - Contact form (UX client-side, simulasi)
 * - Micro-parallax pada hero (interaksi halus)
 */

/* Helper singkat */
const $ = (sel, ctx = document) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));

/* Elemen DOM penting */
const html = document.documentElement;
const themeToggle = $('#themeToggle');
const hamburger = $('#hamburger');
const navLinks = $('#navLinks');
const revealEls = $$('.reveal');
const galleryImages = $$('.lightbox-img');
const lightbox = $('#lightbox');
const lightboxImg = $('#lightboxImg');
const lightboxClose = $('#lightboxClose');
const contactForm = $('#contactForm');
const formStatus = $('#formStatus');
const yearEl = $('#year');

/* Inisialisasi: set tahun dan restore tema */
if (yearEl) yearEl.textContent = new Date().getFullYear();
const savedTheme = localStorage.getItem('theme');
if (savedTheme) html.setAttribute('data-theme', savedTheme);

/* Toggle tema */
themeToggle?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* Hamburger menu (mobile) */
hamburger?.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!expanded));
  navLinks.classList.toggle('active'); // CSS menampilkan/menyembunyikan saat .active
  hamburger.classList.toggle('open');
});

/* Tutup menu mobile saat klik link */
navLinks?.addEventListener('click', (e) => {
  if (e.target.matches('a')) {
    navLinks.classList.remove('active');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

/* Smooth scroll untuk anchor internal */
document.addEventListener('click', (ev) => {
  const a = ev.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href').slice(1);
  const target = document.getElementById(id);
  if (!target) return;
  ev.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* Scroll reveal menggunakan IntersectionObserver */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target); // tampil sekali saja
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* LIGHTBOX: buka saat klik gambar yang memiliki kelas .lightbox-img */
galleryImages.forEach(img => {
  img.addEventListener('click', () => {
    const src = img.dataset.src || img.src;
    openLightbox(src, img.alt || '');
  });
});

function openLightbox(src, alt = '') {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // nonaktifkan scroll latar
  window.addEventListener('keydown', escHandler);
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
  document.body.style.overflow = '';
  window.removeEventListener('keydown', escHandler);
}

function escHandler(e) {
  if (e.key === 'Escape') closeLightbox();
}

/* tutup lightbox saat klik backdrop atau tombol close */
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
lightboxClose?.addEventListener('click', closeLightbox);

/* CONTACT FORM: UX client-side (simulasi) */
contactForm?.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const name = contactForm.name?.value.trim();
  const email = contactForm.email?.value.trim();
  const message = contactForm.message?.value.trim();

  if (!name || !email || !message) {
    if (formStatus) formStatus.textContent = 'Mohon lengkapi semua field.';
    return;
  }

  if (formStatus) formStatus.textContent = 'Mengirim...';

  // Simulasi delay; ganti dengan fetch ke API / EmailJS / Netlify Forms jika perlu
  setTimeout(() => {
    if (formStatus) formStatus.textContent = 'Pesan terkirim — terima kasih!';
    contactForm.reset();
  }, 900);
});

/* MICRO PARALLAX: interaksi lembut pada hero (tidak heavy) */
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('mousemove', (e) => {
    const rx = (e.clientX / window.innerWidth - 0.5) * 6;
    const ry = (e.clientY / window.innerHeight - 0.5) * 6;
    hero.style.transform = `translate3d(${rx}px, ${-ry/2}px, 0)`;
  });
  hero.addEventListener('mouseleave', () => {
    hero.style.transform = '';
  });
}

/* Accessibility: deteksi pengguna keyboard untuk gaya fokus */
function handleFirstTab(e) {
  if (e.key === 'Tab') {
    document.documentElement.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', handleFirstTab);
  }
}
window.addEventListener('keydown', handleFirstTab);

/* Selesai */

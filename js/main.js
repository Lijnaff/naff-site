/* ============================================
   naff.site — Shared JS
   Scroll observer, nav effects, interactions
   ============================================ */

// Nav scroll effect
const nav = document.getElementById('nav');
let lastScroll = 0;

function updateNav() {
  const scrollY = window.pageYOffset;
  if (scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  lastScroll = scrollY;
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// Fade-in on scroll
const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  }
);

fadeElements.forEach((el) => fadeObserver.observe(el));

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Form — prevent default and show toast
const form = document.querySelector('.contact-form form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = `Message sent <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    btn.style.background = 'var(--accent-green)';
    btn.style.color = 'var(--bg-primary)';

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.style.color = '';
      form.reset();
    }, 3000);
  });
}

// Console easter egg
console.log('%c hey naff. you found this. the glitch is real.', 'font-family: var(--font-mono); color: var(--accent-cyan); font-size: 14px;');
console.log('%c built in bale robe, ethiopia 🇪🇹', 'font-family: var(--font-mono); color: var(--text-muted); font-size: 11px;');

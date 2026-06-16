/* ============================================
   naff.site — Shared JS
   Scroll observer, nav effects, interactions
   Particles, command palette, dark mode, etc.
   ============================================ */

// ===== Nav scroll effect =====
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

// ===== Dark mode toggle =====
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('naff-theme');

if (savedTheme === 'light') {
  document.body.classList.add('light');
  if (themeToggle) themeToggle.textContent = '☀️';
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('naff-theme', isLight ? 'light' : 'dark');
    themeToggle.textContent = isLight ? '☀️' : '🌙';
  });
}

// ===== Fade-in on scroll =====
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

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Form — prevent default and show toast =====
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

// ===== Typing animation =====
const typingContainer = document.getElementById('typing-text');
if (typingContainer) {
  const roles = [
    'Full-Stack Engineer',
    'AI Architect',
    'Network Engineer',
    'Digital Creator',
    'Technical Founder',
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeEffect() {
    const current = roles[roleIndex];
    if (isDeleting) {
      typingContainer.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typingContainer.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === current.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
  }

  typeEffect();
}

// ===== Case study toggles =====
document.querySelectorAll('.case-study-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (target) {
      target.classList.toggle('open');
      btn.classList.toggle('open');
    }
  });
});

// ===== GitHub Stats (fetch real data) =====
async function fetchGitHubStats() {
  const statsContainer = document.getElementById('github-stats');
  if (!statsContainer) return;

  try {
    const res = await fetch('https://api.github.com/users/Lijnaff');
    if (!res.ok) throw new Error('GitHub API failed');
    const data = await res.json();

    const publicRepos = data.public_repos || 0;
    const followers = data.followers || 0;

    // Get total commits (approximate from public events)
    const eventsRes = await fetch('https://api.github.com/users/Lijnaff/events/public?per_page=1');
    let recentActivity = '';
    if (eventsRes.ok) {
      const events = await eventsRes.json();
      if (events.length > 0) {
        const lastEvent = new Date(events[0].created_at);
        const daysAgo = Math.floor((Date.now() - lastEvent.getTime()) / (1000 * 60 * 60 * 24));
        recentActivity = daysAgo < 1 ? 'Active today' : daysAgo < 7 ? `${daysAgo}d ago` : `${Math.floor(daysAgo / 7)}w ago`;
      }
    }

    statsContainer.innerHTML = `
      <div class="github-stat">
        <span class="github-stat-icon">📦</span>
        <div>
          <div class="github-stat-value">${publicRepos}</div>
          <div class="github-stat-label">Public Repos</div>
        </div>
      </div>
      <div class="github-stat">
        <span class="github-stat-icon">👥</span>
        <div>
          <div class="github-stat-value">${followers}</div>
          <div class="github-stat-label">Followers</div>
        </div>
      </div>
      <div class="github-stat">
        <span class="github-stat-icon">🔥</span>
        <div>
          <div class="github-stat-value">${recentActivity || '—'}</div>
          <div class="github-stat-label">Last Activity</div>
        </div>
      </div>
    `;
  } catch (e) {
    // Fallback: show static stats
    statsContainer.innerHTML = `
      <div class="github-stat">
        <span class="github-stat-icon">📦</span>
        <div>
          <div class="github-stat-value">5+</div>
          <div class="github-stat-label">Projects</div>
        </div>
      </div>
      <div class="github-stat">
        <span class="github-stat-icon">⭐</span>
        <div>
          <div class="github-stat-value">500+</div>
          <div class="github-stat-label">Problems Solved</div>
        </div>
      </div>
      <div class="github-stat">
        <span class="github-stat-icon">☕</span>
        <div>
          <div class="github-stat-value">∞</div>
          <div class="github-stat-label">Cups of Coffee</div>
        </div>
      </div>
    `;
  }
}

fetchGitHubStats();

// ===== Visitor Counter =====
function initVisitorCounter() {
  const counter = document.getElementById('visitor-count');
  if (!counter) return;

  let visits = parseInt(localStorage.getItem('naff-visits') || '0', 10);
  visits++;
  localStorage.setItem('naff-visits', visits.toString());
  counter.textContent = visits.toLocaleString();
}

initVisitorCounter();

// ===== Command Palette (Cmd+K / Ctrl+K) =====
const cmdPaletteOverlay = document.getElementById('cmd-palette');
if (cmdPaletteOverlay) {
  const cmdInput = document.getElementById('cmd-input');
  const cmdResults = document.getElementById('cmd-results');
  const cmdItems = cmdResults.querySelectorAll('.cmd-palette-item');
  let selectedIndex = 0;

  function openPalette() {
    cmdPaletteOverlay.classList.add('open');
    cmdInput.focus();
    cmdInput.value = '';
    filterItems('');
  }

  function closePalette() {
    cmdPaletteOverlay.classList.remove('open');
  }

  function filterItems(query) {
    const q = query.toLowerCase();
    selectedIndex = 0;
    cmdItems.forEach((item) => {
      const label = item.dataset.label.toLowerCase();
      const desc = (item.dataset.desc || '').toLowerCase();
      if (label.includes(q) || desc.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
    updateSelection();
  }

  function updateSelection() {
    const visible = Array.from(cmdResults.querySelectorAll('.cmd-palette-item')).filter(
      (i) => i.style.display !== 'none'
    );
    visible.forEach((item, i) => {
      item.classList.toggle('selected', i === selectedIndex);
    });
    if (visible[selectedIndex]) {
      visible[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  function goToSelection() {
    const visible = Array.from(cmdResults.querySelectorAll('.cmd-palette-item')).filter(
      (i) => i.style.display !== 'none'
    );
    if (visible[selectedIndex]) {
      const href = visible[selectedIndex].dataset.href;
      if (href) {
        closePalette();
        if (href.startsWith('#')) {
          const el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = href;
        }
      }
    }
  }

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (cmdPaletteOverlay.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
    }
    if (e.key === 'Escape' && cmdPaletteOverlay.classList.contains('open')) {
      closePalette();
    }
  });

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => filterItems(e.target.value));
    cmdInput.addEventListener('keydown', (e) => {
      const visible = Array.from(cmdResults.querySelectorAll('.cmd-palette-item')).filter(
        (i) => i.style.display !== 'none'
      );
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, visible.length - 1);
        updateSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        updateSelection();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        goToSelection();
      }
    });
  }

  cmdItems.forEach((item) => {
    item.addEventListener('click', () => {
      const href = item.dataset.href;
      if (href) {
        closePalette();
        if (href.startsWith('#')) {
          const el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = href;
        }
      }
    });
  });

  // Close on overlay click
  cmdPaletteOverlay.addEventListener('click', (e) => {
    if (e.target === cmdPaletteOverlay) closePalette();
  });
}

// ===== Particle Canvas =====
const particleCanvas = document.getElementById('particle-canvas');
if (particleCanvas) {
  const ctx = particleCanvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resizeCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor(window.innerWidth / 20), 60);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    const isLight = document.body.classList.contains('light');
    const color = isLight ? '6, 182, 212' : '6, 182, 212';

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = particleCanvas.width;
      if (p.x > particleCanvas.width) p.x = 0;
      if (p.y < 0) p.y = particleCanvas.height;
      if (p.y > particleCanvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const dx = p.x - particles[j].x;
        const dy = p.y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${color}, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    animFrame = requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });
}

// ===== Console easter egg =====
console.log('%c hey naff. you found this. the glitch is real.', 'font-family: var(--font-mono); color: var(--accent-cyan); font-size: 14px;');
console.log('%c built in bale robe, ethiopia 🇪🇹', 'font-family: var(--font-mono); color: var(--text-muted); font-size: 11px;');
console.log('%c press ⌘K for command palette', 'font-family: var(--font-mono); color: var(--accent-amber); font-size: 11px;');

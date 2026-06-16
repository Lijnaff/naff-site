/* ============================================
   naff.site — Shared JS
   Scroll observer, nav effects, interactions
   Particles, 3D, command palette, dark mode, etc.
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
    const following = data.following || 0;

    // Get repos count and stars
    let totalStars = 0;
    try {
      const reposRes = await fetch('https://api.github.com/users/Lijnaff/repos?per_page=100');
      if (reposRes.ok) {
        const repos = await reposRes.json();
        totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
      }
    } catch(e) { /* ignore */ }

    // Last activity
    let recentActivity = '';
    try {
      const eventsRes = await fetch('https://api.github.com/users/Lijnaff/events/public?per_page=1');
      if (eventsRes.ok) {
        const events = await eventsRes.json();
        if (events.length > 0) {
          const lastEvent = new Date(events[0].created_at);
          const daysAgo = Math.floor((Date.now() - lastEvent.getTime()) / (1000 * 60 * 60 * 24));
          recentActivity = daysAgo < 1 ? 'Today' : daysAgo < 7 ? `${daysAgo}d ago` : daysAgo < 30 ? `${Math.floor(daysAgo / 7)}w ago` : `${Math.floor(daysAgo / 30)}mo ago`;
        }
      }
    } catch(e) { /* ignore */ }

    statsContainer.innerHTML = `
      <div class="github-stat">
        <span class="github-stat-icon">📦</span>
        <div>
          <div class="github-stat-value">${publicRepos}</div>
          <div class="github-stat-label">Public Repos</div>
        </div>
      </div>
      <div class="github-stat">
        <span class="github-stat-icon">⭐</span>
        <div>
          <div class="github-stat-value">${totalStars}</div>
          <div class="github-stat-label">Stars Earned</div>
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

// ===== Blog Modal =====
const blogModalOverlay = document.getElementById('blog-modal');
if (blogModalOverlay) {
  const blogModalClose = document.getElementById('blog-modal-close');
  const blogModalTitle = document.getElementById('blog-modal-title');
  const blogModalDate = document.getElementById('blog-modal-date');
  const blogModalCategory = document.getElementById('blog-modal-category');
  const blogModalBody = document.getElementById('blog-modal-body');

  const blogPosts = {
    'post-1': {
      title: "Why I'm Running AI Locally (And You Should Too)",
      date: 'July 15, 2026',
      category: 'AI',
      content: `
        <p>The real cost of cloud AI isn't just privacy — it's latency, dependency, and the slow erosion of your ability to think without a middleman. When I started building Project Glitch, I asked myself a simple question: what if my AI assistant lived entirely on my own hardware?</p>
        <h4>The Privacy Argument</h4>
        <p>Every prompt you send to a cloud AI provider is stored, analyzed, and sometimes used for training. For personal projects, this might be fine. But when you're feeding proprietary code, business strategies, or personal data into a model, the privacy implications become real.</p>
        <h4>The Latency Argument</h4>
        <p>Cloud AI means network round-trips. Even with fast internet, you're looking at 200-500ms of overhead on every interaction. On-premise, that drops to under 50ms. When you're in a flow state, that difference is palpable.</p>
        <h4>The Cost Argument</h4>
        <p>API costs add up fast. A heavy user can easily spend $50-100/month on GPT-4 or Claude API calls. With a local model, the only cost is electricity — pennies per day.</p>
        <h4>The Learning Argument</h4>
        <p>Running AI locally forces you to understand what's happening under the hood. You learn about model quantization, context windows, prompt engineering, and hardware optimization. These are skills that will only become more valuable.</p>
        <h4>Getting Started</h4>
        <p>You don't need a data center. A modern laptop with 16GB RAM can run 7B parameter models. With tools like Ollama and OpenClaw, setup takes minutes, not days. Start small, experiment, and scale up as you learn.</p>
      `
    },
    'post-2': {
      title: "From Spreadsheets to Software: A Cafe's Digital Transformation",
      date: 'June 28, 2026',
      category: 'Business',
      content: `
        <p>When I first walked into Harme Cafe's back office, I saw a 3,000-row Excel file. It tracked everything — sales, inventory, supplier orders, daily reconciliation. It was a masterpiece of manual data entry, and it was breaking.</p>
        <h4>The Problem</h4>
        <p>Three hours every day. That's how long the team spent on manual reconciliation — matching sales receipts against inventory deductions, flagging discrepancies, and preparing the next day's stock orders. Errors were common, and there was no real-time visibility into what was actually selling.</p>
        <h4>The Approach</h4>
        <p>I didn't jump straight to code. First, I spent a week just observing the workflow. I mapped every data point, every decision point, every pain point. Then I designed a system that mirrored their actual process — not what a textbook says a process should look like.</p>
        <h4>The Solution</h4>
        <p>A custom data scripting pipeline that automated sales logging, inventory deduction, and end-of-day financial carry-over. The key insight was that the system needed to be simpler than the spreadsheet, not more complex. If the team couldn't use it without training, it would fail.</p>
        <h4>The Result</h4>
        <p>Daily reporting dropped from 3 hours to under 15 minutes. Stock-out incidents went to zero. And the team actually enjoyed using it — because it was designed around how they already worked, not how a developer thought they should work.</p>
      `
    },
    'post-3': {
      title: "Building Unbreakable Networks in Unreliable Environments",
      date: 'June 10, 2026',
      category: 'Infrastructure',
      content: `
        <p>In Addis Ababa, power fluctuations are a fact of life. ISPs don't guarantee uptime. And when you're running a commercial cafe where the point-of-sale system, security cameras, and customer WiFi all depend on the network, "good enough" isn't good enough.</p>
        <h4>Dual-Carrier Failover</h4>
        <p>The foundation of the setup is two separate 5G carriers on a dual-WAN pfSense router. If one carrier drops, the other takes over in under 3 seconds. The failover is automatic and transparent — customers never notice.</p>
        <h4>Mesh WiFi with Captive Portal</h4>
        <p>Customer-facing WiFi runs on OpenWrt mesh access points with a captive portal and voucher-based access. This isn't just about security — it's about control. Vouchers can be time-limited, bandwidth-limited, and tracked per customer.</p>
        <h4>Local Server for Critical Services</h4>
        <p>A Proxmox host runs Docker containers for security camera backups, local DNS caching, and a lightweight POS database replica. If the internet goes completely down, the cafe can still process transactions and record footage.</p>
        <h4>Lessons Learned</h4>
        <p>Redundancy isn't about having backup equipment — it's about having backup paths. Every single point of failure needs an alternative that activates automatically. And test your failovers regularly, because a failover that hasn't been tested is a failover that won't work when you need it.</p>
      `
    },
    'post-4': {
      title: "500 LeetCode Problems Later: What Actually Matters",
      date: 'May 22, 2026',
      category: 'Engineering',
      content: `
        <p>I've solved over 500 algorithmic problems on LeetCode and Codeforces. Here's what I've learned: the number doesn't matter. What matters is recognizing patterns.</p>
        <h4>The Patterns That Show Up Everywhere</h4>
        <p>Sliding window, two pointers, BFS/DFS, dynamic programming, binary search — these aren't just interview topics. They're the building blocks of efficient real-world code. Once you internalize them, you start seeing them everywhere.</p>
        <h4>Data Structures That Matter in Practice</h4>
        <p>Hash maps are the unsung hero of real systems. Trees (especially tries) power autocomplete and routing. Graphs model everything from social networks to network topology. Heaps are essential for scheduling and priority queues.</p>
        <h4>What I'd Do Differently</h4>
        <p>I spent too long on hard problems that taught me little. If I could start over, I'd focus on medium problems that combine multiple patterns. That's where real learning happens — at the intersection of techniques.</p>
        <h4>The Meta-Skill</h4>
        <p>The most valuable skill isn't knowing any specific algorithm. It's the ability to look at a problem, identify its constraints, and map it to a known pattern. That's what 500 problems really teaches you — not the solutions, but the recognition.</p>
      `
    },
    'post-5': {
      title: "Building Tech from Addis Ababa",
      date: 'May 5, 2026',
      category: 'Perspective',
      content: `
        <p>There's a narrative that great tech only comes from Silicon Valley, London, or Berlin. I'm here to tell you that's wrong. Some of the most creative, resourceful engineering I've seen has come from places where constraints force innovation.</p>
        <h4>The Constraint Advantage</h4>
        <p>When you can't just throw money at a problem, you learn to be clever. When your internet is unreliable, you build offline-first. When power is unstable, you design for graceful degradation. These constraints make you a better engineer.</p>
        <h4>The Talent Is Here</h4>
        <p>Ethiopia has one of the fastest-growing tech ecosystems in Africa. The talent is deep, the ambition is real, and the cost of building is a fraction of what it is in Western tech hubs. The infrastructure challenges that seem like obstacles are actually opportunities to build solutions that work everywhere.</p>
        <h4>Remote Work Changed Everything</h4>
        <p>The shift to remote work didn't just change where people work — it changed who gets to work. A developer in Addis Ababa can now contribute to the same projects as one in San Francisco, with the same tools, the same codebases, and the same impact.</p>
        <h4>What's Next</h4>
        <p>The next wave of great software won't come from the places you expect. It will come from engineers who grew up solving hard problems with limited resources. And that's exactly what's happening right now, all over Africa.</p>
      `
    },
    'post-6': {
      title: "Proxmox + Docker: My Homelab Setup for $0/month",
      date: 'April 18, 2026',
      category: 'DevOps',
      content: `
        <p>I run a full virtualization stack on repurposed hardware — hosting AI models, web services, security cameras, and NAS backups without any cloud costs. Here's the breakdown.</p>
        <h4>The Hardware</h4>
        <p>A used Dell OptiPlex with an i7 processor, 32GB RAM, and a 2TB NVMe SSD. Total cost: about $200 on the used market. This single machine replaces what would cost $100+/month in cloud services.</p>
        <h4>Proxmox as the Hypervisor</h4>
        <p>Proxmox VE gives you enterprise-grade virtualization for free. I run three VMs: one for Docker services, one for the AI assistant (with GPU passthrough), and one for a development environment.</p>
        <h4>Docker Services</h4>
        <p>Docker containers handle everything: Nginx reverse proxy, security camera NVR, file sync, monitoring dashboards, and the AI inference server. Each service is isolated, easy to update, and trivial to back up.</p>
        <h4>The AI Stack</h4>
        <p>Running local LLMs via Ollama on the GPU-passthrough VM. Models like Llama 3 8B run smoothly on an older GPU. For heavier workloads, I can offload to a cloud API — but 90% of my use cases run locally.</p>
        <h4>Why This Matters</h4>
        <p>A homelab isn't just a hobby — it's a learning environment. Every production problem you'll encounter in the cloud, you'll encounter first at home. And when you solve it there, you'll be ready.</p>
      `
    }
  };

  // Attach click handlers to all blog read-more links
  document.querySelectorAll('.blog-card-read').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const postId = link.dataset.post || link.closest('.blog-card').dataset.post;
      const post = blogPosts[postId];
      if (post && blogModalOverlay) {
        blogModalTitle.textContent = post.title;
        blogModalDate.textContent = post.date;
        blogModalCategory.textContent = post.category;
        blogModalBody.innerHTML = post.content;
        blogModalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeBlogModal() {
    blogModalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (blogModalClose) {
    blogModalClose.addEventListener('click', closeBlogModal);
  }

  blogModalOverlay.addEventListener('click', (e) => {
    if (e.target === blogModalOverlay) closeBlogModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && blogModalOverlay.classList.contains('open')) {
      closeBlogModal();
    }
  });
}

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
    const color = '6, 182, 212';

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

// ===== 3D Hero Scene (Three.js) =====
const hero3dCanvas = document.getElementById('hero-3d-canvas');
if (hero3dCanvas && typeof THREE !== 'undefined') {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas: hero3dCanvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create floating geometric shapes
  const shapes = [];
  const geometries = [
    new THREE.IcosahedronGeometry(0.4, 0),
    new THREE.OctahedronGeometry(0.35, 0),
    new THREE.TetrahedronGeometry(0.4, 0),
    new THREE.TorusGeometry(0.3, 0.12, 8, 16),
    new THREE.BoxGeometry(0.4, 0.4, 0.4),
    new THREE.DodecahedronGeometry(0.3, 0),
  ];

  const colors = [0x06b6d4, 0xf59e0b, 0x8b5cf6, 0x10b981, 0x06b6d4, 0xf59e0b];

  for (let i = 0; i < 12; i++) {
    const geo = geometries[i % geometries.length];
    const mat = new THREE.MeshBasicMaterial({
      color: colors[i % colors.length],
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 4 - 2
    );
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    mesh.userData = {
      rotSpeed: { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01, z: (Math.random() - 0.5) * 0.01 },
      floatSpeed: Math.random() * 0.5 + 0.3,
      floatOffset: Math.random() * Math.PI * 2,
    };
    scene.add(mesh);
    shapes.push(mesh);
  }

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate3D() {
    const time = Date.now() * 0.001;

    shapes.forEach((mesh) => {
      mesh.rotation.x += mesh.userData.rotSpeed.x;
      mesh.rotation.y += mesh.userData.rotSpeed.y;
      mesh.rotation.z += mesh.userData.rotSpeed.z;
      mesh.position.y += Math.sin(time * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 0.002;
    });

    // Subtle camera movement based on mouse
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate3D);
  }

  animate3D();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ===== Console easter egg =====
console.log('%c hey naff. you found this. the glitch is real.', 'font-family: var(--font-mono); color: var(--accent-cyan); font-size: 14px;');
console.log('%c built in bale robe, ethiopia 🇪🇹', 'font-family: var(--font-mono); color: var(--text-muted); font-size: 11px;');
console.log('%c press ⌘K for command palette', 'font-family: var(--font-mono); color: var(--accent-amber); font-size: 11px;');

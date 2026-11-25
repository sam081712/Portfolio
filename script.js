// 1. Typing Animation
const roles = [
"Algorithmic Problem Solver",
"AI & Data Science Enthusiast",
"Python & C Programmer",
"Web Application Builder"
];
let roleIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typedEl = document.getElementById("typed-text");

function typeLoop() {
  const current = roles[roleIdx];
  typedEl.textContent = isDeleting
    ? current.substring(0, charIdx - 1)
    : current.substring(0, charIdx + 1);
  charIdx += isDeleting ? -1 : 1;

  let speed = isDeleting ? 45 : 90;
  if (!isDeleting && charIdx === current.length) {
    speed = 1600;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    speed = 400;
  }
  setTimeout(typeLoop, speed);
}
typeLoop();

// 2. Scroll Reveal & Back-to-Top Button
const reveals = document.querySelectorAll(".reveal");
const scrollBtn = document.getElementById("scrollTopBtn");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("active");
  });
}, { threshold: 0.12 });

reveals.forEach((el) => observer.observe(el));

window.addEventListener("scroll", () => {
  scrollBtn.classList.toggle("show", window.scrollY > 400);
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// 3. Interactive Particle Constellation Background
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
const colors = ["#4a9fd1", "#78bce5", "#a9dff5", "#80b5a7"];
const mouse = { x: null, y: null, radius: 130 };

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener("mouseout", () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.9;
    this.vy = (Math.random() - 0.5) * 0.9;
    this.size = Math.random() * 2.5 + 1.2;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    if (mouse.x && mouse.y) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < mouse.radius) {
        this.x += (dx / dist) * 1.5;
        this.y += (dy / dist) * 1.5;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(75, Math.floor((canvas.width * canvas.height) / 16000));
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
    for (let j = i + 1; j < particles.length; j++) {
      const dist = Math.hypot(
        particles[i].x - particles[j].x,
        particles[i].y - particles[j].y
      );
      if (dist < 130) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(74, 159, 209, ${1 - dist / 130})`;
        ctx.lineWidth = 0.7;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animate);
}
animate();
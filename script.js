// Kashmir Webworks - Main JS
// ==========================

// Sticky Navbar Background on Scroll
window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// GSAP Animations for Hero Text & Service Cards
window.addEventListener('DOMContentLoaded', () => {
  // Hero text fade in
  gsap.to('.hero-text h1', { opacity: 1, x: 0, duration: 1, delay: 0.2, ease: 'power3.out' });
  gsap.to('.hero-text p', { opacity: 1, x: 0, duration: 1, delay: 0.5, ease: 'power3.out' });
  // Service cards staggered fade-in
  gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.to(card, { opacity: 1, y: 0, duration: 0.8, delay: 0.8 + i * 0.15, ease: 'power3.out' });
  });
});

// Hamburger Menu Animation (Bootstrap handles collapse, but you can add custom if needed)
// ... (Bootstrap default is used)

// Neon Ripple Animation for Portfolio Button
const portfolioBtn = document.querySelector('.btn-portfolio-glow');
if (portfolioBtn) {
  portfolioBtn.addEventListener('mouseenter', function(e) {
    this.classList.add('ripple');
    setTimeout(() => this.classList.remove('ripple'), 600);
  });
}

// ==========================
// Three.js 3D Polygon Sphere
// ==========================
let renderer, scene, camera, sphere, lines, nodes, animationId;
function init3DSphere() {
  const container = document.getElementById('hero-3d-sphere');
  if (!container) return;
  // Clean up if re-initializing
  if (renderer) {
    cancelAnimationFrame(animationId);
    renderer.dispose();
    container.innerHTML = '';
  }
  // Sizing
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  // Renderer
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  // Scene & Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 6;
  // Sphere Geometry
  const geometry = new THREE.IcosahedronGeometry(2, 1);
  // Neon Lines
  const wireframe = new THREE.WireframeGeometry(geometry);
  lines = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2, opacity: 0.8, transparent: true, }));
  scene.add(lines);
  // Neon Nodes
  nodes = [];
  geometry.vertices.forEach(v => {
    const nodeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.copy(v);
    scene.add(node);
    nodes.push(node);
  });
  // Glow effect (optional, simple)
  // Animation
  let t = 0;
  function animate() {
    t += 0.01;
    // Rotate
    lines.rotation.y += 0.005;
    lines.rotation.x = Math.sin(t/2) * 0.1;
    // Pulse nodes
    nodes.forEach((node, i) => {
      const scale = 1 + 0.2 * Math.sin(t + i);
      node.scale.set(scale, scale, scale);
      node.material.color.setHSL(0.8 + 0.2 * Math.sin(t + i), 1, 0.6);
    });
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  }
  animate();
  // Interactivity: Mouse hover = speed up + glow
  let isHovering = false;
  container.addEventListener('mouseenter', () => { isHovering = true; });
  container.addEventListener('mouseleave', () => { isHovering = false; });
}
window.addEventListener('DOMContentLoaded', init3DSphere);
window.addEventListener('resize', init3DSphere);

// ==========================
// Background Particles (Canvas)
// ==========================
function initParticles() {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = window.innerWidth, h = window.innerHeight;
  canvas.width = w; canvas.height = h;
  let particles = Array.from({length: 60}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
    color: `rgba(${Math.random()>0.5?0:255},0,255,${Math.random()*0.5+0.3})`
  }));
  function draw() {
    ctx.clearRect(0,0,w,h);
    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2*Math.PI);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
    }
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize', () => {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w; canvas.height = h;
  });
}
window.addEventListener('DOMContentLoaded', initParticles);

// SERVICES SECTION LOGIC
(function() {
  // Particles for services section (lightweight canvas)
  const canvas = document.getElementById('services-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w; canvas.height = h;
      // fewer particles on small screens
      const count = Math.max(40, Math.min(100, Math.floor(w / 15)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.6,
        dx: (Math.random() - 0.5) * 0.25,
        dy: (Math.random() - 0.5) * 0.25,
        a: Math.random() * 0.5 + 0.3
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,255,${p.a})`;
        ctx.shadowColor = 'rgba(0,255,255,0.8)';
        ctx.shadowBlur = 12;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
      }
      requestAnimationFrame(draw);
    }
    window.addEventListener('resize', resize);
    resize();
    draw();
  }

  // Inject neon SVG icons into service cards
  document.querySelectorAll('.service-card-orbit .icon').forEach((el, idx) => {
    let svg = '';
    switch(idx) {
      case 0: // Web Dev
        svg = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 8h18"/><path d="M8 12l2 2-2 2"/><path d="M16 16l-2-2 2-2"/></svg>';
        break;
      case 1: // Mobile App
        svg = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><circle cx="12" cy="18" r="1"/></svg>';
        break;
      case 2: // E-commerce
        svg = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';
        break;
      case 3: // Digital Marketing
        svg = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-5v12l-18-5v8"/><path d="M13 12h1"/><path d="M16 11h1"/></svg>';
        break;
    }
    el.innerHTML = svg;
  });

  // Reveal animations for services cards
  const cards = document.querySelectorAll('.service-card-orbit');
  if (cards.length) {
    gsap.set(cards, { y: 20, opacity: 0 });
    cards.forEach((card, i) => {
      gsap.to(card, { opacity: 1, y: 0, delay: 0.2 + i * 0.2, duration: 0.8, ease: 'power3.out' });
    });
  }
})();

// ==========================
// (Optional) SVG Icons for Service Cards
// ==========================
document.querySelectorAll('.service-icon').forEach((el, i) => {
  let svg = '';
  switch(i) {
    case 0: // Web Design
      svg = '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="24" height="16" rx="3"/><path d="M4 12h24"/><circle cx="10" cy="20" r="1.5"/><circle cx="16" cy="20" r="1.5"/><circle cx="22" cy="20" r="1.5"/></svg>';
      break;
    case 1: // E-commerce
      svg = '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="10" width="20" height="12" rx="2"/><path d="M10 22v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2"/><circle cx="12" cy="26" r="1.5"/><circle cx="20" cy="26" r="1.5"/></svg>';
      break;
    case 2: // Serverion
      svg = '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="8" width="20" height="6" rx="2"/><rect x="6" y="18" width="20" height="6" rx="2"/><circle cx="10" cy="11" r="1.5"/><circle cx="10" cy="21" r="1.5"/></svg>';
      break;
    case 3: // Custom Dev
      svg = '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 24V8h16v16H8z"/><path d="M12 12h8v8h-8z"/></svg>';
      break;
  }
  el.innerHTML = svg;
});

// CONTACT SECTION LOGIC
(function() {
  // Initialize Mapbox map
  function initContactMap() {
    const mapContainer = document.getElementById('contact-map');
    if (!mapContainer || !mapboxgl) return;
    
    // You'll need to replace 'YOUR_MAPBOX_TOKEN' with an actual token
    // For demo purposes, we'll create a custom glowing map effect
    const map = new mapboxgl.Map({
      container: 'contact-map',
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [{
          id: 'osm-tiles',
          type: 'raster',
          source: 'osm',
          minzoom: 0,
          maxzoom: 22
        }]
      },
      center: [74.797371, 34.083656], // Srinagar coordinates
      zoom: 8,
      interactive: false
    });
    
    // Add custom glowing border effect
    map.on('load', () => {
      // Add a glowing overlay for the map
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = mapContainer.offsetWidth;
      canvas.height = mapContainer.offsetHeight;
      
      // Create glowing border effect
      function drawGlowBorder() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 15;
        
        // Draw border with rounded corners
        const radius = 12;
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(canvas.width - radius, 0);
        ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
        ctx.lineTo(canvas.width, canvas.height - radius);
        ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
        ctx.lineTo(radius, canvas.height);
        ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.stroke();
      }
      
      drawGlowBorder();
      mapContainer.appendChild(canvas);
      
      // Animate the glow
      let glowIntensity = 0.3;
      let increasing = true;
      
      function animateGlow() {
        if (increasing) {
          glowIntensity += 0.01;
          if (glowIntensity >= 0.8) increasing = false;
        } else {
          glowIntensity -= 0.01;
          if (glowIntensity <= 0.3) increasing = true;
        }
        
        ctx.shadowBlur = 15 * glowIntensity;
        drawGlowBorder();
        requestAnimationFrame(animateGlow);
      }
      
      animateGlow();
    });
  }
  
  // Form submission handling
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const name = this.querySelector('input[type="text"]').value;
      const email = this.querySelector('input[type="email"]').value;
      const subject = this.querySelectorAll('input[type="text"]')[1].value;
      const message = this.querySelector('textarea').value;
      
      // Simple validation
      if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return;
      }
      
      // Simulate form submission
      const submitBtn = this.querySelector('.btn-send-message');
      const originalText = submitBtn.querySelector('span').textContent;
      
      submitBtn.querySelector('span').textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        alert('Thank you! Your message has been sent successfully.');
        this.reset();
        submitBtn.querySelector('span').textContent = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }
  
  // Enhanced animations for contact section
  function initContactAnimations() {
    // Animate form fields on scroll into view
    const formFields = document.querySelectorAll('.contact-form .form-control');
    formFields.forEach((field, index) => {
      gsap.set(field, { opacity: 0, y: 20 });
      gsap.to(field, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.1 * index,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: field,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    });
    
    // Animate logo
    const logo = document.querySelector('.contact-logo');
    if (logo) {
      gsap.from(logo, {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: logo,
          start: 'top 80%'
        }
      });
    }
    
    // Animate map elements
    const mapElements = document.querySelectorAll('.location-pin, .animated-bars, .contact-info');
    mapElements.forEach((element, index) => {
      gsap.from(element, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.2 * index,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%'
        }
      });
    });
  }
  
  // Initialize everything when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initContactMap();
      initContactAnimations();
    });
  } else {
    initContactMap();
    initContactAnimations();
  }
  
  // Handle window resize for map
  window.addEventListener('resize', () => {
    const mapContainer = document.getElementById('contact-map');
    if (mapContainer && mapContainer._map) {
      mapContainer._map.resize();
    }
  });
})();

// TESTIMONIALS CAROUSEL LOGIC
(function() {
  let currentIndex = 0;
  let isAutoPlaying = true;
  let autoPlayInterval;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  
  const orbit = document.querySelector('.testimonial-orbit');
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.nav-prev');
  const nextBtn = document.querySelector('.nav-next');
  
  if (!orbit || !cards.length) return;
  
  // Initialize carousel
  function initCarousel() {
    updateActiveCard();
    startAutoPlay();
    setupEventListeners();
  }
  
  // Update active card and dot
  function updateActiveCard() {
    // Remove active class from all cards and dots
    cards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current card and dot
    cards[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
    
    // Update orbit rotation to center current card
    const rotation = -currentIndex * 60; // 360° / 6 cards = 60° per card
    orbit.style.transform = `rotateY(${rotation}deg)`;
  }
  
  // Navigate to specific card
  function goToCard(index) {
    currentIndex = (index + cards.length) % cards.length;
    updateActiveCard();
  }
  
  // Next card
  function nextCard() {
    goToCard(currentIndex + 1);
  }
  
  // Previous card
  function prevCard() {
    goToCard(currentIndex - 1);
  }
  
  // Start auto-play
  function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
      if (isAutoPlaying) {
        nextCard();
      }
    }, 4000); // Change card every 4 seconds
  }
  
  // Pause auto-play
  function pauseAutoPlay() {
    isAutoPlaying = false;
  }
  
  // Resume auto-play
  function resumeAutoPlay() {
    isAutoPlaying = true;
  }
  
  // Setup event listeners
  function setupEventListeners() {
    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', () => {
      prevCard();
      pauseAutoPlay();
      setTimeout(resumeAutoPlay, 2000); // Resume after 2 seconds
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
      nextCard();
      pauseAutoPlay();
      setTimeout(resumeAutoPlay, 2000);
    });
    
    // Navigation dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToCard(index);
        pauseAutoPlay();
        setTimeout(resumeAutoPlay, 2000);
      });
    });
    
    // Card hover events
    cards.forEach(card => {
      card.addEventListener('mouseenter', pauseAutoPlay);
      card.addEventListener('mouseleave', resumeAutoPlay);
      
      // Card click events (optional)
      card.addEventListener('click', () => {
        // You can add card click functionality here
        console.log(`Clicked on testimonial ${currentIndex + 1}`);
      });
    });
    
    // Touch/swipe support for mobile
    setupTouchSupport();
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevCard();
        pauseAutoPlay();
        setTimeout(resumeAutoPlay, 2000);
      } else if (e.key === 'ArrowRight') {
        nextCard();
        pauseAutoPlay();
        setTimeout(resumeAutoPlay, 2000);
      }
    });
  }
  
  // Touch and swipe support
  function setupTouchSupport() {
    orbit.addEventListener('touchstart', handleTouchStart, { passive: false });
    orbit.addEventListener('touchmove', handleTouchMove, { passive: false });
    orbit.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Mouse drag support for desktop
    orbit.addEventListener('mousedown', handleMouseDown);
    orbit.addEventListener('mousemove', handleMouseMove);
    orbit.addEventListener('mouseup', handleMouseUp);
    orbit.addEventListener('mouseleave', handleMouseUp);
  }
  
  // Touch event handlers
  function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    isDragging = true;
    pauseAutoPlay();
  }
  
  function handleTouchMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    currentX = e.touches[0].clientX;
  }
  
  function handleTouchEnd(e) {
    if (!isDragging) return;
    
    const diffX = startX - currentX;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        nextCard(); // Swipe left = next
      } else {
        prevCard(); // Swipe right = previous
      }
    }
    
    isDragging = false;
    setTimeout(resumeAutoPlay, 2000);
  }
  
  // Mouse drag event handlers
  function handleMouseDown(e) {
    startX = e.clientX;
    isDragging = true;
    pauseAutoPlay();
    orbit.style.cursor = 'grabbing';
  }
  
  function handleMouseMove(e) {
    if (!isDragging) return;
    currentX = e.clientX;
  }
  
  function handleMouseUp(e) {
    if (!isDragging) return;
    
    const diffX = startX - currentX;
    const threshold = 50;
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        nextCard();
      } else {
        prevCard();
      }
    }
    
    isDragging = false;
    orbit.style.cursor = 'grab';
    setTimeout(resumeAutoPlay, 2000);
  }
  
  // Pause auto-play when section is not visible
  function handleVisibilityChange() {
    if (document.hidden) {
      pauseAutoPlay();
    } else {
      resumeAutoPlay();
    }
  }
  
  // Add visibility change listener
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }
  
  // Pause auto-play when user scrolls away
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    pauseAutoPlay();
    scrollTimeout = setTimeout(resumeAutoPlay, 1000);
  });
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
  });
})();

// PROJECTS SECTION LOGIC
(function() {
  const droplets = document.querySelectorAll('.project-droplet');
  const bubbles = document.querySelectorAll('.bubble');
  
  if (!droplets.length) return;
  
  // Initialize projects section
  function initProjects() {
    setupDropletInteractions();
    setupBubbleAnimations();
    setupScrollAnimations();
  }
  
  // Setup droplet interactions
  function setupDropletInteractions() {
    droplets.forEach((droplet, index) => {
      // Add click functionality
      droplet.addEventListener('click', () => {
        handleDropletClick(droplet, index);
      });
      
      // Enhanced hover effects
      droplet.addEventListener('mouseenter', () => {
        enhanceHoverEffect(droplet, true);
      });
      
      droplet.addEventListener('mouseleave', () => {
        enhanceHoverEffect(droplet, false);
      });
      
      // Add subtle floating animation
      addFloatingAnimation(droplet, index);
    });
  }
  
  // Handle droplet click
  function handleDropletClick(droplet, index) {
    // Create ripple effect
    createRippleEffect(droplet);
    
    // Log project selection (you can replace this with actual navigation)
    const projectTitle = droplet.querySelector('.project-title').textContent;
    console.log(`Selected project: ${projectTitle}`);
    
    // Optional: Add active state
    droplets.forEach(d => d.classList.remove('active'));
    droplet.classList.add('active');
    
    // Remove active state after animation
    setTimeout(() => {
      droplet.classList.remove('active');
    }, 1000);
  }
  
  // Create ripple effect on click
  function createRippleEffect(droplet) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 1000;
    `;
    
    droplet.appendChild(ripple);
    
    // Animate ripple
    gsap.to(ripple, {
      width: '200px',
      height: '200px',
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => {
        ripple.remove();
      }
    });
  }
  
  // Enhance hover effects
  function enhanceHoverEffect(droplet, isHovering) {
    if (isHovering) {
      // Add glow effect
      droplet.style.filter = 'brightness(1.1) saturate(1.2)';
      
      // Scale up slightly
      gsap.to(droplet, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      // Intensify shadow
      droplet.style.boxShadow = `
        0 20px 60px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.3),
        0 0 30px rgba(255, 255, 255, 0.3)
      `;
    } else {
      // Reset effects
      droplet.style.filter = 'none';
      droplet.style.boxShadow = '';
      
      gsap.to(droplet, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }
  
  // Add floating animation to droplets
  function addFloatingAnimation(droplet, index) {
    const baseRotation = getComputedStyle(droplet).getPropertyValue('--rotation') || '0deg';
    const rotationValue = parseInt(baseRotation);
    
    gsap.to(droplet, {
      y: -15,
      rotation: rotationValue + 2,
      duration: 3 + index * 0.5,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1,
      delay: index * 0.2
    });
  }
  
  // Setup bubble animations
  function setupBubbleAnimations() {
    bubbles.forEach((bubble, index) => {
      // Add random movement to bubbles
      const randomX = (Math.random() - 0.5) * 100;
      const randomY = (Math.random() - 0.5) * 100;
      
      gsap.to(bubble, {
        x: randomX,
        y: randomY,
        duration: 8 + index * 2,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
        delay: index * 0.5
      });
    });
  }
  
  // Setup scroll animations
  function setupScrollAnimations() {
    // Animate droplets on scroll into view
    droplets.forEach((droplet, index) => {
      gsap.from(droplet, {
        opacity: 0,
        scale: 0.8,
        y: 50,
        duration: 0.8,
        delay: index * 0.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: droplet,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    });
    
    // Animate bubbles on scroll
    bubbles.forEach((bubble, index) => {
      gsap.from(bubble, {
        opacity: 0,
        scale: 0,
        duration: 1,
        delay: index * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: bubble,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }
  
  // Add parallax effect to background elements
  function setupParallax() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.background-blobs, .floating-bubbles');
      
      parallaxElements.forEach(element => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }
  
  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initProjects();
      setupParallax();
    });
  } else {
    initProjects();
    setupParallax();
  }
  
  // Handle window resize
  window.addEventListener('resize', () => {
    // Recalculate positions for responsive design
    droplets.forEach((droplet, index) => {
      if (window.innerWidth <= 991) {
        // Reset positioning for mobile
        droplet.style.position = 'relative';
        droplet.style.top = 'auto';
        droplet.style.left = 'auto';
        droplet.style.right = 'auto';
        droplet.style.bottom = 'auto';
      }
    });
  });
  
  // Add smooth reveal animation on page load
  window.addEventListener('load', () => {
    gsap.from('.projects-section .section-title', {
      opacity: 0,
      y: -30,
      duration: 1,
      ease: 'power2.out'
    });
    
    gsap.from('.project-droplet', {
      opacity: 0,
      scale: 0.5,
      duration: 1,
      stagger: 0.2,
      ease: 'back.out(1.7)'
    });
  });
})();

// Read More functionality
document.addEventListener('DOMContentLoaded', function() {
  const readMoreBtn = document.getElementById('readMoreBtn');
  const hiddenProject = document.querySelector('.hidden-project');
  
  if (readMoreBtn && hiddenProject) {
    const btnText = readMoreBtn.querySelector('.btn-text');
    
    readMoreBtn.addEventListener('click', function() {
      if (hiddenProject.classList.contains('show')) {
        // Hide the project
        hiddenProject.classList.remove('show');
        btnText.textContent = 'Read More';
        readMoreBtn.classList.remove('expanded');
      } else {
        // Show the project
        hiddenProject.classList.add('show');
        btnText.textContent = 'Show Less';
        readMoreBtn.classList.add('expanded');
      }
    });
  }
});

// Experience Section Functionality
document.addEventListener('DOMContentLoaded', function() {

  // Animated Counter for Stats
  const statNumbers = document.querySelectorAll('.stat-number');
  
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  }

  // Intersection Observer for stats animation
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumber = entry.target;
        animateCounter(statNumber);
        statsObserver.unobserve(statNumber); // Only animate once
      }
    });
  }, { threshold: 0.5 });

  // Observe all stat numbers
  statNumbers.forEach(stat => {
    statsObserver.observe(stat);
  });
});

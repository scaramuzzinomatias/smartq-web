// ==========================================================================
// SmartQ — Interactive Scripts & Animations (v2)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. NAVBAR SCROLL EFFECT
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. MOBILE NAVIGATION
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close menu when clicking on nav link (mobile)
    document.querySelectorAll('.nav-link, .btn-nav-acceso').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // 3. SCROLL REVEAL (Intersection Observer for smooth fade-ins)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Animates only once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 4. HERO LIVE EVENTS TELEMETRY TICKER
  const liveEventsList = document.getElementById('liveEventsList');
  
  if (liveEventsList) {
    const eventTemplates = [
      { type: 'MP Vending', desc: 'Pago aprobado $1.500' },
      { type: 'Coffee Link', desc: 'NFC Leído - Ración despachada' },
      { type: 'TermoControl', desc: 'Temp: 84.8°C (Estable)' },
      { type: 'MQTT Broker', desc: 'Comando OTA publicado (v2.1)' },
      { type: 'MP Vending', desc: 'Venta completada - Máquina 12' },
      { type: 'Coffee Link', desc: 'Crédito validado corporativo' },
      { type: 'TermoControl', desc: 'Válvula de seguridad activada' },
      { type: 'MQTT Broker', desc: 'Dispositivo IoT 04 en línea' }
    ];

    const formatShortTime = () => {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    };

    // Periodically insert random events into the visual telemetry list
    setInterval(() => {
      const randEvent = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
      
      const newRow = document.createElement('div');
      newRow.className = 'live-event-row';
      newRow.innerHTML = `
        <span class="event-time">${formatShortTime()} — ${randEvent.type}</span>
        <span class="event-text">${randEvent.desc}</span>
      `;
      
      liveEventsList.prepend(newRow);
      
      // Maintain at most 3 items in the viewport
      if (liveEventsList.children.length > 3) {
        liveEventsList.removeChild(liveEventsList.lastChild);
      }
    }, 4500);
  }

  // 5. PLATFORMS INTERACTIVE TABS & ANIMATING BARS
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  const triggerChartBarAnimation = (tabContentElement) => {
    const bars = tabContentElement.querySelectorAll('.chart-bar-large');
    bars.forEach(bar => {
      // Force restyle reset to re-trigger transition
      bar.style.height = '0%';
      setTimeout(() => {
        const targetHeight = bar.style.getPropertyValue('--bar-height');
        bar.style.height = targetHeight;
      }, 50);
    });
  };

  // Initial trigger for the active tab on load
  const initialActiveTab = document.querySelector('.tab-content.active');
  if (initialActiveTab) {
    triggerChartBarAnimation(initialActiveTab);
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Deactivate all buttons and hide all contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Activate selected button and show content
      button.classList.add('active');
      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.add('active');
        triggerChartBarAnimation(targetContent);
      }
    });
  });

  // 6. ECOSYSTEM IoT INTERACTIVE SIMULATOR (SVG Flow Connectors)
  const btnSimular = document.getElementById('btnSimular');
  const simDesc = document.getElementById('simDesc');
  
  // Nodes
  const node1 = document.getElementById('node1');
  const node2 = document.getElementById('node2');
  const node3 = document.getElementById('node3');
  
  // Status bubbles
  const status1 = document.getElementById('status1');
  const status2 = document.getElementById('status2');
  const status3 = document.getElementById('status3');

  // SVG connector overlay lines
  const pulsePath1 = document.getElementById('pulsePath1');
  const pulsePath2 = document.getElementById('pulsePath2');

  const runSimulation = () => {
    if (!btnSimular || btnSimular.disabled) return;

    // 1. Reset all states
    btnSimular.disabled = true;
    node1.classList.remove('active');
    node2.classList.remove('active');
    node3.classList.remove('active');
    
    status1.classList.remove('visible');
    status2.classList.remove('visible');
    status3.classList.remove('visible');
    status3.innerHTML = '<span class="status-dot"></span> Despachando';

    pulsePath1.classList.remove('active');
    pulsePath2.classList.remove('active');

    // --- SEQUENCE ---

    // Step 1: Node 1 (Client initiates Payment QR)
    simDesc.textContent = 'Cliente escanea el código QR y valida el pago...';
    node1.classList.add('active');
    status1.classList.add('visible');

    // Step 2: Pulse travels Node 1 -> Node 2 (after 1.5s)
    setTimeout(() => {
      simDesc.textContent = 'Enviando confirmación de transacción a la nube SmartQ via MQTT...';
      pulsePath1.classList.add('active');
    }, 1500);

    // Step 3: Node 2 (SmartQ Cloud receives & processes command) (after 2.7s)
    setTimeout(() => {
      simDesc.textContent = 'Nube SmartQ autentica el pago y emite orden de despacho cifrada TLS...';
      node2.classList.add('active');
      status2.classList.add('visible');
    }, 2700);

    // Step 4: Pulse travels Node 2 -> Node 3 (after 4.2s)
    setTimeout(() => {
      simDesc.textContent = 'Transmitiendo orden de habilitación segura al dispositivo físico IoT...';
      pulsePath2.classList.add('active');
    }, 4200);

    // Step 5: Node 3 (Dispositivo IoT starts dispensing) (after 5.4s)
    setTimeout(() => {
      simDesc.textContent = 'Hardware SmartQ acciona los relés MDB: Dispensando producto físico...';
      node3.classList.add('active');
      status3.classList.add('visible');
    }, 5400);

    // Step 6: Dispense cycle success (after 7.4s)
    setTimeout(() => {
      simDesc.textContent = '¡Compra finalizada con éxito! Telemetría registrada en SaaS.';
      status3.querySelector('.status-dot').classList.add('green');
      status3.innerHTML = '<span class="status-dot green"></span> Producto Entregado';
      addLocalHeroTelemetryEvent('MP Vending', 'Compra simulada exitosa ($1.500)');
    }, 7400);

    // Step 7: Clear & Reset (after 10.4s)
    setTimeout(() => {
      node1.classList.remove('active');
      node2.classList.remove('active');
      node3.classList.remove('active');
      
      status1.classList.remove('visible');
      status2.classList.remove('visible');
      status3.classList.remove('visible');

      pulsePath1.classList.remove('active');
      pulsePath2.classList.remove('active');

      btnSimular.disabled = false;
      simDesc.textContent = 'Flujo completado — podés repetirlo cuando quieras';
    }, 10400);
  };

  if (btnSimular) {
    // Auto-trigger when simulator section scrolls into view
    const simSection = document.getElementById('simulador');
    let simTriggered = false;

    if (simSection && 'IntersectionObserver' in window) {
      const simObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !simTriggered) {
            simTriggered = true;
            // Small delay so the user sees the nodes before animation starts
            setTimeout(runSimulation, 600);
            simObserver.unobserve(simSection);
          }
        });
      }, { threshold: 0.3 });

      simObserver.observe(simSection);
    }

    // Replay button
    btnSimular.addEventListener('click', runSimulation);

    // Helper to feed simulation event back into the Hero telemetry list if visible
    const addLocalHeroTelemetryEvent = (type, desc) => {
      const list = document.getElementById('liveEventsList');
      if (list) {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
        const newRow = document.createElement('div');
        newRow.className = 'live-event-row';
        newRow.innerHTML = `
          <span class="event-time" style="color: var(--green);">${timeStr} — ${type}</span>
          <span class="event-text" style="font-weight: 700;">${desc}</span>
        `;
        
        list.prepend(newRow);
        if (list.children.length > 3) {
          list.removeChild(list.lastChild);
        }
      }
    };
  }

  // 7. CONTACT FORM SUBMIT (envío real al backend /api/contact)
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const company = document.getElementById('company').value.trim();
      const message = document.getElementById('message').value;
      const honey = document.getElementById('honey') ? document.getElementById('honey').value : '';

      const fullMessage = company ? `Empresa: ${company}\n\n${message}` : message;

      btn.disabled = true;
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.85';
      btn.innerHTML = '<span class="material-symbols-rounded">progress_activity</span> Enviando...';
      if (formStatus) {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message: fullMessage, _honey: honey })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.ok) {
          throw new Error(data.message || 'No se pudo enviar la consulta.');
        }

        btn.innerHTML = '<span class="material-symbols-rounded">check_circle</span> Mensaje enviado con éxito';
        btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
        if (formStatus) {
          formStatus.textContent = 'Gracias, te vamos a contactar a la brevedad.';
          formStatus.classList.add('success');
        }
        contactForm.reset();
      } catch (error) {
        btn.innerHTML = '<span class="material-symbols-rounded">error</span> Reintentar envío';
        btn.style.background = 'linear-gradient(135deg, #EF4444, #B91C1C)';
        if (formStatus) {
          formStatus.textContent = error.message || 'No se pudo enviar la consulta. Probá de nuevo.';
          formStatus.classList.add('error');
        }
      }

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        btn.style.pointerEvents = '';
        btn.style.opacity = '';
        btn.style.background = '';
      }, 3500);
    });
  }
});

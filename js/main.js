document.addEventListener("DOMContentLoaded", () => {
    /* ====== MOBILE NAV TOGGLE & SCROLL ====== */
    const menuToggle = document.querySelector(".menu-toggle");
    const navUl = document.querySelector("nav ul");
    const header = document.querySelector("header");

    if (menuToggle && navUl) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            navUl.classList.toggle("active");
            
            // Prevent body scroll when menu is open
            if(navUl.classList.contains("active")) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "auto";
            }
        });
    }

    // Shrink header on scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    /* ====== INTERSECTION OBSERVER FOR FADE-UP ====== */
    // Select both fade-in and fade-up just in case
    const animatedElements = document.querySelectorAll(".fade-up, .fade-in, .card, .gallery-item");
    
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add visible class with a slight staggered delay based on index horizontally
                setTimeout(() => {
                    entry.target.classList.add("visible");
                    // Optionally remove observer after animation to keep memory low
                    observer.unobserve(entry.target);
                }, (index % 4) * 150); 
                
                // If the item itself hasn't fade classes, maybe add it dynamically
                if(!entry.target.classList.contains("fade-up") && !entry.target.classList.contains("fade-in")) {
                    entry.target.classList.add("fade-up", "visible");
                }
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    /* ====== FORM VALIDATION & API FETCH ====== */
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const feedbackEl = document.getElementById('form-feedback');
            const originalText = btn.innerHTML;

            // Gather form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            data.tipo_formulario = contactForm.getAttribute('data-type') || 'contacto';

            // Clear previous feedback
            if (feedbackEl) {
                feedbackEl.style.display = 'none';
                feedbackEl.textContent = '';
                feedbackEl.className = '';
            }

            try {
                // Visual feedback of sending
                btn.innerHTML = "Enviando... <span style='font-size: 1.2rem; margin-left:8px;'>✈️</span>";
                btn.style.opacity = "0.8";
                btn.disabled = true;

                // Send request
                const response = await fetch('/api/solicitudes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Success state
                    contactForm.reset();
                    btn.innerHTML = "Mensaje Enviado ✓";
                    btn.style.background = "#10b981"; // success green
                    
                    if (feedbackEl) {
                        feedbackEl.style.display = 'block';
                        feedbackEl.style.color = '#10b981';
                        feedbackEl.textContent = result.message || '¡Tu solicitud ha sido enviada con éxito!';
                    }
                } else {
                    // Error state from server
                    btn.innerHTML = originalText;
                    btn.style.background = "";
                    if (feedbackEl) {
                        feedbackEl.style.display = 'block';
                        feedbackEl.style.color = '#ef4444'; // red
                        feedbackEl.textContent = result.message || 'Ocurrió un error al procesar tu solicitud.';
                    }
                }
            } catch (error) {
                console.error("Error sending form:", error);
                btn.innerHTML = originalText;
                btn.style.background = "";
                if (feedbackEl) {
                    feedbackEl.style.display = 'block';
                    feedbackEl.style.color = '#ef4444';
                    feedbackEl.textContent = 'Hubo un problema de conexión al enviar el formulario. Intenta nuevamente.';
                }
            } finally {
                btn.disabled = false;
                btn.style.opacity = "1";
                
                // Reset button visual after 5 seconds if success
                if (btn.style.background === 'rgb(16, 185, 129)' || btn.style.background === '#10b981') {
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = "";
                        if (feedbackEl) feedbackEl.style.display = 'none';
                    }, 5000);
                }
            }
        });
    }

    /* ====== ACTIVE LINK HIGHLIGHTING ====== */
    const currentLocation = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll("nav ul li a");
    
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href && (href === currentLocation || (href.includes(currentLocation) && currentLocation !== ""))) {
            link.classList.add("active");
        }
    });

    if (currentLocation === "" || currentLocation === "/" || currentLocation === "index.html") {
        const homeLink = document.querySelector('nav ul li a[href="index.html"]') || document.querySelector('nav ul li a[href="../index.html"]');
        if (homeLink) homeLink.classList.add("active");
    }
});

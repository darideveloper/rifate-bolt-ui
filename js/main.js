// Main JavaScript file for the landing page
import '../styles/main.sass';
import AOS from 'aos';
import 'aos/dist/aos.css';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100
  });

  // Counter animation function
  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target > 1000 ? 50 : 1;
    const stepTime = Math.abs(Math.floor(duration / (target / increment)));
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      element.textContent = current.toLocaleString();
      
      if (current >= target) {
        element.textContent = target.toLocaleString();
        clearInterval(timer);
      }
    }, stepTime);
  }

  // Intersection Observer for counter animation
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const value = parseInt(target.dataset.value, 10);
        animateCounter(target, value);
        counterObserver.unobserve(target);
      }
    });
  }, observerOptions);

  // Observe all counter elements
  document.querySelectorAll('.about__stat-number').forEach(counter => {
    counterObserver.observe(counter);
  });

  // Mobile menu toggle
  const navToggle = document.getElementById('navToggle');
  const navList = document.querySelector('.nav__list');
  const hamburger = document.querySelector('.hamburger');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navList.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }

  // Testimonial slider functionality
  const testimonialSlider = document.getElementById('testimonialsSlider');
  let testimonials;

  if (testimonialSlider) {
    testimonials = testimonialSlider.querySelectorAll('.testimonial-card');
    updateTestimonialSlider();
  }

  function updateTestimonialSlider() {
    if (!testimonials || testimonials.length === 0) return;
    
    testimonials.forEach((testimonial) => {
      testimonial.style.opacity = '1';
      testimonial.style.transform = 'translateX(0)';
    });
  }

  // Responsive adjustments
  window.addEventListener('resize', () => {
    if (testimonialSlider) {
      updateTestimonialSlider();
    }
  });

  // Smooth scrolling for in-page links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
        
        if (navList && navList.classList.contains('active')) {
          navList.classList.remove('active');
          hamburger.classList.remove('active');
        }
      }
    });
  });

  // Contact form submission
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const formValues = Object.fromEntries(formData.entries());
      
      console.log('Form submitted with values:', formValues);
      
      const successMessage = document.createElement('div');
      successMessage.className = 'confirmation-message';
      successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>¡Gracias por tu mensaje! Te contactaremos pronto.</p>
      `;
      
      contactForm.reset();
      contactForm.style.display = 'none';
      contactForm.parentNode.appendChild(successMessage);
      
      setTimeout(() => {
        contactForm.style.display = 'block';
        successMessage.remove();
      }, 3000);
    });
  }
});
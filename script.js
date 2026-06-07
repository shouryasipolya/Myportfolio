// --- EmailJS Configuration ---
// TO CONNECT YOUR EMAILJS:
// 1. Sign up on https://www.emailjs.com/
// 2. Create an Email Service (e.g. Gmail) and get your SERVICE_ID
// 3. Create an Email Template with fields: {{user_name}}, {{user_email}}, {{message}} and get your TEMPLATE_ID
// 4. Go to Account -> Public Key and copy your PUBLIC_KEY
const EMAILJS_SERVICE_ID = 'service_l8sqs36';
const EMAILJS_TEMPLATE_ID = 'template_9akqcak';
const EMAILJS_PUBLIC_KEY = 'xlcRYZQ89jlw5bI-j';

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const skillBarFills = document.querySelectorAll('.skill-bar-fill');
  const skillsSection = document.querySelector('#skills');

  // --- Mobile Navigation Menu ---
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', !isOpen);
      mobileToggle.classList.toggle('open');
      navLinksContainer.classList.toggle('open');
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        navLinksContainer.classList.remove('open');
      });
    });
  }

  // --- Active Navigation Highlighting via Intersection Observer ---
  const observerOptions = {
    root: null, // Viewport
    rootMargin: '-30% 0px -60% 0px', // Trigger active state when section is in the main viewing zone
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeSectionId = entry.target.getAttribute('id');

        // Update main navbar links
        navLinks.forEach(link => {
          if (link.getAttribute('data-section') === activeSectionId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // --- Smooth Scrolling for Navigation Items ---
  const smoothScrollTo = (targetId) => {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Add click handlers for custom smooth scrolling to support snapped scrolling cleanly
  const allNavTriggers = [...navLinks, ...document.querySelectorAll('.hero-actions .btn')];
  allNavTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const targetHref = trigger.getAttribute('href');
      if (targetHref && targetHref.startsWith('#')) {
        e.preventDefault();
        smoothScrollTo(targetHref);

        // Update URL hash without jumping
        history.pushState(null, null, targetHref);
      }
    });
  });

  // --- Scroll Reveal Animation Observer ---
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserverOptions = {
      root: null,
      threshold: 0.08, // Trigger when 8% of the item is visible
      rootMargin: '0px 0px -40px 0px' // Offset to trigger before it reaches full center
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Stop observing once revealed
        }
      });
    }, revealObserverOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- Contact Form EmailJS Integration ---
  const contactForm = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status-message');

  if (contactForm && statusMsg) {
    // Initialize EmailJS if the public key is not the default placeholder
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'your_public_key_here') {
      emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY
      });
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show sending feedback status
      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;

      statusMsg.className = 'form-status-message';
      statusMsg.innerText = '';

      // Check if credentials are still placeholders
      if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY === 'your_public_key_here' ||
        EMAILJS_SERVICE_ID === 'service_xyz123' || EMAILJS_TEMPLATE_ID === 'template_abc123') {

        // Mock demo mode response
        setTimeout(() => {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;

          statusMsg.classList.add('success');
          statusMsg.innerText = 'Demo Mode: Message simulated successfully! To receive actual emails at sipolyashourya@gmail.com, configure your EmailJS credentials in script.js.';
          contactForm.reset();
        }, 1200);
        return;
      }

      // Actual EmailJS send
      emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
        .then(() => {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
          statusMsg.classList.add('success');
          statusMsg.innerText = 'Thank you! Your message has been sent successfully.';
          contactForm.reset();
        })
        .catch((error) => {
          console.error('EmailJS Error:', error);
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
          statusMsg.classList.add('error');
          statusMsg.innerText = 'Oops! Something went wrong. Please try again or email directly at sipolyashourya@gmail.com.';
        });
    });
  }
});

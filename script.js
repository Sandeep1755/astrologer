/**
 * ASTROLOGER VIJAY SHARMA - CORE SCRIPT
 * High-Converting Interactions, Mobile Drawer, Accordion, Form Handling & Analytics Hooks
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year in Footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Mobile Navigation Drawer
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
      mobileDrawer.classList.toggle('is-open');
      mobileDrawer.setAttribute('aria-hidden', String(isExpanded));
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.classList.remove('is-open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherPanel = otherItem.querySelector('.faq-panel');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.hidden = true;
        }
      });

      // Toggle current item
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        item.classList.remove('is-active');
        panel.hidden = true;
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        item.classList.add('is-active');
        panel.hidden = false;
        trackEvent('Engagement', 'FAQ Expand', trigger.querySelector('.faq-question')?.textContent.trim());
      }
    });
  });

  // 4. Consultation Enquiry Form Handling
  const consultationForm = document.getElementById('consultationForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');
  const nameInput = document.getElementById('clientName');
  const phoneInput = document.getElementById('clientPhone');
  const concernSelect = document.getElementById('areaOfConcern');
  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');
  const concernError = document.getElementById('concernError');
  const submitBtn = document.getElementById('submitBtn');

  if (consultationForm) {
    // Input clear error on typing
    nameInput?.addEventListener('input', () => {
      nameInput.classList.remove('is-invalid');
      if (nameError) nameError.style.display = 'none';
    });

    phoneInput?.addEventListener('input', () => {
      phoneInput.classList.remove('is-invalid');
      if (phoneError) phoneError.style.display = 'none';
    });

    concernSelect?.addEventListener('change', () => {
      concernSelect.classList.remove('is-invalid');
      if (concernError) concernError.style.display = 'none';
    });

    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check honeypot for spam bots
      const honeypot = document.getElementById('website_hp');
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Spam submission detected.');
        return;
      }

      let isValid = true;

      // Validate Name
      const nameVal = nameInput?.value.trim() || '';
      if (nameVal.length < 2) {
        isValid = false;
        nameInput?.classList.add('is-invalid');
        if (nameError) nameError.style.display = 'block';
      }

      // Validate Phone (At least 10 digits)
      const phoneVal = phoneInput?.value.replace(/\D/g, '') || '';
      if (phoneVal.length < 10) {
        isValid = false;
        phoneInput?.classList.add('is-invalid');
        if (phoneError) phoneError.style.display = 'block';
      }

      // Validate Concern
      const concernVal = concernSelect?.value || '';
      if (!concernVal) {
        isValid = false;
        concernSelect?.classList.add('is-invalid');
        if (concernError) concernError.style.display = 'block';
      }

      if (!isValid) return;

      // Submit feedback state
      if (submitBtn) {
        submitBtn.disabled = true;
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Submitting Request...';
      }

      const formData = {
        name: nameVal,
        phone: phoneVal,
        contactMethod: consultationForm.querySelector('input[name="contactMethod"]:checked')?.value || 'phone',
        concern: concernVal,
        message: document.getElementById('clientMessage')?.value.trim() || '',
        submittedAt: new Date().toISOString(),
        location: 'Mansa, Punjab'
      };

      // Persist lead locally in localStorage
      try {
        const storedLeads = JSON.parse(localStorage.getItem('astrologer_leads') || '[]');
        storedLeads.push(formData);
        localStorage.setItem('astrologer_leads', JSON.stringify(storedLeads));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      // Dispatch analytics tracking
      trackEvent('Conversion', 'Form Submission', `${formData.concern} - ${formData.contactMethod}`);

      // Simulate network response latency
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          const btnText = submitBtn.querySelector('.btn-text');
          if (btnText) btnText.textContent = 'Request Consultation';
        }

        consultationForm.reset();

        if (formSuccessAlert) {
          formSuccessAlert.style.display = 'flex';
          formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 600);
    });
  }

  // 5. Legal Modals (Privacy Policy & Terms)
  const privacyModal = document.getElementById('privacyModal');
  const termsModal = document.getElementById('termsModal');
  const openPrivacyBtn = document.getElementById('openPrivacyModal');
  const openTermsBtn = document.getElementById('openTermsModal');
  const closePrivacyBtn = document.getElementById('closePrivacyBtn');
  const closeTermsBtn = document.getElementById('closeTermsBtn');

  function openModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  openPrivacyBtn?.addEventListener('click', () => openModal(privacyModal));
  closePrivacyBtn?.addEventListener('click', () => closeModal(privacyModal));

  openTermsBtn?.addEventListener('click', () => openModal(termsModal));
  closeTermsBtn?.addEventListener('click', () => closeModal(termsModal));

  [privacyModal, termsModal].forEach(modal => {
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(privacyModal);
      closeModal(termsModal);
    }
  });

  // 6. Analytics Event Dispatcher (GA / Meta Pixel / Console)
  function trackEvent(category, action, label = '') {
    // Console audit
    console.info(`[Analytics Event] Category: "${category}" | Action: "${action}" | Label: "${label}"`);

    // Google Analytics 4 (if configured)
    if (typeof window.gtag === 'function') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
      });
    }
  }

  // Bind trackEvent to all data-analytics elements
  document.querySelectorAll('[data-analytics]').forEach(el => {
    el.addEventListener('click', () => {
      const eventName = el.getAttribute('data-analytics') || 'cta-click';
      trackEvent('Engagement', 'Click', eventName);
    });
  });
});

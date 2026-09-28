/**
 * AURELIA DENTAL STUDIO — MASTER SCRIPT
 * Native Modern JavaScript (ES2024 / Vanilla)
 * Lightweight, zero-dependency, accessible, production-grade
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initSmoothScroll();
  initBeforeAfterSlider();
  initSmileTabs();
  initAppointmentForm();
  initGalleryModal();
  initDoctorModal();
});

/* ==========================================================================
   1. Sticky Header & Active Navigation Observer
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Highlight active nav links on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}` || href?.endsWith(`#${id}`)) {
              link.classList.add('active');
            } else if (href && href.startsWith('#')) {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px'
    });

    sections.forEach(sec => observer.observe(sec));
  }
}

/* ==========================================================================
   2. Mobile Drawer Navigation & Backdrop Trap
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const closeBtn = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-nav-link, .drawer-footer a');

  if (!toggleBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) closeDrawer();
    else openDrawer();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
      toggleBtn.focus();
    }
  });
}

/* ==========================================================================
   3. Accessible Smooth Scrolling
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - (headerHeight + 16);

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Set focus for accessibility without moving viewport
        targetEl.setAttribute('tabindex', '-1');
        targetEl.focus({ preventScroll: true });
      }
    });
  });
}

/* ==========================================================================
   4. Interactive Before / After Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const sliders = document.querySelectorAll('.ba-slider-container');
  sliders.forEach(container => {
    const overlay = container.querySelector('.ba-slider-overlay');
    const handle = container.querySelector('.ba-slider-handle');
    const input = container.querySelector('.ba-slider-input');

    if (!overlay || !input) return;

    const updateSlider = (val) => {
      overlay.style.width = `${val}%`;
      if (handle) {
        handle.style.left = `${val}%`;
      }
    };

    input.addEventListener('input', (e) => {
      updateSlider(e.target.value);
    });

    // Initialize at 50%
    updateSlider(50);
  });
}

/* ==========================================================================
   5. Smile & Treatment Transformation Tabs
   ========================================================================== */
function initSmileTabs() {
  const tabs = document.querySelectorAll('.smile-tabs-nav .tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  if (tabs.length === 0 || panels.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        // Reset slider in that panel to 50%
        const input = targetPanel.querySelector('.ba-slider-input');
        if (input) {
          input.value = 50;
          const overlay = targetPanel.querySelector('.ba-slider-overlay');
          const handle = targetPanel.querySelector('.ba-slider-handle');
          if (overlay) overlay.style.width = '50%';
          if (handle) handle.style.left = '50%';
        }
      }
    });
  });
}

/* ==========================================================================
   6. Appointment Booking Form — Real-time Validation & Confirmation State
   ========================================================================== */
function initAppointmentForm() {
  const form = document.getElementById('appointment-form');
  const successPane = document.getElementById('booking-success-pane');
  const resetBtn = document.getElementById('booking-reset-btn');
  const dateInput = document.getElementById('apt-date');

  // Enforce today as minimum selectable date
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Auto-populate from URL query parameters (e.g. ?treatment=Clear+Aligners&doctor=Dr.+Aanya+Mehta)
  try {
    const params = new URLSearchParams(window.location.search);
    const paramTreatment = params.get('treatment');
    const paramDoctor = params.get('doctor');

    if (paramTreatment) {
      const treatmentSelect = document.getElementById('apt-treatment');
      if (treatmentSelect) {
        for (let i = 0; i < treatmentSelect.options.length; i++) {
          if (treatmentSelect.options[i].text.toLowerCase().includes(paramTreatment.toLowerCase()) ||
              treatmentSelect.options[i].value.toLowerCase().includes(paramTreatment.toLowerCase())) {
            treatmentSelect.selectedIndex = i;
            break;
          }
        }
      }
    }

    if (paramDoctor) {
      const doctorSelect = document.getElementById('apt-doctor');
      if (doctorSelect) {
        for (let i = 0; i < doctorSelect.options.length; i++) {
          if (doctorSelect.options[i].text.toLowerCase().includes(paramDoctor.toLowerCase()) ||
              doctorSelect.options[i].value.toLowerCase().includes(paramDoctor.toLowerCase())) {
            doctorSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
  } catch (err) {
    // Non-critical parameter parse fallback
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check HTML5 validity
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Request Appointment';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg style="animation: spin 1s linear infinite; width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        Processing Request...
      `;
    }

    // Collect values for confirmation summary
    const formData = {
      name: document.getElementById('apt-name')?.value || 'Valued Patient',
      phone: document.getElementById('apt-phone')?.value || 'Not provided',
      email: document.getElementById('apt-email')?.value || 'Not provided',
      date: document.getElementById('apt-date')?.value || 'Preferred Date',
      time: document.getElementById('apt-time')?.value || 'Flexible',
      treatment: document.getElementById('apt-treatment')?.value || 'Consultation',
      doctor: document.getElementById('apt-doctor')?.value || 'Any Available Specialist',
    };

    // Simulate polished clinical server processing (600ms)
    setTimeout(() => {
      // Populate summary card
      document.getElementById('sum-name').textContent = formData.name;
      document.getElementById('sum-phone').textContent = formData.phone;
      document.getElementById('sum-date').textContent = formatDateDisplay(formData.date);
      document.getElementById('sum-time').textContent = formData.time;
      document.getElementById('sum-treatment').textContent = formData.treatment;
      document.getElementById('sum-doctor').textContent = formData.doctor;

      // Hide form & show confirmation state
      form.style.display = 'none';
      if (successPane) {
        successPane.classList.add('visible');
        successPane.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }, 600);
  });

  if (resetBtn && form && successPane) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      successPane.classList.remove('visible');
    });
  }
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return 'Selected Date';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    }
  } catch (e) {
    // fallback
  }
  return dateStr;
}

/* ==========================================================================
   7. Clinic Experience Gallery Lightbox Modal
   ========================================================================== */
function initGalleryModal() {
  const modal = document.getElementById('gallery-lightbox-modal');
  const items = document.querySelectorAll('.gallery-item');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalSub = document.getElementById('lightbox-sub');
  const closeBtn = document.getElementById('lightbox-close');

  if (!modal || items.length === 0) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title') || item.querySelector('.gallery-caption')?.textContent || 'Clinic Space';
      const sub = item.getAttribute('data-sub') || item.querySelector('.gallery-sub')?.textContent || 'Aurelia Dental Studio';

      if (modalImg && img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
      }
      if (modalTitle) modalTitle.textContent = title;
      if (modalSub) modalSub.textContent = sub;

      modal.showModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.close());
  }

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      modal.close();
    }
  });
}

/* ==========================================================================
   8. Doctor Quick Profile Modal
   ========================================================================== */
function initDoctorModal() {
  const modal = document.getElementById('doctor-profile-modal');
  const triggerBtns = document.querySelectorAll('.view-doctor-profile-btn');
  const closeBtn = document.getElementById('doctor-modal-close');

  if (!modal || triggerBtns.length === 0) return;

  const doctorData = {
    'aanya': {
      name: 'Dr. Aanya Mehta',
      title: 'BDS, MDS — Conservative Dentistry & Endodontics',
      role: 'Lead Restorative Specialist & Endodontist',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
      education: 'BDS (Gold Medalist, 2013), MDS Conservative Dentistry (2016) — Fictional Demo Credentials',
      focus: 'Microscopic Endodontics, Precision Inlays & Onlays, Single-Visit Restorations, Anxious Patient Care',
      bio: 'Dr. Aanya Mehta founded the demo studio concept around the belief that dental care should be restorative in every sense: gentle, technically meticulous, and completely transparent. With special focus on tooth-preserving procedures, she emphasizes preventive maintenance and patient education.',
      dropdownVal: 'Dr. Aanya Mehta (Restorative & Endodontics)'
    },
    'rohan': {
      name: 'Dr. Rohan Shah',
      title: 'BDS, MDS — Orthodontics & Dentofacial Orthopedics',
      role: 'Consultant Orthodontist & Clear Aligner Specialist',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
      education: 'BDS (2015), MDS Orthodontics (2018), Certified Clear Aligner Provider — Demo Credentials',
      focus: 'Adult Aesthetic Alignment, Clear Aligners, Interceptive Pediatric Orthodontics, Airway-Centric Alignment',
      bio: 'Dr. Rohan Shah combines digital 3D treatment planning with biomechanical precision to craft natural, harmonious smiles. His philosophy focuses on minimal discomfort and discreet, modern solutions that fit seamlessly into busy personal and professional schedules.',
      dropdownVal: 'Dr. Rohan Shah (Orthodontics & Aligners)'
    },
    'mira': {
      name: 'Dr. Mira Kapoor',
      title: 'BDS, Fellowship in Aesthetic & Cosmetic Dentistry',
      role: 'Aesthetic Dentistry & Smile Enhancement Specialist',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      education: 'BDS (2014), International Fellowship in Aesthetic Dentistry (Demo Data)',
      focus: 'Porcelain Veneers, Minimally Invasive Composite Artistry, In-Office Whitening, Smile Symmetry',
      bio: 'Dr. Mira Kapoor looks at smile design through an architectural lens — matching tooth form, facial proportions, and skin tone to achieve subtle, lifelike results. She avoids cookie-cutter "white blocks" in favor of natural light reflection, texture, and individual personality.',
      dropdownVal: 'Dr. Mira Kapoor (Cosmetic & Aesthetics)'
    },
    'arjun': {
      name: 'Dr. Arjun Rao',
      title: 'BDS, MDS — Prosthodontics & Oral Implantology',
      role: 'Senior Consultant Implantologist & Prosthodontist',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80',
      education: 'BDS (2010), MDS Prosthodontics (2014), Fellow of International Congress of Oral Implantologists (Demo Data)',
      focus: 'Guided Dental Implants, Full-Arch Fixed Restorations, Zirconia Crowns & Bridges, Complex Occlusion',
      bio: 'With over a decade of restorative practice represented in this demo, Dr. Arjun Rao specializes in replacing missing teeth with biocompatible, functionally durable solutions. His approach centers on computer-guided surgical planning to maximize stability and minimize recovery time.',
      dropdownVal: 'Dr. Arjun Rao (Implants & Prosthodontics)'
    }
  };

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const doctorKey = btn.getAttribute('data-doctor') || 'aanya';
      const data = doctorData[doctorKey];
      if (!data) return;

      document.getElementById('modal-doc-img').src = data.image;
      document.getElementById('modal-doc-name').textContent = data.name;
      document.getElementById('modal-doc-title').textContent = data.title;
      document.getElementById('modal-doc-role').textContent = data.role;
      document.getElementById('modal-doc-education').textContent = data.education;
      document.getElementById('modal-doc-focus').textContent = data.focus;
      document.getElementById('modal-doc-bio').textContent = data.bio;

      // Update CTA in modal to preselect this doctor in booking form
      const bookBtn = document.getElementById('modal-doc-book-btn');
      if (bookBtn) {
        bookBtn.onclick = () => {
          modal.close();
          const docSelect = document.getElementById('apt-doctor');
          if (docSelect) {
            for (let i = 0; i < docSelect.options.length; i++) {
              if (docSelect.options[i].text.includes(data.name)) {
                docSelect.selectedIndex = i;
                break;
              }
            }
          }
          const bookingEl = document.getElementById('booking');
          if (bookingEl) {
            bookingEl.scrollIntoView({ behavior: 'smooth' });
          }
        };
      }

      modal.showModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.close());
  }

  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      modal.close();
    }
  });
}

// Theme Toggle Functionality
(function() {
  'use strict';
  
  // Remove preload class after page loads to enable transitions
  window.addEventListener('load', () => {
    document.body.classList.remove('preload');
  });
  
  // Theme management
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const THEME_KEY = 'ficticiousdev-theme';
  
  // Get initial theme
  function getInitialTheme() {
    // Check HTML attribute first (set in markup for dark mode default)
    const htmlTheme = html.getAttribute('data-theme');
    if (htmlTheme) {
      return htmlTheme;
    }
    
    // Check localStorage second
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    
    // Default to dark
    return 'dark';
  }
  
  // Apply theme
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }
  
  // Toggle theme
  function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }
  
  // Initialize theme
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);
  
  // Add event listener
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
  
  // Mobile menu functionality
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const nav = document.getElementById('nav');
  
  if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
    
    // Close menu when clicking a nav link
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        nav.classList.remove('open');
      }
    });
  }
  
  // Active navigation link highlighting
  function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks.length === 0) return;
    
    const headerOffset = 150; // Threshold below header (80px header + buffer)
    let currentSection = '';
    
    // Check if we are at the bottom of the page
    const isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 10;
    
    if (isAtBottom) {
      const lastHref = navLinks[navLinks.length - 1].getAttribute('href');
      if (lastHref && lastHref.startsWith('#')) {
        currentSection = lastHref.substring(1);
      }
    } else {
      // Find the last section/anchor that has scrolled past the threshold
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        
        const target = document.getElementById(href.substring(1));
        if (!target) return;
        
        const rect = target.getBoundingClientRect();
        // If the top of the target is above the threshold, it is active
        if (rect.top <= headerOffset) {
          currentSection = href.substring(1);
        }
      });
    }
    
    // If we haven't scrolled past any section yet, default to the first link's section
    if (!currentSection && navLinks.length > 0) {
      const firstHref = navLinks[0].getAttribute('href');
      if (firstHref && firstHref.startsWith('#')) {
        currentSection = firstHref.substring(1);
      }
    }
    
    // Update active states
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
  
  // Throttle function for performance
  function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Update active link on scroll
  window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
  
  // Update on page load
  updateActiveNavLink();
  
  // Smooth scroll for navigation links (fallback for older browsers)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      
      // Immediately update active state
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
      });
      if (this.classList.contains('nav-link')) {
        this.classList.add('active');
      }
      
      const target = document.querySelector(href);
      if (target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
})();

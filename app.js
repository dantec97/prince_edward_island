// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('nav a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = 80;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Combined observer for better performance
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const combinedObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Handle lazy loading
                if (element.hasAttribute('data-src')) {
                    element.src = element.dataset.src;
                    element.classList.remove('lazy');
                    element.classList.add('loaded');
                }
                
                // Handle animations
                if (element.classList.contains('animate-section')) {
                    element.classList.add('animate-in');
                } else if (element.classList.contains('gallery-item')) {
                    // Reduce animation delay for smoother feel
                    const index = Array.from(element.parentNode.children).indexOf(element);
                    element.style.animationDelay = `${Math.min(index * 0.05, 0.5)}s`;
                    element.classList.add('animate-gallery-item');
                }
                
                combinedObserver.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe all elements that need lazy loading or animation
    const elementsToObserve = [
        ...document.querySelectorAll('img[data-src]'),
        ...document.querySelectorAll('.quote-section, .about, .gallery, .contact'),
        ...document.querySelectorAll('.gallery-item')
    ];
    
    document.querySelectorAll('.quote-section, .about, .gallery, .contact').forEach(section => {
        section.classList.add('animate-section');
    });
    
    elementsToObserve.forEach(element => {
        combinedObserver.observe(element);
    });
    
    // Gallery lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close');
    
    document.addEventListener('click', function(e) {
        if (e.target.closest('.gallery-item img')) {
            const img = e.target;
            lightbox.style.display = 'block';
            lightboxImg.src = img.src || img.dataset.src;
            lightboxCaption.textContent = img.alt;
        }
    });
    
    closeBtn?.addEventListener('click', () => lightbox.style.display = 'none');
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.style.display = 'none';
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            lightbox.style.display = 'none';
        }
    });
    
    console.log("PEI vacation home website loaded!");
});
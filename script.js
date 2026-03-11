/**
 * 1. Sticky Header Logic
 * The prompt requires: "appears on scroll down and disappears on scroll up"
 * Meaning: Scroll Down = Show Header. Scroll Up = Hide Header.
 */
const header = document.getElementById('main-header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Only apply the effect after scrolling past 100px so it isn't jarring at the very top
    if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
            // Scrolling DOWN -> Header should APPEAR
            header.classList.add('sticky-visible');
            header.classList.remove('sticky-hidden');
        } else {
            // Scrolling UP -> Header should DISAPPEAR
            header.classList.add('sticky-hidden');
            header.classList.remove('sticky-visible');
        }
    } else {
        // At the very top, always show standard header
        header.classList.remove('sticky-hidden');
        header.classList.remove('sticky-visible');
    }
    
    lastScrollY = currentScrollY;
});


/**
 * 2. Carousel Logic
 * Moves cards horizontally when arrows are clicked.
 */
const track = document.getElementById('carousel-track');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');

let currentIndex = 0;

function getMaxIndex() {
    const totalCards = document.querySelectorAll('.carousel-card').length;
    let visibleCards = 3;
    
    if (window.innerWidth <= 1024) visibleCards = 2;
    if (window.innerWidth <= 768) visibleCards = 1;
    
    return Math.max(0, totalCards - visibleCards);
}

function updateCarousel() {
    const card = document.querySelector('.carousel-card');
    if (!card) return;
    
    // Get gap from computed styles
    const trackStyle = window.getComputedStyle(track);
    const gap = parseFloat(trackStyle.gap) || 0;
    
    // Calculate total shift amount
    const shift = currentIndex * (card.offsetWidth + gap);
    track.style.transform = `translateX(-${shift}px)`;
}

nextBtn.addEventListener('click', () => {
    const maxIndex = getMaxIndex();
    if (currentIndex < maxIndex) {
        currentIndex++;
    } else {
        currentIndex = 0; // Loop back
    }
    updateCarousel();
});

prevBtn.addEventListener('click', () => {
    const maxIndex = getMaxIndex();
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = maxIndex; // Loop back to end
    }
    updateCarousel();
});

// Update on resize to fix any layout breaking
window.addEventListener('resize', () => {
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
    }
    updateCarousel();
});


/**
 * 3. FAQ Accordion Logic
 */
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        const answer = question.nextElementSibling;
        
        // Close all other accordions (Optional but creates a cleaner UX)
        faqQuestions.forEach(q => {
            q.setAttribute('aria-expanded', 'false');
            q.nextElementSibling.style.maxHeight = null;
        });

        // Toggle the clicked accordion
        if (!isExpanded) {
            question.setAttribute('aria-expanded', 'true');
            // scrollHeight gets the full natural height of the element
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});

/**
 * 4. Intersection Observer for Scroll Animations
 */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Animate once
        }
    });
}, {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
});

revealElements.forEach(el => revealObserver.observe(el));

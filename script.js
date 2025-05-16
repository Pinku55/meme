document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll-triggered Fade-in Animation ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null, // observes intersections relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible (adjust as needed)
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    animatedElements.forEach(el => {
        // Optionally delay adding to observer for initial above-the-fold content
        // or check if already visible on load for those elements.
        // For simplicity, we observe all.
        scrollObserver.observe(el);
    });

    // --- Smooth scrolling for navigation links ---
    const navLinks = document.querySelectorAll('header nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Use browser's built-in smooth scrolling if available,
                    // otherwise JS will handle it if `html { scroll-behavior: smooth; }` is not set
                    // or not supported.
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });

                    // Update active class on nav link
                    navLinks.forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });

    // --- Optional: Set active nav link on scroll ---
    const sections = document.querySelectorAll('main section[id]'); // Get all sections with an ID

    functionsetActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Adjust offset if you have a sticky header
            const headerOffset = document.querySelector('header')?.offsetHeight || 0;
            if (pageYOffset >= sectionTop - headerOffset - 50) { // 50px buffer
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
         // Default to roadmap if nothing else is active (as per initial HTML)
        if (!current && document.querySelector('nav ul li a.active') === null) {
             const roadmapLink = document.querySelector('nav ul li a[href="#roadmap"]');
             if(roadmapLink) roadmapLink.classList.add('active');
        }
    }
    window.addEventListener('scroll', setActiveLink);
    setActiveLink(); // Call on load


    // --- Copy Token Address Function ---
    // Ensure this is globally accessible if called via onclick
    window.copyAddress = function() {
        const addressSpan = document.getElementById('tokenAddressVal');
        if (!addressSpan) {
            console.error("Element with ID 'tokenAddressVal' not found.");
            alert('Error: Could not find token address element.');
            return;
        }
        const address = addressSpan.innerText;
        navigator.clipboard.writeText(address).then(() => {
            // Simple visual feedback
            const originalButtonText = 'Copy'; // Or icon
            const copyButton = document.querySelector('.copy-btn'); // Assuming only one
            if (copyButton) {
                copyButton.innerHTML = '<i class="fas fa-check"></i>'; // Show checkmark
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="far fa-copy"></i>'; // Revert to copy icon
                }, 1500);
            } else {
                alert('Token address copied to clipboard!');
            }
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy address. Please try manually.');
        });
    }

});

/* ================================================================
   SCRIPT.JS — Consent & Care Infographic
   UH Mānoa × PAU Violence Prevention Program
   ================================================================

   TABLE OF CONTENTS
   -----------------
   1. Custom Cursor
   2. Scroll-Reveal Animations
   3. Animated Counters
   4. Parallax Blobs
   ================================================================ */


/* ---------------------------------------------------------------
   1. CUSTOM CURSOR
   Follows the mouse with a dot + trailing ring for visual flair.
   --------------------------------------------------------------- */
(function initCursor() {
    var dot  = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');

    var mouseX = 0;
    var mouseY = 0;
    var ringX  = 0;
    var ringY  = 0;

    /* Move the dot instantly to the mouse position */
    document.addEventListener('mousemove', function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';
    });

    /* Animate the ring with a slight lag for a smooth trailing effect */
    function animateRing() {
        ringX += (mouseX - ringX) * 0.13;
        ringY += (mouseY - ringY) * 0.13;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    /* Enlarge cursor when hovering interactive or card elements */
    var hoverTargets = document.querySelectorAll(
        'a, .fries-card, .tip-card, .resource-card, .stat-card, .myth-card, .barrier-visual'
    );

    hoverTargets.forEach(function (element) {
        element.addEventListener('mouseenter', function () {
            dot.style.transform  = 'translate(-50%, -50%) scale(2.2)';
            ring.style.width     = '56px';
            ring.style.height    = '56px';
        });

        element.addEventListener('mouseleave', function () {
            dot.style.transform  = 'translate(-50%, -50%) scale(1)';
            ring.style.width     = '38px';
            ring.style.height    = '38px';
        });
    });
})();


/* ---------------------------------------------------------------
   2. SCROLL-REVEAL ANIMATIONS
   Uses IntersectionObserver to add a "visible" class when
   elements enter the viewport.
   --------------------------------------------------------------- */
(function initScrollReveal() {
    var animatedElements = document.querySelectorAll('[data-animate]');

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.13,
        rootMargin: '0px 0px -30px 0px'
    });

    animatedElements.forEach(function (element) {
        observer.observe(element);
    });
})();


/* ---------------------------------------------------------------
   3. ANIMATED COUNTERS
   When a stat card becomes visible, its counter animates from
   0 to the target value with an ease-out curve.
   --------------------------------------------------------------- */
(function initCounters() {
    var counterElements = document.querySelectorAll('.counter');
    var ANIMATION_DURATION = 1600; /* milliseconds */

    var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            var counterEl = entry.target;

            /* Prevent re-animating */
            if (counterEl.dataset.done) return;
            counterEl.dataset.done = 'true';

            var targetValue = parseInt(counterEl.dataset.target, 10);
            var startTime   = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;

                var elapsed  = timestamp - startTime;
                var progress = Math.min(elapsed / ANIMATION_DURATION, 1);

                /* Ease-out cubic curve */
                var eased = 1 - Math.pow(1 - progress, 3);

                counterEl.textContent = Math.round(eased * targetValue);

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counterEl.textContent = targetValue;
                }
            }

            requestAnimationFrame(step);
        });
    }, {
        threshold: 0.3
    });

    counterElements.forEach(function (element) {
        counterObserver.observe(element);
    });
})();


/* ---------------------------------------------------------------
   4. PARALLAX BLOBS
   Moves background blobs at different rates on scroll for
   a subtle depth effect in the hero section.
   --------------------------------------------------------------- */
(function initParallax() {
    var blobs = document.querySelectorAll('.hero-blob');

    window.addEventListener('scroll', function () {
        var scrollY = window.scrollY;

        blobs.forEach(function (blob, index) {
            var speed = 0.05 + (index * 0.02);
            blob.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
        });
    }, { passive: true });
})();

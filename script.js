document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    const logoLink = document.querySelector('.nav-logo');


    function handleNavClick(event) {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        const currentSection = document.querySelector('.page-section.visible');

        // Do nothing if clicking the currently visible page's link
        if (!targetSection || targetSection === currentSection) {
            return;
        }

        // Update nav link active states immediately for instant feedback
        navLinks.forEach(link => link.classList.remove('active'));
        const newActiveLink = document.querySelector(`.nav-link[href="${targetId}"]`);
        if (newActiveLink) {
            newActiveLink.classList.add('active');
        }

        // Animate out the current section
        if (currentSection) {
            currentSection.classList.add('page-exit');

            // wait for the exit animation to finish
            setTimeout(() => {
                currentSection.classList.remove('visible', 'page-exit');

                // Animate the new section
                targetSection.classList.add('visible', 'page-enter');

                // Clean up the enter animation class after it's done
                setTimeout(() => {
                    targetSection.classList.remove('page-enter');
                }, 500); // equal to .page-enter animation time

            }, 400); // equal to .page-exit animation time
        } else {
            targetSection.classList.add('visible');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    if(logoLink) {
        logoLink.addEventListener('click', handleNavClick);
    }

    // Show the initial '#home' section when the page loads
    const initialSection = document.querySelector('#home');
    const initialLink = document.querySelector('.nav-link[href="#home"]');
    if (initialSection) {
        initialSection.classList.add('visible');
    }
    if(initialLink) {
        initialLink.classList.add('active');
    }


    // --- interactive canbas ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        const PARTICLE_COUNT = 80;
        const PARTICLE_COLOR = '#00c896';
        const LINE_COLOR = 'rgba(0, 200, 150, 0.2)';

        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            setCanvasSize();
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                let size = Math.random() * 2 + 1;
                let x = Math.random() * (innerWidth - size * 2) + size;
                let y = Math.random() * (innerHeight - size * 2) + size;
                let directionX = (Math.random() * .4) - .2;
                let directionY = (Math.random() * .4) - .2;
                particles.push(new Particle(x, y, directionX, directionY, size, PARTICLE_COLOR));
            }
        }

        function connect() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                                 + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        ctx.strokeStyle = LINE_COLOR;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            particles.forEach(p => p.update());
            connect();
        }
        
        window.addEventListener('resize', init);
        
        init();
        animate();
    }
});
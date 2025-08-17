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

     // --- CHATBOT LOGIC ---
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeBtn = document.getElementById('chat-close');
    const messagesContainer = document.getElementById('chat-messages');
    const optionsContainer = document.getElementById('chat-options');

    // --- DIALOGUE DATA ---
    // Easy to edit all bot dialogue in one place
    const dialogue = {
        greeting: {
            text: "Hello. I'm And-droid, an interactive assistant for Andrea Berra's portfolio. I can provide key highlights of his profile. How can I help you?",
            options: [
                { text: "View Technical Skills", next: "skills_overview" },
                { text: "View Key Projects", next: "projects_overview" },
                { text: "View Contact Info", next: "contact" }
            ]
        },
        skills_overview: {
            text: "Core Skills: C++, Python, ROS/ROS2, PX4, Gazebo.\nFocus: Full-stack development for autonomous aerial systems.",
            options: [
                { text: "More on his C++/ROS work", next: "skills_core_tech" },
                { text: "Tell me about his projects", next: "projects_overview" },
                { text: "Return to main menu", next: "main_questions" }
            ]
        },
        skills_core_tech: {
            text: "He uses C++ within ROS2 for performance-critical tasks like control and estimation, ensuring system reliability. The Omniquad project demonstrates this application.",
            options: [
                { text: "Tell me about Omniquad", next: "projects_omniquad" },
                { text: "Return to main menu", next: "main_questions" }
            ]
        },
        projects_overview: {
            text: "Key projects are Omniquad (advanced drone control) and GIN (AI perception). Which would you like details on?",
            options: [
                { text: "Omniquad Details", next: "projects_omniquad" },
                { text: "GIN Details", next: "projects_gin" },
                { text: "Return to main menu", next: "main_questions" }
            ]
        },
        projects_omniquad: {
            text: "Omniquad is a full framework for omnidirectional drones. It showcases his management of a complex stack including C++, ROS2, PX4, and Gazebo simulation.",
            options: [
                { text: "What about the GIN project?", next: "projects_gin" },
                { text: "Recap his skills", next: "skills_overview" },
                { text: "Return to main menu", next: "main_questions" }
            ]
        },
        projects_gin: {
             text: "GIN is a lightweight AI target tracker (Python/YOLO) for resource-constrained hardware. It highlights his skill in deploying efficient perception systems.",
             options: [
                { text: "Tell me about Omniquad again", next: "projects_omniquad" },
                { text: "How can I contact him?", next: "contact" },
                { text: "Return to main menu", next: "main_questions" }
            ]
        },
        contact: {
            text: "Contact via email (andrea.berra@outlook.com) or LinkedIn (linkedin.com/in/andrea-berra/).",
            options: [
                { text: "Ask another question", next: "main_questions" },
                { text: "That is all, thank you.", next: "end" }
            ]
        },
        main_questions: {
             text: "Main menu. What is your next query?",
             options: [
                { text: "Technical Skills", next: "skills_overview" },
                { text: "Key Projects", next: "projects_overview" },
                { text: "Contact Info", next: "contact" }
            ]
        },
        end: {
            text: "You're welcome. Session terminated.",
            options: []
        }
    };

    // --- HELPER FUNCTIONS ---

    // Adds a message bubble to the chat
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}-message`;
        messageElement.textContent = text;
        messagesContainer.appendChild(messageElement);
        // Scroll to the latest message
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Displays the typing indicator
    function showTypingIndicator() {
        messagesContainer.innerHTML += `
            <div class="typing-indicator" id="typing-indicator">
                <span></span><span></span><span></span>
            </div>`;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Removes the typing indicator
    function hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    // Shows a set of option buttons
    function showOptions(options) {
        optionsContainer.innerHTML = '';
        if (options.length === 0) return;

        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'chat-option-btn';
            button.textContent = option.text;
            button.dataset.next = option.next;
            optionsContainer.appendChild(button);
        });
    }

    // --- CORE LOGIC ---
    function handleOptionClick(e) {
        if (!e.target.matches('.chat-option-btn')) return;

        const selectedOption = e.target;
        const nextNodeKey = selectedOption.dataset.next;
        
        // 1. Display user's choice
        addMessage(selectedOption.textContent, 'user');
        
        // 2. Clear options and show typing indicator
        optionsContainer.innerHTML = '';
        showTypingIndicator();

        // 3. Simulate bot thinking and then respond
        setTimeout(() => {
            hideTypingIndicator();
            const responseNode = dialogue[nextNodeKey];
            if (responseNode) {
                addMessage(responseNode.text, 'bot');
                showOptions(responseNode.options);
            }
        }, 1500); // 1.5 second delay for "thinking"
    }

    function openChat() {
        chatWindow.classList.add('open');
        // Initial greeting if chat is empty
        if (messagesContainer.children.length === 0) {
            setTimeout(() => {
                const greetingNode = dialogue.greeting;
                addMessage(greetingNode.text, 'bot');
                showOptions(greetingNode.options);
            }, 500);
        }
    }

    function closeChat() {
        chatWindow.classList.remove('open');
    }

    // --- EVENT LISTENERS ---
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.contains('open') ? closeChat() : openChat();
    });
    closeBtn.addEventListener('click', closeChat);
    optionsContainer.addEventListener('click', handleOptionClick);
});
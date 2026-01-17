document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTORS (Defined once at the top) ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    const logoLink = document.querySelector('.nav-logo');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const timelineLinks = document.querySelectorAll('.timeline-link'); // <-- 1. FIX ADDED HERE


    // --- robot mobile menu Logic---
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
        });

        const menuLinks = navMenu.querySelectorAll('.nav-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show-menu');
            });
        });
    }


    // --- PAGE NAVIGATION & TRANSITION LOGIC ---
    function handleNavClick(event) {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        const currentSection = document.querySelector('.page-section.visible');

        if (!targetSection || targetSection === currentSection) {
            return;
        }

        navLinks.forEach(link => link.classList.remove('active'));
        const newActiveLink = document.querySelector(`.nav-link[href="${targetId}"]`);
        if (newActiveLink) {
            newActiveLink.classList.add('active');
        }

        if (currentSection) {
            currentSection.classList.add('page-exit');
            setTimeout(() => {
                currentSection.classList.remove('visible', 'page-exit');
                targetSection.classList.add('visible', 'page-enter');
                setTimeout(() => {
                    targetSection.classList.remove('page-enter');
                }, 500);
            }, 400);
        } else {
            targetSection.classList.add('visible');
        }
    }

    // handle clicks from the "Latest Updates" section
    function handleTimelineLinkClick(event) {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href'); // e.g., "#pub-icuas25"
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        const targetSection = targetElement.closest('.page-section');
        const currentSection = document.querySelector('.page-section.visible');
        const headerHeight = document.querySelector('header').offsetHeight;

        // Function to perform the scroll
        const scrollToTarget = () => {
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        };

        if (targetSection && targetSection !== currentSection) {
            navLinks.forEach(link => link.classList.remove('active'));
            const newActiveLink = document.querySelector(`.nav-link[href="#${targetSection.id}"]`);
            if (newActiveLink) {
                newActiveLink.classList.add('active');
            }

            // Start the exit animation for the current section
            if (currentSection) {
                currentSection.classList.add('page-exit');
            }

            // After the exit animation, switch sections and scroll
            setTimeout(() => {
                if (currentSection) {
                    currentSection.classList.remove('visible', 'page-exit');
                }
                targetSection.classList.add('visible', 'page-enter');
                
                // Scroll to the element immediately after the new section is made visible
                scrollToTarget();

                // Clean up the enter animation class
                setTimeout(() => {
                    targetSection.classList.remove('page-enter');
                }, 500);
            }, 400);
        } 
        // just need to scroll.
        else {
            scrollToTarget();
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    if(logoLink) {
        logoLink.addEventListener('click', handleNavClick);
    }
    
    // --- 3. FIX ADDED HERE ---
    // Assign the new, correct function to the timeline links
    timelineLinks.forEach(link => {
        link.addEventListener('click', handleTimelineLinkClick);
    });
    // --- END OF THE FIX ---


    // --- INITIAL PAGE LOAD ---
    const initialSection = document.querySelector('#home');
    const initialLink = document.querySelector('.nav-link[href="#home"]');
    if (initialSection) {
        initialSection.classList.add('visible');
    }
    if(initialLink) {
        initialLink.classList.add('active');
    }


    // --- STATIC ROBOTICS BACKGROUND ---
    // No animated dots. Optionally, you can add a static SVG or image background in CSS.

     // --- CHATBOT LOGIC ---
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeBtn = document.getElementById('chat-close');
    const messagesContainer = document.getElementById('chat-messages');
    const optionsContainer = document.getElementById('chat-options');
    const dialogue = {
        greeting: { text: "Hello. I'm And-droid, an interactive assistant for Andrea Berra's portfolio. I can provide key highlights of his profile. How can I help you?", options: [ { text: "View Technical Skills", next: "skills_overview" }, { text: "View Key Projects", next: "projects_overview" }, { text: "View Contact Info", next: "contact" } ] },
        skills_overview: { text: "Core Skills: C++, Python, ROS/ROS2, PX4, Gazebo.\nFocus: Full-stack development for autonomous aerial systems.", options: [ { text: "More on his C++/ROS work", next: "skills_core_tech" }, { text: "Tell me about his projects", next: "projects_overview" }, { text: "Return to main menu", next: "main_questions" } ] },
        skills_core_tech: { text: "He uses C++ within ROS2 for performance-critical tasks like control and estimation, ensuring system reliability. The Omniquad project demonstrates this application.", options: [ { text: "Tell me about Omniquad", next: "projects_omniquad" }, { text: "Return to main menu", next: "main_questions" } ] },
        projects_overview: { text: "Key projects are Omniquad (advanced drone control) and GIN (AI perception). Which would you like details on?", options: [ { text: "Omniquad Details", next: "projects_omniquad" }, { text: "GIN Details", next: "projects_gin" }, { text: "Return to main menu", next: "main_questions" } ] },
        projects_omniquad: { text: "Omniquad is a full framework for omnidirectional drones. It showcases his management of a complex stack including C++, ROS2, PX4, and Gazebo simulation.", options: [ { text: "What about the GIN project?", next: "projects_gin" }, { text: "Recap his skills", next: "skills_overview" }, { text: "Return to main menu", next: "main_questions" } ] },
        projects_gin: { text: "GIN is a lightweight AI target tracker (Python/YOLO) for resource-constrained hardware. It highlights his skill in deploying efficient perception systems.", options: [ { text: "Tell me about Omniquad again", next: "projects_omniquad" }, { text: "How can I contact him?", next: "contact" }, { text: "Return to main menu", next: "main_questions" } ] },
        contact: { text: "Contact via email (andrea.berra@outlook.com) or LinkedIn (linkedin.com/in/andrea-berra/).", options: [ { text: "Ask another question", next: "main_questions" }, { text: "That is all, thank you.", next: "end" } ] },
        main_questions: { text: "Main menu. What is your next query?", options: [ { text: "Technical Skills", next: "skills_overview" }, { text: "Key Projects", next: "projects_overview" }, { text: "Contact Info", next: "contact" } ] },
        end: { text: "You're welcome. Session terminated.", options: [] }
    };
    function addMessage(text, sender) { const messageElement = document.createElement('div'); messageElement.className = `chat-message ${sender}-message`; messageElement.textContent = text; messagesContainer.appendChild(messageElement); messagesContainer.scrollTop = messagesContainer.scrollHeight; }
    function showTypingIndicator() { messagesContainer.innerHTML += `<div class="typing-indicator" id="typing-indicator"><span></span><span></span><span></span></div>`; messagesContainer.scrollTop = messagesContainer.scrollHeight; }
    function hideTypingIndicator() { const indicator = document.getElementById('typing-indicator'); if (indicator) indicator.remove(); }
    function showOptions(options) { optionsContainer.innerHTML = ''; if (options.length === 0) return; options.forEach(option => { const button = document.createElement('button'); button.className = 'chat-option-btn'; button.textContent = option.text; button.dataset.next = option.next; optionsContainer.appendChild(button); }); }
    function handleOptionClick(e) { if (!e.target.matches('.chat-option-btn')) return; const selectedOption = e.target; const nextNodeKey = selectedOption.dataset.next; addMessage(selectedOption.textContent, 'user'); optionsContainer.innerHTML = ''; showTypingIndicator(); setTimeout(() => { hideTypingIndicator(); const responseNode = dialogue[nextNodeKey]; if (responseNode) { addMessage(responseNode.text, 'bot'); showOptions(responseNode.options); } }, 1500); }
    function openChat() { chatWindow.classList.add('open'); if (messagesContainer.children.length === 0) { setTimeout(() => { const greetingNode = dialogue.greeting; addMessage(greetingNode.text, 'bot'); showOptions(greetingNode.options); }, 500); } }
    function closeChat() { chatWindow.classList.remove('open'); }
    chatToggle.addEventListener('click', () => { chatWindow.classList.contains('open') ? closeChat() : openChat(); });
    closeBtn.addEventListener('click', closeChat);
    optionsContainer.addEventListener('click', handleOptionClick);
});
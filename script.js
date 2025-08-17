document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    const logoLink = document.querySelector('.nav-logo');

    // --- Function to show a section and hide others ---
    function showSection(targetId) {
        sections.forEach(section => {
            section.classList.remove('visible');
        });
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.classList.add('visible');
        }
    }

    // Function to handle navigation click
    function handleNavClick(event) {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
        showSection(targetId);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    if(logoLink) {
        logoLink.addEventListener('click', handleNavClick);
    }

    // Show the initial '#home' section when the page loads
    showSection('#home');
});
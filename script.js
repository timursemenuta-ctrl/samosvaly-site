/**
 * Rent App Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 3. Web3Forms Submission Logic (Оновлена відправка на пошту)
    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(leadForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            // Знаходимо кнопку і змінюємо текст на час відправки
            const submitBtn = leadForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Відправка...";
            submitBtn.disabled = true;

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });

                const result = await response.json();

                if (response.status === 200) {
                    // Успішна відправка
                    alert("Дякуємо! Ваша заявка успішно надіслана. Ми зв'яжемося з вами найближчим часом.");
                    leadForm.reset(); // Очищуємо поля форми
                } else {
                    // Помилка від сервісу
                    alert("Помилка: " + result.message);
                }
            } catch (error) {
                console.log(error);
                alert("Щось пішло не так. Перевірте підключення до інтернету.");
            } finally {
                // Повертаємо кнопку в робочий стан
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // 4. Smooth Scroll for CTA buttons
    const ctaButtons = document.querySelectorAll('[data-scroll-to]');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('data-scroll-to');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 5. Active Link Highlighting
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a, #mobile-menu a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('text-orange-600', 'font-bold');
            link.classList.remove('text-gray-700', 'font-medium');
        }
    });
});

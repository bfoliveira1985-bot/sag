// ============================================================================
// STRIPE CONFIGURATION
// ============================================================================
// IMPORTANT: Replace these values with your actual Stripe credentials
// Get your keys from: https://dashboard.stripe.com/apikeys
// 
// For testing, use test keys (pk_test_...)
// For production, use live keys (pk_live_...)
// 
// DO NOT commit live keys to version control!
// Consider using environment variables or a config file (gitignored)
// ============================================================================

// Initialize Stripe (replace with your publishable key)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE';

// Only initialize Stripe if key is configured and valid
let stripe = null;
const stripeKeyPattern = /^pk_(test|live)_[a-zA-Z0-9]+$/;
if (STRIPE_PUBLISHABLE_KEY && stripeKeyPattern.test(STRIPE_PUBLISHABLE_KEY)) {
    try {
        stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
    } catch (error) {
        console.error('Failed to initialize Stripe:', error);
    }
}

// Price IDs for each plan (replace with your actual Stripe Price IDs)
// Create products and prices at: https://dashboard.stripe.com/products
const PRICING_PLANS = {
    basic: 'price_BASIC_PLAN_ID',
    professional: 'price_PROFESSIONAL_PLAN_ID',
    enterprise: 'price_ENTERPRISE_PLAN_ID'
};

// DOM Elements
const loadingOverlay = document.getElementById('loading-overlay');
const pricingButtons = document.querySelectorAll('[data-plan]');
const faqItems = document.querySelectorAll('.faq-item');

// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// Billing Toggle (Monthly/Annual)
const billingToggle = document.getElementById('billing-toggle');
if (billingToggle) {
    billingToggle.addEventListener('change', () => {
        const monthlyPrices = document.querySelectorAll('.monthly-price');
        const annualPrices = document.querySelectorAll('.annual-price');
        
        if (billingToggle.checked) {
            // Show annual prices
            monthlyPrices.forEach(el => el.style.display = 'none');
            annualPrices.forEach(el => el.style.display = 'inline');
        } else {
            // Show monthly prices
            monthlyPrices.forEach(el => el.style.display = 'inline');
            annualPrices.forEach(el => el.style.display = 'none');
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// FAQ Toggle
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        // Close other open items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        // Toggle current item
        item.classList.toggle('active');
    });
});

// Stripe Checkout Integration
pricingButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const plan = button.getAttribute('data-plan');
        
        // Special handling for enterprise plan
        if (plan === 'enterprise') {
            handleEnterpriseContact();
            return;
        }
        
        await handleCheckout(plan);
    });
});

// Handle Stripe Checkout
async function handleCheckout(plan) {
    try {
        // Check if Stripe is initialized
        if (!stripe) {
            hideLoading();
            showConfigurationMessage();
            return;
        }
        
        // Show loading overlay
        showLoading();
        
        const priceId = PRICING_PLANS[plan];
        
        // Validate Stripe Price ID format (should be price_xxxxx)
        const priceIdPattern = /^price_[a-zA-Z0-9_]+$/;
        if (!priceId || !priceIdPattern.test(priceId)) {
            hideLoading();
            showConfigurationMessage();
            return;
        }
        
        // Create Checkout Session
        // In production, this should call your backend API
        // Example: const response = await fetch('/api/create-checkout-session', { ... })
        
        // For now, redirect to Stripe Checkout with the price ID
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            successUrl: `${window.location.origin}${window.location.pathname.replace('index.html', '')}success.html`,
            cancelUrl: window.location.href,
        });
        
        if (error) {
            console.error('Stripe Checkout error:', error);
            showErrorModal('Erro ao conectar com o sistema de pagamento. Por favor, tente novamente em alguns instantes.');
        }
        
        hideLoading();
    } catch (error) {
        console.error('Checkout error:', error);
        hideLoading();
        showErrorModal('Não foi possível processar o pagamento. Verifique sua conexão e tente novamente.');
    }
}

// Handle Enterprise Contact
function handleEnterpriseContact() {
    // You can customize this to open a contact form or redirect to a contact page
    const email = 'contato@stopandgobr.com';
    const subject = 'Interesse no Plano Enterprise';
    const body = 'Olá, tenho interesse no plano Enterprise do plugin Stop and Go BR.';
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Show error modal for better UX
function showErrorModal(message) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        max-width: 400px;
        z-index: 10000;
        text-align: center;
    `;
    modal.innerHTML = `
        <div style="
            width: 60px;
            height: 60px;
            margin: 0 auto 1rem;
            background: #fee;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
        ">⚠️</div>
        <h3 style="color: #e63946; margin-bottom: 1rem;">Ops!</h3>
        <p style="margin-bottom: 1.5rem; line-height: 1.6;">${message}</p>
        <button onclick="this.parentElement.remove()" style="
            background: #e63946;
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 50px;
            cursor: pointer;
            font-weight: 600;
        ">Entendi</button>
    `;
    document.body.appendChild(modal);
}

// Show configuration message when Stripe is not set up
function showConfigurationMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        max-width: 500px;
        z-index: 10000;
        text-align: left;
    `;
    message.innerHTML = `
        <h3 style="color: #e63946; margin-bottom: 1rem;">⚙️ Configuração Necessária</h3>
        <p style="margin-bottom: 1rem;">Para processar pagamentos, você precisa configurar o Stripe:</p>
        <ol style="margin-bottom: 1rem; padding-left: 1.5rem; line-height: 1.8;">
            <li>Obtenha suas chaves em:<br><a href="https://dashboard.stripe.com/apikeys" target="_blank" style="color: #457b9d;">dashboard.stripe.com/apikeys</a></li>
            <li>Crie produtos em:<br><a href="https://dashboard.stripe.com/products" target="_blank" style="color: #457b9d;">dashboard.stripe.com/products</a></li>
            <li>Atualize o arquivo script.js</li>
        </ol>
        <p style="margin-bottom: 1rem;">Consulte <strong>CONFIGURACAO.md</strong> para instruções detalhadas.</p>
        <button onclick="this.parentElement.remove()" style="
            background: #e63946;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 50px;
            cursor: pointer;
            font-weight: 600;
            width: 100%;
        ">Entendi</button>
    `;
    document.body.appendChild(message);
}

// Loading overlay controls
function showLoading() {
    loadingOverlay.classList.add('active');
}

function hideLoading() {
    loadingOverlay.classList.remove('active');
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .gallery-item, .pricing-card, .benefit-item, .faq-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Add parallax effect to hero section (with throttling)
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Contact button handler
const contactBtn = document.getElementById('contact-btn');
if (contactBtn) {
    contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = 'contato@stopandgobr.com';
        const subject = 'Contato - Plugin Stop and Go BR';
        const body = 'Olá, gostaria de mais informações sobre o plugin.';
        
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}

// Add active class to navigation on scroll (with throttling)
let navTicking = false;
window.addEventListener('scroll', () => {
    if (!navTicking) {
        window.requestAnimationFrame(() => {
            const sections = document.querySelectorAll('section[id]');
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelectorAll(`a[href="#${sectionId}"]`).forEach(link => {
                        link.classList.add('active');
                    });
                } else {
                    document.querySelectorAll(`a[href="#${sectionId}"]`).forEach(link => {
                        link.classList.remove('active');
                    });
                }
            });
            navTicking = false;
        });
        navTicking = true;
    }
});

// Performance optimization: Lazy load images when implemented
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add hover effect sound (optional - disabled by default)
// Uncomment to enable button click sounds
/*
function playClickSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBiuBzPLTizcIHmm98OefTgwOUKXh8LdjHAU7k9nyz3kvBSl+zPLaizsKGGS69+mjUBELTKXk875sIAYuhM/y1Ys4CBVZ');
    audio.volume = 0.2;
    audio.play();
}

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', playClickSound);
});
*/

console.log('🏁 Stop and Go BR Plugin - Landing Page Loaded');
console.log('📝 Para configurar pagamentos via Stripe:');
console.log('   1. Atualize STRIPE_PUBLISHABLE_KEY com sua chave pública');
console.log('   2. Atualize PRICING_PLANS com seus Price IDs do Stripe');
console.log('   3. Configure o backend para criar sessões de checkout (recomendado)');

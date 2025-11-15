// ========================================
// 全局变量
// ========================================

let currentLang = 'zh'; // 默认中文

// ========================================
// 导航栏滚动效果
// ========================================

const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    updateActiveNavLink();
});

// ========================================
// 移动端导航菜单切换
// ========================================

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ========================================
// 中英文语言切换
// ========================================

const langToggle = document.getElementById('langToggle');
const langOptions = document.querySelectorAll('.lang-option');

langToggle.addEventListener('click', () => {
    // 切换语言
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    switchLanguage(currentLang);
});

langOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation();
        const lang = option.getAttribute('data-lang');
        currentLang = lang;
        switchLanguage(lang);
    });
});

function switchLanguage(lang) {
    // 更新语言按钮状态
    langOptions.forEach(option => {
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // 更新HTML lang属性
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    
    // 更新所有带有data-en和data-zh属性的元素
    const elements = document.querySelectorAll('[data-en][data-zh]');
    elements.forEach(element => {
        const text = lang === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-zh');
        
        // 根据元素类型更新内容
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
        } else {
            element.textContent = text;
        }
    });
    
    // 保存语言偏好到localStorage
    localStorage.setItem('preferredLanguage', lang);
}

// 页面加载时恢复用户的语言偏好
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        currentLang = savedLang;
        switchLanguage(currentLang);
    }
});

// ========================================
// 平滑滚动到锚点
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// 更新当前激活的导航链接
// ========================================

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navbarHeight = navbar.offsetHeight;
    const scrollPosition = window.scrollY + navbarHeight + 100;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ========================================
// 元素可见性动画
// ========================================

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

const animatedElements = document.querySelectorAll('.capability-card, .case-card, .insight-card, .credential-item, .capability-detail-card');

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ========================================
// 联系表单处理
// ========================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonHTML = submitButton.innerHTML;
    
    // 显示发送中状态
    const sendingText = currentLang === 'en' ? 'Sending...' : '发送中...';
    submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${sendingText}`;
    submitButton.disabled = true;
    
    // 模拟表单提交
    setTimeout(() => {
        const successMessage = currentLang === 'en' 
            ? 'Message sent successfully! I will get back to you soon.' 
            : '消息已成功发送！我会尽快回复您。';
        
        showNotification(successMessage, 'success');
        contactForm.reset();
        submitButton.innerHTML = originalButtonHTML;
        submitButton.disabled = false;
    }, 1500);
});

// ========================================
// 通知提示函数
// ========================================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border: 1px solid #E5E5E5;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            .notification-success {
                border-left: 3px solid #48bb78;
            }
            
            .notification-success i {
                color: #48bb78;
                font-size: 1.5rem;
            }
            
            .notification-error {
                border-left: 3px solid #f56565;
            }
            
            .notification-error i {
                color: #f56565;
                font-size: 1.5rem;
            }
            
            .notification span {
                color: #333;
                font-size: 0.95rem;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
            
            @media (max-width: 768px) {
                .notification {
                    top: 80px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ========================================
// 页面加载完成后的初始化
// ========================================

window.addEventListener('load', () => {
    updateActiveNavLink();
    
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ========================================
// 防抖函数
// ========================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedScroll = debounce(() => {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', debouncedScroll);

// ========================================
// 添加返回顶部按钮
// ========================================

const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'back-to-top';
backToTopBtn.setAttribute('aria-label', 'Back to Top');

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// 键盘导航支持
// ========================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    if (e.key === 'Home' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    if (e.key === 'End' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

// ========================================
// 表单修改状态跟踪
// ========================================

let formModified = false;

contactForm.addEventListener('input', () => {
    formModified = true;
});

contactForm.addEventListener('submit', () => {
    formModified = false;
});

window.addEventListener('beforeunload', (e) => {
    if (formModified) {
        e.preventDefault();
        e.returnValue = currentLang === 'en' 
            ? 'You have unsaved form content. Are you sure you want to leave?' 
            : '您有未提交的表单内容，确定要离开吗？';
        return e.returnValue;
    }
});

// ========================================
// 图片懒加载
// ========================================

const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ========================================
// 控制台信息
// ========================================

console.log('%cVivian Wang | 王维', 'color: #000; font-size: 20px; font-weight: bold;');
console.log('%cIndustrial Digitalization Strategist & Capital Operations Partner', 'color: #C5A572; font-size: 14px;');
console.log('%c产业数字化战略专家 & 资本运营合伙人', 'color: #C5A572; font-size: 14px;');

// ========================================
// 平滑的图片加载效果
// ========================================

const profilePhoto = document.querySelector('.profile-photo');
if (profilePhoto) {
    profilePhoto.style.opacity = '0';
    profilePhoto.style.transition = 'opacity 1s ease';
    
    if (profilePhoto.complete) {
        profilePhoto.style.opacity = '1';
    } else {
        profilePhoto.addEventListener('load', () => {
            profilePhoto.style.opacity = '1';
        });
    }
}
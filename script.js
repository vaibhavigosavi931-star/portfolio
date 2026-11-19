// Interactive features for Vaibhavi Gosavi Portfolio
document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    // 1. Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('open');
        });

        // Close menu when clicking any nav link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 2. Scroll Progress Bar, Header Elevation & Active Nav Spy
    const header = document.querySelector('header');
    const progressBar = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a');
    const backToTopBtn = document.getElementById('back-to-top');

    function handleScroll() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        if (progressBar && docHeight > 0) {
            const pct = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
            progressBar.style.width = `${pct}%`;
        }

        if (header) {
            header.classList.toggle('scrolled', scrollY > 24);
        }

        if (backToTopBtn) {
            backToTopBtn.classList.toggle('show', scrollY > 400);
        }

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 130;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
                });
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 3. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // 4. Toast Notification & One-Click Copy to Clipboard
    const toast = document.getElementById('copy-toast');
    let toastTimer = null;

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2400);
    }

    const copyButtons = document.querySelectorAll('[data-copy]');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            const originalLabel = btn.textContent;

            const onCopied = () => {
                showToast(`Copied: ${textToCopy}`);
                btn.textContent = 'Copied ✓';
                setTimeout(() => {
                    btn.textContent = originalLabel;
                }, 1800);
            };

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy).then(onCopied).catch(() => {
                    fallbackCopy(textToCopy, onCopied);
                });
            } else {
                fallbackCopy(textToCopy, onCopied);
            }
        });
    });

    function fallbackCopy(text, onSuccess) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            if (onSuccess) onSuccess();
            else showToast(`Copied: ${text}`);
        } catch (err) {
            showToast('Unable to auto-copy');
        }
        document.body.removeChild(textArea);
    }

    // 5. Dynamic Typewriter Effect for Hero Headline
    const typingSpan = document.getElementById('typing-text');
    if (typingSpan && !prefersReducedMotion) {
        const phrases = [
            "AI & Data Science",
            "Machine Learning",
            "Data Analytics & BI",
            "Deep Learning",
            "Predictive Modeling"
        ];
        let phraseIndex = 0;
        let charIndex = phrases[0].length;
        let isDeleting = true;
        let typingSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typingSpan.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 45;
            } else {
                typingSpan.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 90;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                typingSpeed = 2200;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 420;
            }

            setTimeout(type, typingSpeed);
        }

        setTimeout(type, 2200);
    }

    // 6. Hero Organic Mist & Treeline Mouse + Scroll Parallax
    const heroSection = document.querySelector('.hero');
    const mistLayer = document.querySelector('.layer-mist');
    const pineLayer = document.querySelector('.layer-pine');

    if (heroSection && mistLayer && pineLayer && !prefersReducedMotion) {
        let mouseX = 0;
        let mouseY = 0;

        const applyHorizonTransform = () => {
            const scrollOffset = Math.min(window.pageYOffset || 0, 500);
            mistLayer.style.transform = `translate3d(${mouseX * -14}px, ${mouseY * -6 + scrollOffset * 0.08}px, 0)`;
            pineLayer.style.transform = `translate3d(${mouseX * -24}px, ${mouseY * -10 + scrollOffset * 0.04}px, 0)`;
        };

        if (hasFinePointer) {
            heroSection.addEventListener('mousemove', (e) => {
                const rect = heroSection.getBoundingClientRect();
                mouseX = ((e.clientX - rect.left) / rect.width) - 0.5;
                mouseY = ((e.clientY - rect.top) / rect.height) - 0.5;
                applyHorizonTransform();
            });

            heroSection.addEventListener('mouseleave', () => {
                mouseX = 0;
                mouseY = 0;
                applyHorizonTransform();
            });
        }

        window.addEventListener('scroll', applyHorizonTransform, { passive: true });
    }

    // 7. Animated Hero Stats Count-Up
    const statValues = document.querySelectorAll('.stat-value[data-count]');
    if (statValues.length && !prefersReducedMotion) {
        const animateStat = (el) => {
            const target = parseFloat(el.dataset.count);
            const decimals = parseInt(el.dataset.decimals || '0', 10);
            const suffix = el.dataset.suffix || '';
            const duration = 900;
            const startTime = performance.now();

            const step = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = target * eased;
                el.textContent = `${current.toFixed(decimals)}${suffix}`;
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = `${target.toFixed(decimals)}${suffix}`;
                }
            };

            requestAnimationFrame(step);
        };

        if ('IntersectionObserver' in window) {
            const statObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateStat(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });

            statValues.forEach(el => statObserver.observe(el));
        } else {
            statValues.forEach(animateStat);
        }
    }

    // 8. Interactive Filter Bars (Skills & Certifications)
    function initFilterGroup(groupName, itemSelector) {
        const filterBar = document.querySelector(`.filter-bar[data-filter-group="${groupName}"]`);
        const items = document.querySelectorAll(itemSelector);
        if (!filterBar || !items.length) return;

        const pills = filterBar.querySelectorAll('.filter-pill');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                const selected = pill.dataset.filter;

                pills.forEach(p => {
                    const isActive = p === pill;
                    p.classList.toggle('active', isActive);
                    p.setAttribute('aria-selected', String(isActive));
                });

                items.forEach(item => {
                    const categories = (item.dataset.category || '').split(/\s+/);
                    const matches = selected === 'all' || categories.includes(selected);

                    item.classList.remove('filter-fade-in');
                    if (matches) {
                        item.classList.remove('is-hidden');
                        // Trigger reflow for clean entrance animation
                        void item.offsetWidth;
                        item.classList.add('filter-fade-in');
                    } else {
                        item.classList.add('is-hidden');
                    }
                });
            });
        });
    }

    initFilterGroup('skills', '#skills-grid .skill-tag');
    initFilterGroup('certs', '#cert-grid .cert-card');

    // Interactive Skill Tag Click Feedback (checks mentions across portfolio)
    const skillTags = document.querySelectorAll('#skills-grid .skill-tag');
    const portfolioCards = document.querySelectorAll('#projects .card, #experience .card, #certifications .cert-card');

    skillTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const wasSelected = tag.classList.contains('skill-selected');
            skillTags.forEach(t => t.classList.remove('skill-selected'));

            if (!wasSelected) {
                tag.classList.add('skill-selected');
                const skillName = tag.textContent.trim();
                const needle = skillName.toLowerCase();
                let matches = 0;

                portfolioCards.forEach(card => {
                    if (card.textContent.toLowerCase().includes(needle)) {
                        matches++;
                    }
                });

                if (matches > 0) {
                    showToast(`${skillName} — highlighted in ${matches} portfolio ${matches === 1 ? 'entry' : 'entries'}`);
                } else {
                    showToast(`Core skill: ${skillName}`);
                }
            }
        });
    });

    // 9. Subtle Pointer Spotlight & Micro-Tilt on Cards
    if (hasFinePointer && !prefersReducedMotion) {
        const interactiveCards = document.querySelectorAll('.card, .cert-card, .language-card');
        interactiveCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xPct = (x / rect.width) * 100;
                const yPct = (y / rect.height) * 100;

                card.style.setProperty('--mx', `${xPct}%`);
                card.style.setProperty('--my', `${yPct}%`);

                const rotateY = ((x / rect.width) - 0.5) * 4;
                const rotateX = ((y / rect.height) - 0.5) * -4;
                card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // 10. Interactive In-Page Video Demo Modal
    const videoModal = document.getElementById('video-modal');
    const videoIframe = document.getElementById('video-modal-iframe');
    const videoTitle = document.getElementById('video-modal-title');
    const videoExternal = document.getElementById('video-modal-external');
    const videoTriggers = document.querySelectorAll('.video-demo-trigger');

    function openVideoModal(embedUrl, externalUrl, title) {
        if (!videoModal || !videoIframe) return;
        videoTitle.textContent = title || 'Project Demo';
        videoExternal.href = externalUrl || '#';
        videoIframe.src = embedUrl;
        videoModal.classList.add('open');
        videoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeVideoModal() {
        if (!videoModal || !videoIframe) return;
        videoModal.classList.remove('open');
        videoModal.setAttribute('aria-hidden', 'true');
        videoIframe.src = '';
        document.body.style.overflow = '';
    }

    videoTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            // Let Ctrl/Cmd/Shift clicks open YouTube directly in a new tab
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            const embedUrl = trigger.dataset.videoEmbed;
            if (!embedUrl) return;
            e.preventDefault();
            openVideoModal(embedUrl, trigger.href, trigger.dataset.videoTitle);
        });
    });

    if (videoModal) {
        videoModal.querySelectorAll('[data-close-modal]').forEach(el => {
            el.addEventListener('click', closeVideoModal);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('open')) {
                closeVideoModal();
            }
        });
    }

    // 11. Interactive Contact Form (Web3Forms API Integration)
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('cf-submit-btn');
    const btnText = document.getElementById('cf-btn-text');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('cf-name');
            const emailInput = document.getElementById('cf-email');
            const messageInput = document.getElementById('cf-message');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !email || !message) {
                showToast('Please fill in all form fields.');
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showToast('Please enter a valid email address.');
                return;
            }

            // Set loading state
            submitBtn.disabled = true;
            const originalText = btnText ? btnText.textContent : 'Send Message';
            if (btnText) btnText.textContent = 'Sending...';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.status === 200 && data.success) {
                    showToast('Thank you! Your message has been sent to Vaibhavi.');
                    if (btnText) btnText.textContent = 'Message Sent ✓';
                    contactForm.reset();
                    setTimeout(() => {
                        if (btnText) btnText.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 3500);
                } else {
                    showToast(data.message || 'Something went wrong. Please try again.');
                    if (btnText) btnText.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                showToast('Network issue. Opening your email app instead...');
                const subject = encodeURIComponent(`Portfolio Message from ${name}`);
                const body = encodeURIComponent(`Hi Vaibhavi,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
                window.location.href = `mailto:vaibhavigosavi931@gmail.com?subject=${subject}&body=${body}`;
                if (btnText) btnText.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

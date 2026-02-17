(function() {
  const ready = typeof document !== 'undefined';
  if (!ready) return;

  const build = function() {
    const selectors = ['[data-docs-content]', 'main', 'body > .container', 'body > div.container'];
    let contentRoot = null;
    for (let i = 0; i < selectors.length; i += 1) {
      const candidate = document.querySelector(selectors[i]);
      if (candidate) {
        contentRoot = candidate;
        break;
      }
    }

    if (!contentRoot) return;

    const headings = Array.prototype.slice.call(contentRoot.querySelectorAll('h2'));
    const navItems = [];

    headings.forEach(function(heading, index) {
      if (!heading || !heading.textContent) return;
      if (heading.closest('aside, nav, .docs-side-nav, footer')) return;

      const label = heading.textContent.trim();
      if (!label) return;

      let target = heading.closest('section');
      if (!target || !contentRoot.contains(target)) {
        target = heading;
      }

      let id = target.id || heading.id;
      if (!id) {
        const slugSource = label.toLowerCase();
        const slug = slugSource.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        id = slug || 'section-' + (index + 1);
        target.id = id;
        if (!target.id) heading.id = id;
      }

      navItems.push({ id: id, label: label, element: target });
    });

    if (!navItems.length) return;

    document.body.classList.add('docs-has-nav');

    const parentNode = contentRoot.parentElement;
    const nav = document.createElement('nav');
    nav.className = 'docs-side-nav';
    nav.setAttribute('aria-label', 'ページ目次');
    nav.innerHTML = '' +
      '<div class="docs-side-nav__header">' +
      '  <span class="docs-side-nav__title">ページ目次</span>' +
      '  <button type="button" class="docs-side-nav__close" aria-label="メニューを閉じる">' +
      '    <span aria-hidden="true">×</span>' +
      '  </button>' +
      '</div>' +
      '<ol class="docs-side-nav__list"></ol>';

    const list = nav.querySelector('.docs-side-nav__list');
    navItems.forEach(function(item) {
      const li = document.createElement('li');
      li.className = 'docs-side-nav__item';
      const link = document.createElement('a');
      link.className = 'docs-side-nav__link';
      link.setAttribute('href', '#' + item.id);
      link.textContent = item.label;
      li.appendChild(link);
      list.appendChild(li);
    });

    if (parentNode) {
      parentNode.insertBefore(nav, contentRoot);
    } else {
      document.body.insertBefore(nav, document.body.firstChild);
    }

    const overlay = document.createElement('div');
    overlay.className = 'docs-nav-overlay';
    document.body.appendChild(overlay);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'docs-nav-mobile-toggle';
    toggle.setAttribute('aria-label', '目次を開く');
    toggle.innerHTML = '<span class="docs-nav-mobile-toggle__icon">☰</span><span>目次</span>';
    document.body.appendChild(toggle);

    const closeButton = nav.querySelector('.docs-side-nav__close');

    const style = document.createElement('style');
    style.textContent = `
      body.docs-has-nav { box-sizing: border-box; }
      .docs-side-nav { position: fixed; top: 5.75rem; left: 1.25rem; width: 15.5rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12); max-height: calc(100vh - 6.5rem); overflow-y: auto; transition: transform 0.25s ease, opacity 0.25s ease; z-index: 60; }
      .docs-side-nav__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
      .docs-side-nav__title { font-weight: 700; font-size: 1rem; color: #1f2937; }
      .docs-side-nav__close { display: none; border: none; background: #e0e7ff; color: #1f2937; font-size: 1.5rem; line-height: 1; padding: 0.25rem 0.65rem; border-radius: 0.5rem; cursor: pointer; transition: background-color 0.2s ease; }
      .docs-side-nav__close:hover { background: #c7d2fe; }
      .docs-side-nav__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
      .docs-side-nav__link { display: block; text-decoration: none; color: #475569; font-size: 0.95rem; padding: 0.5rem 0.75rem; border-radius: 0.5rem; transition: background-color 0.2s ease, color 0.2s ease, padding-left 0.2s ease; }
      .docs-side-nav__link:hover { background-color: #edf2ff; color: #3730a3; padding-left: 1rem; }
      .docs-side-nav__link.is-active { background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%); color: #ffffff; box-shadow: 0 6px 18px rgba(79, 70, 229, 0.35); }
      .docs-nav-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45); opacity: 0; pointer-events: none; transition: opacity 0.2s ease; z-index: 50; }
      .docs-nav-overlay.is-active { opacity: 1; pointer-events: auto; }
      .docs-nav-mobile-toggle { position: fixed; top: 1.25rem; left: 1.25rem; display: flex; gap: 0.5rem; align-items: center; border-radius: 9999px; padding: 0.65rem 1.1rem; border: none; color: #ffffff; background: linear-gradient(135deg, #4f46e5 0%, #4338ca 90%); box-shadow: 0 12px 28px rgba(67, 56, 202, 0.35); font-weight: 600; cursor: pointer; z-index: 70; transition: transform 0.2s ease, box-shadow 0.2s ease; }
      .docs-nav-mobile-toggle:hover { transform: translateY(-2px); box-shadow: 0 18px 32px rgba(67, 56, 202, 0.45); }
      .docs-nav-mobile-toggle__icon { font-size: 1.25rem; line-height: 1; }
      @media (max-width: 1023px) {
        body.docs-has-nav { padding-left: 0; padding-right: 0; }
        .docs-side-nav { top: 0; left: 0; width: 18rem; max-height: 100vh; height: 100vh; border-radius: 0; border: none; box-shadow: 0 24px 48px rgba(15, 23, 42, 0.35); transform: translateX(-110%); opacity: 0; pointer-events: none; }
        .docs-side-nav.is-open { transform: translateX(0); opacity: 1; pointer-events: auto; }
        .docs-side-nav__close { display: inline-flex; }
      }
      @media (min-width: 1024px) {
        body.docs-has-nav { padding-left: 18rem; padding-right: 2rem; }
        .docs-nav-mobile-toggle { display: none; }
        .docs-nav-overlay { display: none; }
        .docs-side-nav { transform: none; opacity: 1; pointer-events: auto; }
      }
    `;
    document.head.appendChild(style);

    const openNav = function() {
      nav.classList.add('is-open');
      overlay.classList.add('is-active');
    };

    const closeNav = function() {
      nav.classList.remove('is-open');
      overlay.classList.remove('is-active');
    };

    toggle.addEventListener('click', function() {
      if (nav.classList.contains('is-open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    overlay.addEventListener('click', closeNav);
    closeButton.addEventListener('click', closeNav);

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleMediaChange = function(e) {
      if (e.matches) {
        closeNav();
      }
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleMediaChange);
    }

    const listLinks = Array.prototype.slice.call(nav.querySelectorAll('.docs-side-nav__link'));
    let isProgrammaticScroll = false;

    const setActiveLink = function(id) {
      listLinks.forEach(function(link) {
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });
    };

    const syncActiveToScrollPosition = function() {
      const offsetMobile = 72;
      const offsetDesktop = 32;
      const offset = mediaQuery.matches ? offsetDesktop : offsetMobile;
      const targetY = window.scrollY + offset + 1;
      let bestId = null;
      let bestDelta = Number.POSITIVE_INFINITY;

      navItems.forEach(function(item) {
        const element = item.element;
        if (!element) return;
        const absoluteTop = element.getBoundingClientRect().top + window.scrollY;
        const delta = Math.abs(absoluteTop - targetY);
        if (delta < bestDelta) {
          bestDelta = delta;
          bestId = item.id;
        }
      });

      if (bestId) {
        setActiveLink(bestId);
      }
    };

    let scrollSyncFrame = null;
    const scheduleScrollSync = function() {
      if (scrollSyncFrame !== null) {
        cancelAnimationFrame(scrollSyncFrame);
        scrollSyncFrame = null;
      }

      let stableFrames = 0;
      let lastPosition = window.scrollY;
      const maxFrames = 240; // ~4s at 60fps safeguard
      let frameCount = 0;

      const step = function() {
        frameCount += 1;
        const currentPosition = window.scrollY;
        if (Math.abs(currentPosition - lastPosition) < 0.5) {
          stableFrames += 1;
          if (stableFrames >= 6) {
            syncActiveToScrollPosition();
            isProgrammaticScroll = false;
            scrollSyncFrame = null;
            return;
          }
        } else {
          stableFrames = 0;
          lastPosition = currentPosition;
        }

        if (frameCount >= maxFrames) {
          syncActiveToScrollPosition();
          isProgrammaticScroll = false;
          scrollSyncFrame = null;
          return;
        }

        scrollSyncFrame = requestAnimationFrame(step);
      };

      scrollSyncFrame = requestAnimationFrame(step);
    };

    const scrollToSection = function(targetId) {
      const target = document.getElementById(targetId);
      if (!target) {
        isProgrammaticScroll = false;
        return;
      }
      const rect = target.getBoundingClientRect();
      const offsetMobile = 72;
      const offsetDesktop = 32;
      const offset = mediaQuery.matches ? offsetDesktop : offsetMobile;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      window.scrollTo({
        top: rect.top + scrollTop - offset,
        behavior: 'smooth'
      });
    };

    listLinks.forEach(function(link) {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        const id = link.getAttribute('href').slice(1);
        isProgrammaticScroll = true;
        scrollToSection(id);
        setActiveLink(id);
        scheduleScrollSync();
        closeNav();
      });
    });

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !isProgrammaticScroll) {
          const currentId = entry.target.id;
          if (currentId) {
            setActiveLink(currentId);
          }
        }
      });
    }, {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0.1
    });

    navItems.forEach(function(item) {
      observer.observe(item.element);
    });

    if (navItems[0] && navItems[0].id) {
      setActiveLink(navItems[0].id);
    }

    window.addEventListener('beforeunload', function() {
      closeNav();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();

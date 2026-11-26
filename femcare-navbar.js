/* FemCare Hub 2.0 — Navbar */
(function(){
  if(!document.querySelector('link[href*="font-awesome"]') &&
     !document.querySelector('link[href*="fontawesome"]')){
    var l=document.createElement('link');
    l.rel='stylesheet';
    l.href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(l);
  }
})();

(function () {
  'use strict';
  
  // 1. Initialisation par CLASSE pour éviter les conflits d'IDs si 2 menus sont sur la page
  var navRoots = document.querySelectorAll('.fc-nav__root');
  
  navRoots.forEach(function(ROOT) {
    if (ROOT.dataset.fcInit) return; // Empêche une double initialisation
    ROOT.dataset.fcInit = 'true';

    var burger = ROOT.querySelector('.fc-nav__burger');
    var mainMenu = ROOT.querySelector('.fc-nav__menu');
    
    if (burger && mainMenu) {
      burger.addEventListener('click', function (e) {
        e.preventDefault(); // Stoppe le comportement tactile par défaut qui avale le 1er clic
        e.stopPropagation();
        var isOpen = mainMenu.classList.toggle('fc-nav__menu--open');
        burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        var icon = burger.querySelector('i');
        if (icon) icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        
        // Ferme les autres sous-menus si on ferme le menu principal
        if (!isOpen) {
          ROOT.querySelectorAll('.fc-nav__dropdown--open').forEach(function(d){ d.classList.remove('fc-nav__dropdown--open'); });
          ROOT.querySelectorAll('.fc-nav__item--active').forEach(function(i){
            i.classList.remove('fc-nav__item--active');
            var l = i.querySelector('.fc-nav__link'); if (l) l.setAttribute('aria-expanded','false');
          });
        }
      });
      burger.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); burger.click(); } });
    }

    ROOT.querySelectorAll('.fc-nav__link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault(); 
        e.stopPropagation();
        var item = link.closest('.fc-nav__item');
        var dropdown = item ? item.querySelector('.fc-nav__dropdown') : null;
        if (!dropdown) return;
        var isOpening = !dropdown.classList.contains('fc-nav__dropdown--open');

        // Ferme uniquement les onglets ouverts dans CETTE instance de menu
        ROOT.querySelectorAll('.fc-nav__item--active').forEach(function (ai) {
          if (ai !== item) {
            ai.classList.remove('fc-nav__item--active');
            var dd = ai.querySelector('.fc-nav__dropdown'); if (dd) dd.classList.remove('fc-nav__dropdown--open');
            var al = ai.querySelector('.fc-nav__link'); if (al) al.setAttribute('aria-expanded','false');
          }
        });

        if (isOpening) {
          dropdown.classList.add('fc-nav__dropdown--open');
          item.classList.add('fc-nav__item--active');
          link.setAttribute('aria-expanded','true');
          if (window.innerWidth <= 1024) {
            dropdown.querySelectorAll('.fc-nav__tab-btn--active').forEach(function(btn){
              btn.classList.remove('fc-nav__tab-btn--active');
            });
            dropdown.querySelectorAll('.fc-nav__panel--active').forEach(function(panel){
              panel.classList.remove('fc-nav__panel--active');
            });
          }
        } else {
          dropdown.classList.remove('fc-nav__dropdown--open');
          item.classList.remove('fc-nav__item--active');
          link.setAttribute('aria-expanded','false');
        }
      });
      link.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); link.click(); } });
    });

    ROOT.querySelectorAll('.fc-nav__tab-btn').forEach(function (btn) {
      function activateTab() {
        var layout = btn.closest('.fc-nav__tabbed');
        var cat = btn.closest('.fc-nav__cat');
        if (!layout || !cat) return;
        var panel = cat.querySelector('.fc-nav__panel');
        if (!panel) return;
        layout.querySelectorAll('.fc-nav__tab-btn').forEach(function(b){ b.classList.remove('fc-nav__tab-btn--active'); });
        layout.querySelectorAll('.fc-nav__panel').forEach(function(p){ p.classList.remove('fc-nav__panel--active'); });
        btn.classList.add('fc-nav__tab-btn--active');
        panel.classList.add('fc-nav__panel--active');
      }

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var cat = btn.closest('.fc-nav__cat');
        var panel = cat ? cat.querySelector('.fc-nav__panel') : null;
        if (!panel) return;
        if (btn.classList.contains('fc-nav__tab-btn--active')) {
          if (window.innerWidth <= 1024) {
            btn.classList.remove('fc-nav__tab-btn--active');
            panel.classList.remove('fc-nav__panel--active');
          }
        } else {
          activateTab();
        }
      });
    });

    ROOT.querySelectorAll('.fc-nav__acc-header').forEach(function (header) {
      header.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var content = header.nextElementSibling;
        var icon = header.querySelector('.fc-nav__acc-icon');
        if (!content) return;
        var isOpen = content.classList.toggle('fc-nav__acc-content--open');
        if (icon) { icon.classList.toggle('fa-plus',!isOpen); icon.classList.toggle('fa-minus',isOpen); }
      });
    });
  }); // Fin du forEach

  // 2. Clic extérieur (ferme les menus si on clique en dehors de N'IMPORTE QUEL menu)
  // Guard : empêche le double-listener si le script est présent 2 fois sur la page
  if (!window.__fcNavGlobalClickBound) {
    window.__fcNavGlobalClickBound = true;
    document.addEventListener('click', function (e) {
      if (!e.target.closest || !e.target.closest('.fc-nav__root')) {
        document.querySelectorAll('.fc-nav__item--active').forEach(function (item) {
          item.classList.remove('fc-nav__item--active');
          var dd = item.querySelector('.fc-nav__dropdown'); if (dd) dd.classList.remove('fc-nav__dropdown--open');
          var l = item.querySelector('.fc-nav__link'); if (l) l.setAttribute('aria-expanded','false');
        });
      }
    });
  }

  // 3. Modification des liens
  document.querySelectorAll('.fc-nav__root a').forEach(function(link) {
    if (link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // 4. Système de badge auto-masquant
  var badges = document.querySelectorAll('.fc-badge');
  if (badges.length > 0) {
    var today = new Date();
    today.setHours(0,0,0,0);
    badges.forEach(function(badge) {
      var dateAttr = badge.getAttribute('data-date');
      if (dateAttr) {
        var updateDate = new Date(dateAttr);
        updateDate.setHours(0,0,0,0);
        var diffTime = today.getTime() - updateDate.getTime();
        var diffDays = diffTime / (1000 * 3600 * 24);
        
        if (diffDays > 15) {
          badge.style.display = 'none';
        }
      }
    });
  }

})();

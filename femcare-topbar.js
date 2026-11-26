
/* =====================================================
   FemCare Hub 2.0 — Topbar
   Gestion du menu et des sous-menus
   Compatible Elementor
   ===================================================== */

(function() {
  function initMenu() {
    var topbar = document.getElementById('fc-topbar-root');
    var burger = document.getElementById('fc-topbar-burger');

    // Vérification des éléments
    if (!burger || !topbar) return;

    // Protection contre la double initialisation
    if (topbar.getAttribute('data-init') === 'true') return;
    topbar.setAttribute('data-init', 'true');

    // Bouton hamburger
    burger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      topbar.classList.toggle('is-open');

      var icon = burger.querySelector('i');

      if (icon) {
        if (topbar.classList.contains('is-open')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Gestion des sous-menus : Mon espace
    var items = topbar.querySelectorAll('.fc-topbar__item');

    items.forEach(function(item) {
      var link = item.querySelector('.fc-topbar__link');
      var dropdown = item.querySelector('.fc-topbar__dropdown');

      if (link && dropdown) {
        link.addEventListener('click', function(e) {

          if (
            link.tagName === 'DIV' ||
            !link.getAttribute('href') ||
            link.getAttribute('href') === '#'
          ) {
            e.preventDefault();
          }

          items.forEach(function(otherItem) {
            if (otherItem !== item) {
              otherItem.classList.remove('is-expanded');
            }
          });

          item.classList.toggle('is-expanded');
        });
      }
    });

    // Fermeture lors d'un clic extérieur
    document.addEventListener('click', function(e) {
      if (!topbar.contains(e.target)) {

        items.forEach(function(item) {
          item.classList.remove('is-expanded');
        });

        if (topbar.classList.contains('is-open')) {
          topbar.classList.remove('is-open');

          var icon = burger.querySelector('i');

          if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
        }
      }
    });
  }

  // Initialisation compatible avec le chargement Elementor
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenu);
  } else {
    initMenu();
  }
})();

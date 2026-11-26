(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CONFIGURATION
  ══════════════════════════════════════════════════════════ */
  var SITE      = 'https://www.dr-karazaitri-ma.net';
  var API       = SITE + '/wp-json/fcs/v1/search';
  var API_WP    = SITE + '/wp-json/wp/v2/search';
  var MIN_CHARS = 2;
  var PER_PAGE  = 8;
  var DEBOUNCE  = 320;

  var ALLOWED_SUBTYPES = ['post', 'page'];

  /* ══════════════════════════════════════════════════════════
     DICTIONNAIRE MÉDICAL
  ══════════════════════════════════════════════════════════ */
  var CORRECTIONS = {
    'uterus'            : 'utérus',
    'uteri'             : 'utéri',
    'endometre'         : 'endomètre',
    'endometriose'      : 'endométriose',
    'endometrique'      : 'endométrique',
    'menopause'         : 'ménopause',
    'menopausique'      : 'ménopausique',
    'perimenopause'     : 'périménopause',
    'premenopause'      : 'préménopause',
    'postmenopause'     : 'postménopause',
    'menorragie'        : 'ménorragie',
    'menorragies'       : 'ménorragies',
    'menometrorragie'   : 'ménométrorragie',
    'metrorragie'       : 'métrorragie',
    'metrorragies'      : 'métrorragies',
    'amenorrhee'        : 'aménorrhée',
    'dysmenorrhee'      : 'dysménorrhée',
    'oligomenorrhee'    : 'oligoménorrhée',
    'polymenorrhee'     : 'polyménorrhée',
    'spanomenorrhee'    : 'spanioménorrhée',
    'prolapssus'        : 'prolapsus',
    'perineale'         : 'périnéale',
    'perinee'           : 'périnée',
    'placenta praevia'  : 'placenta prævia',
    'placenta pravia'   : 'placenta prævia',
    'preeclampsie'      : 'prééclampsie',
    'pre-eclampsie'     : 'prééclampsie',
    'eclampsie'         : 'éclampsie',
    'eclamsie'          : 'éclampsie',
    'grossese'          : 'grossesse',
    'grosssesse'        : 'grossesse',
    'grrossesse'        : 'grossesse',
    'grssesse'          : 'grossesse',
    'grssese'           : 'grossesse',
    'cesarienne'        : 'césarienne',
    'cesariennes'       : 'césariennes',
    'fecondation'       : 'fécondation',
    'fecondite'         : 'fécondité',
    'infecondite'       : 'infécondité',
    'sterilite'         : 'stérilité',
    'fertilite'         : 'fertilité',
    'puberte'           : 'puberté',
    'precocite'         : 'précocité',
    'gynecologie'       : 'gynécologie',
    'gynecologique'     : 'gynécologique',
    'obstetrique'       : 'obstétrique',
    'obstetrical'       : 'obstétrical',
    'pediatrique'       : 'pédiatrique',
    'perinatale'        : 'périnatale',
    'neonatale'         : 'néonatale',
    'neonatalogie'      : 'néonatalogie',
    'echographie'       : 'échographie',
    'echographique'     : 'échographique',
    'hysteroscopie'     : 'hystéroscopie',
    'hysterectomie'     : 'hystérectomie',
    'hysterectomies'    : 'hystérectomies',
    'coelioscopie'      : 'cœlioscopie',
    'coeliochirurgie'   : 'cœliochirurgie',
    'laparoscopy'       : 'laparoscopie',
    'hysteroscopy'      : 'hystéroscopie',
    'oophorectomie'     : 'ovariectomie',
    'fausse-couche'     : 'fausse couche',
    'foetus'            : 'fœtus',
    'foetal'            : 'fœtal',
    'foetale'           : 'fœtale',
    'dysplasie'         : 'dysplasie',
    'neoplasie'         : 'néoplasie',
    'adenocarcinome'    : 'adénocarcinome',
    'endometriome'      : 'endométriome',
    'dermoide'          : 'dermoïde',
    'dermoid'           : 'dermoïde',
    'hyperprolactinemie': 'hyperprolactinémie',
    'hypothyroidie'     : 'hypothyroïdie',
    'hyperthyroidie'    : 'hyperthyroïdie',
    'thyroide'          : 'thyroïde',
    'androgene'         : 'androgène',
    'androgenes'        : 'androgènes',
    'oestrogene'        : 'œstrogène',
    'estrogene'         : 'œstrogène',
    'progesterone'      : 'progestérone',
    'testosterone'      : 'testostérone',
    'rectocele'         : 'rectocèle',
    'cystocele'         : 'cystocèle',
    'ureterocele'       : 'urétérocèle',
    'incontinance'      : 'incontinence',
    'fibriome'          : 'fibrome',
    'fybrome'           : 'fibrome',
    'myiome'            : 'myome',
    'polipe'            : 'polype',
    'menstruaton'       : 'menstruation',
    'ovualtion'         : 'ovulation',
    'ovulaiton'         : 'ovulation',
    'feritlite'         : 'fertilité',
    'eographie'         : 'échographie',
    'endometrial'       : 'endométrial',
    'ovarian'           : 'ovarien',
    'ovarian cyst'      : 'kyste ovarien',
    'uterine'           : 'utérin',
    'uterine fibroid'   : 'fibrome utérin',
    'miscarriage'       : 'fausse couche',
    'pregnancy'         : 'grossesse',
    'ectopic'           : 'ectopique',
    'ectopic pregnancy' : 'grossesse extra-utérine',
    'polycystic'        : 'polykystique',
    'endometriosis'     : 'endométriose',
    'hysterectomy'      : 'hystérectomie',
    'cesarean'          : 'césarienne',
    'caesarean'         : 'césarienne',
    'prenatal'          : 'prénatal',
    'antenatal'         : 'anténatal',
    'postnatal'         : 'postnatal',
    'preeclampsia'      : 'prééclampsie',
    'eclampsia'         : 'éclampsie',
    'placenta previa'   : 'placenta prævia',
    'amenorrhea'        : 'aménorrhée',
    'dysmenorrhea'      : 'dysménorrhée',
    'menorrhagia'       : 'ménorragie',
    'colposcopy'        : 'colposcopie',
    'ultrasound'        : 'échographie',
    'breast cancer'     : 'cancer du sein',
    'ovarian cancer'    : 'cancer de l\'ovaire',
    'cervical cancer'   : 'cancer du col',
    'fetus'             : 'fœtus',
    'fetal'             : 'fœtal',
    'prolactin'         : 'prolactine',
    'estrogen'          : 'œstrogène',
    'cervix'            : 'col de l\'utérus',
  };

  var SYNONYMES = {
    'hpv'               : ['papillomavirus', 'condylome'],
    'papillomavirus'    : ['HPV', 'condylome'],
    'condylome'         : ['HPV', 'papillomavirus', 'verrues génitales'],
    'sopk'              : ['syndrome des ovaires polykystiques', 'polykystose ovarienne'],
    'pcos'              : ['SOPK', 'syndrome des ovaires polykystiques'],
    'règles'            : ['menstruation', 'cycle menstruel'],
    'regles'            : ['menstruation', 'cycle menstruel', 'règles'],
    'menstruation'      : ['règles', 'cycle menstruel'],
    'col'               : ['col de l\'utérus', 'cervix', 'cervical'],
    'trompe'            : ['salpinx', 'trompe de fallope', 'salpingite'],
    'salpinx'           : ['trompe', 'trompe de fallope'],
    'sein'              : ['glande mammaire', 'mammaire', 'mastologie'],
    'cancer sein'       : ['cancer du sein', 'carcinome mammaire'],
    'cancer col'        : ['cancer du col', 'cancer cervical', 'carcinome cervical'],
    'cancer ovaire'     : ['cancer de l\'ovaire', 'carcinome ovarien'],
    'fibrome'           : ['myome', 'léiomyome', 'fibromyome'],
    'myome'             : ['fibrome', 'léiomyome', 'fibromyome'],
    'endometriose'      : ['endométriose', 'adénomyose', 'endométriome'],
    'endométriose'      : ['adénomyose', 'endométriome'],
    'adenomyose'        : ['adénomyose', 'endométriose interne'],
    'adénomyose'        : ['endométriose', 'endométriose interne'],
    'ivg'               : ['interruption volontaire de grossesse', 'avortement'],
    'img'               : ['interruption médicale de grossesse', 'IVG'],
    'geu'               : ['grossesse extra-utérine', 'grossesse ectopique'],
    'fausse couche'     : ['avortement spontané', 'fausse-couche'],
    'césarienne'        : ['section césarienne', 'accouchement chirurgical'],
    'ménopause'         : ['postménopause', 'climatère', 'périménopause'],
    'menopause'         : ['ménopause', 'postménopause', 'climatère'],
    'contraception'     : ['pilule', 'contraceptif', 'planification familiale'],
    'pilule'            : ['contraception orale', 'contraceptif oral'],
    'sterilet'          : ['DIU', 'dispositif intra-utérin'],
    'diu'               : ['stérilet', 'dispositif intra-utérin'],
    'sterilite'         : ['infertilité', 'infécondité', 'hypofertilité'],
    'stérilité'         : ['infertilité', 'infécondité'],
    'infertilite'       : ['stérilité', 'infécondité'],
    'infertilité'       : ['stérilité', 'infécondité'],
    'fiv'               : ['fécondation in vitro', 'AMP', 'PMA'],
    'pma'               : ['procréation médicalement assistée', 'FIV', 'AMP'],
    'amp'               : ['assistance médicale à la procréation', 'PMA', 'FIV'],
    'echo'              : ['échographie', 'ultrasonographie', 'doppler'],
    'échographie'       : ['ultrasonographie', 'écho', 'doppler obstétrical'],
    'coelioscopie'      : ['cœlioscopie', 'laparoscopie'],
    'cœlioscopie'       : ['laparoscopie', 'chirurgie minimale invasive'],
    'laparoscopie'      : ['cœlioscopie', 'coelioscopie'],
    'hysteroscopie'     : ['hystéroscopie', 'endoscopie utérine'],
    'hystéroscopie'     : ['endoscopie utérine'],
    'colposcopie'       : ['examen colposcopique', 'biopsie cervicale'],
    'frottis'           : ['frottis cervico-vaginal', 'FCU', 'cytologie cervicale'],
    'fcu'               : ['frottis', 'frottis cervico-vaginal', 'cytologie'],
    'biopsie'           : ['anapath', 'anatomopathologie', 'histologie'],
    'prolapsus'         : ['descente d\'organes', 'cystocèle', 'rectocèle'],
    'incontinence'      : ['incontinence urinaire', 'fuites urinaires'],
    'vulvite'           : ['vulvovaginite', 'vaginite', 'prurit vulvaire'],
    'vaginite'          : ['vulvovaginite', 'vulvite', 'colpite'],
    'leucorrhee'        : ['leucorrhées', 'pertes vaginales'],
    'leucorrhées'       : ['pertes vaginales', 'écoulement vaginal'],
    'prolactine'        : ['hyperprolactinémie', 'adénome hypophysaire'],
    'hirsutisme'        : ['hyperandrogénie', 'SOPK', 'virilisation'],
    'amenorrhee'        : ['aménorrhée', 'absence de règles', 'SOPK'],
    'aménorrhée'        : ['absence de règles', 'SOPK'],
    'dysmenorrhee'      : ['dysménorrhée', 'règles douloureuses', 'endométriose'],
    'dysménorrhée'      : ['règles douloureuses', 'endométriose'],
    'grossesse'         : ['gestation', 'gravidité'],
    'prématurité'       : ['accouchement prématuré', 'MAP'],
    'map'               : ['menace d\'accouchement prématuré', 'prématurité'],
    'placenta'          : ['placentation', 'délivrance', 'placenta prævia'],
    'hematome'          : ['hématome rétroplacentaire', 'HRP'],
    'hrp'               : ['hématome rétroplacentaire', 'décollement placentaire'],
    'diabete'           : ['diabète gestationnel', 'diabète de grossesse'],
    'diabète'           : ['diabète gestationnel', 'diabète de type 2'],
    'hypertension'      : ['HTA gravidique', 'prééclampsie'],
    'hta'               : ['hypertension artérielle', 'HTA gravidique', 'prééclampsie'],
  };

  /* ══════════════════════════════════════════════════════════
     ÉLÉMENTS DOM
  ══════════════════════════════════════════════════════════ */
  var root      = document.getElementById('fcs-root');
  var box       = document.getElementById('fcs-box');
  var input     = document.getElementById('fcs-input');
  var catSel    = document.getElementById('fcs-cat');
  var clearBtn  = document.getElementById('fcs-clear');
  var spinner   = document.getElementById('fcs-spinner');
  var dropdown  = document.getElementById('fcs-dropdown');
  var submitBtn = document.getElementById('fcs-btn');
  var overlay   = document.getElementById('fcs-overlay');
  var exactCb   = document.getElementById('fcs-exact');

  if (!root || !input) return;

  if (dropdown) {
    dropdown.setAttribute('aria-live', 'polite');
    dropdown.setAttribute('aria-atomic', 'true');
  }

  /* ══════════════════════════════════════════════════════════
     SUGGESTIONS ORTHOGRAPHIQUES
  ══════════════════════════════════════════════════════════ */
  var suggestionBanner = null;

  function createSuggestionBanner() {
    if (suggestionBanner) return suggestionBanner;
    var el = document.createElement('div');
    el.id = 'fcs-suggestion-banner';
    el.style.cssText =
      'display:none;margin-top:6px;padding:7px 14px;' +
      'background:#fff8e1;border:1px solid #ffe082;border-radius:8px;' +
      'font-size:12.5px;color:#5d4037;align-items:center;gap:8px;';
    el.innerHTML =
      '<i class="fas fa-spell-check" style="color:#f9a825;flex-shrink:0;" aria-hidden="true"></i>' +
      '<span id="fcs-suggestion-text"></span>';
    var boxEl = document.getElementById('fcs-box');
    if (boxEl && boxEl.parentNode) {
      boxEl.parentNode.insertBefore(el, boxEl.nextSibling);
    }
    suggestionBanner = el;
    return el;
  }

  if (!document.getElementById('fcs-suggestion-style')) {
    var sty = document.createElement('style');
    sty.id = 'fcs-suggestion-style';
    sty.textContent =
      '@keyframes fcs-fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}' +
      '#fcs-suggestion-banner{display:none !important}' +
      '#fcs-suggestion-banner.fcs-suggestion--visible{display:flex !important;animation:fcs-fadeIn .2s ease}';
    document.head.appendChild(sty);
  }

  function showSuggestion(originalQuery, correctedQuery) {
    var banner = createSuggestionBanner();
    var textEl = document.getElementById('fcs-suggestion-text');
    if (!textEl) return;
    textEl.innerHTML =
      'Vouliez-vous dire&nbsp;: ' +
      '<a href="#" id="fcs-suggestion-link" style="color:#1a629b;font-weight:700;text-decoration:underline;cursor:pointer;">' +
        escHtml(correctedQuery) +
      '</a>&nbsp;?' +
      '<span style="color:#aaa;font-size:11px;margin-left:8px;">' +
        '(vous avez tap\u00e9&nbsp;: <em>' + escHtml(originalQuery) + '</em>)' +
      '</span>';
    banner.classList.add('fcs-suggestion--visible');
    var link = document.getElementById('fcs-suggestion-link');
    if (link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        input.value = correctedQuery;
        hideSuggestion();
        triggerSearch(correctedQuery);
      });
    }
  }

  function hideSuggestion() {
    var banner = document.getElementById('fcs-suggestion-banner');
    if (banner) banner.classList.remove('fcs-suggestion--visible');
  }

  function getCorrection(query) {
    var q = query.toLowerCase().trim();
    return CORRECTIONS[q] || null;
  }

  function getSynonymes(query) {
    var q = query.toLowerCase().trim();
    return SYNONYMES[q] || null;
  }

  /* ══════════════════════════════════════════════════════════
     CACHE
  ══════════════════════════════════════════════════════════ */
  var cache = {};

  function cacheKey(query, cat, isExact) {
    return [query.toLowerCase(), cat || '', isExact ? '1' : '0'].join('|');
  }

  /* ══════════════════════════════════════════════════════════
     HISTORIQUE
  ══════════════════════════════════════════════════════════ */
  var HISTORY_KEY = 'fcs_history_v1';
  var MAX_HISTORY = 6;

  function getHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
    catch(e) { return []; }
  }

  function saveHistory(query) {
    if (!query || query.trim().length < MIN_CHARS) return;
    var h = getHistory().filter(function(q){ return q !== query; });
    h.unshift(query);
    if (h.length > MAX_HISTORY) h = h.slice(0, MAX_HISTORY);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); } catch(e){}
  }

  function removeFromHistory(query) {
    var h = getHistory().filter(function(q){ return q !== query; });
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); } catch(e){}
  }

  function clearHistory() {
    try { localStorage.removeItem(HISTORY_KEY); } catch(e){}
  }

  /* ══════════════════════════════════════════════════════════
     UTILITAIRES
  ══════════════════════════════════════════════════════════ */
  var debounceTimer = null;
  function debounce(fn, delay) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fn, delay);
  }

  var activeIndex = -1;
  var items = [];

  function updateActiveItem(idx) {
    items.forEach(function(el, i) {
      el.classList.toggle('fcs__item--active', i === idx);
    });
    activeIndex = idx;
  }

  function openOverlay() {
    overlay.classList.add('fcs__overlay--visible');
    box.setAttribute('aria-expanded', 'true');
  }

  function closeAll() {
    if (currentXhr)  { currentXhr.abort();  currentXhr  = null; }
    if (currentXhr2) { currentXhr2.abort(); currentXhr2 = null; }
    spinner.classList.remove('fcs__spinner--visible');
    dropdown.classList.remove('fcs__dropdown--open');
    overlay.classList.remove('fcs__overlay--visible');
    box.setAttribute('aria-expanded', 'false');
    activeIndex = -1;
    items = [];
    hideSuggestion();
  }

  function typeInfo(type) {
    if (type === 'post')     return { icon: 'fa-file-medical-alt', cls: 'post',     label: 'Article' };
    if (type === 'page')     return { icon: 'fa-book-medical',      cls: 'page',     label: 'Page' };
    if (type === 'category') return { icon: 'fa-folder',            cls: 'category', label: 'Catégorie' };
    return { icon: 'fa-file', cls: 'post', label: type };
  }

  /* Supprime les diacritiques pour comparaison insensible aux accents */
  function normalize(str) {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function highlight(text, query) {
    if (!query) return text;
    var normQuery = normalize(query);
    var normText  = normalize(text);
    var escaped   = normQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var re        = new RegExp(escaped, 'gi');
    var result    = '';
    var lastIndex = 0;
    var match;
    while ((match = re.exec(normText)) !== null) {
      result += escHtml(text.slice(lastIndex, match.index));
      result += '<mark>' + escHtml(text.slice(match.index, match.index + match[0].length)) + '</mark>';
      lastIndex = match.index + match[0].length;
    }
    result += escHtml(text.slice(lastIndex));
    return result;
  }

  /* ══════════════════════════════════════════════════════════
     DÉTECTION MOT ENTIER
  ══════════════════════════════════════════════════════════ */
  function isWordMatch(text, term) {
    if (!text || !term) return false;
    var re = new RegExp(
      '(^|[\\s\\-\\/\\.\\,\\(\\[\\:\u00ab\u2019])' +
      term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
      '($|[\\s\\-\\/\\.\\,\\)\\]\\:\\;\u00bb\u2019])',
      'i'
    );
    return re.test(text);
  }

  /* ══════════════════════════════════════════════════════════
     RENDU RÉSULTATS
  ══════════════════════════════════════════════════════════ */
  var currentPage  = 1;
  var allResults   = [];
  var currentQuery = '';

  function renderPage(page) {
    currentPage  = page;
    var start    = (page - 1) * PER_PAGE;
    var end      = Math.min(start + PER_PAGE, allResults.length);
    var pageData = allResults.slice(start, end);
    var total    = allResults.length;
    var totalPages = Math.ceil(total / PER_PAGE);

    var isEx = exactCb && exactCb.checked;
    var _elapsed = _timerStart > 0 ? (Date.now() - _timerStart) : null;
    _timerStart = 0; /* reset — n'affiche le temps que sur la 1re page */
    var header =
      '<div class="fcs__drop-header">' +
        '<span class="fcs__drop-title">Suggestions' +
          (isEx ? ' <span style="font-size:9px;background:#e8f2fb;color:var(--fcs-blue);padding:1px 6px;border-radius:8px;font-weight:700;vertical-align:middle;">EXACT</span>' : '') +
        '</span>' +
        '<span class="fcs__drop-count">' +
          total + '\u00a0r\u00e9sultat' + (total > 1 ? 's' : '') +
          (_elapsed !== null ? ' <span style="font-size:10px;color:var(--fcs-muted);font-weight:400;margin-left:4px;">(' + _elapsed + '\u00a0ms)</span>' : '') +
        '</span>' +
      '</div>';

    var resultList = '<div class="fcs__results" role="listbox">';
    pageData.forEach(function(item, idx) {
      var info     = typeInfo(item.type || item.subtype || 'post');
      var rawTitle = decodeHtml(item.title && item.title.rendered ? item.title.rendered : (item.title || ''));
      var title    = highlight(escHtml(rawTitle), currentQuery);
      var url      = item.url || item.link || '#';
      var itemNum  = start + idx + 1;

      /* ── Pastille "via synonyme" — jaune discret ──────── */
      var viaSyn = item._via_syn
        ? '<span style="' +
            'display:inline-block;' +
            'margin-left:7px;' +
            'font-size:9.5px;' +
            'font-weight:600;' +
            'color:#7a6000;' +
            'background:#fff8e1;' +
            'border:1px solid #ffe082;' +
            'border-radius:4px;' +
            'padding:1px 6px;' +
            'vertical-align:middle;' +
            'letter-spacing:0.03em;' +
            'white-space:nowrap;' +
          '" title="R\u00e9sultat trouv\u00e9 via synonyme">via&nbsp;<em>' +
          escHtml(item._via_syn) +
          '</em></span>'
        : '';

      resultList +=
        '<a class="fcs__item" href="' + escHtml(url) + '" target="_blank" rel="noopener noreferrer" role="option" data-url="' + escHtml(url) + '" data-title="' + escHtml(rawTitle) + '">' +
          '<span class="fcs__item-num">' + itemNum + '</span>' +
          '<div class="fcs__item-icon fcs__item-icon--' + info.cls + '">' +
            '<i class="fas ' + info.icon + '" aria-hidden="true"></i>' +
          '</div>' +
          '<div class="fcs__item-body">' +
            '<div class="fcs__item-title">' + title + viaSyn + '</div>' +
          '</div>' +
          '<i class="fas fa-arrow-right" style="font-size:10px;color:var(--fcs-muted);flex-shrink:0;margin-left:4px;" aria-hidden="true"></i>' +
        '</a>';
    });
    resultList += '</div>';

    var pag = '';
    if (totalPages > 1) {
      pag = '<div class="fcs__pagination">';
      pag += '<button class="fcs__page-btn fcs__page-prev"' + (page <= 1 ? ' disabled' : '') + ' title="Page pr\u00e9c\u00e9dente">\u2039</button>';
      var pages = [];
      for (var i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
          pages.push(i);
        } else if (pages[pages.length - 1] !== '\u2026') {
          pages.push('\u2026');
        }
      }
      pages.forEach(function(p) {
        if (p === '\u2026') {
          pag += '<span class="fcs__page-dots">\u2026</span>';
        } else {
          pag += '<button class="fcs__page-btn' + (p === page ? ' fcs__page-btn--active' : '') + '" data-page="' + p + '">' + p + '</button>';
        }
      });
      pag += '<button class="fcs__page-btn fcs__page-next"' + (page >= totalPages ? ' disabled' : '') + ' title="Page suivante">\u203a</button>';
      pag += '</div>';
    }

    var footer =
      '<div class="fcs__drop-footer">' +
        '<span class="fcs__kbd-hint">' +
          '<kbd class="fcs__kbd">\u2191\u2193</kbd> naviguer &nbsp;' +
          '<kbd class="fcs__kbd">Entr\u00e9e</kbd> ouvrir' +
        '</span>' +
      '</div>';

    dropdown.innerHTML = header + resultList + pag + footer;
    dropdown.classList.add('fcs__dropdown--open');
    openOverlay();

    var prevBtn = dropdown.querySelector('.fcs__page-prev');
    var nextBtn = dropdown.querySelector('.fcs__page-next');
    if (prevBtn) prevBtn.addEventListener('click', function(e) {
      e.preventDefault(); e.stopPropagation();
      if (currentPage > 1) renderPage(currentPage - 1);
    });
    if (nextBtn) nextBtn.addEventListener('click', function(e) {
      e.preventDefault(); e.stopPropagation();
      if (currentPage < totalPages) renderPage(currentPage + 1);
    });
    dropdown.querySelectorAll('.fcs__page-btn[data-page]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault(); e.stopPropagation();
        var p = parseInt(btn.getAttribute('data-page'), 10);
        if (!isNaN(p)) renderPage(p);
      });
    });

    items = Array.from(dropdown.querySelectorAll('.fcs__item'));
    items.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        updateActiveItem(items.indexOf(el));
      });
    });
  }

  function renderResults(data, query) {
    dropdown.innerHTML = '';
    items = [];

    if (!data || data.length === 0) {
      dropdown.innerHTML =
        '<div class="fcs__drop-header">' +
          '<span class="fcs__drop-title">R\u00e9sultats</span>' +
          '<span class="fcs__drop-count">0 r\u00e9sultat</span>' +
        '</div>' +
        '<div class="fcs__empty">' +
          '<div class="fcs__empty-icon"><i class="fas fa-search" aria-hidden="true"></i></div>' +
          '<div class="fcs__empty-text">Aucun r\u00e9sultat pour <span class="fcs__empty-query">&laquo;&nbsp;' + escHtml(query) + '&nbsp;&raquo;</span></div>' +
        '</div>' +
        '<div class="fcs__drop-footer"></div>';
      dropdown.classList.add('fcs__dropdown--open');
      openOverlay();
      return;
    }

    allResults   = data;
    currentQuery = query;
    currentPage  = 1;
    renderPage(1);
    updateImgLink(query);
  }

  function renderNetworkError() {
    dropdown.innerHTML =
      '<div class="fcs__drop-header"><span class="fcs__drop-title">Erreur</span></div>' +
      '<div class="fcs__empty">' +
        '<div class="fcs__empty-icon"><i class="fas fa-wifi" aria-hidden="true"></i></div>' +
        '<div class="fcs__empty-text" style="color:#c0392b;">\u26a0\ufe0f Connexion impossible &mdash; v\u00e9rifiez votre r\u00e9seau</div>' +
      '</div>' +
      '<div class="fcs__drop-footer"></div>';
    dropdown.classList.add('fcs__dropdown--open');
    openOverlay();
  }

  /* ══════════════════════════════════════════════════════════
     HISTORIQUE RENDU
  ══════════════════════════════════════════════════════════ */
  function renderHistory() {
    var h = getHistory();
    if (!h.length) return;
    dropdown.innerHTML = '';
    items = [];

    var wrap = document.createElement('div');
    wrap.className = 'fcs__history';

    var titleRow = document.createElement('div');
    titleRow.className = 'fcs__history-title';
    titleRow.innerHTML = '<span>Recherches r\u00e9centes</span>';
    var clrBtn = document.createElement('button');
    clrBtn.className = 'fcs__history-clear';
    clrBtn.textContent = 'Tout effacer';
    clrBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      clearHistory();
      closeAll();
    });
    titleRow.appendChild(clrBtn);
    wrap.appendChild(titleRow);

    h.forEach(function(q) {
      var row = document.createElement('div');
      row.className = 'fcs__history-item';
      row.setAttribute('role', 'option');
      row.innerHTML =
        '<i class="fas fa-history fcs__history-icon" aria-hidden="true"></i>' +
        '<span class="fcs__history-text">' + escHtml(q) + '</span>' +
        '<button class="fcs__history-del" type="button" title="Supprimer" aria-label="Supprimer cette recherche">' +
          '<i class="fas fa-times" aria-hidden="true"></i>' +
        '</button>';

      row.querySelector('.fcs__history-del').addEventListener('click', function(e) {
        e.stopPropagation();
        removeFromHistory(q);
        renderHistory();
        if (!getHistory().length) closeAll();
      });

      row.addEventListener('click', function() {
        input.value = q;
        triggerSearch(q);
      });

      wrap.appendChild(row);
    });

    dropdown.appendChild(wrap);
    dropdown.classList.add('fcs__dropdown--open');
    openOverlay();
    items = [];
  }

  /* ══════════════════════════════════════════════════════════
     FILTRAGE CENTRALISÉ
  ══════════════════════════════════════════════════════════ */
  function filterData(data, query, cat, isExact) {

    /* 1. Liste blanche subtypes */
    data = data.filter(function(item) {
      var st = (item.subtype || item.type || '').toLowerCase();
      return ALLOWED_SUBTYPES.indexOf(st) !== -1;
    });

    /* 2. Sécurité URL / titre */
    data = data.filter(function(item) {
      var url   = (item.url || item.link || '').toLowerCase();
      var title = decodeHtml(item.title && item.title.rendered
                    ? item.title.rendered
                    : (item.title || '')).toLowerCase();
      if (url.indexOf('elementor_library') !== -1) return false;
      if (url.indexOf('?elementor')         !== -1) return false;
      if (url.indexOf('dynamic-content')    !== -1) return false;
      if (url.indexOf('dc-dynamic')         !== -1) return false;
      if (/dynamic[- ]content/i.test(title))        return false;
      if (/menuitem\d+/i.test(title))                return false;
      return true;
    });

    /* 3. Filtre sous-chaînes parasites pour requêtes courtes */
    var q = normalize(query);
    if (q.length <= 4) {
      data = data.filter(function(item) {
        var rawTitle = decodeHtml(item.title && item.title.rendered
                        ? item.title.rendered
                        : (item.title || ''));
        var t = normalize(rawTitle);
        if (t.indexOf(q) !== -1) {
          return isWordMatch(t, q);
        }
        return true;
      });
    }

    /* 4. Mode exact */
    if (isExact) {
      var qEx = query.toLowerCase();
      data = data.filter(function(item) {
        var t = decodeHtml(item.title && item.title.rendered
                  ? item.title.rendered
                  : (item.title || '')).toLowerCase();
        return t.indexOf(qEx) !== -1;
      });
    }

    /* 5. Filtre catégorie */
    if (cat) {
      data = data.filter(function(item) {
        var u = (item.url || item.link || '').toLowerCase();
        return u.indexOf('/' + cat) !== -1;
      });
    }

    return data;
  }

  /* ══════════════════════════════════════════════════════════
     TRI PAR PERTINENCE
  ══════════════════════════════════════════════════════════ */
  function sortByRelevance(data, query) {
    var qLower = normalize(query);
    var qWords = qLower.split(/\s+/).filter(function(w){ return w.length > 1; });

    function titleScore(rawTitle) {
      var t = normalize(rawTitle);
      var q = normalize(qLower);

      if (t === q)             return 1000;
      if (t.indexOf(q) === 0)  return 900;
      if (t.indexOf(q) !== -1) {
        if (q.length <= 4 && !isWordMatch(t, q)) return 50;
        var pos = t.indexOf(q);
        return 800 - Math.min(pos, 50);
      }

      if (qWords.length > 1) {
        var allWords = qWords.every(function(w){ return t.indexOf(w) !== -1; });
        if (allWords) {
          var sumPos = qWords.reduce(function(acc, w){ return acc + t.indexOf(w); }, 0);
          return 700 - Math.min(sumPos, 100);
        }
      }

      var matchedWords = qWords.filter(function(w){ return t.indexOf(w) !== -1; });
      if (matchedWords.length > 0) return 500 + matchedWords.length * 20;

      if (q.length <= 4) return 200;
      return 10;
    }

    data.sort(function(a, b) {
      /* Résultats directs avant résultats via synonyme */
      var aSyn = a._via_syn ? 1 : 0;
      var bSyn = b._via_syn ? 1 : 0;
      if (aSyn !== bSyn) return aSyn - bSyn;

      var ta = decodeHtml(a.title && a.title.rendered ? a.title.rendered : (a.title || ''));
      var tb = decodeHtml(b.title && b.title.rendered ? b.title.rendered : (b.title || ''));
      var sa = titleScore(ta);
      var sb = titleScore(tb);      if (sb !== sa) return sb - sa;
      return ta.localeCompare(tb, 'fr');
    });

    return data;
  }

  /* ══════════════════════════════════════════════════════════
     APPEL API — avec fusion synonymes + marquage _via_syn
  ══════════════════════════════════════════════════════════ */
  var currentXhr  = null;
  var currentXhr2 = null;
  var _timerStart = 0;

  function fetchResults(query) {
    var cat     = catSel ? catSel.value : '';
    var isExact = exactCb && exactCb.checked;
    var key     = cacheKey(query, cat, isExact);

    var correction = getCorrection(query);
    if (correction && correction.toLowerCase() !== query.toLowerCase()) {
      showSuggestion(query, correction);
    } else {
      hideSuggestion();
    }

    if (cache[key]) {
      renderResults(cache[key], query);
      return;
    }

    if (currentXhr)  { currentXhr.abort();  currentXhr  = null; }
    if (currentXhr2) { currentXhr2.abort(); currentXhr2 = null; }
    spinner.classList.add('fcs__spinner--visible');
    _timerStart = Date.now();

    var synonymes    = getSynonymes(query);
    var resultsMain  = null;
    var resultsSyn   = null;
    var pendingCount = synonymes ? 2 : 1;

    function onAllDone() {
      spinner.classList.remove('fcs__spinner--visible');
      var combined = resultsMain || [];

      /* ── Fusion avec marquage _via_syn ────────────────── */
      if (resultsSyn && resultsSyn.length > 0) {
        var existingUrls = {};
        combined.forEach(function(item) {
          existingUrls[(item.url || item.link || '')] = true;
        });
        resultsSyn.forEach(function(item) {
          var url = item.url || item.link || '';
          if (!existingUrls[url]) {
            item._via_syn = synonymes[0];
            combined.push(item);
            existingUrls[url] = true;
          }
        });
      }

      combined = filterData(combined, query, cat, isExact);
      combined = sortByRelevance(combined, query);
      cache[key] = combined;
      renderResults(combined, query);
    }

    currentXhr = makeRequest(query, function(data) {
      resultsMain = data || [];
      pendingCount--;
      if (pendingCount === 0) onAllDone();
    }, function() {
      resultsMain = [];
      pendingCount--;
      if (pendingCount === 0) onAllDone();
    });

    if (synonymes && synonymes.length > 0) {
      currentXhr2 = makeRequest(synonymes[0], function(data) {
        resultsSyn = data || [];
        pendingCount--;
        if (pendingCount === 0) onAllDone();
      }, function() {
        resultsSyn = [];
        pendingCount--;
        if (pendingCount === 0) onAllDone();
      });
    }
  }

  function makeRequest(query, onSuccess, onError) {
    var url = API + '?q=' + encodeURIComponent(query);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        try { onSuccess(JSON.parse(xhr.responseText)); }
        catch(e) { onError(); }
      } else if (xhr.status === 0) {
        /* Abort */
      } else {
        var fallback = new XMLHttpRequest();
        fallback.open('GET', API_WP + '?search=' + encodeURIComponent(query) + '&per_page=100&type=post&subtype=any', true);
        fallback.onreadystatechange = function() {
          if (fallback.readyState !== 4) return;
          if (fallback.status === 200) {
            try { onSuccess(JSON.parse(fallback.responseText)); }
            catch(e) { onError(); }
          } else { onError(); }
        };
        fallback.onerror = onError;
        fallback.send();
      }
    };
    xhr.onerror = function() { renderNetworkError(); };
    xhr.send();
    return xhr;
  }

  /* ══════════════════════════════════════════════════════════
     LIEN IMAGES
  ══════════════════════════════════════════════════════════ */
  var imgLinkWrap   = document.getElementById('fcs-img-link');
  var imgLinkAnchor = document.getElementById('fcs-img-link-anchor');

  if (imgLinkWrap) {
    imgLinkWrap.addEventListener('click', function(e) {
      e.stopPropagation();
      setTimeout(function() { closeAll(); }, 80);
    });
  }

  function updateImgLink(q) {
    if (!imgLinkWrap) return;
    if (q && q.length >= MIN_CHARS) {
      var sidebarInput = document.getElementById('fci-input');
      if (sidebarInput) {
        imgLinkAnchor.href = '#fci-root';
        imgLinkAnchor.onclick = function(e) {
          e.preventDefault();
          sidebarInput.value = q;
          sidebarInput.dispatchEvent(new Event('input'));
          document.getElementById('fci-root').scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
      } else {
        imgLinkAnchor.onclick = null;
        var firstUrl = allResults.length > 0 ? (allResults[0].url || allResults[0].link || '') : '';
        if (firstUrl) {
          var sep = firstUrl.indexOf('?') !== -1 ? '&' : '?';
          imgLinkAnchor.href = firstUrl + sep + 'img=' + encodeURIComponent(q);
        } else {
          imgLinkWrap.style.display = 'none';
          return;
        }
      }
      imgLinkWrap.style.display = 'block';
    } else {
      imgLinkWrap.style.display = 'none';
    }
  }

  /* ══════════════════════════════════════════════════════════
     TRIGGER
  ══════════════════════════════════════════════════════════ */
  function triggerSearch(q) {
    q = (q || '').trim();
    if (!q) return;
    saveHistory(q);
    updateImgLink(q);
    fetchResults(q);
  }

  function goToResults() {
    var q = input.value.trim();
    if (!q) return;
    saveHistory(q);
    var url = SITE + '/?s=' + encodeURIComponent(q);
    var a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /* ══════════════════════════════════════════════════════════
     ÉVÉNEMENTS
  ══════════════════════════════════════════════════════════ */
  input.addEventListener('input', function() {
    var q = input.value.trim();
    clearBtn.classList.toggle('fcs__clear--visible', q.length > 0);

    if (q.length < MIN_CHARS) {
      if (currentXhr)  { currentXhr.abort();  currentXhr  = null; }
      if (currentXhr2) { currentXhr2.abort(); currentXhr2 = null; }
      spinner.classList.remove('fcs__spinner--visible');
      hideSuggestion();
      if (q.length === 0) {
        var h = getHistory();
        if (h.length) { renderHistory(); }
        else { closeAll(); }
      } else {
        closeAll();
      }
      return;
    }

    debounce(function() { triggerSearch(q); }, DEBOUNCE);
  });

  input.addEventListener('focus', function() {
    var q = input.value.trim();
    if (q.length >= MIN_CHARS) {
      if (dropdown.innerHTML.trim()) {
        dropdown.classList.add('fcs__dropdown--open');
        openOverlay();
      } else {
        triggerSearch(q);
      }
    } else if (!q) {
      var h = getHistory();
      if (h.length) renderHistory();
    }
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (items.length) updateActiveItem(Math.min(activeIndex + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (items.length) updateActiveItem(Math.max(activeIndex - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && items[activeIndex]) {
        var url   = items[activeIndex].getAttribute('data-url');
        var title = items[activeIndex].getAttribute('data-title');
        if (url && url !== '#') {
          if (title) saveHistory(title);
          window.open(url, '_blank');
        }
      } else {
        goToResults();
      }
    } else if (e.key === 'Escape') {
      closeAll();
      input.blur();
    }
  });

  clearBtn.addEventListener('click', function() {
    input.value = '';
    if (imgLinkWrap) imgLinkWrap.style.display = 'none';
    clearBtn.classList.remove('fcs__clear--visible');
    closeAll();
    input.focus();
  });

  submitBtn.addEventListener('click', goToResults);

  if (catSel) {
    catSel.addEventListener('change', function() {
      cache = {};
      var q = input.value.trim();
      if (q.length >= MIN_CHARS) triggerSearch(q);
    });
  }

  if (exactCb) {
    exactCb.addEventListener('change', function() {
      cache = {};
      var q = input.value.trim();
      if (q.length >= MIN_CHARS) triggerSearch(q);
    });
  }

  overlay.addEventListener('click', closeAll);

  document.addEventListener('click', function(e) {
    if (!root.contains(e.target) && !overlay.contains(e.target)) {
      closeAll();
    }
  });

  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });

  /* ══════════════════════════════════════════════════════════
     UTILITAIRES HTML
  ══════════════════════════════════════════════════════════ */
  function decodeHtml(str) {
    if (!str) return '';
    var tmp = document.createElement('textarea');
    tmp.innerHTML = str;
    return tmp.value;
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

})();

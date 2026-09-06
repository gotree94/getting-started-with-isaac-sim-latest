// Course search. Powers two surfaces that share one index and one
// matching/rendering pipeline:
//   1. The homepage inline search bar (#lp-search) with a dropdown.
//   2. A navbar search button (next to the theme toggle) that opens a floating
//      modal replicating the same search, available on every page.
// Data comes from each course's Sphinx search index, pre-generated into
// _static/lp-search-index.json. The course cards are never filtered.
(function () {
  // Synonym/misspelling groups: any token in a group matches the others.
  // Add new alternatives here (lowercase, single tokens, no spaces).
  var ALIASES = [
    ['gr00t', 'groot'],
    ['so-101', 'so101'],
    ['openusd', 'open-usd'],
    ['lerobot', 'le-robot'],
    ['unitree', 'g1'],
    ['jetson-thor', 'thor'],
    ['rebot', 're-bot'],
    ['seeed', 'seed'],
    ['ovrtx', 'ov-rtx'],
    ['ovphysx', 'ovphysics', 'ov-physx'],
    ['simready', 'sim-ready'],
  ];

  var MAX_RESULTS = 12;

  // Resolve the URL of the JSON index relative to this script's own location,
  // so it works regardless of the page's depth in the site.
  function indexUrl() {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute('src') || '';
      var marker = src.indexOf('lp-search.js');
      if (marker !== -1) {
        return src.slice(0, marker) + 'lp-search-index.json';
      }
    }
    return '_static/lp-search-index.json';
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Return the search variants for a typed token: the token itself plus any
  // alias-group members it relates to. A group is pulled in when the typed
  // token is a prefix of one of its members (or vice versa), so aliases also
  // resolve while the term is still being typed (e.g. "groo" -> "gr00t").
  function expandTerm(term) {
    var variants = [term];
    for (var i = 0; i < ALIASES.length; i++) {
      var group = ALIASES[i];
      var related = group.some(function (token) {
        return token.indexOf(term) === 0 || term.indexOf(token) === 0;
      });
      if (related) variants = variants.concat(group);
    }
    return variants;
  }

  function matches(haystack, terms) {
    return terms.every(function (term) {
      return expandTerm(term).some(function (variant) {
        return haystack.indexOf(variant) !== -1;
      });
    });
  }

  // --- Shared index + result helpers (used by both surfaces) ---

  var deepIndex = [];
  fetch(indexUrl())
    .then(function (resp) {
      return resp.ok ? resp.json() : [];
    })
    .then(function (data) {
      deepIndex = Array.isArray(data)
        ? data.map(function (e) {
            return {
              title: e.title,
              path: e.path,
              url: e.url,
              // `keywords` (optional) lets an entry match on inferred terms
              // that don't appear in its title, e.g. "RTX", "OVRTX", "ovphysx".
              haystack: (
                e.title + ' ' + e.path + ' ' + (e.keywords || '')
              ).toLowerCase(),
            };
          })
        : [];
    })
    .catch(function () {
      deepIndex = [];
    });

  function termsFromValue(value) {
    return value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  }

  function computeHits(terms) {
    var hits = [];
    for (var i = 0; i < deepIndex.length && hits.length < MAX_RESULTS; i++) {
      if (matches(deepIndex[i].haystack, terms)) hits.push(deepIndex[i]);
    }
    return hits;
  }

  function resultsHtml(hits) {
    if (!hits.length) {
      return '<div class="lp-search-empty">No matching pages</div>';
    }
    return hits
      .map(function (h) {
        return (
          '<a class="lp-search-item" href="' +
          escapeHtml(h.url) +
          '" target="_blank" rel="noopener noreferrer" role="option">' +
          '<span class="lp-search-item-title">' +
          escapeHtml(h.title) +
          '</span>' +
          '<span class="lp-search-item-path">' +
          escapeHtml(h.path) +
          '</span>' +
          '</a>'
        );
      })
      .join('');
  }

  // --- Homepage inline dropdown ---

  function setupInlineSearch() {
    var input = document.getElementById('lp-search');
    if (!input) return;

    var wrapper = input.closest('.lp-search-wrapper') || input.parentElement;
    var dropdown = document.createElement('div');
    dropdown.className = 'lp-search-dropdown';
    dropdown.setAttribute('role', 'listbox');
    if (wrapper) wrapper.appendChild(dropdown);

    function hideDropdown() {
      dropdown.classList.remove('lp-search-dropdown--open');
      dropdown.innerHTML = '';
    }

    function render() {
      var terms = termsFromValue(input.value);
      if (!terms.length) {
        hideDropdown();
        return;
      }
      dropdown.innerHTML = resultsHtml(computeHits(terms));
      dropdown.classList.add('lp-search-dropdown--open');
    }

    input.addEventListener('input', render);
    input.addEventListener('focus', render);
    // Delay so a click on a result registers before the dropdown closes.
    input.addEventListener('blur', function () {
      setTimeout(hideDropdown, 150);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideDropdown();
    });
  }

  // --- Navbar button + floating modal ---

  function addNavbarButton(onOpen) {
    var end = document.querySelector('.navbar-header-items__end');
    if (!end) return;

    var item = document.createElement('div');
    item.className = 'navbar-item';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-sm nav-link pst-navbar-icon lp-navbar-search-button';
    btn.setAttribute('aria-label', 'Search courses');
    btn.title = 'Search';
    btn.innerHTML = '<i class="fas fa-search"></i>';
    btn.addEventListener('click', onOpen);
    item.appendChild(btn);

    var themeBtn = end.querySelector('.theme-switch-button');
    var themeItem = themeBtn ? themeBtn.closest('.navbar-item') : null;
    end.insertBefore(item, themeItem || end.firstChild);
  }

  function buildModal() {
    var overlay = document.createElement('div');
    overlay.className = 'lp-search-modal';
    overlay.innerHTML =
      '<div class="lp-search-modal-panel" role="dialog" aria-modal="true"' +
      ' aria-label="Search courses">' +
      '<div class="lp-search-modal-field">' +
      '<span class="search-icon"><i class="fas fa-search"></i></span>' +
      '<input type="text" class="lp-search-input lp-search-modal-input"' +
      ' placeholder="Search courses and topics..."' +
      ' aria-label="Search courses">' +
      '</div>' +
      '<div class="lp-search-modal-results" role="listbox"></div>' +
      '</div>';
    document.body.appendChild(overlay);

    return {
      overlay: overlay,
      input: overlay.querySelector('.lp-search-modal-input'),
      results: overlay.querySelector('.lp-search-modal-results'),
    };
  }

  function setupModalSearch() {
    var modal = buildModal();

    function render() {
      var terms = termsFromValue(modal.input.value);
      modal.results.innerHTML = terms.length
        ? resultsHtml(computeHits(terms))
        : '';
    }

    function openModal() {
      modal.overlay.classList.add('lp-search-modal--open');
      render();
      modal.input.focus();
    }

    function closeModal() {
      modal.overlay.classList.remove('lp-search-modal--open');
      modal.input.value = '';
      modal.results.innerHTML = '';
    }

    modal.input.addEventListener('input', render);

    // Close when clicking the backdrop (outside the panel) or a result link.
    modal.overlay.addEventListener('click', function (e) {
      if (e.target === modal.overlay) closeModal();
      else if (e.target.closest('.lp-search-item')) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (
        e.key === 'Escape' &&
        modal.overlay.classList.contains('lp-search-modal--open')
      ) {
        closeModal();
      }
    });

    addNavbarButton(openModal);
  }

  function init() {
    setupInlineSearch();
    setupModalSearch();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

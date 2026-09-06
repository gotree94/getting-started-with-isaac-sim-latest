document.addEventListener("DOMContentLoaded", function () {
  // Lab 1 only: leave the static underscores on every other page untouched.
  if (window.location.pathname.indexOf("lab-1-rtx-viewport") === -1) {
    return;
  }

  // A run of 4+ underscores is an activity blank. The threshold avoids
  // identifiers like __init__ and single-underscore paths such as Session_1.
  var BLANK_RE = /_{4,}/g;

  function makeInput(length) {
    var input = document.createElement("input");
    input.type = "text";
    input.className = "fill-blank-input";
    input.setAttribute("aria-label", "Fill in the blank");
    input.setAttribute("autocomplete", "off");
    input.setAttribute("spellcheck", "false");
    input.style.width = Math.max(length, 3) + "ch";
    return input;
  }

  function replaceBlanks(textNode) {
    var value = textNode.nodeValue;
    var frag = document.createDocumentFragment();
    var lastIndex = 0;
    var match;
    BLANK_RE.lastIndex = 0;
    while ((match = BLANK_RE.exec(value))) {
      if (match.index > lastIndex) {
        frag.appendChild(document.createTextNode(value.slice(lastIndex, match.index)));
      }
      frag.appendChild(makeInput(match[0].length));
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < value.length) {
      frag.appendChild(document.createTextNode(value.slice(lastIndex)));
    }
    textNode.parentNode.replaceChild(frag, textNode);
  }

  // Only activity prose and code blocks: <pre> for code fences, table cells for
  // matching tables. Skip answer-reveal dropdowns (they hold filled-in text).
  var containers = document.querySelectorAll("pre, td, th");
  containers.forEach(function (container) {
    if (container.closest("details")) {
      return;
    }
    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    var matches = [];
    var current;
    while ((current = walker.nextNode())) {
      BLANK_RE.lastIndex = 0;
      if (BLANK_RE.test(current.nodeValue)) {
        matches.push(current);
      }
    }
    matches.forEach(replaceBlanks);
  });
});

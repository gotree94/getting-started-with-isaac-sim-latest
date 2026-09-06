// Interactive, persistent checklists for MyST task lists.
//
// MyST renders `- [ ]` task items as read-only checkboxes. This enables them and
// persists checked state to localStorage, keyed by page path. State is
// device/browser-local; clearing browser data resets it.
//
// Storage format (v1) keys each page as "checklist:<pathname>" and stores a map
// of checkbox ordinal -> boolean, matching the established course behavior. A
// future enhancement may switch to content-stable IDs.
document.addEventListener("DOMContentLoaded", function () {
  var pageKey = "checklist:" + window.location.pathname;
  var checkboxes = document.querySelectorAll(
    "ul.contains-task-list input[type='checkbox']"
  );
  var saved = {};

  try {
    saved = JSON.parse(localStorage.getItem(pageKey) || "{}");
  } catch (_) {
    saved = {};
  }

  checkboxes.forEach(function (cb, index) {
    cb.disabled = false;
    cb.style.cursor = "pointer";

    if (saved[index]) {
      cb.checked = true;
    }

    cb.addEventListener("change", function () {
      var state = {};
      try {
        state = JSON.parse(localStorage.getItem(pageKey) || "{}");
      } catch (_) {
        state = {};
      }
      state[index] = cb.checked;
      localStorage.setItem(pageKey, JSON.stringify(state));
    });
  });
});

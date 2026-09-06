document.addEventListener("DOMContentLoaded", function () {
  var pageKey = "checklist:" + window.location.pathname;
  var checkboxes = document.querySelectorAll("ul.contains-task-list input[type='checkbox']");
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

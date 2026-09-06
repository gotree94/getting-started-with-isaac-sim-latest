/* Make It Yours: Prompt Builder
 * Vanilla JS. No build step. Reads templates from window.TEMPLATES (templates.js).
 */
(function () {
  "use strict";

  var TEMPLATES = (window.TEMPLATES || []).slice();
  var SESSIONS = (window.SESSIONS || []).slice();

  // Per-template answer state, so switching templates keeps your work.
  var state = {};
  var currentId = null;

  // ---- Sentinels for highlighting (chars that won't appear in prompts) ----
  var F_OPEN = "\u0001F\u0002";
  var MARK_CLOSE = "\u0003";

  // Sentinel option value for a select's "Create your own..." escape hatch.
  var CUSTOM = "\u0001CUSTOM\u0002";

  // ---------- DOM refs ----------
  var sessionSelect = document.getElementById("session-select");
  var sessionCol = document.getElementById("session-col");
  var selectEl = document.getElementById("template-select");
  var blurbEl = document.getElementById("template-blurb");
  var contextEl = document.getElementById("template-context");
  var formEl = document.getElementById("madlibs-form");
  var previewEl = document.getElementById("preview");
  var toastEl = document.getElementById("toast");
  var copyBtn = document.getElementById("copy-btn");
  var downloadBtn = document.getElementById("download-btn");

  // Decision-enabled templates keep the tested Goal and Skills untouched.
  // Two optional fields are injected only into the existing Context and
  // Done when lines; when blank, the assembled prompt is identical.
  TEMPLATES.forEach(function (tpl) {
    if (!tpl.decisionBrief) return;
    tpl.sections = (tpl.sections || []).slice();
    tpl.sections.unshift({
      title: "Your 3D Decision",
      help: "Use your spatial and visual judgment to customize the mission's context and acceptance criteria.",
      decisionBrief: true,
      fields: [
        {
          id: "expert_context",
          label: "Your context",
          type: "textarea",
          optional: true,
          placeholder: "Add the design intent the agent should account for."
        },
        {
          id: "expert_done_when",
          label: "Your acceptance criteria",
          type: "textarea",
          optional: true,
          placeholder: "Define the evidence you will use to approve the result."
        }
      ]
    });
    tpl.template = String(tpl.template || "").replace(
      /(^|\n)(Context:[^\n]*)/,
      "$1$2[[expert_context| Learner-authored 3D brief: {{expert_context}}]]"
    );
    tpl.template += "[[expert_done_when| Learner acceptance criteria: {{expert_done_when}}]]";
  });

  // ---------- Helpers ----------
  function getTemplate(id) {
    for (var i = 0; i < TEMPLATES.length; i++) {
      if (TEMPLATES[i].id === id) return TEMPLATES[i];
    }
    return null;
  }

  function eachField(tpl, fn) {
    (tpl.sections || []).forEach(function (section) {
      (section.fields || []).forEach(function (field) {
        fn(field, section);
      });
    });
  }

  function normalizeOptions(options) {
    return (options || []).map(function (opt) {
      if (typeof opt === "string") return { value: opt, label: opt };
      return { value: opt.value, label: opt.label != null ? opt.label : opt.value };
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Does the user have a meaningful (non-default) value for this field?
  function hasUserValue(field, answers) {
    var v = answers[field.id];
    if (field.type === "multiselect") return Array.isArray(v) && v.length > 0;
    if (field.type === "slider") return v != null && v !== "";
    return v != null && String(v).trim() !== "";
  }

  // Does this field declare a non-empty default to fall back to when blank?
  // (Sliders always carry a value; any other type may opt in via `default`.)
  function hasDefault(field) {
    return field.default != null && String(field.default) !== "";
  }

  // Will this field contribute text - either from the user or from a default?
  function hasValueOrDefault(field, answers) {
    return hasUserValue(field, answers) || hasDefault(field);
  }

  // The string the user actually chose (no default fallback).
  function rawValue(field, answers) {
    var v = answers[field.id];
    if (field.type === "multiselect") return Array.isArray(v) ? v.join(", ") : "";
    if (v == null) return "";
    return String(v);
  }

  // Value to inject. A blank field contributes NOTHING - no defaults are
  // injected. The one exception is a slider, which always contributes its
  // current position (falling back to its `default` starting value).
  function resolvedValue(field, answers) {
    if (hasUserValue(field, answers)) {
      var raw = rawValue(field, answers);
      if (field.type === "slider" && field.unit) raw += " " + field.unit;
      return { text: raw, filled: true };
    }
    // No user value: fall back to a declared default, if any. Sliders always
    // have an implicit default position; any other field type may opt in by
    // declaring `default` (e.g. an output-folder name that should always show).
    if (hasDefault(field)) {
      var def = String(field.default);
      if (field.type === "slider" && field.unit) def += " " + field.unit;
      return { text: def, filled: true };
    }
    return { text: "", filled: false };
  }

  // Tidy up the assembled prompt: strip trailing spaces and collapse the blank
  // lines that removed optional blocks can leave behind, so the output stays
  // clean no matter which fields the learner skipped.
  function cleanup(text) {
    var lines = text.split("\n").map(function (l) { return l.replace(/[ \t]+$/, ""); });
    var out = [];
    for (var i = 0; i < lines.length; i++) {
      if (lines[i] === "" && out.length && out[out.length - 1] === "") continue;
      out.push(lines[i]);
    }
    while (out.length && out[0] === "") out.shift();
    while (out.length && out[out.length - 1] === "") out.pop();
    return out.join("\n");
  }

  // ---------- Templating engine ----------
  // 1) [[fieldId | inner text with {{fieldId}} ]] -> kept only when the user
  //    provided a value; otherwise removed entirely.
  // 2) {{fieldId}} -> the learner's answer, or nothing (sliders excepted).
  function assemble(tpl, answers, opts) {
    opts = opts || {};
    var fieldMap = {};
    eachField(tpl, function (f) { fieldMap[f.id] = f; });

    var text = tpl.template || "";

    // Optional blocks first. Unknown ids are left literal (so a template can
    // safely document the [[id| ... ]] syntax as plain text).
    text = text.replace(/\[\[\s*(\w+)\s*\|([\s\S]*?)\]\]/g, function (whole, id, inner) {
      var field = fieldMap[id];
      if (!field) return whole;
      return hasValueOrDefault(field, answers) ? inner : "";
    });

    // Placeholders.
    text = text.replace(/\{\{\s*(\w+)\s*\}\}/g, function (whole, id) {
      var field = fieldMap[id];
      if (!field) return whole;
      var r = resolvedValue(field, answers);
      if (r.text === "") return "";
      if (!opts.highlight) return r.text;
      return F_OPEN + r.text + MARK_CLOSE;
    });

    return cleanup(text);
  }

  // Wrap line-initial "Label:" prefixes in <strong> for the preview only. This
  // is generic (works for any project's labels), with an optional per-template
  // override: boldLabels: ["Goal", "Docs"] to limit it, or false to disable.
  function boldLabels(html, tpl) {
    if (tpl && tpl.boldLabels === false) return html;
    var only = tpl && Array.isArray(tpl.boldLabels) ? tpl.boldLabels : null;
    return html.split("\n").map(function (line) {
      var m = line.match(/^(\s*)([A-Za-z][\w \/-]*?:)([\s\S]*)$/);
      if (!m) return line;
      if (only && only.indexOf(m[2].replace(/:$/, "")) === -1) return line;
      return m[1] + "<strong>" + m[2] + "</strong>" + m[3];
    }).join("\n");
  }

  function assembleHighlighted(tpl, answers) {
    var marked = assemble(tpl, answers, { highlight: true });
    var html = escapeHtml(marked);
    html = html
      .split(F_OPEN).join('<span class="filled">')
      .split(MARK_CLOSE).join("</span>");
    return boldLabels(html, tpl);
  }

  // ---------- Rendering the form ----------
  function fieldControl(field, answers) {
    var wrap = document.createElement("div");
    var value = answers[field.id];

    if (field.type === "textarea") {
      var ta = document.createElement("textarea");
      ta.id = "f-" + field.id;
      if (field.placeholder) ta.placeholder = field.placeholder;
      ta.value = value != null ? value : "";
      ta.addEventListener("input", function () {
        answers[field.id] = ta.value;
        onChange();
      });
      wrap.appendChild(ta);
    } else if (field.type === "select") {
      var sel = document.createElement("select");
      sel.id = "f-" + field.id;
      var opts = normalizeOptions(field.options);
      var placeholderOpt = document.createElement("option");
      placeholderOpt.value = "";
      placeholderOpt.textContent = field.placeholder || "Select\u2026";
      sel.appendChild(placeholderOpt);
      opts.forEach(function (o) {
        var el = document.createElement("option");
        el.value = o.value;
        el.textContent = o.label;
        sel.appendChild(el);
      });

      if (field.allowCustom) {
        // Append a "Create your own..." option that reveals a write-in field.
        var customOpt = document.createElement("option");
        customOpt.value = CUSTOM;
        customOpt.textContent = field.customLabel || "Create your own\u2026";
        sel.appendChild(customOpt);

        var box = document.createElement("div");
        box.className = "custom-select";
        var customInput = document.createElement("input");
        customInput.type = "text";
        customInput.className = "custom-input";
        customInput.placeholder = field.customPlaceholder || "Type your own\u2026";

        // Restore custom mode across template switches / re-renders.
        var isCustom = answers[field.id + "$mode"] === "custom";
        sel.value = isCustom ? CUSTOM : (value != null ? value : "");
        customInput.style.display = isCustom ? "" : "none";
        customInput.value = isCustom ? (value != null ? value : "") : "";

        sel.addEventListener("change", function () {
          if (sel.value === CUSTOM) {
            answers[field.id + "$mode"] = "custom";
            customInput.style.display = "";
            answers[field.id] = customInput.value;
            customInput.focus();
          } else {
            delete answers[field.id + "$mode"];
            customInput.style.display = "none";
            answers[field.id] = sel.value;
          }
          onChange();
        });
        customInput.addEventListener("input", function () {
          answers[field.id] = customInput.value;
          onChange();
        });

        box.appendChild(sel);
        box.appendChild(customInput);
        wrap.appendChild(box);
      } else {
        sel.value = value != null ? value : "";
        sel.addEventListener("change", function () {
          answers[field.id] = sel.value;
          onChange();
        });
        wrap.appendChild(sel);
      }
    } else if (field.type === "radio") {
      var rg = document.createElement("div");
      rg.className = "radio-group";
      normalizeOptions(field.options).forEach(function (o) {
        var label = document.createElement("label");
        label.className = "chip" + (value === o.value ? " checked" : "");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "f-" + field.id;
        input.value = o.value;
        input.checked = value === o.value;
        input.addEventListener("change", function () {
          answers[field.id] = o.value;
          var chips = rg.querySelectorAll(".chip");
          for (var ci = 0; ci < chips.length; ci++) chips[ci].classList.remove("checked");
          label.classList.add("checked");
          onChange();
        });
        label.appendChild(input);
        label.appendChild(document.createTextNode(o.label));
        rg.appendChild(label);
      });
      wrap.appendChild(rg);
    } else if (field.type === "multiselect") {
      var cg = document.createElement("div");
      cg.className = "chip-group";
      var arr = Array.isArray(value) ? value : [];
      normalizeOptions(field.options).forEach(function (o) {
        var checked = arr.indexOf(o.value) !== -1;
        var label = document.createElement("label");
        label.className = "chip" + (checked ? " checked" : "");
        var input = document.createElement("input");
        input.type = "checkbox";
        input.value = o.value;
        input.checked = checked;
        input.addEventListener("change", function () {
          var cur = Array.isArray(answers[field.id]) ? answers[field.id].slice() : [];
          var idx = cur.indexOf(o.value);
          if (input.checked && idx === -1) cur.push(o.value);
          if (!input.checked && idx !== -1) cur.splice(idx, 1);
          answers[field.id] = cur;
          label.classList.toggle("checked", input.checked);
          onChange();
        });
        label.appendChild(input);
        label.appendChild(document.createTextNode(o.label));
        cg.appendChild(label);
      });
      wrap.appendChild(cg);
    } else if (field.type === "slider") {
      var row = document.createElement("div");
      row.className = "slider-row";
      var range = document.createElement("input");
      range.type = "range";
      range.id = "f-" + field.id;
      range.min = field.min != null ? field.min : 0;
      range.max = field.max != null ? field.max : 100;
      range.step = field.step != null ? field.step : 1;
      var cur = value != null && value !== "" ? value : (field.default != null ? field.default : range.min);
      range.value = cur;
      answers[field.id] = Number(range.value);
      var out = document.createElement("span");
      out.className = "slider-value";
      out.textContent = range.value + (field.unit ? " " + field.unit : "");
      range.addEventListener("input", function () {
        answers[field.id] = Number(range.value);
        out.textContent = range.value + (field.unit ? " " + field.unit : "");
        onChange();
      });
      row.appendChild(range);
      row.appendChild(out);
      wrap.appendChild(row);
    } else {
      var input = document.createElement("input");
      input.type = "text";
      input.id = "f-" + field.id;
      if (field.placeholder) input.placeholder = field.placeholder;
      input.value = value != null ? value : "";
      input.addEventListener("input", function () {
        answers[field.id] = input.value;
        onChange();
      });
      wrap.appendChild(input);
    }

    return wrap.childNodes[0];
  }

  function renderForm(tpl, answers) {
    formEl.innerHTML = "";
    (tpl.sections || []).forEach(function (section) {
      var secEl = document.createElement("section");
      secEl.className = "form-section" + (section.divider ? " form-section--divider" : "") + (section.decisionBrief ? " form-section--decision-brief" : "");

      // Optional horizontal bar above a section (e.g. a "bonus" group).
      if (section.divider) {
        var hr = document.createElement("hr");
        hr.className = "section-divider";
        secEl.appendChild(hr);
      }

      if (section.title) {
        var h = document.createElement("h3");
        h.className = "section-title";
        h.textContent = section.title;
        secEl.appendChild(h);
      }
      if (section.help) {
        var p = document.createElement("p");
        p.className = "section-help";
        p.textContent = section.help;
        secEl.appendChild(p);
      }

      (section.fields || []).forEach(function (field) {
        var fieldEl = document.createElement("div");
        fieldEl.className = "field";
        fieldEl.dataset.fieldId = field.id;

        var labelEl = document.createElement("label");
        labelEl.className = "field-label";
        if (field.type !== "radio" && field.type !== "multiselect") {
          labelEl.setAttribute("for", "f-" + field.id);
        }
        labelEl.appendChild(document.createTextNode(field.label || field.id));
        if (field.optional) {
          var tag = document.createElement("span");
          tag.className = "optional-tag";
          tag.textContent = "optional";
          labelEl.appendChild(tag);
        }
        fieldEl.appendChild(labelEl);

        if (field.help) {
          var help = document.createElement("p");
          help.className = "field-help";
          help.textContent = field.help;
          fieldEl.appendChild(help);
        }

        fieldEl.appendChild(fieldControl(field, answers));

        var flag = document.createElement("p");
        flag.className = "field-flag";
        flag.textContent = "Not added yet - fill this in to include it.";
        fieldEl.appendChild(flag);

        secEl.appendChild(fieldEl);
      });

      formEl.appendChild(secEl);
    });
  }

  function updateFlags(tpl, answers) {
    eachField(tpl, function (field) {
      var el = formEl.querySelector('.field[data-field-id="' + field.id + '"]');
      if (!el) return;
      var needsFlag = !field.optional && !hasUserValue(field, answers);
      el.classList.toggle("missing", needsFlag);
    });
  }

  // ---------- Change handling ----------
  function setActionsEnabled(on) {
    if (copyBtn) {
      copyBtn.disabled = !on;
      copyBtn.title = on ? "" : "Fill in at least one field to copy your prompt.";
    }
    if (downloadBtn) {
      downloadBtn.disabled = !on;
      downloadBtn.title = on ? "" : "Fill in at least one field to download your prompt.";
    }
  }

  function onChange() {
    var tpl = getTemplate(currentId);
    if (!tpl) return;
    var answers = state[currentId];
    previewEl.innerHTML = assembleHighlighted(tpl, answers);
    updateFlags(tpl, answers);
    // Enable copy/download whenever there's a prompt to copy. Many templates
    // are useful as-is (the blank form previews a complete, tested prompt), so
    // we gate on "the assembled prompt is non-empty" rather than "a field was
    // filled" - otherwise all-optional templates could never be copied.
    var plain = assemble(tpl, answers, { highlight: false });
    setActionsEnabled(plain.trim() !== "");
  }

  // Render the optional, prominent "why / what you'll achieve" callout.
  // `context` may be a string (one or more paragraphs) or an array of bullet
  // strings. An object form { heading, body } is also accepted. When absent,
  // the callout is hidden entirely - keeping the reuse contract intact.
  function renderContext(tpl) {
    if (!contextEl) return;
    var ctx = tpl.context;
    var heading = "Why This Prompt";
    var body = ctx;
    if (ctx && typeof ctx === "object" && !Array.isArray(ctx)) {
      if (ctx.heading) heading = ctx.heading;
      body = ctx.body;
    }
    var hasBody = Array.isArray(body) ? body.length > 0
      : (body != null && String(body).trim() !== "");
    if (!hasBody) {
      contextEl.hidden = true;
      contextEl.innerHTML = "";
      return;
    }

    var html = '<p class="context-heading">' + escapeHtml(heading) + "</p>";
    if (Array.isArray(body)) {
      html += "<ul>";
      body.forEach(function (item) {
        html += "<li>" + escapeHtml(item) + "</li>";
      });
      html += "</ul>";
    } else {
      String(body).split(/\n{2,}/).forEach(function (para) {
        if (para.trim() !== "") html += "<p>" + escapeHtml(para.trim()) + "</p>";
      });
    }
    contextEl.innerHTML = html;
    contextEl.hidden = false;
  }

  function selectTemplate(id) {
    currentId = id;
    var tpl = getTemplate(id);
    if (!tpl) return;
    if (!state[id]) state[id] = {};
    blurbEl.textContent = tpl.blurb || tpl.subtitle || "";
    renderContext(tpl);
    renderForm(tpl, state[id]);
    onChange();
  }

  // ---------- Actions ----------
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 1800);
  }

  function currentPlainText() {
    var tpl = getTemplate(currentId);
    if (!tpl) return "";
    return assemble(tpl, state[currentId], { highlight: false });
  }

  function copyPrompt() {
    if (copyBtn && copyBtn.disabled) return;
    var text = currentPlainText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { showToast("Prompt copied to clipboard"); },
        function () { fallbackCopy(text); }
      );
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast("Prompt copied to clipboard");
    } catch (e) {
      showToast("Copy failed \u2014 select and copy manually");
    }
    document.body.removeChild(ta);
  }

  function downloadPrompt() {
    if (downloadBtn && downloadBtn.disabled) return;
    var tpl = getTemplate(currentId);
    if (!tpl) return;
    var text = currentPlainText();
    var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = (tpl.id || "prompt") + "-prompt.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Downloaded " + a.download);
  }

  function resetTemplate() {
    if (!currentId) return;
    state[currentId] = {};
    selectTemplate(currentId);
    showToast("Answers reset");
  }

  // ---------- Sessions ----------
  // Sessions are optional. They're only active when window.SESSIONS is defined
  // AND at least one template declares a `session`; otherwise the app falls
  // back to a single flat prompt list (and hides the session dropdown).
  function sessionsActive() {
    return SESSIONS.length > 0 && TEMPLATES.some(function (t) { return t.session; });
  }

  function templatesForSession(sid) {
    return TEMPLATES.filter(function (t) {
      return t.session === sid || t.session === "*";
    });
  }

  function populatePrompts(list) {
    selectEl.innerHTML = "";
    list.forEach(function (tpl) {
      var opt = document.createElement("option");
      opt.value = tpl.id;
      opt.textContent = tpl.title || tpl.id;
      selectEl.appendChild(opt);
    });
  }

  function showEmptySession() {
    currentId = null;
    blurbEl.textContent = "";
    if (contextEl) { contextEl.hidden = true; contextEl.innerHTML = ""; }
    formEl.innerHTML = '<p class="section-help">No prompts yet for this session.</p>';
    previewEl.innerHTML = "";
    setActionsEnabled(false);
  }

  function onSessionChange(sid) {
    var list = templatesForSession(sid);
    populatePrompts(list);
    if (!list.length) {
      showEmptySession();
      return;
    }
    selectEl.value = list[0].id;
    selectTemplate(list[0].id);
  }

  // ---------- Init ----------
  function init() {
    if (!TEMPLATES.length) {
      formEl.innerHTML = '<p class="section-help">No templates found. Check templates.js.</p>';
      setActionsEnabled(false);
      return;
    }

    selectEl.addEventListener("change", function () {
      selectTemplate(selectEl.value);
    });
    copyBtn.addEventListener("click", copyPrompt);
    downloadBtn.addEventListener("click", downloadPrompt);
    document.getElementById("reset-btn").addEventListener("click", resetTemplate);

    if (sessionsActive()) {
      SESSIONS.forEach(function (s) {
        var opt = document.createElement("option");
        opt.value = s.id;
        opt.textContent = s.name || s.id;
        sessionSelect.appendChild(opt);
      });
      sessionSelect.addEventListener("change", function () {
        onSessionChange(sessionSelect.value);
      });
      sessionSelect.value = SESSIONS[0].id;
      onSessionChange(SESSIONS[0].id);
    } else {
      if (sessionCol) sessionCol.style.display = "none";
      populatePrompts(TEMPLATES);
      selectEl.value = TEMPLATES[0].id;
      selectTemplate(TEMPLATES[0].id);
    }
  }

  init();
})();

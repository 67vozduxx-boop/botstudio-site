// ===== НАСТРОЙКИ: меняйте только здесь =====
var CONFIG = {
  brand: "BotStudio",                 // название студии (меняется везде)
  telegram: "https://t.me/USERNAME"   // замените USERNAME на ваш username в Telegram
};
// ===========================================

(function () {
  "use strict";

  // Название, ссылки на Telegram, год
  document.title = document.title.replace("BotStudio", CONFIG.brand);
  document.querySelectorAll("[data-brand]").forEach(function (el) {
    el.textContent = CONFIG.brand;
  });
  document.querySelectorAll("[data-tg]").forEach(function (el) {
    el.href = CONFIG.telegram;
  });
  document.getElementById("year").textContent = new Date().getFullYear();

  // Мобильное меню
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  }
  burger.addEventListener("click", function () {
    setMenu(!nav.classList.contains("open"));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  // Кнопки «Заказать»: подставляют тип и услугу в форму
  var typeSel = document.getElementById("f-type");
  var textArea = document.getElementById("f-text");
  document.querySelectorAll("button.link[data-type]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      typeSel.value = btn.getAttribute("data-type");
      if (!textArea.value.trim()) {
        textArea.value = "Хочу заказать: " + btn.getAttribute("data-note") + ". ";
      }
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
      setTimeout(function () { textArea.focus({ preventScroll: true }); }, 500);
    });
  });

  // Форма. Сервера нет, поэтому заявка копируется, а человек отправляет её сам в Telegram.
  var form = document.getElementById("form");
  var note = document.getElementById("form-note");
  var nameInput = document.getElementById("f-name");

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); }
      catch (err) { reject(err); }
      document.body.removeChild(ta);
    });
  }

  function show(cls, html) {
    note.className = cls;
    note.innerHTML = html;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = nameInput.value.trim();
    var desc = textArea.value.trim();
    nameInput.classList.toggle("bad", !name);
    textArea.classList.toggle("bad", !desc);
    if (!name || !desc) {
      show("err", "Заполните имя и описание задачи.");
      return;
    }
    var text = "Заявка с сайта " + CONFIG.brand + "\n" +
      "Имя: " + name + "\n" +
      "Тип проекта: " + typeSel.value + "\n" +
      "Задача: " + desc;
    var link = '<a href="' + CONFIG.telegram + '" target="_blank" rel="noopener">Открыть Telegram</a>';
    copyText(text).then(function () {
      show("ok", "Заявка скопирована, но ещё не отправлена. " + link +
        " и вставьте текст в чат.");
    }).catch(function () {
      show("err", "Не удалось скопировать автоматически. Выделите текст вручную и отправьте его в " + link + ".");
    });
  });
})();

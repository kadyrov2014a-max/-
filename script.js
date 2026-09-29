/* ==========================================
   ПУШКИН — INTERACTIVE MUSEUM
   Автор: Амангельдиева, Тамина
========================================== */


/* ================= INTRO ================= */

const intro = document.getElementById("intro");
const enterBtn = document.getElementById("enterBtn");

enterBtn.addEventListener("click", () => {
    intro.classList.add("hide");

    setTimeout(() => {
        document.body.style.overflow = "auto";
    }, 900);
});


/* ================= PUSHKIN SPEECH ================= */

const speakBtn = document.getElementById("speakBtn");
const stopBtn = document.getElementById("stopBtn");
const voiceStatus = document.getElementById("voiceStatus");
const speechText = document.getElementById("speechText");


const pushkinText = [

    "Здравствуйте. Я — Александр Сергеевич Пушкин.",

    "Я родился 6 июня 1799 года в Москве, в дворянской семье.",

    "В 1811 году я поступил в Царскосельский лицей. Именно там начался мой настоящий путь в литературе.",

    "После окончания лицея я много писал. Мои стихи становились известными, но за свободолюбивые взгляды я оказался вдали от столицы.",

    "Я побывал на юге России, жил в Кишинёве, Одессе, Михайловском. В это время появились многие мои известные произведения.",

    "Одним из главных произведений моей жизни стал роман в стихах «Евгений Онегин».",

    "В 1831 году я женился на Наталье Гончаровой. Я продолжал работать над стихами, прозой и историческими произведениями.",

    "В последние годы моей жизни вокруг меня было много сложностей.",

    "В январе 1837 года произошла дуэль с Жоржем Дантесом. Через два дня, 29 января по старому стилю, я умер.",

    "Мне было всего тридцать семь лет.",

    "Но моя жизнь продолжилась в моих книгах, стихах и строках.",

    "Спасибо, что сегодня вы снова открыли мою историю."
].join(" ");


/* -------- VOICE ENGINE -------- */

let voices = [];
let selectedVoice = null;


/*
    Загружаем голоса браузера.
*/

function loadVoices() {

    if (!("speechSynthesis" in window)) {
        return;
    }

    voices = window.speechSynthesis.getVoices();

    /*
       Сначала ищем русский мужской голос.
       Названия отличаются на разных устройствах,
       поэтому используем несколько вариантов.
    */

    const maleKeywords = [
        "male",
        "муж",
        "мужской",
        "yuri",
        "dmitry",
        "dmitri",
        "alex",
        "alexander",
        "pavel",
        "nikolay",
        "nikolai",
        "sergey",
        "sergei",
        "maxim",
        "maksim"
    ];

    const russianVoices = voices.filter(voice =>
        voice.lang &&
        voice.lang.toLowerCase().startsWith("ru")
    );

    selectedVoice =
        russianVoices.find(voice => {
            const name = voice.name.toLowerCase();

            return maleKeywords.some(keyword =>
                name.includes(keyword)
            );
        }) ||

        russianVoices[0] ||

        voices.find(voice =>
            voice.lang &&
            voice.lang.toLowerCase().includes("ru")
        ) ||

        null;
}


loadVoices();


if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
}


/* -------- CHECK SUPPORT -------- */

function checkSpeechSupport() {

    if (!("speechSynthesis" in window)) {

        voiceStatus.innerHTML =
            "⚠ Голос недоступен в этом браузере. Откройте сайт в Chrome или Safari.";

        return false;
    }

    return true;
}


/* -------- SPEAK -------- */

function speakPushkin() {

    if (!checkSpeechSupport()) {
        return;
    }

    window.speechSynthesis.cancel();

    /*
       Иногда браузеру требуется небольшая задержка,
       чтобы список голосов успел загрузиться.
    */

    loadVoices();

    const utterance =
        new SpeechSynthesisUtterance(pushkinText);

    utterance.lang = "ru-RU";

    /*
       Голос немного медленнее обычной речи,
       чтобы звучало как литературный рассказ.
    */

    utterance.rate = 0.88;

    /*
       Высота немного ниже,
       насколько это позволяет конкретный голос.
    */

    utterance.pitch = 0.78;

    utterance.volume = 1;


    if (selectedVoice) {
        utterance.voice = selectedVoice;

        voiceStatus.innerHTML =
            "🔊 Пушкин рассказывает свою историю…";
    } else {

        voiceStatus.innerHTML =
            "🔊 Включён русский голос браузера…";
    }


    utterance.onstart = () => {
        speakBtn.innerHTML = "Ⅱ";
        speakBtn.disabled = true;

        voiceStatus.innerHTML =
            "🔊 Александр Сергеевич Пушкин говорит…";
    };


    utterance.onend = () => {

        speakBtn.innerHTML = "▶";
        speakBtn.disabled = false;

        voiceStatus.innerHTML =
            "Рассказ завершён. Нажмите ▶, чтобы прослушать снова.";
    };


    utterance.onerror = (event) => {

        speakBtn.innerHTML = "▶";
        speakBtn.disabled = false;

        voiceStatus.innerHTML =
            "⚠ Не удалось включить голос. Попробуйте открыть сайт в Chrome.";
        
        console.log("Speech error:", event);
    };


    window.speechSynthesis.speak(utterance);
}


/* -------- STOP -------- */

function stopPushkin() {

    if ("speechSynthesis" in window) {

        window.speechSynthesis.cancel();

        speakBtn.innerHTML = "▶";
        speakBtn.disabled = false;

        voiceStatus.innerHTML =
            "Рассказ остановлен.";
    }
}


speakBtn.addEventListener("click", speakPushkin);
stopBtn.addEventListener("click", stopPushkin);


/* ================= SMOOTH NAVIGATION ================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function(event) {

        const target = document.querySelector(
            this.getAttribute("href")
        );

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth"
        });

    });

});


/* ================= SCROLL ANIMATION ================= */

const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                }

            });

        },
        {
            threshold: 0.15
        }
    );


document.querySelectorAll(
    ".timeline-item, .book, .museum-card"
).forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition =
        "opacity .8s ease, transform .8s ease";

    observer.observe(element);

});


/* Добавляем класс visible */

const style = document.createElement("style");

style.innerHTML = `

.timeline-item.visible,
.book.visible,
.museum-card.visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
}

`;

document.head.appendChild(style);


/* ================= PORTRAIT INTERACTION ================= */

/*
   Лёгкое движение портрета при движении мыши.
*/

const portrait = document.querySelector(".portrait-frame");

if (portrait) {

    document.addEventListener("mousemove", event => {

        if (window.innerWidth < 850) return;

        const x =
            (event.clientX / window.innerWidth - 0.5);

        const y =
            (event.clientY / window.innerHeight - 0.5);

        portrait.style.transform =
            `rotate(2deg) rotateY(${x * 5}deg) translateY(${y * -5}px)`;

    });

}


/* ================= MOBILE VOICE MESSAGE ================= */

/*
   Instagram / некоторые встроенные браузеры могут
   ограничивать SpeechSynthesis.

   Если сайт открыт внутри приложения,
   предлагаем обычный браузер.
*/

const browserWarning = document.createElement("div");

browserWarning.className = "browser-warning";

browserWarning.innerHTML = `
    Если голос не включается,
    откройте эту страницу в обычном Chrome или Safari.
`;

document.body.appendChild(browserWarning);


/* ================= CONSOLE ================= */

console.log(
    "Пушкин — интерактивный литературный музей."
);

console.log(
    "Проект: Амангельдиева, Тамина"
);

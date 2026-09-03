/* =========================================
   TISA BIRTHDAY EXPERIENCE
========================================= */

let currentPage = 1;
let memoryNumber = 0;
let candles = 0;
let playing = false;

const memories = [
    { image: "photos/photo1.jpg", text: "A moment I never want to forget. ❤️" },
    { image: "photos/photo2.jpeg", text: "One of those little moments that became special." },
    { image: "photos/photo3.jpeg", text: "Your smile makes everything feel a little brighter." },
    { image: "photos/photo4.jpeg", text: "Another beautiful memory I want to keep forever." },
    { image: "photos/photo5.jpeg", text: "And hopefully, many more memories are waiting for us. ❤️" }
];

const music = document.getElementById("music");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");


/* =========================================
   PAGE SYSTEM
========================================= */

function showPage(number) {
    currentPage = number;

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const target = document.getElementById("page" + number);
    if (target) target.classList.add("active");

    progressFill.style.width = (number / 8 * 100) + "%";
    progressText.innerText = number + " / 8";

    window.scrollTo(0, 0);

    burstSparkles(window.innerWidth / 2, window.innerHeight / 2, 10);

    if (number === 6) {
        setTimeout(() => revealLetter(), 250);
    }

    if (number === 8) {
        setTimeout(() => {
            fireworks();
            burstHearts();
        }, 350);
    }
}


/* =========================================
   MUSIC
========================================= */

function startMusic() {
    if (!music || playing) return;

    music.volume = 0.65;

    music.play()
        .then(() => {
            playing = true;
            document.getElementById("musicButton").innerText = "🔊";
        })
        .catch(() => {
            // Browser may require another user interaction.
        });
}

function musicControl() {
    if (!playing) {
        music.play()
            .then(() => {
                playing = true;
                document.getElementById("musicButton").innerText = "🔊";
            })
            .catch(() => {
                document.getElementById("musicButton").innerText = "🎵";
            });
    } else {
        music.pause();
        playing = false;
        document.getElementById("musicButton").innerText = "🎵";
    }
}


/* =========================================
   FIRST SURPRISE
========================================= */

function openGift() {
    startMusic();
    giftExplosion();
    confetti(70);

    const gift = document.querySelector(".gift");
    if (gift) {
        gift.animate(
            [
                { transform: "scale(1) rotate(0)" },
                { transform: "scale(1.35) rotate(-8deg)" },
                { transform: "scale(.2) rotate(20deg)", opacity: 0 }
            ],
            { duration: 800, easing: "cubic-bezier(.16,1,.3,1)" }
        );
    }

    setTimeout(() => showPage(2), 900);
}


/* =========================================
   MEMORIES
========================================= */

function nextMemory() {
    memoryNumber++;

    if (memoryNumber >= memories.length) {
        memoryNumber = 0;
        showPage(4);
        return;
    }

    const image = document.getElementById("mainPhoto");
    const caption = document.getElementById("photoCaption");
    const current = document.getElementById("memoryCurrent");

    image.style.opacity = "0";
    image.style.transform = "scale(1.06)";

    setTimeout(() => {
        image.src = memories[memoryNumber].image;
        caption.innerText = memories[memoryNumber].text;
        current.innerText = String(memoryNumber + 1).padStart(2, "0");

        image.style.opacity = "1";
        image.style.transform = "scale(1)";
        burstSparkles(window.innerWidth / 2, window.innerHeight * .42, 14);
    }, 300);
}


/* =========================================
   GALLERY / PHOTO VIEWER
========================================= */

function openPhoto(src) {
    const viewer = document.getElementById("photoViewer");
    const image = document.getElementById("viewerImage");

    image.src = src;
    viewer.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closePhoto() {
    document.getElementById("photoViewer").classList.remove("open");
    document.body.style.overflow = "hidden";
}


/* =========================================
   LETTER
========================================= */

function openLetter() {
    startMusic();
    confetti(45);
    burstHearts();

    setTimeout(() => showPage(6), 700);
}

function revealLetter() {
    const paragraphs = document.querySelectorAll(".letter-body p");

    paragraphs.forEach((p, index) => {
        p.animate(
            [
                { opacity: 0, transform: "translateY(10px)" },
                { opacity: 1, transform: "translateY(0)" }
            ],
            {
                duration: 650,
                delay: index * 350,
                fill: "both",
                easing: "ease-out"
            }
        );
    });
}


/* =========================================
   CAKE / CANDLES
========================================= */

function blowCandle(candle) {
    if (candle.classList.contains("blown")) return;

    candle.classList.add("blown");
    candles++;

    burstSparkles(
        candle.getBoundingClientRect().left + candle.offsetWidth / 2,
        candle.getBoundingClientRect().top,
        9
    );

    document.getElementById("wishProgress").style.width =
        (candles / 3 * 100) + "%";

    const messages = [
        "Two more wishes... ✨",
        "One more... make it a beautiful one. ❤️",
        "Wish made... ❤️"
    ];

    document.getElementById("candleMessage").innerText = messages[candles - 1];

    if (candles === 3) {
        confetti(130);
        fireworks();

        setTimeout(() => showPage(8), 2400);
    }
}


/* =========================================
   FINAL REPLAY
========================================= */

function restartExperience() {
    memoryNumber = 0;
    candles = 0;

    document.querySelectorAll(".candle").forEach(c => c.classList.remove("blown"));
    document.getElementById("wishProgress").style.width = "0%";
    document.getElementById("candleMessage").innerText =
        "Tap each candle and make your wish 🕯️";

    const image = document.getElementById("mainPhoto");
    image.src = memories[0].image;
    image.style.opacity = "1";
    image.style.transform = "scale(1)";
    document.getElementById("memoryCurrent").innerText = "01";
    document.getElementById("photoCaption").innerText = memories[0].text;

    showPage(1);
}


/* =========================================
   FLOATING HEARTS
========================================= */

function createHeart() {
    const heart = document.createElement("div");
    heart.className = "heart";

    const hearts = ["♥", "♡", "❤", "💕", "💗", "✦"];
    heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = 12 + Math.random() * 22 + "px";
    heart.style.setProperty("--duration", 5 + Math.random() * 5 + "s");

    document.getElementById("hearts").appendChild(heart);

    setTimeout(() => heart.remove(), 10000);
}

setInterval(createHeart, 800);


/* =========================================
   STARS
========================================= */

function createStars() {
    const container = document.getElementById("stars");

    for (let i = 0; i < 75; i++) {
        const star = document.createElement("span");
        star.className = "star";

        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.opacity = (0.25 + Math.random() * .75).toFixed(2);
        star.style.transform = `scale(${0.5 + Math.random() * 1.5})`;
        star.style.setProperty("--duration", (1.5 + Math.random() * 3) + "s");

        container.appendChild(star);
    }
}

function shootingStar() {
    const container = document.getElementById("shootingStars");
    const star = document.createElement("div");

    star.className = "shooting-star";
    star.style.left = (30 + Math.random() * 80) + "%";
    star.style.top = (8 + Math.random() * 45) + "%";

    container.appendChild(star);
    setTimeout(() => star.remove(), 2000);
}

createStars();
setInterval(shootingStar, 6500);


/* =========================================
   SPARKLES / LOVE BURSTS
========================================= */

function burstSparkles(x, y, count = 12) {
    const container = document.getElementById("sparkles");

    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement("div");
        sparkle.className = "sparkle";
        sparkle.innerText = i % 3 === 0 ? "✦" : "✧";

        sparkle.style.left = x + (Math.random() * 140 - 70) + "px";
        sparkle.style.top = y + (Math.random() * 90 - 45) + "px";
        sparkle.style.fontSize = (8 + Math.random() * 13) + "px";

        container.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1400);
    }
}

function burstHearts() {
    for (let i = 0; i < 18; i++) {
        const heart = document.createElement("div");
        heart.className = "heart";
        heart.innerText = i % 2 ? "♡" : "♥";
        heart.style.left = (45 + Math.random() * 10) + "vw";
        heart.style.bottom = (35 + Math.random() * 20) + "vh";
        heart.style.fontSize = (15 + Math.random() * 25) + "px";
        heart.style.setProperty("--duration", (2 + Math.random() * 2) + "s");

        document.getElementById("hearts").appendChild(heart);
        setTimeout(() => heart.remove(), 4500);
    }
}


/* =========================================
   CONFETTI
========================================= */

function confetti(amount = 80) {
    const symbols = ["✦", "✧", "♥", "•", "✺"];

    for (let i = 0; i < amount; i++) {
        const piece = document.createElement("div");

        piece.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        piece.style.position = "fixed";
        piece.style.left = (Math.random() * 100) + "vw";
        piece.style.top = (-5 + Math.random() * 20) + "vh";
        piece.style.fontSize = (10 + Math.random() * 20) + "px";
        piece.style.color = Math.random() > .25 ? "#ffb4dc" : "#ffd98c";
        piece.style.zIndex = "3000";
        piece.style.pointerEvents = "none";

        document.body.appendChild(piece);

        piece.animate(
            [
                { transform: "translateY(-20px) scale(.2) rotate(0)", opacity: 0 },
                { transform: "translateY(35vh) scale(1.2) rotate(160deg)", opacity: 1 },
                { transform: "translateY(115vh) scale(.6) rotate(500deg)", opacity: 0 }
            ],
            {
                duration: 1800 + Math.random() * 1800,
                easing: "cubic-bezier(.2,.7,.3,1)"
            }
        );

        setTimeout(() => piece.remove(), 4000);
    }
}

function giftExplosion() {
    burstSparkles(window.innerWidth / 2, window.innerHeight * .45, 30);
}


/* =========================================
   FIREWORKS
========================================= */

function fireworks() {
    const bursts = 4;

    for (let b = 0; b < bursts; b++) {
        setTimeout(() => {
            const x = 15 + Math.random() * 70;
            const y = 15 + Math.random() * 45;

            for (let i = 0; i < 24; i++) {
                const p = document.createElement("div");
                p.innerText = i % 3 === 0 ? "✦" : "•";
                p.style.position = "fixed";
                p.style.left = x + "vw";
                p.style.top = y + "vh";
                p.style.zIndex = "3500";
                p.style.pointerEvents = "none";
                p.style.color = i % 2 ? "#ff86c0" : "#ffd887";
                p.style.fontSize = (7 + Math.random() * 9) + "px";

                document.body.appendChild(p);

                const angle = Math.PI * 2 * i / 24;
                const distance = 55 + Math.random() * 100;

                p.animate(
                    [
                        { transform: "translate(0,0) scale(.3)", opacity: 0 },
                        { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1.1)`, opacity: 1 },
                        { transform: `translate(${Math.cos(angle) * distance * 1.2}px, ${Math.sin(angle) * distance * 1.2}px) scale(0)`, opacity: 0 }
                    ],
                    { duration: 1100, easing: "ease-out" }
                );

                setTimeout(() => p.remove(), 1200);
            }
        }, b * 420);
    }
}


/* =========================================
   TAP ANYWHERE = LITTLE LOVE
========================================= */

document.addEventListener("click", (event) => {
    if (event.target.closest("button, .gift, .envelope-scene, .gallery-card, .photo-viewer")) {
        return;
    }

    burstSparkles(event.clientX, event.clientY, 5);

    if (currentPage === 8) {
        const heart = document.createElement("div");
        heart.className = "heart";
        heart.innerText = "♥";
        heart.style.left = event.clientX + "px";
        heart.style.bottom = (window.innerHeight - event.clientY) + "px";
        heart.style.setProperty("--duration", "2.5s");
        document.getElementById("hearts").appendChild(heart);
        setTimeout(() => heart.remove(), 3000);
    }
});


/* =========================================
   DESKTOP POINTER GLOW
========================================= */

document.addEventListener("pointermove", (event) => {
    const glow = document.getElementById("cursorGlow");

    if (window.innerWidth > 700) {
        glow.style.transform =
            `translate(${event.clientX}px, ${event.clientY}px)`;
    }
});

// ==========================================
// MOON ARCHIVE V3 - Fairy Dreamy Edition (Optimized & Clean Scroll)
// ==========================================

const archive = document.getElementById("archive");
const viewer = document.getElementById("viewer");
const viewerImage = document.getElementById("viewerImage");
const viewerTitle = document.getElementById("viewerTitle");
const viewerDescription = document.getElementById("viewerDescription");
const closeViewer = document.getElementById("closeViewer");
const cursor = document.querySelector(".cursor");
const moonLogo = document.querySelector(".moon-logo");

let artworksData = []; 

// ==========================================
// EFECTO: DESINTEGRACIÓN DE TÍTULO POR SCROLL
// ==========================================
function initLogoSplitting() {
    // Dividir el texto del logo en letras envueltas en spans
    const text = moonLogo.textContent.trim();
    moonLogo.innerHTML = "";
    
    [...text].forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.display = "inline-block";
        span.style.transition = "transform 0.1s linear, opacity 0.1s linear";
        moonLogo.appendChild(span);
    });
}

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const maxScroll = 400; // Distancia de scroll donde se desintegra por completo
    const progress = Math.min(scrollTop / maxScroll, 1);
    
    const letters = moonLogo.querySelectorAll("span");
    
    // Si ya bajó lo suficiente, ocultamos por completo el contenedor para evitar clics fantasma
    if (progress >= 1) {
        moonLogo.style.opacity = "0";
        moonLogo.style.pointerEvents = "none";
    } else {
        moonLogo.style.opacity = "1";
        moonLogo.style.pointerEvents = "auto";
    }

    letters.forEach((letter, index) => {
        // Direcciones aleatorias controladas para cada letra de "m-o-o-n"
        const directions = [
            { x: -80, y: -40, rotate: -35 }, // m
            { x: -30, y: -70, rotate: 20 },  // o
            { x: 30, y: -70, rotate: -20 },  // o
            { x: 80, y: -40, rotate: 35 }    // n
        ];
        
        const dir = directions[index] || { x: 0, y: -50, rotate: 0 };
        
        // Multiplicamos el destino por el progreso del scroll actual
        const moveX = dir.x * progress;
        const moveY = dir.y * progress;
        const rotate = dir.rotate * progress;
        const opacity = 1 - progress; // Se desvanece a medida que baja

        letter.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate(${rotate}deg)`;
        letter.style.opacity = opacity;
    });
});

// ==========================================
// CONSTELACIÓN GUIADA (Adaptativa)
// ==========================================
function generateConstellation(count) {
    const positions = [];
    const center = window.innerWidth / 2;
    const isMobile = window.innerWidth < 768;

    for (let i = 0; i < count; i++) {

        if (isMobile) {

            const widths = [78, 62, 72];
            const widthVW = widths[i % widths.length];

            const size = window.innerWidth * (widthVW / 100);

            const x = i % 2 === 0
                ? 20
                : window.innerWidth - size - 20;

            positions.push({
                x,
                y: 240 + i * 430
            });

        } else {

            const desktopOffsets = [-250, 150, -180, 220];

positions.push({
    x: center + desktopOffsets[i % desktopOffsets.length],
    y: 350 + i * 650
});

        }
    }

    return positions;
}
// ==========================================
// RENDERIZAR OBRAS (Con soporte Responsive real)
// ==========================================
function renderArtworks(artworks) {
    archive.innerHTML = ""; 
    const constellation = generateConstellation(artworks.length);
    
const spacing = window.innerWidth < 768 ? 430 : 650;
    archive.style.minHeight =
    `${artworks.length * spacing + 400}px`;
    artworks.forEach((art, index) => {
        const card = document.createElement("div");
        card.classList.add("art");

        let size;

if (window.innerWidth < 768) {

    const mobileSizes = [78, 62, 72];

    size = window.innerWidth * (mobileSizes[index % mobileSizes.length] / 100);

} else {

    const desktopSizes = [320, 420, 360, 390];

size = desktopSizes[index % desktopSizes.length];

}
        
        card.style.width = `${size}px`;
        card.style.left = `${constellation[index].x}px`;
        card.style.top = `${constellation[index].y}px`;
        card.dataset.index = index;

        const imgSmall = art.image_small || art.image;
        const imgMedium = art.image_medium || art.image;
        const imgLarge = art.image || art.image;

        card.innerHTML = `
            <img
                src="${imgMedium}" 
                srcset="${imgSmall} 400w, ${imgMedium} 800w, ${imgLarge} 1200w"
                sizes="(max-width: 768px) 220px, 320px"
                alt="${art.title}"
                loading="lazy"
            >
        `;

        card.addEventListener("mouseenter", () => createStars(card));
        card.addEventListener("click", () => openArtwork(art));
        archive.appendChild(card);
    });
}

// Inicialización de Carga
fetch("data/artworks.json")
    .then(res => res.json())
    .then(data => {
    artworksData = data.items; 
    initLogoSplitting();
    renderArtworks(artworksData);
    animateArtworks();
})
    .catch(err => console.error("Error cargando obras:", err));

// Evento Resize Inteligente
let resizeTimeout;
let lastWidth = window.innerWidth;

window.addEventListener("resize", () => {

    // En móviles ignoramos cambios de altura
    if (window.innerWidth === lastWidth) return;

    lastWidth = window.innerWidth;

    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
        if (artworksData.length > 0) {
            renderArtworks(artworksData);
        }
    }, 300);

});
// ==========================================
// VISOR MULTIMEDIA
// ==========================================
function openArtwork(art) {
    viewerImage.src = art.image; 
    if(art.image_medium) {
        viewerImage.srcset = `${art.image_small} 400w, ${art.image_medium} 800w, ${art.image} 1200w`;
    }
    
    viewerTitle.textContent = art.title;
    viewerDescription.textContent = art.description;
    viewer.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

// Cerrar visor
function closeArtwork() {
    viewer.classList.add("hidden");
    document.body.style.overflow = "auto";
    viewerImage.srcset = ""; 
}

closeViewer.addEventListener("click", closeArtwork);
viewer.addEventListener("click", e => {
    if (e.target === viewer) closeArtwork();
});

// ==========================================
// CURSOR Y POLVO DE HADAS
// ==========================================
document.addEventListener("mousemove", e => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    createHeart(e.clientX, e.clientY);
});

function createHeart(x, y) {
    if (Math.random() > 0.85) { 
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.innerHTML = "♡";
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 2000);
    }
}

function createBubble() {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    const size = 10 + Math.random() * 25;
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}vw`;
    bubble.style.animationDuration = `${15 + Math.random() * 10}s`;
    
    document.body.appendChild(bubble);
    setTimeout(() => bubble.remove(), 25000);
}
setInterval(createBubble, 2200);

function createStars(card) {
    for (let i = 0; i < 6; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.innerHTML = "✦";
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        card.appendChild(star);
        setTimeout(() => star.remove(), 1200);
    }
}

// Movimiento Orgánico Constante
function animateArtworks() {
    const arts = document.querySelectorAll(".art");
    const time = Date.now();

    arts.forEach((art, index) => {
        const speed = 0.0004 + index * 0.00005;
        const isMobile = window.innerWidth < 768;

const y = isMobile
    ? Math.sin(time * speed) * 2
    : Math.sin(time * speed) * 6;

const rotate = isMobile
    ? 0
    : Math.sin(time * speed) * 0.5;

        art.style.setProperty("--floatY", `${y}px`);
        art.style.setProperty("--rotate", `${rotate}deg`);
    });

    requestAnimationFrame(animateArtworks);
}

document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeArtwork();
});
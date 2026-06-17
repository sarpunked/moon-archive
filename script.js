// ==========================================
// MOON ARCHIVE V3 - Fairy Dreamy Edition (Optimized)
// ==========================================

const archive = document.getElementById("archive");
const viewer = document.getElementById("viewer");
const viewerImage = document.getElementById("viewerImage");
const viewerTitle = document.getElementById("viewerTitle");
const viewerDescription = document.getElementById("viewerDescription");
const closeViewer = document.getElementById("closeViewer");
const cursor = document.querySelector(".cursor");

let artworksData = []; // Guardará los datos del fetch para usarlos al redimensionar

// ==========================================
// CONSTELACIÓN GUIADA (Adaptativa)
// ==========================================
function generateConstellation(count) {
    const positions = [];
    const center = window.innerWidth / 2;
    const isMobile = window.innerWidth < 768;

    for (let i = 0; i < count; i++) {
        if (isMobile) {
            positions.push({
                x: center - 110, // Centrado para el contenedor de 220px en móvil
                y: 200 + i * 360
            });
        } else {
            const wave = Math.sin(i * 1.15) * 220;
            positions.push({
                x: center + wave - 160, // Centrado para pantallas grandes
                y: 250 + i * 450
            });
        }
    }
    return positions;
}

// ==========================================
// RENDERIZAR OBRAS (Con soporte Responsive real)
// ==========================================
function renderArtworks(artworks) {
    archive.innerHTML = ""; // Limpiar galería previa si se redimensiona
    const constellation = generateConstellation(artworks.length);
    
    // Altura dinámica del contenedor base
    const spacing = window.innerWidth < 768 ? 380 : 500;
    archive.style.minHeight = `${artworks.length * spacing}px`;

    artworks.forEach((art, index) => {
        const card = document.createElement("div");
        card.classList.add("art");

        // Tamaño aleatorio/orgánico controlado
        const baseSize = window.innerWidth < 768 ? 220 : 280;
        const size = baseSize + Math.sin(index) * 30 + Math.random() * 20;
        
        card.style.width = `${size}px`;
        card.style.left = `${constellation[index].x}px`;
        card.style.top = `${constellation[index].y}px`;
        card.dataset.index = index;

        /* Explicación de la magia adaptativa:
           Si tus objetos de imagen en JSON tienen diferentes tamaños (ej. art.image_small, art.image_medium, art.image),
           el atributo srcset le dice al navegador cuál descargar según el ancho real disponible.
           Si no los tienes separados, por ahora usará 'art.image' por defecto.
        */
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

// Cargar Datos del JSON
fetch("data/artworks.json")
    .then(res => res.json())
    .then(artworks => {
        artworksData = artworks;
        renderArtworks(artworksData);
        animateArtworks();
    })
    .catch(err => console.error("Error cargando obras:", err));

// ==========================================
// EVENTO RESIZE CONTROLADO (Debounce)
// ==========================================
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (artworksData.length > 0) {
            renderArtworks(artworksData);
        }
    }, 250); // Redibuja la constelación de forma suave al cambiar de tamaño
});

// ==========================================
// VISOR
// ==========================================
function openArtwork(art) {
    // Para el visor también usamos el set adaptativo si existiera
    viewerImage.src = art.image; 
    if(art.image_medium) {
        viewerImage.srcset = `${art.image_small} 400w, ${art.image_medium} 800w, ${art.image} 1200w`;
    }
    
    viewerTitle.textContent = art.title;
    viewerDescription.textContent = art.description;
    viewer.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function closeArtwork() {
    viewer.classList.add("hidden");
    document.body.style.overflow = "auto";
    viewerImage.srcset = ""; // Reset de imágenes
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
    if (Math.random() > 0.85) { // Un poco menos saturado para mejorar rendimiento
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.innerHTML = "♡";
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 2000);
    }
}

// ==========================================
// BURBUJITAS (Optimizadas con RequestAnimationFrame en CSS)
// ==========================================
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

// ==========================================
// ESTRELLITAS
// ==========================================
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

// ==========================================
// MOVIMIENTO ORGÁNICO
// ==========================================
function animateArtworks() {
    const arts = document.querySelectorAll(".art");
    const time = Date.now();

    arts.forEach((art, index) => {
        const speed = 0.0004 + index * 0.00005;
        const y = Math.sin(time * speed) * 6;
        const rotate = Math.sin(time * speed) * 0.5;

        art.style.setProperty("--floatY", `${y}px`);
        art.style.setProperty("--rotate", `${rotate}deg`);
    });

    requestAnimationFrame(animateArtworks);
}

// ESC Key
document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeArtwork();
});
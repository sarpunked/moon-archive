// ==========================================================
// MOON ARCHIVE V3 - Fairy Dreamy Edition
// Versión optimizada y comentada
// ==========================================================



// ==========================================================
// REFERENCIAS A ELEMENTOS DEL DOM
// ==========================================================
// Guardamos en constantes los elementos HTML que vamos a usar
// frecuentemente para evitar buscarlos varias veces.

const archive = document.getElementById("archive");

const viewer = document.getElementById("viewer");
const viewerImage = document.getElementById("viewerImage");
const viewerTitle = document.getElementById("viewerTitle");
const viewerDescription = document.getElementById("viewerDescription");
const closeViewer = document.getElementById("closeViewer");

const cursor = document.querySelector(".cursor");
const moonLogo = document.querySelector(".moon-logo");


// Almacenará las obras obtenidas desde artworks.json
let artworksData = [];


/**
 * Obtiene la categoría actual a partir de la URL.
 *
 * Ejemplos:
 * "/"              → archive
 * "/arte"          → arte
 * "/tatuajes"      → tatuajes
 * "/disenos"       → disenos
 * "/artesanias"    → artesanias
 */


function getCurrentCategory() {

    /*
     * Desarrollo local:
     * index.html?category=arte
     */
    const params = new URLSearchParams(window.location.search);

    const queryCategory = params.get("category");

    if (queryCategory) {
        return queryCategory;
    }

    /*
     * Producción (Netlify):
     * /arte
     * /tatuajes
     * /disenos
     */
    const path = window.location.pathname
        .replace(/^\/|\/$/g, "");

    return path || "archive";
}



function getCategoryItems(category) {

    // Archive muestra TODO
    if (category === "archive") {
        return artworksData;
    }

    // El resto filtra por categoría
    return artworksData.filter(
        art => art.category === category
    );
}






/* ==========================================================
   EFECTO DEL LOGO "MOON"
   Desintegración progresiva al hacer scroll
========================================================== */

/**
 * Divide cada letra del logo en un <span>
 * para poder animarlas individualmente.
 */
function initLogoSplitting() {

    const text = moonLogo.textContent.trim();

    moonLogo.innerHTML = "";

    [...text].forEach(char => {

        const span = document.createElement("span");

        span.textContent = char;

        span.style.display = "inline-block";

        span.style.transition =
            "transform 0.1s linear, opacity 0.1s linear";

        moonLogo.appendChild(span);
    });
}


/**
 * A medida que el usuario hace scroll,
 * las letras del logo se separan y desaparecen.
 */
window.addEventListener("scroll", () => {

    const scrollTop = window.scrollY;

    // Distancia necesaria para completar el efecto
    const maxScroll = 400;

    const progress = Math.min(scrollTop / maxScroll, 1);

    const letters = moonLogo.querySelectorAll("span");


    // Cuando desaparece completamente,
    // se deshabilitan los clics sobre el logo.
    if (progress >= 1) {

        moonLogo.style.opacity = "0";
        moonLogo.style.pointerEvents = "none";

    } else {

        moonLogo.style.opacity = "1";
        moonLogo.style.pointerEvents = "auto";
    }


    letters.forEach((letter, index) => {

        /*
         * Dirección específica para cada letra.
         * Pensado originalmente para "m-o-o-n".
         */
        const directions = [
            { x: -80, y: -40, rotate: -35 },
            { x: -30, y: -70, rotate: 20 },
            { x: 30,  y: -70, rotate: -20 },
            { x: 80,  y: -40, rotate: 35 }
        ];

        const dir = directions[index] || {
            x: 0,
            y: -50,
            rotate: 0
        };

        const moveX = dir.x * progress;
        const moveY = dir.y * progress;
        const rotate = dir.rotate * progress;

        // Se desvanece gradualmente
        const opacity = 1 - progress;

        letter.style.transform =
            `translate3d(${moveX}px, ${moveY}px, 0)
             rotate(${rotate}deg)`;

        letter.style.opacity = opacity;
    });
});



function highlightCurrentCategory() {

    const current = getCurrentCategory();

    document
        .querySelectorAll(".category-menu a[data-page]")
        .forEach(link => {

            link.classList.remove("active");

            if (link.dataset.page === current) {

                link.classList.add("active");

            }
        });
}

/**
 * Genera las posiciones de cada obra dentro del archivo.
 *
 * - En móvil: alterna izquierda/derecha para mantener
 *   la composición vertical original.
 *
 * - En desktop: organiza las obras en varias columnas,
 *   agregando pequeñas variaciones para conservar el
 *   efecto de "constelación" y evitar una grilla rígida.
 */

/* ==========================================================
   RENDERIZADO DE LAS OBRAS
========================================================== */

/**
 * Crea todas las tarjetas de obras
 * utilizando la información del JSON.
 */
async function renderArtworks(artworks) {
    const sideMargin = window.innerWidth < 768
    ? 65
    : 150;

    archive.innerHTML = "";

    archive.classList.remove("gallery");

   
        const category = getCurrentCategory();

    const isArchive =
        category === "archive";

    const isMobile =
        window.innerWidth < 768;

    /*
     * Precargamos dimensiones reales
     * para evitar superposiciones.
     */
    const dimensions = await Promise.all(

        artworks.map(art => {

            return new Promise(resolve => {

                const img = new Image();

                img.src = art.image;

                img.onload = () => {

                    resolve({
                        ratio: img.height / img.width
                    });

                };

                img.onerror = () => {

                    resolve({
                        ratio: 1.3
                    });
                };
            });
        })
    );
    if (!isArchive) {

    archive.classList.add("gallery");

    artworks.forEach((art) => {

        createGalleryCard(art);

    });

    archive.style.minHeight = "auto";

    return;
}


    /*
     * ==========================
     * MOBILE
     * ==========================
     */
    if (isMobile) {

        let currentY = 220;

        artworks.forEach((art, index) => {

            const mobileSizes = [78, 62, 72];

            const size =
                window.innerWidth *
                (mobileSizes[index % mobileSizes.length] / 100);

            const realHeight =
                size * dimensions[index].ratio;

            const mobileLeftMargin = sideMargin;
            const mobileRightMargin = sideMargin;

            const x =
                index % 2 === 0
                    ? mobileLeftMargin
                    : window.innerWidth - size - mobileRightMargin;
            createCard(
                art,
                index,
                size,
                x,
                currentY
            );

            currentY += realHeight + 80;
        });

        archive.style.minHeight =
            `${currentY + 150}px`;

        return;
    }


    /*
     * ==========================
     * DESKTOP
     * ==========================
     */

    const desktopSizes = [320, 420, 360, 390];

    const columnsCount =
        window.innerWidth > 1700
            ? 4
            : 3;

    const columnWidth = 420;

    const gap = 90;

    const totalWidth =
        columnsCount * columnWidth +
        (columnsCount - 1) * gap;

    const startX =
        (window.innerWidth - totalWidth) / 2;

    const columnHeights =
        new Array(columnsCount).fill(340);


    artworks.forEach((art, index) => {

        const size =
            desktopSizes[index % desktopSizes.length];

        const realHeight =
            size * dimensions[index].ratio;


        /*
         * Elegimos la columna más alta.
         */
        let target = 0;

        for (let i = 1; i < columnsCount; i++) {

            if (
                columnHeights[i] <
                columnHeights[target]
            ) {
                target = i;
            }
        }


        /*
         * Pequeños desvíos editoriales.
         */
        const randomX =
    Math.random() * 120 - 60;

const randomY =
    Math.random() * 60 - 30;


        const safeMargin = sideMargin;
        let x =
            startX +
            target * (columnWidth + gap) +
            randomX;

        x = Math.max(
            safeMargin,
            Math.min(
                x,
                window.innerWidth - size - safeMargin
            )
        );

        const y =
            columnHeights[target] +
            randomY;


        createCard(
            art,
            index,
            size,
            x,
            y
        );


        /*
         * Reservamos espacio REAL.
         */
        columnHeights[target] +=
            realHeight + 120;
    });


    archive.style.minHeight =
        `${Math.max(...columnHeights) + 300}px`;
}



function createCard(art, index, size, x, y) {

    const card = document.createElement("div");

    card.classList.add("art");

    card.style.width = `${size}px`;

    card.style.left = `${x}px`;

    card.style.top = `${y}px`;

    card.dataset.index = index;

    const imgSmall =
        art.image_small || art.image;

    const imgMedium =
        art.image_medium || art.image;

    const imgLarge =
        art.image;

    card.innerHTML = `
        <img
            src="${imgMedium}"
            srcset="
                ${imgSmall} 400w,
                ${imgMedium} 800w,
                ${imgLarge} 1200w
            "
            alt="${art.title}"
            loading="lazy"
        >
    `;

    card.addEventListener(
        "mouseenter",
        () => createStars(card)
    );

    card.addEventListener(
        "click",
        () => openArtwork(art)
    );

    archive.appendChild(card);
}


function createGalleryCard(art) {

    const card = document.createElement("div");

    card.classList.add("gallery-art");

    card.innerHTML = `
        <img
            src="${art.image}"
            alt="${art.title}"
            loading="lazy"
        >
    `;

    card.addEventListener(
        "mouseenter",
        () => createStars(card)
    );

    card.addEventListener(
        "click",
        () => openArtwork(art)
    );

    archive.appendChild(card);
}



/* ==========================================================
   CARGA INICIAL DEL JSON
========================================================== */
fetch("data/artworks.json")

    .then(res => res.json())

    .then(async data => {

        artworksData = data.items;
        highlightCurrentCategory();

        initLogoSplitting();

     
        const category = getCurrentCategory();

        await renderArtworks(
        getCategoryItems(category)
    );

    animateArtworks();
    })

    .catch(err => {

        console.error(
            "Error cargando obras:",
            err
        );
    });

/* ==========================================================
   RESIZE INTELIGENTE
========================================================== */

/*
 * Evita rerenderizar constantemente
 * mientras el usuario redimensiona.
 */
let resizeTimeout;

let lastWidth = window.innerWidth;


window.addEventListener("resize", () => {

    if (window.innerWidth === lastWidth) {
        return;
    }

    lastWidth = window.innerWidth;

    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(async () => {

        if (artworksData.length > 0) {

           const category = getCurrentCategory();

        await renderArtworks(
            getCategoryItems(category)
        );
                }

    }, 300);
});



/* ==========================================================
   VISOR MULTIMEDIA
========================================================== */

/**
 * Abre el modal con la información de la obra.
 */
function openArtwork(art) {

    viewerImage.src = art.image;


    if (art.image_medium) {

        viewerImage.srcset = `
            ${art.image_small} 400w,
            ${art.image_medium} 800w,
            ${art.image} 1200w
        `;
    }


    viewerTitle.textContent =
        art.title;

    viewerDescription.textContent =
        art.description;


    viewer.classList.remove("hidden");


    // Bloquea el scroll del fondo
    document.body.style.overflow = "hidden";
}


/**
 * Cierra el visor.
 */
function closeArtwork() {

    viewer.classList.add("hidden");

    document.body.style.overflow = "auto";

    viewerImage.srcset = "";
}


// Botón cerrar
closeViewer.addEventListener(
    "click",
    closeArtwork
);


// Clic fuera del contenido
viewer.addEventListener("click", e => {

    if (e.target === viewer) {

        closeArtwork();
    }
});


// Tecla Escape
document.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        closeArtwork();
    }
});



/* ==========================================================
   CURSOR PERSONALIZADO Y POLVO DE HADAS
========================================================== */

document.addEventListener("mousemove", e => {

    cursor.style.left = `${e.clientX}px`;

    cursor.style.top = `${e.clientY}px`;


    createHeart(
        e.clientX,
        e.clientY
    );
});


/**
 * Genera corazones aleatorios
 * siguiendo el cursor.
 */
function createHeart(x, y) {

    if (Math.random() > 0.85) {

        const heart =
            document.createElement("div");

        heart.classList.add("heart");

        heart.innerHTML = "♡";

        heart.style.left = `${x}px`;

        heart.style.top = `${y}px`;

        document.body.appendChild(heart);

        setTimeout(() => {

            heart.remove();

        }, 2000);
    }
}



/* ==========================================================
   BURBUJAS DECORATIVAS
========================================================== */

/**
 * Crea burbujas flotantes
 * en posiciones aleatorias.
 */
function createBubble() {

    const bubble =
        document.createElement("div");

    bubble.classList.add("bubble");


    const size =
        10 + Math.random() * 25;


    bubble.style.width =
        `${size}px`;

    bubble.style.height =
        `${size}px`;

    bubble.style.left =
        `${Math.random() * 100}vw`;

    bubble.style.animationDuration =
        `${15 + Math.random() * 10}s`;


    document.body.appendChild(bubble);


    setTimeout(() => {

        bubble.remove();

    }, 25000);
}


// Genera una nueva burbuja cada cierto tiempo
setInterval(createBubble, 2200);



/* ==========================================================
   ESTRELLAS AL PASAR EL MOUSE SOBRE UNA OBRA
========================================================== */

/**
 * Crea pequeñas estrellas temporales
 * alrededor de una tarjeta.
 */
function createStars(card) {

    for (let i = 0; i < 6; i++) {

        const star =
            document.createElement("div");

        star.classList.add("star");

        star.innerHTML = "✦";

        star.style.left =
            `${Math.random() * 100}%`;

        star.style.top =
            `${Math.random() * 100}%`;

        card.appendChild(star);


        setTimeout(() => {

            star.remove();

        }, 1200);
    }
}



/* ==========================================================
   MOVIMIENTO ORGÁNICO DE LAS OBRAS
========================================================== */

/**
 * Hace que las imágenes floten suavemente.
 * Utiliza requestAnimationFrame para una
 * animación eficiente.
 */
function animateArtworks() {

    const arts =
        document.querySelectorAll(".art");

    const time = Date.now();


    arts.forEach((art, index) => {

        const speed =
            0.0004 + index * 0.00005;


        const isMobile =
            window.innerWidth < 768;


        const y = isMobile
            ? Math.sin(time * speed) * 2
            : Math.sin(time * speed) * 6;


        const rotate = isMobile
            ? 0
            : Math.sin(time * speed) * 0.5;


        art.style.setProperty(
            "--floatY",
            `${y}px`
        );

        art.style.setProperty(
            "--rotate",
            `${rotate}deg`
        );
    });


    requestAnimationFrame(
        animateArtworks
    );
}
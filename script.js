// ==========================================
// MOON ARCHIVE V3
// Fairy Dreamy Edition
// ==========================================

const archive =
document.getElementById("archive");

const viewer =
document.getElementById("viewer");

const viewerImage =
document.getElementById("viewerImage");

const viewerTitle =
document.getElementById("viewerTitle");

const viewerDescription =
document.getElementById("viewerDescription");

const closeViewer =
document.getElementById("closeViewer");

const cursor =
document.querySelector(".cursor");

// ==========================================
// CONSTELACIÓN GUIADA
// ==========================================

function generateConstellation(count){

    const positions = [];

    const center =
    window.innerWidth / 2;

    const mobile =
    window.innerWidth < 768;

    for(let i=0;i<count;i++){

        if(mobile){

            positions.push({

                x:
                center - 110,

                y:
                200 + i * 380

            });

        }else{

            const wave =

            Math.sin(i * 1.15) * 220;

            positions.push({

                x:
                center + wave - 160,

                y:
                200 + i * 420

            });

        }

    }

    return positions;

}

// ==========================================
// CARGAR OBRAS
// ==========================================

fetch("data/artworks.json")

.then(res => res.json())

.then(artworks => {

    const constellation =
    generateConstellation(
        artworks.length
    );

    archive.style.minHeight =
    `${artworks.length * 500}px`;

    artworks.forEach((art,index)=>{

        const card =
        document.createElement("div");

        card.classList.add("art");

        const size =

        280 +

        Math.sin(index) * 40 +

        Math.random() * 30;

        card.style.width =
        `${size}px`;

        card.style.left =
        `${constellation[index].x}px`;

        card.style.top =
        `${constellation[index].y}px`;

        card.dataset.index =
        index;

        card.innerHTML =

        `
        <img
            src="${art.image}"
            alt="${art.title}"
            loading="lazy"
        >
        `;

        card.addEventListener(
            "mouseenter",
            ()=>createStars(card)
        );

        card.addEventListener(
            "click",
            ()=>openArtwork(art)
        );

        archive.appendChild(card);

    });

    animateArtworks();

});

// ==========================================
// VISOR
// ==========================================

function openArtwork(art){

    viewerImage.src =
    art.image;

    viewerTitle.textContent =
    art.title;

    viewerDescription.textContent =
    art.description;

    viewer.classList.remove(
        "hidden"
    );

    document.body.style.overflow =
    "hidden";

}

function closeArtwork(){

    viewer.classList.add(
        "hidden"
    );

    document.body.style.overflow =
    "auto";

}

closeViewer.addEventListener(
    "click",
    closeArtwork
);

viewer.addEventListener(
    "click",
    e=>{

        if(e.target === viewer){

            closeArtwork();

        }

    }
);
// ==========================================
// CURSOR
// ==========================================

document.addEventListener(
    "mousemove",
    e=>{

        cursor.style.left =
        e.clientX + "px";

        cursor.style.top =
        e.clientY + "px";

        createHeart(
            e.clientX,
            e.clientY
        );

    }
);
// ==========================================
// POLVO DE HADAS
// ==========================================
// ==========================================
// CORAZONES
// ==========================================

function createHeart(x,y){

    if(Math.random() > 0.75){

        const heart =
        document.createElement("div");

        heart.classList.add(
            "heart"
        );

        heart.innerHTML = "♡";

        heart.style.left =
        x + "px";

        heart.style.top =
        y + "px";

        document.body.appendChild(
            heart
        );

        setTimeout(()=>{

            heart.remove();

        },2000);

    }

}
// ==========================================
// BURBUJITAS
// ==========================================

function createBubble(){

    const bubble =
    document.createElement("div");

    bubble.classList.add(
        "bubble"
    );

    const size =

    10 +

    Math.random() * 25;

    bubble.style.width =
    `${size}px`;

    bubble.style.height =
    `${size}px`;

    bubble.style.left =
    `${Math.random()*100}vw`;

    bubble.style.animationDuration =
    `${15 + Math.random()*10}s`;

    document.body.appendChild(
        bubble
    );

    setTimeout(()=>{

        bubble.remove();

    },30000);

}

setInterval(
    createBubble,
    1800
);

// ==========================================
// ESTRELLITAS
// ==========================================

function createStars(card){

    for(let i=0;i<8;i++){

        const star =
        document.createElement("div");

        star.classList.add(
            "star"
        );

        star.innerHTML = "✦";

        star.style.left =
        `${Math.random()*100}%`;

        star.style.top =
        `${Math.random()*100}%`;

        card.appendChild(star);

        setTimeout(()=>{

            star.remove();

        },1200);

    }

}

// ==========================================
// MOVIMIENTO ORGÁNICO
// ==========================================

function animateArtworks(){

    const arts =
    document.querySelectorAll(
        ".art"
    );

    const time =
    Date.now();

    arts.forEach((art,index)=>{

        const speed =

        0.0004 +

        index * 0.00008;

        const y =

        Math.sin(
            time * speed
        ) * 8;

        const rotate =

        Math.sin(
            time * speed
        ) * 0.6;

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

// ==========================================
// ESC
// ==========================================

document.addEventListener(
    "keydown",
    e=>{

        if(e.key === "Escape"){

            closeArtwork();

        }

    }
);
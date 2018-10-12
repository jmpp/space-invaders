const canvas = document.getElementById('invaders');
const context = canvas.getContext('2d');

canvas.width = 480;
canvas.height = 480;

let player;
let aliens;

const spritesheet = new Image();
spritesheet.src = '../img/spritesheet.png';
spritesheet.onload = function() { // Fonction exécutée lorsque le navigateur a fini de charger le PNG
    player = createPlayer(); // Fabrication d'un objet joueur
    aliens = createAliens(); // Fabrication d'un tableau d'aliens

    // Démarrage de la boucle continue
    gameloop();
};

function update() {
    animatePlayer(); // Fonction qui gère l'animation du joueur
    animateAliens(); // Fonction qui gère l'animation des aliens
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas

    renderPlayer(); // Dessin du joueur
    renderAliens(); // Dessin des aliens
}

// Fonction gérant la boucle de jeu
function gameloop() {
    update();
    render();
    
    requestAnimationFrame(gameloop);
}

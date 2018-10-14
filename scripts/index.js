// audio by: http://www.classicgaming.cc/classics/space-invaders/sounds

const canvas = document.getElementById('invaders');
const context = canvas.getContext('2d');

canvas.width = 480;
canvas.height = 540;

let player;
let aliens;
const sounds = {
    invader0 : document.getElementById('invader1'),
    invader1 : document.getElementById('invader2'),
    invader2 : document.getElementById('invader3'),
    invader3 : document.getElementById('invader4'),
    invader_killed : document.getElementById('invader_killed'),
    player_shoot : document.getElementById('player_shoot')
};

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
    renderUI(); // Dessin des éléments de l'interface
}

// Fonction gérant la boucle de jeu
function gameloop() {
    update();
    render();
    
    requestAnimationFrame(gameloop);
}

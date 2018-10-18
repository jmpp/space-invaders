// audio by: http://www.classicgaming.cc/classics/space-invaders/sounds

const canvas = document.getElementById('invaders');
const context = canvas.getContext('2d');

canvas.width = 480;
canvas.height = 540;

let timer;
let player;
let aliens;
const sounds = {
    invader0 : document.getElementById('invader1'),
    invader1 : document.getElementById('invader2'),
    invader2 : document.getElementById('invader3'),
    invader3 : document.getElementById('invader4'),
    invader_killed : document.getElementById('invader_killed'),
    shoot : document.getElementById('shoot'),
    player_death : document.getElementById('player_death')
};

const MODE_PLAYING     = 1;
const MODE_PLAYER_DEAD = 2;
const MODE_GAME_OVER   = 3;
let game_mode = MODE_PLAYING;

const spritesheet = new Image();
spritesheet.src = 'img/spritesheet.png';
spritesheet.onload = function() { // Fonction exécutée lorsque le navigateur a fini de charger le PNG
    player = createPlayer(); // Fabrication d'un objet joueur
    aliens = createAliens(); // Fabrication d'un tableau d'aliens

    // Démarrage de la boucle continue
    gameloop();
};

function update() {
    switch (game_mode) {
    case MODE_PLAYING:
        animatePlayer(); // Fonction qui gère l'animation du joueur
        animateAliens(); // Fonction qui gère l'animation des aliens
        break;
    }
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas

    if (game_mode === MODE_GAME_OVER) {
        context.textAlign = 'center';
        context.fillStyle = '#0f0';
        context.font = 'normal 24px "Press Start 2P", cursive';
        context.fillText('GAME OVER', canvas.width/2, canvas.height/2);

        context.fillStyle = '#fff';
        context.font = 'normal 16px "Press Start 2P", cursive';
        context.fillText('PRESS F5', canvas.width/2, canvas.height/2 + 30);
    }
    else {
        renderPlayer(); // Dessin du joueur
        renderAliens(); // Dessin des aliens
    }
    renderUI(); // Dessin des éléments de l'interface
}

// Fonction gérant la boucle de jeu
function gameloop() {
    update();
    render();

    timer = requestAnimationFrame(gameloop);
}

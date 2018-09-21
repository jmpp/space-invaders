const canvas = document.getElementById('invaders');
const context = canvas.getContext('2d');

canvas.width = 480;
canvas.height = 480;

let player;
let player_shot = null;
let aliensPos = [
    40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
    10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
    10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10
];
let aliens = [];

const aliensSpriteCoords = {
    40 : [ [6, 3, 16, 16], [6, 25, 16, 16] ],
    20 : [ [32, 3, 22, 16], [32, 25, 22, 16] ],
    10 : [ [60, 3, 24, 16], [60, 25, 24, 16] ]
};

const NB_ALIENS_PER_LINE = 11; // Nombre d'aliens par ligne
function generateAliens() {
    for (let i = 0, line = 0; i < aliensPos.length; i++) {
        if (i % NB_ALIENS_PER_LINE === 0) {
            line++;
        }

        if (aliensPos[i] === 0) continue;
        
        aliens.push({
            x : 10 + i % NB_ALIENS_PER_LINE * 35 + (24 - aliensSpriteCoords[aliensPos[i]][0][2] / 2 | 0),
            y : 100 + line * 28,
            points : aliensPos[i],
            sprite : {
                img : spritesheet,
                offsetX : aliensSpriteCoords[aliensPos[i]][0][0],
                offsetY : aliensSpriteCoords[aliensPos[i]][0][1],
                width : aliensSpriteCoords[aliensPos[i]][0][2],
                height : aliensSpriteCoords[aliensPos[i]][0][3]
            }
        });
    }
}

let aliensTimer = 1000; // intervalle de mouvements d'aliens en milli-secondes
let lastAlienMovement = 0; // timecode du dernier déplacement des aliens
let aliensDirection = 1; // Facteur multiplicateur pour gérer la direction des aliens (1 : droite, -1 : gauche)
let alienSpriteTicker = 0; // Indicateur pour alterner les sprites

function animateAliens() {
    // Mouvement des aliens de gauche à droite et vers le bas
    if (Date.now() - lastAlienMovement > aliensTimer) {
        // Vérification si un changement de direction du groupe d'aliens doit être effectué
        // Pour cela, récupération des coordonnées des 2 aliens se trouvants respectivement aux extrêmes gauche et droite du groupe
        let extremeLeftAlien = Math.min.apply(Math, aliens.map(alien => alien.x));
        let extremeRightAlien = Math.max.apply(Math, aliens.map(alien => alien.x)) + 30;

        if (extremeLeftAlien - 12 < 0 && aliensDirection === -1 || extremeRightAlien + 12 > canvas.width && aliensDirection === 1) {
            aliensDirection *= -1;
            for (let i = 0; i < aliens.length; i++) {
                aliens[i].y += 22;
            }
            lastAlienMovement = Date.now();
        }
        else {
            for (let i = 0; i < aliens.length; i++) {
                aliens[i].x += 12 * aliensDirection; 

                aliens[i].sprite.offsetX = aliensSpriteCoords[aliens[i].points][alienSpriteTicker % 2][0];
                aliens[i].sprite.offsetY = aliensSpriteCoords[aliens[i].points][alienSpriteTicker % 2][1];
                aliens[i].sprite.width = aliensSpriteCoords[aliens[i].points][alienSpriteTicker % 2][2];
                aliens[i].sprite.height = aliensSpriteCoords[aliens[i].points][alienSpriteTicker % 2][3];
            }
            alienSpriteTicker++;
            lastAlienMovement = Date.now();
        }
    }

    
}

const spritesheet = new Image();
spritesheet.src = '../img/spritesheet.png';
spritesheet.onload = function() { // Fonction exécutée lorsque le navigateur a fini de charger le PNG
    
    // Création d'un objet littéral JS représentant le joueur et ses propriétés
    player = {
        x : 100,
        y : 450,
        speed : 3,
        lives : 3,
        sprite : {
            img : spritesheet,
            offsetX : 88,
            offsetY : 3,
            width : 26,
            height : 16
        }
    };

    generateAliens();

    // Démarrage de la boucle continue
    gameloop();
};


function update() {
    if (Keyboard.LEFT) {
        player.x -= player.speed;
    }
    if (Keyboard.RIGHT) {
        player.x += player.speed;
    }

    if (player.x < 0) {
        player.x = 0;
    }
    else if (player.x + player.sprite.width > canvas.width) {
        player.x = canvas.width - player.sprite.width;
    }

    if (Keyboard.SPACE) {
        if (player_shot === null) {
            player_shot = {
                x : player.x + player.sprite.width/2 - 2,
                y : player.y,
                width : 4,
                height : 15,
                color: '#fff'
            };
        }
    }
    if (player_shot !== null) {
        player_shot.y -= 9;
        
        if (player_shot.y + player_shot.height < 0) {
            player_shot = null;
        }
    }

    animateAliens();
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Dessin du joueur
    context.drawImage(
        player.sprite.img,

        player.sprite.offsetX,
        player.sprite.offsetY,
        player.sprite.width,
        player.sprite.height,

        player.x,
        player.y,
        player.sprite.width,
        player.sprite.height
    );

    // Render aliens
    for (let i = 0; i < aliens.length; i++) {
        context.drawImage(
            aliens[i].sprite.img,
    
            aliens[i].sprite.offsetX,
            aliens[i].sprite.offsetY,
            aliens[i].sprite.width,
            aliens[i].sprite.height,
    
            aliens[i].x,
            aliens[i].y,
            aliens[i].sprite.width,
            aliens[i].sprite.height
        );
    }

    // Shot
    if (player_shot !== null) {
        context.fillStyle = player_shot.color;
        context.fillRect(player_shot.x, player_shot.y, player_shot.width, player_shot.height);
    }
}

function gameloop() {
    update();
    render();
    
    requestAnimationFrame(gameloop);
}

const keyMap = {
    37 : 'LEFT',
    38 : 'UP',
    39 : 'RIGHT',
    40 : 'DOWN',
    32 : 'SPACE',
    27 : 'ECHAP'
};
const Keyboard = {};

document.addEventListener('keydown', onKey);
document.addEventListener('keyup', onKey);

function onKey(event) {
    if (!keyMap[event.keyCode]) return;
    
    Keyboard[ keyMap[event.keyCode] ] = (event.type === 'keydown');
}
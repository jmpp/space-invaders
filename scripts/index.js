const canvas = document.getElementById('invaders');
const context = canvas.getContext('2d');

canvas.width = 480;
canvas.height = 720;

let player;
let player_shot = null;

const spritesheet = new Image();
spritesheet.src = '../img/spritesheet.png';
spritesheet.onload = function() { // Fonction exécutée lorsque le navigateur a fini de charger le PNG
    
    // Création d'un objet littéral JS représentant le joueur et ses propriétés
    player = {
        x : 100,
        y : 680,
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

document.addEventListener('keydown', event => {
    if (!keyMap[event.keyCode])
        return;

    Keyboard[ keyMap[event.keyCode] ] = true;
});
document.addEventListener('keyup', event => {
    if (!keyMap[event.keyCode])
        return;

    Keyboard[ keyMap[event.keyCode] ] = false;
});
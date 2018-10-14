function createPlayer() {
    
    // Création d'un objet littéral JS représentant le joueur et ses propriétés
    const player = {
        x : 100,
        y : 450,
        speed : 3,
        lives : 3,
        score : 0,
        sprite : {
            img : spritesheet,
            offsetX : 88,
            offsetY : 3,
            width : 26,
            height : 16
        },
        bullet : null
    };

    return player;
}

function animatePlayer() {

    if (Keyboard.LEFT) {
        player.x -= player.speed;
    }
    if (Keyboard.RIGHT) {
        player.x += player.speed;
    }

    // Gestion débordements d'écran du joueur.
    if (player.x < 0) { // Si trop à gauche, le joueur s'arrête
        player.x = 0;
    }
    else if (player.x + player.sprite.width > canvas.width) { // sinon, si trop à droite, le joueur s'arrête aussi
        player.x = canvas.width - player.sprite.width;
    }

    // Si le joueur tire ...
    if (Keyboard.SPACE) {
        if (player.bullet === null) {
            player.bullet = {
                x : player.x + player.sprite.width/2 - 2,
                y : player.y,
                width : 4,
                height : 15,
                color: '#0f0'
            };
            // Son
            sounds['player_shoot'].play();
        }
    }
    if (player.bullet !== null) {
        player.bullet.y -= 9;
        
        if (player.bullet.y + player.bullet.height < 0) {
            player.bullet = null;
        }
    }
}

function renderPlayer() {

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
    if (player.bullet !== null) {
        context.fillStyle = player.bullet.color;
        context.fillRect(player.bullet.x, player.bullet.y, player.bullet.width, player.bullet.height);
    }
}
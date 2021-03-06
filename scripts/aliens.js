const NB_ALIENS_PER_LINE = 11; // Nombre d'aliens par ligne
const ALIEN_SPACE_X = 35;
const ALIEN_SPACE_Y = 28;
const aliensMap = [
    40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
    10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
    10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10
];
const alienSprites = {
    40 : [
        { x:6 , y:3  , width:16 , height:16 },
        { x:6 , y:25 , width:16 , height:16 }
    ],
    20 : [
        { x:32 , y:3  , width:22 , height:16 },
        { x:32 , y:25 , width:22 , height:16 }
    ],
    10 : [
        { x:60 , y:25 , width:24 , height:16 },
        { x:60 , y:3  , width:24 , height:16 }
    ]
};
let aliensTimer = 1000; // intervalle de mouvements d'aliens en milli-secondes
let lastAlienMovement = 0; // timecode du dernier déplacement des aliens
let alienSoundNb = 0; // numéro de son de l'alien (variera de 0 à 3, en boucle)
let alienExplosions = []; // Tableau qui servira à stocker les sprites d'explosion
let aliensShots = []; // Tableau qui servira à stocker les coordonnées des occasionnels tirs des aliens

function createAliens() {
    
    const aliens = [];

    for (let i = 0, line = 0; i < aliensMap.length; i++) {
        if (i % NB_ALIENS_PER_LINE === 0) {
            line++;
        }

        if (aliensMap[i] === 0) continue;

        let alienWidth = alienSprites[ aliensMap[i] ][ 0 ].width;
        let alienHeight = alienSprites[ aliensMap[i] ][ 0 ].height;
        
        aliens.push({
            x           : 10 + i % NB_ALIENS_PER_LINE * ALIEN_SPACE_X + (24 - alienWidth / 2 | 0),
            y           : 100 + line * ALIEN_SPACE_Y,
            width       : alienWidth,
            height      : alienHeight,
            points      : aliensMap[i],
            spriteIndex : 0,
            direction   : 1 // Facteur multiplicateur pour gérer la direction de l'alien (1 : droite, -1 : gauche)
        });
    }

    return aliens;
}

function animateAliens() {

    // Mouvement des aliens de gauche à droite et vers le bas
    if (Date.now() - lastAlienMovement > aliensTimer) {
        
        lastAlienMovement = Date.now(); // Mise à jour de l'instant du dernier mouvement du joueur à "maintenant"!

        // Vérification si un des aliens du groupe a atteint le joueur
        // Pour cela, récupération des coordonnées de l'alien le plus bas dans le groupe
        let extremeDownAlien = Math.max(...aliens.map(alien => alien.y));
        if (extremeDownAlien + 16 >= player.y) {
            player.lives = 0;
            sounds['player_death'].play();
            game_mode = MODE_GAME_OVER;
        }

        // Vérification si un changement de direction du groupe d'aliens doit être effectué
        // Pour cela, récupération des coordonnées des 2 aliens se trouvants respectivement aux extrêmes gauche et droite du groupe
        let extremeLeftAlien = Math.min(...aliens.map(alien => alien.x));
        let extremeRightAlien = Math.max(...aliens.map(alien => alien.x)) + ALIEN_SPACE_X;

        // Test Booléen pour vérifier si le groupe d'aliens est sur le point de percuter un bord de la zone de jeu
        // Dans ce cas, on stocke ce résultat de ce test (true ou false) dans la variable "aliensWallCollision"
        let aliensWallCollision = (extremeLeftAlien - 12 < 0 && aliens[0].direction === -1 || extremeRightAlien + 12 > canvas.width && aliens[0].direction === 1);
        
        // Parcours du tableau d'aliens pour mise à jour
        for (let i = 0; i < aliens.length; i++) {
            // Si le groupe d'aliens touche un bord de l'écran, chaque alien change sa variable de direction, ainsi que sa position verticale (pour descendre d'un cran)
            if (aliensWallCollision) {
                aliens[i].direction *= -1;
                aliens[i].y += 22;
            }
            else {
                aliens[i].x += 12 * aliens[i].direction;
            }

            // Mise à jour des coordonnées des sprites (pour gérer l'animation des aliens)
            aliens[i].spriteIndex = (aliens[i].spriteIndex + 1) % 2;

            // Un alien peut occasionnellement tirer...
            alienShot(aliens[i]);
        }

        // Son des aliens
        sounds['invader' + (alienSoundNb % 4)].play();
        alienSoundNb++;
    }
    
    // Vérification si un alien se prend un tir
    if (player.bullet !== null) {
        for (let i = 0; i < aliens.length; i++) {

            if (player.bullet.x >= aliens[i].x &&
                player.bullet.x + player.bullet.width <= aliens[i].x + aliens[i].width &&
                player.bullet.y <= aliens[i].y + aliens[i].height &&
                player.bullet.y + player.bullet.height > aliens[i].y) {
                // Collision!
                alienExplode(aliens[i]);
                // Son
                sounds['invader_killed'].play();
                // Augmentation du score joueur
                player.score += aliens[i].points;
                player.bullet = null;
                // Augmentation de la vitesse générale des aliens
                aliensTimer -= 15;
                if (aliensTimer < 75) {
                    aliensTimer = 75;
                }
                // Suppression de l'alien du tableau
                aliens.splice(i, 1);
                break;
            }
        }
    }

    // Suppression des animations d'explosion ayant dépassé les 100ms
    for (let i = 0; i < alienExplosions.length; i++) {
        if (Date.now() - alienExplosions[i].dateCreated > 100) {
            alienExplosions.splice(i, 1);
            i--;
        }
    }

    // Gestion des shoots aliens
    for (let i = 0; i < aliensShots.length; i++) {
        aliensShots[i].y += aliensShots[i].speed;

        if (aliensShots[i].y > canvas.height) {
            aliensShots.splice(i, 1);
            i--;
        }
        else if (aliensShots[i].x > player.x &&
                aliensShots[i].x + aliensShots[i].width < player.x + player.sprite.width &&
                aliensShots[i].y + aliensShots[i].height >= player.y &&
                aliensShots[i].y < player.y + player.sprite.height) {
            // Moins 1 vie
            player.lives--;
            
            // Game over ?
            if (player.lives === 0) {
                game_mode = MODE_GAME_OVER;
                break;
            }

            // Suppression des tirs aliens en cours
            aliensShots.length = 0;
            // Suppression du tir joueur en cours
            player.bullet = null;

            // Changement du mode de jeu pour 2 secondes
            game_mode = MODE_PLAYER_DEAD;
            setTimeout(() => {
                // Replacement du joueur à sa position initiale
                player.x = 100;
                player.y = 450;

                game_mode = MODE_PLAYING;
            }, 2000);

            // Son
            sounds['player_death'].play();

            break;
        }
    }
}

function renderAliens() {

    for (let i = 0; i < aliens.length; i++) {
        
        let points      = aliens[i].points;
        let spriteIndex = aliens[i].spriteIndex;

        context.drawImage(
            spritesheet,
    
            alienSprites[points][spriteIndex].x,
            alienSprites[points][spriteIndex].y,
            alienSprites[points][spriteIndex].width,
            alienSprites[points][spriteIndex].height,
    
            aliens[i].x,
            aliens[i].y,
            alienSprites[points][spriteIndex].width,
            alienSprites[points][spriteIndex].height
        );
    }

    // Explosions des aliens
    for (let i = 0; i < alienExplosions.length; i++) {
        context.drawImage(
            spritesheet,
    
            alienExplosions[i].sprite.x,
            alienExplosions[i].sprite.y,
            alienExplosions[i].sprite.width,
            alienExplosions[i].sprite.height,
    
            alienExplosions[i].x,
            alienExplosions[i].y,
            alienExplosions[i].sprite.width,
            alienExplosions[i].sprite.height
        );
    }

    // Shot des aliens
    for (let i = 0; i < aliensShots.length; i++) {
        context.fillStyle = '#fff';
        context.fillRect(aliensShots[i].x, aliensShots[i].y, aliensShots[i].width, aliensShots[i].height);
    }
}

function alienExplode(alien) {
    alienExplosions.push({
        x : alien.x,
        y : alien.y,
        sprite : { // Coordonnées du sprite de l'explosion dans le spritesheet
            x      : 88,
            y      : 25,
            width  : 26,
            height : 16
        },
        dateCreated : Date.now()
    });
}

function alienShot(alien) {
    if (Math.random() > 0.99) {
        // Son
        sounds['shoot'].play();
        // Ajout d'un shoot alien dans le tableau correspondant
        aliensShots.push({
            x : alien.x + alienSprites[alien.points][alien.spriteIndex].width/2,
            y : alien.y + alienSprites[alien.points][alien.spriteIndex].height,
            width : 4,
            height : 10,
            speed : 5
        });
    }
}
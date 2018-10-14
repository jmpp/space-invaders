const aliensPos = [
    40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
    10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
    10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10
];

const aliensSpriteCoords = {
    40 : [ [6, 3, 16, 16], [6, 25, 16, 16] ],
    20 : [ [32, 3, 22, 16], [32, 25, 22, 16] ],
    10 : [ [60, 3, 24, 16], [60, 25, 24, 16] ]
};

const NB_ALIENS_PER_LINE = 11; // Nombre d'aliens par ligne

let aliensTimer = 1000; // intervalle de mouvements d'aliens en milli-secondes
let lastAlienMovement = 0; // timecode du dernier déplacement des aliens
let alienSpriteTicker = 0; // Indicateur pour alterner les sprites
let diedAliensIndex = []; // Tableau contenant les indices des aliens qui sont marqués comme morts
let alienDiedTimer = 0; // Timer pour laisser apparaître momentanément l'animation de mort sur un alien touché

let alienSound = 0;

function createAliens() {
    
    const aliens = [];

    for (let i = 0, line = 0; i < aliensPos.length; i++) {
        if (i % NB_ALIENS_PER_LINE === 0) {
            line++;
        }

        if (aliensPos[i] === 0) continue;
        
        aliens.push({
            x : 10 + i % NB_ALIENS_PER_LINE * 35 + (24 - aliensSpriteCoords[aliensPos[i]][0][2] / 2 | 0),
            y : 100 + line * 28,
            points : aliensPos[i],
            direction : 1, // Facteur multiplicateur pour gérer la direction de l'alien (1 : droite, -1 : gauche)
            sprite : {
                img : spritesheet,
                offsetX : aliensSpriteCoords[aliensPos[i]][0][0],
                offsetY : aliensSpriteCoords[aliensPos[i]][0][1],
                width : aliensSpriteCoords[aliensPos[i]][0][2],
                height : aliensSpriteCoords[aliensPos[i]][0][3]
            }
        });
    }

    return aliens;
}

function animateAliens() {

    // Mouvement des aliens de gauche à droite et vers le bas
    if (Date.now() - lastAlienMovement > aliensTimer) {
        // Vérification si un changement de direction du groupe d'aliens doit être effectué
        // Pour cela, récupération des coordonnées des 2 aliens se trouvants respectivement aux extrêmes gauche et droite du groupe
        let extremeLeftAlien = Math.min(...aliens.map(alien => alien.x));
        let extremeRightAlien = Math.max(...aliens.map(alien => alien.x)) + 30;

        // Test Booléen pour vérifier si le groupe d'aliens est sur le point de percuter un bord de la zone de jeu
        // Dans ce cas, on stocke ce résultat de ce test (true ou false) dans la variable "aliensWallCollision"
        let aliensWallCollision = (extremeLeftAlien - 12 < 0 && aliens[0].direction === -1 || extremeRightAlien + 12 > canvas.width && aliens[0].direction === 1);
        
        alienSpriteTicker++;
        lastAlienMovement = Date.now();
        
        // Parcours du tableau d'aliens pour mise à jour
        for (let i = 0; i < aliens.length; i++) {
            // Si l'ID de cet alien se trouve dans le tableau des aliens supprimés, on l'ignore ici.
            if (diedAliensIndex.includes(i))
                continue;

            // Si le groupe d'aliens touche un bord de l'écran, chaque alien change sa variable de direction, ainsi que sa position verticale (pour descendre d'un cran)
            if (aliensWallCollision) {
                aliens[i].direction *= -1;
                aliens[i].y += 22;
            }
            else {
                aliens[i].x += 12 * aliens[i].direction;
            }

            // Mise à jour des coordonnées des sprites (pour gérer l'animation des aliens)
            aliens[i].sprite.offsetX = aliensSpriteCoords[aliens[i].points][alienSpriteTicker % 2][0];
            aliens[i].sprite.offsetY = aliensSpriteCoords[aliens[i].points][alienSpriteTicker % 2][1];
            aliens[i].sprite.width = aliensSpriteCoords[aliens[i].points][alienSpriteTicker % 2][2];
            aliens[i].sprite.height = aliensSpriteCoords[aliens[i].points][alienSpriteTicker % 2][3];
        }

        // Son des aliens
        sounds['invader' + (alienSound % 4)].play();
        alienSound++;
    }
    
    // Vérification si un alien se prend un tir
    if (player.bullet !== null) {
        for (let i = 0; i < aliens.length; i++) {
            if (diedAliensIndex.includes(i)) continue;

            if (player.bullet.x >= aliens[i].x &&
                player.bullet.x + player.bullet.width <= aliens[i].x + aliens[i].sprite.width &&
                player.bullet.y <= aliens[i].y + aliens[i].sprite.height &&
                player.bullet.y + player.bullet.height > aliens[i].y) {
                // Collision!
                aliens[i].x = aliens[i].x + aliens[i].sprite.width/2 - (26 / 2) | 0;
                aliens[i].sprite.offsetX = 88;
                aliens[i].sprite.offsetY = 25;
                aliens[i].sprite.width = 26;
                aliens[i].sprite.height = 16;
                // Marquage de l'alien comme "tué", ce qui l'affichera avec le sprite de collision, juste avant de disparaître après un timer
                diedAliensIndex.push(i);
                alienDiedTimer = Date.now();
                // Son
                sounds['invader_killed'].play();
                // Augmentation du score joueur
                player.score += aliens[i].points;
                player.bullet = null;
                // Augmentation de la vitesse des aliens
                aliensTimer -= 15;
                if (aliensTimer < 75) {
                    aliensTimer = 75;
                }
                break;
            }
        }
    }

    // Suppression définitive des aliens marqués comme "tués"
    for (let i = 0; i < diedAliensIndex.length; i++) {
        if (Date.now() - alienDiedTimer > 100) {
            aliens.splice(diedAliensIndex[i], 1);
            diedAliensIndex.splice(i, 1);
            i--;
            alienDiedTimer = Date.now();
        }
    }
}

function renderAliens() {

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
}
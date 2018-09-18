(function(Invaders) {

    class Game {
        constructor(canvas) {
            this.canvas = canvas;
            this.context = canvas.getContext('2d');
            
            this.canvas.width = 480;
            this.canvas.height = 720;

            this.player = new Invaders.Player();
        }
    
        update() {
            this.player.update();
        }
    
        render() {
            this.player.render();
        }
    
        run() {
            requestAnimationFrame(this.run.bind(this));
    
            this.update();
            this.render();
        }
    }

    // Export de la classe "Game" dans l'objet global "Invaders"
    Invaders.Game = Game;

})(window.Invaders);

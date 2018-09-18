(function(Invaders) {

    class Player {
        constructor(x = 120, y = 620) {
            this.x = x;
            this.y = y;
        }
    
        update() {
        }
    
        render() {
            
        }
    }

    // Export de la classe "Player" dans l'objet global "Invaders"
    Invaders.Player = Player;

})(window.Invaders);

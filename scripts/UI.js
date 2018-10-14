function renderUI() {
    context.fillStyle = '#0f0';
    context.font = 'normal 20px "Press Start 2P", cursive';
    context.textAlign = 'left';
    context.fillText('SCORE: ' + player.score, 20, 40);
    
    context.textAlign = 'right';
    context.fillText('VIES: ' + player.lives, canvas.width - 20, 40);
    
    // Dessin de la ligne verte horizontale
    
    context.strokeStyle = '#0f0';
    context.moveTo(20, canvas.height - 40);
    context.lineTo(canvas.width - 20, canvas.height - 40);
    context.stroke();
}
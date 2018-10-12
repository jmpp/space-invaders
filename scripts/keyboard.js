const Keyboard = {};

const keyMap = {
    37 : 'LEFT',
    38 : 'UP',
    39 : 'RIGHT',
    40 : 'DOWN',
    32 : 'SPACE',
    27 : 'ECHAP'
};

document.addEventListener('keydown', onKey);
document.addEventListener('keyup', onKey);

function onKey(event) {
    if (!keyMap[event.keyCode]) return;
    
    Keyboard[ keyMap[event.keyCode] ] = (event.type === 'keydown');
}
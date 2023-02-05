const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');

const btn_up = document.querySelector('#up');
const btn_left = document.querySelector('#left');
const btn_right = document.querySelector('#right');
const btn_down = document.querySelector('#down');

const playerPos = {
    x: undefined,
    y: undefined
};

const giftPos = {
    x: undefined,
    y: undefined
};

let bombPos = [];

let timeStart;
let timePlayer;
let timeInterval;


let mapCount = 0;
let lives = 3;

window.addEventListener('load', setCavasSize);
window.addEventListener('resize', setCavasSize);
window.addEventListener('keydown', logKey);

btn_up.addEventListener('click', moveUp);
btn_left.addEventListener('click', moveLeft);
btn_right.addEventListener('click', moveRight);
btn_down.addEventListener('click', moveDown);

let canvasSize;
let elementSize;

function setCavasSize() {

    if (window.innerWidth > window.innerHeight) {
        canvasSize = window.innerHeight * 0.8;
    } else {
        canvasSize = window.innerWidth * 0.8;
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementSize = canvasSize / 10;

    startGame();

}

function startGame() {
    clearMap();
    buildMap();
    showPLayer();
}

function gameWin() {
    console.log('finalizaste el juego');
    clearInterval(timeInterval);
}

function buildMap() {
    game.font = elementSize + 'px Arial';
    game.textAlign = 'end';
    bombPos = [];
    let level = maps[mapCount];
    if (!level) {
        gameWin();
        return;
    }
    const map1 = level
        .match(/[IXO\-]+/g)
        .map(a=>a.split(''));
    map1.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const posX = elementSize * (colI+1);
            const posY = elementSize * (rowI+1);
            game.fillText(emojis[col], posX, posY);
            if (col == 'O' && playerPos.x == undefined){
                playerPos.x = posX,
                playerPos.y = posY
            }
            if (col == 'I' && giftPos.x == undefined){
                giftPos.x = posX,
                giftPos.y = posY
            }
            if (col == 'X') {
                bombPos.push(
                    {
                        x: posX,
                        y: posY
                    }
                );
            }
        })
    });
    numberLives();
    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
    }
}

function numberLives() {

    const arrayLives = Array(lives).fill(emojis['WIN'])
    spanLives.innerHTML = "";
    arrayLives.forEach(item => spanLives.append(item));
}

function clearMap() {
    game.clearRect(0, 0, canvasSize, canvasSize);
}

function showPLayer() {
    game.fillText(emojis['PLAYER'], playerPos.x, playerPos.y);
}

function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
}

function move() {
    playedInGift();
    playedInBomb();
    resetMap();
    clearMap();
    buildMap();
    showPLayer();
}

function playedInBomb() {
    const isBomb = bombPos.find((bomb)=>{
        coincideX = playerPos.x.toFixed(1) === bomb.x.toFixed(1)
        coincideY = playerPos.y.toFixed(1) === bomb.y.toFixed(1)
        return coincideX && coincideY
    });
    if (isBomb) {
        playerPos.x = undefined;
        playerPos.y = undefined;
        lives -= 1;
    }
}

function resetMap() {
    if (lives === 0) {
        lives = 3;
        mapCount = 0;
        playerPos.x = undefined;
        playerPos.y = undefined;
        giftPos.x = undefined;
        giftPos.y = undefined;
        timeStart = undefined;
    }
}

function playedInGift() {
    coincideX = playerPos.x.toFixed(1) === giftPos.x.toFixed(1)
    coincideY = playerPos.y.toFixed(1) === giftPos.y.toFixed(1)
    if ( coincideX && coincideY) {
        giftPos.x = undefined;
        giftPos.y = undefined;
        mapCount++ ;
    }
}

function moveUp() {
    if (playerPos.y - elementSize > 0   ) {
        playerPos.y -= elementSize;
        move();
    }
}

function moveDown() {
    if (playerPos.y < canvasSize) {
        playerPos.y += elementSize;
        move();
    }
}

function moveLeft() {
    if (playerPos.x - elementSize > 0) {
        playerPos.x -= elementSize;
        move();
    }
}

function moveRight() {
    if (playerPos.x < canvasSize) {
        playerPos.x += elementSize;
        move();
    }
}

function logKey(e) {
    switch (e.key) {
        case 'ArrowUp':
            moveUp()
            break;
        case 'ArrowLeft':
            moveLeft()
            break;
        case 'ArrowRight':
            moveRight()
            break;
        case 'ArrowDown':
            moveDown()
            break;
        default:
            break;
    }
}
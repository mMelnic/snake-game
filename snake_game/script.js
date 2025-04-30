const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

const snake = [{ x: 200, y: 200 }];
const snakeSize = 20;
let dx = snakeSize; // Horizontal movement
let dy = 0; // Vertical movement

function drawGameBoard() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = "lime";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    snake.pop();
}

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp" && dy === 0) {
        dx = 0; dy = -snakeSize;
    } else if (event.key === "ArrowDown" && dy === 0) {
        dx = 0; dy = snakeSize;
    } else if (event.key === "ArrowLeft" && dx === 0) {
        dx = -snakeSize; dy = 0;
    } else if (event.key === "ArrowRight" && dx === 0) {
        dx = snakeSize; dy = 0;
    }
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGameBoard();
    moveSnake();
    drawSnake();
    setTimeout(gameLoop, 100);
}

gameLoop();
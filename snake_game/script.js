const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

const snake = [{ x: 200, y: 200 }];
const snakeSize = 20;
let dx = snakeSize; // Horizontal movement
let dy = 0; // Vertical movement

const food = { x: 0, y: 0 };

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

function checkWallCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        alert("Game Over! You hit the wall.");
        resetGame();
    }
}

function checkSelfCollision() {
    const head = snake[0];

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            alert("Game Over! You hit yourself.");
            resetGame();
        }
    }
}

function spawnFood() {
    food.x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
    food.y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
}

function checkFoodCollision() {
    const head = snake[0];

    if (head.x === food.x && head.y === food.y) {
        snake.push({});
        spawnFood();
    }
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
    drawFood();
    checkWallCollision();
    checkSelfCollision();
    checkFoodCollision();
    setTimeout(gameLoop, 100);
}

function resetGame() {
    snake.length = 1;
    snake[0] = { x: 200, y: 200 };
    dx = snakeSize;
    dy = 0;
    spawnFood();
}

gameLoop();
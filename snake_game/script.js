const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

const snake = [{ x: 200, y: 200 }];
const snakeSize = 20;
let dx = snakeSize; // Horizontal movement
let dy = 0; // Vertical movement

const food = { x: 0, y: 0 };
const powerUp = { x: 0, y: 0, type: "" };

let isPaused = false;
let powerUpRemainingTime = 0;
let powerUpStartTime = 0;
let pauseStartTime = 0;
let gameSpeed = 100;
let score = 0;
let timeout;
let powerUpInterval;
let powerUpTimeout;
let highScore = localStorage.getItem("highScore") || 0;

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
    let valid = false;
    while (!valid) {
        const x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
        const y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;

        valid = !snake.some(segment => segment.x === x && segment.y === y);
        if (valid) {
            food.x = x;
            food.y = y;
        }
    }
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
        score += 1;
        document.getElementById("scoreDisplay").textContent = "Score: " + score;

        if (gameSpeed > 50) {
            gameSpeed -= 5; 
        }
    }
}

function spawnPowerUp() {
    if (powerUp.type) return;
    const types = ["food", "slow", "doublePoints"];
    powerUp.x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
    powerUp.y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
    powerUp.type = types[Math.floor(Math.random() * types.length)];

    clearTimeout(powerUpTimeout);
    powerUpStartTime = Date.now();
    powerUpRemainingTime = 5000;

    clearTimeout(powerUpTimeout);
    powerUpTimeout = setTimeout(() => {
        powerUp.type = "";
    }, powerUpRemainingTime);
}

function drawPowerUp() {
    if (!powerUp.type) return;
    ctx.fillStyle = powerUp.type === "food" ? "blue" :
                    powerUp.type === "slow" ? "yellow" :
                    powerUp.type === "doublePoints" ? "purple" : "white";
    
    ctx.fillRect(powerUp.x, powerUp.y, snakeSize, snakeSize);
}

function startPowerUpSpawning() {
    clearTimeout(timeout);
    clearInterval(powerUpInterval);

    timeout = setTimeout(() => {
        spawnPowerUp();
        powerUpInterval = setInterval(spawnPowerUp, 15000);
    }, 15000);
}

function checkPowerUpCollision() {
    const head = snake[0];

    if (head.x === powerUp.x && head.y === powerUp.y) {
        if (powerUp.type === "food") {
            spawnFood();
        } else if (powerUp.type === "slow") {
            gameSpeed += 50;
            setTimeout(() => gameSpeed -= 50, 5000);
        } else if (powerUp.type === "doublePoints") {
            score += 1;
        }
        powerUp.type = ""; // Reset power-up after collection
    }
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
}

document.addEventListener("keydown", function(event) {
    event.preventDefault();

    if (event.code === "Space") {
        isPaused = !isPaused;

        if (isPaused) {
            pauseStartTime = Date.now();
            clearInterval(powerUpInterval); // Pause future spawning
            clearTimeout(powerUpTimeout);// Pause expiration
            powerUpRemainingTime -= Date.now() - powerUpStartTime; 
        } else {
            if (powerUp.type && powerUpRemainingTime > 0) {
                powerUpStartTime = Date.now();
                powerUpTimeout = setTimeout(() => {
                    powerUp.type = "";
                }, powerUpRemainingTime);
            }
            powerUpInterval = setInterval(spawnPowerUp, 15000);
        }
        return;
    }

    if (!isPaused) {
        if (event.key === "ArrowUp" && dy === 0) {
            dx = 0; dy = -snakeSize;
        } else if (event.key === "ArrowDown" && dy === 0) {
            dx = 0; dy = snakeSize;
        } else if (event.key === "ArrowLeft" && dx === 0) {
            dx = -snakeSize; dy = 0;
        } else if (event.key === "ArrowRight" && dx === 0) {
            dx = snakeSize; dy = 0;
        }
    }
});

function gameLoop() {
    if (isPaused) {
        setTimeout(gameLoop, gameSpeed);
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGameBoard();
    document.getElementById("highScoreDisplay").textContent = "High Score: " + highScore;
    moveSnake();
    drawSnake();
    drawFood();
    drawPowerUp();
    checkWallCollision();
    checkSelfCollision();
    checkFoodCollision();
    checkPowerUpCollision();
    setTimeout(gameLoop, gameSpeed);
}

function resetGame() {
    updateHighScore();

    snake.length = 1;
    snake[0] = { x: 200, y: 200 };
    dx = snakeSize;
    dy = 0;
    score = 0;
    gameSpeed = 100;
    document.getElementById("scoreDisplay").textContent = "Score: 0";
    document.getElementById("highScoreDisplay").textContent = "High Score: " + highScore;
    powerUp.type = "";

    spawnFood();
    startPowerUpSpawning();
}

spawnFood();
startPowerUpSpawning();
gameLoop();
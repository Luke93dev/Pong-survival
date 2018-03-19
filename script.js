const hideAll = document.querySelector('#hideAll');
window.onload = () => {
    hideAll.style.display = "none";
}

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const message = document.querySelector('.message');
const yourtime = document.querySelector('#yourtime')
let time_start, time_end, time


//Funkcja określająca pole gry

function field() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const lineWidth = 6;
    const lineHeight = 16;

    for (let linePosition = 20; linePosition < canvas.height; linePosition += 30) {
        context.fillStyle = "white"
        context.fillRect(canvas.width / 2 - lineWidth / 2, linePosition, lineWidth, lineHeight)
    }
}

// Konstruktor obiektu Ball

function Ball() {
    this.ballRadius = 12;
    this.x = canvas.width / 2 - this.ballRadius;
    this.y = canvas.height / 2 - this.ballRadius;
    this.speedX = 6;
    this.speedY = 6;

    this.draw = function () {
        context.beginPath();
        context.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
        context.fillStyle = "red";
        context.fill();
        context.closePath();
        ball.x += ball.speedX;
        ball.y += ball.speedY;

        if (this.y - this.ballRadius <= 0 || this.y + this.ballRadius >= canvas.height) {
            this.speedY = -this.speedY;
        }

        function GameOver() {
            time_end = Date.now()
            clearInterval(speed_interval);
            clearInterval(start_interval);
            message.style.display = "flex";
            div_speedUp.style.display = "none";
        }

        if (this.x <= 90 + this.ballRadius && (player.y - this.y) <= 10 && (player.y - this.y) >= -110) {
            this.speedX = -this.speedX;
            console.log(ball.x);
        } else if (this.x < 90 + this.ballRadius) {
            GameOver();
            time = ((time_end - time_start) / 1000).toFixed(1);
            yourtime.innerHTML = time;


        }
        if (this.x >= 690 && (computer.y - this.y) <= 0 && (computer.y - this.y) >= -100) {
            this.speedX = -this.speedX;
        }
        /* Gdybyśmy chcieli zmienić parametry komputerowego gracza, aby można było z nim wygrać :)
         else if (this.x > 690) {
            // alert("Wygrałeś!")
        } */
    }
}

// Kontruktor obiektów graczy (player i komputer)

function Player(x, y, color) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 100;
    this.color = color;
}

Player.prototype.draw = function () {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
};


//Stworzenie nowych obiektów przy użyciu funkcji kostruktorów

const player = new Player(70, 200, "#def323");
const computer = new Player(710, 200, "#123456");
let ball = new Ball();


// Funkcja realizująca przyśpieszenie piłki w miarę upływającego czasu

const div_speedUp = document.getElementById('speedUp');

function speedUp() {
    ball.speedX > 0 ? ball.speedX += 3.5 : ball.speedX -= 3.5;
    ball.speedY > 0 ? ball.speedY += 3 : ball.speedY -= 3;


    div_speedUp.innerHTML = "SpeedUp!";
    div_speedUp.classList.remove('hide')
    div_speedUp.style.display = "block";
    setTimeout(hide, 2000)

    function hide() {
        div_speedUp.classList.add('hide')
    }
}


// Skoordynowanie paletki gracza do ruchów myszką, ograniczenie ruchu w osi Y dp granicy płótna

canvas.addEventListener("mousemove", playerPosition)

function playerPosition(event) {
    const topCanvas = canvas.offsetTop;

    player.y = event.clientY - topCanvas - player.height / 2;

    if (player.y >= canvas.height - player.height) {
        player.y = canvas.height - player.height
    }

    if (player.y <= 0) {
        player.y = 0;
    }
}


// Funkcja dzięki której paletka komputera podąża za piłką na własnym polu gry z zadaną prędkością

function computerPosition() {
    const PaddleToBall = computer.y + (computer.height / 2) - (ball.y);

    if (ball.x > 400) {
        if (PaddleToBall > 0) {
            ball.speedX > 12 ? computer.y -= 25 : computer.y -= 12;
        } else {
            ball.speedX > 12 ? computer.y += 25 : computer.y += 12;
        }
    }
}

// Funkcja powodująca ponowne uruchomienie gry

function playAgain() {
    ball = new Ball();
    start();
    clearInterval(speed_interval);
    speed_interval = setInterval(speedUp, 10000);
    message.style.display = "none";
}

// Funcka wywoływana w trakcie pierwszego uruchomienia gry

let start_interval, speed_interval

function start() {
    function refresh() {
        field()
        player.draw();
        computerPosition()
        computer.draw();
        ball.draw()
    }
    start_interval = setInterval(refresh, 1000 / 60)
    speed_interval = setInterval(speedUp, 10000);
    start_button.style.display = "none";
    time_start = Date.now()
}


// Początkowy stan gry, oczekiwanie na wciśnięcie przycisku START (zainicjowanie fukcji start())

const start_button = document.getElementById('start-button');
start_button.addEventListener("click", start);
field()
player.draw();
computer.draw();

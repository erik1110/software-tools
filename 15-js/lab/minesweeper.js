const element = document.querySelector("button");
element.addEventListener("click", myfunction);
let mines = Array(400);
let playable = true;
let untouched_tiles = Array(400);
let timer;
let timeElapsed;

function startTimer() {
    timeElapsed = 0;
    const timerDisplay = document.getElementById("timer");
    timerDisplay.textContent = "Time: 0s";

    timer = setInterval(() => {
        timeElapsed++;
        timerDisplay.textContent = `Time: ${timeElapsed}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function myfunction() {
    let board = document.querySelector(".board");
    playable = true;
    // clear all elements
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }
    mines.fill(0);
    untouched_tiles.fill(0);
    // create elements
    for (let i = 0; i < 400; i++) {
        let random = Math.random();
        if (random < 0.1) {
            mines[i] = 1;
        }
        let id = `tile_${i+1}`
        let tile = document.createElement('div');
        tile.addEventListener("click", function() {touchTile(i)});
        tile.id = id;
        board.appendChild(tile);
    }
    // start Timer
    startTimer();
}

function touchTile(i) {
    if (!playable || untouched_tiles[i] == 1) {return};
    let id = `tile_${i+1}`;
    let tile = document.getElementById(id);
    let neighbor_mines = mineNeighbours(i);
    if (mines[i] == 1) {
        tile.className = 'bomb';
        tile.textContent = '*';
        playable = false;
        revealAllBombs();
        stopTimer();
    } else {
        tile.className = 'clear';
        untouched_tiles[i] = 1;
        if (neighbor_mines != 0) {
            tile.textContent = neighbor_mines;
            switch (neighbor_mines) {
                case 1: tile.style.color = 'blue'; break;
                case 2: tile.style.color = 'green'; break;
                case 3: tile.style.color = 'red'; break;
                case 4: tile.style.color = 'purple'; break;
                case 5: tile.style.color = 'maroon'; break;
                case 6: tile.style.color = 'turquoise'; break;
                case 7: tile.style.color = 'black'; break;
                case 8: tile.style.color = 'gray'; break;
            }
        } else {
            const neighbours = findNeighbours(i);
            for (const neighbour of neighbours) {
                touchTile(neighbour);
            }
        }
    }
    checkIfWin();
}

function checkIfWin() {
    let not_mines_sum = 400 - mines.reduce((acc, curr) => acc + curr, 0);
    let untouched_sum = untouched_tiles.reduce((acc, curr) => acc + curr, 0);
    if (not_mines_sum == untouched_sum) {
        stopTimer();
        alert("You win!");
        addToScoreboard(timeElapsed);
        playable = false;
    }
}

function findNeighbours(i) {
    const neighbors = [];
    const row = Math.floor(i / 20);
    const col = i % 20;


    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (newRow >= 0 && newRow < 20 && newCol >= 0 && newCol < 20) {
            neighbors.push(newRow * 20 + newCol );
        }
    }

    return neighbors;
}

function mineNeighbours(i) {
    const neighbours = findNeighbours(i);
    console.log("neighbours:", neighbours);
    let bombs = 0;
    for (const neighbour of neighbours) {
        bombs += mines[neighbour];
    }
    return bombs;
}

function revealAllBombs() {
    for (let i=0; i < 400; i++) {
        let id = `tile_${i+1}`;
        let tile = document.getElementById(id);
        if (mines[i] == 1) {
            tile.className = 'bomb';
            tile.textContent = '*';
        }
    }
}

let scoreboard = [];

function addToScoreboard(time) {
    scoreboard.push(time);
    scoreboard.sort((a, b) => a - b);
    updateScoreboard();
}

function updateScoreboard() {
    const scoreboardDisplay = document.getElementById("scoreboard");
    scoreboardDisplay.innerHTML = "<h3>Scoreboard</h3>";
    scoreboard.forEach((time, index) => {
        const entry = document.createElement("div");
        entry.textContent = `Game ${index + 1}: ${time}s`;
        scoreboardDisplay.appendChild(entry);
    });
}
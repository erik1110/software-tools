const element = document.querySelector("button");
element.addEventListener("click", myfunction);
let mines = Array(400);
let playable = true;
let untouched_tiles = Array(400);

function myfunction() {
    let board = document.querySelector("div");
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
    console.log("mines:", mines);
}

function touchTile(i) {
    // if (!playable) {return};
    if (untouched_tiles[i] == 1) {return};
    let id = `tile_${i+1}`;
    let tile = document.getElementById(id);
    let neighbor_mines = mineNeighbours(i);
    if (mines[i] == 1) {
        tile.className = 'bomb';
        tile.textContent = '*';
        playable = false;
    } else {
        tile.className = 'clear';
        untouched_tiles[i] = 1;
        if (neighbor_mines != 0) {
            tile.textContent = neighbor_mines;
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
        alert("You win!");
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

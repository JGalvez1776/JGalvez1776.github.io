var WIDTH = 7;
var HEIGHT = 6;
var player = 0;
var board = Array.from(Array(HEIGHT), () => new Array(WIDTH));
var count = 0;
var colors = ["#FF0000", "#0000FF"];
var black = "#121213";
var canClick = false;
var moves = [];

// TODO: 
// - Save the moves log to replay games/leaderboards
// - Add button to play again
// - Maybe add an animation to the home screen
// - Add outline to board???


// 7 wide 
// 6 tall

// -1 = EMPTY
//  0 = Player One
//  1 = Player Two  

function columnClicked(x) { 
    if (!canClick) return;
    canClick = false;
    var y = place(x);
    if (y == -1) {
        // Board full
        // Give error
        console.log("FULL ROW");
    } else {
        count++;
        console.log("X: " + x + " Y: " + y);
        updateBoard(x, y, player);
        moves.push(x);
        var result = determineResult();
        if (result != -1) {
            console.log("Moves: " + moves);
            var info = document.cookie;
            
            if (result == 0) {
                document.cookie = info + "0" + moves + "/";
                alert("Draw")
                
            } else {
                document.cookie = info + String(player + 1) + moves + "/" ;
                alert("Player " + String(player + 1) + " Wins!");
            }
            document.getElementById("top").innerHTML = 
                "<td align=\"center\" colspan=\"7\">\
                <button id=\"resetButton\"onclick=\"newGame()\">New Game</button>\
                </td>";
            return;
        }
        player = (player + 1) % 2;
        setPlayerColor(colors[player]);
        if (board[HEIGHT - 1][x] != -1) {
            setColumnOpacity(x, "0");   
        }
    }
    canClick = true;
}

async function drawAnimation() {
    var delay = 125;
    for (var y = HEIGHT - 1; y >= 0; y--) {
        for (var x = 0; x < WIDTH; x++) {
            var canvas = document.getElementById(String(y)).children[x].children[0];
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = "#121213";
            ctx.fillRect(0, 0, 500, 500);
            if (board[y][x] != -1) {
                await new Promise(r => setTimeout(r, delay));
            }
            
        }
    }
    
}

function updateBoard(x, y, player) {
    board[y][x] = player;

    var canvas = document.getElementById(String(y)).children[x].children[0];
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = colors[player];
    ctx.fillRect(0, 0, 500, 500);
}

// -1 = Continue
//  0 = Player one wins
//  1 = Player two wins
function determineResult() {
    // Checks left-right
    for (var y = 0; y < HEIGHT; y++) {
        for (var x = 0; x < WIDTH - 3; x++) {
            var result = check(board[y][x], board[y][x + 1],
                board[y][x + 2], board[y][x + 3]);
            if (result != -1) {
                return 1;
            }
        }
    }

    // Checks up-down
    for (var y = 0; y < HEIGHT - 3; y++) {
        for (var x = 0; x < WIDTH; x++) {
            var result = check(board[y][x], board[y + 1][x],
                board[y + 2][x], board[y + 3][x]);
            if (result != -1) {
                return 1;
            }
        }
    }

    // Checks up-left-to-down-right
    for (var y = 0; y < HEIGHT - 3; y++) {
        for (var x = 0; x < WIDTH - 3; x++) {
            var result = check(board[y][x], board[y + 1][x + 1],
                               board[y + 2][x + 2], board[y + 3][x + 3]);
            if (result != -1) {
                return 1;
            }
        }
    }

    // checks down-left-to-down-right

    for (var y = HEIGHT - 1; y > 2; y--) {
        for (var x = 0; x < 4; x++) {
            var result = check(board[y][x], board[y - 1][x + 1],
                board[y - 2][x + 2], board[y - 3][x + 3]);
            if (result != -1) {
                console.log("x: " + x + " y: " + y);
                return 1;
            }
        }
    }

    if (moves.length == HEIGHT * WIDTH) 
        return 0;

    return -1;
}

function check(a, b, c, d) {
    return a != -1 && a == b && b == c && c == d ? a : -1;
}

function place(x) {
    insertIndex = -1;
    for (var y = 0; y < HEIGHT; y++) {
        if (board[y][x] == -1 && insertIndex == -1) {
            insertIndex = y;
        }
    }
    return insertIndex;
}

function setPlayerColor(color) {
    var hovers = document.querySelectorAll(".hoverspot");
    for (var i = 0; i < WIDTH; i++) {
        hovers[i].style.backgroundColor = color;
    }   
}

function getXIndex(gameButton) {
    row = gameButton.parentNode.parentNode;
    children = row.children;
    i = 0;
    while (i < 7 && children[i] != gameButton.parentNode) {
        i++;
    }
    return i;
}

function setColumnOpacity(index, value) {
    row = document.querySelectorAll(".hoverspot");
    row[index].style.opacity=value;
}

function onLoad() {
    console.log("Initalized");
    setPlayerColor(colors[0]);
    for (var y = 0; y < HEIGHT; y++) {
        for (var x = 0; x < WIDTH; x++) {
            board[y][x] = -1;
        }
    }

    squares = document.querySelectorAll(".gameButton");
    for (var i = 0; i < WIDTH * HEIGHT; i++) {
        square = squares[i];
        square.addEventListener("click", function() {
            var x = getXIndex(this);
            columnClicked(x);   
        });
        square.addEventListener("mouseover", function() {
            var x = getXIndex(this);
            if (board[HEIGHT - 1][x] == -1 && canClick) {
                setColumnOpacity(x, "1");
            } 
        });
        square.addEventListener("mouseout", function() {
            var x = getXIndex(this);
            setColumnOpacity(x, "0"); 
        });
    }
    canClick = true;
}

async function newGame() {
    await drawAnimation();
    location.href='game.html';
}


onLoad();

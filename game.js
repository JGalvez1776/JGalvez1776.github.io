var min = 1;
var max = 20;
var yellow = "#b59f3b";
var green = "#538d4e";
// Initial Color
var lightGrey = "#818384"; 
// Incorrect Color
var darkGrey = "#3a3a3c";

startMessage = "Click a number to begin";
winMessage = "You Win!";
lessMessage = "Too small";
greaterMessage = "Too big";

/*b59f3b Yellow*/
/*538d4e Green*/
var numberToGuess;
const numbers = [];
var gameOver = false;
var canClick = true;

function getRandomNumber() {    
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

function startGame() {
    numberToGuess = getRandomNumber();
    for (var i = min; i <= max; i++) {
        numbers[i] = false;
    }
}

function initializeUI() {
    for (var i = min; i <= max; i++) {
        button = document.getElementById(i);
        button.style.backgroundColor = lightGrey;
    }
}

async function buttonPressed(number) {
    if (gameOver || !canClick) {
        return;
    }
    canClick = false;

    if (number == numberToGuess) {
        setOutputText(winMessage);
        await recolorGroup((a, b)=>{return a == b}, number, green);
        await recolorGroup((a, b)=>{return a != b}, number, darkGrey);
        endGame();
    } else if (number < numberToGuess) {
        setOutputText(lessMessage)
        await recolorGroup((a, b)=>{return a > b}, number, yellow);
        await recolorGroup((a, b)=>{return a <= b}, number, darkGrey);
    } else {
        setOutputText(greaterMessage);
        await recolorGroup((a, b)=>{return a < b}, number, yellow);
        await recolorGroup((a, b)=>{return a >= b}, number, darkGrey);
    }
    canClick = true;

}

async function recolorGroup(isConditionMet, number, color) {
    for (var i = min; i <= max; i++) {
        button = document.getElementById(i);
        if (isConditionMet(i, number)) {
            if (numbers[i] != true) {
                await new Promise(r => setTimeout(r, 75));
                button.style.backgroundColor = color;
            }
            if (color == darkGrey) {
                numbers[i] = true;
            } 
        }
    }
}

function setOutputText(text) {
    document.getElementById("instruction").innerHTML = text;
}

function endGame() {
    gameOver = true;
    document.getElementById("resetGame").style.visibility = "visible";
}

async function reset() {
    startGame();
    gameOver = true;
    document.getElementById("resetGame").style.visibility = "hidden";
    await recolorGroup((a, b)=>{return true}, 1, lightGrey);
    setOutputText(startMessage);
    gameOver = false;

}

setOutputText(startMessage);
startGame();
initializeUI();

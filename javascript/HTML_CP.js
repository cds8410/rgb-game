var colors = [];
var squares = [];
var squareColumns = [];
var winningColor;
var gameBoard = document.querySelector(".game-board");
var container = document.querySelector(".game-spacing");
var messageboard = document.querySelector(".message-board");
var easyButton = document.querySelector(".easy-button");
var hardButton = document.querySelector(".hard-button");
var lightTheme = document.querySelector(".theme-light");
var mediumTheme = document.querySelector(".theme-medium");
var darkTheme = document.querySelector(".theme-dark");
var scorecard = document.querySelector(".scorecard");
var hardGameEnabled = false;
var score = 0;

//load the first game
reloadGame(6);

//difficulty switch functionality
easyButton.addEventListener("click", function () {
    hardGameEnabled = false;
    score = 0;
    postScore;
    reloadGame(6);
});

hardButton.addEventListener("click", function () {
    hardGameEnabled = true;
    score = 0;
    postScore;
    reloadGame(12);
});

//change color theme
lightTheme.addEventListener("change", changeTheme);
mediumTheme.addEventListener("change", changeTheme);
darkTheme.addEventListener("change", changeTheme);

//reset game with new colors and new winning color to find
function reloadGame(number) {

    //temporarily disable the game buttons
    easyButton.disabled = true;
    hardButton.disabled = true;

    //remove squares
    removeSquares();

    //remove colors
    removeColors();

    //resize the gameboard
    adjustGameboardSize(hardGameEnabled);

    //generate new random numbers
    for (var i = 0; i < number; i++) {
        //create list of rgb color strings ----- 6 for easy, 12 for hard
        colors.push("rgb(" + Math.floor(Math.random() * Math.floor(256)) + ", " + Math.floor(Math.random() *
            Math.floor(256)) + ", " + Math.floor(Math.random() * Math.floor(256)) + ")");

        //create a square object
        createSquare(i);

        //color in the squares
        squares[i].classList.remove("is-invisible");
        squares[i].style.backgroundColor = colors[i];
    }

    //choosing the winning color of the set and how many squares are in the games 
    winningColor = colors[Math.floor(Math.random() * Math.floor(number))];

    //generate click listeners
    generateSquareClickListeners();

    //print message
    messageboard.innerHTML = "Find: " + winningColor;

    //timeout to reenable the new game buttons
    buttonDisableTimeout(hardGameEnabled);

}

function postScore() {
    scorecard.innerHTML = "Score - <span class = \"highlight\">" + score + "</span>";
}

//adjust the size of the gameboard based on the diffiuclty of the game
function adjustGameboardSize(difficulty) {

    if (difficulty) {
        gameBoard.classList.add("is-hard-gameboard");
    } else {
        gameBoard.classList.remove("is-hard-gameboard");
    }

}

//create a square for the specified index
function createSquare(index) {

    //create the columns to house the squares
    squareColumns.push(document.createElement("div"));
    squareColumns[index].classList.add("col", "col--1-of-6", "col--m-1-of-2");

    //create the html elements
    squares.push(document.createElement("div"));
    squares[index].classList.add("square")

    //sizing boxes based on difficulty
    if (hardGameEnabled) {
        squares[index].classList.add("is-hard");
    }

    //add square to the game board over time
    delayTimer = 250 * index;
    setTimeout(function () {
        gameBoard.appendChild(squareColumns[index]);
        squareColumns[index].appendChild(squares[index]);
    }, delayTimer);

}

//change the color theme whenever the radio buttons change
function changeTheme() {
    //wipe all themes from the board
    container.classList.remove("is-theme-light", "is-theme-medium", "is-theme-dark");

    //apply theme based on the radio button
    if (lightTheme.checked) {
        container.classList.add("is-theme-light");
    }
    else if (mediumTheme.checked) {
        container.classList.add("is-theme-medium");
    }
    else {
        container.classList.add("is-theme-dark");
    }
}

//generate onclick logic for all the squares in each game
function generateSquareClickListeners() {

    for (var i = 0; i < squares.length; i++) {
        squares[i].addEventListener("click", function () {

            //allow squares to be clicked
            var clickEnabled = true;

            if (clickEnabled == true) {

                //victory conditions

                if (this.style.backgroundColor == winningColor) {

                    //disable reload buttons while new game automatically reloads
                    easyButton.disabled = true;
                    hardButton.disabled = true;

                    for (var i = 0; i < squares.length; i++) {
                        squares[i].classList.remove("is-invisible");
                        squares[i].style.backgroundColor = winningColor;
                    }
                    score = score + 1;

                    //update the scorecard
                    postScore;

                    //create the message that game is reseting
                    messageboard.innerHTML = "Congratulations! Game will reset in a few seconds...";

                    //reload a new game after a few seconds
                    setTimeout(function () {
                        easyButton.disabled = false;
                        hardButton.disabled = false;
                        if (hardGameEnabled == true) {
                            reloadGame(12);
                        } else {
                            reloadGame(6);
                        }
                    }, 3000);

                }

                //incorrect conditions
                else {
                    clickEnabled = false;
                    messageboard.innerHTML = "Nope! That's not right!";
                    this.classList.add("is-invisible");

                    //reset the score
                    score = 0;

                    //update the scorecard
                    postScore;

                    setTimeout(function () {
                        clickEnabled = true;
                        messageboard.innerHTML = "Find: " + winningColor;
                    }, 1000);
                }
            }
        });
    }
}

//remove all squares from the board and the array so new ones can come in
function removeSquares() {

    //remove all squares from color board
    for (var i = 0; i < colors.length; i++) {
        //remove square
        squareColumns[i].removeChild(squares[i]);
        //remove column container for said square
        gameBoard.removeChild(squareColumns[i]);
    }

    //pop all sqaures from the array
    while (squares.length > 0) {
        squares.pop();
    }

}

//remove all colors from the board so new ones can come in
function removeColors() {

    //pop all colors from the array
    while (colors.length > 0) {
        colors.pop();
    }

}

//reenable the new game buttons after a certain amount of time
function buttonDisableTimeout(difficulty) {

    //difficulty determines timeout length
    if (difficulty == false) {
        buttonTimeout = 2200;
    } else {
        buttonTimeout = 3900;
    }

    //timeout reenables the new game buttons
    setTimeout(function () {
        easyButton.disabled = false;
        hardButton.disabled = false;
    }, buttonTimeout);

}
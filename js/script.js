// var balrogPosition =[];
// var wizardPosition =[];
// var currentToken ='wizard';   
// var nextToken = 'balrog';
// var currentId;
// var balrogScore = 0;
// var wizardscore = 0;
// var win;



// The NodeSelector interface This specification adds two new methods to any objects implementing the Document, DocumentFragment, or Element interfaces:
// querySelector
// Returns the first matching Element node within the node's subtree. If no matching node is found, null is returned.
// querySelectorAll
// Returns a NodeList containing all matching Element nodes within the node's subtree, or an empty NodeList if no matches are found.

//Global Variables 

var board = document.querySelector('#board');
var boxes = Array.from(document.querySelectorAll('.box'));
var humanPlayerScore = document.querySelector('#p1Score');
var compBoiScore = document.querySelector('#p2Score');
var newGame = document.querySelector('#game-button');
var noMoves = document.querySelector('#no-moves');
var gameResults = document.querySelector('.game-results');
var gameResultsText = gameResults.querySelector('#game-results-text');
var restartButton = gameResults.querySelector('#restart');
var emptyBoxes = 60;
var gameOver = false;
var currentBoard = [];

const humanPlayer = {
    sprite: 'wizard',
    score: 2,
    validMoves: [],
    isPlayerTurn: false
};

const compBoi = {
    sprite: 'balrog',
    score: 2,
    validMoves: [],
    isPlayerTurn: false
};
//template literals/ template string are enclosed in back tics `

//`${expression}, ${expression}`
//no need to explicitly call the  toString()
//add any expression that produce a value
//you can bring in a fucntion that  produces a
//
function startNewGame() {
    noMoves.style.display = 'none';
    gameResults.classList.remove('game-results-active');
    gameOver = false;
    emptyBoxes = 60;
    
    newBoard = [];
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
            newBoard.push({id: `${i}, ${j}`, ownedBy: '', valid: false});
        }
    }
    currentBoard = newBoard;
    for (let k = 0; k < boxes.length; k++) {
        boxes[k].innerHTML = '';
        //   const addInitialTokens = function(row, col ,className) {
            //     console.log("calling addInit Token")
            //     placeToken(3, 3, 'balrog');
            //     placeToken(3, 4, 'wizard');
            //     placeToken(4, 3, 'wizard');
            //     placeToken(4, 4, 'balrog');
        }


        //
        currentBoard.find((node) => node.id == '4, 4').ownedBy = humanPlayer.sprite;
        currentBoard.find((node) => node.id == '5, 4').ownedBy = compBoi.sprite;
        currentBoard.find((node) => node.id == '4, 5').ownedBy = compBoi.sprite;
        currentBoard.find((node) => node.id == '5, 5').ownedBy = humanPlayer.sprite;
        //  TEXT CONTENT VS INNER HTML WHEN I USE TextContent IT DOENS"T WORK EVEN THOUGH ITS WHAT IM TOLD TO USE
        boxes.find((box) => box.id == '4, 4').innerHTML = `<div class="block"><div class="block-wizard"></div><div class="block-balrog back"></div></div>`;
        boxes.find((box) => box.id == '5, 4').innerHTML = `<div class="block"><div class="block-balrog"></div><div class="block-wizard back"></div></div>`;
        boxes.find((box) => box.id == '4, 5').innerHTML = `<div class="block"><div class="block-balrog"></div><div class="block-wizard back"></div></div>`;
        boxes.find((box) => box.id == '5, 5').innerHTML = `<div class="block"><div class="block-wizard"></div><div class="block-balrog back"></div></div>`;
        
        humanPlayer.score = 2;
        humanPlayer.validMoves = [];
        humanPlayer.isPlayerTurn = false;
        
        compBoi.score = 2;
        compBoi.validMoves = [];
        compBoi.isPlayerTurn = false;
        // when updating make sure that the time that Comp boi takes to move is the same as the time it takes to update the score 
        updateScore();
        if (Math.random() >= 0.5) {
            humanPlayer.isPlayerTurn = true;
            checkValid(humanPlayer, compBoi, currentBoard);
        } else {
            // An arrow function expression is a syntactically compact alternative to a regular function expression,
            //  although without its own bindings to the this, arguments, super, or new.target keywords. Arrow function 
            //  expressions are ill suited as methods, and they cannot be used as constructors.


            compBoi.isPlayerTurn = true;
            setTimeout(() => {
                calculateMove();
            }, 1000);
        }
    }
    startNewGame();

    function checkValid(player, otherPlayer, board) {
        if (board == currentBoard) {
            if (player === humanPlayer) {
                setTimeout(() => {
                    noMoves.style.display = 'none';
                }, 900);
            } else {
                noMoves.style.display = 'none';
            }
        }
        if (emptyBoxes === 0) {
            gameOver = true;
            endGame();
            return;
        }

        let valid = [];

        for (let i = 0; i < board.length; i++) {
            board[i].valid = false;
            boxes.find((box) => box.id === board[i].id).classList.remove('valid');
            if (board[i].ownedBy === '') {
                let lines = getLines(board[i].id);
                for (let j = 0; j < lines.length; j++) {
                    if (lines[j][0] && lines[j][0].ownedBy === otherPlayer.sprite) {
                        if (lines[j].find((node) => node.ownedBy === player.sprite)) {
                            board[i].valid = true;
                            valid.push(board[i]);
                                if (player == humanPlayer && board === currentBoard) {
                                    boxes.find((box) => box.id === board[i].id).classList.add('valid');
                            }
                        }
                    }
                }
            }
        }
        player.validMoves = valid;
        if (humanPlayer.validMoves.length === 0 && compBoi.validMoves.length === 0 && board == currentBoard) {
            gameOver = true;
            endGame();
            return;
        }
        if (player.validMoves.length > 0 && board === currentBoard) {
            return;
        }
        if (player === humanPlayer && humanPlayer.validMoves.length === 0 && board === currentBoard) {
            noMoves.firstElementChild.textContent = 'Player  has No moves ';
            noMoves.style.display = 'flex';
        } else if (player === compBoi && compBoi.validMoves.length === 0 && board === currentBoard) {
            noMoves.firstElementChild.textContent = 'Comp has no moves';
            noMoves.style.display = 'flex';
        }
        
        if (player == humanPlayer && humanPlayer.isPlayerTurn) {
            setTimeout(() => {
                calculateMove();
            }, 1000);
        }
    }
    //ask steve about strict equality and coercion
    function getTopLeft(x, y, board) {
        let startX = x-1;
        let startY = y-1;
        let nodes = [];
        
        while (startX > 0 && startY > 0) {
            let currentNode = board.find((node) => node.id == `${startX}, ${startY}`);
            if (currentNode.ownedBy == '') {
                break;
            }
            nodes.push(board.find((node) => node.id == `${startX}, ${startY}`));
            startX--;
            startY--;
        }
        return nodes;
    }
    //TO DO  MAKE FUNCTION  getTopLeft,getTop, getTopRight,getRight,getBottomRight,getBottom,getBottomLeft,getLeft


    //var col_list = ["A","B", "C", "D", "E", "F", "G" ,"H"];
// var array_list = [[],[],[],[],[],[],[],[]];



// const isValidCell = function(row, col) {
//   if(isValidLine(row, col, -1, -1) ||
//   isValidLine(row, col, -1, 0) ||
//   isValidLine(row, col, -1, 1) ||
//   isValidLine(row, col, 0, -1) ||
//   isValidLine(row, col, 0, 1) ||
//   isValidLine(row, col, 1, -1) ||
//   isValidLine(row, col, 1, 0) ||
//   isValidLine(row, col, 1, 1)) {
//  return true;

    function getTop(x, y, board) {
        let startY = y-1;
        let nodes = [];
        
        while (startY > 0) {
            let currentNode = board.find((node) => node.id == `${x}, ${startY}`)
            if (currentNode.ownedBy == '') {
                break;
            }
            nodes.push(board.find((node) => node.id == `${x}, ${startY}`));
            startY--;
        }
        return nodes;
    }
    function getTopRight(x, y, board) {
        let startX = x+1
        let startY = y-1;
        let nodes = [];
        
        while (startX <= 8 && startY > 0) {
            let currentNode = board.find((node) => node.id == `${startX}, ${startY}`);
            if (currentNode.ownedBy == '') {
                break;
            }
            nodes.push(board.find((node) => node.id == `${startX}, ${startY}`));
            startX++;
            startY--;
        }
        return nodes;
    }
    function getRight(x, y, board) {
        let startX = x+1;
        let nodes = [];
        
        while (startX <= 8) {
            let currentNode = board.find((node) => node.id == `${startX}, ${y}`);
            if (currentNode.ownedBy == '') {
                break;
            }
            nodes.push(board.find((node) => node.id == `${startX}, ${y}`));
            startX++;
        }
        return nodes;
    }
    function getBottomRight(x, y, board) {
        let startX = x+1;
        let startY = y+1
        let nodes = [];
        
        while (startX <= 8 && startY <= 8 && board.find((node) => node.id == `${startX}, ${startY}`).ownedBy !== '') {
            let currentNode = board.find((node) => node.id == `${startX}, ${startY}`);
            nodes.push(board.find((node) => node.id == `${startX}, ${startY}`));
            startX++;
            startY++;
        }
        return nodes;
    }
    function getBottom(x, y, board) {
        let startY = y+1;
        let nodes = [];
        
        while (startY <= 8) {
            let currentNode = board.find((node) => node.id == `${x}, ${startY}`);
            if (currentNode.ownedBy == '') {
                break;
            }
            nodes.push(board.find((node) => node.id == `${x}, ${startY}`));
            startY++;
        }
        return nodes;
    }
    function getBottomLeft(x, y, board) {
        let startX = x-1;
        let startY = y+1;
        let nodes = [];
        
        while (startX > 0 && startY <= 8) {
            let currentNode = board.find((node) => node.id == `${startX}, ${startY}`);
            if (currentNode.ownedBy == '') {
                break;
            }
            nodes.push(board.find((node) => node.id == `${startX}, ${startY}`));
            startX--;
            startY++;
        }
        return nodes;
    }

    function getLeft(x, y, board) {
        let startX = x-1;
        let nodes = [];
        
        while (startX > 0) {
            let currentNode = board.find((node) => node.id == `${startX}, ${y}`);
            if (currentNode.ownedBy == '') {
                break;
            }
            nodes.push(board.find((node) => node.id == `${startX}, ${y}`));
            startX--;
        }
        return nodes;
    }
    
    function getLines(id, board = currentBoard) {
        let xCoord = parseInt(id.split(',')[0]);
        let yCoord = parseInt(id.split(',')[1]);
        
        let topLeft = getTopLeft(xCoord, yCoord, board);
        let top = getTop(xCoord, yCoord, board);
        let topRight = getTopRight(xCoord, yCoord, board);
        let right = getRight(xCoord, yCoord, board);
        let bottomRight = getBottomRight(xCoord, yCoord, board);
        let bottom = getBottom(xCoord, yCoord, board);
        let bottomLeft = getBottomLeft(xCoord, yCoord, board);
        let left = getLeft(xCoord, yCoord, board);
        
        return [topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, left];
    }
    
    
    function copyBoard() {
        let copy = [];
        for (let i = 0; i < currentBoard.length; i++) {
            copy.push(JSON.parse(JSON.stringify(currentBoard[i])));
        }
        return copy;
    }
    
    
    function getResultsOfMove(lines, player, otherPlayer) {
        
        let score = 0;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i][0] && lines[i].find((node) => node.ownedBy == player.sprite)) {
                for (let j = 0; j < lines[i].length; j++) {
                    if (lines[i][j].ownedBy == otherPlayer.sprite) {
                        score++;
                    }
                }
            }
        }
        return score;
    }
    
    
    function calculateMove() {
        if (emptyBoxes === 0) {
            gameOver = true;
            endGame();
            return;
        }
        humanPlayer.isPlayerTurn = false;
        compBoi.isPlayerTurn = true;
        
        //Make CompBoi
        checkValid(compBoi, humanPlayer, currentBoard);
        if (compBoi.validMoves.length > 0) {
            if (compBoi.validMoves.length === 1) {
                placePiece(compBoi.validMoves[0].id, compBoi, humanPlayer, getLines(compBoi.validMoves[0].id));
            } else { 
                // ----  COOMP BOI has more than one possible move ----
                //
                let possibleScores = [];
                for (let i = 0; i < compBoi.validMoves.length; i++) { // loop over computer's possible moves
                let currentValid = compBoi.validMoves[i];
                let testBoard = copyBoard();
                testBoard.find((node) => node.id == currentValid.id).ownedBy = compBoi.sprite;
                let validLines = getLines(currentValid.id, testBoard);
                let computerScore = getResultsOfMove(validLines, compBoi, humanPlayer);
                
                let highestPlayerScore = 0;
                checkValid(humanPlayer, compBoi, testBoard); 
                // get human player's possible moves given each computer move
                if (humanPlayer.validMoves.length > 0) {
        for (let l = 0; l < humanPlayer.validMoves.length; l++) {
            let currentPlayerLines = getLines(humanPlayer.validMoves[l].id, testBoard);
            let currentPlayerScore = getResultsOfMove(currentPlayerLines, humanPlayer, compBoi);
            if (currentPlayerScore > highestPlayerScore) {
                highestPlayerScore = currentPlayerScore; 
                // identify the best possible move for the human player on their next turn given each computer move
            }
        }
    }
    possibleScores.push({id: currentValid, score: (computerScore - highestPlayerScore)}); // calculate overall strength of each computer move
}
let highestPiece = possibleScores[0];
for (let scoreI = 0; scoreI < possibleScores.length; scoreI++) {
    if (possibleScores[scoreI].score > highestPiece.score) {
        highestPiece = possibleScores[scoreI]; // identify the highest scoring move for the computer player
    }
}
let bestMoves = [];
for (let o = 0; o < possibleScores.length; o++) {
    if (possibleScores[o].score == highestPiece.score) {
        bestMoves.push(possibleScores[o]); // in the event of several equally strong moves, add them all to bestMoves
    }
    // on click box
    // function resetGrid() {
        //   balrogPosition = [];
        //   wizardPosition = [];
        //   gameBoardEl.textContent = "";
        //   messageEl.textContent = "";
        //   console.log(gameBoardEl);
        //   for (var i = 0; i<9; i++) {
            // console.log(i);
            //   let subdiv = document.createElement('div');
            //   subdiv.className = 'box';
    //     subdiv.id = i.toString();
    //   console.log(subdiv);
    //     gameBoardEl.appendChild(subdiv);
    //   console.log(gameBoardEl)
}
let chosenPiece = bestMoves[Math.floor(Math.random()*bestMoves.length)]; // select random move from bestMoves
placePiece(chosenPiece.id.id, compBoi, humanPlayer, getLines(chosenPiece.id.id));
}
}
humanPlayer.isPlayerTurn = true;
compBoi.isPlayerTurn = false;
checkValid(humanPlayer, compBoi, currentBoard);
}


function flipPiece(id, player, otherPlayer, board) {
    let nodeToFlip = board.find((node) => node.id == id);
    let box = boxes.find((box) => box.id == id);
    nodeToFlip.ownedBy = player.sprite;
    if (board == currentBoard) {
        box.firstElementChild.classList.toggle('flip');
}
}


function placePiece(id, player, otherPlayer, lines) {
    player.isPlayerTurn = false;
    otherPlayer.isPlayerTurn = true;
    let boardTarget = currentBoard.find((obj) => obj.id == id);
    let newBlock = `
        <div class="block">
        <div class="block-${player.sprite}"></div>
        <div class="block-${otherPlayer.sprite} back"></div>
        </div>
    `;

let targetBox = boxes.find((obj) => obj.id == id);
targetBox.innerHTML = newBlock;
targetBox.classList.remove('valid');

boardTarget.ownedBy = player.sprite;
player.score++;
boardTarget.valid = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].find((node) => node.ownedBy == player.sprite)) {
        for (let j = 0; j < lines[i].length; j++) {
            if (lines[i][j].ownedBy == otherPlayer.sprite) {
                flipPiece(lines[i][j].id, player, otherPlayer, currentBoard);
                player.score++;
                otherPlayer.score--;
            } else if (lines[i][j].ownedBy == player.sprite) {
                break;
            }
    }
    }
}
emptyBoxes-= 1;
updateScore();
}


function updateScore() {
    humanPlayerScore.textContent = humanPlayer.score;
    compBoiScore.textContent = compBoi.score;
}

// if the  human player has more score than comp  show text content and play victory sound
function endGame() {
    gameResults.classList.add('game-results-active');
    if (humanPlayer.score > compBoi.score) {
        gameResultsText.textContent = 'Middle Earth Has Been saved !';
        document.getElementById("win").play();
        //if compboi has a higher score than  human player   say balrogs have won and play loss sound
} 
    else if (compBoi.score > humanPlayer.score) {
    gameResultsText.textContent = 'Balrogs have won! ';
    document.getElementById('lose').play();
    console.log(document.getElementById('lose'));

} else {
    gameResultsText.textContent = 'Draw!';
}
}


board.addEventListener('click', (e) => {
    if (e.target.classList.contains('box') && currentBoard.find((node) => node.id == e.target.id).ownedBy == '' && currentBoard.find((node) => node.id == e.target.id).valid) {
        if (humanPlayer.isPlayerTurn) {
            placePiece(e.target.id, humanPlayer, compBoi, getLines(e.target.id));
                setTimeout(() => {
                    calculateMove();
    }, 1000);
    }
}
});
newGame.addEventListener('click', startNewGame);

restartButton.addEventListener('click', startNewGame); 
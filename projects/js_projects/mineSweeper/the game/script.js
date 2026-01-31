const gameBoard = document.querySelector(".game-board"); 

let gameMap = [];
let gameStart = false 
let lineLen = 9;
let amountOfMine = 15;
createBorad();

function createBorad(){
  let totalCells = lineLen ** 2;
  gameBoard.style.gridTemplateColumns = `repeat(${lineLen}, 1fr)`;
  gameBoard.style.gridTemplateRows = `repeat(${lineLen}, 1fr)`;

  for(let i = 0; i < totalCells; i++){
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.id = i;
    
    cell.addEventListener("click", ev =>{showVAl(ev, i)});

    gameBoard.appendChild(cell);
    fillGameMap(i);
  }
}

function fillGameMap(i){
  const cube = {
    isBomb: false,
    val: 0,
  }
  gameMap.push(cube);
}

function showVAl(ev, i){
  const cell = ev.target;

  if(!gameStart){
    cell.classList.add("revealed");
    generateMines(i)
    gameStart = true;
    cell.innerText = gameMap[i].val;
  }else if(!cell.classList.contains("revealed")){
    cell.classList.add("revealed");
    let show = (gameMap[i].isBomb) ? "❌" : gameMap[i].val;
    cell.innerText = show;
  }
}

function generateMines(i){
  let mapOfMine = [];

  for(let m = 0; m < amountOfMine; m++){
    let randSquare = Math.floor(Math.random() * (lineLen ** 2));

    while(gameMap[randSquare] === gameMap[i] || mapOfMine.includes(randSquare)){
      randSquare = Math.floor(Math.random() * (lineLen ** 2));
    }
    
    gameMap[randSquare].isBomb = true;
    mapOfMine.push(randSquare);
  }
  console.log(mapOfMine);
  
  findVal()
}

function findVal(){
  for(let cubeNum = 0; cubeNum < gameMap.length; cubeNum++){
    const isLeftEdge = cubeNum % lineLen === 0;
    const isRightEdge = cubeNum % lineLen === lineLen - 1;
  
    const right = 1;
    const left = -1;
    const lastLine = -lineLen;

    let allSides = [right, left,
      lineLen, lastLine,
      lineLen + 1, lineLen - 1,
      lastLine + 1, lastLine - 1
    ]

    for(let side of allSides){
      const neighbor = cubeNum + side;

      if(neighbor < 0 || neighbor >= lineLen ** 2) continue;
      //אם בפינה הימנית וזז ימינה או באלכסון ימינה 
      if(isRightEdge && (side === right || side === lineLen + right || side === lastLine + right))continue;
      
      //אם בפינה השמאלית או וזז שמאלה או באלכסון שמאל 
      if(isLeftEdge && (side === left || side === left + lineLen || side === lastLine + left))continue;

      if(gameMap[neighbor].isBomb) {
        gameMap[cubeNum].val += 1;
      }
    }
  }
}
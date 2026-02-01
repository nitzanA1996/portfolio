const gameBoard = document.querySelector(".game-board"); 

let gameMap = [];
let gameStart = false;
let didLost = false;
let isOver = false; 

let lineLen = 12;
let coloumnLen = 12;
let amountOfMine = 25;
let mineLeft = amountOfMine;

let isFlagMode = false;

createBorad();

function createBorad(){
  let totalCells = lineLen * coloumnLen;
  gameBoard.style.gridTemplateColumns = `repeat(${lineLen}, minmax(35px, 1fr)`;
  gameBoard.style.gridTemplateRows = `repeat(${lineLen}, minmax(35px, 1fr)`;

  for(let i = 0; i < totalCells; i++){
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.id = i;
    
    cell.addEventListener("click", ev =>{showVAl(ev, i)});
    
    cell.addEventListener("contextmenu", ev =>{
      ev.preventDefault();
      flag(ev, i);
    });

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
  let cubeOutput = "";
  
  if(!gameStart){
    generateMines(i)
    gameStart = true;

    if (gameMap[i].val === 0) {
      zeroChain(i);
    }else{
      cell.innerHTML = gameMap[i].val;
      cell.classList.add("revealed");
    }
  }else if(!cell.classList.contains("revealed") && isOver === false){
    cell.classList.add("revealed");
    if(gameMap[i].isBomb) {
      cell.innerHTML = "❌";
      setTimeout(() => loseOrWin(false), 100); 
    }else if(!gameMap[i].val){
      zeroChain(i);
    }else{
      cubeOutput = gameMap[i].val;
      cell.innerHTML = cubeOutput;
    }
    
  }
  checkForWin();
}

function generateMines(i){
  let mapOfMine = [];

  for(let m = 0; m < amountOfMine; m++){
    let randSquare = Math.floor(Math.random() * (lineLen * coloumnLen));

    while(gameMap[randSquare] === gameMap[i] || mapOfMine.includes(randSquare)){
      randSquare = Math.floor(Math.random() * (lineLen * coloumnLen));
    }
    
    gameMap[randSquare].isBomb = true;
    mapOfMine.push(randSquare);
  }
  console.log(mapOfMine);
  
  findVal()
}

function findVal() {
  for (let i = 0; i < gameMap.length; i++) {
    if (gameMap[i].isBomb) continue;

    const neighbors = getNeighbors(i);
    let minesCount = 0;

    for (let neighborIndex of neighbors) {
      if (gameMap[neighborIndex].isBomb) {
        minesCount++;
      }
    }
    
    gameMap[i].val = minesCount;
  }
}

function getNeighbors(index) {
  const neighbors = [];
  const isLeftEdge = index % lineLen === 0;
  const isRightEdge = index % lineLen === lineLen - 1;
  const totalCells = lineLen * coloumnLen;

  // כל הכיוונים האפשריים (ימינה, שמאלה, למעלה, למטה ואלכסונים)
  const sides = [
    -1, 1,                      // שמאל, ימין
    -lineLen, lineLen,          // למעלה, למטה
    -lineLen - 1, -lineLen + 1, // אלכסונים למעלה
    lineLen - 1, lineLen + 1    // אלכסונים למטה
  ];

  for (let side of sides) {
    const neighborIndex = index + side;
    
    if (neighborIndex < 0 || neighborIndex >= totalCells) continue;

    // בודקת שהשכן לא מחוץ לגבולות בפינות
    if (isRightEdge && (side === 1 || side === -lineLen + 1 || side === lineLen + 1)) continue;
    if (isLeftEdge && (side === -1 || side === -lineLen - 1 || side === lineLen - 1)) continue;

    neighbors.push(neighborIndex);
  }

  return neighbors;
}

function loseOrWin(res){
  let message = document.querySelector(".message");
  let messageHead = document.querySelector(".message h2"); 
  requestAnimationFrame(() => message.classList.add("show"));
  const decision = (res) ? "winner 🏆" : "Loooser!"
  messageHead.innerText = decision;
  isOver = true;
  if(!res){
    gameMap.forEach((cube, i) => {
    if(cube.isBomb) {
      let cell = document.getElementById(i);
      cell.innerHTML = "❌"
    }
  });
  }
  // message2.innerHTML= "loser";
}

function checkForWin(){
  for (let cellNum = 0; cellNum < gameMap.length; cellNum++) {
    const cell = gameMap[cellNum];
    let box = document.getElementById(cellNum)
    if (!gameMap[cellNum].isBomb && !box.classList.contains("revealed")) {
      return
    }
  }
  loseOrWin(true);
}

function zeroChain(i){
  let neighbors = getNeighbors(i);
  let workLeft = []
  
  let cell = document.getElementById(i);
  cell.classList.add("revealed");
  let show = gameMap[i].val || "";
  cell.innerHTML = show;

  for(let s = 0; s < neighbors.length; s++){
    let sideindex = neighbors[s];
    let neighborCell = document.getElementById(sideindex);
    if(gameMap[sideindex].isBomb || neighborCell.classList.contains("revealed")){
      continue;
    }else{
      neighborCell.classList.add("revealed");
      neighborCell.innerHTML = gameMap[sideindex].val || "";
    }
    if(gameMap[sideindex].val === 0){
      zeroChain(sideindex);
    }
  }
}

function flag(ev){
  let cell = ev.target;
  if(!cell.classList.contains("revealed")) {
    cell.classList.toggle("flagged");
    mineLeft += cell.classList.contains("flagged") ? -1 : +1;
  }
}

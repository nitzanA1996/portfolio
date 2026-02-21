import{gameMap, rows, columns, placeWords} from './script.js';

const gameBoard = document.querySelector(".game-board");
let wordBeginnig;

let isEnd = false;

gameBoard.addEventListener("click", function(event){
  if(event.target.classList.contains("cell")){
    const cell = event.target;
    const cellId =cell.dataset.id;
    const cube = gameMap[cellId];
    event.target.classList.add("pressed");
    if(!isEnd){
      wordBeginnig = cube;
      isEnd = true;
    }else {
      checkWord(wordBeginnig, cube);
      isEnd = false;
    }
  }
});

function checkWord(wordBeginnig, wordEnd){
  let currentCubeIndex = wordBeginnig.id;
  let cubeIndexes = [currentCubeIndex];
  let stepInDirection;
  let wordSigned = "";
  if(wordBeginnig.col === wordEnd.col){
    stepInDirection = 1;//vertical
  }else if(wordBeginnig.row === wordEnd.row){
    stepInDirection = rows; //horizontal
  }else {
    stepInDirection = rows + 1;//diagonal
  }

  while(currentCubeIndex <= wordEnd.id){
    wordSigned += gameMap[currentCubeIndex].letter;
    currentCubeIndex += stepInDirection;
    cubeIndexes.push(currentCubeIndex);
  }
  const successful = placeWords.includes(wordSigned)? true : false;
  console.log(successful);
  cubeIndexes.forEach(index => {
    if(successful){
    
    }else{

    }
  })
  
}
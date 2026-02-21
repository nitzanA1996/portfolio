import{gameMap, rows, columns, placeWords} from './script.js';

const gameBoard = document.querySelector(".game-board");

let wordLeft = placeWords;
let wordBeginnig;

let isEnd = false;

gameBoard.addEventListener("click", function(event){
  if(event.target.classList.contains("cell")){
    const cell = event.target;
    const cellId =cell.dataset.id;
    const cube = gameMap[cellId];
    event.target.classList.add("selected");
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
  const isDown = (wordBeginnig.id - wordEnd.id) > 0 ? -1 : 1;
  if(wordBeginnig.col === wordEnd.col){
    stepInDirection = columns * isDown;//vertical
  }else if(wordBeginnig.row === wordEnd.row){
    stepInDirection = 1 * isDown; //horizontal
  }else if(wordBeginnig.id < wordEnd.id){
    stepInDirection = rows + 1;//diagonal
  }else if(wordBeginnig.id > wordEnd.id){
    stepInDirection = -rows + 1;//diagonal
  };
  console.log(Math.abs(wordBeginnig.id - wordEnd.id));
  console.log("Step is:", stepInDirection);
  
  for(let z = 0;z <= Math.abs((wordBeginnig.id - wordEnd.id)/ stepInDirection) ; z++){
    wordSigned += gameMap[currentCubeIndex].letter;
    cubeIndexes.push(currentCubeIndex);
    currentCubeIndex += stepInDirection;
    console.log("Current index:", currentCubeIndex);
    console.log(wordSigned);
    
  }
  const word = wordSigned;
  const wordReverse = wordSigned.split('').reverse().join('');
  const successful = placeWords.includes(word) || placeWords.includes(wordReverse);
  console.log(successful);
  
  if(successful){
    cubeIndexes.forEach(index => {
      gameMap[index].element.classList.add("found");
    })
    eraseFromList(word, wordReverse)
  }else{
    gameMap[wordBeginnig.id].element.classList.remove("selected");
    gameMap[wordEnd.id].element.classList.remove("selected");
  }
}

function eraseFromList(word){
  wordLeft = placeWords.filter(w => w != word || w != wordReverse);
  console.log(word);
  console.log(wordLeft);
  if(wordLeft = []) wining();
}

function wining(){
  console.log('win!');
  
}
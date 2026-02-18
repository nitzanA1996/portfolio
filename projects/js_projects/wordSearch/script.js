/** @type {HTMLElement | null} */
const gameBoard = document.querySelector(".game-board"); 
const form = document.querySelector("form");
const list = document.querySelector(".words-list");
const gameDialog = document.getElementById("game-dialog");

const addWordBtn = document.querySelector('#add-word');
const inputWord = document.querySelector('#user-word');



let gameMap = [];
let rows = 0;
let columns = 0;

/* event */
// send word with btn
addWordBtn.addEventListener("click", appendWordList);
// send word with Enter
inputWord.addEventListener("keydown", function(ev){
  if (ev.key === 'Enter') {
    ev.preventDefault();
    appendWordList()
  }
})

const alphabet = [
  "A","B","C","D","E","F","G",
  "H","I","J","K","L","M",
  "N","O","P","Q","R","S",
  "T","U","V","W","X","Y","Z"
];

// send the form
form.addEventListener("submit", function(event){
  event.preventDefault();
  gameBoard.innerHTML = "";
  gameMap = [];
  createBoard();
});

/* functions */

// adds new words in the list
function appendWordList(){

  const newWord = inputWord.value;
  if(newWord){
    let newLI =  document.createElement("li");
    newLI.innerText = newWord.trim();
    list.appendChild(newLI);
    // add a hidden input so it can get name prop and be submittable
    let hiddenInput = document.createElement('input');
    hiddenInput.type = "hidden";
    hiddenInput.name = "word";
    hiddenInput.value = newWord.replaceAll(' ', '');
    form.appendChild(hiddenInput)

    inputWord.value = "";
    
  }
}

function createBoard(){
  const formData = new FormData(form);
  rows = Number(formData.get("rows"));
  columns = Number(formData.get("columns"));
  let listOfwords = formData.getAll("word");

  const totalCell = columns * rows;
  gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

  for(let i = 0; i < totalCell; i++) {
    const cell = document.createElement("div");
    cell.classList.add('cell');
    gameBoard.appendChild(cell);

    const cube = {
      id: i,
      row: Math.floor(i / columns),
      col: (i % columns),
      letter: "",
      taken: false,
      element: cell
    } 

    gameMap.push(cube);
    cell.innerText = cube.letter;
  }
  fitWords(listOfwords);
  fillRandLetter();
  gameDialog.showModal()
}

function fillRandLetter(){
  gameMap.forEach(cube => {
    if(!cube.taken){
      const rand = Math.floor(Math.random() * alphabet.length);
      cube.letter = alphabet[rand];
      cube.element.innerText = cube.letter
    }
  })
}

function isFit(word, cube, direct) {
  const initalcol = cube.col;
  const initalrow = cube.row;
  
  const endrow = initalrow + (word.length -1) * direct.dy;
  const endcol = initalcol + (word.length -1) * direct.dx;


  if(endrow >= 0 && endrow < rows && endcol >= 0 && endcol < columns){
    for(let k = 0; k< word.length; k++){
      const currentRow = initalrow + (k * direct.dy);
      const currentcol = initalcol + (k * direct.dx);
      
      const currentIndex = currentRow * columns + currentcol; 

      if (gameMap[currentIndex].taken && gameMap[currentIndex].letter != word[k]) {
        return false;
      }
    }
    return true
  }
  else {
  return false;
  }
}

function fitWords(listOfwords){
  const directions = [
  {
    name: "horizontal",
    dx: 1,
    dy: 0
  },
  {
    name: "vertical",
    dx: 0,
    dy: 1
  },
  {
    name: "diagonalUp",
    dx: 1,
    dy: 1
  },
  {
    name: "diagonalDown",
    dx: 1,
    dy: -1
  }
  ]  
  const sortedByLen = listOfwords.sort((a, b) => a.length - b.length);
  const notIncluded = [];
  
  while(sortedByLen.length > 0){
    let iterateConter = 0;
    let succeeded = false;
    const word = sortedByLen.pop();
    console.log(word);
    

    while(iterateConter < 500 && succeeded === false){
      // check that word is not too long
      if (word.length > rows && word.length > columns){
        notIncluded.push(word);
        break
      }
      // check that randcube is not to far to fit
      let randCube = Math.floor(Math.random() * gameMap.length);
      // do{
        // randCube = Math.floor(Math.random() * gameMap.length);
      // }while(word.length > rows - gameMap[randCube].row || word.length > columns - gameMap[randCube].col);

      const randDirect = Math.floor(Math.random() * directions.length);
      const direct = directions[randDirect];
      console.log(randCube, direct.name);
      
      succeeded = isFit(word, gameMap[randCube], direct);
      if(succeeded) printWord(word, gameMap[randCube], direct);
      iterateConter++
    }
  }
}

function printWord(word, cube, direct){
  const endrow = cube.row + (word.length -1) * direct.dy;
  const endcol = cube.col + (word.length -1) * direct.dx;
  

  if(endrow >= 0 && endrow < rows && endcol >= 0 && endcol < columns){
    for(let k = 0; k< word.length; k++){
      const currentRow = cube.row + (k * direct.dy);
      const currentcol = cube.col + (k * direct.dx);
      const currentIndex = currentRow * columns + currentcol;
      
      const newCube = gameMap[currentIndex];
      newCube.letter = word[k];
      newCube.taken = true;
      console.log(word[k]);
      

      newCube.element.innerText = newCube.letter;  
    }
  }
}

/** @type {HTMLElement | null} */
const gameBoard = document.querySelector(".game-board"); 
const form = document.querySelector("form");
const list = document.querySelector(".words-list");

const gameDialog = document.getElementById("game-dialog");
const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('columns');
const gameWordsList = document.getElementById('game-words-list');

const selcectSizeWarning = document.getElementById('warning_Select_size');
const errorMessageWord = document.querySelector('.error-unvalid-word');

let currentLang = "en";
let placeWords = [];
const randHebFlowers= [
"כלנית", "רקפת", "איריס", "נרקיס", "חרצית", 
"סביון", "צבעוני", "ורד", "יסמין", "חמניה", 
"לוטם", "נורית", "פרג", "חצב", "סתוונית", 
"כרכום", "מרגנית", "עירית", "דם המכבים", "תורמוס", 
"גרניום", "פטוניה", "בוגנוויליה", "היביסקוס", "הרדוף", 
"ציפורן", "ליליה", "שושן צחור", "סיגלית", "אמנון ותמר"
];
const LANG_CONFIG = {
  en: {
    dir: "ltr",
    alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    validRegex: /^[a-zA-Z ]+$/,
    randomWords: ["ROSE", "LILY", "TULIP", "DAISY", "ORCHID"],
    ui: {
      title: "Word Hunt generator",
      subtitle: "generate your own Word Hunt game",
      tableSize: "table size",
      rowsPlaceholder: "number of rows",
      colsPlaceholder: "number of columns",
      hiddenWordsTitle: "hidden words",
      hiddenWordsSemiTitle: "choose your own words or generate random ones",
      addWordBtn: "add word",
      randomLabel: "add a random flower name",
      randomBtn: "press",
      createTableBtn: "create table",
      warningSize: "*Select a board size before proceeding.",
      wordsTitle: "Words to find:",
      invalidWord: "*invalid input: use English letters only",
      victoryTitle: "🎉 congrats! 🎉",
      victoryText: "you found all expressions!",
      playAgain: "play again",
      toggleBtn: "עברית / Hebrew"
    }
  },
  he: {
    dir: "rtl",
    alphabet: ["א","ב","ג","ד","ה","ו","ז","ח","ט","י","כ","ל","מ","נ","ס","ע","פ","צ","ק","ר","ש","ת"],
    validRegex: /^[א-ת ךםןףץ'-]+$/,
    ui: {
      title: "מחולל התפזורות",
      subtitle: "צרי תפזורת משלך",
      tableSize: "גודל הלוח",
      rowsPlaceholder: "מספר שורות",
      colsPlaceholder: "מספר עמודות",
      hiddenWordsTitle: "מילים נסתרות",
      hiddenWordsSemiTitle: "בחרי מילים משלך או מילים אקראיות",
      addWordBtn: "הוספי מילה",
      randomLabel: "הוספי שם פרח או צמח אקראי",
      randomBtn: "לחצי כאן",
      createTableBtn: "צרי לוח",
      warningSize: "*אנא בחרי גודל לוח לפני ההמשך.",
      wordsTitle: "מילים לחיפוש:",
      invalidWord: "*קלט לא תקין: השתמשי באותיות עבריות בלבד",
      victoryTitle: "🎉 כל הכבוד! 🎉",
      victoryText: "מצאת את כל המילים!",
      playAgain: "שחקי שוב",
      toggleBtn: "English / אנגלית"
    }
  }
};

const alphabet = [
  "A","B","C","D","E","F","G",
  "H","I","J","K","L","M",
  "N","O","P","Q","R","S",
  "T","U","V","W","X","Y","Z"
];

const langToggleBtn = document.getElementById("lang-toggle");
const addWordBtn = document.querySelector('#add-word');
const inputWord = document.querySelector('#user-word');
const wordError = document.getElementById('word-error');
const randomBtn = document.getElementById("Random-word");

let gameMap = [];
let rows = 0;
let columns = 0;

/* events */
// toggle language
langToggleBtn.addEventListener("click", () => {
  const nextLang = currentLang === "en" ? "he" : "en";
  applyLanguage(nextLang);
});
// send word with btn
addWordBtn.addEventListener("click", appendWordList);
// send word with Enter
inputWord.addEventListener("keydown", function(ev){
  if (ev.key === 'Enter') {
    ev.preventDefault();
    appendWordList()
  }
})
// checkes if valid
inputWord.addEventListener('input', function() {
  const text = inputWord.value;
  const isValid = getCurrentRegex().test(text)
  if(text ===""){
    wordError.style.display = "none";
    addWordBtn.disabled = true;
    return;
  }else if(isValid){
    wordError.style.display = "none";
    addWordBtn.disabled = false;
  }else {
    wordError.style.display = "block";
    addWordBtn.disabled = true;
  }
})
// add random words
randomBtn.addEventListener("click", async function() {
  const originalText = randomBtn.innerText;
  randomBtn.innerText = "..searching";
  randomBtn.disabled = true;
  
  try {
    const rowsInput = document.getElementById('rows').value;
    const colsInput = document.getElementById('columns').value;
    // checks the max len of legal words 
    const maxSize = (rowsInput && colsInput) ? Math.max(rowsInput, colsInput) : 15;

    // go to resource wich is a list of flower names
    const response = await fetch('https://raw.githubusercontent.com/dariusk/corpora/master/data/plants/flowers.json');
    const data = await response.json();

    /* filter data from word that are to long or term with spaces */
    if (data.flowers && data.flowers.length > 0) {
      const cleanData = data.flowers.filter(word => {
        const isClean = !word.includes(' ') && !word.includes('-');
        const isShortEnough = word.length <= maxSize;
        return isClean && isShortEnough;
      })
    // pick random word from the clean data that is allready in the list.
      if (cleanData.length > 0) {
        // gather the existing list of word
        const existingWords = Array.from(list.querySelectorAll('li')).map(li => li.innerText.toUpperCase());
        
        let attempts = 0;
        let randomWord = "";
        // try 50 times
        while(attempts < 50){
          const randomIndex = Math.floor(Math.random() * cleanData.length);
          const candidate = cleanData[randomIndex];

          // only if flower isnt allready in the list
          if(!existingWords.includes(candidate.toUpperCase())){
            randomWord = candidate;
            break; //found new word
          }else {
            attempts++; // didnt find - try again
          }
        }

        if(randomWord){
          addWordToGame(randomWord);
        }else alert("seems like you allready add all of the flowers that fits this table sizes");
        console.log(`Added: ${randomWord} (Length: ${randomWord.length}, Max: ${maxSize})`);      

      }else{ // if theres no clean data
      alert(`did not find flowers thats fits table max size (${maxSize}) 🤷🏾‍♀️`);
      }
    }else alert('cant find data🤷🏾‍♀️'); // if didnt fetch any data 
  
  }catch(error){
    console.error(error, ":error")
    alert('theres problem with the server😭')
  }finally {
    randomBtn.innerText = originalText;
    randomBtn.disabled = false;
  }
});

// send the form
form.addEventListener("submit", function(event){
  event.preventDefault();
  gameBoard.innerHTML = "";
  gameMap = [];
  createBoard();
});

// checks that the filed was filled
rowsInput.addEventListener('input', checkSizeToEnable);
colsInput.addEventListener('input', checkSizeToEnable);
/* functions */

// adds new words in the list
function appendWordList(){
  const newWord = inputWord.value;
  if(newWord){
    addWordToGame(newWord);
    inputWord.value = "";
    
  }
}
function addWordToGame(word){
  if (!word) return;
  
  const normalizedWord = normalizeWord(word);
  /* --! checkes if the words entered isnt to long for the board !-- */  
  // checkes the sizes directlety from the form fields
  const inputRows = document.getElementById('rows').value;
  const inputCols = document.getElementById('columns').value;
  // only if fileds sizes where entered
  if (inputRows && inputCols){
    const maxSize = Math.max(inputCols, inputRows);
    if(normalizedWord.replaceAll(" ", "").length > maxSize) {
      alert(`"${normalizedWord}" is too long for board size`)
      return;
    }
  }

  let newLI =  document.createElement("li");
  newLI.innerText = normalizedWord;
  list.appendChild(newLI);
  // add a hidden input so it can get name prop and be submittable
  let hiddenInput = document.createElement('input');
  hiddenInput.type = "hidden";
  hiddenInput.name = "word";
  hiddenInput.value = normalizedWord.replaceAll(' ', '');// cleans spaces btween words
  form.appendChild(hiddenInput);
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
    cell.dataset.id = i;
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
  const alphabet = getCurrentAlphabet();
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
  
  gameWordsList.innerHTML = "";
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
      if(succeeded) {
        printWord(word, gameMap[randCube], direct)
        placeWords.push(word);
      };
      iterateConter++
    }
  }
  placeWords.forEach(word => {
    const newLI = document.createElement('li');
    newLI.classList.add('word-in-list');
    newLI.innerText = word;
    gameWordsList.appendChild(newLI);
  });
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

function checkSizeToEnable(){
  const r = parseInt(rowsInput.value);
  const c = parseInt(colsInput.value);

  if (r >= 2 && c >= 2) {
    addWordBtn.disabled = false;
    randomBtn.disabled = false;
    selcectSizeWarning.style.display = "none"
  } else {
    addWordBtn.disabled = true;
    randomBtn.disabled = true;
    selcectSizeWarning.style.display = "block"    
  }  
}

function applyLanguage(lang) {
  currentLang = lang;
  const config = LANG_CONFIG[lang];

  document.documentElement.lang = lang;
  document.documentElement.dir = config.dir;

  document.querySelector('[data-i18n="title"]').textContent = config.ui.title;
  document.querySelector('[data-i18n="semi-title"]').textContent = config.ui.subtitle;
  document.querySelector('[data-i18n="hidden-words-title"]').textContent = config.ui.hiddenWordsTitle;
  document.querySelector('[data-i18n="hidden-words-semititle"]').textContent = config.ui.hiddenWordsSemiTitle;
  document.querySelector('[data-i18n="table-size"]').textContent = config.ui.tableSize;


  rowsInput.placeholder = config.ui.rowsPlaceholder;
  colsInput.placeholder = config.ui.colsPlaceholder;

  addWordBtn.textContent = config.ui.addWordBtn;
  randomBtn.textContent = config.ui.randomBtn;
  wordError.textContent = config.ui.invalidWord;
  selcectSizeWarning.textContent = config.ui.warningSize;
  langToggleBtn.textContent = config.ui.toggleBtn;

  document.querySelector('label[for="Random-word"]').textContent = config.ui.randomLabel;
  document.querySelector('button[type="submit"]').textContent = config.ui.createTableBtn;
  document.querySelector('.game-sidebar h3').textContent = config.ui.wordsTitle;
  document.querySelector('#victory-dialog h2').textContent = config.ui.victoryTitle;
  document.querySelector('#victory-dialog p').textContent = config.ui.victoryText;
  document.getElementById('play-again-btn').textContent = config.ui.playAgain;
}

function getCurrentAlphabet() {
  return LANG_CONFIG[currentLang].alphabet;
}

function getCurrentRegex() {
  return LANG_CONFIG[currentLang].validRegex;
}

export { gameMap, rows, columns, placeWords };
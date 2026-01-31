const gameZone = document.querySelector(".game-zone"); 

let allSquare = [];
let gameStart = false 
let sizeOfBoard = 9;

createBorad(sizeOfBoard);




function createBorad(len){
  let totalCells = len ** 2;

  gameZone.style.gridTemplateColumns = `repeat(${len}, 3rem)`; 
  gameZone.style.gridTemplateRows = `repeat(${len}, 3rem)`;

  for (let i = 0; i <= totalCells - 1; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.id = i;

    gameZone.appendChild(cell);
    createSquares(i)

    cell.addEventListener("mouseup", (ev) => {changeValues(ev, i)});
  }
}

function createSquares(i) {
  let square = {
    bomb: false,
    num: 0,
  };
  allSquare.push(square);
  // allSquare[i].spotInLine = (i + 1) % sizeOfBoard;
  // allSquare[i].line = Math.ceil(i / sizeOfBoard);
  // if(allSquare[i].line === 0) allSquare[i].line = 1;
}

function changeValues(ev, i){
  let cell = ev.target;

  if(ev.button === 0  && !cell.classList.contains("revealed")) {
    cell.classList.add("revealed");
    if (!gameStart) {
      createMines(i);
      gameStart = true;
    }
  }

  if(allSquare[i].bomb){
    cell.innerText = "💣";
  }else{
    calculateValue(i);
    cell.innerText = allSquare[i].num;
  }
}

function createMines(i){
  let minesSpots = [];
  
  for (let numOfMines = 0; numOfMines < sizeOfBoard; numOfMines++) {
    let randSquare = Math.floor(Math.random() * (sizeOfBoard ** 2));

    while(allSquare[randSquare] === allSquare[i] || minesSpots.includes(randSquare)){
      randSquare = Math.floor(Math.random() * (sizeOfBoard ** 2));
    }
    allSquare[randSquare].bomb = true;
    minesSpots.push(randSquare);
    console.log(randSquare);
  }
}

function calculateValue(i){
  allSquare[i].num = 0;
  let value = 0;
  
  // בודקת באותה שורה
  value += checkAfter(i);
  value += checkBefore(i);

  // הפונקציה תבדוק שורה מעל
  if (i + sizeOfBoard <= sizeOfBoard ** 2 + 1) {
    value += checkAfter(i + sizeOfBoard);
    value += checkBefore(i + 1 + sizeOfBoard);
    value += checkBefore(i + sizeOfBoard);
  }
    
  // הפונקציה תבדוק שורה מתחת
  if (i - sizeOfBoard >= 0) {
    value +=checkAfter(i - sizeOfBoard);
    value +=checkBefore(i + 1 - sizeOfBoard);
    value +=checkBefore(i - sizeOfBoard);  
  }

  allSquare[i].num = value;
}

function checkBefore(i){
  if(i - 1 < sizeOfBoard ** 2 && i - 1 >= 0){
    let adds = ( i % sizeOfBoard != 0 && allSquare[i - 1].bomb) ? 1 : 0;
    return adds;
  }
  else return 0;
}

function checkAfter(i){
  if(i + 1 < sizeOfBoard ** 2 && i + 1 >= 0){
    let adds = (i % sizeOfBoard != sizeOfBoard - 1 && allSquare[i + 1].bomb) ? 1 : 0;
    return adds;
  }
  else return 0;
}


// let neighbors = [];
  // const fakeSquare = {
  //   bomb: false,
  //   num: 0,
  // }
  // // הוספת שורה ועמודה כדי להתמודד עם הגבולות
  // for(let z = 0; z < sizeOfBoard; z++){
  //   allSquare.splice(0, 0, fakeSquare, fakeSquare);
  //   allSquare.push(fakeSquare, fakeSquare);
  // }

  // allSquare.forEach((square, i) => {if (i % sizeOfBoard === 0 && i === 0) {
  //   allSquare.splice(i, 0, fakeSquare, fakeSquare)}
  // })
  
  // const newSize = sizeOfBoard + 2;

  // neighbors.push(allSquare[i + 1], allSquare[i - 1], allSquare[i + newSize - 1], allSquare[i + newSize], allSquare[i + newSize + 1], allSquare[i - (newSize - 1)], allSquare[i - newSize], allSquare[i - newSize - 1])

  // if(allSquare[i].line === 1 || allSquare[i] === sizeOfBoard){
  //   allSquare[i].edge = true; 
  // }else if(allSquare[i].spotInLine === 1 || allSquare[i].spotInLine === sizeOfBoard - 1){
  //   allSquare[i].edge = true; 
  // }

  // if(!allSquare[i].edge){
  //   neighbors.push(allSquare[i + 1], allSquare[i - 1], allSquare[i + sizeOfBoard - 1], allSquare[i + sizeOfBoard], allSquare[i + sizeOfBoard + 1], allSquare[i - (sizeOfBoard - 1)], allSquare[i - sizeOfBoard], allSquare[i - sizeOfBoard - 1 ]);
  //   console.log(neighbors);  
  // }

  // if(allSquare[i].line === allSquare[i + 1].line) neighbors.push(allSquare[i + 1]);
  // if(allSquare[i].line === allSquare[i - 1].line) neighbors.push(allSquare[i - 1]);
  
  // if(allSquare[i].spotInLine === allSquare[i - sizeOfBoard].spotInLine) neighbors.push(allSquare[i - sizeOfBoard]);
  // if(allSquare[i].spotInLine === allSquare[i - 1].spotInLine) neighbors.push(allSquare[i - 1]);
  // if(allSquare[i].line === allSquare[i - 1].line) neighbors.push(allSquare[i - 1]);

//   neighbors.forEach(obj => {
//     if(obj.bomb) {
//       allSquare[i].num += 1; 
//       console.log("hey");
//     }
//   });
// }


// function checkLineAbove(value, i){
//   checkAfter(value, (i + sizeOfBoard));
//   checkLineAbove(value, (i - sizeOfBoard));
//   // if(i + sizeOfBoard <= sizeOfBoard ** 2){
//   //   const nextLine = i + sizeOfBoard;
//   // if(allSquare[i + sizeOfBoard].bomb) value++;
//   // }
//   // if(i - sizeOfBoard > 0) 
// }


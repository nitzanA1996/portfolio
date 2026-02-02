const gameBoard = document.querySelector(".game-board");
let lineLen = 10; 
const allSquare = [];
let gameStart = false;
let isOver = false;

// כפתורים ועוד
const mineCountDisplay = document.getElementById("mine-count");
const timerDisplay = document.getElementById("timer");
const resetBtn = document.getElementById("reset-btn");
const mobileBtn = document.getElementById("mobile-mode-btn");
let timerInterval;
let totalSeconds = 0;
let isDiggingMode = true; // למובייל

// --- איבנטים ---

// כפתורי רמה - מתחילים משחק חדש מיד
document.querySelectorAll(".level-btn").forEach(btn => {
    btn.addEventListener("click", (ev) => {
        document.querySelectorAll(".level-btn").forEach(level => level.classList.remove("active"));
        ev.target.classList.add("active");
        
        // עדכון גודל והתחלה מחדש
        lineLen = parseInt(ev.target.dataset.size);
        initGame();
    });
});

// כפתור סמיילי (ריסט)
resetBtn.addEventListener("click", initGame);

// כפתור מובייל
mobileBtn.addEventListener("click", () => {
    isDiggingMode = !isDiggingMode;
    mobileBtn.innerText = isDiggingMode ? "⛏️ מצב חפירה" : "🚩 מצב דגל";
    mobileBtn.classList.toggle("flag-mode");
});

// ביטול תפריט לחצן ימני
gameBoard.addEventListener("contextmenu", e => e.preventDefault());

// --- פונקציות המשחק ---

function initGame() {
    // איפוס משתנים
    gameBoard.innerHTML = "";
    allSquare.length = 0;
    gameStart = false;
    isOver = false;
    totalSeconds = 0;
    timerDisplay.innerText = "000";
    clearInterval(timerInterval);
    resetBtn.innerText = "🙂";

    createBoard();

    // עדכון גודל הלוח
    gameBoard.style.gridTemplateColumns = `repeat(${lineLen}, var(--cell-size))`;
    
    // מונה מוקשים התחלתי
    let mines = Math.floor(lineLen * lineLen * 0.15); 
    mineCountDisplay.innerText = String(mines).padStart(3, '0');
}

function createBoard() {
    let sizeOfBoard = lineLen * lineLen;
    
    for (let i = 0; i < sizeOfBoard; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.id = i;
        gameBoard.appendChild(cell);


        allSquare.push({
            bomb: false,
            val: 0 
        });


        cell.addEventListener("click", (ev) => {
            if (!isDiggingMode) handleRightClick(ev); // תמיכה במובייל
            else showVAl(ev, i);
        });

        // לחצן ימני
        cell.addEventListener("contextmenu", (ev) => {
            ev.preventDefault();
            handleRightClick(ev);
        });
    }
}

function showVAl(ev, i) {
    const cell = document.getElementById(i);
    if (isOver || cell.classList.contains("flagged") || cell.classList.contains("revealed")) return;

    // התחלה
    if (!gameStart) {
        gameStart = true;
        timerInterval = setInterval(() => {
            totalSeconds++;
            timerDisplay.innerText = String(totalSeconds).padStart(3, '0');
        }, 1000);
        
        generateMines(i); 
        
        // אם יצא 0 על ההתחלה
        if (allSquare[i].val === 0) zeroChain(i);
        else {
            cell.classList.add("revealed");
            cell.innerText = allSquare[i].val;
        }
    } 
    // המשך משחק
    else {
        if (allSquare[i].bomb) {
            cell.classList.add("revealed");
            cell.innerText = "💣";
            cell.style.backgroundColor = "#eebbba"; // אדום בהיר
            gameOver(false);
        } else if (allSquare[i].val === 0) {
            zeroChain(i);
        } else {
            cell.classList.add("revealed");
            cell.innerText = allSquare[i].val;
        }
    }
    
    checkWin(); 
}

// לחצן ימני מרים דגל
function handleRightClick(ev) {
    const cell = ev.target;
    if (isOver || cell.classList.contains("revealed")) return;

    if (cell.classList.contains("flagged")) {
        cell.classList.remove("flagged");
        cell.innerText = "";
    } else {
        cell.classList.add("flagged");
        cell.innerText = "🚩";
    }
}

// מייצר את מוקשים
function generateMines(safeIndex) {
    let minesCount = Math.floor(allSquare.length * 0.15); // 15% מוקשים
    let placed = 0;
    
    while (placed < minesCount) {
        let r = Math.floor(Math.random() * allSquare.length);
        if (r !== safeIndex && !allSquare[r].bomb) {
            allSquare[r].bomb = true;
            placed++;
        }
    }
    
    // חישוב מספרים אחרי פיזור המוקשים
    for (let i = 0; i < allSquare.length; i++) {
        if (!allSquare[i].bomb) {
            let neighbors = getNeighbors(i);
            let count = 0;
            neighbors.forEach(n => {
                if (allSquare[n].bomb) count++;
            });
            allSquare[i].val = count;
        }
    }
}

// פונקציה שבודקת שכנים מכל כיוון ומתקנת את הקצוות של הלוח
function getNeighbors(i) {
    let neighbors = [];
    const isLeft = i % lineLen === 0;
    const isRight = i % lineLen === lineLen - 1;
    
    // רשימת כל הכיוונים האפשריים
    const sides = [-1, 1, -lineLen, lineLen, -lineLen-1, -lineLen+1, lineLen-1, lineLen+1];
    
    sides.forEach(side => {
        let neighbor = i + side;
        // בדיקות קצוות
        if (neighbor >= 0 && neighbor < allSquare.length) {
            if (isLeft && (side === -1 || side === -lineLen-1 || side === lineLen-1)) return;
            if (isRight && (side === 1 || side === -lineLen+1 || side === lineLen+1)) return;
            neighbors.push(neighbor);
        }
    });
    return neighbors;
}

function zeroChain(i) {
    let cell = document.getElementById(i);
    // אם כבר לחוץ - עצור 
    if (cell.classList.contains("revealed")) return;
    
    cell.classList.add("revealed");
    
    let neighbors = getNeighbors(i);
    neighbors.forEach(n => {
        let nCell = document.getElementById(n);
        if (!allSquare[n].bomb && !nCell.classList.contains("revealed")) {
            if (allSquare[n].val === 0) {
                zeroChain(n); // רקורסיה
            } else {
                nCell.classList.add("revealed");
                nCell.innerText = allSquare[n].val;
            }
        }
    });
}

function gameOver(win) {
    isOver = true;
    clearInterval(timerInterval);
    resetBtn.innerText = win ? "😎" : "😵";

    if (!win) {
        allSquare.forEach((sq, idx) => {
            if (sq.bomb) {
                let c = document.getElementById(idx);
                c.classList.add("revealed");
                c.innerText = "💣";
            }
        });
    }
}

function checkWin() {
    let closed = 0;
    let bombs = 0;
    allSquare.forEach(sq => { if (sq.bomb) bombs++;});
    
    for (let i = 0; i < allSquare.length; i++) {
        if (!document.getElementById(i).classList.contains("revealed")) closed++;
    }
    
    if (closed === bombs) gameOver(true);
}

// התחלה ראשונית
initGame();
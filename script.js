const playerName = localStorage.getItem('playerName');
if (!playerName) {
  window.location.href = './index.html';
}


const squares = document.querySelectorAll('.square')
const timeLeft = document.querySelector('#time-left')
const score = document.querySelector('#score')

const banner = document.querySelector('#banner')
const continueBtn = document.querySelector('#continueBtn')
const exitBtn = document.querySelector('#exitBtn')
const bannerText1 = document.querySelector('.banner-text')
const bannerText2 = document.querySelector('.banner-text_points')

const hint = document.querySelector('#hint')
const stage = document.querySelector('#stage')


const LEVEL_GOAL = 10;
const LEVELS = 3
const ROUNDS_PER_LEVEL = 3
const ROUND_TIMES = [15, 12, 10] 

const ROUND_INTERVALS = [1000, 900, 800]

const ROUND_INTERVALS2 = [700, 600, 500]
const ROWS2 = 3;
const COLUMNS2 = 6;

const ROWS3 = 7
const COLUMNS3 = 9

const TASKS = ['Поймать матрешку двойным кликом: ','Расставить заданные метрешки по возрастанию слева направо: ', 'Сложить матрешки в соответствующую корзину']

const DOLLS = [
  { file: 'doll-01.png', desc: 'Наряд: желтый, узор: цветы' },
  { file: 'doll-02.png', desc: 'Наряд: синий, узор: снежинки' },
  { file: 'doll-03.png', desc: 'Наряд: зеленый, узор: ягоды' },
  { file: 'doll-04.png', desc: 'Наряд: голубой, узор: цветы' },
  { file: 'doll-05.png', desc: 'Наряд: фиолетовый, узор: цветы' },
  { file: 'doll-06.png', desc: 'Наряд: красный, узор: цветы' },
  { file: 'doll-07.png', desc: 'Наряд: красный, узор: орнамент' },
  { file: 'doll-08.png', desc: 'Наряд: синий, узор: ягоды' },
]

// состояние
//let level = 1

let level = Number(localStorage.getItem('startLevel')) || 1;
localStorage.removeItem('startLevel');

let round = 1


let levelScore = 0;
let result = 0
let hitPosition = null
let currentTime = ROUND_TIMES[0]
let timerId = null          
let countDownTimerId = null  // общий таймер секунд

let targetDoll = null
let shownDoll = null


// вспомогательные ф-ии

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}


function addScore(points) {
  result += points;
  levelScore += points;  

  if (result < 0) result = 0;
  if (levelScore < 0) levelScore = 0;
  score.textContent = result;
}

function flash(el, color, duration = 80) {
  const baseColor = el.style.backgroundColor;
  el.style.backgroundColor = color;
  setTimeout(() => el.style.backgroundColor = baseColor, duration);
}


function saveLeader(score) {
  const name = localStorage.getItem('playerName') || 'Unknown';

  let leaders = JSON.parse(localStorage.getItem('leaders')) || [];

  leaders.push({
    name: name,
    score: score
  });

  localStorage.setItem('leaders', JSON.stringify(leaders));
}




// ------------------


// общие ф-ии раунда

function showLevelScene() {
  document.querySelectorAll('.scene').forEach(s =>
     s.classList.remove('active'))

  const active = document.getElementById('level' + level);
  if (active) active.classList.add('active')

  if (stage) stage.textContent = `Уровень ${level} . Раунд ${round}/${ROUNDS_PER_LEVEL}`
}

function showTask(target = null) {
  if (!hint) return;

  let text = TASKS[level - 1];
  if (level === 3) {
    hint.textContent = text;
  } else {
    hint.textContent = text + (target ? target.desc : '');
  }
}



function startRoundTask() {
  targetDoll = pickRandom(DOLLS);
  showTask(targetDoll);
}

function setupRoundTimers() {
  currentTime = ROUND_TIMES[round - 1];
  if (timeLeft)
     timeLeft.textContent = currentTime;
}


function stopTimers() {
  clearInterval(timerId)
  timerId = null
}

         // старт раунда
function startLevelRound() {
  if (round === 1) 
    levelScore = 0;  

  showLevelScene()
  setupRoundTimers()
  stopTimers()

  if (level === 1)
     startLevel1()
    
  else if (level === 2) 
    startLevel2()

  else if (level === 3)
     startLevel3()
}


//баннер между раундами
function showBanner(text) {
  
  stopTimers();
  clearInterval(countDownTimerId);
   banner.classList.add('visible');
   bannerText2.textContent = '';

   bannerText1.textContent=text;

  const left = Math.max(0, LEVEL_GOAL - levelScore);

  if (left > 0) {
    bannerText2.textContent =
      'До успешного прохождения уровня осталось: ' + left;
  }
}



continueBtn.addEventListener('click', ()=>{
  banner.classList.remove('visible');
  startLevelRound();
  countDownTimerId = setInterval(countDown, 1000);

});

exitBtn.addEventListener('click', () => {
  window.location.href = './results.html';
});



function nextRound() {
  round++;

    let message = "Далее:Раунд " + round;

  if (round > ROUNDS_PER_LEVEL) {
    if (levelScore < LEVEL_GOAL) {
      result -= levelScore;     
      if (result < 0) result = 0;   
      score.textContent = result;

      round = 1; // повторяем этот же уровень
      levelScore = 0; 
      showBanner(`Уровень ${level} не пройден. Попробуйте ещё раз!`);
      return;
  }
    round = 1;
    level++;
    levelScore = 0;  
    message = "Далее: Уровень " + level;

    // конец игры
    if (level > LEVELS) {
      clearInterval(countDownTimerId);
      clearInterval(timerId);
      saveLeader(result);
      window.location.href = './results.html';
      return;
    }

    


  }
  showBanner(message);

  //startLevelRound();
}

// --------------




// УРОВЕНЬ 1 


function clearLevel1Grid() {
  squares.forEach(square => {
    square.classList.remove('doll');
    square.style.backgroundImage = '';
  });
  hitPosition = null;
}


function chooseDoll() {
  const showCorrect = Math.random() < 0.5;
  if (showCorrect) return targetDoll;

  let other = pickRandom(DOLLS);

  while (other.file === targetDoll.file) 
    other = pickRandom(DOLLS);

  return other;
}


function showDoll(doll, square) {
  square.classList.add('doll');
  square.style.backgroundImage = `url(./assets/img/${doll.file})`;
  hitPosition = square.id;
}


// один шаг игры
function level1Step() {
  clearLevel1Grid();
  shownDoll = chooseDoll();
  const square = pickRandom(squares);
  showDoll(shownDoll, square);
}

//перезапуск таймера появления
function restartTimer() {
  clearInterval(timerId);
  timerId = setInterval(level1Step, ROUND_INTERVALS[round - 1]);
}

//
function startLevel1() {
  startRoundTask(); 
  level1Step();      
  restartTimer();
}

//  обработка клика по клетке
function level1Click(square) {
  
  if (square.id !== hitPosition) return;


  if(shownDoll.file === targetDoll.file) {
    addScore(1);
    flash(square, 'rgb(168, 221, 182)');
  }
  else {
    addScore(-1);
    flash(square, 'rgb(233, 186, 174)');
  }



  
  level1Step();
  restartTimer();
}


squares.forEach(square => {
  square.addEventListener('dblclick', () => {
    if (level !== 1) return;
    level1Click(square);
  });
});


// --------------



//  УРОВЕНЬ 2  

const SIZES = [0.6,0.7,0.8,0.9,1,1.1,1.2,1.3];


let level2Expected = []; // какие размеры должны быть в слотах 


function startLevel2() {
  const count = slotsCount(round);
  const targetDoll2 = pickRandom(DOLLS);

  showTask(targetDoll2);

  makeSlots(count);
  showDolls(count, targetDoll2);
}




function slotsCount(round) {
  if (round === 1) return 3;
  else if (round === 2) return 4;
  else return 5;
}

function distractorsCount(round) {
  if (round === 1) return 5;
  else if (round === 2) return 6;
  else return 7;
}




function makeSlots(count) {
  const slotsEl = document.querySelector('#slots');
  if (!slotsEl) return;

  slotsEl.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.dataset.index = i;
    slotsEl.appendChild(slot);

    dropDoll(slot); //  для перетаскивания
  }
}



// генерация поля с матрешк
function showDolls(count, targetDoll2) {
  const playfield = document.querySelector('#playfield');
  if (!playfield) return;

  playfield.innerHTML = '';
  level2Expected = [];

  const used = new Set();
  

  const distractCount = distractorsCount(round);
  
  addCorrectDolls(playfield, count, targetDoll2, used);
  addDistractors(playfield, distractCount, targetDoll2, used);
}



function addCorrectDolls(playfield, count, targetDoll2, used) {
  const copySizes = [...SIZES];

  for (let i = 0; i < count; i++) {
    const size = takeRandomSize(copySizes); 
    level2Expected.push(size);

    const square = takeFreeSquare(used, COLUMNS2, ROWS2);
    const el = createDoll(targetDoll2.file, size, square);
    playfield.appendChild(el);
  }

  level2Expected.sort((a, b) => a - b);
}

function addDistractors(playfield, distractCount, targetDoll2, used) {
  const copySizes = [...SIZES];

  for (let i = 0; i < distractCount; i++) {

    let d = pickRandom(DOLLS);
    while (d.file === targetDoll2.file)
      d = pickRandom(DOLLS);

    const size = takeRandomSize(copySizes);

    const square = takeFreeSquare(used, COLUMNS2, ROWS2);
    const el = createDoll(d.file, size, square);
    playfield.appendChild(el);
  }
}

let dollCnt = 0;
function createDoll(file, size, square) {
  const el = document.createElement('div');
  el.className = 'level2-doll';

  el.style.backgroundImage = `url(./assets/img/${file})`;
  el.dataset.size = size; 

  el.style.transform = `scale(${size})`;
  el.style.gridColumn = square.col;
  el.style.gridRow = square.row;

  el.id = 'l2' + dollCnt++;
  dragDoll(el);

  return el;
}

function takeRandomSize(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return arr.splice(index, 1)[0]; 
}

function takeFreeSquare(used, cols, rows) {
  let col, row, key;

  do {
    col = 1 + Math.floor(Math.random() * cols);
    row = 1 + Math.floor(Math.random() * rows);
    key = `${col}-${row}`;
  } while (used.has(key));

  used.add(key);
  return { col, row };
}



// перетаскивание 
function dragDoll(doll) {
  doll.draggable = true;

  doll.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', doll.id);
  });
}

function dropDoll(slot) {
  slot.addEventListener('dragover', (e) =>
     e.preventDefault());

  slot.addEventListener('drop', (e) => {
    e.preventDefault();

    if (slot.firstElementChild) return; // слот занят

    const id = e.dataTransfer.getData('text/plain');
    const doll = document.getElementById(id);
    if (!doll) return;

    slot.appendChild(doll);

    // фиксируем
    doll.style.gridColumn = '';
    doll.style.gridRow = '';
    doll.draggable = false;


    const index = Number(slot.dataset.index);

    const size = Number(doll.dataset.size);

    if (size === level2Expected[index]){
      addScore(1);
      flash(slot, 'rgb(168, 221, 182)');
    }
      else {
      addScore(-1);
      flash(slot, 'rgb(233, 186, 174)');
    }



    checkSlotsFilled();
  });
}

function checkSlotsFilled() {
  const slots = document.querySelectorAll('#slots .slot');

  for (let slot of slots) {
    if (!slot.firstElementChild) return;
  }

  currentTime = 1; // заканчиваем раунд

  // setTimeout(() => nextRound(), 300);
}


// --------------





// УРОВЕНЬ 3  

const level3 = document.getElementById('level3');

const POSITIONS = {
  3: [2, 5, 8],
  4: [2, 4, 6, 8],
  5: [1, 3, 5, 7, 9],
};

let currentIndex = 0;
let fallingEl = null;
let dollPos = null;  //ячейка
let randomDollsArr;



function checkHitBasket() {
  const k = level + round - 1;
  const basketCols = POSITIONS[k];
  if (!basketCols) return;

  const targetCol = basketCols[currentIndex]; 
  if (targetCol == null) return;

  if (dollPos.col === targetCol) {
    addScore(1);

  } else {
    addScore(-1);
  }

}



function clearBaskets() {
  level3.querySelectorAll('.basket').forEach(basket => basket.remove());
}



//уник массив матрешек
function makeRandomArr(arr, count) {
  randomDollsArr = [];
  while (randomDollsArr.length < count) {
    let randomDollobj = pickRandom(arr);
    if (!randomDollsArr.includes(randomDollobj)) {
      randomDollsArr.push(randomDollobj);
    }
  }
}


function clearDoll() {
  level3.querySelectorAll('.level3-doll').forEach(el =>
     el.remove());
}

function showRandomDoll() {
  clearDoll();

   currentIndex = Math.floor(Math.random() * randomDollsArr.length);
  const doll = randomDollsArr[currentIndex];
 
  if (!doll) return;
  const col = 1 + Math.floor(Math.random() * COLUMNS3); 

  dollPos =  { col, row: 1 };

 

  const el = document.createElement('div');
  el.classList.add('level3-doll'); 
  el.style.backgroundImage = `url(./assets/img/${doll.file})`;
  el.style.gridColumn = dollPos.col;
  el.style.gridRow = dollPos.row;

 

  level3.appendChild(el);
  fallingEl = el;
}





function showBasket(cols) {
  clearBaskets();

  cols.forEach((col, i) => {
    const basket = document.createElement('div');

    basket.classList.add('basket');
    basket.style.backgroundImage = `url(./assets/img/basket.png)`; 

    basket.textContent = randomDollsArr[i].desc;

    basket.style.gridColumn = col;
    basket.style.gridRow = ROWS3;

    level3.appendChild(basket);
  });
}



//движение вниз
function moveDown() {
  if (!fallingEl) return;

 
  if (dollPos.row === ROWS3) {

    checkHitBasket();
    showRandomDoll();
    return;
  }

  // иначе падаем на 1 
  dollPos.row += 1;
  fallingEl.style.gridRow = dollPos.row;
}


//движение влево-вправо
function moveLeftRight(dir) {
  if (!fallingEl) return;

   // на последней строке не двигаем
  if (dollPos.row === ROWS3) return;
  let newCol = dollPos.col + dir;

  // границы поля
  if (newCol < 1 || newCol > COLUMNS3) return;

  dollPos.col = newCol;
  fallingEl.style.gridColumn = dollPos.col;
}


//обработчик клавиатуры
document.addEventListener('keydown', (e) => {
  if (level !== 3) return; // работает только на уровне 3

  if (e.key === 'ArrowLeft') {
    moveLeftRight(-1);
  }

  if (e.key === 'ArrowRight') {
    moveLeftRight(1);
  }
});




function startLevel3() {
  const k = level + round - 1;
  const cols = POSITIONS[k];

  makeRandomArr(DOLLS, cols.length);
  showBasket(cols);
  showRandomDoll();

  clearInterval(timerId);
  timerId = setInterval(moveDown, ROUND_INTERVALS2[round - 1]);

  showTask();
}















//общий таймер
function countDown() {
  currentTime--
  if (timeLeft) timeLeft.textContent = currentTime

  if (currentTime <= 0) {

    nextRound()
  }
}

//   старт
 countDownTimerId = setInterval(countDown, 1000);
 startLevelRound();


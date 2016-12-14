var baseGridW = 16;
var baseGridH = 16;
var totalTiles = baseGridH * baseGridW;
var minesNeeded = 40;
var mineCount;
var mineCountValue;
var minesPlaced = [];
var tiles;
var compass = {
  n: -baseGridH,
  ne: -baseGridH + 1,
  e: 1,
  se: baseGridH + 1,
  s: baseGridH,
  sw: baseGridH - 1,
  w: -1,
  nw: -baseGridH - 1
};
var minutesLabel;
var secondsLabel;
var totalSeconds;
var time;

function pad(val, padLength) {
  var valString = val + '';
  if (padLength - valString.length === 1 )  {
    return '0' + valString;
  } else if ( padLength - valString.length === 2 ) {
    return '00' + valString;
  } else {
    return valString;
  }
}

function resetClock() {
  var minutesLabel = document.getElementById('minutes');
  var secondsLabel = document.getElementById('seconds');
  minutesLabel.innerHTML = pad('0', 2);
  secondsLabel.innerHTML = pad('0', 2);
}

function resetMineCounter() {
  var minesDisplay = document.getElementById('display1');
  minesDisplay.innerHTML = pad(minesNeeded, 3);
}

function setSmiley() {
  var smiley = document.getElementById('smileyFace');
  smiley.setAttribute('src', 'images/smiley.jpg');
}

function setFrowney() {
  var frowney = document.getElementById('smileyFace');
  frowney.setAttribute('src', 'images/frowney.jpg');
}

function gameReset() {
  // console.log('gameReset called');
  var msBoard = document.getElementById('minesweeper');
  msBoard.innerHTML = '';
  makeTiles();
  minesPlaced = [];
  placeMines();
  setSmiley();
  resetMineCounter();
  resetClock();
}

function restartListener() {
  // Set event listener for new game;
  var newGame = document.getElementById('newGame');
  newGame.addEventListener('click', gameReset);
}

function playSound(sound) {
  var audio;
  switch(sound) {
    case 'boomSound':
      audio = new Audio('audio/explosion_sound.mp3');
      break;
    case 'tileSound':
      audio = new Audio('audio/click_sound.mp3');
      break;
    case 'flag':
      audio = new Audio('audio/flag_sound.mp3');
      break;
    case 'tada':
      audio = new Audio('audio/tada.mp3');
      break;
    default:
      break;
  }
  audio.play();
}

function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds%60, 2);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds/60), 2);
}

function timerDisplay() {
  minutesLabel = document.getElementById('minutes');
  secondsLabel = document.getElementById('seconds');
  totalSeconds = 0;
  time         = setInterval(setTime, 1000);
}

// Place mines in random locations on the board and record position in an array
function placeMines() {
  while (minesPlaced.length < minesNeeded) {
    var mineIndex = Math.floor(Math.random() * totalTiles);
    if (!minesPlaced.includes(mineIndex)) {
      minesPlaced.push(mineIndex);
    }
  }
}

function numberColor(minesTouched, tileElement) {
  // ar tileClasses = tileElement.getAttribute('class');
  // console.log(tileClasses);
  switch (minesTouched) {
    case 1:
      tileElement.setAttribute('class', 'midBlue');
      break;
    case 2:
      tileElement.setAttribute('class', 'green');
      break;
    case 3:
      tileElement.setAttribute('class', 'tile red');
      break;
    case 4:
      tileElement.setAttribute('class', 'tile darkBlue');
      break;
    case 5:
      tileElement.setAttribute('class', 'tile darkRed');
      break;
    case 6:
      tileElement.setAttribute('class', 'tile aqua');
      break;
    case 7:
      tileElement.setAttribute('class', 'tile black');
      break;
    case 8:
      tileElement.setAttribute('class', 'tile midGrey');
      break;
    default:
      break;
  }
}

function callWinnerModal() {
// Get the modal
  var modal = document.getElementById('winnerModal');
// Get the <span> element that closes the modal
  var span = document.getElementsByClassName('close')[0];
// Get the span element for the winning time in seconds
  var winningTimeEl = document.getElementById('winningSeconds');
// Set the number of seconds in the modal
  winningTimeEl.innerHTML = totalSeconds;
// When the user clicks on the button, open the modal
  modal.style.display = 'block';
// When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = 'none';
  };
// When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}

function countCheckedTiles() {
  if ((totalTiles - minesNeeded) === document.querySelectorAll('[data-checked]').length+1) {
    clearInterval(time);
    disableTiles();
    playSound('tada');
    return callWinnerModal();
  }
}

// Create an array of the 8 tiles around the original tile clicked
function getTileArray(centreTile) {
  if (tiles[centreTile].getAttribute('data-checked')) return false;
  // Check for win
  countCheckedTiles();

  // Prevent being checked as the center again
  tiles[centreTile].setAttribute('data-checked', true);
  tiles[centreTile].style.backgroundColor = '#eee';

  // Loop through to get the possible indicies
  var possibleIndices = Object.keys(compass).map(function(direction) {
    var index = centreTile + compass[direction];
    if (
      index >= 0 &&
      index < totalTiles &&
      ((centreTile % baseGridH) - (index%baseGridH) < baseGridH-1) &&
      (index%baseGridH) - (centreTile % baseGridH) < baseGridH-1 &&
      !tiles[index].getAttribute('data-checked') // Ignore any which have been checked as center
    ) {
      return index;
    }
  }).filter(function(x) {
    return typeof x !== 'undefined';
  });

  var numberOfMinesTouching = possibleIndices.map(function(index) {
    if (minesPlaced.includes(index)) return index;
  }).filter(function(x) {
    return typeof x !== 'undefined';
  }).length;

  if (numberOfMinesTouching > 0) {
    var numberedTile = tiles[centreTile];
    numberedTile.innerHTML = numberOfMinesTouching;
    numberColor(numberOfMinesTouching, numberedTile);
  } else {
    return possibleIndices.forEach(getTileArray);
  }
}

function greyMines(indexNum) {
  // console.log('Tile index passed to greyMines: ' + indexNum);
  var tiles = document.getElementsByTagName('li');
  var tile;
  // console.log(tiles);
  for (var i = 0; i < minesPlaced.length; i++) {
    if ( minesPlaced[i] !== indexNum ) {
      tile = minesPlaced[i];
      // console.log('Inside for loop within greyMines. minesPlaced[i] value is: ' + tile);
      tiles[tile].setAttribute('class', 'tile greyMine');
    }
  }
}

function disableTiles() {
  var checkedTiles = document.getElementsByTagName('li');
  for (var i = 0; i < checkedTiles.length; i++) {
    checkedTiles[i].removeEventListener('click', logTile);
    checkedTiles[i].removeEventListener('contextmenu', setFlag);
  }
}

// Access index of tile being clicked
function logTile(e) {
  e.preventDefault();
  var tile = this;
  if (document.querySelectorAll('[data-checked]').length === 0) {
    timerDisplay();
  }
  if (minesPlaced.includes(tiles.indexOf(tile))) {
    // Stop timer
    clearInterval(time);
    tile.setAttribute('class', 'tile redMine');
    // Call function to set all other mines grey
    greyMines(tiles.indexOf(tile));
    playSound('boomSound');
    setFrowney();
    // Remove click event listener from other tiles
    disableTiles();
  } else {
    var tileValue = tile.getAttribute('data-value');
    tileValue = parseInt(tileValue);
    // console.log('The tile clicked was number: ' + tileValue);
    playSound('tileSound');
    getTileArray(tileValue);
  }
}

function reduceMineCount() {
  mineCount = document.getElementById('minecount');
  mineCountValue = parseInt(mineCount.innerHTML);
  mineCountValue = mineCountValue - 1;
  // console.log(mineCountValue);
  if (mineCountValue >= 0) {
    mineCount.innerHTML = pad(mineCountValue, 3);
  }
}

// Set the flag icon on right-click
function setFlag(e) {
  e.preventDefault();
  if (mineCountValue === 0) return false;
  this.setAttribute('class', 'tile flag');
  reduceMineCount();
  playSound('flag');
  return false;
}

// Add event listener for click event on each tile
function addListener() {
  tiles = document.getElementsByClassName('tile');
  tiles = [].slice.call(tiles);
  for (var i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener('click', logTile);
    tiles[i].addEventListener('contextmenu', setFlag, false);
  }
}

// Create tiles on board
function makeTiles() {
  var msBoard = document.getElementById('minesweeper');
  for (var i = 0; i < totalTiles; i++) {
    var tile = document.createElement('li');
    tile.setAttribute('class', 'tile');
    tile.setAttribute('data-value', i);
    msBoard.appendChild(tile);
  }
  addListener();
}

// Start application
function init() {
  makeTiles();
  placeMines();
  restartListener();
}

document.addEventListener('DOMContentLoaded', init, false);

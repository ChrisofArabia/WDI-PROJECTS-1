var baseGridW = 16;
var baseGridH = 16;
var totalTiles = baseGridH * baseGridW;
var minesNeeded = 40;
var minesPlaced = [];
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
var tiles;

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
    default:
      break;
  }
  audio.play();
}

function pad(val) {
  var valString = val + '';
  if (valString.length < 2)  {
    return '0' + valString;
  } else {
    return valString;
  }
}

function setTime(minutesLabel, secondsLabel, totalSeconds) {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds%60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds/60));
}

function timerDisplay() {
  var minutesLabel = document.getElementById('minutes');
  var secondsLabel = document.getElementById('seconds');
  var totalSeconds = 0;
  setInterval(setTime(minutesLabel, secondsLabel, totalSeconds), 1000);
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

// Create an array of the 8 tiles around the original tile clicked
function getTileArray(centreTile) {
  if (tiles[centreTile].getAttribute('data-checked')) return false;

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
  }
}

// Access index of tile being clicked
function logTile(e) {
  e.preventDefault();
  var tile = this;
  if (minesPlaced.includes(tiles.indexOf(tile))) {
    tile.setAttribute('class', 'tile redMine');
    // Call function to set all other mines grey
    greyMines(tiles.indexOf(tile));
    playSound('boomSound');
    // Remove click event listener from other tiles
    disableTiles();
  } else {
    var tileValue = tile.getAttribute('data-value');
    tileValue = parseInt(tileValue);
    // console.log('The tile clicked was number: ' + tileValue);
    playSound('tileSound');
    timerDisplay();
    getTileArray(tileValue);
  }
}

// Add event listener for click event on each tile
function addListener() {
  tiles = document.getElementsByClassName('tile');
  tiles = [].slice.call(tiles);
  for (var i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener('click', logTile);
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
  // setTimeout(setMineClass, 150);
}

document.addEventListener('DOMContentLoaded', init, false);

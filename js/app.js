var baseGridW = 16;
var baseGridH = 16;
var totalTiles = baseGridH * baseGridW;
var minesNeeded = 40;
var minesPlaced = [];
// var tileArray = [];
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

// Set class on tiles that have a mine in them.
function setMineClass() {
  for (var j = 0; j < tiles.length; j++) {
    if (minesPlaced.includes(j)) {
      // tiles[j].setAttribute('class', 'tile greyMine');
    }
  }
  var redTiles = document.getElementsByClassName('greyMine');
  var mineCountPara = document.getElementById('mineCount');
  var mineCountText = 'Total number of mines on matrix: ' + redTiles.length;
  mineCountPara.innerHTML = mineCountText;
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

// Create an array of the 8 tiles around the original tile clicked
function getTileArray(centreTile) {
  if (tiles[centreTile].getAttribute('data-checked')) return false;

  // Prevent being checked as the center again
  tiles[centreTile].setAttribute('data-checked', true);
  tiles[centreTile].style.backgroundColor = 'blue';

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
    tiles[centreTile].innerHTML = numberOfMinesTouching;
  } else {
    return possibleIndices.forEach(getTileArray);
  }
}

// Access index of tile being clicked
function logTile(e) {
  e.preventDefault();
  var tile = this;
  if (minesPlaced.includes(tiles.indexOf(tile))) {
    tile.setAttribute('class', 'tile redMine');
  }
  var tileValue = tile.getAttribute('data-value');
  tileValue = parseInt(tileValue);
  console.log('The tile clicked was number: ' + tileValue);
  getTileArray(tileValue);
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
  setTimeout(setMineClass, 150);
}

document.addEventListener('DOMContentLoaded', init, false);

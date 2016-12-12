
var baseGridW = 16;
var baseGridH = 16;
var totalTiles = baseGridH * baseGridW;
var minesNeeded = 40;
var minesPlaced = [];
var tileArray = [];

// Set class on tiles that have a mine in them.
function setMineClass() {
  var tiles = document.getElementsByClassName('tile');
  for (var j = 0; j < tiles.length; j++) {
    if (minesPlaced.includes(j)) {
      tiles[j].setAttribute('class', 'tile greyMine');
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

function checkForMines(tileArray) {
  // Do something
  // Compare eack item in tileArray with minesPlaced
  // When a mine is found, increment a counter
  // When all members of tileArray have been checked, pass onto next function to process info in counter
}

// Remove any numbers outside the end of a line
function removeLineEnds(tileArray) {
  // console.log(tileArray);
  var tempArray = [];
  // tempArray = tileArray;
  // Remove numbers to the right of the grid
  for (var i = 0; i < tileArray.length; i++) {
    if (!( (tileArray[i] + 1) % baseGridW === 0 )) {
      tempArray.push(tileArray[i]);
    }
  }
  console.log('tempArray is: ' + tempArray);
  tileArray = [];

  // remove lines to the left of the grid
  for (var j = 0; j < tempArray.length; j++) {
    if (!( (tempArray[j] + 1) % baseGridW === 0 )) {
      tileArray.push(tempArray[j]);
    }
  }
  console.log('tileArray is: ' + tileArray);
  checkForMines(tileArray);
}

// Remove any numbers below 0 or above total number of tiles on the board
function removeRedundantNos(tileArray) {
  var tempArray = [];
  // Remove items from array if below 0
  for (var i = 0; i < tileArray.length; i++) {
    if (tileArray[i] >= 0) {
      tempArray.push(tileArray[i]);
    }
  }
  tileArray = [];
  // Remove items from array if above 255
  for (var j = 0; j < tempArray.length; j++) {
    if (tempArray[j] < totalTiles)  {
      tileArray.push(tempArray[j]);
    }
  }
  removeLineEnds(tileArray);
}

// Create an array of the 8 tiles around the original tile clicked
function getTileArray(centreTile) {
  tileArray.push(centreTile - baseGridH);         // above
  tileArray.push(centreTile - (baseGridH - 1));   // above-right
  tileArray.push(centreTile + 1);                 // right
  tileArray.push(centreTile + (baseGridH + 1));   // beneath-right
  tileArray.push(centreTile + baseGridH);         // beneath
  tileArray.push(centreTile + (baseGridH - 1));   // beneath-left
  tileArray.push(centreTile - 1);                 // left
  tileArray.push(centreTile - (baseGridH + 1));   // above-left
  console.log('The 8 tiles around the one clicked are: ' + tileArray);
  removeRedundantNos(tileArray);
}

// Access index of tile being clicked
function logTile(tile) {
  return function(e) {
    e.preventDefault();
    var tileValue = tile.getAttribute('data-value');
    tileValue = parseInt(tileValue);
    console.log('The tile clicked was number: ' + tileValue);
    getTileArray(tileValue);
  };
}

// Add event listener for click event on each tile
function addListener() {
  var tiles = document.getElementsByClassName('tile');
  for (var i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener('click', logTile(tiles[i]));
  }
}

// Create tiles on board
function makeTiles() {
  for (var i = 0; i < totalTiles; i++) {
    var msBoard = document.getElementById('minesweeper');
    var tile = document.createElement('li');
    tile.setAttribute('class', 'tile');
    tile.setAttribute('data-value', i);
    msBoard.appendChild(tile);
  }
}

// Start application
function init() {
  makeTiles();
  addListener();
  placeMines();
  setTimeout(setMineClass, 150);
}

document.addEventListener('DOMContentLoaded', init, false);

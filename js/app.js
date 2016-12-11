
var baseGridW = 16;
var baseGridH = 16;
var totalTiles = baseGridH * baseGridW;
var minesNeeded = 40;
var minesPlaced = [];
var tileArray = [];

function setMineClass() {
  // Set class on tiles that have a mine in them.
  var tiles = document.getElementsByClassName('tile');
  for (var j = 0; j < tiles.length; j++) {
    if (minesPlaced.includes(j)) {
      tiles[j].setAttribute('class', 'tile red');
    }
  }
  var redTiles = document.getElementsByClassName('red');
  $('.mineCount').html('Total number of mines on matrix: ' + redTiles.length);
}

function placeMines() {
  while (minesPlaced.length < minesNeeded) {
    var mineIndex = Math.floor(Math.random() * totalTiles);

    if (!minesPlaced.includes(mineIndex)) {
      minesPlaced.push(mineIndex);
    }
  }
}

function removeRedundantNos(tileArray) {
  var tempArray = [];
  for (var i = 0; i < tileArray.length; i++) {
    if (tileArray[i] >= 0) {
      tempArray.push(tileArray[i]);
    }
  }
  console.log(tempArray);
  tileArray = [];
  for (var j = 0; j < tempArray.length; j++) {
    if (tempArray[j] < totalTiles)  {
      tileArray.push(tempArray[j]);
    }
  }
  console.log(tileArray);
}

function getTileArray(centreTile) {
  tileArray.push(centreTile - baseGridH);         // above
  tileArray.push(centreTile - (baseGridH + 1));   // above-right
  tileArray.push(centreTile + 1);                 // right
  tileArray.push(centreTile + (baseGridH + 1));   // beneath-right
  tileArray.push(centreTile + baseGridH);         // beneath
  tileArray.push(centreTile + (baseGridH - 1));   // beneath-left
  tileArray.push(centreTile - 1);                 // left
  tileArray.push(centreTile - (baseGridH - 1));   // above-left
  console.log(tileArray);
  removeRedundantNos(tileArray);
}

function logTile(tile) {
  return function(e) {
    e.preventDefault();
    var tileValue = tile.getAttribute('data-value');
    tileValue = parseInt(tileValue);
    getTileArray(tileValue);
  };
}

function addListener() {
  var tiles = document.getElementsByClassName('tile');
  for (var i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener('click', logTile(tiles[i]));
  }
}

function makeTiles() {
  for (var i = 0; i < totalTiles; i++) {
    var msBoard = document.getElementById('minesweeper');
    var tile = document.createElement('li');
    tile.setAttribute('class', 'tile');
    tile.setAttribute('data-value', i);
    msBoard.appendChild(tile);
  }
}

function init() {
  makeTiles();
  addListener();
  placeMines();
  setTimeout(setMineClass, 150);
}

document.addEventListener('DOMContentLoaded', init, false);

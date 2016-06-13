"use strict";

// dimension of dungeon map.
var width = 100;
var height = 100;
var threshold = 270;
var playerIndex = [];

// room types.
var SMALLROOM = {
  height: 3,
  width: 3
};
var LARGEROOM = {
  height: 6,
  width: 6
};
var VERTCORRIDOR = {
  height: 10,
  width: 2
};
var HORIZCORRIDOR = {
  height: 1,
  width: 10
};
var typesOfRooms = 4;

// Dungeon map composed of any of the following.
var FULL = 0; // space that is non occupiable.
var EMPTY = 1; // space occupiable with nothing there.
var PORTAL = 2; // redirects you to next dungeon.

// direction facing wall.
var NORTH = 7;
var SOUTH = 8;
var EAST = 9;
var WEST = 10;

// weapons available.
var FIST = 50;
var STICK = 75;
var MACE = 100;
var AXE = 125;
var KATANA = 150;
var OATHKEEPER = 500;

/* player object */
function setAttack(weapon, level) {
  return 2 * level + weapon;
}

function setNextLevel(level) {
  return 200 * level + 100;
}

function setHp(level) {
  return 100 * level + 100;
}

function player(weapon, level) {
  this.name = "PLAYER";
  this.weapon = weapon;
  this.level = level;
  this.hp = setHp(level);
  this.attack = setAttack(this.weapon, this.level);
  this.nextLevel = setNextLevel(this.level);
  this.levelUp = function () {
    if (this.nextLevel > 0) return;
    this.level++;
    this.hp = setHp(this.level);
    this.attack = setAttack(this.weapon, this.level);
    this.nextLevel = setNextLevel(this.level);
  };
}

/* enemy object */
function enemy(dungeon) {
  this.name = "ENEMY";
  this.hp = 100 * dungeon + 100;
  this.attack = 50 * dungeon;
}

/* weapon object */
function weapon(dungeon) {
  this.name = "WEAPON";
  switch (dungeon) {
    case 1:
      this.type = STICK;
      break;
    case 2:
      this.type = MACE;
      break;
    case 3:
      this.type = AXE;
      break;
    case 4:
      this.type = KATANA;
      break;
    case 5:
      this.type = OATHKEEPER;
      break;
    default:
      this.type = -1;
  }
}

/* health item object */
function item(dungeon) {
  this.name = "ITEM";
  switch (dungeon) {
    case 1:
      this.health = 25;
      break;
    case 2:
      this.health = 50;
      break;
    case 3:
      this.health = 75;
      break;
    case 4:
      this.health = 100;
      break;
    case 5:
      this.health = 150;
      break;
    default:
      this.health = -1;
  }
}

/* functions for generation a dungeon floor */

// creates initial dungeon of just full spaces.
function initDungeon(width, height) {
  var map = [];
  for (var i = 0; i < height; i++) {
    var row = [];
    for (var j = 0; j < width; j++) {
      row.push(FULL);
    }
    map.push(row);
  }
  return map;
}

// creates a room at 2d-index of max width and height.
function createRoom(map, type, index, direction) {
  if (direction === NORTH) {
    for (var i = index[0] - 1; i >= index[0] - type.height; i--) {
      for (var j = index[1]; j < index[1] + type.width; j++) {
        map[i][j] = EMPTY;
      }
    }
    return;
  }
  if (direction === EAST) {
    for (var i = index[0]; i < index[0] + type.height; i++) {
      for (var j = index[1] + 1; j <= index[1] + type.width; j++) {
        map[i][j] = EMPTY;
      }
    }
    return;
  }
  if (direction === SOUTH) {
    for (var i = index[0] + 1; i <= index[0] + type.height; i++) {
      for (var j = index[1]; j < index[1] + type.width; j++) {
        map[i][j] = EMPTY;
      }
    }
    return;
  }
  if (direction === WEST) {
    for (var i = index[0]; i < index[0] + type.height; i++) {
      for (var j = index[1] - 1; j >= index[1] - type.width; j--) {
        map[i][j] = EMPTY;
      }
    }
    return;
  }
  return;
}

/* functions to be defined next time */
// randomly selects a type of room.
function decideRoom() {
  var selection = Math.floor(Math.random() * typesOfRooms);
  switch (selection) {
    case 0:
      return SMALLROOM;
    case 1:
      return LARGEROOM;
    case 2:
      return VERTCORRIDOR;
    case 3:
      return HORIZCORRIDOR;
    default:
      return false;
  }
}

// searches for a wall.
function pickWall(map) {
  var i, j;
  do {
    i = Math.floor(Math.random() * map.length);
    j = Math.floor(Math.random() * map[i].length);
  } while (!isWall(map, [i, j]));
  return [i, j];
}

// checks if a new room fits at that index
// this isn't complete, needs to be fixed!
function doesFit(map, type, index, direction) {
  if (direction === NORTH) {
    if (index[0] - type.height >= 0 && index[1] + type.width < map[index[0]].length) {
      for (var i = index[0] - 1; i >= index[0] - type.height; i--) {
        for (var j = index[1]; j < index[1] + type.width; j++) {
          if (map[i][j] != FULL) return false;
        }
      }
    } else {
      return false;
    }
    return true;
  }
  if (direction === EAST) {
    if (index[0] + type.height < map.length && index[1] + type.width < map[index[0]].length) {
      for (var i = index[0]; i < index[0] + type.height; i++) {
        for (var j = index[1] + 1; j <= index[1] + type.width; j++) {
          if (map[i][j] != FULL) return false;
        }
      }
    } else {
      return false;
    }
    return true;
  }
  if (direction === SOUTH) {
    if (index[0] + type.height < map.length && index[1] + type.width < map[index[0]].length) {
      for (var i = index[0] + 1; i <= index[0] + type.height; i++) {
        for (var j = index[1]; j < index[1] + type.width; j++) {
          if (map[i][j] != FULL) return false;
        }
      }
    } else {
      return false;
    }
    return true;
  }
  if (direction === WEST) {
    if (index[0] + type.height < map.length && index[1] - type.width >= 0) {
      for (var i = index[0]; i < index[0] + type.height; i++) {
        for (var j = index[1] - 1; j >= index[1] - type.width; j--) {
          if (map[i][j] != FULL) return false;
        }
      }
    } else {
      return false;
    }
    return true;
  }
  return false;
}

// determines if current index is a wall.
// wall is defined as any non full space adjacent to a full space.
function isWall(map, index) {
  var i = index[0],
      j = index[1];
  if (map[i][j] == FULL) return false;
  if (i - 1 >= 0 && map[i - 1][j] === FULL) return true;
  if (i + 1 < map.length && map[i + 1][j] === FULL) return true;
  if (j + 1 < map[i].length && map[i][j + 1] === FULL) return true;
  if (j - 1 >= 0 && map[i][j - 1] === FULL) return true;
  return false;
}

// determines what direction facing wall.
function getDirection(map, index) {
  var i = index[0];
  var j = index[1];
  if (i - 1 >= 0 && map[i - 1][j] === FULL) return NORTH;
  if (j - 1 >= 0 && map[i][j - 1] === FULL) return WEST;
  if (j + 1 < map[i].length && map[i][j + 1] === FULL) return EAST;
  if (i + 1 < map.length && map[i + 1][j] === FULL) return SOUTH;
}

// dungeon generator
function generateDungeon(width, height, player, dungeon) {
  // initialize map with EARTH cells.
  var map = initDungeon(width, height);

  // create a room with center index.
  var center = [Math.floor(map.length / 2 - SMALLROOM.height / 2 - 1), Math.floor(map[0].length / 2 - SMALLROOM.width / 2)];
  createRoom(map, SMALLROOM, center, SOUTH);
  // create a new room until threshold is reached.
  var numRooms = 1;

  while (numRooms < threshold) {
    var success = false;
    var type, index, direction;
    while (!success) {
      index = pickWall(map);
      direction = getDirection(map, index);
      type = decideRoom();
      if (doesFit(map, type, index, direction)) success = true;
    }
    createRoom(map, type, index, direction);
    numRooms++;
  }

  // populate with player, enemies, items, weapons.
  populate(map, dungeon, player);
  return map;
}

// fill dungeon with player, enemies, items, weapons, etc.
function populate(map, dungeon, player) {
  // put enemies -- boss only on last floor.
  populateEnemies(map, dungeon);
  // put health items
  populateItems(map, dungeon);
  // put weapon -- one per floor.
  putWeapon(map, dungeon);
  // put portal -- one per floor.
  putPortal(map);
  // put player -- one per floor.  * store location of the player!
  putPlayer(map, player);
}

// util function to get random index.
function getRandomIndex(map) {
  var index = [];
  do {
    index = [Math.floor(Math.random() * map.length), Math.floor(Math.random() * map[0].length)];
  } while (map[index[0]][index[1]] !== EMPTY);
  return index;
}

function populateEnemies(map, dungeon) {
  var numberOfEnemies = 3 + 2 * dungeon;
  while (numberOfEnemies > 0) {
    // should create getRandomEmptyIndex function.
    var index = getRandomIndex(map);
    map[index[0]][index[1]] = new enemy(dungeon);
    numberOfEnemies--;
  }
  if (dungeon === 5) {
    // need to put boss.
    putBoss(map);
  }
}

function populateItems(map, dungeon) {
  var numberOfItems = 5 * dungeon;
  while (numberOfItems) {
    var index = getRandomIndex(map);
    map[index[0]][index[1]] = new item(dungeon);
    numberOfItems--;
  }
}

function putWeapon(map, dungeon) {
  var index = getRandomIndex(map);
  map[index[0]][index[1]] = new weapon(dungeon);
}

function putPortal(map) {
  var index = getRandomIndex(map);
  map[index[0]][index[1]] = PORTAL;
}

function putPlayer(map, player) {
  var index = getRandomIndex(map);
  map[index[0]][index[1]] = player;
}

function putBoss(map) {}
// needs four empty spaces in a shape of a square

// main view of game.
var DungeonView = React.createClass({
  displayName: "DungeonView",

  getInitialState: function getInitialState() {
    return {
      map: generateDungeon(width, height, new player(FIST, 0), 1),
      playerIndex: playerIndex,
      dungeon: 1
    };
  },
  render: function render() {
    console.log("view rendering.");
    return React.createElement(
      "div",
      { className: "row" },
      React.createElement(PlayerInfo, null),
      React.createElement(Map, { map: this.state.map })
    );
  }
});
// end DungeonView.

// shows health, weapon, level, etc.
var PlayerInfo = React.createClass({
  displayName: "PlayerInfo",

  render: function render() {
    return React.createElement(
      "div",
      { id: "PlayerInfo", className: "row" },
      React.createElement(
        "div",
        { className: "col-md-8" },
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "p",
            { className: "col-md-2" },
            "Health: "
          ),
          React.createElement(
            "p",
            { className: "col-md-2" },
            "Weapon: "
          ),
          React.createElement(
            "p",
            { className: "col-md-2" },
            "Attack: "
          ),
          React.createElement(
            "p",
            { className: "col-md-2" },
            "Level: "
          ),
          React.createElement(
            "p",
            { className: "col-md-2" },
            "Next Level: "
          ),
          React.createElement(
            "p",
            { className: "col-md-2" },
            "Dungeon: "
          )
        )
      ),
      React.createElement(
        "div",
        { className: "col-md-4" },
        React.createElement(
          "button",
          null,
          "Toggle Darkness"
        )
      )
    );
  }
});
// end of PlayerInfo.

// dungeon
var Map = React.createClass({
  displayName: "Map",

  render: function render() {
    var rows = [];
    for (var i = 0; i < this.props.map.length; i++) {
      var cells = [];
      for (var j = 0; j < this.props.map[i].length; j++) {
        cells.push(React.createElement(MapCell, {
          cell: this.props.map[i][j],
          key: i * j + j
        }));
      }
      rows.push(React.createElement(MapRow, { cells: cells, key: i }));
    }
    return React.createElement(
      "div",
      { className: "row" },
      React.createElement(
        "div",
        { className: "col-xs-12" },
        React.createElement(
          "table",
          { id: "Map" },
          React.createElement(
            "tbody",
            null,
            rows
          )
        )
      )
    );
  }
});
// end of dungeon map.

// row of dungeon cells.
var MapRow = React.createClass({
  displayName: "MapRow",

  render: function render() {
    return React.createElement(
      "tr",
      null,
      this.props.cells
    );
  }
});
// end of row.

// dungeon cell.
var MapCell = React.createClass({
  displayName: "MapCell",

  render: function render() {
    var color;
    if (typeof this.props.cell === 'number') {
      switch (this.props.cell) {
        case FULL:
          color = '#333';
          break;
        case EMPTY:
          color = '#fff';
          break;
        case PORTAL:
          color = '#c6f';
          break;
        default:
          color = '#000';
      }
    } else {
      switch (this.props.cell.name) {
        case 'PLAYER':
          color = 'blue';
          break;
        case 'ENEMY':
          color = 'red';
          break;
        case 'ITEM':
          color = '#0f3';
          break;
        case 'WEAPON':
          color = '#ff3';
          break;
        default:
          color = 'black';
      }
    }
    var css = {
      backgroundColor: color
    };
    return React.createElement(
      "td",
      null,
      React.createElement(
        "div",
        { style: css, "class": "cell" },
        " "
      )
    );
  }
});
// end of cell.

ReactDOM.render(React.createElement(DungeonView, null), document.getElementById('DungeonView'));
"use strict";

/*
  consider load factor as 
  terminating condition for 
  generating dungeon.
*/

// dimension of dungeon map.
var width = 100;
var height = 50;
var threshold = 130;

// room types.
var SMALLROOM = { height: 3, width: 3 };
var LARGEROOM = { height: 10, width: 10 };
var VERTCORRIDOR = { height: 10, width: 3 };
var HORIZCORRIDOR = { height: 3, width: 10 };
var typesOfRooms = 4;

// Dungeon map composed of any of the following.
var FULL = 0; // space that is non occupiable.
var EMPTY = 1; // space occupiable with nothing there.
var PLAYER = 2; // where player currently is standing.
var ENEMY = 3; // where enemy is standing.
var BOSS = 4; // special case enemy.
var ITEM = 5; // raises health.
var WEAPON = 6; // increases attack.

// direction facing wall.
var NORTH = 7;
var SOUTH = 8;
var EAST = 9;
var WEST = 10;

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

// dungeon generator
function generateDungeon(width, height) {
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

  return map;
}

// determines if current index is a wall.
// wall is defined as any non full space adjacent to a full space.
function isWall(map, index) {
  var i = index[0],
      j = index[1];
  if (map[i][j] == FULL) return false;
  if (i + 1 < map.length && map[i + 1][j] === FULL) return true;
  if (j + 1 < map[i].length && map[i][j + 1] === FULL) return true;
  if (i - 1 >= 0 && map[i - 1][j] === FULL) return true;
  if (j - 1 >= 0 && map[i][j - 1] === FULL) return true;
  return false;
}

// determines what direction facing wall.
function getDirection(map, index) {
  var i = index[0];
  var j = index[1];
  if (i - 1 >= 0 && map[i - 1][j] === FULL) return NORTH;
  if (j + 1 < map[i].length && map[i][j + 1] === FULL) return EAST;
  if (i + 1 < map.length && map[i + 1][j] === FULL) return SOUTH;
  if (j - 1 >= 0 && map[i][j - 1] === FULL) return WEST;
}

// main view of game.
var DungeonView = React.createClass({
  displayName: "DungeonView",

  getInitialState: function getInitialState() {
    return {
      map: generateDungeon(width, height),
      health: 100,
      attack: 7,
      level: 0,
      nextLevel: 60,
      dungeon: 0
    };
  },
  render: function render() {
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
      { className: "row" },
      React.createElement(
        "div",
        { id: "PlayerInfo", className: "col-md-8" },
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
    return React.createElement(
      "td",
      null,
      React.createElement(
        "div",
        { "class": "cell" },
        this.props.cell
      )
    );
  }
});
// end of cell.

ReactDOM.render(React.createElement(DungeonView, null), document.getElementById('DungeonView'));
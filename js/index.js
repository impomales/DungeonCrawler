"use strict";

/*
  consider load factor as 
  terminating condition for 
  generating dungeon.
*/

// dimension of dungeon map.
var width = 7;
var height = 5;

// room types.
var SMALLROOM = { height: 2, width: 2 };
var LARGEROOM = { height: 4, width: 4 };
var VERTCORRIDOR = { height: 4, width: 2 };
var HORIZCORRIDOR = { height: 2, width: 4 };

// Dungeon map composed of any of the following.
var FULL = 0; // space that is non occupiable.
var EMPTY = 1; // space occupiable with nothing there.
var PLAYER = 2; // where player currently is standing.
var ENEMY = 3; // where enemy is standing.
var BOSS = 4; // special case enemy.
var ITEM = 5; // raises health.
var WEAPON = 6; // increases attack.

// creates initial dungeon of just full spaces.
function initDungeon(width, height) {
  var map = [];
  for (var i = 0; i < width; i++) {
    var row = [];
    for (var j = 0; j < height; j++) {
      row.push(FULL);
    }
    map.push(row);
  }
  return map;
}

// creates a room at 2d-index of max width and height.
function createRoom(map, type, index) {
  for (var i = index[0]; i < index[0] + type.height; i++) {
    for (var j = index[1]; j < index[1] + type.width; j++) {
      console.log("hello");
      map[i][j] = EMPTY;
    }
  }
}

/* functions to be defined next time */
// randomly selects a type of room.
function decideRoom() {}

// searches for a wall.
function pickWall() {}

// checks if a new room fits at that index
function doesFit() {}

// dungeon generator
function generateDungeon() {}

// determines if current index is a wall.
// wall is defined as any non full space adjacent to a full space.
function isWall(map, index) {
  var i = index[0],
      j = index[1];
  if (map[i][j] == FULL) return false;
  if (i + 1 < map.length && map[i + 1][j] == FULL) return true;
  if (j + 1 < map[i].length && map[i][j + 1] == FULL) return true;
  if (i - 1 >= 0 && map[i - 1][j] == FULL) return true;
  if (j - 1 >= 0 && map[i][j - 1] == FULL) return true;
  return false;
}

// main view of game.
var DungeonView = React.createClass({
  displayName: "DungeonView",

  getInitialState: function getInitialState() {
    return {
      map: initDungeon(width, height),
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
      React.createElement(Map, null)
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
            React.createElement(
              "tr",
              null,
              React.createElement(
                "td",
                null,
                "test"
              ),
              React.createElement(
                "td",
                null,
                "data"
              )
            )
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

  render: function render() {}
});
// end of row.

// dungeon cell.
var MapCell = React.createClass({
  displayName: "MapCell",

  render: function render() {}
});
// end of cell.

ReactDOM.render(React.createElement(DungeonView, null), document.getElementById('DungeonView'));
'use strict';

// page should center on player position.

// dimension of dungeon map.
var width = 50;
var height = 25;
var threshold = 70;
var playerIndex_g = [];
var darkness = true;

// keyboard codes
var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;

// room types.
var SMALLROOM = {
  height: 2,
  width: 2
};
var LARGEROOM = {
  height: 4,
  width: 4
};
var VERTCORRIDOR = {
  height: 10,
  width: 1
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

function weaponString(type) {
  switch (type) {
    case FIST:
      return 'Fist';
    case STICK:
      return 'Stick';
    case MACE:
      return 'Mace';
    case AXE:
      return 'Axe';
    case KATANA:
      return 'Katana';
    case OATHKEEPER:
      return 'Oathkeeper';
    default:
      return 'err: invalid weapon';
  }
}

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

function player(weapon, level, nextLevel, hp) {
  this.name = "PLAYER";
  this.weapon = weapon;
  this.level = level;
  // set to default if zero.
  this.hp = hp === 0 ? setHp(level) : hp;
  this.attack = setAttack(this.weapon, this.level);
  this.nextLevel = nextLevel === 0 ? setNextLevel(this.level) : nextLevel;
  this.levelUp = function () {
    if (this.nextLevel > 0) return;
    this.level++;
    this.hp += setHp(this.level);
    this.attack = setAttack(this.weapon, this.level);
    this.nextLevel = setNextLevel(this.level);
  };
}

/* enemy object */
function enemy(dungeon, hp) {
  this.name = "ENEMY";
  this.hp = hp === 0 ? 100 * (dungeon - 1) + 100 : hp;
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
      this.health = 50;
      break;
    case 2:
      this.health = 75;
      break;
    case 3:
      this.health = 100;
      break;
    case 4:
      this.health = 150;
      break;
    case 5:
      this.health = 200;
      break;
    default:
      this.health = -1;
  }
}

/* functions for generation a dungeon floor */

// create a copy of current floor.
function copy(map, dungeon) {
  var copy = [];
  for (var i = 0; i < map.length; i++) {
    var row = [];
    for (var j = 0; j < map[i].length; j++) {
      if (typeof map[i][j] === 'number') row.push(map[i][j]);else {
        if (map[i][j].name === 'PLAYER') {
          var playerOld = map[i][j];
          row.push(new player(playerOld.weapon, playerOld.level, playerOld.nextLevel, playerOld.hp));
        } else if (map[i][j].name === 'ENEMY') {
          var enemyOld = map[i][j];
          row.push(new enemy(dungeon, enemyOld.hp));
        } else if (map[i][j].name === 'WEAPON') row.push(new weapon(dungeon));else if (map[i][j].name === 'ITEM') row.push(new item(dungeon));else console.log("error in copying map");
      }
    }
    copy.push(row);
  }
  return copy;
}

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
  if (dungeon < 5) putPortal(map);
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
    map[index[0]][index[1]] = new enemy(dungeon, 0);
    numberOfEnemies--;
  }
  if (dungeon === 5) {
    // need to put boss.
    putBoss(map);
  }
}

function populateItems(map, dungeon) {
  var numberOfItems = 5 - dungeon;
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
  playerIndex_g = [index[0], index[1]];
}

function putBoss(map) {}
// needs four empty spaces in a shape of a square

// moves player one step in direction.
function movePlayer(map, playerIndex, direction, dungeon) {
  var index = getNextSpace(map, playerIndex, direction);
  if (index === -1) return false;
  var nextSpace = map[index[0]][index[1]];
  // if wall return.
  if (nextSpace === FULL) return false;
  // if next space in direction empty, swap
  if (nextSpace === EMPTY) {
    map[index[0]][index[1]] = map[playerIndex[0]][playerIndex[1]];
    map[playerIndex[0]][playerIndex[1]] = EMPTY;
    playerIndex_g = [index[0], index[1]];
    return false;
  }
  // if next space in direction portal
  if (nextSpace === PORTAL) {
    return true;
  }
  // if next space in direction item or weapon
  if (nextSpace.name === 'ITEM' || nextSpace.name === 'WEAPON') {
    pickUp(map, playerIndex, index);
    return false;
  }
  // if next space in direction is enemy
  if (nextSpace.name === 'ENEMY') {
    fightEnemy(map, map[playerIndex[0]][playerIndex[1]], index);
  }

  // otherwise
  return false;
}

function getNextSpace(map, playerIndex, direction) {
  var i = playerIndex[0];
  var j = playerIndex[1];
  if (direction === LEFT) {
    if (j - 1 < 0) return -1;
    return [i, j - 1];
  } else if (direction === UP) {
    if (i - 1 < 0) return -1;
    return [i - 1, j];
  } else if (direction === RIGHT) {
    if (j + 1 >= map[i].length) return -1;
    return [i, j + 1];
  } else if (direction === DOWN) {
    if (i + 1 >= map.length) return -1;
    return [i + 1, j];
  } else return -1;
}

// handles picking up item or weapon.
function pickUp(map, playerIndex, index) {
  var nextSpace = map[index[0]][index[1]];
  var player = map[playerIndex[0]][playerIndex[1]];
  if (nextSpace.name === 'ITEM') {
    player.hp += nextSpace.health;
    map[index[0]][index[1]] = map[playerIndex[0]][playerIndex[1]];
    map[playerIndex[0]][playerIndex[1]] = EMPTY;
    playerIndex_g = [index[0], index[1]];
    return;
  }
  if (nextSpace.name === 'WEAPON') {
    player.weapon = nextSpace.type;
    player.attack = setAttack(player.weapon, player.level);
    map[index[0]][index[1]] = map[playerIndex[0]][playerIndex[1]];
    map[playerIndex[0]][playerIndex[1]] = EMPTY;
    playerIndex_g = [index[0], index[1]];
  }
}

// regenerates next level dungeon.
function enterPortal(dungeon, player) {
  var map = generateDungeon(width, height, player, dungeon);
  return map;
}

// battle
function fightEnemy(map, player, enemyIndex) {
  var enemy = map[enemyIndex[0]][enemyIndex[1]];
  var first, second;
  var attackFirst, attackSecond;

  var whoGoesFirst = Math.floor(Math.random() * 2);
  if (whoGoesFirst === 1) {
    // player goes first
    first = player;
    second = enemy;
  } else {
    first = enemy;
    second = player;
  }
  console.log(first);
  // attack randomly selected within range
  // object.attack - epsilon <= attack <= object.attack + epsilon
  // where epsilon is 25% of object.attack
  attackFirst = Math.random() * (0.5 * first.attack) + 0.75 * first.attack;
  attackSecond = Math.random() * (0.5 * second.attack) + 0.75 * first.attack;

  second.hp -= attackFirst;
  if (second.hp <= 0) {
    if (second.name === 'PLAYER') {
      // handleGameOver.
      gameOver();
    } else {
      // handleVictory.
      victory(map, player, enemyIndex);
    }
    return;
  }
  first.hp -= attackSecond;
  if (first.hp <= 0) {
    if (first.name === 'PLAYER') {
      // handleGameOver.
      gameOver();
    } else {
      // handleVictory.
      victory(map, player, enemyIndex);
    }
    return;
  }
}

// do some kind of popup and end game.
function gameOver() {
  console.log("Game Over! You lose!");
}

function victory(map, player, enemyIndex) {
  var enemy = map[enemyIndex[0]][enemyIndex[1]];
  player.nextLevel -= enemy.attack;
  if (player.nextLevel <= 0) {
    var carryOver = player.nextLevel;
    player.levelUp();
    player.nextLevel += carryOver;
  }
  map[enemyIndex[0]][enemyIndex[1]] = player;
  map[playerIndex_g[0]][playerIndex_g[1]] = EMPTY;
  playerIndex_g = [enemyIndex[0], enemyIndex[1]];
}

// main view of game.
var DungeonView = React.createClass({
  displayName: 'DungeonView',

  getInitialState: function getInitialState() {
    return {
      map: generateDungeon(width, height, new player(FIST, 0, 0, 0), 1),
      playerIndex: playerIndex_g,
      dungeon: 1
    };
  },
  handleKeyDown: function handleKeyDown(e) {
    var newMap = copy(this.state.map, this.state.dungeon);
    var dungeon = this.state.dungeon;
    var isNextDungeon = movePlayer(newMap, this.state.playerIndex, e.keyCode, dungeon);
    if (isNextDungeon) {
      dungeon++;
      newMap = enterPortal(dungeon, newMap[playerIndex_g[0]][playerIndex_g[1]]);
    }
    this.setState({
      map: newMap,
      playerIndex: playerIndex_g,
      dungeon: dungeon
    });
  },
  render: function render() {
    window.addEventListener('keydown', this.handleKeyDown, false);
    window.focus();
    var index = this.state.playerIndex;
    return React.createElement(
      'div',
      { className: 'row' },
      React.createElement(PlayerInfo, {
        player: this.state.map[index[0]][index[1]],
        dungeon: this.state.dungeon }),
      React.createElement(Map, { map: this.state.map })
    );
  }
});
// end DungeonView.

// shows health, weapon, level, etc.
var PlayerInfo = React.createClass({
  displayName: 'PlayerInfo',

  render: function render() {
    var weapon = weaponString(this.props.player.weapon);
    return React.createElement(
      'div',
      { id: 'PlayerInfo', className: 'row' },
      React.createElement(
        'div',
        { className: 'col-md-8' },
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'p',
            { className: 'col-md-2' },
            'Health: ',
            Math.floor(this.props.player.hp)
          ),
          React.createElement(
            'p',
            { className: 'col-md-2' },
            'Weapon: ',
            weapon
          ),
          React.createElement(
            'p',
            { className: 'col-md-2' },
            'Attack: ',
            this.props.player.attack
          ),
          React.createElement(
            'p',
            { className: 'col-md-2' },
            'Level: ',
            this.props.player.level
          ),
          React.createElement(
            'p',
            { className: 'col-md-2' },
            'Next Level: ',
            this.props.player.nextLevel
          ),
          React.createElement(
            'p',
            { className: 'col-md-2' },
            'Dungeon: ',
            this.props.dungeon
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'col-md-4' },
        React.createElement(
          'button',
          null,
          'Toggle Darkness'
        )
      )
    );
  }
});
// end of PlayerInfo.

// dungeon
var Map = React.createClass({
  displayName: 'Map',

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
      'div',
      { className: 'row' },
      React.createElement(
        'div',
        { className: 'col-xs-12' },
        React.createElement(
          'table',
          { id: 'Map' },
          React.createElement(
            'tbody',
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
  displayName: 'MapRow',

  render: function render() {
    return React.createElement(
      'tr',
      null,
      this.props.cells
    );
  }
});
// end of row.

// dungeon cell.
var MapCell = React.createClass({
  displayName: 'MapCell',

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
      'td',
      null,
      React.createElement(
        'div',
        { style: css, 'class': 'cell' },
        ' '
      )
    );
  }
});
// end of cell.

ReactDOM.render(React.createElement(DungeonView, null), document.getElementById('DungeonView'));
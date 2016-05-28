"use strict";

// main view of game.
var DungeonView = React.createClass({
  displayName: "DungeonView",

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
        { id: "PlayerInfo", className: "col-md-6" },
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
        { className: "col-md-6" },
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
          null,
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

ReactDOM.render(React.createElement(DungeonView, null), document.getElementById('DungeonView'));
'use strict';

class Game {
	constructor(window, canvas) {
		this.window = window;
		this.canvas = canvas;
		this.renderer = new Game.Renderer(window, canvas);
	}

	static init(window) {
		global.Game = new Game(window);
	}
}

Game.Renderer = require('./Renderer');

module.exports = Game;
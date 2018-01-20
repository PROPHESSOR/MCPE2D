'use strict';

class Game extends require('events').EventEmitter {
	constructor(window, canvas, JsMB) {
		super();
		this.window = window;
		this.canvas = canvas;
		this.jsmb = JsMB;
		this.modules = [];

		this.renderer = new Game.Renderer(window, canvas, JsMB);
		this.world = new Game.World('test', [1, 1, 1], this);

		this.init = this.init.bind(this);

		this.initEvents();
		setImmediate(this.init);

		this.world.save();
		this.world.render();
	}

	init() {
		console.log('init');
		this.initModules();
	}

	initEvents() {
		this.window.on('mousedown', (ev) => {
			this.emit('mousedown', ev.x, ev.y, ev);
		});

		this.window.on('mousemove', (ev) => {
			console.log('mousemove');
			this.emit('mousemove', ev.x, ev.y, ev);
		});
	}

	initModules() {
		const modules = require('./modules');

		for (const module of modules) {
			this.modules.push(module);
			try {
				require(`./modules/${module}`);
				console.log(`Module ${module} initialized!`);
			} catch (e) {
				console.error(`Unable to load module ${module}`,e);
			}
		}
	}

	static init(window, canvas, JsMB) {
		global.Game = new Game(window, canvas, JsMB);
	}
}

Game.Renderer = require('./Renderer');
Game.World = require('./World');

module.exports = Game;
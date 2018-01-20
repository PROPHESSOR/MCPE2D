'use strict';

class Renderer {
	constructor(window, canvas, JsMB) {
		this.window = window;
		this.canvas = canvas;
		this.jsmb = JsMB;
		this.ctx = canvas.getContext('2d');

		this.render = this.render.bind(this);
		this.renderWorld = this.renderWorld.bind(this);
		JsMB.fillScreen('black');
		this.render();
	}

	render() {
		this.window.getContext('2d').drawImage(this.canvas);
	}

	renderWorld(world) {
		this.jsmb.fillScreen('black');

		for (let i = 0; i < world.length; i += 3) {
			const blocks = require('./blocks');
			const block = new (require(`./blocks/${blocks[world[i]]}`))();

			block.render(this.jsmb, world[i + 1], world[i + 2]);
		}
		this.render();
	}
}

module.exports = Renderer;
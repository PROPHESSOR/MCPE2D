'use strict';

const fs = require('fs');

class World {
	constructor(name, world, Game) {
		this.worldname = name || 'unnamed';
		this.world = world || [];
		this.Game = Game;
	}

	save() {
		const buffer = Buffer.alloc(this.world.length);


		for (let i = 0; i < this.world.length; i += 3) {
			buffer.writeUInt8(this.world[i], i); // BlockID
			buffer.writeInt8(this.world[i + 1], i + 1); // X
			buffer.writeInt8(this.world[i + 2], i + 2); // Y
		}

		fs.writeFileSync(`worlds/${this.worldname}.mcpe2dworld`, buffer);
		console.log('World saved!');
	}

	load() {
		let buffer;

		try {
			buffer = fs.readFileSync(`worlds/${this.worldname}.mcpe2dworld`);
		} catch (e) {
			return new Error(`World "worlds/${this.worldname}.mcpe2dworld" doesn't exist!`);
		}

		this.world = [];

		for (let i = 0; i < buffer.length; i += 3) {
			this.world.push(
				buffer.readUInt8(i), // BlockID
				buffer.readInt8(i + 1), // X
				buffer.readInt8(i + 2) // Y
			);
		}

		this.render();
		console.log('World loaded!');
	}

	generate() {
		// TODO: Write me...
	}

	render() {
		this.Game.renderer.renderWorld(this.world);
	}

	static get EmptyWorld() {
		return new World('empty', []);
	}
}

module.exports = World;
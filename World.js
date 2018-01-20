'use strict';

const fs = require('fs');

class World {
	constructor(name, world, Game) {
		this.worldname = name || 'unnamed';
		this.world = world || [];
		this.Game = Game;
	}

	save() {
		const buffer = Buffer.from(this.world);

		fs.writeFileSync(`worlds/${this.worldname}.mcpe2dworld`, buffer);
	}

	load() {
		let buffer;

		try {
			buffer = fs.readFileSync(`worlds/${this.worldname}.mcpe2dworld`);
		} catch (e) {
			return new Error(`World "worlds/${this.worldname}.mcpe2dworld" doesn't exist!`);
		}

		for (let i = 0; i < buffer.length; i += 3) {
			this.world.push(
				buffer.readUInt8(i), // BlockID
				buffer.readInt8(i), // X
				buffer.readInt8(i) // Y
			);
		}
	}

	generate() {
		//
	}

	render() {
		this.Game.renderer.renderWorld(this.world);
	}

	static get EmptyWorld() {
		return new World('empty', []);
	}
}

module.exports = World;
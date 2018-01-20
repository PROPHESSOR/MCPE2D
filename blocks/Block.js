'use strict';

class Block {
	constructor({
		color = 'red',
		solid = true,
		obstacle = true,
		width = 10,
		height = 10
	} = {}) {
		this.color = color;
		this.solid = solid;
		this.obstacle = obstacle;
		this.width = width;
		this.height = height;
	}

	render(JsMB, x, y) {
		JsMB
			.setColor(this.color)
			.fillRect(x, y, this.width, this.height);
	}
}

module.exports = Block;
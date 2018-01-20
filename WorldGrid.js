// Copyright (c) 2018 PROPHESSOR
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';

class WorldGrid {
	constructor(size) {
		this.size = size;
	}

	round(x, y) {
		const topIndex = Math.floor(x / this.size);// * (JsMB.screenWidth() / this.size);
		const leftIndex = Math.floor(y / this.size);

		// return cells[topIndex + leftIndex];
		return [topIndex * this.size, leftIndex * this.size]; // TODO: Write me...
	}

	render() {
		JsMB.setColor('green');

		for (let col = 0; col <= JsMB.screenWidth(); col += this.size) {
			JsMB.drawLine(col, 0, col, JsMB.screenHeight());
		}

		for (let row = 0; row <= JsMB.screenHeight(); row += this.size) {
			JsMB.drawLine(0, row, JsMB.screenWidth(), row);
		}

		JsMB.repaint();
	}
}

module.exports = WorldGrid;
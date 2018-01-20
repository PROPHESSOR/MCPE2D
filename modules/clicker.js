// Copyright (c) 2018 PROPHESSOR
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';

let prevpos = [-10, -10];

Game.on('mousemove', (x, y) => {
	const {grid} = Game.world;

	// Game.world.render(); // Overload

	JsMB
		.setColor('black')
		.drawRect(...prevpos, grid.size, grid.size)
		.setColor('green')
		.drawRect(...grid.round(x, y), grid.size, grid.size)
		.repaint();

	if (prevpos !== grid.round(x, y)) prevpos = grid.round(x, y);
});

Game.on('click', (x, y) => {
	Game.world.world.push(1, ...Game.world.grid.round(x, y));
	Game.world.render();
});

Game.on('rightclick', () => {
	Game.world.save();
});

Game.on('middleclick', () => {
	Game.world.load();
	Game.world.render();
});

module.exports = true;
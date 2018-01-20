'use strict';

Game.on('click', (x, y) => {
	Game.world.world.push(1, x, y);
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
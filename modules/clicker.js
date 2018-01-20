'use strict';

Game.on('mousedown', (x, y) => {
	Game.world.world.push(1, x, y);
	Game.world.render();
});

module.exports = true;
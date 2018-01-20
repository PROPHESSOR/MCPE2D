'use strict';

class Renderer {
	constructor(window, canvas) {
		this.window = window;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
	}

	render() {
		this.window.getContext('2d').drawImage(this.canvas);
	}
}
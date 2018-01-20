// Copyright (c) 2018 PROPHESSOR
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';

global.$Config = {
	'type': 'api', // graphic/console/api
	'canvas_size': ['*', '*', false], // [x,y,вместить]
	'Debug_Mode': true,
	'name': 'Интерпретатор JsMobileBasic'
};

const JsMB = require('./MobileBasic');
const Canvas = require('canvas');

const Game = require('./Game');

const SIZE = [500, 300];

require('ntk').createClient((err, app) => {
	if (err) throw err;

	const mainWnd = app.createWindow({
		'width': SIZE[0],
		'height': SIZE[1],
		'title': 'MCPE2D'
	});
	const canvas = new Canvas(...SIZE);

	const ctx = canvas.getContext('2d');

	JsMB.__init(canvas);
	JsMB.ctx = ctx;
	JsMB.$JsMobileBasic.canvas = canvas;

	JsMB.repaint = () => {
		mainWnd.getContext('2d').drawImage(canvas)
		return JsMB;
	};

	global.JsMB = JsMB;

	setTimeout(() => Game.init(mainWnd, canvas, JsMB), 20);
	mainWnd.map();
});
// Copyright (c) 2018 PROPHESSOR
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';

const Block = require('./Block');

class Air extends Block {
	constructor() {
		super({
			'color': 'rgba(0,0,0,0)',
			'solid': true,
			'obstacle': false,
			'width': 10,
			'height': 10
		});
	}
}

module.exports = Air;
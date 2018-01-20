// Copyright (c) 2018 PROPHESSOR
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';

const Block = require('./Block');

class Stone extends Block {
	constructor() {
		super({
			'color': 'gray',
			'solid': true,
			'obstacle': true,
			'width': 10,
			'height': 10
		});
	}
}

module.exports = Stone;
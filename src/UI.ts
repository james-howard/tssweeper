import * as React from 'react';
import {createElement as h } from 'react';

import * as Game from './Game';

class GameUI extends React.Component {
    constructor(props:{}) {
        super(props);
        this.state = {
            game: new Game.Board(5, 6, 5),
        };
    }

    render() {
        return h('span', {}, "Hello World");
    }
}

export default GameUI;

import * as React from 'react';
import { createElement as h } from 'react';

import { GameState } from '../Game';
import { StatusButton } from './StatusButton';
import { StatusCounter} from './StatusCounter';
import { StatusTimer } from './StatusTimer';

interface StatusUIProps {
    gameState: GameState;
    start: number;
    duration: number;
    minesRemaining: number;
    mouseDown: boolean;
    onReinitialize: () => void;
}

class StatusUI extends React.PureComponent<StatusUIProps> {
    render() {
        let containerStyle:React.CSSProperties = {
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: '#BDBDBD'
        };

        return h('div', {style:containerStyle},
            h(StatusCounter, {value:this.props.minesRemaining}),
            
            h(StatusButton, {
                gameState:this.props.gameState,
                mouseDown:this.props.mouseDown,
                onReinitialize:this.props.onReinitialize
            }),
            
            this.props.duration ?
            h(StatusCounter, {value:Math.round(this.props.duration/1000.0)%1000}) :
            h(StatusTimer, {
                startTimestamp:this.props.start
            })
        );
    }
}

export { StatusUI, StatusUIProps };

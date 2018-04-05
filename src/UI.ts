import * as React from 'react';
import {createElement as h } from 'react';

import * as Game from './Game';

import './UI.css';

const CellSize = 24;

interface CellUIProps {
    cell: Game.Cell;
    disabled: boolean;
    onReveal: () => void;
    onFlag: () => void;
}

class CellUI extends React.PureComponent<CellUIProps> {
    mouseClicked(evt:MouseEvent) {
        let cell = this.props.cell;
        if ((cell & Game.Cell.REVEALED) === 0 && (cell & Game.Cell.FLAGGED) === 0) {
            this.props.onReveal();
        }
    }

    mouseRightClicked(evt:MouseEvent) {
        let cell = this.props.cell;
        if ((cell & Game.Cell.REVEALED) === 0) {
            this.props.onFlag();
        }
        evt.preventDefault();
    }

    render() {
        // we're in one of 3 states:
        // Revealed, showing contents
        // Unrevealed, unpressed
        // Unrevealed, pressed
        
        let revealed = (this.props.cell & Game.Cell.REVEALED) !== 0;
        let flagged = (this.props.cell & Game.Cell.FLAGGED) !== 0;

        let contents:string = '';
        if (flagged) {
            contents = '⚑';
        } else if (revealed) {
            let count = Game.AdjacentMineCount(this.props.cell);
            switch (count) {
                case 0: 
                    contents = '';
                    break;
                case 9:
                    contents = '☀︎';
                    break;
                default:
                    contents = `${count}`;
            }
        }

        let className = 'Cell';
        if (revealed) {
            className += ' CellRevealed';
        } else {
            className += ' CellUnrevealed';
        }
        
        return h('button', { 
            className,
            disabled: this.props.disabled,
            onClick: this.mouseClicked.bind(this),
            onContextMenu: this.mouseRightClicked.bind(this),
        }, contents);
    }
}

type CellUIAction = (x:number, y:number) => void;
interface BoardUIProps {
    board: Game.Board;
    onToggleFlag: CellUIAction;
    onReveal: CellUIAction;
}

class BoardUI extends React.PureComponent<BoardUIProps> {
    render() {
        let cellElements:React.ComponentElement<CellUIProps, CellUI>[] = [];
        let board = this.props.board;
        for (let y = 0; y < board.height; y++) {
            for (let x = 0; x < board.width; x++) {
                let onFlag = () => {
                    this.props.onToggleFlag(x, y);
                };
                let onReveal = () => {
                    this.props.onReveal(x, y);
                };
                let cell = h(CellUI, { 
                    cell:board.cellAt(x, y),
                    disabled: board.state !== Game.GameState.IN_PROGRESS,
                    onFlag,
                    onReveal,
                    key: `${x}.${y}`,
                });
                cellElements.push(cell);
            }
        }

        let containerStyle:React.CSSProperties = {
            display: 'grid',
            gridTemplateColumns: `repeat(${board.width}, ${CellSize}px)`,
            gridTemplateRows: `repeat(${board.height}, ${CellSize}px)`,
            cursor: 'default'
        };
        let container = h('div', {style: containerStyle, className:'Grid'}, cellElements);

        return container;
    }
}

interface StatusCounterProps {
    value: number;
}

class StatusCounter extends React.PureComponent<StatusCounterProps> {
    render() {
        let style:React.CSSProperties = {
            backgroundColor: 'black',
            color: 'red',
            fontFamily: 'fixed',
            fontSize: '18px'
        };
        // lame version of printf("%03d", value)
        let sign = this.props.value < 0;
        let v = Math.abs(this.props.value);
        let s = '' + v;
        if (v < 10) { 
            s = "00" + v; 
        } else if (v < 100) { 
            s = "0" + v; 
        }
        s = sign ? "-" + s : s;
        return h('span', {style}, s);
    }
}

interface StatusTimerProps {
    startTimestamp: number;
}
class StatusTimer extends React.PureComponent<StatusTimerProps> {
    private timer:number;

    render() {
        let value:number = 0;
        if (this.props.startTimestamp) {
            value = Math.round((performance.now() - this.props.startTimestamp)/1000.0) % 1000;
        }
        return h(StatusCounter, {value});
    }

    tick() {
        this.forceUpdate();
    }

    componentDidMount() {
        this.timer = window.setInterval(this.tick.bind(this), 1000);
    }

    componentWillUnmount() {
        if (this.timer) {
            window.clearInterval(this.timer);
            delete this.timer;
        }
    }
}

interface StatusButtonProps {
    gameState: Game.GameState;
    mouseDown: boolean;
    onReinitialize: () => void;
}

class StatusButton extends React.PureComponent<StatusButtonProps> {
    render() {
        let content:string;
        switch (this.props.gameState) {
            case Game.GameState.IN_PROGRESS:
                content = this.props.mouseDown ? '🤔' : '🙂';
                break;
            case Game.GameState.LOST:
                content = '😵';
                break;
            case Game.GameState.WON:
                content = '😎';
                break;
            default:
                content = '😶';
                break;
        }
        return h('button', {onClick:this.props.onReinitialize}, content);
    }
}

interface StatusUIProps {
    gameState: Game.GameState;
    start: number;
    duration: number;
    minesRemaining: number;
    mouseDown: boolean;
    onReinitialize: () => void;
}

class StatusUI extends React.PureComponent<StatusUIProps> {
    render() {
        return h('div', {},
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

interface GameUIProps extends BoardUIProps {
    start: number;
    duration: number;
    onReinitialize: (width:number, height:number, mineCount:number) => void;
}

class GameUI extends React.Component<GameUIProps> {
    playAgain() {
        this.props.onReinitialize(this.props.board.width, this.props.board.height, this.props.board.mineCount);
    }

    render() {
        let board:Game.Board = this.props.board;
        let statusProps:StatusUIProps = {
            gameState: board.state,
            start: this.props.start,
            duration: this.props.duration,
            minesRemaining: this.props.board.mineCount - this.props.board.flagCount,
            mouseDown: false, /* FIXME */
            onReinitialize: this.playAgain.bind(this)
        };
        let boardProps:BoardUIProps = {
            board: this.props.board,
            onToggleFlag: this.props.onToggleFlag,
            onReveal: this.props.onReveal
        };
        return h('div', {},
            h(StatusUI, statusProps),
            h(BoardUI, boardProps)
        );
    }
}

export default GameUI;

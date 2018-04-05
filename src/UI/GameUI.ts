import * as React from 'react';
import { createElement as h } from 'react';

import * as Game from '../Game';

import { BoardUI, BoardUIProps } from './BoardUI';
import { StatusUI, StatusUIProps } from './StatusUI';
import { BoardSizeUI, BoardSizeUIProps } from './BoardSizeUI';

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
        let sizeProps:BoardSizeUIProps = {
            width: this.props.board.width,
            height: this.props.board.height,
            onReinitialize: this.props.onReinitialize
        };
        let containerStyle:React.CSSProperties = {
            width: BoardUI.pixelWidthFromBoardWidth(board.width) + 'px',
            border: '1px solid #333'
        };
        return h('div', {style:containerStyle},
            h(StatusUI, statusProps),
            h(BoardUI, boardProps),
            h(BoardSizeUI, sizeProps)
        );
    }
}

export default GameUI;

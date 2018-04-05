/* Provides a Redux interface to the Game model */

import * as Redux from 'redux';

import * as Game from './Game';

interface GameStore {
    board: Game.Board;
    start: number;
    duration: number;
}

/* 
I'm doing something a little different with Redux here than is typically done
in ES6 code.

Typically, our dispatched redux actions are of the form { type:string, ... }, and
we have that here as well. 

What's different is that I'm defining explicit classes for each type of action that
can be dispatched on the store. The advantage of doing this is we get strong-typing
on our actions, and it makes it impossible to mess up and mismatch the payload and
the type.
*/
class GameEvent extends Object {
    constructor(public type:string) {
        super();
     }
}

class InitializeEvent extends GameEvent {
    static readonly Type = "Initialize";
    constructor(public width:number, public height:number, public mineCount:number) { 
        super(InitializeEvent.Type);
    }
}

abstract class CoordinateEvent extends GameEvent {
    constructor(type:string, public x:number, public y:number) { 
        super(type);
    }
}

class ToggleFlagEvent extends CoordinateEvent {
    static readonly Type = "ToggleFlag";
    constructor(x:number, y:number) {
        super(ToggleFlagEvent.Type, x, y);
    }
}

class RevealEvent extends CoordinateEvent {
    static readonly Type = "RevealEvent";
    constructor(x:number, y:number) {
        super(RevealEvent.Type, x, y);
    }
}

function gameReducer(state:GameStore, rawEvent:GameEvent): GameStore {
    switch (rawEvent.type) {
        case InitializeEvent.Type: {
            let event = rawEvent as InitializeEvent;
            return { 
                board: new Game.Board(event.width, event.height, event.mineCount), 
                start: 0, 
                duration: 0 
            };
        }
        case ToggleFlagEvent.Type: {
            let event = rawEvent as ToggleFlagEvent;
            return Object.assign({}, state, { 
                board: state.board.clone().toggleFlag(event.x, event.y) 
            });
        }
        case RevealEvent.Type: {
            let event = rawEvent as RevealEvent;
            let nextBoard = state.board.clone().reveal(event.x, event.y);
            let nextStart = state.start || performance.now();
            let nextDuration = state.duration || 
                nextBoard.state === Game.GameState.LOST ?
                    performance.now() - nextStart :
                    0;
            return Object.assign({}, state, { 
                board: nextBoard, 
                start: nextStart,
                duration: nextDuration
            });
        }
        default:
            return { board: new Game.Board(6, 6, 5), start: 0, duration: 0 };
    }
}

let store = Redux.createStore(gameReducer);

export { store, GameStore, GameEvent, InitializeEvent, ToggleFlagEvent, RevealEvent };

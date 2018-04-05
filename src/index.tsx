import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';

import * as Store from './Store';
import GameUI from './UI';

let GameContainer = ReactRedux.connect(
  /* state => props */
  (state:Store.GameStore) => { 
      return { board: state.board }; 
  },
  /* dispatch => props */
  (dispatch:Redux.Dispatch<Store.GameEvent>) => {
      return { 
          onReinitialize: (width:number, height:number, mineCount:number) => {
              dispatch(new Store.InitializeEvent(width, height, mineCount));
          },
          onToggleFlag: (x:number, y:number) => {
              dispatch(new Store.ToggleFlagEvent(x, y));
          },
          onReveal: (x:number, y:number) => {
              dispatch(new Store.RevealEvent(x, y));
          }
      };
  }
)(GameUI);

let GameProvider = (
<ReactRedux.Provider store={Store.store}>
  <GameContainer />
</ReactRedux.Provider>);

ReactDOM.render(
  GameProvider,
  document.getElementById('root') as HTMLElement
);

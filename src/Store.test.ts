import * as GameStore from './Store';

it('initializes', () => {
    expect(GameStore.store.getState().board.width).toBeGreaterThan(0);
});

it('re-initializes', () => {
    GameStore.store.dispatch(new GameStore.InitializeEvent(3, 3, 1));
    expect(GameStore.store.getState().board.width).toBe(3);
});

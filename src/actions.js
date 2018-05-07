// @flow

export const SHOW_CARD_POPUP = 'SHOW_CARD_POPUP';
export const DISMISS_CARD_POPUP = 'DISMISS_CARD_POPUP';
export const MOVE_CARD = 'MOVE_CARD';
export const UPDATE_CARD = 'UPDATE_CARD';
export const ADD_CARD = 'ADD_CARD';
export const ADD_LIST = 'ADD_LIST';

export function showCardPopup(cardId: string) {
  return {
    type: SHOW_CARD_POPUP,
    cardId,
  };
}

export function dismissCardPopup() {
  return {
    type: DISMISS_CARD_POPUP,
  };
}

export function moveCard(cardId: string, listId: string, nextCardId: ?string) {
  return {
    type: MOVE_CARD,
    cardId,
    listId,
    nextCardId,
  };
}

export function updateCard(cardId: string, propertyName: string, value: any) {
  return {
    type: UPDATE_CARD,
    cardId,
    propertyName,
    value,
  };
}

export function addCard(listId: string, cardTitle: string) {
  return {
    type: ADD_CARD,
    listId,
    cardTitle,
  };
}

export function addList(listTitle: string) {
  return {
    type: ADD_LIST,
    listTitle,
  };
}
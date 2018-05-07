// @flow

import { createStore, applyMiddleware } from 'redux';
import type { CardData, ListData, State } from './types';
import * as actions from './actions';
import createLogger from 'redux-logger';

function makeCards(cardLists: string[][]): $Shape<State> {
  const cards: {[id: string]: CardData} = {};
  const lists: {[id: string]: ListData} = {};
  let nextCardId = 1;
  let nextListId = 1;
  for (let list of cardLists) {
    const cardIds: string[] = [];
    const listId = (nextListId++) + "";
    for (let text of list) {
      const id = (nextCardId++) + "";
      cards[id] = {id, listId, text, description: ''};
      cardIds.push(id);
    }
    lists[listId] = {id: listId, title: `list ${listId}`, cardIds};
  }
  return {cards, lists, nextCardId, nextListId};
}

const cardData = [
  ["add a database to this thing", "hello", "there", "world"],
  ["another", "list", "of cards"],
  ["this is a test", "this is a card with a longer bit of text to go with it"],
  ["dog", "cat", "v0.3.4"],
  ["random", "words", "to play with"],
  ["sentence", "last", "flask"],
];

const initialState = {
  ...makeCards(cardData),
  popup: null,
}

function addCardToList(card: CardData, list: ListData, beforeCardId: string): ListData {
  const cardIds = [];
  let inserted = false;
  for (let i = 0; i < list.cardIds.length; i++) {
    if (list.cardIds[i] === beforeCardId) {
      cardIds.push(card.id);
      inserted = true;
    }
    cardIds.push(list.cardIds[i]);
  }
  if (!inserted) {
    cardIds.push(card.id);
  }
  return {
    ...list,
    cardIds,
  };
}

function removeCardFromList(card: CardData, list: ListData): ListData {
  return {
    ...list,
    cardIds: list.cardIds.filter((cardId) => cardId !== card.id),
  };
}

function putCardInList(card: CardData, list: ListData): CardData {
  return {
    ...card,
    listId: list.id,
  };
}

function moveCard(state: State, action): State {
  const card: CardData = state.cards[action.cardId];
  const fromList: ListData = state.lists[card.listId];
  const toList: ListData = state.lists[action.listId];
  const nextCardId = action.nextCardId;
  const fromListWithoutCard = removeCardFromList(card, fromList);
  const toListWithCard = addCardToList(card, removeCardFromList(card, toList), nextCardId);
  return {
    ...state,
    lists: {
      ...state.lists,
      [fromListWithoutCard.id]: fromListWithoutCard,
      [toListWithCard.id]: toListWithCard,
    },
    cards: {...state.cards, [card.id]: putCardInList(card, toList)},
  };
}

function addNewCard(state: State, listId: string, cardText: string): State {
  const newCard: CardData = {
    id: state.nextCardId + "",
    listId: listId,
    text: cardText,
    description: '',
  };
  const list: ListData = state.lists[listId];
  const updatedList: ListData = addCardToList(newCard, list, "");
  return {
    ...state,
    cards: {...state.cards, [newCard.id]: newCard},
    lists: {...state.lists, [updatedList.id]: updatedList},
    nextCardId: state.nextCardId + 1,
  };
}

function addNewList(state: State, listTitle: string): State {
  const newList: ListData = {
    id: state.nextListId + "",
    title: listTitle,
    cardIds: [],
  };
  return {
    ...state,
    lists: {...state.lists, [newList.id]: newList},
    nextListId: state.nextListId + 1,
  };
}

function reducer(state: State = initialState, action) {
  switch (action.type) {
    case actions.SHOW_CARD_POPUP:
      return {...state, popup: action.cardId};
    case actions.DISMISS_CARD_POPUP:
      return {...state, popup: null};
    case actions.MOVE_CARD:
      return moveCard(state, action);
    case actions.UPDATE_CARD:
      const card: CardData = state.cards[action.cardId];
      const newCard = {...card, [action.propertyName]: action.value};
      return {...state, cards: {...state.cards, [newCard.id]: newCard}};
    case actions.ADD_CARD:
      return addNewCard(state, action.listId, action.cardTitle);
    case actions.ADD_LIST:
      return addNewList(state, action.listTitle);
    default:
      return state;
  }
}

export const store = createStore(reducer, applyMiddleware(createLogger()));

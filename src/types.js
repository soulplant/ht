// @flow

/** A card. */
export type CardData = {
  id: string,
  text: string,
  listId: string,
  description: string,
}

/** A list of cards. */
export type ListData = {
  id: string,

  /** Title of this list. */
  title: string,

  /** Cards in this list in order. */
  cardIds: string[],
}

/** The state of the app. */
export type State = {
  /** Cards by id. */
  cards: {[id: string]: CardData},

  /** Lists by id. */
  lists: {[id: string]: ListData},

  /** Id of a card to show in a popup. */
  popup: ?string,

  /** Id to use for the next created card. */
  nextCardId: number,

  /** Id to use for the next created list. */
  nextListId: number,
}

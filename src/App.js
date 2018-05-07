// @flow

import React, { Component } from 'react';
import './App.css';
import Dragula from 'react-dragula';
import './Dragula.css';
import { connect } from 'react-redux';
import * as actions from './actions';
import type { State  } from './types';
import { store } from './store';

const cardDrake = Dragula();

cardDrake.on('drop', (el, target, source, sibling) => {
  cardDrake.cancel(true);
  store.dispatch(actions.moveCard(el.id, target.id, sibling ? sibling.id : null));
});

const listDrake = Dragula({
  moves: function (el: Element, container, handle) {
    return handle.classList.contains('list-drag-bar');
  },
  direction: 'horizontal',
});

listDrake.on('drop', (el, target, source, sibling) => {
  console.log('drop', el, target, source, sibling);
  console.log('dropped onto', '(root)');
  console.log('before', sibling ? sibling.id : null);
});

const CardView = (props) => (
  <div id={props.id} className="card" onClick={props.handleClick}>[{props.id}] {props.text}</div>
);

const Card = connect(
  (state: State, props) => ({
    ...state.cards[props.id],
  }),
  (dispatch, props) => ({
    handleClick: () => {
      dispatch(actions.showCardPopup(props.id));
    }
  }),
)(CardView);

/** An <input type="text" /> that calls props.onSubmit() and clears itself when enter is pressed. */
class TextInput extends Component {
  inputValue = '';
  elem = null;

  bindInputField(elem) {
    this.elem = elem;
  }

  onChange(event) {
    this.inputValue = event.target.value;
  }

  onKeyPress(event) {
    if (event.key === 'Enter' && this.inputValue.length > 0) {
      this.props.onSubmit(this.inputValue);
      if (this.elem != null) {
        this.elem.value = '';
        this.inputValue = '';
      }
    }
  }

  render() {
    return (
      <input
        ref={this.bindInputField.bind(this)}
        type="text"
        onChange={this.onChange.bind(this)}
        onKeyPress={this.onKeyPress.bind(this)}>
      </input>
    );
  }
}

class CardListView extends Component {
  render() {
    return (
      <div id={this.props.id} className="card-list-container">
        <h2 className="list-drag-bar">{this.props.title}</h2>
        <div id={this.props.id} className="card-list" ref={this.dragulaDecorator}>
          {this.props.cardIds.map((cardId) => <Card key={cardId} id={cardId} />)}
        </div>
        <TextInput onSubmit={this.props.onNewCard} />
      </div>
    );
  }

  dragulaDecorator = (elem: Element) => {
    if (!elem) {
      return;
    }
    cardDrake.containers.push(elem);
  }
}

const CardList = connect(
  (state: State, props) => ({
    ...state.lists[props.id],
  }),
  (dispatch, props) => ({
    onNewCard: (cardTitle: string) => {
      dispatch(actions.addCard(props.id, cardTitle));
    }
  }),
)(CardListView);

function PopupView(props) {
  // Stops clicks on the popup itself from bubbling up and dismissing the popup.
  function handlePopupClick(event: Event) {
    event.stopPropagation();
  }
  if (!props.visible) {
    return <span></span>;
  }
  return (
    <div onClick={props.dismissPopup} className="popup-container">
      <div className="popup" onClick={handlePopupClick}>
        <CardDetails id={props.cardId} />
      </div>
    </div>
  );
}

const Popup = connect(
  (state: State, props) => ({
    visible: state.popup != null,
    cardId: state.popup || "nothing",
  }),
  (dispatch, props) => ({
    dismissPopup: () => {
      dispatch(actions.dismissCardPopup());
    }
  })
)(PopupView);

const CardDetailsView = (props) => {
  function onChangeDescription(event) {
    props.onChange('description', event.target.value);
  }
  return (
    <div className="card-details">
      <h1>{props.text}</h1>
      <textarea defaultValue={props.description} onChange={onChangeDescription}></textarea>
      <p>{JSON.stringify(props)}</p>
    </div>
  );
}

const CardDetails = connect(
  (state: State, props) => ({
    ...state.cards[props.id],
  }),
  (dispatch, props) =>({
    onChange: (propertyName: string, value: any) => {
      dispatch(actions.updateCard(props.id, propertyName, value));
    }
  }),
)(CardDetailsView);

const AddNewListView = (props) => (
  <div className="card-list-container">
    <h2 style={{color: "white"}}>For Spacing</h2>
    <TextInput onSubmit={props.addNewList} />
  </div>
);

const AddNewList = connect(
  (state: State, props) => ({}),
  (dispatch, props) => ({
    addNewList: (listTitle: string) => {
      dispatch(actions.addList(listTitle));
    }
  }),
)(AddNewListView);

class AppView extends Component {
  render() {
    return (
      <div className="app">
        <div className="card-lists" ref={this.dragulaDecorator}>
          {this.props.listIds.map((listId) => <CardList key={listId} id={listId} />)}
          <AddNewList />
        </div>
        <Popup />
      </div>
    );
  }

  dragulaDecorator = (elem: Element) => {
    if (!elem) {
      return;
    }
    listDrake.containers.push(elem);
  }
}

const App = connect(
  (state: State, props) => ({
    listIds: Object.keys(state.lists),
  }),
  (dispatch, props) => ({}),
)(AppView);

export default App;

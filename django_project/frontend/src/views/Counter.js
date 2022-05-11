/**
 * This is for state example
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import T from 'prop-types';

import { decreaseCounter, increaseCounter } from '../redux/actions'
import BaseApp from '../App';


class Counter extends Component {
  render() {
    const { counter, increaseCounter, decreaseCounter } = this.props;
    return (
      <BaseApp className='page__counter'>
        <h1>{counter}</h1>
        <button onClick={increaseCounter}>
          Increase
        </button>
        <button onClick={decreaseCounter}>
          Decrease
        </button>
      </BaseApp>
    );
  }
}

Counter.propTypes = {
  increaseCounter: T.func,
  decreaseCounter: T.func,
  counter: T.number
};

function mapStateToProps(state, props) {
  return {
    counter: state.counter.value
  };
}

function dispatcher(dispatch) {
  return {
    increaseCounter: (...args) => dispatch(increaseCounter(...args)),
    decreaseCounter: (...args) => dispatch(decreaseCounter(...args)),
  };
}

export default connect(
  mapStateToProps,
  dispatcher
)(Counter);

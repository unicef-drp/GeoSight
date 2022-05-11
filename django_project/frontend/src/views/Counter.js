/**
 * This is for state example
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../redux/actions/actions'
import App, { render } from '../App';


function Counter() {
  const { value } = useSelector(state => state.counter);
  const dispatch = useDispatch();

  return (
    <App className='page__counter'>
      <h1>{value}</h1>
      <button onClick={() => dispatch(Actions.Counter.increaseCounter())}>
        Increase
      </button>
      <button onClick={() => dispatch(Actions.Counter.decreaseCounter())}>
        Decrease
      </button>
    </App>
  );
}

render(Counter)
import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

const delayedCounter = createAsyncThunk('counter/delayed', async () => {
  return await new Promise((resolve) => {
    resolve(Math.random());
  });
});

/**
 * This is a reducer - a function that takes a current state value and an
 * action object describing "what happened", and returns a new state value.
 * A reducer's function signature is: (state, action) => newState
 *
 * The Redux state should contain only plain JS objects, arrays, and primitives.
 * The root state value is usually an object.  It's important that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * You can use any conditional logic you want in a reducer. In this example,
 * we use a switch statement, but it's not required.
 */
const counterSlice = createSlice({
  initialState: {
    value: 0,
    random: '-',
  },
  name: 'counter',
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(delayedCounter.fulfilled, (state, action) => {
      console.log(action);
      // Add user to the state array
      state.random = action.payload;
    });
  },
});

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = configureStore({
  reducer: { counter: counterSlice.reducer },
});

const { increment, decrement } = counterSlice.actions;
// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// There may be additional use cases where it's helpful to subscribe as well.
store.subscribe(onSubscribe);

// UI
const buttonElement = document.querySelector('#js-increment');
const buttonRandomElement = document.querySelector('#js-random');

const incrementElement = document.querySelector('#js-increment-value');
const randomElement = document.querySelector('#js-random-value');
const initialState = store.getState();

incrementElement.textContent = initialState.counter.value;
randomElement.textContent = initialState.counter.random;

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
buttonElement.addEventListener('click', () => {
  store.dispatch(increment());
});

buttonRandomElement.addEventListener('click', () => {
  store.dispatch(delayedCounter());
});

function onSubscribe() {
  const {
    counter: { value, random },
  } = store.getState();
  incrementElement.textContent = value;
  randomElement.textContent = random;
}

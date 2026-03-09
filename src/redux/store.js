import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './actions/loginAction';
const store = configureStore({
  reducer: {
    login : loginReducer
  },
});

export default store;
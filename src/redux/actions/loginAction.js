import Toast from 'react-native-toast-message';
import axiosInstance from '../../config/axios';

// Action Types
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';


// LOGIN ACTION
export const loginUser = (email, password) => async dispatch => {

  dispatch({ type: LOGIN_REQUEST });

  try {

    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });

    const user = response.data.user;
    const token = response.data.token;

    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user, token },
    });

    return {
      success: true,
      status: response.status,
      data: response.data
    };

  } catch (error) {

    const errorMsg = error.response?.data?.message || 'Something went wrong';

    dispatch({
      type: LOGIN_FAILURE,
      payload: errorMsg,
    });

    return {
      success: false,
      status: error.response?.status,
      data: error.response?.data
    };
  }
};


// LOGOUT ACTION
export const logoutUser = () => dispatch => {
  dispatch({ type: LOGOUT });
   Toast.show({
            type: 'success',
            text1: 'Logout Successful',
          });
};


// INITIAL STATE
const initialState = {
  loading: false,
  user: null,
  token: null,
  error: null,
};


// REDUCER
const loginReducer = (state = initialState, action) => {

  switch (action.type) {

    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case LOGOUT:
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        error: null,
      };

    default:
      return state;
  }
};

export default loginReducer;
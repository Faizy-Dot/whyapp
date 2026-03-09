import axiosInstance from '../../config/axios';

// Action Types
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

// Action Creator (Thunk)
export const loginUser = (email, password) => async dispatch => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });

    console.log("res from redux == >", response)

    if (response.status === 200) {
      const user = response.data.user;
      const token = response.data.token;

      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user, token },
      });
      return { success: true, user, token };
    } else {
      dispatch({
        type: LOGIN_FAILURE,
        payload: response.data.message || 'Login failed',
      });
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Something went wrong';
    dispatch({
      type: LOGIN_FAILURE,
      payload: errorMsg,
    });
  }
};


const initialState = {
  loading: false,
  user: null,
  token: null,
  error: null,
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default loginReducer;

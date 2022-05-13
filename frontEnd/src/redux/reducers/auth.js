import { auth_types } from '../types';

const init_state = {
  id: 0,
  username: '',
  email: '',
  full_name: '',
  bio: '',
  image_url: '',
  is_verified: '',
  errorMsg: '',
};

export const auth_reducer = (state = init_state, action) => {
  if (action.type === auth_types.LOGIN_USER) {
    return {
      ...state,
      // username: action.payload.username,
      username: action.payload.username,
      email: action.payload.email,
      full_name: action.payload.full_name,
      id: action.payload.id,
      bio: action.payload.bio,
      image_url: action.payload.image_url,
      is_verified: action.payload.is_verified,
      errorMsg: '',
    };
  } else if (action.type === auth_types.LOGOUT_USER) {
    return init_state;
  } else if (action.type === auth_types.EDIT_USER) {
    return {
      ...state,
      username: action.payload.username,
      full_name: action.payload.full_name,
      id: action.payload.id,
      bio: action.payload.bio,
      image_url: action.payload.image_url,
      is_verified: action.payload.is_verified,
    };
  }

  return state;
};
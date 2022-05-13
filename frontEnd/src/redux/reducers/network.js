import { network_types } from '../types';

const init_state = {
  errorMessage: '',
  errorTitle: '',
};

export const network_reducer = (state = init_state, action) => {
  if (action.type === network_types.NETWORK_ERROR) {
    return {
      ...state,
      errorMessage: action.payload.description,
      errorTitle: action.payload.title,
    };
  } else if (action.type === network_types.NETWORK_RESET) {
    return init_state;
  }
  return state;
};
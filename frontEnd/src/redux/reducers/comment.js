import { comment_types } from '../types';

const init_state = {
  commentList: [],
};

export const comment_reducer = (state = init_state, action) => {
  if (action.type === comment_types.FETCH_COMMENT) {
    return {
      ...state,
      commentList: action.payload,
    };
  } else if (action.type === comment_types.CREATE_COMMENT)
    return {
      ...state,
      commentList: [...action.payload, ...state.commentList],
    };
  return state;
};
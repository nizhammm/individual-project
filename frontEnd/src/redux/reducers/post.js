import { post_types } from '../types';

const init_state = {
  postList: [],
};

export const post_reducer = (state = init_state, action) => {
  if (action.type === post_types.FETCH_POST) {
    return {
      ...state,
      postList: action.payload,
    };
  } else if (action.type === post_types.UPDATE_POST) {
    return {
      ...state,
      postList: [...state.postList, ...action.payload],
    };
  } else if (action.type === post_types.NEW_POST) {
    return {
      ...state,
      postList: [...action.payload, ...state.postList],
    };
  } else if (action.type === post_types.DELETE_POST) {
    const deletedItemArray = [...state.postList];
    deletedItemArray.splice(action.payload, 1);

    return {
      ...state,
      postList: deletedItemArray,
    };
  } else if (action.type === post_types.EDIT_POST) {
    const dataToUpdate = { ...state.postList[action.payload[0]], ...action.payload[1] };

    const newData = [...state.postList];
    newData.splice(action.payload[0], 1, dataToUpdate);
    return {
      ...state,
      postList: newData,
    };
  } else if (action.type === post_types.COMMENT_POST) {
    const dataToUpdate = { ...state.postList[action.payload[0]], ...action.payload[1][2] };
    
    const newData = [...state.postList];
    newData.splice(action.payload[0], 1, dataToUpdate);
    return {
      ...state,
      postList: newData,
    };
  }
  return state;
};
import { handleActions } from 'redux-actions';

const menuReducer = handleActions({
    SELECT_MENU: (state,action) => {
        console.log(state,action,action.payload)
        // return [...state,...action.payload]
        return Object.assign({}, state, action.payload);
    }
}, {});
export default menuReducer;
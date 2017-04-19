import { handleActions } from 'redux-actions';

const loginReducer = handleActions({
    LOGIN: (state, action) => {
        return Object.assign({}, state, action.payload);
    },
}, {});

export default loginReducer;
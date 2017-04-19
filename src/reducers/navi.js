import { handleActions } from 'redux-actions';

const naviReducer = handleActions({
    NAVI: (state, action) => {
        // console.log(state,action.payload)
        return action.payload
    }
}, {});

export default naviReducer;
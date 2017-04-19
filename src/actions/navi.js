import {
    NAVI
} from '../constants/ActionTypes';
import { createAction } from 'redux-actions';
// import login from '../api/login.js';
import SpotSet from '../containers/SpotSet.js';


let action_navi = createAction(NAVI);

export function setNavi(navi) {
    return dispatch => {
        dispatch(action_navi(navi))
    }
}

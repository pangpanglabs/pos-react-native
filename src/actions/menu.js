import {
    SELECT_MENU
} from '../constants/ActionTypes';
import { createAction } from 'redux-actions';
// import login from '../api/login.js';
import SpotSet from '../containers/SpotSet.js';


let action_select_menu = createAction(SELECT_MENU);

export function selectMenu(menuCode) {
    return dispatch => {
        dispatch(action_select_menu(menuCode))
    }
}

import {
    LOGIN,
} from '../constants/ActionTypes';
import { createAction } from 'redux-actions';
import login from '../api/login.js';

let action_login = createAction(LOGIN);

export function getLoginStatus(tenantName, userName, password, appId, cb) {
    return dispatch => {
        login.fetchLoginStatus(tenantName, userName, password, appId, cb, result => dispatch(action_login(result)));
    }
}

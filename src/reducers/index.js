import { combineReducers } from 'redux';
import loginReducer from './login';
import naviReducer from './navi';
import menuReducer from './menu';


export default combineReducers({
    login: loginReducer,
    navi: naviReducer,
    menu:menuReducer,
});
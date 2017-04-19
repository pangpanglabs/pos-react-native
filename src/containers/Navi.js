import React from 'react';
import Validate from './Validate';
import Login from './Login';
import Setting from './Setting';
import CatalogList from './CatalogList';
import SpotSet from './SpotSet.js';
import User from './User.js';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    Navigator,
} from 'react-native';
import { connect } from 'react-redux';
import { setNavi} from '../actions/navi.js';
import LoadingComponent from '../components/Loading';

class Navi extends React.Component {
    state = {
        isShow: false,
    }
    configureScene = () => {
        return Navigator.SceneConfigs.PushFromRight;
    }

    renderScene = (route, navigator) => {
        let Component = route.component;
        this.props.setNavi(navigator)
        return (
            <Component  {...route.params}   {...this.props} navigator={navigator} />
        );
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.menuStatus.menuCode){
            let param = nextProps.menuStatus.menuCode
            switch (param) {
                    case "settings":
                        nextProps.naviStatus.replace({
                            name: 'Setting',
                            component: Setting,
                        });
                        break;
                    case "user":
                        nextProps.naviStatus.replace({
                            name: 'User',
                            component: User,
                        });
                        break;
                    case "catalogList":
                        nextProps.naviStatus.replace({
                            name: 'CatalogList',
                            component: CatalogList,
                        });
                        break;
                    case "validate":
                        nextProps.naviStatus.replace({
                            name: 'Validate',
                            component: Validate,
                        });
                        break;
                    case "spotset":
                        nextProps.naviStatus.replace({
                            name: 'SpotSet',
                            component: SpotSet,
                        });
                        break;
                    default:
                        break;
                }
        }
    }
    render() {
        console.log("navi render menuStatus ==>",this.props.menuStatus)
        let defaultName = 'Validate';
        let defaultComponent = Validate;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor="#3e9ce9"
                    barStyle="light-content"
                    />
                <Navigator
                    initialRoute={{ name: defaultName, component: defaultComponent }}
                    configureScene={this.configureScene}
                    renderScene={this.renderScene}
                    />
                <LoadingComponent />

            </View>
        );
    }
}
function mapStateToProps(state) {
    return {
        naviStatus: state.navi,
        menuStatus: state.menu
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setNavi:(navi)=>dispatch(setNavi(navi))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Navi)



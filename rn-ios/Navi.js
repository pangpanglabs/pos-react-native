import React from 'react';
import Validate from './Validate';
import Login from './Login';
import Setting from './Setting';
import CatalogList from './CatalogList';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    Navigator
} from 'react-native';
import { signalObj } from './Signals';

export default class Navi extends React.Component {
    constructor(props) {
        super(props);
        this.renderScene = this.renderScene.bind(this);
    }
    configureScene() {
        return Navigator.SceneConfigs.HorizontalSwipeJump;
    }

    renderScene(route, navigator) {
        let Component = route.component;
        return (
            <Component {...route.params}  {...this.props} navigator={navigator} />
        );
    }
    componentDidMount() {
        // Event
        signalObj.removeAll();
        signalObj.add(function (signal, param) {
            if (signal === "naviReplace") {
                // console.log(param);
                switch (param) {
                    case "settings":
                        global.myNavigator.replace({
                            name: 'Setting',
                            component: Setting,
                        });
                        break;
                    case "user":
                        alert(param);
                        break;
                    case "catalogList":
                        global.myNavigator.replace({
                            name: 'CatalogList',
                            component: CatalogList,
                        });
                        break;
                    case "validate":
                        global.myNavigator.replace({
                            name: 'Validate',
                            component: Validate,
                        });
                        break;
                    default:
                        break;
                }

            }
        });
    }
    render() {
        let defaultName = 'Validate';
        let defaultComponent = Validate;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor="#3e9ce9"
                    barStyle="light-content"
                    />
                <Navigator
                    style={styles.navigator}
                    initialRoute={{ name: defaultName, component: defaultComponent }}
                    configureScene={this.configureScene}
                    renderScene={this.renderScene}
                    />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    navigator: {
        flex: 1,
        // backgroundColor:"#3e9ce9",
        // height:44,
    }
});




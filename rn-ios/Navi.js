import React from 'react';
import Redirect from './Redirect';
import Login from './Login';
import Setting from './Setting';
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
                console.log(param);
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
                    default:
                        break;
                }

            }
        });
    }

    render() {
        let defaultName = 'Redirect';
        let defaultComponent = Redirect;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor="#3e9ce9"
                    barStyle="default"
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




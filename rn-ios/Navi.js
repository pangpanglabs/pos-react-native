import React from 'react';
import Redirect from './Redirect';
import { LoadLocalStorage, LoadToken, SetToken } from '../common/LocalStorage';
import Login from './Login';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    Navigator
} from 'react-native';


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




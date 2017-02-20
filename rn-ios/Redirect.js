import React from 'react';
import {
    AsyncStorage,
    StyleSheet,
    View,
    Text,
    Navigator
} from 'react-native';
import CatalogList from './CatalogList';
import Login from './Login';
import SpotSet from './SpotSet';
class Loading extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>loading</Text>
            </View>

        )
    }
}
export default class Redirect extends React.Component {
    constructor() {
        super();
        this.state = {
            redirectPageState: "loading",
        }
    }

    componentWillMount() {
        const { navigator } = this.props;
        global.myNavigator = navigator;
    }

    componentDidMount() {
        const { navigator } = this.props;
        AsyncStorage.getItem("token").then((data) => {
            if (data) {
                AsyncStorage.getItem("spot").then((dataSpot) => {
                    console.log(dataSpot)
                    if (dataSpot) {
                        this.navigatorReplace('CatalogList', CatalogList);
                    } else {
                        this.navigatorReplace('SpotSet', SpotSet);
                    }
                });
            } else {
                this.navigatorReplace('Login', Login);
            }
        });
    }
    navigatorReplace(name, component) {
        const { navigator } = this.props;
        if (navigator) {
            navigator.replace({
                name: name,
                component: component,
            });
        }
    }
    render() {
        return (
            <View style={styles.loading}>
                <Text style={styles.loadingText}>loading...</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: "#3e9ce9",
    },
    loadingText: {
        fontSize: 20,
        color: 'white',
    },
    login: {
        flex: 1,
    }
});
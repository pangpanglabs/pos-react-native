import React from 'react';
import {
    AsyncStorage,
    StyleSheet,
    View,
    Text,
    Navigator
} from 'react-native';
import CatalogList from './CatalogList';
import { LoadLocalStorage, LoadToken, SetToken } from '../common/LocalStorage';
import Login from './Login';
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
    componentDidMount() {
        var self = this;
        const { navigator } = this.props;
        AsyncStorage.getItem("token").then((data) => {
            if (data) {
                self.navigatorReplace('CatalogList',CatalogList);
                // self.navigatorReplace('Login',Login);
                
            } else {
                // self.navigatorReplace('CatalogList',CatalogList);
                
                self.navigatorReplace('Login',Login);
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
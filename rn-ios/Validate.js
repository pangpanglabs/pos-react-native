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
class Loading extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>loading</Text>
            </View>

        )
    }
}
export default class Validate extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }
    
    async componentWillMount() {
        const { navigator } = this.props;
        global.myNavigator = navigator;
        let token = "";
        await AsyncStorage.getItem("token").then((data) => {
            token = data;
        });

        if (token){
            this.navigatorReplace('CatalogList',CatalogList);
        }else{
            this.navigatorReplace('Login',Login);
        }
        
    }
    
    componentDidMount() {
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
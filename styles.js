import { StyleSheet, Dimensions } from "react-native";

export const Splash = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent : 'center',
        display: 'flex',
        width: 'auto',
        height: Dimensions.get('window').height
    },
    splashPic: {
        maxWidth: "90%",
        resizeMode: "contain"
    },
});

export const Login = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent : 'center',
        display: 'flex',
        width: 'auto',
    },
});
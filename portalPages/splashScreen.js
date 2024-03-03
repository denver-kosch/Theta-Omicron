import { Image, View } from 'react-native';
import { Splash } from '../styles';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import crestC from "../Images/crestC.png";
import {apiCall} from "../funcs";


export function SplashScreen({navigation}) {
    const token = useSelector((state) => state.userInfo.token);

    const handleScreenChange = () => {
        navigation.navigate("Login");
    };

    useEffect(() => {
        const verify = async () => {
            if (token == '') {
                navigation.replace('Login');
                return;
            }
            const result = await apiCall('verifyToken.php', {token: token});
  
            if (result) {
                if (result.userid) {
                    navigation.replace('');
                }
                else {
                    navigation.replace('Login');
                }
            }
          };
          verify();
    });

    return (
        <View style={Splash.container}>
            <Image style ={{maxWidth: "90%", resizeMode: "contain"}} source={crestC} onPress={handleScreenChange}/>
        </View>
    )
}

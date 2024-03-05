import { Button, Image, Text, View, Dimensions, TextInput } from 'react-native';
import { Login } from '../styles';
import { useState } from 'react';
import { apiCall } from '../funcs';
import { useSelector } from 'react-redux';

export function LoginScreen({navigation}) {
    const [newUsername, setNewUn] = useState('');
    const [newPassword, setNewP] = useState('');
    const [newPasswordConfirm, setCP] = useState('');
    const [username, setUn] = useState('');
    const [password, setP] = useState('');
    const [register, setReg] = useState(false);

//Test

    const RegisterForm = () => {

        const handleReg = () => {
            navigation.navigate("");
        };

        return (
            <View>
                <View style={Login.inputField}>
                    <Text style={Login.inputPrompt}>Username:</Text>
                    <TextInput
                        placeholder='Enter username'
                        inputMode='text'
                        value={newUsername} 
                        onChangeText={text => setNewUn(text)}
                    />
                </View>
                <View style={Login.inputField}>
                    <Text style={Login.inputPrompt}>Password:</Text>
                    <TextInput
                        placeholder='Enter password'
                        inputMode='text'
                        value={newPassword} 
                        onChangeText={text => setNewP(text)}
                    />
                </View>
                <View style ={Login.inputField}>
                    <Text style={Login.inputPrompt}>Confirm Password:</Text>
                    <TextInput
                        placeholder='Re-enter password'
                        inputMode='text'
                        value={newPasswordConfirm} 
                        onChangeText={text => setCP(text)}
                    />
                </View>
                <Button title="Submit" onPress={handleReg}/>
                <Button title="Already a User?" onPress={() => setReg(false)}/>
            </View>
        );
    };

    const LoginForm = () => {

        const handleLogin = () => {
            const  userData = {username : un, password : password};
            const result = apiCall('login.php', userData);
            if (result === 'Success') {
                useSelector();
            }

        };

        return (
            <View>
                <Text>Username:</Text>
                <TextInput
                    placeholder='Enter username'
                    inputMode='text'
                    value={username} 
                    onChangeText={text => setUn(text)}
                    style={Login.inputField}
                />
                <Text>Password:</Text>
                <TextInput
                    placeholder='Enter password'
                    inputMode='text'
                    value={password} 
                    onChangeText={text => setP(text)}
                    style={Login.inputField}
                />
                <Button title="Submit" onPress={handleLogin}/>
                <Button title="Already a User?" onPress={() => setReg(true)}/>
            </View>
        )
    }


    return (
        <View style={Login.container}>
            {register && <RegisterForm/>}
            {!register && <LoginForm/>}
        </View>
    )
}


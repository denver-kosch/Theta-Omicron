import { Button, Image, Text, View, Dimensions, TextInput } from 'react-native';
import { Login } from '../styles';
import { useState } from 'react';

export function LoginScreen({navigation}) {
    const [newUsername, setNewUn] = useState('');
    const [newPassword, setNewP] = useState('');
    const [newPasswordConfirm, setCP] = useState('');
    const [username, setUn] = useState('');
    const [password, setP] = useState('');
    const [register, setReg] = useState(true);


    const RegisterForm = () => {
        return (
            <View>
                <Text>Username:</Text>
                <TextInput
                    placeholder='Enter username'
                    inputMode='text'
                    value={newUsername} 
                    onChangeText={text => setNewUn(text)}
                />
                <Text>Password:</Text>
                <TextInput
                    placeholder='Enter password'
                    inputMode='text'
                    value={newPassword} 
                    onChangeText={text => setNewP(text)}
                />
                <Text>ConfirmPassword:</Text>
                <TextInput
                    placeholder='Re-enter password'
                    inputMode='text'
                    value={newPasswordConfirm} 
                    onChangeText={text => setCP(text)}
                />
                <Button title="Submit" onPress={handleReg}/>
            </View>
        )
    }

    const LoginForm = () => {
        return (
            <View>
                <Text>Username:</Text>
                <TextInput
                    placeholder='Enter username'
                    inputMode='text'
                    value={username} 
                    onChangeText={text => setUn(text)}
                />
                <Text>Password:</Text>
                <TextInput
                    placeholder='Enter password'
                    inputMode='text'
                    value={password} 
                    onChangeText={text => setP(text)}
                />
                <Button title="Submit" onPress={handleLogin}/>
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


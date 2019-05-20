import React from 'react';
import styled from 'styled-components';
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
    Animated,
    Alert,
    AsyncStorage,
} from 'react-native';
import { connect } from 'react-redux';
import { BlurView } from 'expo';
import Success from '../components/Success';
import Loading from '../components/Loading';
import firebase from '../components/Firebase';

const screenHeight = Dimensions.get('window').height;

function mapStateToProps(state) {
    return { action: state.action };
}

function mapDispatchToProps(dispatch) {
    return {
        closeLogin: () => dispatch({
            type: 'CLOSE_LOGIN'
        }),
        updateName: name => dispatch({
            type: "UPDATE_NAME",
            name
        }),
        updateAvatar: avatar => dispatch({
            type: "UPDATE_AVATAR",
            avatar
        }),
    };
}

class ModalLogin extends React.Component {
    state = {
        email: '',
        password: '',
        iconEmail: require('../assets/icon-email.png'),
        iconPassword: require('../assets/icon-password.png'),
        isSuccessful: false,
        isLoading: false,
        top: new Animated.Value(screenHeight),
        scale: new Animated.Value(1.3),
        translateY: new Animated.Value(0),
    };

    componentDidMount() {
        this.retrieveName();
    }

    componentDidUpdate() {
        if (this.props.action === 'openLogin') {
            Animated.timing(this.state.top, {
                toValue: 0,
                duration: 0
            }).start();
            Animated.spring(this.state.scale, { toValue: 1 }).start();
            Animated.timing(this.state.translateY, {
                toValue: 0,
                duration: 0
            }).start();
        }

        if (this.props.action === 'closeLogin') {
            setTimeout(() => {
                Animated.timing(this.state.top, {
                    toValue: screenHeight,
                    duration: 0
                }).start();
                Animated.spring(this.state.scale, { toValue: 1.3 }).start();
            }, 500);

            Animated.timing(this.state.translateY, {
                toValue: 1000,
                duration: 500
            }).start();
        }
    }

    storeName = async name => {
        try {
            await AsyncStorage.setItem('name', name);
        } catch (error) {}
    };

    retrieveName = async () => {
        try {
            const name = await AsyncStorage.getItem('name');
            if (name !== null) {
                console.log(name);
                this.props.updateName(name);
            }
        } catch (error) {}
    };

    handleLogin = () => {
        this.setState({ isLoading: true });

        const email = this.state.email;
        const password = this.state.password;

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(function(error) {
                Alert.alert('Error', error.message);
            })
            .then(response => {
                this.setState({ isLoading: false });
                if (response) {
                    this.setState({ isSuccessful: true });
                    this.storeName(response.user.email);
                    this.props.updateName(response.user.email);
                    setTimeout(() => {
                        Alert.alert('Congrats', 'You logged in.');
                        Keyboard.dismiss();
                        this.props.closeLogin();
                        this.setState({ isSuccessful: false });
                    }, 1000);
                }
            });
    };

    focusEmail = () => {
        this.setState({
            iconEmail: require('../assets/icon-email-animated.gif'),
            iconPassword: require('../assets/icon-password.png')
        });
    };

    focusPassword = () => {
        this.setState({
            iconEmail: require('../assets/icon-email.png'),
            iconPassword: require('../assets/icon-password-animated.gif')
        });
    };

    tapBackground = () => {
        Keyboard.dismiss();
        this.props.closeLogin();
    };

    render() {
        return (
            <AnimatedContainer style={{ top: this.state.top }}>
                <TouchableWithoutFeedback onPress={this.tapBackground}>
                    <BlurView
                        tint='default'
                        intensity={100}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%'
                        }}
                    />
                </TouchableWithoutFeedback>
                <AnimatedModal
                    style={{
                        transform: [
                            { scale: this.state.scale },
                            { translateY: this.state.translateY }
                        ]
                    }}>
                    <Logo source={require('../assets/logo-dc.png')} />
                    <Text>Start Learning. Access Pro Content.</Text>
                    <TextInput
                        onChangeText={email => this.setState({ email })}
                        placeholder='Email'
                        value={this.state.email}
                        keyboardType='email-address'
                        onFocus={this.focusEmail}
                    />
                    <TextInput
                        onChangeText={password => this.setState({ password })}
                        placeholder='Password'
                        value={this.state.password}
                        secureTextEntry={true}
                        onFocus={this.focusPassword}
                    />
                    <IconEmail source={this.state.iconEmail} />
                    <IconPassword source={this.state.iconPassword} />
                    <TouchableOpacity onPress={this.handleLogin}>
                        <ButtonView>
                            <ButtonText>Log in</ButtonText>
                        </ButtonView>
                    </TouchableOpacity>
                </AnimatedModal>
                <Success isActive={this.state.isSuccessful} />
                <Loading isActive={this.state.isLoading} />
            </AnimatedContainer>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalLogin);

const Container = styled.View`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.75);
    justify-content: center;
    align-items: center;
`;

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const TextInput = styled.TextInput`
    border: 1px solid #dbdfea;
    width: 295px;
    height: 44px;
    border-radius: 10px;
    font-size: 17px;
    color: #3c4560;
    padding-left: 44px;
    margin-top: 20px;
`;

const Modal = styled.View`
    width: 335px;
    height: 370px;
    border-radius: 20px;
    background: white;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    align-items: center;
`;

const AnimatedModal = Animated.createAnimatedComponent(Modal);

const Logo = styled.Image`
    width: 44px;
    height: 44px;
    margin-top: 50px;
`;

const Text = styled.Text`
    margin-top: 20px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    width: 160px;
    color: #b8bece;
    text-align: center;
`;

const ButtonView = styled.View`
    background: #5263ff;
    width: 295px;
    height: 50px;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    margin-top: 20px;
    box-shadow: 0 10px 20px #c2cbff;
`;

const ButtonText = styled.Text`
    color: white;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 20px;
`;

const IconEmail = styled.Image`
    width: 24px;
    height: 16px;
    position: absolute;
    top: 179px;
    left: 31px;
`;

const IconPassword = styled.Image`
    width: 18px;
    height: 24px;
    position: absolute;
    top: 239px;
    left: 35px;
`;

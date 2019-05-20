import React from 'react';
import styled from 'styled-components';
import { Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Icon } from 'expo';
import MenuItem from "./MenuItem";
import { connect } from "react-redux";
import { AsyncStorage } from "react-native";

function mapStateToProps(state) {
  return { action: state.action }
}

function mapDispatchToProps(dispatch) {
    return {
        closeMenu: () => dispatch({
            type: "CLOSE_MENU"
        }),
        updateName: name => dispatch({
            type: "UPDATE_NAME",
            name
        }),
        updateAvatar: avatar => dispatch({
            type: "UPDATE_AVATAR",
            avatar
        }),
    }
}

const screenHeight = Dimensions.get('window').height;

class Menu extends React.Component {
    state = {
        top: new Animated.Value(screenHeight)
    };

    componentDidMount() {
        this.toggleMenu();
    }

    componentDidUpdate() {
        this.toggleMenu();
    }

    toggleMenu = () => {
        if (this.props.action == "openMenu") {
            Animated.spring(this.state.top, {
                toValue: 54
            }).start();
        }

        if (this.props.action == "closeMenu") {
            Animated.spring(this.state.top, {
                toValue: screenHeight
            }).start();
        }
    };

    handleMenu = index => {
        if (index === 3) {
            this.props.closeMenu();
            this.props.updateName("Stranger");
            this.props.updateAvatar(
                "https://cl.ly/55da82beb939/download/avatar-default.jpg"
            );
            AsyncStorage.clear();
        }
    };

    render() {
        return (
            <AnimatedContainer style={{ top: this.state.top }}>
                <Cover>
                    <Image source={require('../assets/background2.jpg')} />
                    <Title>Meng To</Title>
                    <Subtitle>meng@designcode.io</Subtitle>
                </Cover>
                <TouchableOpacity
                    onPress={this.props.closeMenu}
                    activeOpacity={0.8}
                    style={{
                        position: 'absolute',
                        top: 120,
                        left: '50%',
                        marginLeft: -22,
                        zIndex: 1
                    }}>
                    <CloseView>
                        <Icon.Ionicons name='ios-close' size={44} color='#546bfb' />
                    </CloseView>
                </TouchableOpacity>
                <Content>
                    {items.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                this.handleMenu(index);
                            }}>
                            <MenuItem
                                key={index}
                                icon={item.icon}
                                title={item.title}
                                text={item.text}/>
                        </TouchableOpacity>
                    ))}
                </Content>
            </AnimatedContainer>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);

const Container = styled.View`
    position: absolute;
    background: white;
    width: 100%;
    height: 100%;
    z-index: 100;
    border-radius: 10px;
    overflow: hidden;
`;

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const Cover = styled.View`
    height: 142px;
    background: black;
    align-items: center;
    justify-content: center;
`;

const Content = styled.View`
    height: ${screenHeight};
    background: #f0f3f5;
    padding: 50px;
`;

const CloseView = styled.View`
    width: 44px;
    height: 44px;
    border-radius: 22px;
    background: white;
    justify-content: center;
    align-items: center;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
`

const Image = styled.Image`
    position: absolute;
    width: 100%;
    height: 100%;
`;

const Title = styled.Text`
    color: white;
    font-size: 24px;
    font-weight: 600;
`;

const Subtitle = styled.Text`
    font-size: 13;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 8px;
`;

const items = [
    {
        icon: 'ios-settings',
        title: 'Account',
        text: 'settings'
    },
    {
        icon: 'ios-card',
        title: 'Billing',
        text: 'payments'
    },
    {
        icon: 'ios-compass',
        title: 'Learn React',
        text: 'start course'
    },
    {
        icon: 'ios-exit',
        title: 'Log out',
        text: 'see you soon!'
    }
];

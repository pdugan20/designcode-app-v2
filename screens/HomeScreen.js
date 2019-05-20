import React from 'react';
import Card from '../components/Card';
import Course from '../components/Course';
import Logo from '../components/Logo';
import Menu from '../components/Menu';
import Avatar from '../components/Avatar';
import styled from 'styled-components';
import ModalLogin from '../components/ModalLogin';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { NotificationIcon } from '../components/Icons';
import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import {
    ScrollView,
    Animated,
    TouchableOpacity,
    Easing,
    StatusBar,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

const CardsQuery = gql`
    {
        cardsCollection {
            items {
                title
                subtitle
                image {
                    title
                    description
                    contentType
                    fileName
                    size
                    url
                    width
                    height
                }
                subtitle
                caption
                logo {
                    title
                    description
                    contentType
                    fileName
                    size
                    url
                    width
                    height
                }
                content
            }
        }
    }
`;

function mapStateToProps(state) {
    return {
        action: state.action,
        name: state.name
    };
}

function mapDispatchToProps(dispatch) {
    return {
        openMenu: () => dispatch({
            type: 'OPEN_MENU'
        }),
        openLogin: () => dispatch({
            type: 'OPEN_LOGIN'
        }),
    };
}

class HomeScreen extends React.Component {
    static navigationOptions = {
      header: null
    };

    state = {
        scale: new Animated.Value(1),
        opacity: new Animated.Value(1)
    };

    componentDidMount() {
        StatusBar.setBarStyle('dark-content', true);
    }

    componentDidUpdate() {
        this.toggleMenu();
    }

    toggleMenu = () => {
        if (this.props.action == 'openMenu') {
            Animated.timing(this.state.scale, {
                toValue: 0.9,
                duration: 300,
                easing: Easing.in()
            }).start();

            Animated.spring(this.state.opacity, {
                toValue: 0.5
            }).start();

            StatusBar.setBarStyle('light-content', true);
        }

        if (this.props.action == 'closeMenu') {
            Animated.timing(this.state.scale, {
                toValue: 1,
                duration: 300,
                easing: Easing.in()
            }).start();

            Animated.spring(this.state.opacity, {
                toValue: 1
            }).start();

            StatusBar.setBarStyle('dark-content', true);
        }
    };

    handleAvatar = () => {
        if (this.props.name !== "Stranger") {
            this.props.openMenu();
        } else {
            this.props.openLogin();
        }
    };

    render() {
        return (
            <RootView>
                <Menu />
                <AnimatedContainer style={{
                    transform: [{ scale: this.state.scale }],
                    opacity: this.state.opacity
                }}>
                    <SafeAreaView
                        style={{ flex: 1 }}
                        forceInset={{ bottom: 'never'}}>
                        <ScrollView style={{ flex: 1}} >
                            <TitleBar>
                                <TouchableOpacity
                                    onPress={this.handleAvatar}
                                    style={{ position: 'absolute', top: 0, left: 0 }}>
                                    <Avatar />
                                </TouchableOpacity>
                                <Title>Welcome back,</Title>
                                <Name>{this.props.name}</Name>
                                <NotificationIcon
                                    style={{
                                        position: 'absolute',
                                        right: 40,
                                        top: 10
                                    }}
                                />
                            </TitleBar>
                            <ScrollView
                                style={{
                                    flexDirection: 'row',
                                    padding: 20,
                                    paddingLeft: 12,
                                    paddingTop: 30
                                }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}>
                                {logos.map((logo, index) => (
                                    <Logo
                                        key={index}
                                        image={logo.image}
                                        text={logo.text}
                                    />
                                ))}
                            </ScrollView>
                            <Subtitle>Continue Learning</Subtitle>
                            <ScrollView
                                horizontal={true}
                                style={{paddingBottom:30}}
                                showsHorizontalScrollIndicator={false}>
                                <Query query={CardsQuery}>
                                    {({ loading, error, data }) => {
                                        if (loading) return <Message>Loading...</Message>;
                                        if (error) return <Message>Error...</Message>;
                                        return (
                                            <CardsContainer>
                                                {data.cardsCollection.items.map((card, index) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        onPress={() => {
                                                            this.props.navigation.push('Section', {
                                                                section: card
                                                            });
                                                        }}>
                                                        <Card
                                                            title={card.title}
                                                            image={{ uri: card.image.url }}
                                                            caption={card.caption}
                                                            logo={{ uri: card.logo.url }}
                                                            subtitle={card.subtitle}
                                                            content={card.content}/>
                                                    </TouchableOpacity>
                                                ))}
                                            </CardsContainer>
                                        );
                                    }}
                                </Query>
                            </ScrollView>
                            <Subtitle>Popular Courses</Subtitle>
                            <ScrollView
                                horizontal={true}
                                style={{paddingBottom:30}}
                                showsHorizontalScrollIndicator={false}>
                                {courses.map((course, index) => (
                                    <Course
                                        key={index}
                                        image={course.image}
                                        title={course.title}
                                        subtitle={course.subtitle}
                                        logo={course.logo}
                                        author={course.author}
                                        avatar={course.avatar}
                                        caption={course.caption}
                                    />
                                ))}
                            </ScrollView>
                        </ScrollView>
                    </SafeAreaView>
                </AnimatedContainer>
                <ModalLogin />
            </RootView>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeScreen);

const Container = styled.View`
    background: #f0f3f5;
    flex: 1;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow: hidden;
`;

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const TitleBar = styled.View`
    width: 100%;
    margin-top: 30px;
    margin-left: 20px;
`;

const Title = styled.Text`
    font-size: 16px;
    color: #b8bece;
    font-weight: 500;
    margin-left: 55px;
`;

const Subtitle = styled.Text`
    color: #b8bece;
    font-weight: 600;
    font-size: 15px;
    margin: 25px 0 0 20px;
    text-transform: uppercase;
`;

const RootView = styled.View`
    background: black;
    flex: 1;
`;

const Name = styled.Text`
    font-size: 20px;
    color: #3c4560;
    font-weight: bold;
    margin-left: 55px;
`;

const Message = styled.Text`
    margin: 20px;
    color: #b8bece;
    font-size: 15px;
    font-weight: 500;
`;

const CardsContainer = styled.View`
    flex-direction: row;
`;

const logos = [
    {
        image: require('../assets/logo-framerx.png'),
        text: 'Framer X'
    },
    {
        image: require('../assets/logo-figma.png'),
        text: 'Figma'
    },
    {
        image: require('../assets/logo-studio.png'),
        text: 'Studio'
    },
    {
        image: require('../assets/logo-react.png'),
        text: 'React'
    },
    {
        image: require('../assets/logo-swift.png'),
        text: 'Swift'
    },
    {
        image: require('../assets/logo-sketch.png'),
        text: 'Sketch'
    }
];

const courses = [
    {
        title: 'Prototype in InVision Studio',
        subtitle: '10 sections',
        image: require('../assets/background13.jpg'),
        logo: require('../assets/logo-studio.png'),
        author: 'Meng To',
        avatar: require('../assets/avatar.jpg'),
        caption: 'Design an interactive prototype'
    },
    {
        title: 'React for Designers',
        subtitle: '12 sections',
        image: require('../assets/background11.jpg'),
        logo: require('../assets/logo-react.png'),
        author: 'Meng To',
        avatar: require('../assets/avatar.jpg'),
        caption: 'Learn to design and code a React site'
    },
    {
        title: 'Design and Code with Framer X',
        subtitle: '10 sections',
        image: require('../assets/background14.jpg'),
        logo: require('../assets/logo-framerx.png'),
        author: 'Meng To',
        avatar: require('../assets/avatar.jpg'),
        caption: 'Create powerful design and code components for your app'
    },
    {
        title: 'Design System in Figma',
        subtitle: '10 sections',
        image: require('../assets/background6.jpg'),
        logo: require('../assets/logo-figma.png'),
        author: 'Meng To',
        avatar: require('../assets/avatar.jpg'),
        caption: 'Complete guide to designing a site using a collaborative design tool'
    }
];

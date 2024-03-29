import React from 'react';
import {
    createBottomTabNavigator,
    createStackNavigator,
} from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import SectionScreen from '../screens/SectionScreen';
import CoursesScreen from '../screens/CoursesScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import { Icon } from 'expo';

const activeColor = '#4775f2';
const inactiveColor = '#b8bece';

const HomeStack = createStackNavigator(
    {
        Home: HomeScreen,
        Section: SectionScreen,
    },
    {
        mode: 'modal', // card
    }
);

HomeStack.navigationOptions = ({ navigation }) => {
    var tabBarVisible = true;
    const routeName = navigation.state.routes[navigation.state.index].routeName;

    if (routeName == 'Section') {
        tabBarVisible = false;
    }

    return {
        tabBarVisible,
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused }) => (
            <Icon.Ionicons
                name='ios-home'
                size={26}
                color={focused ? activeColor : inactiveColor}
            />
        )
    };
};

const CoursesStack = createStackNavigator({
    Courses: CoursesScreen
});

CoursesStack.navigationOptions = {
    tabBarLabel: 'Courses',
    tabBarIcon: ({ focused }) => (
        <Icon.Ionicons
            name='ios-albums'
            size={26}
            color={focused ? activeColor : inactiveColor}
        />
    )
};

const ProjectsStack = createStackNavigator({
    Projects: ProjectsScreen
});

ProjectsStack.navigationOptions = {
    tabBarLabel: 'Projects',
    tabBarIcon: ({ focused }) => (
        <Icon.Ionicons
            name='ios-folder'
            size={26}
            color={focused ? activeColor : inactiveColor}
        />
    )
};

const TabNavigator = createBottomTabNavigator(
    {
        HomeStack,
        CoursesStack,
        ProjectsStack,
    },
    {
        tabBarOptions: {
            activeTintColor: activeColor,
            inactiveTintColor: inactiveColor,
            labelStyle: {
                marginBottom: -6,
            },
            tabStyle: {
                marginTop: 10,
            },
        }
    },
);

export default TabNavigator;

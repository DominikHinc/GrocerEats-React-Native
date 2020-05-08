import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Platform, Text } from 'react-native';
import Colors from '../constants/Colors';
import MealDetailsScreen from '../screens/MealDetailsScreen';
import SearchByNutrientsScreen from '../screens/SavedRecipesScreen';
import SearchByIngredientsScreen from '../screens/SearchByIngredientsScreen';
import StandardSearchScreen from '../screens/StandardSearchScreen';
import YourGroceryListScreen from '../screens/YourGroceryListScreen';


const BottomTabNavigator = Platform.OS === 'android' ? createMaterialBottomTabNavigator() : createBottomTabNavigator();
const iconSize = 24;

const forFade = ({ current, closing }) => {
    return (
        {
            cardStyle: {
                opacity: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                }),
            },
        }
    )
};

const IOSTabBarOptions = {
    showLabel: false,
    activeTintColor: Colors.blue
}

const StackNavigator = createStackNavigator();

const searchStackNavigator = ({ navigation, route }) => {
    if (route.state && route.state.index > 0) {
        navigation.setOptions({ tabBarVisible: false })
    } else {
        navigation.setOptions({ tabBarVisible: true })
    }
    return (<StackNavigator.Navigator headerMode='none' >
        <StackNavigator.Screen name="StandardSearch" component={StandardSearchScreen} />
        <StackNavigator.Screen name="MealDetails" component={MealDetailsScreen} />
    </StackNavigator.Navigator>)
}
const searchByIngredientsStackNavigator = () => {
    return (<StackNavigator.Navigator headerMode='none'>
        <StackNavigator.Screen name="SearchByIngredients" component={SearchByIngredientsScreen} />
        <StackNavigator.Screen name="MealDetails" component={MealDetailsScreen} />
    </StackNavigator.Navigator>)
}
const searchByNutrientsStackNavigator = () => {
    return (<StackNavigator.Navigator headerMode='none'>
        <StackNavigator.Screen name="SearchByNutrients" component={SearchByNutrientsScreen} />
        <StackNavigator.Screen name="MealDetails" component={MealDetailsScreen} />
    </StackNavigator.Navigator>)
}
const yourGroceryListStackNavigator = () => {
    return (<StackNavigator.Navigator headerMode='none'>
        <StackNavigator.Screen name="YourGroceryList" component={YourGroceryListScreen} />
        <StackNavigator.Screen name="MealDetails" component={MealDetailsScreen} />
    </StackNavigator.Navigator>)
}

const mainTabNavigator = () => {
    return (
        <BottomTabNavigator.Navigator labeled={true} backBehavior='history' keyboardHidesNavigationBar={false} sceneAnimationEnabled={false} lazy={true}  >
            <BottomTabNavigator.Screen name="StandardSearch" component={searchStackNavigator} options={{
                tabBarLabel: 'Search',
                tabBarColor: Colors.blue,
                tabBarIcon: ({ color }) => {
                     
                    return <Ionicons name="ios-search" size={iconSize} color={color} />
                },
                cardStyleInterpolator: forFade

            }} />
            <BottomTabNavigator.Screen name="SearchByIngredients" component={searchByIngredientsStackNavigator} options={{
                tabBarLabel: 'Ingredients',
                tabBarColor: Colors.yellow,
                tabBarIcon: ({ color }) => {
                    
                    return <MaterialCommunityIcons name="food-variant" size={iconSize} color={color} />
                },
                cardStyleInterpolator: forFade
            }} />
            <BottomTabNavigator.Screen name="SavedRecipesScreen" component={searchByNutrientsStackNavigator} options={{
                tabBarLabel: 'Saved recipes',
                tabBarColor: Colors.red,
                tabBarIcon: ({ color }) => {
                    
                    return <AntDesign name='heart' size={iconSize} color={color} />
                },
                cardStyleInterpolator: forFade
            }} />
            <BottomTabNavigator.Screen name="YourGroceryList" component={yourGroceryListStackNavigator} options={{
                tabBarLabel: 'Your list',
                tabBarColor: Colors.green,
                tabBarIcon: ({ color }) => {
                   
                    return <Ionicons name='ios-list-box' size={iconSize} color={color} />
                },
                cardStyleInterpolator: forFade
            }} />
        </BottomTabNavigator.Navigator>
    )
}

export default mainTabNavigator

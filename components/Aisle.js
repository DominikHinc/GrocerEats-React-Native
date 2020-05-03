import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useEffect, useState } from 'react'
import { Animated, LayoutAnimation, StyleSheet, TouchableOpacity, View } from 'react-native'
import Reanimated, { Easing } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'
import Colors from '../constants/Colors'
import { CustomLayoutList } from '../constants/LayoutAnimations'
import { normalizeIconSize, normalizeMarginSize, normalizePaddingSize } from '../methods/normalizeSizes'
import { removeMultipleProduct, setCheckOfMultipleProducts } from '../store/actions/GroceryListActions'
import DefaultText from './DefaultText'

const Aisle = React.memo(({ aisle, data, isVisible, switchAisleVisibility }) => {
    const {
        set,
        cond,
        startClock,
        stopClock,
        clockRunning,
        block,
        timing,
        Value,
        Clock,
        interpolate,

    } = Reanimated; //Because in this component Both Animated from react and Reanimated are used, name of import of Reanimated Library was changed to Reanimated

    const listOfProductsToBeRemoved = useSelector(state => state.groceryList.idOfProductsToDelete)

    const [iconAnimatiedValue, setIconAnimatiedValue] = useState(new Animated.Value(isVisible ? 0 : 1))
    const [reanimatedValue, setReanimatedValue] = useState(new Value(1))

    const dispatch = useDispatch()

    useEffect(() => {
        let willThisAisleBeRemoved = true;
        data.forEach(item => {
            if (listOfProductsToBeRemoved.find(id => id === item.id) === undefined) {
                willThisAisleBeRemoved = false;
            }
        })
        if (willThisAisleBeRemoved === true) {
            startRemoveAnimation();
        }
    }, [listOfProductsToBeRemoved])

    const showMoreIconHandler = () => {
        LayoutAnimation.configureNext(CustomLayoutList);
        switchAisleVisibility(aisle)
        startIconAnimation();
    }

    //Functions Used For Editing Products from given Aisle
    const deleteAllAisleProducts = () => {
        const idsArray = data.map(item => {
            return item.id
        })
        dispatch(removeMultipleProduct(idsArray))
    }

    const checkAllAisleProducts = () => {
        let shouldCheckAll = false;
        const idsArray = data.map(item => {
            if (item.isChecked !== true) {
                shouldCheckAll = true
            }
            return item.id
        })
        dispatch(setCheckOfMultipleProducts(idsArray, shouldCheckAll))
    }

    const removeCheckedProducts = () => {
        let idsArray = [];
        data.forEach(item => {
            if (item.isChecked === true) {
                idsArray = [...idsArray, item.id]
            }
        })
        dispatch(removeMultipleProduct(idsArray))
    }

    //Functions and Interpolated Variables related to Reanimated

    const runTiming = (clock, value, dest) => {
        const state = {
            finished: new Value(0),
            position: value,
            time: new Value(0),
            frameTime: new Value(0),
        };

        const config = {
            duration: 200,
            toValue: dest,
            easing: Easing.inOut(Easing.cubic),
        };

        return block([

            cond(clockRunning(clock), 0, [
                set(state.finished, 0),
                set(state.time, 0),
                set(state.position, value),
                set(state.frameTime, 0),
                set(config.toValue, dest),
                startClock(clock),
            ]),
            timing(clock, state, config),
            cond(state.finished, stopClock(clock)),
            state.position,
        ]);
    }


    const startRemoveAnimation = () => {
        setReanimatedValue(runTiming(new Clock(), new Value(1), new Value(0)))
    }

    const aisleOpacityAndScale = interpolate(reanimatedValue, {
        inputRange: [0, 1],
        outputRange: [0, 1]
    })

    const aisleMarginTop = interpolate(reanimatedValue, {
        inputRange: [0, 1],
        outputRange: [normalizeMarginSize(-100), 0]
    })

    //Functions and Interpolated Variables Related To Animated from react native

    const startIconAnimation = () => {
        Animated.spring(iconAnimatiedValue, {
            toValue: isVisible ? 1 : 0,
            bounciness: 10,
            useNativeDriver: true
        }).start()
    }




    const iconRotation = {
        transform: [{
            rotate: iconAnimatiedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ["180deg", "360deg"]
            })
        }]
    }


    return (
        <Reanimated.View style={[styles.mainContainer, { marginTop: aisleMarginTop, opacity: aisleOpacityAndScale, transform: [{ scaleY: aisleOpacityAndScale }] }]}>
            <View style={styles.aisleTitleContainer}>
                <View style={styles.aisleBackgroundColorWrapper}>
                    <View style={styles.aisleTitleWidthReducer}>
                        <DefaultText style={styles.aisleTitle}>{aisle}</DefaultText>
                    </View>
                    <Animated.View style={[styles.showMoreIconContainer, iconRotation]}>
                        <TouchableOpacity style={styles.showMoreTouchable} onPress={showMoreIconHandler}>
                            <Ionicons name='ios-arrow-dropdown-circle' size={normalizeIconSize(25)} style={styles.showMoreIcon} color={Colors.green} />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
            {isVisible && <View style={styles.aisleEditOptionsContainer}>
                <View style={styles.deleteAllAisleProductsContainer}>
                    <TouchableOpacity onPress={deleteAllAisleProducts} style={styles.editOptionTouchable}>
                        <Foundation name="x" size={normalizeIconSize(15)} color={Colors.darkRed} style={styles.editOptionIcon} />
                        <DefaultText style={styles.editOptionLabel}>Remove all</DefaultText>
                    </TouchableOpacity>
                </View>
                <View style={styles.deleteAllAisleProductsContainer}>
                    <TouchableOpacity onPress={removeCheckedProducts} style={styles.editOptionTouchable}>
                        <MaterialCommunityIcons name="close-box-outline" size={normalizeIconSize(15)} color={Colors.darkRed} style={styles.editOptionIcon} />
                        <DefaultText style={styles.editOptionLabel}>Remove checked</DefaultText>
                    </TouchableOpacity>
                </View>
                <View style={styles.deleteAllAisleProductsContainer}>
                    <TouchableOpacity onPress={checkAllAisleProducts} style={styles.editOptionTouchable}>
                        <MaterialCommunityIcons name="checkbox-multiple-marked-outline" size={normalizeIconSize(15)} color={Colors.green} style={styles.editOptionIcon} />
                        <DefaultText style={styles.editOptionLabel}>Check all</DefaultText>
                    </TouchableOpacity>
                </View>
            </View>}
        </Reanimated.View>
    )
})

const styles = StyleSheet.create({
    mainContainer: {

    },
    aisleTitleContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    aisleTitleWidthReducer: {
        width: '85%',
        paddingLeft: normalizePaddingSize(10)
    },
    aisleBackgroundColorWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: normalizePaddingSize(10),
        paddingHorizontal: normalizePaddingSize(5),
        backgroundColor: 'white',
        borderBottomColor: 'white',
        borderBottomWidth: 1
    },
    aisleTitle: {
        fontSize: 20,
        fontFamily: 'sofia-bold'
    },
    deleteAllAisleProductsContainer: {
        paddingHorizontal: normalizePaddingSize(10)
    },
    deleteAllAisleProductsIcon: {

    },
    showMoreIconContainer: {
        position: 'absolute',
        right: '5%',

    },
    showMoreTouchable: {
        flex: 1,
        padding: normalizePaddingSize(10),
    },
    showMoreIcon: {

    },
    aisleEditOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: 'white'
    },
    editOptionTouchable: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    editOptionLabel: {
        fontSize: 15,
        color: Colors.darkGray
    },
    editOptionIcon: {
        marginRight: normalizeMarginSize(5)
    },
    productsListContainer: {

    },


})

export default Aisle

import Foundation from 'react-native-vector-icons/Foundation'
import React, { useEffect, useState } from 'react'
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { Easing } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'
import Colors from '../constants/Colors'
import { normalizeBorderRadiusSize, normalizeIconSize, normalizeMarginSize, normalizePaddingSize, normalizeWidth } from '../methods/normalizeSizes'
import { deleteAllProductsMentToBeRemoved, removeProduct, setCheckOfProduct } from '../store/actions/GroceryListActions'
import DefaultText from './DefaultText'
import ProductAmountManager from './ProductAmountManager'

const Product = React.memo(({ id, title, imageUrl, amountMain, unitMain, isChecked, noInternetConnection }) => {
    const {
        set,
        cond,
        startClock,
        stopClock,
        clockRunning,
        block,
        timing,
        call,
        Value,
        Clock,
        interpolate
    } = Animated;

    // const [currentIndex, setCurrentIndex] = useState(index)
    const shouldProductBeRemoved = useSelector(state => state.groceryList.idOfProductsToDelete.find(item => item === id))

    const [reanimatedValue, setReanimatedValue] = useState(new Value(1))
    const [productInitialHeight, setProductInitialHeight] = useState(0)

    const [imageSource, setImageSource] = useState({ uri: imageUrl })

    const dispatch = useDispatch()

    // useEffect(() => {
    //     //Because using just index passed by parent seems to sometimes bug everything, it was necessary to use local state
    //     setCurrentIndex(index)
    // }, [index])

    useEffect(() => {
        if (shouldProductBeRemoved !== undefined) {
            startRemoveAnimation();
        }
    }, [shouldProductBeRemoved])

    useEffect(() => {
        if (imageUrl === null || imageUrl === undefined) {
            setImageSource(require('../assets/Images/Custom_Product_Image.png'));
        } else {
            noInternetConnection ? setImageSource(require('../assets/Images/No_Internet_Connection.png')) : setImageSource({ uri: imageUrl })
        }
    }, [noInternetConnection])


    const measureInitialProductHeight = (e) => {
        //Because Products may vary in height, it must be measured at the start
        if (e.nativeEvent.layout.height > productInitialHeight) {
            setProductInitialHeight(e.nativeEvent.layout.height)
        }
    }

    const checkboxPressHandler = () => {
        dispatch(setCheckOfProduct(id, !isChecked))
    }
    const deleteIconPressHandler = () => {
        dispatch(removeProduct(id));
    }

    //Animation Related Functions and Interpolated Variables

    const runTiming = (clock, value, dest) => {
        const state = {
            finished: new Value(0),
            position: value,
            time: new Value(0),
            frameTime: new Value(0),
        };

        const config = {
            duration: 300,
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
            cond(state.finished, call([], () => dispatch(deleteAllProductsMentToBeRemoved()))),
            state.position,
        ]);
    }

    const startRemoveAnimation = () => {
        setReanimatedValue(runTiming(new Clock(), new Value(1), new Value(0)))
    }

    const productHeight = interpolate(reanimatedValue, {
        inputRange: [0, 1],
        outputRange: [0, productInitialHeight]
    })

    const productOpacityAndScale = interpolate(reanimatedValue, {
        inputRange: [0, 1],
        outputRange: [0, 1]
    })




    return (
        <Animated.View style={[styles.mainProductContainer, { height: productInitialHeight > 0 ? productHeight : null, opacity: productOpacityAndScale, transform: [{ scaleY: productOpacityAndScale }] }]} onLayout={measureInitialProductHeight} >
            <View style={styles.innerPaddingContainer}>
                <View style={styles.deleteIconContainer}>
                    <TouchableOpacity style={styles.iconTouchable} onPress={deleteIconPressHandler}>
                        <Foundation name="x" size={normalizeIconSize(20)} color={Colors.darkRed} style={styles.deleteIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.imageContainer}>
                    <Image source={imageSource} style={styles.image} />
                </View>
                <View style={styles.infoContainer}>
                    <DefaultText style={{ ...styles.titleLabel, textDecorationLine: isChecked ? 'line-through' : 'none' }}>{title}</DefaultText>
                    <ProductAmountManager id={id} amountMain={amountMain} unitMain={unitMain} />
                </View>
                <View style={styles.leftSideIconsContainer}>
                    {/* <View style={styles.indexIconsContainer}   >
                        <View style={styles.singleIconWrapper}>
                            {currentIndex > 0 && enableMoving === true && <TouchableOpacity style={styles.singleIconTouchable} onPress={() => moveProductOneIndexUp(index)}>
                                <Ionicons name='ios-arrow-up' size={normalizeIconSize(20)} style={styles.indexIcon} />
                            </TouchableOpacity>}
                        </View>
                        <View style={styles.singleIconWrapper}>
                            {currentIndex < aisleLength - 1 && enableMoving === true && <TouchableOpacity style={styles.singleIconTouchable} onPress={() => moveProductOneIndexDown(index)}>
                                <Ionicons name='ios-arrow-down' size={normalizeIconSize(20)} style={styles.indexIcon} />
                            </TouchableOpacity>}
                        </View>

                    </View> */}
                    <View style={{ paddingRight: normalizePaddingSize(7) }}>
                        <TouchableOpacity style={styles.iconTouchable} onPress={checkboxPressHandler}>
                            <View style={styles.checkboxBox}>
                                <Foundation name="check" size={normalizeIconSize(20)} color={Colors.green} style={[styles.checkIcon, { opacity: isChecked ? 1 : 0 }]} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Animated.View>
    )
})

const styles = StyleSheet.create({
    mainProductContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
    },
    innerPaddingContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        paddingVertical: normalizePaddingSize(10)
    },

    deleteIconContainer: {
        paddingHorizontal: normalizePaddingSize(10),
    },
    deleteIcon: {

    },
    imageContainer: {
        width: '10%',
        aspectRatio: 1,
        borderRadius: Dimensions.get('window').width / 20,
        overflow: 'hidden',
        elevation: 2,
        backgroundColor: 'white'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    titleLabel: {
        fontSize: 19,
        fontFamily: 'sofia-med',
    },
    infoContainer: {
        paddingTop: normalizePaddingSize(5),
        paddingLeft: normalizePaddingSize(5),
        width: '55%',
    },

    leftSideIconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
        marginRight: '5%'
    },
    indexIconsContainer: {
        marginRight: normalizeMarginSize(10)
    },
    iconTouchable: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxBox: {
        borderWidth: normalizeWidth(3.5),
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: normalizeBorderRadiusSize(8),
        overflow: 'hidden',
    },
    checkIcon: {

    },
    singleIconWrapper: {
        height: Dimensions.get('window').width / 15,
        paddingHorizontal: normalizePaddingSize(15),
        borderWidth: 1,
        borderColor: 'white'
    },
    singleIconTouchable: {
        justifyContent: 'center',
        flex: 1
    }


})

export default Product

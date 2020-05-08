import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { useEffect, useRef } from 'react'
import { Animated, Dimensions, Keyboard, LayoutAnimation, Platform, StyleSheet, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'
import { CustomLayoutSpring } from '../constants/LayoutAnimations'
import { normalizeBorderRadiusSize, normalizeHeight, normalizeIconSize, normalizeWidth } from '../methods/normalizeSizes'

const FloatingSearchIcon = React.memo(({ onPress }) => {

    let keyboardDidShowListener = useRef().current
    let keyboardDidHideListener = useRef().current


    useEffect(() => {
        keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShowHandler)
        keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHideHandler)
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        }
    }, [])


    const keyboardDidShowHandler = (e) => {
        LayoutAnimation.configureNext(CustomLayoutSpring)
    }
    const keyboardDidHideHandler = (e) => {
        LayoutAnimation.configureNext(CustomLayoutSpring)
    }

    let TouchableComp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version > 21) {
        TouchableComp = TouchableNativeFeedback;
    }

    return (

        <Animated.View style={[styles.searchIconContainer,
        { height: normalizeHeight(52), width: normalizeWidth(52), borderRadius: normalizeBorderRadiusSize(27) },
        { right: '5%', bottom: Dimensions.get('window').width / 20 }]}>
            <TouchableComp onPress={onPress} style={styles.touchable}>
                <View style={styles.innerView}>
                    <Ionicons style={styles.searchIcon} name="ios-search" size={normalizeIconSize(27)} />
                </View>
            </TouchableComp>
        </Animated.View>
    )
})

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        position: 'absolute',
        height: Dimensions.get('window').height,
        width: Dimensions.get('screen').width,
        zIndex: 1
    },
    searchIconContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        overflow: 'hidden',
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    searchIcon: {
        zIndex: 2,
    },
    touchable: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerView: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
})

export default FloatingSearchIcon

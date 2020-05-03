import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Easing, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import Colors from '../constants/Colors'
import { normalizeBorderRadiusSize, normalizeFontSize, normalizeIconSize, normalizePaddingSize } from '../methods/normalizeSizes'
import DefaultText from './DefaultText'

const SearchBar = ({ onSearchPress, backgroundColor, useAddBarPreset, placeholder, hintText, onBlur, onFocus,
    forceClear, setBufferedText }) => {
    //Animation Related Variables
    const distanceFromTopAnimationValue = new Animated.Value(1);
    const [animationCompleted, setAnimationCompleted] = useState(false)
    //Text Related Variables
    const textInputRef = useRef()
    const [textInputText, setTextInputText] = useState("")
    const [shouldXIconBeShown, setShouldXIconBeShown] = useState(false)


    useEffect(() => {
        if (forceClear === true) {
            setTextInputText("")
        }
    }, [forceClear])

    const xIconPress = () => {
        textInputRef.current.focus();
        setShouldXIconBeShown(false)
        setTextInputText("")
    }

    const submitInputHandler = () => {
        setShouldXIconBeShown(true)
        onSearchPress(textInputText)
        if (useAddBarPreset) {
            setTextInputText("")
        }
    }

    const textInputTextChangeHandler = (text) => {
        if (text.match(/^[A-Za-z0-9ĄąĆćĘęŁłŃńÓóŚśŹźŻżÄäẞßÜüÖö ][A-Za-z0-9ĄąĆćĘęŁłŃńÓóŚśŹźŻżÄäẞßÜüÖö \s]*$/) || text.length === 0) {
            setTextInputText(text)
            setShouldXIconBeShown(false)
            if (setBufferedText !== undefined) {
                setBufferedText(text)
            }
        }
    }

    //Animation Related Functions and Interpolated Variables
    const startAnimationAfterRealase = () => {
        Animated.timing(distanceFromTopAnimationValue, {
            toValue: 0,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver:false,
        }).start(() => {
            setAnimationCompleted(true);
            textInputRef.current.focus();
        })
    }

    const searchBarDistanceFromTop = distanceFromTopAnimationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, Dimensions.get('window').height / 2.5]
    })




    const getCurrentIcon = () => {
        if (useAddBarPreset) {
            return <Entypo style={{ paddingRight: normalizePaddingSize(15) }} name="plus" size={normalizeIconSize(23)} onPress={animationCompleted ? submitInputHandler : null} />
        } else if (shouldXIconBeShown) {
            return <Feather style={{ paddingRight: normalizePaddingSize(15) }} name="x" size={normalizeIconSize(23)} onPress={animationCompleted ? xIconPress : null} />
        } else {
            return <Ionicons style={{ paddingRight: normalizePaddingSize(15) }} name="ios-search" size={normalizeIconSize(21)} onPress={animationCompleted ? submitInputHandler : null} />
        }
    }

    return (
        <Animated.View style={[styles.searchTextInputAnimatedContainer, { marginTop: searchBarDistanceFromTop }]}>
            {animationCompleted === false && <DefaultText style={styles.hintLabel}>{hintText}</DefaultText>}
            <TouchableOpacity style={{ width: '60%' }} activeOpacity={animationCompleted ? 1 : 0.5} onPressOut={animationCompleted ? null : startAnimationAfterRealase} >
                <View style={{ ...styles.searchTextInputContainer, backgroundColor: backgroundColor === undefined ? Colors.blue : backgroundColor }}>
                    <TextInput ref={textInputRef} style={styles.searchTextInput} placeholder={placeholder === undefined ? "Search" : placeholder}
                        placeholderTextColor={useAddBarPreset ? Colors.lighterGray : Colors.lightGray} editable={animationCompleted} maxLength={100}
                        onSubmitEditing={submitInputHandler} value={textInputText} onChangeText={textInputTextChangeHandler} blurOnSubmit={useAddBarPreset ? false : true}
                        onBlur={onBlur === undefined ? null : onBlur} onFocus={onFocus === undefined ? null : onFocus} />
                    {getCurrentIcon()}

                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}
const styles = StyleSheet.create({
    searchTextInputAnimatedContainer: {
        alignItems: 'center',

    },
    searchTextInputContainer: {
        width: '100%',
        borderRadius: normalizeBorderRadiusSize(20),
        flexDirection: 'row',
        alignItems: 'center',

    },
    searchTextInput: {
        flex: 1,
        marginLeft: '5%',
        borderRadius: normalizeBorderRadiusSize(15),
        paddingHorizontal: normalizePaddingSize(15),
        fontFamily: 'sofia',
        fontSize: normalizeFontSize(18),
        paddingVertical: normalizePaddingSize(3)
    },
    hintLabel: {
        color: Colors.gray
    }
})

export default SearchBar

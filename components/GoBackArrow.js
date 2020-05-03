import Ionicons from 'react-native-vector-icons/Ionicons'
import React from 'react'
import { Platform, StyleSheet, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { normalizeBorderRadiusSize, normalizeHeight, normalizeIconSize, normalizePaddingSize, normalizeWidth } from '../methods/normalizeSizes'

const GoBackArrow = (props) => {
    const insets = useSafeArea();
    let TouchableComp;
    if (Platform.OS === 'android' && Platform.Version > 21) {
        TouchableComp = TouchableNativeFeedback;
    }
    if (props.forceOpacity) {
        TouchableComp = TouchableOpacity;
    }

    return (
        <View style={{ ...styles.mainArrowContainer, top: insets.top + normalizePaddingSize(7) }}>
            <TouchableComp style={styles.touchable} onPress={() => { props.goBack() }}>
                <View style={styles.innerView}>
                    <Ionicons style={{ ...styles.arrow }} name='ios-arrow-back' size={normalizeIconSize(25)} />
                </View>
            </TouchableComp>

        </View>
    )
}
const styles = StyleSheet.create({
    mainArrowContainer: {
        position: 'absolute',
        left: '3%',
        elevation: 2,
        height: normalizeHeight(52),
        width: normalizeWidth(52),
        borderRadius: normalizeBorderRadiusSize(27),
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
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
    arrow: {
    }
})

export default GoBackArrow

import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { useEffect, useState } from 'react'
import { Animated, Easing, StyleSheet, View, TouchableOpacity, LayoutAnimation } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import Colors from '../constants/Colors'
import { normalizeIconSize, normalizePaddingSize, normalizeHeight } from '../methods/normalizeSizes'
import DefaultText from './DefaultText'
import CreditsModal from './CreditsModal'
import { CustomLayoutDelete } from '../constants/LayoutAnimations'



const Logo = (props) => {
    const insets = useSafeArea();
    const { shouldLogoBeShown } = props

    const [logoInitialHeight, setLogoInitialHeight] = useState(-1)

    const [showCreditsModal, setShowCreditsModal] = useState(false)

    const [isLogoVisible, setisLogoVisible] = useState(shouldLogoBeShown)

    useEffect(() => {
         LayoutAnimation.configureNext(CustomLayoutDelete)
        setisLogoVisible(shouldLogoBeShown)
       
    }, [shouldLogoBeShown])


    return (
        <Animated.View
            style={{ ...styles.safeAreaViewWrapper, paddingTop: insets.top + normalizePaddingSize(5)}}>
            {isLogoVisible && <View>
                {props.goBack && <View style={styles.arrowContainer}>
                    <Ionicons style={styles.arrow} name='ios-arrow-back' size={normalizeIconSize(23)} onPress={() => { props.goBack() }} />
                </View>}
                <DefaultText style={{ ...styles.logo, color: props.color }}>GrocerEats</DefaultText>
                <View style={{ ...styles.creditsContainer, right: props.color !== Colors.green ? '5%' : null, left: props.color === Colors.green ? '5%' : null }}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => { setShowCreditsModal(true) }}>
                        <View style={{ ...styles.creditsTouchableInnerView, paddingLeft: props.color !== Colors.green ? normalizePaddingSize(15) : null, paddingRight: props.color === Colors.green ? normalizePaddingSize(15) : null }}>
                            <DefaultText style={styles.creditsLabel}>Credits</DefaultText>
                        </View>
                    </TouchableOpacity>
                </View>
                <CreditsModal modalVisible={showCreditsModal} setModalVisible={setShowCreditsModal} />
            </View>}

        </Animated.View>
    )
}
const styles = StyleSheet.create({
    safeAreaViewWrapper: {
        backgroundColor: 'white',
        overflow: 'hidden',
    },

    logo: {
        fontFamily: 'coiny',
        color: Colors.blue,
        fontSize: 38,
        alignSelf: 'center'

    },
    arrowContainer: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0,
        width: '100%',
    },
    arrow: {
        paddingLeft: '5%'
    },
    creditsContainer: {
        position: 'absolute',
    },
    creditsLabel: {
        fontSize: 13,
        color: Colors.darkGray
    },
    creditsTouchableInnerView: {
        paddingBottom: normalizePaddingSize(15),
        paddingLeft: normalizePaddingSize(15),
        //  borderWidth: 1, 
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
})

export default Logo

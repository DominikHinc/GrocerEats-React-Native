import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { normalizeFontSize } from '../methods/normalizeSizes.js'

const DefaultText = (props) => {

    return (
        <Text {...props}
            style={{
                ...styles.text, ...props.style, fontSize: props.style === undefined ? normalizeFontSize(styles.text.fontSize)
                    :
                    props.style.fontSize === undefined ? normalizeFontSize(styles.text.fontSize) : normalizeFontSize(props.style.fontSize)
            }} >
            {props.children}
        </Text>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 17,
        fontFamily: 'sofia'
    }
})

export default DefaultText

import Feather from 'react-native-vector-icons/Feather'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Colors from '../constants/Colors'
import { normalizeBorderRadiusSize, normalizeIconSize, normalizeMarginSize, normalizePaddingSize } from '../methods/normalizeSizes'
import DefaultText from './DefaultText'

const IngredientTag = ({ ingredientName, removeIngredient }) => {
    return (
        <View style={styles.mainContainer}>
            <DefaultText>{ingredientName}</DefaultText>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { removeIngredient(ingredientName) }}>
                <View>
                    <Feather name="x" size={normalizeIconSize(17)} style={styles.removeIngredientIcon} />
                </View>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingVertical: normalizePaddingSize(5),
        paddingLeft: normalizePaddingSize(20),
        paddingRight: normalizePaddingSize(10),
        backgroundColor: Colors.yellow,
        marginHorizontal: normalizeMarginSize(5),
        borderRadius: normalizeBorderRadiusSize(50),
        flexDirection: 'row',
        alignItems: 'center',

    },
    removeIngredientIcon: {
        marginLeft: normalizeMarginSize(10)
    }
})

export default IngredientTag

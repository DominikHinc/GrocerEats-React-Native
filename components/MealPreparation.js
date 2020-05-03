import React from 'react'
import { StyleSheet, View } from 'react-native'
import { normalizePaddingSize } from '../methods/normalizeSizes'
import DefaultText from './DefaultText'

const MealPreparation = React.memo(({ steps }) => {

    const renderSteps = () => {
        if (steps) {
            return steps[0].steps.map((item, index) => {

                return (
                    <View key={item.number} style={styles.step}>
                        {steps[0].steps.length > 1 && <DefaultText style={styles.stepNumberLabel} >Step {item.number}</DefaultText>}
                        <DefaultText style={styles.stepLabel} >{item.step}</DefaultText>
                    </View>)
            }
            )
        }
    }

    return (
        <View style={styles.steps}>
            {renderSteps()}
        </View>
    )
})

const styles = StyleSheet.create({
    steps: {

    },
    step: {
        paddingVertical: normalizePaddingSize(10)
    },
    stepNumberLabel: {
        fontFamily: 'sofia-med',
        fontSize: 24,
        textAlign: 'center'
    },
    stepLabel: {
        fontSize: 18,
        paddingHorizontal: normalizePaddingSize(10),
        textAlign: 'center'
    }

})
export default MealPreparation

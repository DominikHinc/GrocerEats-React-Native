import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import {Picker} from '@react-native-community/picker';
import { normalizeBorderRadiusSize, normalizeFontSize, normalizeHeight, normalizeIconSize, normalizeMarginSize, normalizePaddingSize, normalizeWidth } from '../methods/normalizeSizes';
import DefaultText from './DefaultText';

const AmountOfGroceriesManager = ({textInputRef, amount, setAmount, selectedUnit, setSelectedUnit, currentProduct, addToGroceryList, productAlreadyOnGroceryList }) => {
    const [tabOfUnits, setTabOfUnits] = useState([{ label: "No Unit", value: "" }, { label: 'g', value: 'g' }]);

    useEffect(() => {
        //Because picker does not allow creating dynamic list inside of its body the unit list must be created seperatly

        setTabOfUnits([{ label: "No unit", value: "" }]);
        if (currentProduct.unitMain.length > 0) {
            setTabOfUnits(prev => [...prev, { label: currentProduct.unitMain, value: currentProduct.unitMain }])
        }
        if (currentProduct.unitMain.toLowerCase() !== currentProduct.unitSecondary.toLowerCase() && currentProduct.unitSecondary.length > 0) {
            setTabOfUnits(prev => [...prev, { label: currentProduct.unitSecondary, value: currentProduct.unitSecondary }])
        }
        //Beside units got from server there is option to add ingradient to list in standard weight units
        if (currentProduct.unitMain !== 'g' && currentProduct.unitSecondary !== 'g') {
            setTabOfUnits(prev => [...prev, { label: 'g', value: 'g' }])
        }
        if (currentProduct.unitMain !== 'lb' && currentProduct.unitSecondary !== 'lb') {
            setTabOfUnits(prev => [...prev, { label: 'lb', value: 'lb' }])
        }
        if (currentProduct.unitMain !== 'oz' && currentProduct.unitMain !== 'ounces' && currentProduct.unitSecondary !== 'oz' && currentProduct.unitSecondary !== 'ounces') {
            setTabOfUnits(prev => [...prev, { label: 'oz', value: 'oz' }])
        }

    }, [])
    const setTextinputText = (text) => {
        setAmount(text.toString())
    }

    const addOneToAmount = () => {
        if (amount.length > 0 && parseInt(amount).toString() !== 'NaN') {
            setAmount(prev => (parseInt(prev) + 1).toString())
        } else {
            setAmount('1')
        }
    }
    const substractOneFromAmount = () => {
        if (amount.length > 0 && parseInt(amount) > 0 && parseInt(amount).toString() !== 'NaN') {
            setAmount(prev => (parseInt(prev) - 1).toString())
        } else {
            setAmount('1')
        }
    }

    const pickerValueChangeHandler = (itemValue, itemIndex) => {
        //Called when new unit is selected
        setSelectedUnit(itemValue);
        if (itemValue === currentProduct.unitMain) {
            setAmount(currentProduct.amountMain.toString());
        } else if (itemValue === currentProduct.unitSecondary) {
            setAmount(currentProduct.amountSecondary.toString());
        } else {
            setAmount('0');
        }
    }


    const getPickerOptions = () => {
        return tabOfUnits.map(item => <Picker.Item label={item.label} value={item.value} key={item.label} />)
    }

    return (
        <View style={styles.amountDetailsContainer}>
            <View style={styles.addButtonsContainer}>
                <TouchableOpacity style={styles.addButtonTouchable} onPress={addToGroceryList}>
                    <View style={styles.insideOfButton}>
                        <DefaultText>Add</DefaultText>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.amountButtonsContainer}>
                <TouchableOpacity style={styles.touchableButton} onPress={substractOneFromAmount}>
                    <View style={styles.insideOfButton}>
                        <AntDesign name="minus" size={normalizeIconSize(18)} />
                    </View>
                </TouchableOpacity>
                <View style={styles.amountWithUnitContainer}>

                    <TextInput style={styles.amountTextInput} maxLength={6} keyboardType='numeric' value={amount}
                        onChangeText={setTextinputText} onSubmitEditing={addToGroceryList} ref={textInputRef} />

                    <DefaultText style={styles.unitLabel}> {selectedUnit}</DefaultText>

                    {productAlreadyOnGroceryList === undefined && <View style={styles.pickerContainer}>
                        <Ionicons style={styles.pickerIcon} name="ios-arrow-down" size={normalizeIconSize(18)} />
                        <View style={{ opacity: 0 }}>
                            <Picker enabled={true} selectedValue={selectedUnit} style={styles.unitPicker}
                                prompt="Select unit" onValueChange={pickerValueChangeHandler}>
                                {getPickerOptions()}
                            </Picker>
                        </View>

                    </View>}
                </View>
                <TouchableOpacity style={styles.touchableButton} onPress={addOneToAmount}>
                    <View style={styles.insideOfButton}>
                        <AntDesign name="plus" size={normalizeIconSize(18)} />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.amountLabelContainer}>
                <DefaultText style={styles.amountLabel}>Amount:</DefaultText>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    amountDetailsContainer: {
        flexDirection: 'column-reverse',
        flex: 1,
        width: '100%',
        paddingBottom: normalizePaddingSize(15),
        backgroundColor: 'white',

    },
    amountButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: normalizePaddingSize(8)
    },
    amountButtonLabel: {
        fontFamily: 'sofiaBold',
        fontSize: 25,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    touchableButton: {
        backgroundColor: 'white',
        width: '12%',
        aspectRatio: 1,
        borderRadius: normalizeBorderRadiusSize(10),
        elevation: 2,
        marginHorizontal: '5%'
    },
    insideOfButton: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    addButtonsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: normalizePaddingSize(5),
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    addButtonTouchable: {
        backgroundColor: 'white',
        width: '25%',
        aspectRatio: 1.9,
        borderRadius: normalizeBorderRadiusSize(10),
        elevation: 2,
    },
    amountLabelContainer: {
        paddingBottom: normalizePaddingSize(5),
        backgroundColor: 'white'
    },
    amountLabel: {
        textAlign: 'center',
        fontFamily: 'sofia-med',
        fontSize: 18,

    },
    amountTextInput: {
        fontFamily: 'sofia',
        textAlign: 'center',
        paddingHorizontal: normalizePaddingSize(10),
        fontSize: normalizeFontSize(18),

    },
    amountWithUnitContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: normalizePaddingSize(12),
    },
    unitLabel: {
        paddingLeft: normalizePaddingSize(3)
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    unitPicker: {
        borderWidth: 1,
        paddingLeft: normalizePaddingSize(50),
        width: normalizeWidth(10),
        height: normalizeHeight(30),
        marginLeft: normalizeMarginSize(-20),
        color: "transparent",
        backgroundColor: 'white'

    },
    pickerIcon: {
        position: 'absolute'
    }
})

export default AmountOfGroceriesManager

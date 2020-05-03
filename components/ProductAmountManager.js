import Feather from 'react-native-vector-icons/Feather'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, StyleSheet, TextInput, View } from 'react-native'
import { useDispatch } from 'react-redux'
import Colors from '../constants/Colors'
import { normalizeFontSize, normalizeIconSize, normalizeMarginSize } from '../methods/normalizeSizes'
import { editProductAmount } from '../store/actions/GroceryListActions'
import DefaultText from './DefaultText'

const ProductAmountManager = React.memo(({id, amountMain, unitMain }) => {
    const [amountTextInputValue, setAmountTextInputValue] = useState(amountMain.toString())
    const [isEditing, setIsEditing] = useState(false)
    const setAmountText = (text) => {
        setAmountTextInputValue(text);
    }
    const textInputRef = useRef()
    const dispatch = useDispatch()
    useEffect(() => {
        if (isEditing) {
            textInputRef.current.focus();
        }
    }, [isEditing])

    useEffect(()=>{
        setAmountText(amountMain.toString())
    },[amountMain])

    const setIsTextinputEditable = (isEditable) => {

        if(isEditable === false){
            const isValid = amountTextInputValue.match(/^-?\d*(\.\d+)?$/);
            if (isValid && parseFloat(amountTextInputValue) > 0) {
                dispatch(editProductAmount(id, amountTextInputValue))
            } else {
                Alert.alert("Invalid amount", "You can only enter numbers, that are greater than 0")
                setAmountText(amountMain)
            }
        }
        setIsEditing(isEditable)

    }



    return (
        <View style={styles.amountMainConatiner}>
            <View style={styles.textInputContainer}>
                <TextInput ref={textInputRef} editable={isEditing} value={amountTextInputValue} onChangeText={setAmountText} 
                style={styles.amountTextInput} maxLength={6} keyboardType='numeric' onSubmitEditing={()=>{setIsTextinputEditable(false)}}  />
            </View>
            {/* <DefaultText style={styles.amountLabel}>{amountMain}</DefaultText> */}
            <DefaultText style={styles.amountLabel}>{unitMain}</DefaultText>
            {isEditing ?
                <Feather name="check" size={normalizeIconSize(18)} style={styles.editIcon} color={Colors.green} onPress={() => setIsTextinputEditable(false)} />
                :
                <Feather name="edit" size={normalizeIconSize(18)} style={styles.editIcon}  onPress={() => setIsTextinputEditable(true)} />
            }

        </View>
    )
})

const styles = StyleSheet.create({
    amountMainConatiner: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    amountLabel: {
        marginHorizontal: normalizeMarginSize(5)
    },
    
    textInputContainer: {

    },

    amountTextInput: {
        fontFamily: 'sofia-med',
        fontSize: normalizeFontSize(17),
        textAlign: 'center',
        padding:0,
        color:'black'
    },
    editIcon: {
        marginLeft: normalizeMarginSize(6)
    }
})

export default ProductAmountManager

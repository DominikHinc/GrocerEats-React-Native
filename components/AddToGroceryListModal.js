import Feather from 'react-native-vector-icons/Feather'
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Image, Keyboard, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../constants/Colors';
import { normalizeBorderRadiusSize, normalizeIconSize, normalizeMarginSize, normalizePaddingSize } from '../methods/normalizeSizes';
import ProductModel from '../models/ProductModel';
import { addProduct, editProductAmount } from '../store/actions/GroceryListActions';
import AmountOfGroceriesManager from './AmountOfGroceriesManager';
import DefaultText from './DefaultText';



const AddToGroceryListModal = ({ currentProduct, setModalVisible, modalVisible, noInternetConnection }) => {

    const dispatch = useDispatch();
    const productAlreadyOnGroceryList = useSelector(state => state.groceryList.productsList.find(item => item.id === currentProduct.id))
    //Variables related to amount and unit of ingredient
    const [amount, setAmount] = useState(currentProduct.amountMain.toString())
    const [selectedUnit, setSelectedUnit] = useState(currentProduct.unitMain)

    //Variables related to text input of amount
    const [keyboardIsDisplayed, setKeyboardIsDisplayed] = useState(false)
    let keyboardDidShowListener = useRef().current
    let keyboardDidHideListener = useRef().current
    const textInputRef = useRef()

    //Use effect will listen to keyboard change event and will clean up when modal is closed
    useEffect(() => {
        keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardIsDisplayed(true))
        keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardIsDisplayed(false))
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        }
    }, [])


    const addToGroceryList = () => {
        const isValid = amount.match(/^-?\d*(\.\d+)?$/);
        if (isValid && parseFloat(amount) > 0) {
            closeModalHandler();
            dispatch(productAlreadyOnGroceryList !== undefined ?
                editProductAmount(productAlreadyOnGroceryList.id, (parseFloat(productAlreadyOnGroceryList.amountMain) + parseFloat(amount)).toString())
                :
                addProduct(new ProductModel(currentProduct.id, currentProduct.title[0].toUpperCase() + currentProduct.title.slice(1, currentProduct.title.length),
                    currentProduct.imageUrl, amount,
                    selectedUnit === currentProduct.unitMain ? currentProduct.amountSecondary : currentProduct.amountMain,
                    selectedUnit,
                    selectedUnit === currentProduct.unitMain ? currentProduct.unitSecondary : currentProduct.unitMain,
                    currentProduct.aisle)))
        } else {
            Alert.alert("Invalid amount", "You can only enter numbers, that are greater than 0")
        }
    }

    //Modal Handlers
    const closeModalHandler = (elementCallingThis) => {
        if (keyboardIsDisplayed && elementCallingThis === 'background') {
            Keyboard.dismiss()
        } else {
            setModalVisible(false)
        }

    }

    const modalShowHandler = () => {
        //What should be set when modal in opening
        if (productAlreadyOnGroceryList === undefined) {
            setAmount(currentProduct.amountMain.toString())
            setSelectedUnit(currentProduct.unitMain)
        } else {
            setSelectedUnit(productAlreadyOnGroceryList.unitMain)
            if (productAlreadyOnGroceryList.unitMain === currentProduct.unitMain) {
                setAmount(currentProduct.amountMain.toString())
            } else if (productAlreadyOnGroceryList.unitMain === currentProduct.unitSecondary) {
                setAmount(currentProduct.amountSecondary.toString())
            } else {
                setAmount("0")
            }
        }

        textInputRef.current.focus();
    }

    return (
        <Modal
            onShow={modalShowHandler}
            style={styles.modal}
            animationType='fade'
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModalHandler}>
            <View style={styles.mainModalView}>
                <TouchableOpacity style={styles.dismissModalTouchable} activeOpacity={1} onPress={() => { closeModalHandler('background') }}>
                    <View style={styles.mainCardContainer}>
                        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1}>
                            <View>
                                <View style={styles.cardTitleAndDismissIconContainer}>
                                    <Feather name="x" size={normalizeIconSize(25)} onPress={closeModalHandler} style={styles.dismissIcon} />
                                    <DefaultText style={styles.cardTitle}>Add to your grocery list</DefaultText>
                                </View>
                                <View style={styles.imageContainer}>
                                    <View style={styles.imageRoundWrapper}>
                                        <Image source={noInternetConnection ? require('../assets/Images/No_Internet_Connection.png') : { uri: currentProduct.imageUrl }} style={styles.image} />
                                    </View>

                                </View>
                                <View style={styles.titleContainer}>
                                    <DefaultText style={styles.title} numberOfLines={1} >{currentProduct.title[0].toUpperCase() + currentProduct.title.slice(1, currentProduct.title.length)}</DefaultText>
                                </View>
                                <View style={styles.additionalInfoContainer}>
                                    <DefaultText style={{ textAlign: 'center', color: productAlreadyOnGroceryList === undefined ? Colors.red : Colors.green }}>
                                        {productAlreadyOnGroceryList === undefined ? "This product is not on your grocery list"
                                            :
                                            `You have already ${productAlreadyOnGroceryList.amountMain}${productAlreadyOnGroceryList.unitMain === "" ? '' : ' ('}${productAlreadyOnGroceryList.unitMain}${productAlreadyOnGroceryList.unitMain === "" ? '' : ')'} of this product on your grocery list.\nDo you want to add more?`}
                                    </DefaultText>
                                </View>
                            </View>
                            <AmountOfGroceriesManager closeModal={closeModalHandler} textInputRef={textInputRef} amount={amount} setAmount={setAmount}
                                selectedUnit={selectedUnit} setSelectedUnit={setSelectedUnit} currentProduct={currentProduct} addToGroceryList={addToGroceryList}
                                productAlreadyOnGroceryList={productAlreadyOnGroceryList} />
                        </TouchableOpacity>

                    </View>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    modal: {

    },
    mainModalView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',


    },
    mainCardContainer: {
        width: '80%',
        aspectRatio: 0.9,
        backgroundColor: 'white',
        borderRadius: normalizeBorderRadiusSize(28),
        elevation: 5,
        overflow: 'hidden'

    },
    dismissModalTouchable: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardTitleAndDismissIconContainer: {
        width: '100%',
        flexDirection: 'row',
        paddingLeft: '5%',
        paddingTop: '5%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardTitle: {
        fontFamily: 'sofia-med',
        fontSize: 19
    },
    dismissIcon: {
        position: 'absolute',
        top: Dimensions.get('window').width * 0.8 * 0.05,
        right: Dimensions.get('window').width * 0.8 * 0.05,
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
        paddingTop: normalizePaddingSize(10)
    },
    imageRoundWrapper: {
        width: Dimensions.get('window').width * 0.2,
        aspectRatio: 1,
        borderRadius: Dimensions.get('window').width * 0.1,
        overflow: 'hidden',
        elevation: 2,
        backgroundColor: 'white'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: normalizeMarginSize(20)
    },
    title: {
        fontFamily: 'sofia-bold',
        fontSize: 21
    },
    additionalInfoContainer: {
        paddingTop: '2%',
        marginHorizontal: normalizeMarginSize(20)
    },


})
export default AddToGroceryListModal

import React from 'react'
import { Clipboard, Modal, ScrollView, StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native'
import Colors from '../constants/Colors'
import { normalizeBorderRadiusSize, normalizeMarginSize, normalizePaddingSize } from '../methods/normalizeSizes'
import DefaultText from './DefaultText'

const CreditsModal = ({ modalVisible, setModalVisible }) => {
    return (
        <Modal
            contentContainerStyle={styles.modal}
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            transparent={true}
        >
            <View style={styles.mainModalView}>
                <TouchableOpacity style={styles.backgroundDismissTouchable} activeOpacity={1} onPress={() => { setModalVisible(false) }}>
                    <View style={styles.modalUsableView}>

                        <View style={styles.modalInnerView}>
                            <ScrollView style={{ height: '100%', width: '100%' }}>
                                <TouchableOpacity style={{ flex: 1 }} activeOpacity={1}>
                                    <View style={{ flex: 1 }}>
                                        <DefaultText style={styles.creditsLabel}>
                                            App created by : <DefaultText style={styles.creditsBoldLabel}>Dominik Hinc</DefaultText>
                                        </DefaultText>
                                        <TouchableOpacity onPress={() => {
                                            ToastAndroid.show("Copied to clipboard", 500)
                                            Clipboard.setString("contact.dominikhinc@gmail.com")
                                        }}>

                                            <DefaultText />
                                            <DefaultText>Contact: <DefaultText style={styles.hintLabel}>(click to copy)</DefaultText></DefaultText>
                                            <DefaultText style={styles.creditsBoldLabel} >contact.dominikhinc@gmail.com</DefaultText>
                                        </TouchableOpacity>
                                        <DefaultText />
                                        <DefaultText style={styles.creditsLabel}>
                                            Special thanks to : <DefaultText style={styles.creditsBoldLabel}>Adam Tymosz</DefaultText>, <DefaultText style={styles.creditsBoldLabel}>Mateusz Jarzembiński</DefaultText> and <DefaultText style={styles.creditsBoldLabel}>Kacper Stankiewicz</DefaultText> for
                                     providing help with testing; <DefaultText style={styles.creditsBoldLabel}>Kajetan Cyra</DefaultText> for his linguistic assistance.
                                </DefaultText>
                                        <DefaultText style={styles.creditsLabel}>
                                            GrocerEats is intended for informational, educational and entertainment purposes only.
                                </DefaultText>
                                        <DefaultText style={styles.creditsLabel}>
                                            All recipes presented by the app are provided by Spoonacular API.
                                </DefaultText>
                                        <DefaultText style={styles.creditsLabel}>
                                            The founder of GrocerEats claims no rights to the contents of said recipes as they belong to their rightful holders.
                                </DefaultText>
                                        <DefaultText style={styles.creditsLabel}>
                                            The founder of GrocerEats takes no responsibility for any personal data inputted by individuals using the app. All data user decides to share is passed on to Spoonacular and further used for purposes unknown and independent to the founder of GrocerEats.
                                </DefaultText>
                                    </View>
                                </TouchableOpacity>
                            </ScrollView>

                        </View>

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
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    backgroundDismissTouchable: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    modalUsableView: {
        width: '80%',
        aspectRatio: 0.75,
        backgroundColor: 'white',
        borderRadius: normalizeBorderRadiusSize(28),
        elevation: 5
    },
    modalInnerView: {
        padding: normalizePaddingSize(15)
    },
    creditsLabel: {
        marginVertical: normalizeMarginSize(5)
    },
    creditsBoldLabel: {
        fontFamily: 'sofia-bold'
    },
    hintLabel: {
        color: Colors.gray
    }
})


export default CreditsModal

import NetInfo from '@react-native-community/netinfo';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, LayoutAnimation, SectionList, StyleSheet, View } from 'react-native';
import { CustomLayoutMove } from '../constants/LayoutAnimations';
import Aisle from './Aisle';
import Product from './Product';

const GroceryListList = ({ data }) => {

    const [localOrderedAislesList, setLocalOrderedAislesList] = useState([])
    const [visibilityOfAisles, setVisibilityOfAisles] = useState({ All: true })
    const [canMove, setCanMove] = useState(true)
    const [noInternetConnection, setNoInternetConnection] = useState(false)

    const unorderedAislesList = {};
    let orderedAislesList = [];

    useEffect(() => {
        //If can move if false, then that means that this effect was called because the order of products changed
        if (canMove === false) {
            LayoutAnimation.configureNext(CustomLayoutMove, () => setCanMove(true))
        }
        //Here is created data list that can be interperted by Section List
        data.forEach(item => {
            if (unorderedAislesList["All"] === undefined) {
                unorderedAislesList["All"] = [item]
            } else {
                unorderedAislesList["All"] = [...unorderedAislesList["All"], item];
            }
            if (item.aisle !== undefined && item.aisle !== null) {
                if (item.aisle.includes(';')) {
                    const categoriesGroup = item.aisle.split(";");
                    categoriesGroup.forEach(category => {
                        if (unorderedAislesList[category] === undefined) {
                            unorderedAislesList[category] = [item]
                        } else {
                            unorderedAislesList[category] = [...unorderedAislesList[category], item]
                        }
                    })

                } else {
                    if (unorderedAislesList[item.aisle] === undefined) {
                        unorderedAislesList[item.aisle] = [item]
                    } else {
                        unorderedAislesList[item.aisle] = [...unorderedAislesList[item.aisle], item];
                    }
                }
            }
        })
        orderedAislesList = [];
        //Because I don't want the aisles order to be dependent on index of products I sort them alphabetically
        Object.keys(unorderedAislesList).sort().forEach((key) => {
            orderedAislesList = [...orderedAislesList, { title: key, data: unorderedAislesList[key].sort((a,b)=>{
                //Because I don't want the products order to be dependent on their id I sort them alphabetically
                if(a.title < b.title){return -1}
                if(a.title > b.title){return 1}
                return 0;
            })}]
        });

        setLocalOrderedAislesList(orderedAislesList);
    }, [data])

    useFocusEffect(() => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                setNoInternetConnection(false)
            } else {
                setNoInternetConnection(true)
            }
        });
    }, [])

    const switchAisleVisibility = useCallback((aisle) => {
        setVisibilityOfAisles(prev => {
            prev[aisle] = !prev[aisle];
            return { ...prev };
        })
    }, [setVisibilityOfAisles])


    // const moveProductOneIndexUp = useCallback((index) => {
    //     console.log(canMove)
    //     if (canMove === true) {
    //     // console.log("Moving " + index + " One up")
    //     // const currnetArrayCopy = data;
    //     // const movedItemCopy = currnetArrayCopy[index]
    //     // currnetArrayCopy[index] = currnetArrayCopy[index - 1]
    //     // currnetArrayCopy[index - 1] = movedItemCopy;
    //     // dispatch(setNewProductsList(currnetArrayCopy))
    //     setCanMove(false)
    //     dispatch(swapTwoProductsOrder(index,-1))
    //     }

    // },[canMove,dispatch,setCanMove,data])

    // const moveProductOneIndexDown = useCallback((index) => {
    //     console.log(canMove)
    //     if (canMove === true) {
    //     // console.log("Moving " + index + " One down")
    //     // const currnetArrayCopy = data;
    //     // const movedItemCopy = currnetArrayCopy[index]
    //     // currnetArrayCopy[index] = currnetArrayCopy[index + 1]
    //     // currnetArrayCopy[index + 1] = movedItemCopy;
    //     // dispatch(setNewProductsList(currnetArrayCopy))
    //     setCanMove(false)
    //     dispatch(swapTwoProductsOrder(index,1))
    //     }

    // },[canMove,dispatch,setCanMove,data])

    const renderListHeader = ({ section }) => {
        return <View key={section.title}><Aisle aisle={section.title} data={section.data}
            switchAisleVisibility={switchAisleVisibility} isVisible={visibilityOfAisles[section.title] === true} /></View>
    }

    const renderListItem = ({ item, index, section }) => {
        if (visibilityOfAisles[section.title] === true) {
            return <View><Product id={item.id} title={item.title} imageUrl={item.imageUrl} amountMain={item.amountMain} 
            unitMain={item.unitMain} isChecked={item.isChecked} noInternetConnection={noInternetConnection} /></View>
        } else {
            return null
        }

    }

    return (
        <KeyboardAvoidingView style={styles.mainListContainer} behavior='padding'>
            <SectionList
                sections={localOrderedAislesList}
                renderItem={renderListItem}
                renderSectionHeader={renderListHeader}
                keyExtractor={item => item.id}
                keyboardShouldPersistTaps='always'
            />

        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    mainListContainer: {
        flex: 1
    },
    listScrollView: {
        flex: 1
    }
})

export default GroceryListList

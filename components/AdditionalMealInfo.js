import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '../constants/Colors';
import { normalizePaddingSize } from '../methods/normalizeSizes';
import DefaultText from './DefaultText';

const AdditionalMealInfo = React.memo(({ mealDetails }) => {
    const additionalInfoData = useRef({
        Cheap: mealDetails.cheap,
        Dairy_free: mealDetails.dairyFree,
        Gluten_free: mealDetails.glutenFree,
        Ketogenic: mealDetails.ketogenic,
        Vegan: mealDetails.vegan,
        Vegetarian: mealDetails.vegetarian,
        Very_healthy: mealDetails.veryHealthy,
        Very_popular: mealDetails.veryPopular,
    }).current
    let positiveInfoList = useRef([]).current;
    let negativeInfoList = useRef([]).current;

    const [positiveRenderList, setPositiveRenderList] = useState([])
    const [negativeRenderList, setNegativeRenderList] = useState([])

    useEffect(() => {
        for (let value in additionalInfoData) {
            if (additionalInfoData[value] === true) {
                positiveInfoList = [...positiveInfoList, value]
            } else {
                negativeInfoList = [...negativeInfoList, value]
            }
        }
        setPositiveRenderList(positiveInfoList)
        setNegativeRenderList(negativeInfoList)
    }, [])

    const renderPositiveList = () => {
        return positiveRenderList.map(item => {
            let modifiedItem = item;
            if(item.includes("_")){
                let splitItems = modifiedItem.split("_");
                modifiedItem = splitItems[0] + " " + splitItems[1];
            }
            return (
                <View key={item} style={styles.listItemContainer}>
                    <DefaultText style={{ ...styles.listItem }}>{modifiedItem} : <DefaultText style={{color:Colors.green}}>Yes</DefaultText></DefaultText>
                </View>
            )
        })
    }
    const renderNegativeList = () => {
        return negativeRenderList.map(item => {
            let modifiedItem = item;
            if(item.includes("_")){
                let splitItems = modifiedItem.split("_");
                modifiedItem = splitItems[0] + " " + splitItems[1];
            }
            return (
                <View key={item} style={styles.listItemContainer}>
                    <DefaultText style={{ ...styles.listItem }}>{modifiedItem} : <DefaultText style={{color:Colors.red}}>No</DefaultText></DefaultText>
                </View>
            )
        })
    }

    return (
        <View style={styles.listContainer}>
            <View style={{...styles.halfListContainer, flex:positiveRenderList.length > 0 ? negativeRenderList.length > 0 ? 0.5 : 1 : 0}}>
                {renderPositiveList()}
            </View>
            <View style={{...styles.halfListContainer, flex:negativeRenderList.length > 0 ? positiveRenderList.length > 0 ? 0.5 : 1 : 0}}>
                {renderNegativeList()}
            </View>
            
        </View>
    )
})

const styles = StyleSheet.create({
    listContainer: {
        alignItems:'center',
        paddingBottom:normalizePaddingSize(10) ,
        flexDirection:'row'
    },
    listItemContainer: {

    },
    listItem: {
        fontSize: 18
    },
    halfListContainer:{
        alignItems:'center'
    }
})

export default AdditionalMealInfo

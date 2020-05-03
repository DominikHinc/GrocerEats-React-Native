import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React from 'react';
import { StyleSheet, View } from 'react-native';
import DefaultText from '../components/DefaultText';
import Colors from '../constants/Colors';
import { calculateHearthColor, calculateServingsColor, calculateStarColor, calculateTimeColor } from '../methods/calculateColors';
import { changeMinutesToHoursAndMinutes } from '../methods/mathHelper';
import { normalizeFontSize, normalizePaddingSize } from '../methods/normalizeSizes';
const BasicMealInfo = React.memo(({readyInMinutes, servings, likes, score}) => {
    return (
        <View style={styles.simpleInfoContainer}>
            <View style={styles.simpleInfo}>
                <AntDesign name="clockcircleo" color={calculateTimeColor(readyInMinutes)} size={normalizeFontSize(30)} style={styles.indicatorIcons} />
                <DefaultText style={styles.simpleInfoLabel}>{changeMinutesToHoursAndMinutes(readyInMinutes)}</DefaultText>
            </View>
            <View style={styles.simpleInfo}>
                <MaterialCommunityIcons name="silverware-fork-knife" color={calculateServingsColor(servings)} size={normalizeFontSize(30)} style={styles.indicatorIcons} />
                <DefaultText style={styles.simpleInfoLabel}>{servings} servings</DefaultText>
            </View>
            <View style={styles.simpleInfo}>
                <Ionicons name="ios-heart-empty" color={calculateHearthColor(likes)} size={normalizeFontSize(30)} style={styles.indicatorIcons} />
                <DefaultText style={styles.simpleInfoLabel}>{likes} Likes</DefaultText>
            </View>
            <View style={styles.simpleInfo}>
                <FontAwesome name="star" color={calculateStarColor(score)} size={normalizeFontSize(30)} style={styles.indicatorIcons} />
                <DefaultText style={styles.simpleInfoLabel}>Rating: {score}/100 </DefaultText>
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    simpleInfoContainer: {
        flexDirection: 'row',
        width: '100%',
        paddingTop: normalizePaddingSize(15) ,
        paddingBottom:'4%'
    },
    simpleInfo: {
        flex: 0.25,
        alignItems: 'center',
        marginHorizontal: "2%"
    },
    simpleInfoLabel: {
        fontSize: 16,
        color: Colors.darkGray,
        textAlign: 'center'
    },
})

export default BasicMealInfo

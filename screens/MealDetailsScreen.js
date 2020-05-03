import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Easing, StyleSheet, View, Text } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import AdditonalMealInfo from '../components/AdditonalMealInfo';
import AddToGroceryListModal from '../components/AddToGroceryListModal';
import BasicMealInfo from '../components/BasicMealInfo';
import DefaultText from '../components/DefaultText';
import FloatingHeartIcon from '../components/FloatingHeartIcon';
import GoBackArrow from '../components/GoBackArrow';
import MealPreparation from '../components/MealPreparation';
import MealTags from '../components/MealTags';
import SwipableCard from '../components/SwipableCard';
import Colors from '../constants/Colors';
import { ERROR_WHILE_FETCHING, fetchMealDetailsFromServer, MAXIMUM_NUMERS_OF_CALLS_REACHED, SUCCESS } from '../methods/fetchFromServer';
import { normalizeIconSize, normalizePaddingSize, normalizeBorderRadiusSize } from '../methods/normalizeSizes';
import { removeSavedRecipe, saveRecipe } from '../store/actions/SavedRecipesActions';
import ProductModel from '../models/ProductModel';
import NetInfo from '@react-native-community/netinfo';


const SCROLLING_TAB_BORDER_RADIUS = normalizeBorderRadiusSize(32) 

const MealDetailsScreen = (props) => {
    const { color, id, savedData } = props.route.params;
    const [loading, setLoading] = useState(true)
    const [mealDetails, setMealDetails] = useState(false)
    const [noInternetConnection, setNoInternetConnection] = useState(false)

    let scrollable = useRef(true).current
    const currentContentOffset = new Animated.Value(0)

    const isMealSaved = useSelector(state => state.savedRecipes.savedRecipes).find(item => item.id === id) !== undefined

    const [modalVisible, setModalVisible] = useState(false)
    const [currentProduct, setCurrentProduct] = useState(new ProductModel('1', 'Product', '', '', '', '', '', ''))

    const dispatch = useDispatch()

    //Setters
    const setModalVisiblilty = (shouldBeVisible) => {
        setModalVisible(shouldBeVisible)
    }

    const setInfoForModal = useCallback((info) => {
        setCurrentProduct(info)
        setModalVisible(true);
    }, [setCurrentProduct, setModalVisible])

    const setScrolling = useCallback((canScroll) => {
        scrollable = canScroll
    }, [scrollable])

    //Fetching from server
    useEffect(() => {
        if (mealDetails === false) {
            if (savedData !== undefined) {
                setMealDetails(savedData)
                setLoading(false)
            } else {
                setLoading(true)
                fetchMealDetailsFromServer(id).then(response => {
                    switch (response.status) {
                        case ERROR_WHILE_FETCHING:
                            props.navigation.goBack()
                            Alert.alert("Something went wrong", response.error)
                            break;
                        case MAXIMUM_NUMERS_OF_CALLS_REACHED:
                            props.navigation.goBack()
                            Alert.alert("Something went wrong", response.error)
                            break;
                        case SUCCESS:
                            setMealDetails(response.response)
                            break;
                    }
                    setLoading(false)
                }).catch(error => {
                    Alert.alert("Something went wrong", error.message)
                })
            }
        }

        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                setNoInternetConnection(false)
            } else {
                setNoInternetConnection(true)
            }
        }).catch(err => {
            Alert.alert("Something went wrong.", err.message)
            setNoInternetConnection(true)
        })




    }, [])


    //On Event happen handlers
    const onScrollHandler = (e) => {
        currentContentOffset.setValue(e.nativeEvent.contentOffset.y);
    }
    const onMomentumEndHandler = (e) => {
        currentContentOffset.setValue(e.nativeEvent.contentOffset.y);
    }
    const onHeartIconPressed = () => {
        if (!loading) {
            !isMealSaved ? dispatch(saveRecipe(id, mealDetails)) : dispatch(removeSavedRecipe(id))
        }
    }

    //Interpolated variables
    const imageOpacity = currentContentOffset.interpolate({
        inputRange: [0, Dimensions.get('screen').height / 2],
        outputRange: [1, 0],
        extrapolate: 'clamp',
        easing: Easing.ease,
    })
    const imageHeight = currentContentOffset.interpolate({
        inputRange: [0, Dimensions.get('screen').height / 2],
        outputRange: [Dimensions.get('screen').height / 2 + SCROLLING_TAB_BORDER_RADIUS, Dimensions.get('screen').height / 6],
        extrapolate: 'clamp',
        easing: Easing.ease,

    })

    const arrowScale = currentContentOffset.interpolate({
        inputRange: [0, Dimensions.get('screen').height / 2],
        outputRange: [1, -1],
        extrapolate: 'clamp',
        easing: Easing.ease,
    })

    const renderIngredients = () => {
        if (mealDetails.extendedIngredients) {
            let ingredientsMap = {};
            return mealDetails.extendedIngredients.map((item, index) => {
                if (ingredientsMap[item.id] === 1) {
                    return null;
                }

                ingredientsMap[item.id] = 1
                return (
                    <SwipableCard key={item.id} item={item} setScrolling={setScrolling} setInfoForModal={setInfoForModal} noInternetConnection={noInternetConnection} />
                )
            })
        }
    }

    return (
        <View style={{ ...styles.screen, backgroundColor: loading ? 'white' : 'black' }}>
       
            <GoBackArrow goBack={() => { props.navigation.goBack() }} />
            <FloatingHeartIcon onPress={onHeartIconPressed} active={isMealSaved} />
            <Animated.Image source={noInternetConnection ? require('../assets/Images/No_Internet_Connection.png') : { uri: `https://spoonacular.com/recipeImages/${id}-636x393.${mealDetails.imageType}` }}
                style={[styles.backgroundImage, { opacity: imageOpacity, height: imageHeight }]} resizeMode='cover' />

            {!loading && <ScrollView scrollEnabled={scrollable} style={styles.mainScrollView} onScroll={onScrollHandler}
                onMomentumScrollEnd={onMomentumEndHandler} showsVerticalScrollIndicator={false} scrollEventThrottle={17} onScrollBeginDrag={onScrollHandler}>
                <View style={styles.spaceFiller} />
                <View style={styles.mainContainer}>
                    <Animated.View style={[styles.upArrowContainer, { transform: [{ scaleY: arrowScale }] }]}>
                        <SimpleLineIcons name={'arrow-up'} size={normalizeIconSize(25)} color={Colors.gray} style={styles.upArrow} />
                    </Animated.View>
                    <View style={styles.titleContainer}>
                        <DefaultText style={styles.title}>{mealDetails.title}</DefaultText>
                    </View>

                    <BasicMealInfo readyInMinutes={mealDetails.readyInMinutes} servings={mealDetails.servings}
                        likes={mealDetails.aggregateLikes} score={mealDetails.spoonacularScore} />

                    {mealDetails !== false && mealDetails.dishTypes.length > 0 && <View style={styles.mainTagsContainer}>
                        <View style={styles.tagsContainer}>
                            <MealTags tags={mealDetails.dishTypes} />
                        </View>
                    </View>}
                    <DefaultText style={styles.sectionTitle}>
                        Ingredients:
                    </DefaultText>
                    <DefaultText style={styles.tutorialLabel}>
                        Swipe arrow left to add to your grocery list
                    </DefaultText>

                    <View style={styles.ingredientsMainContainer}>
                        {renderIngredients()}
                    </View>

                    {mealDetails !== false && mealDetails.analyzedInstructions.length > 0 ? <View style={styles.stepsMainContainer}>
                        <DefaultText style={styles.sectionTitle}>Preparation:</DefaultText>
                        <MealPreparation steps={mealDetails.analyzedInstructions} />
                    </View>
                        :
                        <DefaultText style={{ textAlign: "center" }}>Preparation steps were not found</DefaultText>
                    }

                    <View style={styles.additionalInfoContainer} >
                        <DefaultText style={styles.sectionTitle}>Additional info</DefaultText>
                        <AdditonalMealInfo mealDetails={mealDetails} />
                    </View>

                </View>
            </ScrollView>}
            {loading && <View style={styles.loadingContainer} ><ActivityIndicator size='large' color={color} /></View>}
            <AddToGroceryListModal modalVisible={modalVisible} setModalVisible={setModalVisiblilty} currentProduct={currentProduct} noInternetConnection={noInternetConnection} />

        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,

    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        height: '100%',
        width: '100%'
    },
    backgroundImage: {
        width: '100%',
        zIndex: 0,
        position: 'absolute',
        top: 0,
        right: 0,

    },
    mainScrollView: {
        flex: 1,

    },
    spaceFiller: {
        height: Dimensions.get('screen').height / 2,

    },
    mainContainer: {
        minHeight: Dimensions.get('screen').height / 2,
        backgroundColor: 'white',
        zIndex: 2,

        borderTopLeftRadius: SCROLLING_TAB_BORDER_RADIUS,
        borderTopRightRadius: SCROLLING_TAB_BORDER_RADIUS,
    },
    upArrowContainer: {
        width: '100%',
        alignItems: 'center',
        paddingTop: normalizePaddingSize(5),

    },
    upArrow: {

    },
    titleContainer: {
        paddingTop: normalizePaddingSize(5),
        alignItems: 'center',
        paddingHorizontal: normalizePaddingSize(5)
    },
    title: {
        fontFamily: 'sofia-bold',
        fontSize: 30,
        textAlign: 'center'
    },
    sectionTitle: {
        fontFamily: 'sofia-bold',
        fontSize: 24,
        textAlign: 'center',
        marginTop: '3%'
    },
    tutorialLabel: {
        textAlign: 'center',
        color: Colors.gray
    },
    mainTagsContainer: {

    },
    ingredientsMainContainer: {
        backgroundColor: 'white'
    },
    stepsMainContainer: {

    }

})

export default MealDetailsScreen

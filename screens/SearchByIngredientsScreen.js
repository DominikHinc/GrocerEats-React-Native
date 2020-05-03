import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, LayoutAnimation, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import DefaultText from '../components/DefaultText'
import FloatingSearchIcon from '../components/FloatingSearchIcon'
import IngredientsList from '../components/IngredientsList'
import Logo from '../components/Logo'
import MealPreviewList from '../components/MealPreviewList'
import SearchBar from '../components/SearchBar'
import Colors from '../constants/Colors'
import { CustomLayoutSpring } from '../constants/LayoutAnimations'
import { ERROR_WHILE_FETCHING, fetchSearchByIngredientsFromServer, MAXIMUM_NUMERS_OF_CALLS_REACHED, RECIPE_COULD_NOT_BE_FOUND, SUCCESS } from '../methods/fetchFromServer'


const SearchByIngredientsScreen = (props) => {
    //This workaround is necessary for adding ingredient when search button is pressed
    const [forceClearTextInput, setForceClearTextInput] = useState(false)
    let ingradientTextBuffer = useRef("").current

    const [recipesList, setRecipesList] = useState([])
    const [ingredientsList, setIngredientsList] = useState([])
    //Variables realated to fetching data from server
    const [shouldDataBeFetchedFromServer, setShouldDataBeFetchedFromServer] = useState(false)
    const [couldNotFindRecipe, setCouldNotFindRecipe] = useState(false)
    const [loading, setLoading] = useState(false)
    const perLoadAmount = 50;

    //Variables used for animations
    const [shouldLogoBeShown, setShouldLogoBeShown] = useState(true)
    const [isKeyboardDisplayed, setIsKeyboardDisplayed] = useState(false)

    useEffect(() => {
        setForceClearTextInput(false)
        if (shouldDataBeFetchedFromServer === true) {
            recipesList.length > 0 ? null : setLoading(true)
            setShouldDataBeFetchedFromServer(false);
            setCouldNotFindRecipe(false);
            fetchSearchByIngredientsFromServer(ingredientsList, recipesList.length, perLoadAmount).then(response => {
                switch (response.status) {
                    case RECIPE_COULD_NOT_BE_FOUND:
                        setCouldNotFindRecipe(true);
                        break;
                    case ERROR_WHILE_FETCHING:
                        Alert.alert("Something went wrong", response.error)
                        break;
                    case MAXIMUM_NUMERS_OF_CALLS_REACHED:
                        Alert.alert("Something went wrong", response.error)
                        break;
                    //Because there is no way to offset search by ingredinets there is no need to implement case NO_MORE_RECIPES
                    case SUCCESS:
                        if (response.firstSearchId !== undefined) {
                            firstSearchId = response.firstSearchId;
                        }
                        let uniqueRecipes = {};
                        response.response.forEach(item => {
                            if (uniqueRecipes[item.title] === undefined) {
                                uniqueRecipes[item.title] = item;
                            }
                        })
                        let uniqueRecipesArray = [];
                        for (let uniqueRecipe in uniqueRecipes) {
                            uniqueRecipesArray = [...uniqueRecipesArray, uniqueRecipes[uniqueRecipe]]
                        }
                        setRecipesList(uniqueRecipesArray);
                        break;
                }
                setLoading(false)
            }).catch(e => {
                Alert.alert("Something went wrong", e.message)
            })
        }
    }, [shouldDataBeFetchedFromServer])



    const addIngredient = (ingredinetName) => {
        if (ingredientsList.find(item => ingredinetName === item) === undefined && ingredinetName.length > 0) {
            LayoutAnimation.configureNext(CustomLayoutSpring)
            setIngredientsList(prev => [ingredinetName, ...prev]);
        }
    }

    const removeIngredient = (ingredientName) => {
        setIngredientsList(prev => prev.filter(item => item !== ingredientName))
        LayoutAnimation.configureNext(CustomLayoutSpring);
    }

    const removeAllIngredients = () => {
        setIngredientsList([])
        LayoutAnimation.configureNext(CustomLayoutSpring);
    }


    const searchHander = () => {
        setForceClearTextInput(true)
        addIngredient(ingradientTextBuffer)
        setRecipesList([]);
        Keyboard.dismiss();
        setShouldDataBeFetchedFromServer(true);
        setShouldLogoBeShown(false)
    }

    const setBufferedText = (text) => {
        ingradientTextBuffer = text
    }

    return (
        <View style={styles.screen}>
            <Logo color={Colors.yellow} shouldLogoBeShown={shouldLogoBeShown} />
            <View style={styles.restOfTheScreenContainer}>
                <SearchBar onSearchPress={addIngredient} forceClear={forceClearTextInput} setBufferedText={setBufferedText}
                    backgroundColor={Colors.yellow} useAddBarPreset={true} placeholder="Add ingredient" hintText="Search recipes by ingredients"
                    onFocus={() => { setIsKeyboardDisplayed(true) }} onBlur={() => { setIsKeyboardDisplayed(false) }} />
                {ingredientsList.length > 0 && <IngredientsList removeAllIngredients={removeAllIngredients} ingredientsList={ingredientsList} removeIngredient={removeIngredient} />}

                {recipesList.length > 0 && !couldNotFindRecipe && !loading && <MealPreviewList data={recipesList}
                    gotDetailedData={false} navigationProp={props.navigation} renderRecipeSearchedByIngredinets={true} />}

                {recipesList.length < 1 && !loading && !couldNotFindRecipe && <TouchableWithoutFeedback disabled={recipesList.length > 0 ? true : false} style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>}

                {loading && <View style={styles.loadingContainer}><ActivityIndicator size='large' color={Colors.yellow} /></View>}

                {couldNotFindRecipe && <View style={styles.loadingContainer}><DefaultText style={styles.errorText}>Could not find any recipes</DefaultText></View>}

            </View>
            <KeyboardAvoidingView style={{ position: 'absolute', height: "100%", width: "100%", backgroundColor: 'transparent', zIndex: 2 }} behavior='height' enabled={isKeyboardDisplayed}
                pointerEvents="box-none" >
                {ingredientsList.length > 0 && <FloatingSearchIcon onPress={searchHander} />}
            </KeyboardAvoidingView>


        </View>
    )
}
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',


    },
    // restOfTheScreenContainer: {
    //     flex: 1,
    //     zIndex: 1,
    //     backgroundColor: 'white'
    // },
    // loadingContainer: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',

    // },
})

export default SearchByIngredientsScreen

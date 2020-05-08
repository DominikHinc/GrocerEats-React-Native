import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert, Keyboard, StyleSheet, TouchableWithoutFeedback, View, Text } from 'react-native'
import { useDispatch } from 'react-redux'
import DefaultText from '../components/DefaultText'
import Logo from '../components/Logo'
import MealPreviewList from '../components/MealPreviewList'
import SearchBar from '../components/SearchBar'
import Colors from '../constants/Colors'
import { ERROR_WHILE_FETCHING, fetchStandardSearchFromServer, MAXIMUM_NUMBERS_OF_CALLS_REACHED, NO_MORE_RECIPES, RECIPE_COULD_NOT_BE_FOUND, SUCCESS } from '../methods/fetchFromServer'
import { loadSavedProducts } from '../store/actions/GroceryListActions'
import { loadSavedRecipes } from '../store/actions/SavedRecipesActions'


const StandardSearchScreen = (props) => {
    //UI Related Variables
    const [textToSearch, setTextToSearch] = useState("")
    //Fetching Data From Server Related Variables
    const [recipesList, setRecipesList] = useState([])
    const [couldNotFindRecipe, setCouldNotFindRecipe] = useState(false)
    const [shouldDataBeFetchedFromServer, setShouldDataBeFetchedFromServer] = useState(false)
    const [hasAllRecipesOfGivenSearchBeenFetched, setHasAllRecipesOfGivenSearchBeenFetched] = useState(false)
    const [recipesFetchOffset, setRecipesFetchOffset] = useState(0)
    const [loading, setLoading] = useState(false)

    const [hasDatabaseBeenLoaded, setHasDatabaseBeenLoaded] = useState(false)
    let firstSearchId = useRef().current;
    const perLoadAmount = 25;

    const dispatch = useDispatch()

    useEffect(() => {
        if (!hasDatabaseBeenLoaded) {
            setHasDatabaseBeenLoaded(true)
            dispatch(loadSavedRecipes())
            dispatch(loadSavedProducts())
        }

    }, [dispatch])


    //Animation Related Variables
    const [shouldLogoBeShown, setShouldLogoBeShown] = useState(true)

    //Fetching data from server related functions
    useEffect(() => {
        if (shouldDataBeFetchedFromServer && !hasAllRecipesOfGivenSearchBeenFetched) {
            setShouldDataBeFetchedFromServer(false);
            recipesList.length > 0 ? null : setLoading(true)
            setCouldNotFindRecipe(false);
            fetchStandardSearchFromServer(textToSearch, recipesList.length, recipesFetchOffset, firstSearchId, perLoadAmount).then((response) => {
                switch (response.status) {
                    case RECIPE_COULD_NOT_BE_FOUND:
                        setCouldNotFindRecipe(true);
                        break;
                    case ERROR_WHILE_FETCHING:
                        Alert.alert("Something went wrong", response.error)
                        break;
                    case MAXIMUM_NUMBERS_OF_CALLS_REACHED:
                        Alert.alert("Something went wrong", response.error)
                        break;
                    case NO_MORE_RECIPES:
                        setHasAllRecipesOfGivenSearchBeenFetched(true);
                    case SUCCESS:
                        if (response.firstSearchId !== undefined) {
                            firstSearchId = response.firstSearchId;
                        }
                        const data = recipesList.concat(response.response)
                        setRecipesList(data);
                        break;
                }
                setLoading(false);
                setRecipesFetchOffset(prev => prev + perLoadAmount)
            }).catch(error => Alert.alert("Something went wrong", error.message))

        }
    }, [shouldDataBeFetchedFromServer])

    const loadMore = () => {
        if (!hasAllRecipesOfGivenSearchBeenFetched) {
            setShouldDataBeFetchedFromServer(true)
        }

    }

    const searchHandler = (searchedText) => {
        setTextToSearch(searchedText)
        setRecipesList([]);
        Keyboard.dismiss();
        setShouldDataBeFetchedFromServer(true);
        setHasAllRecipesOfGivenSearchBeenFetched(false)
        setRecipesFetchOffset(0)
        setShouldLogoBeShown(false)
    }

    return (
        <View style={styles.screen} >
          
            <Logo shouldLogoBeShown={shouldLogoBeShown} color={Colors.blue} />
            <View style={styles.restOfTheScreenContainer}>
                <SearchBar onSearchPress={searchHandler} hintText="Search recipes by name" />
                {recipesList.length > 0 && !couldNotFindRecipe && !loading && <MealPreviewList data={recipesList} onEndReached={loadMore}
                    gotDetailedData={false} noMoreDataToDisplay={hasAllRecipesOfGivenSearchBeenFetched} navigationProp={props.navigation} />}
                {loading && <View style={styles.loadingContainer}><ActivityIndicator size='large' color={Colors.blue} /></View>}
                {couldNotFindRecipe && <View style={styles.loadingContainer}><DefaultText style={styles.errorText}>Could not find any recipes</DefaultText></View>}
                {recipesList.length < 1 && !loading && couldNotFindRecipe === false && <TouchableWithoutFeedback disabled={recipesList.length > 0 ? true : false} style={{ flex: 1, borderWidth: 1 }} onPress={() => { Keyboard.dismiss() }}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white'
    },
    restOfTheScreenContainer: {
        flex: 1,
        zIndex: 1,
        backgroundColor: 'white',
        height: '100%'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    errorText: {
        textAlign: 'center',

    },
})

export default StandardSearchScreen

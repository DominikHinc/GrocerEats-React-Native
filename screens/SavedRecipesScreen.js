import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import DefaultText from '../components/DefaultText'
import Logo from '../components/Logo'
import MealPreviewList from '../components/MealPreviewList'
import Colors from '../constants/Colors'


const SavedRecipesScreen = (props) => {
    const savedRecipesList = useSelector(state => state.savedRecipes.savedRecipes);
    const [recipesList, setRecipesList] = useState([])

    useEffect(() => {
        setRecipesList(savedRecipesList.sort((a, b) => {
            if (a.mealDetails.title < b.mealDetails.title) { return -1 }
            if (a.mealDetails.title > b.mealDetails.title) { return 1 }
            return 0;
        }))
    }, [savedRecipesList, setRecipesList])


    return (
        <View style={styles.screen}>
            <Logo color={Colors.red} shouldLogoBeShown={true} />
            {recipesList.length < 1 && <View style={styles.zeroSavedRecipesMessageContainer}><DefaultText>You haven't saved any recipes</DefaultText></View>}
            {recipesList.length > 0 && <MealPreviewList data={savedRecipesList} onEndReached={() => { }} noMoreDataToDisplay={true} renderSavedRecipe={true}
                navigationProp={props.navigation} endOfListText={"That's all recipes you saved. Maybe go and add some more."} />}
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white'
    },
    zeroSavedRecipesMessageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default SavedRecipesScreen

import { Alert } from "react-native";
import { deleteSavedRecipe, fetchSavedRecipes, insertSavedRecipe } from "../../helpers/db";
import { fetchMealDetailsFromServer, SUCCESS } from "../../methods/fetchFromServer";

export const SAVE_RECIPE = "SAVE_RECIPE";
export const REMOVE_SAVED_RECIPE = "REMOVE_SAVED_RECIPE";
export const LOAD_SAVED_RECIPES = 'LOAD_SAVED_RECIPES'

export const saveRecipe = (id, mealDetails) => {
    return async dispatch => {
        try {
            if (mealDetails === undefined) {
                //When saving recipe from list view it has only basic information, because of that there is fetching to server for more detalied info
                const fetchedDetails = await fetchMealDetailsFromServer(id);
                if (fetchedDetails.status === SUCCESS) {
                    mealDetails = fetchedDetails.response
                } else {
                    throw new Error("Error while fetching data from server");
                }
            }
            const mealDetailsStr = JSON.stringify(mealDetails);

            await insertSavedRecipe(id, mealDetailsStr)

            dispatch({ type: SAVE_RECIPE, id, mealDetails })
        } catch (error) {
            // Alert.alert("Something went wrong.", error.message)
            Alert.alert("Something went wrong.", "Error while saving recipe")
        }

    }
}

export const removeSavedRecipe = (id) => {
    console.log("Remove action")
    return async dispatch => {
        try {
            await deleteSavedRecipe(id);
            dispatch({ type: REMOVE_SAVED_RECIPE, id: id })
        } catch (error) {
            Alert.alert("Something went wrong.", "Error while removing saved recipe")
        }
    }
}

export const loadSavedRecipes = () => {
    return async dispatch => {
        try {
            const dbResault = await fetchSavedRecipes()
            const mappedArray = dbResault.rows._array.map(item => {
                const parsedDetails = JSON.parse(item.mealDetails)
                return { id: item.mealId, mealDetails: parsedDetails }
            })
            dispatch({ type: LOAD_SAVED_RECIPES, data: mappedArray })
        } catch (error) {
            Alert.alert("Something went wrong.", 'Error while loading saved recipes')
        }

    }
}


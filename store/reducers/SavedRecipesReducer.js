import { SAVE_RECIPE, REMOVE_SAVED_RECIPE, LOAD_SAVED_RECIPES } from "../actions/SavedRecipesActions"

const initialState = {
    savedRecipes:[],
}

export default (state = initialState, action) =>{
        switch(action.type){
            case SAVE_RECIPE:
                const isRecipeAlreadySaved = state.savedRecipes.find(item => item.id === action.id);
                return isRecipeAlreadySaved === undefined ? {...state, savedRecipes:[...state.savedRecipes,{id:action.id, mealDetails:action.mealDetails}]} : state
            case REMOVE_SAVED_RECIPE:
                const newSavedRecipes = state.savedRecipes.filter(item=>item.id !== action.id)
                return{...state, savedRecipes:newSavedRecipes};
            case LOAD_SAVED_RECIPES:
                return {...state, savedRecipes:action.data}
            default:
                return state
        }
}
import { applyMiddleware, combineReducers, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import ApiReducer from './reducers/ApiReducer';
import SavedRecipesReducer from './reducers/SavedRecipesReducer';
import GroceryListReducer from './reducers/GroceryListReducer';
import { refreshApiKey } from './actions/ApiActions';



// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    savedRecipes: SavedRecipesReducer,
    api:ApiReducer,
    groceryList:GroceryListReducer
  })

  const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

  export const getCurrentApi = ()=>{
    return store.getState().api
  }

  export const refreshApi = ()=>{
    store.dispatch(refreshApiKey())
  }

  export default store
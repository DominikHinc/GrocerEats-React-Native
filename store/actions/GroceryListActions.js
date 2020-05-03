import { Alert } from "react-native"
import { deleteAllProducts, deleteProduct, fetchSavedProducts, insertProduct, setProductAmount, setProductCheck } from "../../helpers/db"

export const ADD_PRODUCT = 'ADD_PRODUCT'
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT'
export const REMOVE_MULTIPLE_PRODUCTS = 'REMOVE_MULTIPLE_PRODUCTS'
export const SETCHECKOFPRODUCT = 'SET_CHECK_OF_PRODUCT'
export const EDIT_PRODUCT_AMOUNT = "EDIT_PRODUCT_AMOUNT"
export const SET_NEW_PRODUCTS_LIST = "SET_NEW_PRODUCTS_LIST"
export const SET_CHECK_OF_MULTIPLE_PRODUCTS = "SET_CHECK_OF_MULTIPLE_PRODUCTS"
export const DELETE_ALL_PRODUCTS_MENT_TO_BE_REMOVED = "DELETE_ALL_PRODUCTS_MENT_TO_BE_REMOVED"
export const LOAD_SAVED_PRODUCTS = 'LOAD_SAVED_PRODUCTS'
export const SWAP_TWO_PRODUCTS_ODRDER = 'SWAP_TWO_PRODUCTS_ODRDER'


export const addProduct = (product) => {
    return async dispatch => {
        try {
            await insertProduct(product.id, product.title, product.imageUrl, product.amountMain, product.amountSecondary, product.unitMain,
                product.unitSecondary, product.aisle, product.isChecked, false)

            dispatch({ type: ADD_PRODUCT, product })
        } catch (error) {
            // Alert.alert("Something went wrong.", error.message)
            Alert.alert("Something went wrong.", "Error while adding product")
        }

    }
}
//This will only add product id to list that will delete it from Grocery list only after deleteAllProductsMentToBeRemoved is called
export const removeProduct = (id) => {
    return {
        type: REMOVE_PRODUCT,
        id
    }
}
export const removeMultipleProduct = (idsArray) => {
    return {
        type: REMOVE_MULTIPLE_PRODUCTS,
        idsArray
    }
}
export const deleteAllProductsMentToBeRemoved = () => {
    return async (dispatch, getState) => {

        try {
            getState().groceryList.idOfProductsToDelete.forEach(async item => {
                const dbResault = await deleteProduct(item);
            })

            dispatch({ type: DELETE_ALL_PRODUCTS_MENT_TO_BE_REMOVED })
        } catch (error) {
            // Alert.alert("Something went wrong", error.message)
            Alert.alert("Something went wrong.", "Error while deleting product")
        }

    }
}

export const setNewProductsList = (productsList) => {
    return async dispatch => {
        try {
            await deleteAllProducts();
            productsList.forEach(async product =>{
                await insertProduct(product.id, product.title, product.imageUrl,product.amountMain, product.amountSecondary
                    ,product.unitMain,product.unitSecondary,product.aisle,product.isChecked, false )
            })
            
            dispatch({type: SET_NEW_PRODUCTS_LIST,productsList})
        } catch (error) {
            Alert.alert("Something went wrong.", "Error while updating grocery list")
        }
        
    }
}

export const editProductAmount = (id, amountMain) => {
    return async dispatch => {
        try {
            await setProductAmount(id, amountMain)
            dispatch({ type: EDIT_PRODUCT_AMOUNT, id, amountMain })
        } catch (error) {
            // Alert.alert("Something went wrong", error.message)
            Alert.alert("Something went wrong.", "Error while editing product")
        }
    }
}

export const setCheckOfProduct = (id, shouldProductBeChecked) => {
    return async dispatch => {
        try {
            await setProductCheck(id, shouldProductBeChecked)

            dispatch({ type: SETCHECKOFPRODUCT, id, shouldProductBeChecked })
        } catch (error) {
            // Alert.alert("Something went wrong", error.message)
            Alert.alert("Something went wrong.", "Error while editing product")
        }

    }
}
export const setCheckOfMultipleProducts = (idsArray, shouldAllBeChecked) => {
    return async dispatch => {
        try {
            idsArray.forEach(async id => {
                await setProductCheck(id, shouldAllBeChecked)
            })

            dispatch({ type: SET_CHECK_OF_MULTIPLE_PRODUCTS, idsArray, shouldAllBeChecked })
        } catch (error) {
            // Alert.alert("Something went wrong", error.message)
            Alert.alert("Something went wrong.", "Error while editing product")
        }

    }
}

export const loadSavedProducts = () => {
    return async dispatch => {

        try {
            const dbResault = await fetchSavedProducts();

            const productsList = dbResault.rows._array.map(item => {
                item.isChecked = item.isChecked === 0 ? true : false
                item.willBeDeleted = item.willBeDeleted === 0 ? true : false
                return item
            })

            dispatch({ type: SET_NEW_PRODUCTS_LIST, productsList: productsList })
        } catch (error) {
            // Alert.alert("Something went wrong", error.message)
            Alert.alert("Something went wrong.", "Error while loading grocery list")
        }

    }

}
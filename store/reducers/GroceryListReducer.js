import { ADD_PRODUCT, REMOVE_PRODUCT, SETCHECKOFPRODUCT, EDIT_PRODUCT_AMOUNT, SET_NEW_PRODUCTS_LIST, REMOVE_MULTIPLE_PRODUCTS, SET_CHECK_OF_MULTIPLE_PRODUCTS, DELETE_ALL_PRODUCTS_MENT_TO_BE_REMOVED, SWAP_TWO_PRODUCTS_ODRDER } from "../actions/GroceryListActions"



const initialState = {
    productsList: [],
    idOfProductsToDelete: [],
    listOrder: []
}

export default (state = initialState, action) => {
    let copyOfProductList;
    switch (action.type) {
        case ADD_PRODUCT:
            if (state.productsList.find(item => item.id === action.product.id) === undefined) {
                const newProduct = action.product;
                return { ...state, productsList: [...state.productsList, newProduct] }
            } else {
                let addedAmountProductIndex = state.productsList.findIndex(item => item.id === action.product.id);
                let currentAmount = parseFloat(state.productsList[addedAmountProductIndex].amountMain);
                if (currentAmount >= 999999) {
                    return state
                }
                let addedAmount = parseFloat(action.product.amountMain);

                currentAmount += addedAmount;

                copyOfProductList = state.productsList;
                copyOfProductList[addedAmountProductIndex].amountMain = currentAmount;

                return { ...state, productsList: [...copyOfProductList] }
            }

        case REMOVE_PRODUCT:
            return { ...state, idOfProductsToDelete: [...state.idOfProductsToDelete, action.id] }

        case REMOVE_MULTIPLE_PRODUCTS:
            return { ...state, idOfProductsToDelete: [...state.idOfProductsToDelete, ...action.idsArray] }

        case DELETE_ALL_PRODUCTS_MENT_TO_BE_REMOVED:
            copyOfProductList = state.productsList.filter(item => {
                return state.idOfProductsToDelete.find(id => id === item.id) === undefined
            })
            return { ...state, productsList: [...copyOfProductList], idOfProductsToDelete: [] }

        case EDIT_PRODUCT_AMOUNT:
            const indexOfProductToEditAmount = state.productsList.findIndex(item => { return item.id === action.id })
            if (indexOfProductToEditAmount < 0) {
                return state
            }
            copyOfProductList = state.productsList;
            copyOfProductList[indexOfProductToEditAmount].amountMain = action.amountMain;

            return { ...state, productsList: [...copyOfProductList] }

        case SETCHECKOFPRODUCT:
            const indexOfProductToChengeCheck = state.productsList.findIndex(item => item.id === action.id)
            copyOfProductList = state.productsList;
            copyOfProductList[indexOfProductToChengeCheck].isChecked = action.shouldProductBeChecked;

            return { ...state, productsList: [...copyOfProductList] };

        case SET_CHECK_OF_MULTIPLE_PRODUCTS:
            if (action.idsArray.length > 0) {
                copyOfProductList = state.productsList.map(item => {
                    return action.idsArray.find(id => id === item.id) !== undefined ? { ...item, isChecked: action.shouldAllBeChecked } : item
                });
                return { ...state, productsList: [...copyOfProductList] }
            }
            return state

        case SET_NEW_PRODUCTS_LIST:
            return { ...state, productsList: [...action.productsList] }

        default:
            return state
    }
}
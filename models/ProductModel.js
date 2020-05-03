export default class ProductModel{
    constructor(id, title, imageUrl, amountMain, amountSecondary, unitMain, unitSecondary, aisle, isChecked, willBeDeleted, listPos){
        this.id = id
        this.title = title
        this.imageUrl = imageUrl
        this.amountMain = amountMain
        this.amountSecondary = amountSecondary
        this.unitMain = unitMain
        this.unitSecondary = unitSecondary
        this.aisle = aisle
        this.isChecked = isChecked
        this.willBeDeleted = willBeDeleted,
        this.listPos = listPos
    }
}

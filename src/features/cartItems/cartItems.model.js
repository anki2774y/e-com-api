export default class CartItemModel {
    constructor(
        productId,
        userId,
        quantity,
        id
    ) {
        this.productId = productId;
        this.userId = userId;
        this.quantity = quantity;
        this.id = id
    }

    static add(productId, userId, quantity) {
        const cartItem = new CartItemModel(
            productId,
            userId,
            quantity
        );
        console.log("ProductId :: ", productId);
        cartItem.id = cartItems.length + 1;
        cartItems.push(cartItem);
        return cartItems;

        // check if user is valid or not 
        // check if productid is valid or not 
        // check if same product is available in cart or not if it exist it should replace it
    }

    static get(userId) {
        console.log("USERID ;: ", userId);
        return cartItems.filter(
            (i) => i.userId == userId
        )
    }

    static delete(cartItemId, userId) {
        const cartItemIndex = cartItems.findIndex(
            (i) => 
                i.id == cartItemId && i.userId == userId
        );
        if(cartItemIndex == -1) {
            return 'Item not found'
        } else {
            cartItems.splice(cartItemIndex, 1);
        }
    }
}

var cartItems = [
    new CartItemModel(1, 2, 1, 1),
    new CartItemModel(1, 1, 2, 1)
] 
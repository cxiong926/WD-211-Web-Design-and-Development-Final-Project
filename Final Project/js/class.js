// Item class
function Item(name, amount, price) {
	this.name = name;
	this.amount = amount;
	this.price = price;
}

// ShoppingCart class
function ShoppingCart(store, email, creditCard, expirationDate, securityCode, items = []) {
	this.store = store;
	this.email = email;
	this.creditCard = creditCard;
	this.expirationDate = expirationDate;
	this.securityCode = securityCode;
	this.items = items;
}

// Purpose: Adds a menu item object to the shopping cart list of items
// Arguments: an instance of MenuItem
ShoppingCart.prototype.addMenuItem = function(item) {
	if(item instanceof Item) {
		this.items.push(item);
	}
}
	
// Objects
let tots = new Item("Tater Tots", 0, 3);
let wings = new Item("Chicken Wings", 0, 3);
let sliders = new Item("Sliders", 0, 3);

let soup = new Item("Cheese Soup", 0, 5);
let chickenSalad = new Item("Chicken Salad", 0, 5);
let caesar = new Item("Caesar Salad", 0, 5);

let veggie = new Item("Veggie Burger", 0, 8);
let burger = new Item("Jumbo Burger", 0, 8);
let blt = new Item("BLT", 0, 8);

let steak = new Item("12oz Ribeye", 0, 18)
let lobster = new Item("8oz Lobster Tail", 0, 18)
let shells = new Item("Shells and Cheese", 0, 18)

let cart = new ShoppingCart("", "", "", "", "");
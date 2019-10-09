$(document).ready(function() {

    // Opens cart and hides store selector if open
    $("#cart, #cartSize").click(function() {
        $("#storeSelector").hide(200);
        $("#cartDiv").slideToggle(200);
        createCart();
    });

    // Selects Stevens Point as store
    $("#stevensPoint").click(function() {
        changeStore("Stevens Point");
    });

    // Selects Wausau as store
    $("#wausau").click(function() {
        changeStore("Wausau");
    });

    // Selects Green Bay as store
    $("#greenBay").click(function() {
        changeStore("Green Bay");
    });

    // Lets user change store and closes cart if open
    $("#changeStoreP").click(function() {
        $("#cartDiv").slideUp(200);
        $("#storeSelector").toggle(200);
    });

    // Closes shop selector
    $("#close").click(function() {
        $("#storeSelector").toggle(200);
    });

    // Closes cart
    $("#closeCart").click(function() {
        $("#cartDiv").slideUp(200);
    });

    // Adds Tots to the cart
    $("#totsAdd").click(function() {
        let amount = $("#totsAmount").val();
		addItem(tots, amount, "totsAmount");
    });

    // Adds Wings to the cart
    $("#wingsAdd").click(function() {
        let amount = $("#wingsAmount").val();
		addItem(wings, amount, "wingsAmount");
    });
    // Adds sliders to the cart
    $("#slidersAdd").click(function() {
        let amount = $("#slidersAmount").val();
		addItem(sliders, amount, "slidersAmount");
    });

    // Adds soup to the cart
    $("#soupAdd").click(function() {
        let amount = $("#soupAmount").val();
		addItem(soup, amount, "soupAmount");
    });

    // Adds chicken salad to the cart
    $("#chickenSaladAdd").click(function() {
        let amount = $("#chickenSaladAmount").val();
		addItem(chickenSalad, amount, "chickenSaladAmount");
    });

    // Adds caesar salad to the cart
    $("#caesarAdd").click(function() {
        let amount = $("#caesarAmount").val();
		addItem(caesar, amount, "caesarAmount");
    });

    // Adds veggie burger to the cart
    $("#veggieBurgerAdd").click(function() {
        let amount = $("#veggieBurgerAmount").val();
		addItem(veggie, amount, "veggieBurgerAmount");
    });

    // Adds burger to the cart
    $("#burgerAdd").click(function() {
        let amount = $("#burgerAmount").val();
		addItem(burger, amount, "burgerAmount");
    });

    // Adds blt to the cart
    $("#bltAdd").click(function() {
        let amount = $("#bltAmount").val();
		addItem(blt, amount, "bltAmount");
    });

    // Adds Steak to the cart
    $("#ribeyeAdd").click(function() {
        let amount = $("#ribeyeAmount").val();
		addItem(steak, amount, "ribeyeAmount");
    });

    // Adds lobster to the cart
    $("#lobsterAdd").click(function() {
        let amount = $("#lobsterAmount").val();
		addItem(lobster, amount, "lobsterAmount");
	});

    // Adds shells and cheese to the cart
    $("#shellsAdd").click(function() {
        let amount = $("#shellsAmount").val();
        addItem(shells, amount, "shellsAmount");
    });

	// Prevents jQuery's onkeyup listener for personal preference
    $.validator.setDefaults({
        onkeyup: function(element) {
            if (element.name == '#validationForm') {
                return false;
            }
        }
    });

	// jQuery validation
    $("#validationForm").validate({

        //  Validation rules
        rules: {
            emailAddress: {
                required: true,
                email: true
            },
            creditCard: {
                required: true,
                minlength: 16,
                number: true
            },
            expDate: {
                required: true,
                pattern: /^((0[1-9])|(1[0-2]))\/((2019)|(20[1-2][0-9]))$/i
            },
            secCode: {
                required: true,
                minlength: 3,
                maxlength: 3,
                number: true
            }
        },

        //  Error messages for rules
        messages: {
            emailAddress: {
                required: "<br>Please enter your email address",
                email: "<br>Please enter a valid email address"
            },
            creditCard: {
                required: "<br>Please enter your credit card number",
                minlength: "<br>Credit card number must have 16 numbers",
				number: "<br>Please enter a valid number"
            },
            expDate: {
                required: "<br>Please enter your expiration date",
                pattern: "<br>Please make sure the date is in a valid MM/YYYY format"
            },
            secCode: {
                required: "<br>Please enter your security code",
                minlength: "<br>Security code must be 3 numbers",
				number: "<br>Please enter a valid number"
            },
        },

        // Submit action when the form is valid and submitted.  Calls submitCart()
        submitHandler: function(form) {
            submitCart();
        }
    });
});
//  Function that builds the cart
function createCart() {
    let i;
    let total = 0;
    let th = "<tr><th>Item Name</th><th>Quantity</th><th>Price</th><th></th><tr>";

    $("#cartItems").empty();
    $("#total").empty();
    $("#cartItems").append(th);

	//  for loop that adds every item into the cart with an attached button to remove the item
    for (i = 0; i < cart.items.length; i++) {
        let totalItems = 0;
        let name = cart.items[i].name;
        let amount = cart.items[i].amount;
        let price = cart.items[i].price;
        let itemCost = price * amount;
        let nameTd1 = "<tr><td>" + name + "</td>";
        let amountTd1 = "<td>" + amount + " x $" + price + ".00</td>";
        let priceTd1 = "<td>" + "$" + itemCost + ".00</td>";
		
		total += itemCost;
		
        $("#cartItems").append(nameTd1 + amountTd1 + priceTd1 + '<td><button class="removeButton" id="remove' + i + '">Remove Item</button></td></tr>');
		
		//  Adds function to remove an item to the "Remove Item" buttons
        $("#remove" + i).on("click", function() {
            let deletedID = ($(this).attr('id')).substring(6);
            cart.items[deletedID].amount = 0;
            cart.items.splice(deletedID, 1);
            createCart();
            $("#cartSize").empty();
			
			// for loop to get a new count of total items after removing one
            for (i = 0; i < cart.items.length; i++) {
                let amountOfItem = cart.items[i].amount;
                totalItems += +amountOfItem;
            }
			//  Animation for the cart when updated
            $("#cart, #cartSize").addClass("pulse").delay(800).queue(function(next) {
                $(this).removeClass("pulse");
                next();
            });
			// Update total items in cart
            $("#cartSize").append(totalItems);
        });
    }
    $("#total").append("Total Price: $" + total + ".00");
}

// Function to submit the cart
function submitCart() {
	
    let requestURL = "http://www.tomiheimonen.info/wd211/apis/customer-checkout.php";
	
	if(cart.items.length < 1){
		$("#total").empty();
		$("#total").prepend("Your cart is empty!<br>Please add items to your cart.<br>").delay(800).queue(function(next) {
			$(this).removeClass("pulse");
			next();
		});
		$("#total").addClass("pulse");
	} else {
	
		//  Gets values to be submitted with the post request
		cart.email = $("#emailAddress").val();
		cart.creditCard = $("#creditCard").val();
		cart.expirationDate = $("#expDate").val();
		cart.securityCode = $("#secCode").val();

		//  Sends the request with the info, runs the function with the response
		$.post(requestURL, {
					items: cart.items,
					email: cart.email,
					creditCard: cart.creditCard,
					expirationDate: cart.expirationDate,
					securityCode: cart.securityCode
			},
			//  Notifies user of success
			function(data) {
				$("#total").empty();
				$("#total").prepend("Your order has been placed!");
				$("#total").addClass("pulse");
				$("#submit").remove();
			})
			// Function that runs if request failed
			.fail(function() {
				$("#error").empty();
				$("#error").append("There was an error.<br>Please try again<br>");
			});
	}
}

//  Function to add an item with an amount
function addItem(item, amount, placeholder) {
    let totalItems = 0;
	
	//  If to check if the entry was valid.  Gives feedback to user if not
	if (amount > 0) {

		$("#cartSize").empty();
		changePlaceholder(placeholder);
		
		//  Adds the item to the cart if none currently.  Adds to the item.amount if the item already exists
		if (item.amount == 0) {
			cart.addMenuItem(item);
			item.amount = amount;
		} else {
			item.amount = +item.amount + +amount;
		}
		//  For loop that counts the total number of items the user has added
		for (i = 0; i < cart.items.length; i++) {
			let amountOfItem = cart.items[i].amount;
			totalItems += +amountOfItem;
		}
	
		//  Updates the cart counter and plays an animation to provide feedback to the user
		$("#cart, #cartSize").addClass("pulse").delay(800).queue(function(next) {
			$(this).removeClass("pulse");
			next();
		});
		$("#cartSize").append(totalItems);
	} else {
		incorrectEntry(placeholder);
    }
}

//  Gives user a message that the item was successfully added
function changePlaceholder(inputField){
	$("#" + inputField).val("");
	$("#" + inputField).attr("placeholder", "Added to Cart!");
	$("#" + inputField).css("background-color", "initial");
}

//  Gives error message
function incorrectEntry(inputField){
	$("#" + inputField).css("background-color", "#ff9696");
	$("#" + inputField).attr("placeholder", "Enter Amount");
}

// Function to change store
function changeStore(store) {
    $("#yourStore").empty();
    $("#changeStoreP").empty();
    $(yourStore).append("Your Store: " + store);
    $("#changeStoreP").append("Change Store");
    $("#storeSelector").toggle(200);
    cart.store = store;
}
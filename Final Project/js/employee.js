$(document).ready(function() {

	// Prevents jQuery's onkeyup listener for personal preference
    $.validator.setDefaults({
        onkeyup: function(element) {
            if (element.name == '#validationForm') {
                return false;
            }
        }
    });

	//  jQuery validation
    $("#validateEmployee").validate({

        // Validation rules
        rules: {
            employeeID: {
                required: true,
                minlength: 8,
                pattern: /^[a-z_\-]+$/
            },
            password: {
                required: true,
                pattern: /(?=.*[A-Z]{1,})(?=.*[0-9]{1,})(?=.{8,})/
            }
        },

        // Error messages for rules
        messages: {
            employeeID: {
                required: "<br>Please enter a valid ID",
                minlength: "<br>ID must be exactly 8 lowercase characters",
                pattern: "<br>ID must contain lowercase letters only"
            },
            password: {
                required: "<br>Please enter your password",
                pattern: "<br>Invalid password"
            },
        },
        
		//  Submit action when the form is valid and submitted.  Calls submitID()
        submitHandler: function(form) {
            submitID();
        }
    });

    // Selects Stevens Point as store and changes orders accordingly
    $("#stevensPoint").click(function() {
        selectStore("Stevens Point");
    });

    // Selects Wausau as store and changes orders accordingly
    $("#wausau").click(function() {
        selectStore("Wausau");
    });

    // Selects Green Bay as store and changes orders accordingly
    $("#greenBay").click(function() {
        selectStore("Green Bay");
    });

    // Opens store selector to change store.  Hides previous store's orders too
    $("#changeStoreP").click(function() {
        $("#cartDiv").slideUp(200);
        $("#storeSelector").show(200);
        $("#orders").hide();
        $("#orders").empty();
    });
});

// Function called when a new store is selected.  Empties current orders displayed and calls request() to get new orders
function selectStore(store) {
    $("#yourStore").empty();
    $("#changeStoreP").empty();
    $("#yourStore").append("Your Store: <b>" + store);
    $("#changeStoreP").append("Change Store");
    $("#storeSelector").toggle(200);

    request();

    $("#orders").show();
}

//  Function to close an order once completed
function submitID() {

    // Gets the value of the input
    let employeeID = $("#employeeID").val();
    let employeePW = $("#password").val();
    let requestURL = "http://www.tomiheimonen.info/wd211/apis/employee-login.php";

	// Post request
    $.post(requestURL, {
            username: employeeID,
            password: employeePW
        }, function(data) {
            $("#employeeLogin").slideUp(200);
            $("#storeSelector").toggle(200);
        })
		// Function that runs if request failed
        .fail(function() {
			$("#error").empty();
            $("#error").append("Incorrect ID or Password");
        });
}

//  Function to fetch orders.  Defaulted at 3 orders
function request() {
	
    let requestURL = "http://www.tomiheimonen.info/wd211/apis/employee-get-orders.php?quantity=" + 3;
	
	//  Get request.  Creates the orders if successful
    $.getJSON(requestURL, function(data) {
        $("#error").empty();
        
		// for loop that takes the response and creates the layout.
		for (i = 0; i < data.length; i++) {
			let email = data[i].email;
			let items = data[i].items;
			let orderDate = data[i].orderDate;
			let ID = i;
			let totalPrice = data[i].totalPrice;
			let header = document.createElement("h2");
			header.className = "hborder";
			header.id = "order" + i;
			let headerText = document.createTextNode("Order " + i + " Status: Waiting");
			let table = document.createElement("table");
			table.id = "orderInfo" + i;
			table.className = "orderInfo";
			let selectList = document.createElement("select");

			let emailCellRow = "<tr><td>Email Address: " + email + "</td></tr>";
			let itemCellRow = "<tr><td>Items: " + items + "</td></tr>";
			let orderDateRow = "<tr><td>Order Date: " + orderDate + "</td></tr>";
			let IDRow = "<tr><td>Order ID: " + ID + "</td></tr>";
			let totalPriceRow = "<tr><td>Total Price: " + totalPrice + "</td></tr>";

			$("#orders").append(header);
			header.appendChild(headerText);
			$("#orders").append(table);

			$("#orderInfo" + i).append(emailCellRow + itemCellRow + orderDateRow + IDRow + totalPriceRow + '<tr><td>' +
				'<select class="status"><option selected="selected" disabled>Select Status</option><option value="Waiting">Waiting</option>' +
				'<option value="In Preparation">In Preparation</option><option value="Ready For Pickup">Ready For Pickup</option></select></td></tr>' +
				'<tr><td><button id="change' + i + '">Change</button></td></tr>' +
				'<tr><td><button id="close' + i + '">Close Order</button></td></tr>');
		}
		
		//  Call functions to close orders
		$("#close0").on("click", function() {
			closeOrder(0);
		});
		$("#close1").on("click", function() {
			closeOrder(1);
		});
		$("#close2").on("click", function() {
			closeOrder(2);
		});
		
		//  Call functions to change order statuses
		$("#change0").on("click", function() {
			change(0);
		});
		$("#change1").on("click", function() {
			change(1);
		});
		$("#change2").on("click", function() {
			change(2);
		});
    })
		// Function that runs if request failed
		.fail(function() {
			$("#orders").empty();
            $("#orders").append("<br>There was an error with the request.<br>Please reload the page or select a different store.<br>");
        });
}

// Function to close orders
function closeOrder(i) {

    let requestURL = "http://www.tomiheimonen.info/wd211/apis/employee-order-delete.php?orderID=" + 1;
	
	// Get request to close order.  Removes order if successful
    $.get(requestURL, function(data) {
            $("#order" + i).remove();
            $("#orderInfo" + i).remove();
        })
		// Function that runs if request failed
		.fail(function() {
            $("#order" + i).append("<br>There was an error.<br>Please try again<br>");
        });
}

//  Function to change the order status
function change(order) {
    let status = $(".status").val();
    $("#order" + order).empty();
    $("#order" + order).append("Order " + order + " Status: " + status);
}
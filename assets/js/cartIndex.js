$(document).ready(function (){

	get_cart_qnty();
	get_item_qnty();

	$('[data-role=add-cart]').on('click', function() {
		var item_id = $(this).data('id');
		add_to_cart(item_id);
	});

	$('[data-qnty-id]').on('change', function() {
		var item_id = $(this).data('qnty-id');
		if ($('[data-cart-status-id='+item_id+']').val() == '1'){
			add_to_cart(item_id);
		}
		update_item_price(item_id);
	});

	$('[data-role=remove-list-item]').on('click', function() {
		var item_id = $(this).data('remove-id');
		remove_list_item(item_id);
	});
	
});


// Add to Cart ######################################################################
function add_to_cart(item_id){

	var item_qnty 	= $('[data-qnty-id='+item_id+']').val();

	var url 		= 'https://nijamsorganicshop.com/ajax/cart';
	var data 		= { item_id: item_id, item_qnty: item_qnty, action: 'add-to-cart' };
	var post 	 	= $.post( url, data );
	loading_start(item_id);

	post.done(function( data ) {
		var result = jQuery.parseJSON(data);
		var item_id = result.item_id;
		$('[data-cart-status-id='+item_id+']').val('1');
		update_item_status(item_id);
		get_cart_qnty();
		loading_stop(item_id);
		update_item_price(item_id);
	});
	
}
// ##################################################################################

// Get Cart Quantity ################################################################
function get_cart_qnty(){

	var url 		= 'https://nijamsorganicshop.com/ajax/cart';
	var data 		= { action: 'get-cart-qnty' };
	var post 	 	= $.post( url, data );

	post.done(function( data ) {
		var result = jQuery.parseJSON(data);
		$('[data-role=total_cart_qnty]').text(result.total_qnty);
	});
}
// ##################################################################################

// Get Item Quantity ################################################################
function get_item_qnty(){

	var url 		= 'https://nijamsorganicshop.com/ajax/cart';
	var data 		= { action: 'get-item-qnty' };
	var post 	 	= $.post( url, data );

	post.done(function( data ) {
		var result = jQuery.parseJSON(data);
		var cart_list = result.cart_list;
		$.each(cart_list, function (key, value) {
		    
		    var item_id = value.cart_product_id;
		    var product_qnty = value.cart_product_qnty;

		    $('[data-qnty-id='+item_id+']').val(product_qnty);
		    $('[data-cart-status-id='+item_id+']').val('1');

		    update_item_status(item_id);

		});
	});
}
// ##################################################################################

// Remove list Item #################################################################
function remove_list_item(item_id){

	var url 		= 'https://nijamsorganicshop.com/ajax/cart';
	var data 		= { item_id: item_id, action: 'remove-item' };
	var post 	 	= $.post( url, data );
	loading_start(item_id);

	post.done(function( data ) {
		var result = jQuery.parseJSON(data);
		var item_id = result.item_id;
		$('[data-cart-status-id='+item_id+']').val('0');
		$('[data-qnty-id='+item_id+']').val('1');
		update_item_status(item_id);
		get_cart_qnty();
		loading_stop(item_id);		
	});
	
}
// ##################################################################################

// Update item status ###############################################################
function update_item_status(item_id){

	var item_status = $('[data-cart-status-id='+item_id+']').val();
	if (item_status == 0){
		$('[data-role=add-cart][data-id='+item_id+']').removeClass('added');
	    $('[data-role=add-cart][data-id='+item_id+'] span').html('Add');
	   	$('[data-role=remove-list-item][data-remove-id='+item_id+']').addClass('d-none');
	} else {
		$('[data-role=add-cart][data-id='+item_id+']').addClass('added');
	    $('[data-role=add-cart][data-id='+item_id+'] span').html('Added');
	   	$('[data-role=remove-list-item][data-remove-id='+item_id+']').removeClass('d-none');
		
	}
	update_item_price(item_id);
	get_cart_qnty();

}
// ##################################################################################

// Update item Price ################################################################
function update_item_price(item_id){

	var item_qnty 	= $('[data-qnty-id='+item_id+']').val();
	var item_price = parseInt($('[data-price-id='+item_id+']').html());
	if (item_qnty != 1){
		var total_price = item_qnty * item_price;
		
		$('[data-tprice-id='+item_id+']').html(total_price);
		$('[data-sprice-id='+item_id+']').html(item_price);
		$('[data-tqnty-id='+item_id+']').html(item_qnty);
		// $('[data-role=add-cart][data-id='+item_id+'] span').html('Added');
		$('[data-price-box-id='+item_id+']').removeClass('invisible').addClass('visible');
	} else {
		$('[data-price-box-id='+item_id+']').removeClass('visible').addClass('invisible');
	}
	get_cart_qnty();

}
// ##################################################################################


// Loading ##########################################################################
function loading_start(item_id){
	$('[data-role=loading][data-load-id='+item_id+']').removeClass('d-none');
	$('[data-role=remove-list-item][data-remove-id='+item_id+']').addClass('d-none');
}
// ---------------------------------------------------------------------------------
function loading_stop(item_id){
	var item_status = $('[data-cart-status-id='+item_id+']').val();
	$('[data-role=loading][data-load-id='+item_id+']').addClass('d-none');
	if (item_status != 0){
		$('[data-role=remove-list-item][data-remove-id='+item_id+']').removeClass('d-none');
	}
}
// ##################################################################################


















// function update_cart (){
	
// 	var url 		= 'https://nijamsorganicshop.com/ajax/get-cart';
// 	var post_cart 	= $.post( url);

// 	post_cart.done(function( data ) {
// 		var result = jQuery.parseJSON(data);
// 		$('[data-role=total_cart_qnty]').text(result.total_qnty) ;

// 		var cart_list = result.cart_list;
// 		$.each(cart_list, function (key, value) {
		    
// 		    var item_id = value.cart_product_id;
// 		    var product_qnty = value.cart_product_qnty;

// 		    $('[data-qnty-id='+item_id+']').val(product_qnty);

// 		    // $('[data-cart-status-id='+item_id+']').addClass('confirm');
// 		    $('[data-role=add-cart][data-id='+item_id+']').addClass('added');
// 		    $('[data-role=add-cart][data-id='+item_id+'] span').html('Added');
// 		   	$('[data-cart-status-id='+item_id+']').val('1');
// 		   	$('[data-role=remove-cart][data-remove-id='+item_id+']').removeClass('d-none');
// 		});
// 	});
// }
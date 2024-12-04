/**
 * cart.js
 */

$(function(){
	$(".nav-link.cart").click(function(){
			
			var goodsName = $("#goodsName").text();
			var cartQty = $("#quantity").val();
			
			$.ajax({
				type: "POST",
				url: "../cart/cartAdd",
				data: {goodsName: goodsName, cartQty: cartQty},
				success: function(){
					alert("장바구니에 추가되었습니다.");
				},
				error: function(){
					alert("로그인이 필요합니다.");
					window.location = "../login/loginPage";
				}
			})
			
		})
		
	$(".quantity-left-minus").click(function(){
		let cartQty = $(this).closest(".input-group").find("#quantity").val();
		var goodsName = $(this).closest(".list-group-item").find("#goodsName").val();
		let goodsPrice = $(this).closest(".list-group-item").find(".price").val();
		let totalPrice = cartQty * goodsPrice;
		
		$.ajax({
			type: "POST",
			url: "/cart/cartList",
			data: {goodsName:goodsName, cartQty: cartQty},
			success: function(){
				$(".text-body-secondary.price").html(totalPrice);
			},
			error: function(){
				alert("로그인이 필요합니다.");
				window.location.href = "/login/loginPage";
			}
		})
	})
	$(".quantity-right-plus").click(function(){
			let cartQty = $(this).closest(".input-group").find("#quantity").val();
			var goodsName = $(this).closest(".list-group-item").find("#goodsName").val();
			let goodsPrice = $(this).closest(".list-group-item").find(".price").val();
			let totalPrice = cartQty * goodsPrice;
			
			$.ajax({
				type: "POST",
				url: "/cart/cartList",
				data: {goodsName:goodsName, cartQty: cartQty},
				success: function(){
					$(".text-body-secondary.price").html(totalPrice);
				},
				error: function(){
					alert("로그인이 필요합니다.");
					window.location.href = "/login/loginPage";
				}
			})
		})
		
		$("#allCheck").on("change", function(){
			
			var total = 0;
			
			if($(this).prop('checked')){
				$("#checkbox").prop('checked', true);
				
				$(".text-body-secondary.price").each(function(){
					total += parseInt($(this).text());
					
					$("#total").text(total);
				})
			}else {
				$("#checkbox").prop('checked', false);
				total = 0;
				$("#total").text(total);
			}
		})
		
		$("#checkbox").on("change", function(){
			
			var total = $("#total").text();
			
			if($("#checkbox:checked").length === $("#checkbox").length){
				$("#allCheck").prop('checked', true);
				
				$(".text-body-secondary.price").each(function(){
					total += parseInt($(this).text());
					
					$("#total").text(total);
				})
			}else {
				$("#allCheck").prop('checked', false);
				
				total = 0;
				$("#total").text(total);
			}
			
		})
		
			
})
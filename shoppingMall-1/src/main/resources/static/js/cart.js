/**
 * cart.js
 */

//장바구니
$(function(){
	$(".info").hide();
	
	$(".nav-link.cart").click(function(){
			
			var goodsName = $(this).closest(".product-item").find("#goodsName").text();
			var cartQty = $("#quantity").val();
			
			if(cartQty > 0){
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
			}else {
				alert("하나 이상의 상품을 담아주세요.");
			}
		})
	
	//장바구니 수량 감소
	$(".quantity-left-minus.btn.btn-danger.btn-number.cart").click(function(){
		let cartQty = $(this).closest(".input-group").find("#quantity").val();
		var goodsName = $(this).closest(".list-group-item").find("#goodsName").val();
		let goodsPrice = $(this).closest(".list-group-item").find(".price").val();
		let totalPrice = cartQty * goodsPrice;
		//변경할 텍스트
		var totalText = $(this).closest(".list-group-item").find(".text-body-secondary.price");
		
		$.ajax({
			type: "POST",
			url: "/cart/cartList",
			data: {goodsName:goodsName, cartQty: cartQty},
			success: function(){
				$(totalText).html(totalPrice);
			},
			error: function(){
				alert("로그인이 필요합니다.");
				window.location.href = "/login/loginPage";
			}
		})
	})
	//장바구니 수량 증가
	$(".quantity-right-plus.btn.btn-success.btn-number.cart").click(function(){
			let cartQty = $(this).closest(".input-group").find("#quantity").val();
			var goodsName = $(this).closest(".list-group-item").find("#goodsName").val();
			let goodsPrice = $(this).closest(".list-group-item").find(".price").val();
			let totalPrice = cartQty * goodsPrice;
			//변경할 텍스트
			var totalText = $(this).closest(".list-group-item").find(".text-body-secondary.price");
			
			$.ajax({
				type: "POST",
				url: "/cart/cartList",
				data: {goodsName:goodsName, cartQty: cartQty},
				success: function(){
					$(totalText).html(totalPrice);
				},
				error: function(){
					alert("로그인이 필요합니다.");
					window.location.href = "/login/loginPage";
				}
			})
		})
		
		//checkbox 합계 변동
		let total;
		
		//전체 checkbox : allCheck
		$("#allCheck").on("change", function(){
			total = 0;
			
			if($(this).prop('checked')){
				
				$(".checkbox").prop('checked', true);
				
				$(".text-body-secondary.price").each(function(){
					total += parseInt($(this).text());
					
					$("#total").text(total);
				})
			}else {
				
				$(".checkbox").prop('checked', false);
				
				total = 0;
				$("#total").text(total);
			}
		})
		
		//부분 checkbox
		$(".checkbox").on("change", function(){
			total = parseInt($("#total").text());
			var checkPrice = 0;
			
			//allCheck 활성화 비활성화
			// 모든 checkbox 활성화
			if($(".checkbox:checked").length === $(".checkbox").length){
				
				$("#allCheck").prop('checked', true);
				
				$(".text-body-secondary.price").each(function(){
					total += parseInt($(this).text());
					
					$("#total").text(total);
				})
			}else{
				$("#allCheck").prop('checked', false);
			}
			
			
			//////////////////////
			
			total = 0;
			//개별 checkbox 합산 가격
			$(".checkbox:checked").each(function(){
				
				checkPrice = 
				$(this).closest(".list-group-item").find(".text-body-secondary.price").text();
				
				total += parseInt(checkPrice);
			
				$("#total").text(total);
			})
			
			//////////////////////
			
			//checkbox 0개
			if($(".checkbox:checked").length === 0){
				$("#allCheck").prop('checked', false);
							
				$("#total").text(total);
			}
			
		})
		
		//장바구니 -> 구매하기
		$(".w-100.btn.btn-primary.btn-lg").click(function(){
			$(".info").show();
			$(".w-100.btn.btn-primary.btn-lg").hide();
			$(".w-100.btn.btn-primary.btn-lg.info").show();
			
		})
		
		$(".w-100.btn.btn-primary.btn-lg.info").click(function(){
		var items = [];
		var info = {};
									
		$(".checkbox:checked").each(function(){
			var itemNum = $(this).closest(".list-group-item").find("#goodsNum").val();
			var itemQty = $(this).closest(".list-group-item").find("#quantity").val();
			let itemPrice 
			= parseInt($(this).closest(".list-group-item").find(".text-body-secondary.price").text());
			
			items.push ({ "goodsNum": itemNum, "cartQty": itemQty, "unitPrice": itemPrice});
		})
		
		var deliveryName = $("#deliveryName").val();
		var deliveryPhone = $("#deliveryPhone").val();
		
		var deliveryPost = $("#deliveryPost").val();
		var deliveryAddr = $("#deliveryAddr").val();
		var deliveryAddrDetail = $("#deliveryAddrDetail").val();
		
		var message = $("#message").val();
		
		info = {
		     "deliveryName": deliveryName , 
		   "deliveryPhone": deliveryPhone , 
		     "deliveryPost": deliveryPost ,
		    "deliveryAddr": deliveryAddr ,
		     "deliveryAddrDetail": deliveryAddrDetail ,
		     "message": message };
		
		var data = {
			"items": items,
			"info" : info
		};
		
		$.ajax({
			type: "POST",
			url: "/purchase/info",
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function(purchaseNum){
				$.ajax({
					type: "GET",
					url: "/purchase/payment",
					contentType: 'application/json',
					data: 
						{
							purchaseNum:purchaseNum
						},
					success: function(){
						window.location.href = "/purchase/payment?purchaseNum=" + purchaseNum;
					}, 
					error: function(){
						alert("서버 오류");
					}
				})
			}, 
			error: function(){
				alert("서버 오류");
			}
		})
		})
		
})
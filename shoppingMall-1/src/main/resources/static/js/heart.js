/**
 * 찜하기
 */
$(function(){
	$(".btn-wishlist").click(function(){
		if($(this).find("svg use").attr('xlink:href') === '#heart'){
			$(this).find("svg use").attr('xlink:href', '#heart-filled');
			
			var goodsName = $(this).data('goods-name');
			
			//wish Table에 추가하기
			$.ajax({
				type: "POST",
				url: "heart/heartAdd",
				data: {goodsName: goodsName},
				success: function(){
				}, error: function(){
					alert("로그인이 필요합니다.");
					window.location.href = "login/loginPage";
				}
			})
		}
		else if($(this).find('svg use').attr('xlink:href') === '#heart-filled'){
			$(this).find('svg use').attr('xlink:href', '#heart'); 
			
			var goodsName = $(this).data('goods-name');
			
			//wish table에서 삭제하기
			$.ajax({
				type: "POST",
				url: "heart/heartDel",
				data: {goodsName: goodsName},
				success: function(){
					
				},
				error: function(){
					alert("로그인이 필요합니다.");
					window.location.href = "login/loginPage";
				}
				
			})
		}
	})
});
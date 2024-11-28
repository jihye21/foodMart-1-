/**
 * 찜하기
 */
$(function(){
	$(".btn-wishlist").click(function(){
		if($("#heart").attr('xlink:href') === '#heart'){
			alert("하트입니다.");
		}
	})
});
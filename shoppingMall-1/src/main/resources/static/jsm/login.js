jQuery(window).ready(function() {
	var initView = function() {
		initEvent();
	}
	var initEvent = function() {
		$('.btn_m_c1').click(function(e){
			loginProcess();
		});
		$('#userId').keypress(function(e){
			$('#userId').removeClass('on');
			$('#userId').addClass('off');
			$('.ment').text('');
			if (e.keyCode == 13) {
				var userId = $('#userId').val().trim();
				if (webj.isNotEmptyString(userId)) {
					loginProcess();	
				}
				return false;
			}
		});
		$('.webj-btn-login-by-facebook').click(function(e){///dialog/oauth?client_id='+oauthKeyFacebook+'&redirect_uri='+document.location.href+'/oauth/facebook&state='+$("meta[name='_csrf']").attr("content")
			window.open('https://www.facebook.com/v11.0', '', 'width=590, height=720');
		});
		$('.webj-btn-login-by-naver').click(function(e){ ///authorize?client_id='+oauthKeyNaver+'&response_type=code&redirect_uri='+document.location.href+'/oauth/naver
			window.open('https://nid.naver.com/oauth2.0','', 'width=770, height=620');
		});
		$('.webj-btn-login-by-kakao').click(function(e){///authorize?client_id='+oauthKeyKakao+'&redirect_uri='+document.location.href+'/oauth/kakao&response_type=code
			window.open('https://kauth.kakao.com/oauth', '', 'width=480, height=520');
		});
	}
	
	// Process
	var loginProcess = function() {
		var userId = $('#userId').val().trim();
		if (userId == null) {
			$('#userId').removeClass('off');
			$('#userId').addClass('on');
			$('.ment').text('아이디를 입력해 주세요.');
			$('#userId').focus();
			return;
		}
		
		var userPw = $('#userPw').val().trim();
				if (userPw == null) {
					$('#userPw').removeClass('off');
					$('#userPw').addClass('on');
					$('.ment').text('비밀번호를 입력해 주세요.');
					$('#userPw').focus();
					return;
				}
				
		$.ajax({
			type: 'POST',
			url: 'loginCheck',
			data: {userPw:userPw, userId:userId},
			success: function(){
				location.replace("/");
			},
			error: function(){
				alert("다시 로그인해주세요");
			}
			
		});
	
	}
	
	initView();
});
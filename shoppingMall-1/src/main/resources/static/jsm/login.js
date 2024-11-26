jQuery(window).ready(function() {
	var initView = function() {
		initEvent();
		initEmail();
	}
	var initEvent = function() {
		$('.btn_m_c1').click(function(e){
			loginProcess();
		});
		$('#email').keypress(function(e){
			$('#email').removeClass('on');
			$('#email').addClass('off');
			$('.ment').text('');
			if (e.keyCode == 13) {
				var email = $('#email').val().trim();
				if (webj.isNotEmptyString(email)) {
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
	var initEmail = function() {
		var loginEmail = webj.getCookie('webjangi_login_email');
		if (webj.isNotEmptyString(loginEmail)) {
			$('#email').val(loginEmail);
			//$('.ment').text('이전 로그인 이메일이 자동으로 입력되었습니다.');
		}
	}
	// Process
	var loginProcess = function() {
		var email = $('#email').val().trim();
		if (webj.isEmptyString(email)) {
			$('#email').removeClass('off');
			$('#email').addClass('on');
			$('.ment').text('이메일 주소를 입력해 주세요.');
			$('#email').focus();
			return;
		}
		if (!email.startsWith('webjangi_') && !webj.validateEmail(email)) {
			$('#email').removeClass('off');
			$('#email').addClass('on');
			$('.ment').text('잘못된 형식의 이메일입니다.');
			$('#email').focus();
			return;
		}
		ajaxGetRegisteredEmail(email, function(email){
			if (email) {
				webj.setCookie('webjangi_login_email', email);
				location.replace('/loginPassword');
			} else {
				webj.openWarningPopup('이메일 확인 또는 새 계정 만들어 주세요.', function(){
					$('#email').focus();
				});
				return;
			}
		});		
	}
	// Ajax
	var ajaxGetRegisteredEmail = function(email, callback) {
		webj.ajaxPost('/login/validateRegisteredEmailForLogin', {email:email}, function(data) {
	        if (data.result == 'success') {
	        	if (callback != null) {
	        		callback(data.email);
	        	}
	        } else {
	            $('.ment').text(data.resultMessage);
	        }
	    }); 
	}
	initView();
});
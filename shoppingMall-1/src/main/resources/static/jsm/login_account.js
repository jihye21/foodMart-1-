jQuery(window).ready(function() {
	var certNoTimeoutInterval;
	var certNoTimeoutText;
	var isCertEmail = false;
	
	//임시 회원가입
	//isCertEmail = false;
					$('#certiNum').removeClass('on');
					$('.create_account_step2').hide();
					$('.ment').text('이메일 인증이 필요합니다.');
					clearInterval(certNoTimeoutInterval);
					//$('.create_account_step3').fadeTo('slow',1);
					//$('.create_account_step4').fadeTo('slow',1);
					//$('.create_account_step5').fadeTo('slow',1);
	///////////////////
					
	var initView = function() {
		initEvent();
		$('.create_account_step1').fadeTo('slow',1);
		if (isApple()) {
			
			$('#email').prop('readonly', false);
			$('#certiNum').prop('readonly', false);
			$('#name').prop('readonly', false);
			$('#password1').prop('readonly', false);
			$('#password2').prop('readonly', false);
			$('#id').prop('readonly', false);
			$('#addr').prop('readonly', false);
			$('#addrDetail').prop('readonly', false);
		}
	}
	var initEvent = function() {
		$('.sendCertNoEmail').click(function(e){
			e.preventDefault();
			sendCertEmail();
		});
		$('#email').keyup(function(e){
			e.preventDefault();
			$('#email').removeClass('on');
			$('.ment').text('위 이메일로 인증문자가 발송됩니다.');
			
			if (!webj.validateEmail($('#email').val().trim())) {
				$('#email').addClass('on');
			}
			if (e.keyCode == 13) {
				var email = $('#email').val().trim();
				if (webj.isNotEmptyString(email)) {
					sendCertEmail();	
				}
			}
			
		});
		
		$('.webj-btn-cert-email').click(function(e){
			e.preventDefault();
			//checkEmailCertNo();
		});
		
		/*
		$('#certiNum').keyup(function(e){
			e.preventDefault();
			if (e.keyCode == 13) {
				var certNo = $('#certiNum').val().trim();
				if (webj.isNotEmptyString(certNo)) {
					checkEmailCertNo();
				}
			}
		});
		*/
		$('#name').keyup(function(e){
			e.preventDefault();
			$('#name').removeClass('on');
			$('.ment-name').hide();
		});
		$('#password').keyup(function(e){
			e.preventDefault();
			$('#password').removeClass('on');
			$('.ment-password').hide();
			$('#password1').removeClass('on');
			$('.ment-password1').hide();
			var validatePasswordResult = webj.validatePassword($('#password').val().trim());
			if (webj.isNotEmptyString(validatePasswordResult) && $(this).val().trim().length > 0) {
				$('#password').addClass('on');
				$('.ment-password').text('암호를 ' + validatePasswordResult);
				$('.ment-password').show();
				return;
			} else {
				$('#password').removeClass('on');
				$('.ment-password').text('');
				$('.ment-password').hide();
			}
		});
		$('#password2').keyup(function(e){
			e.preventDefault();
			$('#password').removeClass('on');
			$('.ment-password').hide();
			$('#password').removeClass('on');
			$('.ment-password1').hide();
			var validatePasswordResult = webj.validatePassword($('#password').val().trim());
			if (webj.isNotEmptyString(validatePasswordResult)) {
				$('#password').addClass('on');
				return;
			}
			if ($('#password').val().trim() != $('#password1').val().trim()) {
				$('#password1').addClass('on');
			}
		});
		$('.webj-btn-create-account').click(function(e){
			e.preventDefault();
			createAccount();
		});
		$('.webj-private-agreement').click(function(e){
			e.preventDefault();
			$('#agreePop').modal();
		});
		$('.webj-service-agreement').click(function(e){
			e.preventDefault();
			$('#servicePop').modal();
		});
	}
	var isApple = function() {
		var userAgent = navigator.userAgent.toLowerCase();
		return userAgent.indexOf("iphone") > -1 || userAgent.indexOf("ipad") > -1 || userAgent.indexOf("ipod") > -1;
	}
	// Process
	var sendCertEmail = function() {
		var email = $('#email').val().trim();
		if (webj.isEmptyString(email)) {
			$('#email').addClass('on');
			$('#email').val('');
			$('.ment').text('이메일 주소를 입력해 주세요.');
			$('#email').focus();
			return;
		}
		if (!webj.validateEmail(email)) {
			$('#email').addClass('on');
			$('.ment').text('잘못된 형식의 이메일입니다.');
			$('#email').focus();
			return;
		}
		window.webjModalPopup = true;
		$('#sendEmailProgress').modal();
		ajaxSendCertNoEmail(email, function(){
			window.webjModalPopup = false;
			$('#sendEmailProgress').modal({show:false});
			$('.ment').text('위 이메일로 인증문자가 발송되었습니다.');
			$('.sendCertNoEmail').text('재발송');
			$('#certiNum').val('');
			$('.create_account_step2').fadeTo('slow',1);
			if (certNoTimeoutInterval != null) {
				clearInterval(certNoTimeoutInterval);
			}
			$('.num').text('15:00');
			certNoTimeoutText = '15:00';
			certNoTimeoutInterval = setInterval(function(){
				var min = Number(certNoTimeoutText.split(':')[0]);
				var sec = Number(certNoTimeoutText.split(':')[1]);
				if (min == 0 && sec == 0) {
					$('.e_cert_no').hide();
					$('.ment').text('인증 메일을 재발송 해주세요.');
					clearInterval(certNoTimeoutInterval);
				}
				if (--sec < 0) {
					sec = 59;
					--min;
				}
				certNoTimeoutText =  min + ':' + String(sec).lpad(2, '0');
				$('.num').text(certNoTimeoutText);
			}, 1000);
		});		
	}
	/*
	var checkEmailCertNo = function() {
		var email = $('#account').val().trim();
		var certNo = $('#certiNum').val().trim();
		if (webj.isEmptyString(certNo)) {
			$('#certiNum').focus();
			return;
		}
		ajaxCheckEmailCertNo(email, certNo, function(certNo){
			if (certNo != undefined) {
				isCertEmail = true;
				$('#certiNum').removeClass('on');
				$('.create_account_step2').hide();
				$('.ment').text('이메일 인증이 완료되었습니다.');
				clearInterval(certNoTimeoutInterval);
				$('.create_account_step3').fadeTo('slow',1);
				$('.create_account_step4').fadeTo('slow',1);
				$('.create_account_step5').fadeTo('slow',1);
			} else {
				$('.ment').text('인증문자가 올바르지 않습니다.');
			}
		});
	}
	*/
	
	var createAccount = function() {
		var userName = $('#name').val().trim();
		if (webj.isEmptyString(userName)) {
			$('#name').addClass('on');
			$('.ment-name').text('사용자이름을 입력해 주세요.');
			$('.ment-name').show();
			$('#name').focus();
			return;
		}
		var password = $('#password').val().trim();
		if (webj.isEmptyString(password)) {
			$('#password').addClass('on');
			$('.ment-password').text('암호를 입력해 주세요.');
			$('.ment-password').show();
			$('#password').focus();
			return;
		}
		var password1 = $('#password1').val().trim();
		if (webj.isEmptyString(password1)) {
			$('#password1').addClass('on');
			$('.ment-password1').text('암호확인을 입력해 주세요.');
			$('.ment-password1').show();
			$('#password1').focus();
			return;
		}
		if (password != password1) {
			$('#password').addClass('on');
			$('.ment-password').text('암호가 일치하지 않습니다.');
			$('.ment-password').show();
			return;
		}
		var validatePasswordResult = webj.validatePassword(password1);
		if (webj.isNotEmptyString(validatePasswordResult)) {
			$('#password1').addClass('on');
			$('.ment-password1').text('암호를 ' + validatePasswordResult);
			$('.ment-password1').show();
			return;
		}
		if (!$('#c1').prop('checked')) {
        	$('#modalAlertText').text('필수 약관을 동의해 주세요.');
        	$('#modalAlert').modal();
			return;
		}
		if (!$('#c2').prop('checked')) {
        	$('#modalAlertText').text('필수 약관을 동의해 주세요.');
        	$('#modalAlert').modal();
			return;
		}
		
		
		/*
		$.getJSON('https://ipapi.co/jsonp?callback=?', function(data){
			var member = {};
			member.userName = userName;
			member.userId = member.email = $('#account').val().trim();
			member.userPw = md5(password1);
			member.ipAddr = data.ip;
			ajaxCreateAccount(member, function(){
				location.replace('/');
			});
		});
		*/
	}
	
	var ajaxSendCertNoEmail = function(email) {
	    $.ajax({
	        type: "POST",
	        url: "sendEmail",
	        data: {email: email},
	        success: function() {
	            $('#sendEmailProgress').modal({show:false});
				
				isCertEmail = true;
				$('.ment').text('이메일 인증이 완료되었습니다.');
				$('.sendCertNoEmail').prop('disabled', true);
				$('.sendCertNoEmail').text('인증완료');
				$('#email').prop('readonly', true);
				clearInterval(certNoTimeoutInterval);
				$('.create_account_step3').fadeTo('slow',1);
				$('.create_account_step4').fadeTo('slow',1);
				$('.create_account_step5').fadeTo('slow',1);
				
	        },
	        error: function(error) {
	            alert("서버 에러: " + error); 
	        }
	        
	    });
	}
	/*
	// Ajax
	var ajaxSendCertNoEmail = function(email, callback) {
		webj.ajaxPost('sendEmail', {email:email}, function(data) {
	        if (data.result == 'success') {
	        	if (callback != null) {
	        		callback();
	        	}
	        } else {
	        	$('#sendEmailProgress').modal({show:false});
	        	$('#modalAlertText').text(data.resultMessage);
	        	$('#modalAlert').modal();	
	        }
	    }); 
	}
	*/
	/*
	var ajaxCheckEmailCertNo = function(email, certNo, callback) {
		webj.ajaxPost('/login/checkEmailCertNumber', {email:email, certNumber:certNo}, function(data) {
	        if (data.result == 'success') {
	        	if (callback != null) {
	        		callback(data.certNumber);
	        	}
	        } else {
	            webj.openErrorPopup(data.resultMessage, data.stackTrace);
	        }
	    }); 
	}
	*/
	/*
	var ajaxCreateAccount = function(param, callback) {
		$.ajax({
			type: "POST",
			url: "createAccount",
			data: {"userID":param},
			sucess: function(){
				alert("회원가입이 완료되었습니다.");
			},
			error: function(){
				alert("서버 오류");
			}
			
		});
		
		
		webj.ajaxPost('/signup/createAccount', param, function(data) {
	        if (data.result == 'success') {
	        	if (callback != null) {
	        		callback();
	        	}
	        } else {
	            alert(data.resultMessage);
	        }
	    }); 
		
	}
	*/
	initView();
});
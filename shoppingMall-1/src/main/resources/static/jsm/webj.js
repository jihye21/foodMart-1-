$('#detectIEjs').remove();

webj = window.webj || {};

// Configuration

webj.timeout = false;

// JQuery

(function ($) {
    $.each(['show', 'hide'], function (i, ev) {
      var el = $.fn[ev];
      $.fn[ev] = function () {
        this.trigger(ev);
        return el.apply(this, arguments);
      };
    });
})(jQuery);

// Javascript

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};
Array.prototype.remove = function (index) {
    this.splice(index, 1);
};
Array.prototype.last = function() {
    return this[this.length - 1];
};
Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};
/**
 * Converts number into currency format
 * @param {number} number   Number that should be converted.
 * @param {string} [decimalSeparator]    Decimal separator, defaults to '.'.
 * @param {string} [thousandsSeparator]    Thousands separator, defaults to ','.
 * @param {int} [nDecimalDigits]    Number of decimal digits, defaults to `2`.
 * @return {string} Formatted string (e.g. numberToCurrency(12345.67) returns '12,345.67')
 */
Number.prototype.formatCurrency = function(decimalSeparator, thousandsSeparator, nDecimalDigits){
    //default values
    decimalSeparator = decimalSeparator || '.';
    thousandsSeparator = thousandsSeparator || ',';
    nDecimalDigits = nDecimalDigits == null? 2 : nDecimalDigits;
    var fixed = this.toFixed(nDecimalDigits), //limit/add decimal digits
        parts = new RegExp('^(-?\\d{1,3})((?:\\d{3})+)(\\.(\\d{'+ nDecimalDigits +'}))?$').exec( fixed ); //separate begin [$1], middle [$2] and decimal digits [$4]
    if(parts){ //number >= 1000 || number <= -1000
        return parts[1] + parts[2].replace(/\d{3}/g, thousandsSeparator + '$&') + (parts[4] ? decimalSeparator + parts[4] : '');
    }else{
        return fixed.replace('.', decimalSeparator);
    }
}
Number.prototype.formatCommaInteger = function(){
	return this.formatCurrency('.',',',0);
}
String.prototype.getBytes = function () {
    var bytes = [];
    for (var i = 0; i < this.length; ++i) {
        bytes.push(this.charCodeAt(i));
    }
    return bytes;
};
String.prototype.isAlphaNumeric = function() {
	return this.match(/^[A-Za-z0-9]+$/);
};
String.prototype.isNumeric = function() {
	return this.match(/^[0-9]+$/);
};
String.prototype.isEmpty = function() {
	return this == null || this == undefined || (this != null && this.trim().length == 0);
};
String.prototype.isNull = function() {
	return this == null || this == undefined;
};
String.prototype.nvl = function(a) {
	return (this == null || this == undefined) ? a : this;
};
String.prototype.isNotEmpty = function() {
	return this != null && this != undefined && this.trim().length > 0;
};
String.prototype.base64encode = function() {
	return btoa(unescape(encodeURIComponent(this))); 
};
String.prototype.base64decode = function() {
	return decodeURIComponent(escape(atob(this))); 
};
String.prototype.lpad = function(padLen, padStr) {
    var str = this;
    if (padStr.length > padLen) {
    	zen.log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
        return str + "";
    }
    while (str.length < padLen)
        str = padStr + str;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
};
String.prototype.rpad = function(padLen, padStr) {
    var str = this;
    if (padStr.length > padLen) {
    	zen.log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
        return str + "";
    }
    while (str.length < padLen)
        str += padStr;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
};
String.prototype.capitalize = function() {
	  return this.charAt(0).toUpperCase() + this.slice(1);
}
String.prototype.getBytesLength = function() {
	  return this.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g,"$&$1$2").length;
}

// Event

window.onerror = function(msg, url, lineNo, columnNo, error) {
	console.log(msg, url, lineNo, columnNo, error);
	var errorMessage = '[Message] '+msg+'\n';
	errorMessage += '[Url] ' + url + '\n';
	errorMessage += '[Line Number] ' + lineNo + '\n';
	errorMessage += '[Column Number] ' + columnNo + '\n';
	errorMessage += '[Error] ' + error + '\n';
	errorMessage += '[Stack] ' + error.stack + '\n';
	webj.log(errorMessage);
	if (errorMessage.indexOf('jquery.cubeportfolio.min.js' != -1)) {
		return;
	}
	if (top.window.webj.openErrorPopup) {
		top.window.webj.openErrorPopup('JavaScript Error', errorMessage);	
	} else {
		alert(errorMessage);
	}
	return false;
};

// Util
webj.uploadImageMaxWidth = 1900;
webj.dataURLtoFile = function(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
webj.resizeUploadImage = async function(file, callback, maxWidthParam, maxHeightParam) {
	// convert heic/heif to jpg
    if (file.type === 'image/heic' || file.type === 'image/heif' || (file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif'))) {
        const fileName = file.name;
        file = await heic2any({
            blob: file,
            toType: 'image/jpeg'
        });
        file.name = fileName + '.jpg';
    }
	var reader = new FileReader();
    reader.onload = function(event) {
    	var dataUrl = event.target.result;
    	var img = document.createElement("img");
    	img.onerror = function() {
    		webj.openWarningPopup('이미지를 로드할 수 없습니다.<br/>올바른 이미지파일이 아닙니다.<br/>File Name : ' + file.name + '<br/>File Type : ' + file.type + '<br/>File Size : ' + file.size);
    	}
    	img.onload = function() {
    		if (img.width == 0 || img.height == 0) {
        		webj.openWarningPopup('이미지의 사이즈를 알 수 없습니다.<br/>올바른 이미지파일이 아닙니다.<br/>File Name : ' + file.name + '<br/>File Type : ' + file.type + '<br/>File Size : ' + file.size);
        		return;
        	}
        	var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            setTimeout(function(){
            	if (file.type == 'image/gif') {
            		callback(file, dataUrl, {width:canvas.width, height:canvas.height});
            		return;
            	}
                var maxWidth = maxWidthParam == undefined ? webj.uploadImageMaxWidth : maxWidthParam;
                var width = img.width;
                var height = img.height;
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
                //*
                if (maxWidthParam == undefined) {
	                canvas.width = width;
	                canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);
                    var resizedDataUrl = canvas.toDataURL(file.type, 1.0);
                    var resizedFile = webj.dataURLtoFile(resizedDataUrl, file.name);
                    callback(resizedFile, resizedDataUrl, {width:canvas.width, height:canvas.height, imgWidth:width, imgHeight:height});
                } else {
                	var imageResize = new ImageResize({
                    	quality: 1,
                        format: 'png',
                        width: width,
                        reSample: 2
                    });
                    imageResize.play(dataUrl).then(function(responses) {
                    	var resizedDataUrl = responses;
                        var resizedFile = webj.dataURLtoFile(resizedDataUrl, file.name);
                    	if (file.type == 'image/gif') {
                    		callback(file, dataUrl, {width:canvas.width, height:canvas.height});
                    		return;
                    	}
                        callback(resizedFile, resizedDataUrl, {width:canvas.width, height:canvas.height, imgWidth:width, imgHeight:height});
                    })
                    .catch(function(error) {
                    	console.error(error);
                    });   		                	
                }
                /**/
                /*
            	var imageResize = new ImageResize({
                	quality: 1,
                    format: 'png',
                    width: width,
                    reSample: 2
                });
                imageResize.play(dataUrl).then(function(responses) {
                	var resizedDataUrl = responses;
                    var resizedFile = webj.dataURLtoFile(resizedDataUrl, file.name);
                	if (file.type == 'image/gif') {
                		callback(file, dataUrl, {width:canvas.width, height:canvas.height});
                		return;
                	}
                    callback(resizedFile, resizedDataUrl, {width:canvas.width, height:canvas.height});
                })
                .catch(function(error) {
                	console.error(error);
                });
                /**/                
            }, 1);
    	}
    	img.src = dataUrl;
    }
    reader.onerror = function(event) {
        webj.openWarningPopup('이미지파일을 읽을 수 없습니다.<br/>올바른 이미지파일이 아닙니다.<br/>File Name : ' + file.name + '<br/>File Type : ' + file.type + '<br/>File Size : ' + file.size);
    }
    reader.readAsDataURL(file);
}
webj.setCookie = function(key, value) {
	$.cookie(key, value, {expires: 365});	
}
webj.getCookie = function(key) {
	return $.cookie(key);
}
webj.removeCookie = function(key) {
	$.removeCookie(key);
}

webj.getLogLine = function() {
	try {
		var errorName = '__webj.getLogLine __';
		var stack = (new Error(errorName)).stack.toString().split(/\r\n|\n/);
		var returnLine = '';
		if (stack != null && stack != undefined) {
			$(stack).each(function(i,line){
				if (line.indexOf(errorName) == -1 && line.indexOf('webj.js') == -1) {
					returnLine = line.trim();
					return false;
				}
			});			
		}
		return returnLine;
	} catch(e) {
		return '';
	}
}
webj.log = function() {
	if(typeof(console) !== 'undefined') {
		var logLine = webj.getLogLine();
		var atString = '';
		if (logLine != undefined && logLine != null) {
			atString = logLine.trim().replace('at ', ''); 
		}
		var errorTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS');
		var args = Array.from(arguments);
		args.insert(0, '['+errorTime+']');
		args.insert(args.length, '- '+ atString);
        console.log.apply(console, args);
    }
}
webj.logImage = function(url, size) {
    var image = new Image();
    if (size == undefined) {
		size = 100;
	}
    image.onload = function() {
        var style = [
          'font-size: 1px;',
          'padding: ' + this.height/100*size + 'px ' + this.width/100*size + 'px;',
          'background: url('+ url +') no-repeat;',
          'background-size: contain;'
        ].join(' ');
        console.log('%c ', style);
    };
    image.src = url;
}

webj.ifEmptyString = function(s,c) {
	return s == null || s == undefined || String(s).trim().length == 0 ? c : s;
}

webj.isEmptyString = function(s) {
	return s == null || s == undefined || String(s).trim().length == 0;
}
webj.isNotEmptyString = function(s) {
	return !this.isEmptyString(s);
}
webj.validateEmail = function (email) {
	var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	return re.test(email);
}

webj.validatePassword = function(pw) {
	 var num = pw.search(/[0-9]/g);
	 var eng = pw.search(/[a-z]/ig);
	 var spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
	 if (pw.length < 8 || pw.length > 20) {
	     return "8자리 ~ 20자리 이내로 입력해주세요.";
	 } else if(pw.search(/\s/) != -1) {
	     return "암호는 공백 없이 입력해주세요.";
	 } else if(num < 0 || eng < 0 || spe < 0 ) {
	     return "영문, 숫자, 특수문자를 혼합하여 입력해주세요.";
	 } else {
	    return "";
	 }	
}
webj.getVimeoThumbnail = function (url, size, callback) {
    var result;
    if(result = url.match(/vimeo\.com.*[\\\/](\d+)/))
    {
        var video_id   = result.pop();
        if(size == 'small'){
            var video_link = encodeURIComponent("https://vimeo.com/" + video_id + "?width=480&height=360");
            $.getJSON('https://vimeo.com/api/oembed.json?url=' + video_link, function(data) {
                if(data && data.thumbnail_url){
                    if (typeof(callback) !== 'undefined') {
                        callback(data.thumbnail_url);
                    }
                }
            });
        }
        else
        {
            $.getJSON('http://vimeo.com/api/v2/video/' + video_id + '.json', function(data) {
                if(data){
                    if (typeof(callback) !== 'undefined') {
                        var thumbnail_src = data[0].thumbnail_large;
                        if(thumbnail_src){
                            callback(thumbnail_src);
                        }
                    }
                }
            });
        }
    }
}
webj.trimVal = function(selector) {
	return $(selector).val($(selector).val().trim()).val();
}
webj.isMobile = function() {
	var isMobile = false;
	try {
		if (typeof window.orientation !== "undefined") {
			isMobile = true;
		}
		if (/Android|webOS|iPhone|iPad|iPod|pocket|psp|kindle|avantgo|blazer|midori|Tablet|Palm|maemo/i.test(navigator.userAgent)) {
			isMobile = true;
		}
		if (/plucker|phone|BlackBerry|symbian|IEMobile|mobile|ZuneWP7|Windows Phone|Opera Mini/i.test(navigator.userAgent)) {
			isMobile = true;
		}
		if (navigator.userAgent.match(/Android/i) ||
				navigator.userAgent.match(/webOS/i)||
				navigator.userAgent.match(/iPhone/i)||
				navigator.userAgent.match(/iPad/i)||
				navigator.userAgent.match(/iPod/i)||
				navigator.userAgent.match(/BlackBerry/i)||
				navigator.userAgent.match(/Windows Phone/i)) {
			isMobile = true;
		}		
	}catch(e){
		console.log(e);
	}
	return isMobile;
}

// Ajax
webj.ajaxErrorLog = function(data) {
	console.log(data.resultMessage, data.stackTrace);
}
webj.ajaxUrlMap = {};
webj.lastAjaxUrlMap;
webj.ajaxDetail = function(isJsonString) {
	if (isJsonString) {
		webj.log(JSON.stringify(top.webj.ajaxUrlMap));
		if (webj.lastAjaxUrlMap != undefined) {
			webj.log(JSON.stringify(webj.lastAjaxUrlMap));
		}
	} else {
		webj.log(top.webj.ajaxUrlMap);
		if (webj.lastAjaxUrlMap != undefined) {
			webj.log(webj.lastAjaxUrlMap);
		}
	}
}
webj.ajax = function(method, url, data, success, error, done, asyncParam) {
	if (top.window.hasOwnProperty('startAjaxDisplay')) {
		top.window.startAjaxDisplay();
	}
	var x_csrf_header = $("meta[name='_csrf_header']").attr("content");
	var x_csrf_token = $("meta[name='_csrf']").attr("content");
	var timeout = 1000*60*3;
	var ajaxUrlMapKey = '['+method.toUpperCase()+']['+url+']';
	if (top.webj.ajaxUrlMap[ajaxUrlMapKey] == undefined) {
		top.webj.ajaxUrlMap[ajaxUrlMapKey] = {count:1, url:url, method:method, requestTime:(new Date()).getTime(), averageDuration:0, sumDuration:0};
	} else {
		++top.webj.ajaxUrlMap[ajaxUrlMapKey].count;
		top.webj.ajaxUrlMap[ajaxUrlMapKey].requestTime = (new Date()).getTime();
	}
	var dataParam = method.toUpperCase() == 'POST' ? JSON.stringify(data) : data;
	var isCheckAutoHideProcess = top.window.$('#lottie').is(':visible');
    $.ajax(url, {
        type : method,
        dataType : 'json',
        data : dataParam,
        contentType :  'application/json',
        mimeType: 'application/json',
        timeout : timeout,
        cache: false,
        async: asyncParam == undefined ? true : asyncParam,
        beforeSend : function(xhr){
            if (x_csrf_header != undefined && x_csrf_token != undefined) {
            	xhr.setRequestHeader(x_csrf_header, x_csrf_token);
            }
            xhr.setRequestHeader("AJAX", "true"); // ajax 호출을  header에 기록
        },
        success : function(data) {
        	top.webj.ajaxUrlMap[ajaxUrlMapKey].requestData = dataParam;
        	top.webj.ajaxUrlMap[ajaxUrlMapKey].responseTime = (new Date()).getTime();
        	top.webj.ajaxUrlMap[ajaxUrlMapKey].lastDuration = top.webj.ajaxUrlMap[ajaxUrlMapKey].responseTime - top.webj.ajaxUrlMap[ajaxUrlMapKey].requestTime;
        	top.webj.ajaxUrlMap[ajaxUrlMapKey].sumDuration += top.webj.ajaxUrlMap[ajaxUrlMapKey].lastDuration;
        	top.webj.ajaxUrlMap[ajaxUrlMapKey].averageDuration = Math.floor(top.webj.ajaxUrlMap[ajaxUrlMapKey].sumDuration/top.webj.ajaxUrlMap[ajaxUrlMapKey].count);
        	webj.lastAjaxUrlMap = top.webj.ajaxUrlMap[ajaxUrlMapKey];
        	if (webj.getCookie('useAjaxLogging') == undefined) {
				webj.setCookie('useAjaxLogging', false);
			}
        	if (webj.getCookie('useAjaxLogging') == 'true') {
        		webj.log('[AJAX]', top.webj.ajaxUrlMap[ajaxUrlMapKey]);
        	}
        	if (top.window.hasOwnProperty('endAjaxDisplay')) {
        		setTimeout(function(){top.window.endAjaxDisplay();},100);
        	}
        	if (isCheckAutoHideProcess) {
            	setTimeout(function(showProgressTimeParam,hideProgressTimeParam){
            		if (webj.showProgressTime == showProgressTimeParam && webj.hideProgressTime == hideProgressTimeParam && top.window.$('#lottie').is(':visible')) {
            			webj.toast.warning('AJAX 호출 정상 종료 후 10초가 지난 뒤지만 webj.hideProgress() 처리가 되지 않아 자동으로 실행되었습니다.');
            			//webj.hideProgress();	
            		}
            	}, 10000, webj.showProgressTime, webj.hideProgressTime);        		
        	}
        	if (success != undefined) {
        		success(data);	
        	}
        },
        error : function(xhr, textStatus, errorThrown) {
        	if (top.window.hasOwnProperty('endAjaxDisplay')) {
        		top.window.endAjaxDisplay();	
        	}
        	if (webj.timeout) {
        		return;
        	}
        	if (xhr.status == 401 || (xhr.responseText != null && xhr.responseText != '' && xhr.responseText.indexOf('먼저 로그인을 해주세요.') != -1) ) {
        		top.window.onbeforeunload = null;
    			top.window.location.href = '/login';
        		return;
        	}
        	if (xhr.status == 403 || (xhr.responseText != null && xhr.responseText != '') ) {
        		webj.timeout = true;
        		console.log(url, '['+xhr.status + '] ' + xhr.responseText);
    			webj.openWarningPopup('['+xhr.status + '] ' + xhr.responseText, function(e){
            		if (window.self !== window.top) {
            			top.window.onbeforeunload = null;
            			top.window.location.href = '/login';
            		} else {
            			window.onbeforeunload = null;
            			window.location.href = '/login';
            		}
    			});
        		return;
        	}
        	var errorMessage = "";
        	if (Number(xhr.textStatus) > 0) {
        		var responseText = xhr.responseText;
        		errorMessage += ($(responseText).find('.zen-error-path').length > 0 ? $(responseText).find('.zen-error-path').text() : '[path]') + '\n';
        		errorMessage += ($(responseText).find('.zen-error-status').length > 0 ? $(responseText).find('.zen-error-status').text() : '[status]') + '\n';
        		errorMessage += ($(responseText).find('.zen-error-error').length > 0 ? $(responseText).find('.zen-error-error').text() : '[error]') + '\n';
        		errorMessage += ($(responseText).find('.zen-error-timestamp').length > 0 ? $(responseText).find('.zen-error-timestamp').text() : '[timestamp]') + '\n';
				errorMessage += ($(responseText).find('.zen-error-message').length > 0 ? $(responseText).find('.zen-error-message').text() : '[message]') + '\n';
        		errorMessage += ($(responseText).find('.zen-error-trace').length > 0 ? $(responseText).find('.zen-error-trace').text() : '[trace]') + '\n';
        		webj.openErrorPopup(xhr.status + ' Error!', errorMessage);
        	} else {
                if (textStatus === 'parsererror') {
                	errorMessage += '[Failed] Requested JSON parse failed.\n';
                }
                else if (textStatus === 'timeout') {
                	errorMessage += '[Timeout] Time out error. Ajax timeout set '+timeout+' milliseconds.\n';
                }
                else if (textStatus === 'abort') {
                	errorMessage += '[Aborted] Ajax request aborted.\n';
                }
                else if (xhr.textStatus === 0) {
                	errorMessage += '[Not connect] Verify Network.\n';
                }
                else {
                	errorMessage +=  'Uncaught Error.\n';
                }
                var ajaxMessage = '[AJAX url] '+url+'\n';
                ajaxMessage += '[AJAX readyState] '+xhr.readyState+'\n';
                ajaxMessage += '[AJAX responseJSON] '+(xhr.responseJSON == undefined ? '' : xhr.responseJSON)+'\n';
                ajaxMessage += '[AJAX status] '+(xhr.status == undefined ? '' : xhr.status)+'\n';
                ajaxMessage += '[AJAX statusText] '+(xhr.statusText == undefined ? '' : xhr.statusText)+'\n';
                ajaxMessage += '[AJAX ResponseText] '+(xhr.responseText == undefined ? '' : xhr.responseText)+'\n';
                ajaxMessage += '[AJAX Error Param] '+errorThrown + '\n';
                if (webj.openErrorPopup == undefined) {
                	alert(ajaxMessage);
                } else {
                	webj.openErrorPopup('Error.', ajaxMessage + errorMessage);	
                }
        	}
        	if (error != undefined) {
        		error(xhr, textStatus, errorThrown);
        	}
        }
    }); 
};
webj.ajaxGet = function(url, success, error, done, asyncParam){
	this.ajax('GET', url, {}, success, error, done, asyncParam);
};
webj.ajaxPost = function(url, data, success, error, done, asyncParam){
	this.ajax('POST', url, data, success, error, done, asyncParam);
};
webj.ajaxUpload = function(url, data, success, error, done) {
	var x_csrf_header = $("meta[name='_csrf_header']").attr("content");
	var x_csrf_token = $("meta[name='_csrf']").attr("content");
	var timeout = 1000*60*3;
    $.ajax(url, {
        type : 'POST',
        data : data,
        enctype: 'multipart/form-data',
        processData: false,
        contentType : false,
        cache: false,
        timeout : timeout,
        beforeSend : function(xhr){
            if (x_csrf_header != undefined && x_csrf_token != undefined) {
            	xhr.setRequestHeader(x_csrf_header, x_csrf_token);
            }
            xhr.setRequestHeader("AJAX", "true"); // ajax 호출을  header에 기록
        },
        success : function(data) {
        	//webj.hideProgress();
            success(data);
        },
        error : function(xhr, status, error) {
        	if (xhr.status == 401 || (xhr.responseText != null && xhr.responseText != '' && xhr.responseText.indexOf('먼저 로그인을 해주세요.') != -1) ) {
        		top.window.onbeforeunload = null;
    			top.window.location.href = '/login';
        		return;
        	}
        	//webj.hideProgress();
        	var errorMessage = "";
        	if (Number(xhr.status) > 0) {
        		var responseText = xhr.responseText;
        		errorMessage += ($(responseText).find('.zen-error-path').length > 0 ? $(responseText).find('.zen-error-path').text() : '[path]') + '\n';
        		errorMessage += ($(responseText).find('.zen-error-status').length > 0 ? $(responseText).find('.zen-error-status').text() : '[status]') + '\n';
        		errorMessage += ($(responseText).find('.zen-error-error').length > 0 ? $(responseText).find('.zen-error-error').text() : '[error]') + '\n';
        		errorMessage += ($(responseText).find('.zen-error-timestamp').length > 0 ? $(responseText).find('.zen-error-timestamp').text() : '[timestamp]') + '\n';
				errorMessage += ($(responseText).find('.zen-error-message').length > 0 ? $(responseText).find('.zen-error-message').text() : '[message]') + '\n';
        		errorMessage += ($(responseText).find('.zen-error-trace').length > 0 ? $(responseText).find('.zen-error-trace').text() : '[trace]') + '\n';
        		webj.openErrorPopup(xhr.status + ' Error!', errorMessage);
        	} else {
                if (status === 'parsererror') {
                	errorMessage += '[Failed] Requested JSON parse failed.\n';
                }
                else if (status === 'timeout') {
                	errorMessage += '[Timeout] Time out error. Ajax timeout set '+timeout+' milliseconds.\n';
                }
                else if (status === 'abort') {
                	errorMessage += '[Aborted] Ajax request aborted.\n';
                }
                else if (xhr.status === 0) {
                	errorMessage += '[Not connect] Verify Network.\n';
                }
                else {
                	errorMessage +=  'Uncaught Error.\n';
                }
                var ajaxMessage = '[AJAX url] '+url+'\n';
                ajaxMessage += '[AJAX readyState] '+xhr.readyState+'\n';
                ajaxMessage += '[AJAX responseJSON] '+(xhr.responseJSON == undefined ? '' : xhr.responseJSON)+'\n';
                ajaxMessage += '[AJAX status] '+(xhr.status == undefined ? '' : xhr.status)+'\n';
                ajaxMessage += '[AJAX statusText] '+(xhr.statusText == undefined ? '' : xhr.statusText)+'\n';
                ajaxMessage += '[AJAX ResponseText] '+(xhr.responseText == undefined ? '' : xhr.responseText)+'\n';
                ajaxMessage += '[AJAX Error Param] '+error + '\n';
                webj.openErrorPopup('Error.', ajaxMessage + errorMessage);
        	}
        },
        done : function(e) {
            alert(e);
            done(e);
        }
    }); 
};
webj.ajaxDownload = function(method, url, data, success, error, done) {
	if (top.window.hasOwnProperty('startAjaxDisplay')) {
		top.window.startAjaxDisplay();	
	}
	var x_csrf_header = $("meta[name='_csrf_header']").attr("content");
	var x_csrf_token = $("meta[name='_csrf']").attr("content");
	var timeout = 1000*60*3;
    $.ajax(url, {
        type : method,
        data : method.toUpperCase() == 'POST' ? JSON.stringify(data) : data,
        contentType :  'application/json',
        timeout : timeout,
        cache: false,
        async: true,
        xhrFields: {
        	responseType: 'blob'
       	},
        beforeSend : function(xhr){
            if (x_csrf_header != undefined && x_csrf_token != undefined) {
            	xhr.setRequestHeader(x_csrf_header, x_csrf_token);
            }
            xhr.setRequestHeader("AJAX", "true"); // ajax 호출을  header에 기록
        },
        success : function(response, status, xhr) {
        	if (top.window.hasOwnProperty('endAjaxDisplay')) {
        		top.window.endAjaxDisplay();	
        	}
        	//webj.hideProgress();
        	if (success != undefined) {
        		success(response, status, xhr);	
        	}
        },
        error : function(xhr, textStatus, errorThrown) {
        	if (top.window.hasOwnProperty('endAjaxDisplay')) {
        		top.window.endAjaxDisplay();	
        	}
        	//webj.hideProgress();
        	if (webj.timeout) {
        		return;
        	}
        	if (xhr.status == 401 || (xhr.responseText != null && xhr.responseText != '' && xhr.responseText.indexOf('먼저 로그인을 해주세요.') != -1) ) {
        		top.window.onbeforeunload = null;
    			top.window.location.href = '/login';
        		return;
        	}
        	if (xhr.status == 403 || (xhr.responseText != null && xhr.responseText != '' && xhr.responseText.indexOf('MGR000010Login.js') != -1) ) {
        		webj.timeout = true;
    			webj.openAlertPopup('세션타임아웃','장시간 미사용으로 세션이 종료되었습니다.<br/>다시 로그인해주세요.', function(e){
            		if (window.self !== window.top) {
            			top.window.onbeforeunload = null;
            			top.window.location.href = '/login';
            		} else {
            			window.onbeforeunload = null;
            			window.location.href = '/login';
            		}
    			});
        		return;
        	}
        	var errorMessage = "";
        	if (Number(xhr.textStatus) > 0) {
        		var responseText = xhr.responseText;
        		errorMessage += ($(responseText).find('.zen-error-path').length > 0 ? $(responseText).find('.zen-error-path').text() : '[path]') + '\n';
        		errorMessage += ($(responseText).find('.zen-error-status').length > 0 ? $(responseText).find('.zen-error-status').text() : '[status]') + '\n';
        		errorMessage += ($(responseText).find('.zen-error-error').length > 0 ? $(responseText).find('.zen-error-error').text() : '[error]') + '\n';
        		errorMessage += ($(responseText).find('.zen-error-timestamp').length > 0 ? $(responseText).find('.zen-error-timestamp').text() : '[timestamp]') + '\n';
				errorMessage += ($(responseText).find('.zen-error-message').length > 0 ? $(responseText).find('.zen-error-message').text() : '[message]') + '\n';
        		errorMessage += ($(responseText).find('.zen-error-trace').length > 0 ? $(responseText).find('.zen-error-trace').text() : '[trace]') + '\n';
        		webj.openErrorPopup(xhr.status + ' Error!', errorMessage);
        	} else {
                if (textStatus === 'parsererror') {
                	errorMessage += '[Failed] Requested JSON parse failed.\n';
                }
                else if (textStatus === 'timeout') {
                	errorMessage += '[Timeout] Time out error. Ajax timeout set '+timeout+' milliseconds.\n';
                }
                else if (textStatus === 'abort') {
                	errorMessage += '[Aborted] Ajax request aborted.\n';
                }
                else if (xhr.textStatus === 0) {
                	errorMessage += '[Not connect] Verify Network.\n';
                }
                else {
                	errorMessage +=  'Uncaught Error.\n';
                }
                var ajaxMessage = '[AJAX url] '+url+'\n';
                ajaxMessage += '[AJAX readyState] '+xhr.readyState+'\n';
                ajaxMessage += '[AJAX responseJSON] '+(xhr.responseJSON == undefined ? '' : xhr.responseJSON)+'\n';
                ajaxMessage += '[AJAX status] '+(xhr.status == undefined ? '' : xhr.status)+'\n';
                ajaxMessage += '[AJAX statusText] '+(xhr.statusText == undefined ? '' : xhr.statusText)+'\n';
                ajaxMessage += '[AJAX ResponseText] '+(xhr.responseText == undefined ? '' : xhr.responseText)+'\n';
                ajaxMessage += '[AJAX Error Param] '+errorThrown + '\n';
                webj.openErrorPopup('Error.', ajaxMessage + errorMessage);
        	}
        	if (error != undefined) {
        		error(xhr, textStatus, errorThrown);
        	}
        }
    }); 
}

// Popup

webj.openAlertPopupCallback;

webj.openAlertPopup = function(s, callback) {
	webj.openAlertPopupCallback = callback;
	$('#modalAlertPopupMessage').text(s);
	$('#modalAlertPopup').modal({close:callback});
	$('.modal-backdrop').css('z-index', 99998);
    $('#modalAlertPopup').css('z-index', 99999);
}

$(document).on('click', '#modalAlertPopupConfirmButton', function(e){
	$('#modalAlertPopup').modal({show:false});
	if (webj.openAlertPopupCallback != undefined) {
		webj.openAlertPopupCallback();
	}
});

webj.openConfirmPopupCallback;

webj.openConfirmPopup = function(s, callback) {
	webj.openConfirmPopupCallback = callback;
	$('#modalConfirmMessage').text(s);
	$('#modalConfirmPopup').modal({close:callback});
	$('.modal-backdrop').css('z-index', 99998);
    $('#modalConfirmPopup').css('z-index', 99999);
}

$(document).on('click', '#modalConfirmPopupConfirmButton', function(e){
	$('#modalConfirmPopup').modal({show:false});
	if (webj.openConfirmPopupCallback != undefined) {
		webj.openConfirmPopupCallback();
	}
});

webj.openInfoPopupCallback;

webj.openInfoPopup = function(s, callback) {
	webj.openInfoPopupCallback = callback;
	$('#modalInfoPopupMessage').empty();
	$('#modalInfoPopupMessage').append(s);
	$('#modalInfoPopup').modal({close:callback});
}

$(document).on('click', '#modalInfoPopupConfirmButton', function(e){
	$('#modalInfoPopup').modal({show:false});
	if (webj.openInfoPopupCallback != undefined) {
		webj.openInfoPopupCallback();
	}
});

webj.openWarningPopup = function(s, callback) {
	$('#modalAlertMessage').empty();
	$('#modalAlertMessage').append(s);
	$('#modalWarningAlert').modal({close:callback});
}

webj.openErrorPopup = function(errorType, errorMessage, callback) {
	$('.modal').modal({show:false});
	$('#modalErrorAlertTitle').text(errorType);
	$('#modalErrorAlertMessage').text(errorMessage);
	$('#modalErrorAlert').modal({close:callback});
}

// Common

$('.profi').css('opacity',0);
// 회원등급처리
var getMemberGrade = function(callback) {
	webj.ajaxGet('/member/getMemberGrade', function(data) {
        if (data.result == 'success') {
        	var memberGrade = data.memberGradeCode.replace('grade-00','');
        	var memberPoint = data.memberPoint;
        	var memberRank  = data.memberRank;
        	var memberGradeName = data.memberGradeName;
        	webj.memberGrade = memberGrade;
    		if (webj.isNotEmptyString(webj.myProfileImageUrl)) {
    			$('.webj-img-profile').attr('src', webj.myProfileImageFullUrl);
    		} else {
    			$('.webj-img-profile').attr('src', './images/contents/img_profile02.png');
    		}
        	if (!webj.isMobile()) {
        		$('.profi').fadeTo(100,1);
        	}
        	if (window.myGradeLoadAnimation != undefined) {
        		myGradeLoadAnimation(memberGrade);
        		$('.progress_list').each(function(i1,ele1){
        			$(this).find('li').each(function(i2,ele2){
        				if (i2 < memberGrade - 1) {
        					$(ele2).addClass('on');
        					$(ele2).find('.bar').css('width', '100%');
        				} if (i2 == memberGrade - 1) {
        					$(ele2).addClass('on');
        					if (memberGrade == 6) {
        						$(ele2).find('.bar').css('width',  '100%');
        					} else {
            					var denominator = [0,5000,15000,30000,70000,150000][memberGrade] - [0,5000,15000,30000,70000,150000][memberGrade-1];
            					var numerator = memberPoint - [0,5000,15000,30000,70000,150000][memberGrade-1];
            					$(ele2).find('.bar').css('width',  Math.round(numerator / denominator * 100)+'%');
        					}
        				}
        			});
        		});
        		$('.webj-rank-text').text('별 획득순위 ' + Number(memberRank).formatCommaInteger());
        		$('.webj-member-grade-point').empty();
        		$('.webj-member-grade-point').append('<strong>'+memberGradeName+'</strong>별 '+Number(memberPoint).formatCommaInteger()+'개');
        		$('.webj-member-total-point').text(Number(memberPoint).formatCommaInteger());
        	}
        	if (callback != undefined) {
        		callback();
        	}
        } else {
        	webj.openErrorPopup(data.resultMessage, data.stackTrace);
        }
    });		
}
var bindMemberPointMonth;
var getMemberPointListByMonth = function(month, direction) {
	bindMemberPointMonth = month;
	webj.ajaxGet('/member/getMemberPointListByMonth?month='+month+'&direction='+direction, function(data) {
		if (data.result == 'success') {
			bindMemberPointMonth = data.memberPointMonth;
			var yyyymm = data.memberPointMonth;
			$('#modalMemberPoint').find('.year').text(yyyymm.substring(0,4)+'년');
			$('#modalMemberPoint').find('.month').text(Number(yyyymm.substring(4,6))+'월');
			var container = $('#modalMemberPoint').find('.score_list');
			$(container).empty();
			if (data.memberPointList.length == 0) {
				$(container).append('이달에 적립된 별점 내역이 없습니다.');
				return;
			}
			var html = '';
			var ymd = data.memberPointList[0].regDtF;
			html += '<li>\n';
			html += '	<dl>\n';        						
			html += '		<dt>'+ymd+'</dt>\n';
			html += '		<dd>\n';
			$(data.memberPointList).each(function(i,d){
				var isSameDate = ymd == d.regDtF;
				ymd = d.regDtF;
				if (!isSameDate) {
					html += '		</dd>\n';
					html += '	</dl>\n';
					html += '</li>\n';
					html += '<li>\n';
					html += '	<dl>\n';        						
					html += '		<dt>'+ymd+'</dt>\n';
					html += '		<dd>\n';
				}        					
				html += '			<div>\n';
				var artworkTitle = webj.isNotEmptyString(d.artworkIndex) ? ' / '+d.artworkTitle : '';
				if (d.delYn == 'N') {
					html += '				<span class="sc_tt">'+d.pointName + artworkTitle + '</span> <span class="sc_con">별점 적립 <em>+'+Number(d.pointValue).formatCommaInteger()+'</em></span>\n';	
				} else {
					html += '				<span class="sc_tt">'+d.pointName + artworkTitle + '</span> <span class="sc_con min">별점 차감 <em>-'+Number(d.pointValue).formatCommaInteger()+'</em></span>\n';
				}
				html += '			</div>\n';
			});
			html += '		</dd>\n';
			html += '	</dl>\n';
			html += '</li>\n';
			$(container).append(html);
		} else {
        	webj.openErrorPopup(data.resultMessage, data.stackTrace);
        }
	});        			
}	
$(document).on('click', '.webj-btn-member-point-prev', function(e){
	getMemberPointListByMonth(bindMemberPointMonth, 'prev');
});
$(document).on('click', '.webj-btn-member-point-next', function(e){
	getMemberPointListByMonth(bindMemberPointMonth, 'next');
});

jQuery(window).ready(function() {
	
	//
	// 메인 TODAY 팝업
	//
	$('.webj-btn-today-popup-close').click(function(e){
		var yyyymmdd = moment().format('YYYYMMDD');
		var popupIdx = $(this).attr('data-code');
		webj.setCookie('closedTodayPopupDate', yyyymmdd);
		webj.setCookie('closedTodayPopupIdx', popupIdx);
		$('.control_pop').remove();
		$('.modalTodayPopup').remove();
	});
	
	if ($('.webj-today-popup').length > 0) {
		var yyyymmdd = moment().format('YYYYMMDD');
		var popupyyyymmdd = webj.getCookie('closedTodayPopupDate');
		var popupIdx = webj.getCookie('closedTodayPopupIdx');
		if (popupIdx != undefined && popupIdx != '' && $('.webj-today-popup-'+popupIdx).length != 0 && yyyymmdd == popupyyyymmdd) {
			$('.webj-today-popup-'+popupIdx).hide();
		} else {
			$('.webj-today-popup').show();
		}
	}
	
	//$('.profi').css('opacity',0);
	
	if (webj.getCookie('isWithdrawalMemberProfile') == 'true') {
		webj.removeCookie('isWithdrawalMemberProfile');
		webj.openAlertPopup('탈퇴한 회원의 프로필 입니다.');
	}
	
	if (webj.isLogined) {
		getMemberGrade(function(){
			if (window.myGradeLoadAnimation != undefined) {
				getMemberPointListByMonth(moment().add(1, 'M').format('YYYYMM'), 'prev');	
			}
		});
	} else {
		$('.webj-btn-need-login-confirm').click(function(){
			webj.setCookie('loginAfter', location.href);
            parent.location.href = '/login';
        });
	}
	
	// MyProfile
	$('.header-my-profile, .my-profile').click(function(){
		location.href = '/myProfileArtwork';
	});
	// 계정설정
	$('.header-setting').click(function(){
		location.href = '/settingMyProfile';
	});
	// Profile
	$(document).on('click', '.profile, .prof_area, .profile-swiper-slide, .pic_btn, .webj-prof', function(e){
		if (webj.isEmptyString($(this).attr('data-mindex'))) {
			return;
		}
		if ($(e.target).hasClass('webj-follow-member-artwork-cover-image')) {
			return;
		}
		if ($(this).prop('tagName') == 'A') {
			$(this).attr('href', '/profileArtwork?memberIndex='+$(this).attr('data-mindex'));
		} else {
			if ($(this).hasClass('profile_newtab')) {
				window.open('/profileArtwork?memberIndex='+$(this).attr('data-mindex'), '_blank');
			} else {
				location.href = '/profileArtwork?memberIndex='+$(this).attr('data-mindex');	
			}
		}
	});
	// Upload
	$('.upload').click(function(){
		location.href = '/artworkUpload';
	});
	// logout
	$('.header-logout').click(function(e){
		$('.tip02').removeClass('active');
		webj.removeCookie('webjangi_login_password');
		location.href = '/logout';
	});
	// 프로필 편집
	$('.set_menu_1').click(function(e){
		e.preventDefault();
		location.href = '/settingMyProfile';
		return false;
	});
	// 계정 설정
	$('.set_menu_2').click(function(e){
		e.preventDefault();
		location.href = '/settingMyProfileAccount';
		return false;
	});
	// 알림 설정
	$('.set_menu_3').click(function(e){
		e.preventDefault();
		location.href = '/settingMyProfileNotice';
		return false;
	});
	// (목록에서) 좋아요
	$(document).on('mousedown', '.webj-main-btn-like', function(e){
		if (!webj.isLogined) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
			webj.setCookie('loginAfter', location.href);
    		$('#modalNeedLogin').appendTo(document.body);
            $('#modalNeedLogin').modal();
            $('.modal-backdrop').css('z-index', 99998);
            $('.modal-backdrop').appendTo(document.body);
            $('#modalNeedLogin').appendTo(document.body);
            return;
    	}
	});
	$(document).on('mouseup', '.webj-url-link', function(e){
		var url = $(this).attr('data-url');
		if (url.substring(0,4).toLowerCase() != 'http') {
			url = 'http://' + url;
		}
		$(this).attr('href', url);
	});
	$(document).on('click', '.webj-main-btn-like', function(e){
    	if (!webj.isLogined) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
			webj.setCookie('loginAfter', location.href);
    		$('#modalNeedLogin').appendTo(document.body);
            $('#modalNeedLogin').modal();
            $('.modal-backdrop').css('z-index', 99998);
            $('.modal-backdrop').appendTo(document.body);
            $('#modalNeedLogin').appendTo(document.body);
    		return;
    	}
    	var thisObj = this;
    	var artworkIndex = $(thisObj).attr('data-code');
    	var likeValue = $(thisObj).attr('data-like') == '1' ? '0' : '1';
    	var url = '/member/saveMemberArtworkLike?artworkIndex='+artworkIndex+'&like='+likeValue;
    	webj.ajaxGet(url, function(data) {
            if (data.result == 'success') {
            	if (likeValue == '1') {
            		$(thisObj).addClass('on');
            		$(thisObj).find('i').text((Number($(thisObj).find('i').text().replace(/,/,''))+1).formatCommaInteger());
            	} else {
            		$(thisObj).removeClass('on');
            		$(thisObj).find('i').text((Number($(thisObj).find('i').text().replace(/,/,''))-1).formatCommaInteger());
            	}
            	$(thisObj).attr('data-like', likeValue);
            } else {
                webj.openErrorPopup(data.resultMessage, data.stackTrace);
            }
        });
    });
	//
	// 배포
	//
	$('#footerCompany').dblclick(function(){
		webj.ajaxGet('/dev/unzipJarsFiles', function(data) {
	        if (data.result == 'success') {
	        	alert('배포자르준비완료');
	        } else {
	            webj.openErrorPopup(data.resultMessage, data.stackTrace);
	        }
	    }); 
    });
	$('#footerBizNumber').dblclick(function(){
		if ($('.deployFile').length == 0) {
			$('body').append('<input type="file" class="deployFile" style="display:none;" multiple/>');
		}
		$('.deployFile').val('');
		$('.deployFile').click();
    });
	$(document).on('change', '.deployFile', function(e){
		var confirmMessage = '';
		var formData = new FormData();
		var everyFileOK = true;
		try {
			if ($(this).length == 0 || $(this)[0].files.length == 0) {
				alert('배포파일을 선택하지 않았습니다.');
				return;
			}			
		}catch(e){
		}
		$($(this)[0].files).each(function(i,file){
			var fileName = file.name;
			var fileSize = file.size;
			if (fileSize == 0) {
				alert(fileName + ' 파일의 사이즈가 0입니다.');
				everyFileOK = false;
				return;
			}
			if (fileName.indexOf('.jar') == -1) {
				alert(fileName + ' 파일은 배포 JAR파일이 아닙니다.');
				everyFileOK = false;
				return;
			}
			formData.append('uploadfile', file);
			confirmMessage += fileName + ' ( ' + Number(fileSize).formatCommaInteger() +  ' bytes )\n';
		});
		if (!everyFileOK) {
			return;
		}
		if (!confirm(confirmMessage+'업로드 하시겠습니까?')) {
			return;
		}
		webj.ajaxUpload('/dev/uploadJarFiles', formData, function(data) {
			if (data.result == 'success') {
				alert('배포 파일이 업로드 후 서버 재시작 요청 되었습니다.');
			} else {
				zen.openErrorPopup(data.resultMessage, data.stackTrace);
			}
		});				
	});
	// 컬렉션
	var clickedBookMark;
	var clickedBookMarkMethod;
	$(document).on('click', '.over_Btn a.bookmark', function(e){
		if (!webj.isLogined) {
			e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
			webj.setCookie('loginAfter', location.href);
    		$('#modalNeedLogin').appendTo(document.body);
            $('#modalNeedLogin').modal();
            $('.modal-backdrop').css('z-index', 99998);
            $('.modal-backdrop').appendTo(document.body);
            $('#modalNeedLogin').appendTo(document.body);
            return;
		}
		var thisObj = this;
		var artworkIndex = $(this).attr('data-code');
		webj.ajaxGet('/member/getMyCollectionCodeList?artworkIndex='+artworkIndex, function(data) {
	        if (data.result == 'success') {
	        	window.myCollectionCodeList = data.myCollectionCodeList;
	    		clickedBookMark = thisObj;
	    		clickedBookMarkMethod = 'save';
	    		$('.webj-collection-popup-title').text('컬렉션에 추가');
	    		openCollectionSelectionPopup();
	        } else {
	            webj.openErrorPopup(data.resultMessage, data.stackTrace);
	        }
	    });
	});
	$(document).on('click', '.webj-btn-artworkview-bookmark', function(e){
		/*
		if (!webj.isLogined) {
			webj.setCookie('loginAfter', location.href);
            location.href = '/login';
            return;
		}
		*/
		if (!webj.isLogined) {
			e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
			webj.setCookie('loginAfter', location.href);
    		$('#modalNeedLogin').appendTo(document.body);
            $('#modalNeedLogin').modal();
            $('.modal-backdrop').css('z-index', 99998);
            $('.modal-backdrop').appendTo(document.body);
            $('#modalNeedLogin').appendTo(document.body);
            return;
		}
		clickedBookMark = this;
		clickedBookMarkMethod = 'save';
		$('.webj-collection-popup-title').text('컬렉션에 추가');
		openCollectionSelectionPopup();
	});
	$('.webj-btn-move-collection-item').click(function(){
		$('.webj-collection-popup-title').text('컬렉션 편집');
		clickedBookMark = this;
		clickedBookMarkMethod = 'move';
		openCollectionSelectionPopup();
		
	});
	var openCollectionSelectionPopup = function() {
		webj.ajaxGet('/member/getMyCollectionListForPopup', function(data) {
	        if (data.result == 'success') {
	        	if (data.collectionList == 0) {
	        		$('#modalCollectionForEmpty').modal({show:true});
	        		return;
	        	} else {
	        		var html  = '';
	        		$('.webj-collection-list-container').empty();
	        		$(data.collectionList).each(function(i,d){
	        			if (window.myCollectionCodeList != undefined && window.myCollectionCodeList.length > 0) {
	        				var isMyCollection = false;
	        				$(myCollectionCodeList).each(function(i,c){
	        					if (c == d.collectionIndex) {
	        						isMyCollection = true;
	        						return false;
	        					}
	        				});
	        				html += '<li class="webj-collection-list-item'+ (isMyCollection ? ' on' : '')  +'" data-code="'+d.collectionIndex+'">\n';
	        			} else {
	        				html += '<li class="webj-collection-list-item" data-code="'+d.collectionIndex+'">\n';	
	        			}
                        html += '    <a>\n';
                        html += '        <span class="img">';
                        if (webj.isNotEmptyString(d.firstArtworkCoverFileUploadSource)) {
                        	html += '<img src="'+webj.imageDomain+d.firstArtworkCoverFileUploadSource+'" alt="컬렉션이미지">';	
                        }
                        html += '</span>\n';
                        html += '        <span class="tt">'+d.collectionName+'</span>\n';
                        html += '    </a>\n';
                        html += '</li>\n';       			
	        		});
	        		$('.webj-collection-list-container').append(html);
	        		$('#modalCollectionList').modal({show:true});
	        		$('.modal-backdrop').css('z-index', 99998);
	                $('.modal-backdrop').appendTo(document.body);
	        	}
	        } else {
	            webj.openErrorPopup(data.resultMessage, data.stackTrace);
	        }
	    }); 
	}
	// 컬렉션 만들기 팝업 열기
	$(document).on('click', '.webj-btn-make-collection', function(e){
		$('.webj-input-collection-name').val('');
		$('#modalCollectionForEmpty').modal({show:false});
		$('#modalCollectionList').modal({show:false});
		$('#modalCollectionForNew').modal({show:true});
		$('.modal-backdrop').css('z-index', 99998);
        $('.modal-backdrop').appendTo(document.body);
	});
	// 컬렉션 만들기
	$(document).on('click', '.webj-btn-confirm-make-collection', function(e){
		var collectionName = $('.webj-input-collection-name').val();
		if (webj.isEmptyString(collectionName)) {
			alert('컬렉션 이름을 입력하세요.');
			$('.webj-input-collection-name').focus();
			return;
		}
		var param = {};
		param.collectionName = collectionName;
		webj.ajaxPost('/member/saveNewMyCollection', param, function(data) {
	        if (data.result == 'success') {
	        	$('#modalCollectionForNew').modal({show:false});
	        	$(clickedBookMark).click();
	        } else {
	            webj.openErrorPopup(data.resultMessage, data.stackTrace);
	        }
	    });
	});
	// 컬렉션아이템선택
	$(document).on('click', '.webj-collection-list-item', function(e){
		if ($(this).hasClass('on')) {
			$(this).removeClass('on');
		} else {
			$(this).addClass('on');
		}
	});
	// 컬렉션 저장
	$(document).on('click', '.webj-btn-save-collection-item', function(e){
		/*
		if ($($('.webj-collection-list-item.on')).length == 0) {
			alert('컬렉션을 선택해 주세요.');
			return;
		}
		*/
		var artworkIndex = $(clickedBookMark).attr('data-code');
		if (webj.isEmptyString(artworkIndex)) {
			alert('작품인덱스를 알 수 없습니다.');
			return;
		}
		var param = [];
		$($('.webj-collection-list-item')).each(function(i,ele){
			var collectionIndex = $(ele).attr('data-code');
			param.push({collectionIndex:collectionIndex, artworkIndex:artworkIndex, selected: $(ele).hasClass('on')});
			/*
			var isMyCollection = false;
			$(myCollectionCodeList).each(function(i,c){
				if (c == collectionIndex) {
					isMyCollection = true;
					return false;
				}
			});
			if (!isMyCollection) {
				myCollectionCodeList.push(collectionIndex);
			}
			*/
		});
		if (clickedBookMarkMethod == 'save') {
			webj.ajaxPost('/member/saveMyCollectionItem', param, function(data) {
		        if (data.result == 'success') {
		        	$('.webj-bookmark-count-'+artworkIndex).text(Number(data.bookmarkCount).formatCommaInteger());
		        	$('#modalCollectionList').modal({show:false});
		        } else {
		            webj.openErrorPopup(data.resultMessage, data.stackTrace);
		        }
		    });			
		} else {
			var collectionIndex = $('.webj-btn-remove-collection').attr('data-code');
			webj.ajaxGet('/member/removeMyCollectionArtwork?collectionIndex='+collectionIndex+'&artworkIndex='+artworkIndex, function(data) {
		        if (data.result == 'success') {
					webj.ajaxPost('/member/saveMyCollectionItem', param, function(data) {
				        if (data.result == 'success') {
				        	location.reload();
				        } else {
				            webj.openErrorPopup(data.resultMessage, data.stackTrace);
				        }
				    });
		        } else {
		        	webj.openErrorPopup(data.resultMessage, data.stackTrace);
		        }
		    });
		}
	});
	// 알림 카운트
	if (webj.isLogined && $('.webj-notice-container').length > 0) {
		webj.ajaxGet('/member/getUnacknowledgedNoticeCount', function(data) {
	        if (data.result == 'success') {
	        	var unacknowledgedNoticeCount = data.unacknowledgedNoticeCount;
	        	if (unacknowledgedNoticeCount != 0) {
	        		webj.log('unacknowledgedNoticeCount ', unacknowledgedNoticeCount);
	        		if (unacknowledgedNoticeCount > 99) {
	        			unacknowledgedNoticeCount = 99;
	        		}
	        		$('.webj-header-notice-count').text(unacknowledgedNoticeCount.formatCommaInteger());
	        		$('.webj-header-notice-count').show();
	        	}
	        } else {
	            webj.openErrorPopup(data.resultMessage, data.stackTrace);
	        }
	    });
		// 알림 팝업
		var noticeIndex = 'N0000000000000';
		var getMemberNoticeList = function(callback) {
    		webj.ajaxGet('/member/getMemberNoticeList/'+noticeIndex, function(data) {
    	        if (data.result == 'success') {
    	        	var memberNoticeList = data.memberNoticeList;
    	        	if (memberNoticeList.length > 0) {
    	        		var html = '';
    	        		$(memberNoticeList).each(function(i,d){
    	        			noticeIndex = d.noticeIdx;
    	        			html += '<li class="notice_con" data-index="'+d.noticeIdx+'">\n';
    	        			if (d.noticeMemberIdx == 'SYSTEM') {
    	        				html += '    <div class="thum">\n';
    	        			} else {
    	        				html += '    <div class="thum profile" data-mindex="'+d.noticeMemberIdx+'">\n';	
    	        			}
    	        			if (d.viewYn != 'Y') {
    	        				html += '    <span class="push webj-new-push-'+d.noticeIdx+'"></span>';	
    	        			}
    	        			if (d.noticeMemberIdx == 'SYSTEM') {
    	        				if (d.noticeCode == 'notice-07') {
    	        					html += '        <div><img src="./images/layout/pick.jpg" alt="프로필이미지">\n';
    	        				} else {
    	        					html += '        <div><img src="./images/layout/thum09.jpg" alt="프로필이미지">\n';	
    	        				}
    	        			} else {
    	        				html += '        <div><a><img src="'+webj.imageDomain + d.profileImageUrl+'?v='+d.memberVersion+'" alt="프로필이미지" onerror="this.src=\'./images/contents/img_profile02.png\'"></a>\n';	
    	        			}
    	        			html += '        </div>\n';
    	        			html += '    </div>\n';
    	        			html += '    <div class="right" onclick="$(\'.webj-new-push-'+d.noticeIdx+'\').remove();">\n';
    	        			if (d.noticeCode == 'notice-01') {
        	        			html += '        <ul><li><p>“웹쟁이”에 가입해 주셔서 감사합니다.<br>이 알림 패널은 귀하의 작품 활동에 있어서 다양한 업데이트된 정보를 확인할 수 있습니다. 질문이나 제안사항이 있으시면 언제든지 문의해 주시기 바랍니다.<br>당신과 함께하게 되어 기쁩니다.<br><br>-웹쟁이 팀</p></li></ul>\n';
    	        			} else if (d.noticeCode == 'notice-03') {
    	        				html += '        <p><a class="red profile" data-mindex="'+d.noticeMemberIdx+'">'+d.noticeMemberNickName+'</a>님이 귀하를 팔로우하였습니다.</p>\n';
    	        			} else if (d.noticeCode == 'notice-04') {
    	        				html += '        <div class="t_list"><a href="/artwork/artworkView?artworkIndex='+d.artworkIndex+'" class="cbp-singlePage" rel="nofollow"><ul><li class="notice_img"><img src="'+webj.imageDomain+d.coverFileUploadSource+'?v='+d.artworkVersion+'" alt=""></li><li class="right_txtBox"><p><span class="profile" data-mindex="'+d.noticeMemberIdx+'">'+d.noticeMemberNickName+' :</span> '+d.noticeMessage+'</p></li></ul></a></div>\n';
    	        			} else if (d.noticeCode == 'notice-05') {
    	        				html += '        <p><a class="red profile" data-mindex="'+d.noticeMemberIdx+'">'+d.noticeMemberNickName+'</a>님이 귀하의 프로젝트를 평가했습니다.</p>\n';
    	        				html += '        <div class="t_list"><a href="/artwork/artworkView?artworkIndex='+d.artworkIndex+'" class="cbp-singlePage" rel="nofollow"><ul><li class="notice_img eval"><span><img src="'+webj.imageDomain+d.coverFileUploadSource+'?v='+d.artworkVersion+'" alt=""></span></li></ul></a></div>\n';
    	        			} else if (d.noticeCode == 'notice-06' && webj.isNotEmptyString(d.collectionName)) {
    	        				html += '        <p><a class="red profile" data-mindex="'+d.noticeMemberIdx+'">'+d.noticeMemberNickName+'</a> 님이 <a href="/artwork/artworkView?artworkIndex='+d.artworkIndex+'" class="cbp-singlePage red" rel="nofollow">“'+d.artworkTitle+'”</a>을(를) 저장했습니다.</p>\n';
    	        				html += '        <div class="t_list"><a href="/profileCollectionList?memberIndex='+d.noticeMemberIdx+'&collectionIndex='+d.noticeMessage+'" target="_self"><ul class="brand"><li class="notice_img"><img src="'+webj.imageDomain+d.coverFileUploadSource+'?v='+d.artworkVersion+'" alt=""></li></ul></a><a href="/profileCollectionList?memberIndex='+d.noticeMemberIdx+'&collectionIndex='+d.noticeMessage+'" target="_self" class="t_link">'+d.collectionName+'</a></div>\n';
    	        			} else if (d.noticeCode == 'notice-07') {
    	        				html += '        <ul><li><p>축하드립니다! <br><a href="/artwork/artworkView?artworkIndex='+d.artworkIndex+'" class="cbp-singlePage" rel="nofollow"><span class="blue" style="color: #328ccc !important;">“'+d.artworkTitle+'”</span></a>가 웹쟁이 Pick 에 선정되었습니다.</p><p>- 웹쟁이 팀</p></li></ul>\n';
    	        			}
    	        			html += '        <div class="time_txt">'+d.regDtText+'</div>\n';
    	        			html += '    </div>\n';
    	        			html += '</li> \n';
    	        		});
    	        	}
    	        	$('.webj-notice-container').append(html);
    	        	var unacknowledgedNoticeCount = data.unacknowledgedNoticeCount;
    	        	if (unacknowledgedNoticeCount != 0) {
    	        		if (unacknowledgedNoticeCount > 99) {
    	        			unacknowledgedNoticeCount = 99;
    	        		}
    	        		$('.webj-header-notice-count').text(unacknowledgedNoticeCount.formatCommaInteger());
    	        		$('.webj-header-notice-count').show();
    	        	} else {
    	    			$('.webj-header-notice-count').text('');
    	        		$('.webj-header-notice-count').hide();
    	        	}
    	        	if (callback != undefined) {
    	        		callback();
    	        	}
    	        } else {
    	            webj.openErrorPopup(data.resultMessage, data.stackTrace);
    	        }
    	    });			
		}
		$('.webj-btn-open-notice-popup').click(function() {
			var thisObj = this;
    		getMemberNoticeList(function(){
				var winWidth = $(window).width();
				if (winWidth > 900) {
					$(thisObj).siblings('.tip01').addClass('active');
					$(thisObj).parent().siblings().find('.tip').removeClass('active');
				} else {
					var activePop = $(thisObj).attr("href");
					$(activePop).fadeIn(300);
					$('body').addClass("hid");
					$('body').bind('touchmove', function(e){e.preventDefault()});
				}     			
    		});
		});
		$('.webj-notice-container, .webj-mobile-notice-container').on('scroll', function() {
		     if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
		    	 getMemberNoticeList();
		     }
		});
	}
	// 헤더 서치 키워드
	$('.webj-search-artwork').mousedown(function(){
		location.href = '/searchArtwork';
	});
	$('.webj-search-freesource').mousedown(function(){
		location.href = '/searchFreesource';
	});
	$('.webj-search-artist').mousedown(function(){
		location.href = '/searchArtist';
	});
	$('#search').keydown(function(e){
		if (e.keyCode == 38 || e.keyCode == 40) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
		}
		if ((e.keyCode == 38 || e.keyCode == 40) && $('.webj-searched-item').length > 0) {
			var selectedIndex = -1;
			$('.webj-searched-item').each(function(i,ele){
				if ($(ele).hasClass('webj-searched-item-selected')) {
					selectedIndex = i;
					return false;
				}
			});
			$('.webj-searched-item').removeClass('webj-searched-item-selected');
			if (e.keyCode == 40) { // DOWN
				if (selectedIndex == -1 || selectedIndex == $('.webj-searched-item').length - 1) {
					$($('.webj-searched-item').get(0)).addClass('webj-searched-item-selected');
				} else {
					$($('.webj-searched-item').get(selectedIndex)).removeClass('webj-searched-item-selected');
					$($('.webj-searched-item').get(selectedIndex+1)).addClass('webj-searched-item-selected');
				}
			} else if (e.keyCode == 38) { // UP
				if (selectedIndex <= 0) {
					$($('.webj-searched-item').get($('.webj-searched-item').length-1)).addClass('webj-searched-item-selected');
				} else {
					$($('.webj-searched-item').get(selectedIndex-1)).addClass('webj-searched-item-selected');
				}
			}
		}
		setTimeout(function(){
			if (e.keyCode == 13) {
				var selectedIndex = -1;
				$('.webj-searched-item').each(function(i,ele){
					if ($(ele).hasClass('webj-searched-item-selected')) {
						selectedIndex = i;
						return false;
					}
				});
				if (selectedIndex == -1) {
					if ($('#search').val().trim().length > 0) {
						location.href = '/searchArtwork?keyword='+$('#search').val().trim();
						return;
					}
					if (beforeKeyword != $('#search').val().trim()) {
						searchByKeyword($('#search').val().trim());	
					}					
				} else {
					location.href = '/searchArtwork?keyword='+$('.webj-searched-item-selected').text();
				}
			} else {
				if (beforeKeyword != $('#search').val().trim()) {
					searchByKeyword($('#search').val().trim());	
				}
			}			
		}, 1);
	});
	
	$('.search_wrap .search').off('focusout');
	
	$('.search_wrap .search').focusout(function(){
		setTimeout(function(thisObj){
			$(thisObj).parent().removeClass('on');
			$(thisObj).parent().find('.search_list').removeClass('active');			
		},100, this);
	})
	
	$(document).on('click', '.webj-searched-item', function(e){
		location.href = '/searchArtwork?keyword='+$(this).text().trim();
	});
	
	$('.webj-input-clear-search-keyword').click(function(e){
		$('.search_wrap').addClass('on');
		$('.search_list').addClass('active');
		$('.li_top').show();
		$('.webj-msearched-items').empty();
		searchByKeyword('');
		setTimeout(function(){
			if (webj.isMobile()) {
				$('#searchm').focus();
			} else {
				$('#search').focus();	
			}
		},100);
	});
	var beforeKeyword;
	var searchByKeyword = function(keyword, callback) {
		beforeKeyword = keyword;
		if (keyword.length == 0) {
			$('.webj-searched-items').empty();
			$('.li_top').show();
		} else {
			webj.ajaxPost('/searchTagListByKeywordAtHeader', {keyword:keyword}, function(data) {
		        if (data.result == 'success') {
		        	if (data.searchItemList.length == 0) {
		        		$('.search_wrap').addClass('on');
		        		$('.search_list').addClass('active');
		        		$('.li_top').show();
		        		$('.webj-searched-items').empty();
		        	} else {
		        		$('.search_wrap').addClass('on');
		        		$('.search_list').addClass('active');
		        		$('.li_top').hide();
		        		$('.webj-searched-items').empty();
		        		$(data.searchItemList).each(function(i,dataItem){
		        			$('.webj-searched-items').append('<li class="webj-searched-item">'+dataItem.searchName+'</li>');
		        		});
		        	}
		        	if (callback != undefined) {
		        		callback();
		        	}
		        } else {
		            webj.openErrorPopup(data.resultMessage, data.stackTrace);
		        }
		    });
		}
	}
	
	$('#searchm').keydown(function(e){
		if (e.keyCode == 38 || e.keyCode == 40) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
		}
		if ((e.keyCode == 38 || e.keyCode == 40) && $('.webj-searched-item').length > 0) {
			var selectedIndex = -1;
			$('.webj-searched-item').each(function(i,ele){
				if ($(ele).hasClass('webj-searched-item-selected')) {
					selectedIndex = i;
					return false;
				}
			});
			$('.webj-searched-item').removeClass('webj-searched-item-selected');
			if (e.keyCode == 40) { // DOWN
				if (selectedIndex == -1 || selectedIndex == $('.webj-searched-item').length - 1) {
					$($('.webj-searched-item').get(0)).addClass('webj-searched-item-selected');
				} else {
					$($('.webj-searched-item').get(selectedIndex)).removeClass('webj-searched-item-selected');
					$($('.webj-searched-item').get(selectedIndex+1)).addClass('webj-searched-item-selected');
				}
			} else if (e.keyCode == 38) { // UP
				if (selectedIndex <= 0) {
					$($('.webj-searched-item').get($('.webj-searched-item').length-1)).addClass('webj-searched-item-selected');
				} else {
					$($('.webj-searched-item').get(selectedIndex-1)).addClass('webj-searched-item-selected');
				}
			}
		}
		setTimeout(function(thisObj){
			if (e.keyCode == 13) {
				var selectedIndex = -1;
				$('.webj-searched-item').each(function(i,ele){
					if ($(ele).hasClass('webj-searched-item-selected')) {
						selectedIndex = i;
						return false;
					}
				});
				if (selectedIndex == -1) {
					if ($('#searchm').val().trim().length > 0) {
						location.href = '/searchArtwork?keyword='+$('#searchm').val().trim();
					} else {
						if (beforeKeyword == undefined) {
							if (webj.isNotEmptyString($('#searchm').val().trim())) {
								searchMByKeyword($('#searchm').val().trim());
							}
						} else{
							if (beforeKeyword != $('#searchm').val().trim()) {
								searchMByKeyword($('#searchm').val().trim());
							}						
						}						
					}
				} else {
					if (webj.isNotEmptyString($('.webj-searched-item-selected').text().trim())) {
						location.href = '/searchArtwork?keyword='+$('.webj-searched-item-selected').text().trim();	
					} else if (webj.isNotEmptyString($('#searchm').val().trim())) {
						location.href = '/searchArtwork?keyword='+$('#searchm').val().trim();
					}
				}
			} else {
				if (beforeKeyword != $('#searchm').val().trim()) {
					searchMByKeyword($('#searchm').val().trim());
				}
			}			
		}, 100, this);
	});
	
	var searchMByKeyword = function(keyword, callback) {
		beforeKeyword = keyword;
		if (webj.isEmptyString(keyword)) {
			$('.webj-msearched-items').empty();
			return;
		}
		webj.ajaxPost('/searchTagListByKeywordAtHeader', {keyword:keyword}, function(data) {
	        if (data.result == 'success') {
	        	$('.webj-msearched-items').empty();
	        	if (data.searchItemList.length > 0) {
	        		$(data.searchItemList).each(function(i,dataItem){
	        			$('.webj-msearched-items').append('<li class="webj-searched-item">'+dataItem.searchName+'</li>');
	        		});
	        	}
	        	if (callback != undefined) {
	        		callback();
	        	}
	        } else {
	            webj.openErrorPopup(data.resultMessage, data.stackTrace);
	        }
	    });
	}

	/*
	setInterval(function(){
		$('.search_list').each(function(i,ele){
			if ($(ele).hasClass('active')) {
				$($('.search_wrap').get(i)).addClass('on');
			} else {
				$($('.search_wrap').get(i)).removeClass('on');
			}
		});
	}, 100);
	*/
	
});

/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
  define("FileSaver.js", function() {
    return saveAs;
  });
}

// 작품 상세 브라우저 백버튼 대응
window.onhashchange = function() {
    setTimeout(function(){
        if (location.hash.indexOf('#cbp=/') == -1 && $('.cbp-popup-close').length > 0) {
        	$('.cbp-popup-close').click();
        } else if (location.hash.indexOf('#cbp=/') != -1 && $('.cbp-popup-close').length == 0) {
        	$('.cbp-singlePage').each(function(i,ele){
        		if ($(ele).attr('href').indexOf(location.hash.split('?')[1]) != -1) {
        			$(ele).click();
        			return false;
        		}
        	});
        }
    }, 10);
};
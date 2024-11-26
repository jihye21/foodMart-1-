

/***** imgLiquid *****/
/*
imgLiquid v0.9.944 / 03-05-2013
jQuery plugin to resize images to fit in a container.
Copyright (c) 2012 Alejandro Emparan (karacas) @krc_ale
Dual licensed under the MIT and GPL licenses
https://github.com/karacas/imgLiquid

ex:
	$('.imgLiquid').imgLiquid({fill:true});

	// OPTIONS:

	> js:
			fill: true,
			verticalAlign:		// 'center' //	'top'	//	'bottom' // '50%'  // '10%'
			horizontalAlign:	// 'center' //	'left'	//	'right'  // '50%'  // '10%'

	> CallBacks:
			onStart:		function(){},
			onFinish:		function(){},
			onItemStart:	function(index, container, img){},
			onItemFinish:	function(index, container, img){}

	> hml5 data attr (overwrite all)
			data-imgLiquid-fill='true'
			data-imgLiquid-horizontalAlign='center'
			data-imgLiquid-verticalAlign='center'
*/
//


var imgLiquid = imgLiquid || {VER: '0.9.944'};
imgLiquid.bgs_Available = false;
imgLiquid.bgs_CheckRunned = false;
imgLiquid.injectCss = '.imgLiquid img {visibility:hidden}';


(function ($) {

	// ___________________________________________________________________

	function checkBgsIsavailable() {
		if (imgLiquid.bgs_CheckRunned) return;
		else imgLiquid.bgs_CheckRunned = true;

		var spanBgs = $('<span style="background-size:cover" />');
		$('body').append(spanBgs);

		!function () {
			var bgs_Check = spanBgs[0];
			if (!bgs_Check || !window.getComputedStyle) return;
			var compStyle = window.getComputedStyle(bgs_Check, null);
			if (!compStyle || !compStyle.backgroundSize) return;
			imgLiquid.bgs_Available = (compStyle.backgroundSize === 'cover');
		}();

		spanBgs.remove();
	}




	// ___________________________________________________________________

	$.fn.extend({
		imgLiquid: function (options) {

			this.defaults = {
				fill: true,
				verticalAlign: 'center',			//	'top'	//	'bottom' // '50%'  // '10%'
				horizontalAlign: 'center',			//	'left'	//	'right'  // '50%'  // '10%'
				useBackgroundSize: true,
				useDataHtmlAttr: true,

				responsive: true,					/* Only for use with BackgroundSize false (or old browsers) */
				delay: 0,							/* Only for use with BackgroundSize false (or old browsers) */
				fadeInTime: 0,						/* Only for use with BackgroundSize false (or old browsers) */
				removeBoxBackground: true,			/* Only for use with BackgroundSize false (or old browsers) */
				hardPixels: true,					/* Only for use with BackgroundSize false (or old browsers) */
				responsiveCheckTime: 500,			/* Only for use with BackgroundSize false (or old browsers) */ /* time to check div resize */
				timecheckvisibility: 500,			/* Only for use with BackgroundSize false (or old browsers) */ /* time to recheck if visible/loaded */

				// CALLBACKS
				onStart: null,						// no-params
				onFinish: null,						// no-params
				onItemStart: null,					// params: (index, container, img )
				onItemFinish: null,					// params: (index, container, img )
				onItemError: null					// params: (index, container, img )
			};


			checkBgsIsavailable();
			var imgLiquidRoot = this;

			// Extend global settings
			this.options = options;
			this.settings = $.extend({}, this.defaults, this.options);

			// CallBack
			if (this.settings.onStart) this.settings.onStart();




			// ___________________________________________________________________

			return this.each(function ($i) {

				// MAIN >> each for image

				var settings = imgLiquidRoot.settings,
				$imgBoxCont = $(this),
				$img = $('img:first',$imgBoxCont);
				if (!$img.length) {onError(); return;}


				// Extend settings
				if (!$img.data('imgLiquid_settings')) {
					// First time
					settings = $.extend({}, imgLiquidRoot.settings, getSettingsOverwrite());
				} else {
					// Recall
					// Remove Classes
					$imgBoxCont.removeClass('imgLiquid_error').removeClass('imgLiquid_ready');
					settings = $.extend({}, $img.data('imgLiquid_settings'), imgLiquidRoot.options);
				}
				$img.data('imgLiquid_settings', settings);


				// Start CallBack
				if (settings.onItemStart) settings.onItemStart($i, $imgBoxCont, $img); /* << CallBack */


				// Process
				if (imgLiquid.bgs_Available && settings.useBackgroundSize)
					processBgSize();
				else
					processOldMethod();


				// END MAIN <<




				// ___________________________________________________________________

				function processBgSize() {

					// Check change img src
					if ($imgBoxCont.css('background-image').indexOf(encodeURI($img.attr('src'))) === -1) {
						// Change
						$imgBoxCont.css({'background-image': 'url("' + encodeURI($img.attr('src')) + '")'});
					}

					$imgBoxCont.css({
						'background-size':		(settings.fill) ? 'cover' : 'contain',
						'background-position':	(settings.horizontalAlign + ' ' + settings.verticalAlign).toLowerCase(),
						'background-repeat':	'no-repeat'
					});
/*
					$('a:first', $imgBoxCont).css({
						'display':	'block',
						'width':	'100%',
						'height':	'100%'
					});
*/
					$('img', $imgBoxCont).css({'display': 'none'});

					if (settings.onItemFinish) settings.onItemFinish($i, $imgBoxCont, $img); /* << CallBack */

					$imgBoxCont.addClass('imgLiquid_bgSize');
					$imgBoxCont.addClass('imgLiquid_ready');
					checkFinish();
				}




				// ___________________________________________________________________

				function processOldMethod() {

					// Check change img src
					if ($img.data('oldSrc') && $img.data('oldSrc') !== $img.attr('src')) {

						/* Clone & Reset img */
						var $imgCopy = $img.clone().removeAttr('style');
						$imgCopy.data('imgLiquid_settings', $img.data('imgLiquid_settings'));
						$img.parent().prepend($imgCopy);
						$img.remove();
						$img = $imgCopy;
						$img[0].width = 0;

						// Bug ie with > if (!$img[0].complete && $img[0].width) onError();
						setTimeout(processOldMethod, 10);
						return;
					}


					// Reproceess?
					if ($img.data('imgLiquid_oldProcessed')) {
						makeOldProcess(); return;
					}


					// Set data
					$img.data('imgLiquid_oldProcessed', false);
					$img.data('oldSrc', $img.attr('src'));


					// Hide others images
					$('img:not(:first)', $imgBoxCont).css('display', 'none');


					// CSSs
					$imgBoxCont.css({'overflow': 'hidden'});
					$img.fadeTo(0, 0).removeAttr('width').removeAttr('height').css({
						'visibility': 'visible',
						'max-width': 'none',
						'max-height': 'none',
						'width': 'auto',
						'height': 'auto',
						'display': 'block'
					});


					// CheckErrors
					$img.on('error', onError);
					$img[0].onerror = onError;


					// loop until load
					function onLoad() {
						if ($img.data('imgLiquid_error') || $img.data('imgLiquid_loaded') || $img.data('imgLiquid_oldProcessed')) return;
						if ($imgBoxCont.is(':visible') && $img[0].complete && $img[0].width > 0 && $img[0].height > 0) {
							$img.data('imgLiquid_loaded', true);
							setTimeout(makeOldProcess, $i * settings.delay);
						} else {
							setTimeout(onLoad, settings.timecheckvisibility);
						}
					}


					onLoad();
					checkResponsive();
				}




				// ___________________________________________________________________

				function checkResponsive() {

					/* Only for oldProcessed method (background-size dont need) */

					if (!settings.responsive && !$img.data('imgLiquid_oldProcessed')) return;
					if (!$img.data('imgLiquid_settings')) return;

					settings = $img.data('imgLiquid_settings');

					$imgBoxCont.actualSize = $imgBoxCont.get(0).offsetWidth + ($imgBoxCont.get(0).offsetHeight / 10000);
					if ($imgBoxCont.sizeOld && $imgBoxCont.actualSize !== $imgBoxCont.sizeOld) makeOldProcess();

					$imgBoxCont.sizeOld = $imgBoxCont.actualSize;
					setTimeout(checkResponsive, settings.responsiveCheckTime);
				}




				// ___________________________________________________________________

				function onError() {
					$img.data('imgLiquid_error', true);
					$imgBoxCont.addClass('imgLiquid_error');
					if (settings.onItemError) settings.onItemError($i, $imgBoxCont, $img); /* << CallBack */
					checkFinish();
				}




				// ___________________________________________________________________

				function getSettingsOverwrite() {
					var SettingsOverwrite = {};

					if (imgLiquidRoot.settings.useDataHtmlAttr) {
						var dif = $imgBoxCont.attr('data-imgLiquid-fill'),
						ha =  $imgBoxCont.attr('data-imgLiquid-horizontalAlign'),
						va =  $imgBoxCont.attr('data-imgLiquid-verticalAlign');

						if (dif === 'true' || dif === 'false') SettingsOverwrite.fill = Boolean (dif === 'true');
						if (ha !== undefined && (ha === 'left' || ha === 'center' || ha === 'right' || ha.indexOf('%') !== -1)) SettingsOverwrite.horizontalAlign = ha;
						if (va !== undefined && (va === 'top' ||  va === 'bottom' || va === 'center' || va.indexOf('%') !== -1)) SettingsOverwrite.verticalAlign = va;
					}

					if (imgLiquid.isIE && imgLiquidRoot.settings.ieFadeInDisabled) SettingsOverwrite.fadeInTime = 0; //ie no anims
					return SettingsOverwrite;
				}





				// ___________________________________________________________________

				function makeOldProcess() { /* Only for old browsers, or useBackgroundSize seted false */

					// Calculate size
					var w, h, wn, hn, ha, va, hdif, vdif,
					margT = 0,
					margL = 0,
					$imgCW = $imgBoxCont.width(),
					$imgCH = $imgBoxCont.height();


					// Save original sizes
					if ($img.data('owidth')	=== undefined) $img.data('owidth',	$img[0].width);
					if ($img.data('oheight') === undefined) $img.data('oheight', $img[0].height);


					// Compare ratio
					if (settings.fill === ($imgCW / $imgCH) >= ($img.data('owidth') / $img.data('oheight'))) {
						w = '100%';
						h = 'auto';
						wn = Math.floor($imgCW);
						hn = Math.floor($imgCW * ($img.data('oheight') / $img.data('owidth')));
					} else {
						w = 'auto';
						h = '100%';
						wn = Math.floor($imgCH * ($img.data('owidth') / $img.data('oheight')));
						hn = Math.floor($imgCH);
					}

					// Align X
					ha = settings.horizontalAlign.toLowerCase();
					hdif = $imgCW - wn;
					if (ha === 'left') margL = 0;
					if (ha === 'center') margL = hdif * 0.5;
					if (ha === 'right') margL = hdif;
					if (ha.indexOf('%') !== -1){
						ha = parseInt (ha.replace('%',''), 10);
						if (ha > 0) margL = hdif * ha * 0.01;
					}


					// Align Y
					va = settings.verticalAlign.toLowerCase();
					vdif = $imgCH - hn;
					if (va === 'left') margT = 0;
					if (va === 'center') margT = vdif * 0.5;
					if (va === 'bottom') margT = vdif;
					if (va.indexOf('%') !== -1){
						va = parseInt (va.replace('%',''), 10);
						if (va > 0) margT = vdif * va * 0.01;
					}


					// Add Css
					if (settings.hardPixels) {w = wn; h = hn;}
					$img.css({
						'width': w,
						'height': h,
						'margin-left': Math.floor(margL),
						'margin-top': Math.floor(margT)
					});


					// FadeIn > Only first time
					if (!$img.data('imgLiquid_oldProcessed')) {
						$img.fadeTo(settings.fadeInTime, 1);
						$img.data('imgLiquid_oldProcessed', true);
						if (settings.removeBoxBackground) $imgBoxCont.css('background-image', 'none');
						$imgBoxCont.addClass('imgLiquid_nobgSize');
						$imgBoxCont.addClass('imgLiquid_ready');
					}


					if (settings.onItemFinish) settings.onItemFinish($i, $imgBoxCont, $img); /* << CallBack */
					checkFinish();
				}




				// ___________________________________________________________________

				function checkFinish() { /* Check callBack */
					if ($i === imgLiquidRoot.length - 1) if (imgLiquidRoot.settings.onFinish) imgLiquidRoot.settings.onFinish();
				}


			});
		}
	});
})(jQuery);

// modal 팝업 제이쿼리
// modal
! function (t) {
	var n = {
			show: !0,
			backdrop: !0,
			backdropClick: !0,
			keyboard: !0,
			autoPosition: !0,
			dialogMarginTop: 20,
			width: null,
			top: null,
			left: null
		},
		o = {
			BACKDROP: "modal-backdrop",
			OPEN: "modal-open",
			FADE: "fade",
			IN: "in"
		},
		i = {
			MODAL: ".modal",
			DIALOG: ".modal-dialog",
			CONTENT: ".modal-content",
			DATA_TOGGLE: '[data-toggle="modal"]',
			DATA_DISMISS: '[data-dismiss="modal"]'
		};
	t.fn.modal = function (e) {
		function s() {
			var n = t(window).height(),
				o = r.find(i.DIALOG).height(),
				e = n / 2 - o / 2;
			e < g.settings.dialogMarginTop && (e = g.settings.dialogMarginTop), g.settings.top && (e = g.settings.top), t(i.DIALOG).css({
				marginTop: e
			})
		}

		function a() {
			t(document).off("focusin").on("focusin", function (n) {
				f === n.target || t(f).has(n.target).length || f.focus()
			})
		}

		function d() {
			t(document).find("." + o.BACKDROP).show(); //07.21 jhj 수정
			t(document).find("." + o.BACKDROP).length || t(h).appendTo(document.body)
		}

		function c() {
			t("." + o.BACKDROP).remove(), h = null
			t(document.body).removeClass('hid');
		}

		function u() {
			
				t(document.body).addClass('hid');
			

			d(), r.show(), g.settings.width && t(i.DIALOG).css({
				width: g.settings.width,
				marginLeft: "auto",
				marginRight: "auto"
			}), t(i.DIALOG).css({
				marginLeft: g.settings.left
			}), g.settings.autoPosition && s(), a(), r.focus()
		}

		function l() {
			t(document.body).removeClass(o.OPEN).removeClass('on'), c(), r.hide(), t(i.DIALOG).css("margin-top", ""), t(document).off("focusin")

		}
		if (0 === this.length) return this;
		if (this.length > 1) return this.each(function () {
			t(this).modal(e)
		}), this;
		var g = {},
			r = this,
			f = r[0],
			h = null,
				m = function () {
				g.settings = t.extend({}, n, e), r.attr("tabindex", "-1"), g.settings.backdrop ? (h = document.createElement("div"), h.className = o.BACKDROP) : h = null, r.on("click", function (t) {
					if (window.webjModalPopup) { return; }
					t.target === t.currentTarget && g.settings.backdrop && g.settings.backdropClick && l();
				}), g.settings.keyboard && t(document.body).on("keydown", function (t) {
					27 === t.which && l()
				})
			};
		return m(), g.settings.show ? u() : l(), t(window).bind("resize", function () {
			s()
		}), this
	}, t(document).on("click", i.DATA_TOGGLE, function (n) {
		var o = t(this).attr("data-target");
		"A" === this.tagName && n.preventDefault(), t(o).modal();
	}), t(document).on("click", i.DATA_DISMISS, function () {
		t(document.body).removeClass('hid');
		t(i.MODAL).modal({
			show: !1
		})
		return false;
	})

}(jQuery);

	
/*** Layout **/
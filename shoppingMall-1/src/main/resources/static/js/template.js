$(function () {
	//header 	



	$.fn.scrollStopped = function (callback) {
		var that = this,
			$this = $(that);
		$this.scroll(function (ev) {
			clearTimeout($this.data('scrollTimeout'));
			$this.data('scrollTimeout', setTimeout(callback.bind(that), 250, ev));
		});
	};

	$(window).scrollStopped(function (ev) {
		stickyHeader()
	})

	function stickyHeader() {
		// 스크롤시 하이딩 액션	
		var stickyY = $(window).scrollTop();
		$('header').css({
			'top': stickyY + 'px',
			'position': 'absolute'
		});

	}
	
	
	
	var $WIN = $(window); // window jQuery object
	var $DOC = $(document); // document jQuery object
	var $HEADER;

	var HEIGHT = $WIN.height(); // window height
	var WIDTH = $WIN.width(); // window width


	$WIN.resize(function () {
		HEIGHT = $WIN.height();
		WIDTH = $WIN.width();
		$DOC.trigger('scroll');
	});
	// window resize


 
		$(window).scroll(function () {
			var windowTop = $(window).scrollTop();
			var headerHeight = $('#header').height()
			$('header').css({
				'position': 'fixed',
				'top': 0
			})
			if ($(this).scrollTop() > $('#header').height()) {
				$('#header').addClass('fix');
			} else {
				$('#header').removeClass('fix');
			} //header fix

		})
	// 스크롤 멈춤 감지 

	
	

	//사이드툴팁
	// window resize
		//$(window).resize(function () {
	$(window).resize(function () {
		var myWinWidth = $(window).width()		
		if (myWinWidth < 901) { // 900이하
			
			$('#wrap').removeClass('open');
			$('body').removeClass('hid');
			$('.alarm .btn_pop_open').removeClass('on');
				//페이지팝업
				var PopHidden = $('body');
				var PopCont = $('.popup');
				$('.btn_pop_open').click(function() {
					PopHidden.css('height', $(window).height());
					//console.log('@1');
					var activePop = $(this).attr("href");
					$(activePop).fadeIn(300);
					$('body').addClass("hid");
					$('body').bind('touchmove', function(e){e.preventDefault()});
					return false;
				});

				$('.pop .btn_close').click(function() {	
					$(PopCont).fadeOut(300);
					PopHidden.css('height', '100%');
					$('body').removeClass('hid');
					$('body').unbind('touchmove');
					return false;
				});
			

			} else if (myWinWidth > 900) {				
            	$('body').removeClass('hid');	
				$('.alarm .btn_pop_open').click(function () {		
					$('body').removeClass('hid');
					$(this).toggleClass('on');
					$(this).siblings('.tip01').toggleClass('active');
				});
				$('.btn_close').click(function () {
					$(this).parent().parent().removeClass('active');
					return false;
				});		
		}

	}).resize()
	$(window).trigger('resize');
	// 메뉴
	$('.side_menu li a').on('mouseenter', function () {
		$(this).addClass('tooltip');
	});
	$('.side_menu li a').on('mouseleave', function () {
		$(this).removeClass('tooltip');
	});

	$('.all_menu').click(function () {
		$('#wrap').toggleClass('open');

		var $target = $(this).parent().parent('#wrap')
		if ($target.hasClass('open')) {
			$('.side_menu li a').on('mouseenter', function () {
				$(this).removeClass('tooltip');
			});
		} else {
			$('.side_menu li a').on('mouseenter', function () {
				$(this).addClass('tooltip');
			});
		}

	});

	//프로필
	$('.profi a').click(function () {
		$(this).siblings('.tip02').toggleClass('active');
		$(this).parent().siblings().find('.tip').removeClass('active');
	});
	$('.btn_lose').click(function () {
		$(this).parent().parent().removeClass('active');

	});
	$('.b_close').click(function () {
		$(this).parent().parent('.tip').removeClass('active');
	});


	//search
	$('.search_list .li_top ul li').click(function () {
		$('.search_list .li_top ul li').removeClass('on');
		$(this).toggleClass('on');
	});

	$('.search_list .li_cont ul li').click(function () {
		$('.search_list').removeClass('active');
		$('.search_wrap').removeClass('on');
	});

	//search mobile
	$('.h_side > li.search a').click(function () {
		$(this).siblings('.pop').addClass('active');
		$('body').addClass('hid');
	});
	$('.pop .cancel').click(function () {
		$(this).parent().parent('.pop').removeClass('active');
		$('body').removeClass('hid');
	});

	//글쓸때 삭제버튼 노출
	$('.input_del').click(function () {
		var el = document.getElementsByClassName('search');

		for (var i = 0; i < el.length; i++) {

			el[i].value = '';
		}
		$(this).hide();
		
	
	});
	
	$('.search').on('propertychange change keyup paste input', function () {
		var $this = $(this),
			txt = $this.val();
		if (txt.length) {
			$this.siblings('.input_del').show();
		} else {
			$this.siblings('.input_del').hide();
		}
	});
	//pc
	//검색바
	/*$('.search_wrap').click(function () {
		$(this).addClass('on');
	});*/

$('.search_wrap .search').focusin(function(){
		$(this).parent().addClass('on');
		$(this).siblings('.search_list').addClass('active');
	})
	
	$('.search_wrap .search').focusout(function(){	
		setTimeout(function(thisObj){
			$(thisObj).parent().removeClass('on');
			$(thisObj).parent().find('.search_list').removeClass('active');			
		},100, this);
	})


	$('.search_header .search').on('propertychange change keyup paste input', function () {
		var $this = $(this),
			txt = $this.val();
		if (txt.length) {
			$this.parent().addClass('on');
		} else {
			$this.parent().removeClass('on');
		}
	});


	//모바일 gnb
	$('body').append('<span class=\"dimd\"></span>');
	$('.m_menu').click(function () {
		anioption = {
			time: 0.8,
			easing: 'easeOutCubic'
		};
		$('.dimd').fadeIn();
		$('.gnb_m').animate({
			"left": "0%"
		}, anioption);
		$('body').addClass('hid');
	});

	$('.menu_close, .dimd').click(function () {
		anioption = {
			time: 0.6,
			easing: 'linear'
		};
		$('.gnb_m').animate({
			"left": "-100%"
		}, anioption);
		$('.dimd').fadeOut();
		$('body').removeClass('hid');
	});
	
	//모바일메뉴셀렉트박스
	$('.prof').click(foldList)

	function foldList() {
		$(this).siblings('.list').stop().slideToggle();
		$(this).parent('.set_wrap').toggleClass('active');

	}
	
	//$('.cbp-item').hover(mouseOn, mouseOff)
	//console.log('@@@@');
	$(document).on('mouseenter', '.cbp-item', mouseOn);
	$(document).on('mouseleave', '.cbp-item', mouseOff);

	function mouseOn() {
		$(this).find('.over_Btn').addClass('active');
		$(this).find('.edit_Btn').show();
		$(this).find('.cbp-caption').addClass('over');
		$(this).find('.cap .btn_wrap').addClass('active');
	}

	function mouseOff() {
		$(this).find('.over_Btn').removeClass('active');
		$(this).find('.edit_Btn').hide();
		$(this).find('.cbp-caption').removeClass('over');
		$(this).find('.cap .btn_wrap').removeClass('active');
	}

	//셀렉트		
	$(".select dt a, .select_box dt a").click(function () {
		if ($(this).hasClass('on')) {
			$(this).removeClass('on');
			$(this).parent().siblings("dd").removeClass('active')

		} else {
			$(".select dt a").removeClass('on');
			$(this).toggleClass('on');
			$('.select dd').removeClass('active');
			$(this).parent().siblings("dd").toggleClass('active')
		}
	});

	//2021. 08. 17 필터 수정
	$('.filter').click(function () {
		$(this).toggleClass('on');
		if($(this).hasClass('on')) {
			$('.filter_cont').stop().slideDown(200);
		}else {
			$('.filter_cont').stop().slideUp(200);
		}
	});
	
	
	$('.tt').on('click', function () {
		$(this).parent('.box').toggleClass('on');
		$(this).parent().siblings().removeClass('on');
		$(this).siblings('div').toggleClass('active')
		$(this).parent().siblings('.box').find('div').removeClass('active');
	});

	//2021. 08. 17 작품 셀렉트 스크립트 추가
$(function() {
	var myWinWidth = $(window).width();	
		$(document).ready(function(){			
			if (myWinWidth <= 900) {				
			$('.select').addClass('m_select');				
			$('.filter').addClass('m_filter');	
			$('.filter_cont').addClass('m_filter_cont').slideUp();					
			
			$(".m_select dt a").click(function () { 				
					if ($(this).hasClass('on')) {						
						$('.m_filter').removeClass('on');
						$('.m_filter_cont').slideUp();
					} else {
					}
				});
			$('.filter').click(function () {
					if($(this).hasClass('on')){						
						$('.m_select dl dt a').removeClass('on');
						$('.m_select dl dd').removeClass('active');
					}
				});
			
			}//if end
          else if (myWinWidth > 900) {				 
			$('.select').removeClass('m_select');			
			$('.filter').removeClass('m_filter');	
			$('.filter_cont').removeClass('m_filter_cont').slideUp();				
		  }//else if end		
		/*$(window).resize(function () {	
			var myWinWidth = $(window).width();	
			if (myWinWidth <= 900) {				
	 		$('.select').addClass('m_select');
			$('.select dl dt a').removeClass('on');			
			$('.select dl dd').removeClass('active');				
			$('.filter').removeClass('on');	
			$('.filter').addClass('m_filter');	
			$('.filter_cont').addClass('m_filter_cont').slideUp();	
				$(".m_select dt a").click(function () { 				
					if ($(this).hasClass('on')) {						
						$('.m_filter').removeClass('on');
						$('.m_filter_cont').slideUp();
					} else {
					}
				});
			$('.filter').click(function () {
					if($(this).hasClass('on')){						
						$('.m_select dl dt a').removeClass('on');
						$('.m_select dl dd').removeClass('active');
					}
				});	
			}//if end
          else if (myWinWidth > 900) {				 
		 	$('.select').removeClass('m_select');
			$('.select dl dt a').removeClass('on');			
			$('.select dl dd').removeClass('active');
			$('.filter').removeClass('on');
			  $('.filter').removeClass('m_filter');	
			$('.filter_cont').removeClass('m_filter_cont').slideUp();				
		  }//else if end
		}); 	*/
		}) ;
		
	
		
});
	//2021. 08. 17카테고리닫기
$('.category_close').click(function(){
		$(this).parent('.list').removeClass('active');
		$(this).parent().parent('.box').removeClass('on');
	});
	
	
$('.input').on('propertychange change keyup paste input', function () {
		var $this = $(this),
			txt = $this.val();
		if (txt.length) {
			$this.addClass('ty');
		} else {
			$this.removeClass('ty');
		}
	});

	$('.tag_list li').click(function () {
		$(this).toggleClass('on');
	}); //개발언어


	$('.btn_edit').click(function () {
		$(this).siblings('.tip02').toggleClass('active');
		$(this).parent().siblings().find('.tip').removeClass('active');
	});
	//편집버튼

	$('.push_toggle').click(function () {
		if ($(this).hasClass('on') == true) {
			$(this).removeClass('on');
			$(this).addClass('off');
		} else {
			$(this).removeClass('off');
			$(this).addClass('on');
		}

	}); //스위치
	$('.togg_tab li a').click(function () {
		if ($(this).parent().hasClass('on') == true) {
			$(this).parent().removeClass('on');
		} else {
			$(this).parent().addClass('on');
			$(this).parent().siblings('li').removeClass('on');
		}

	}); //토클탭


	$('.sel_tab li').click(selMenu)

	function selMenu() {
		var index = $(this).index()
		$('.sel_tab li').removeClass('on')
		$(this).addClass('on')
		var index = $(this).index()
		$('.sel_list').hide()
		$('.sel_list').eq(index).fadeIn()
	}
	$('.sel_tab li').eq(0).trigger('click') //전체카테고리탭

	$('.cbp-item .over_Btn a.like').click(function () {
		$(this).toggleClass('on');
	}); //목록 하트

	//IMG를 Backgrond 이미지로 변환 
	$('.slide_backImg, .thumbnail_img, .cover_visual').imgLiquid({
		fill: true,
		horizontalAlign: "top",
		verticalAlign: "center"
	});
	

	/* 09.14 jhj */
	//프로필pick 호버
	$('.pick2').on('mouseenter', function () {
		$(this).parent('.pick_inner').addClass('active');
	});
	$('.pick_inner').on('mouseleave', function () {
		$(this).removeClass('active');
	});

	$('.prof_img a').on('click', function () {
		$(this).siblings('.filebox').children('#file01').click();
	});
	


//08.19 스크립트 추가
$(document).on('ready', function () {
	var Height = $('.login_cont').innerHeight();
	//var Top = $('.select_scrollArea').offset().top;
	//console.log(top);
	$('.login_bg' ).css('min-height', Height + 100);
	//$('.sel_wrap .select dl dd' ).css('top', Top);
	
	$(window).resize (resizeBoxM).resize();
	function resizeBoxM(){
		var Height = $('.login_cont').innerHeight();
	//	var Top = $('.select_scrollArea').offset().top;
		//console.log(top);
		$('.login_bg').css('min-height', Height + 100);
		//$('.sel_wrap .select dl dd' ).css('top', Top);
	}
});

	

	//0208 khj input
	$('input').on('propertychange change keyup paste input focus', function () {
		var $this = $(this),
			txt = $this.val();
		if (txt.length) {
			$this.addClass('acitve');
		} else {
			$this.removeClass('active');
			$this.removeClass('ty');
		} 
	});
	//버튼활성화
	$('input[name="certi_number"]').on('propertychange change keyup paste input', function () {
		var $this = $(this),
			txt = $this.val();
		if (txt.length) {
			$this.parent().siblings().find('button').removeClass('disabled');
		} else {
			$this.parent().siblings().find('button').addClass('disabled');
		} 
	});
	
	//설정 모바일 메뉴박스
	$('.set_menu > a').click(function(){
		$(this).toggleClass('active');
		$(this).siblings('ul').stop().slideToggle(200)
	});
	
	
	//통합검색 글쓸때 삭제버튼 노출
	$('.input_del2').click(function () {
		var el = document.getElementsByClassName('sear_ty');

		for (var i = 0; i < el.length; i++) {

			el[i].value = '';
		}
		$(this).hide();
	});
	
	$('.sear_ty').on('propertychange change keyup paste input', function () {
		var $this = $(this),
			txt = $this.val();
		if (txt.length) {
			$this.siblings('.input_del2').show();
		} else {
			$this.siblings('.input_del2').hide();
		}
	});
	
	//검색 모바일 메뉴박스
	$('.button_list > a').click(function(){
		$(this).toggleClass('active');
		$(this).siblings('ul').stop().slideToggle(200)
	});
	
	/*
	var aniTime = 600;
    $( '.character_movie' ).animate( {
          	opacity: '1',
			bottom: '10px',
        }, aniTime, function() {
          $( '.small_tip' ).animate( {
            opacity: '1',
			top: '-25px'
          })
     });
	$('.move_char').mouseenter(function(){
		$('.move_char .rank_box').addClass('active');
	});
	$('.move_char').mouseleave(function(){
		$('.move_char .rank_box').removeClass('active');
	});
*/
/*
	$(function() {
    $(document).mousemove(function(e){
        o = $('#wrap').offset();
        $('.dot').css({
            'top': e.pageY - o.top,
            'left': e.pageX - o.left
        });
    });
    $('.introduce03 .txt').mouseover(function(){
        $('.cursor').addClass('act');
	});
    $('.introduce03 .txt').mouseleave(function(){
        $('.cursor').removeClass('act');
	});
});
	
*/	
		
$(function() {
   var moveCusor = function() {
      if (!cursorMoved) {
         return;
      }
        o = $('#wrap').offset();
        $('.dot').css({
            'top': cursorMoveEvent.pageY - o.top,
            'left': cursorMoveEvent.pageX - o.left
        });
        cursorMoved = false;
   }
   var cursorMoved = false;
   var cursorMoveEvent;
   var xMousePos = 0;
   var yMousePos = 0;
   var lastScrolledLeft = 0;
   var lastScrolledTop = 0;
    $(document).on('ready mouseover mousemove scroll', function(e){
       cursorMoveEvent = {};
       cursorMoveEvent.type = e.type;
       if (e.type == 'scroll') {
          if(lastScrolledLeft != $(document).scrollLeft()){
                xMousePos -= lastScrolledLeft;
                lastScrolledLeft = $(document).scrollLeft();
                xMousePos += lastScrolledLeft;
            }
            if(lastScrolledTop != $(document).scrollTop()){
                yMousePos -= lastScrolledTop;
                lastScrolledTop = $(document).scrollTop();
                yMousePos += lastScrolledTop;
            }
          cursorMoveEvent.pageX = xMousePos;
          cursorMoveEvent.pageY = yMousePos;
       } else {
          cursorMoveEvent.pageX = e.pageX;
          cursorMoveEvent.pageY = e.pageY;
          xMousePos = e.pageX;
          yMousePos = e.pageY;
       }
       cursorMoved = true;
    });
    setInterval(moveCusor, 100);
  
   $(document).on('mouseover', '.introduce03 .txt', function(){
        $('.cursor').addClass('act');
   });
   $(document).on('mouseleave', '.introduce03 .txt', function(){
        $('.cursor').removeClass('act');
   });
});
	
	
	//회원탈퇴 사유 기타 체크박스
	$(".chk_list input:checkbox[name=d_etc]").click(function(){
		$(this).closest('.chk_list').next('.w_box').slideToggle('on')

	})

     
}) //ready

 


$(document).ready(function () {
    var itemsMainDiv = ('.MultiCarousel');
    var itemsDiv = ('.MultiCarousel-inner');
    var itemWidth = "";

    $('.leftLst, .rightLst').click(function () {
        var condition = $(this).hasClass("leftLst");
        if (condition)
            click(0, this);
        else
            click(1, this)
    });

    ResCarouselSize();




    $(window).resize(function () {
        ResCarouselSize();
    });

    //this function define the size of the items
    function ResCarouselSize() {
        var incno = 0;
        var dataItems = ("data-items");
        var itemClass = ('.item');
        var id = 0;
        var btnParentSb = '';
        var itemsSplit = '';
        var sampwidth = $(itemsMainDiv).width();
        var bodyWidth = $('body').width();
        $(itemsDiv).each(function () {
            id = id + 1;
            var itemNumbers = $(this).find(itemClass).length;
            btnParentSb = $(this).parent().attr(dataItems);
            itemsSplit = btnParentSb.split(',');
            $(this).parent().attr("id", "MultiCarousel" + id);


            if (bodyWidth >= 1200) {
                incno = itemsSplit[3];
                itemWidth = sampwidth / incno;
            }
            else if (bodyWidth >= 992) {
                incno = itemsSplit[2];
                itemWidth = sampwidth / incno;
            }
            else if (bodyWidth >= 768) {
                incno = itemsSplit[1];
                itemWidth = sampwidth / incno;
            }
            else {
                incno = itemsSplit[0];
                itemWidth = sampwidth / incno;
            }
            $(this).css({ 'transform': 'translateX(0px)', 'width': itemWidth * itemNumbers });
            $(this).find(itemClass).each(function () {
                $(this).outerWidth(itemWidth);
            });

            $(".leftLst").addClass("over");
            $(".rightLst").removeClass("over");

        });
    }


    //this function used to move the items
    function ResCarousel(e, el, s) {
        var leftBtn = ('.leftLst');
        var rightBtn = ('.rightLst');
        var translateXval = '';
        var divStyle = $(el + ' ' + itemsDiv).css('transform');
        var values = divStyle.match(/-?[\d\.]+/g);
        var xds = Math.abs(values[4]);
        if (e == 0) {
            translateXval = parseInt(xds) - parseInt(itemWidth * s);
            $(el + ' ' + rightBtn).removeClass("over");

            if (translateXval <= itemWidth / 2) {
                translateXval = 0;
                $(el + ' ' + leftBtn).addClass("over");
            }
        }
        else if (e == 1) {
            var itemsCondition = $(el).find(itemsDiv).width() - $(el).width();
            translateXval = parseInt(xds) + parseInt(itemWidth * s);
            $(el + ' ' + leftBtn).removeClass("over");

            if (translateXval >= itemsCondition - itemWidth / 2) {
                translateXval = itemsCondition;
                $(el + ' ' + rightBtn).addClass("over");
            }
        }
        $(el + ' ' + itemsDiv).css('transform', 'translateX(' + -translateXval + 'px)');
    }

    //It is used to get some elements from btn
    function click(ell, ee) {
        var Parent = "#" + $(ee).parent().attr("id");
        var slide = $(Parent).attr("data-slide");
        ResCarousel(ell, Parent, slide);
    }

});

$(function() {
	var header = $(".menu-area");
	$(window).scroll(function() {
		var scroll = $(window).scrollTop();
		if (scroll >= 50) {
			header.addClass("scrolled");
		} else {
			header.removeClass("scrolled");
		}
	});
});

(function($){
	$('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
	    if (!$(this).next().hasClass('show')) {
		    $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
	    }
	    var $subMenu = $(this).next(".dropdown-menu");
	    $subMenu.toggleClass('show');

	    $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
	       $('.dropdown-submenu .show').removeClass("show");
	    });

	    return false;
	});
})(jQuery)


function openCity(evt, cityName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
	  tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
	  tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(cityName).style.display = "block";
	evt.currentTarget.className += " active";
}


// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}


// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}


$(function(){
	$(".chat").niceScroll();
	
	var chatmessages = [{
			username : 'bot',
			name: 'نام مشاور',
			avatar: 'https://bootdey.com/img/Content/avatar/avatar2.png',
			text: 'پیام تستی مشاور پیام تستی مشاور پیام تستی مشاور پیام تستی مشاور پیام تستی مشاور پیام تستی مشاور',
			ago: '۵ دقیقه پیش' 
			
	},
	{
			username : 'example',
			name: 'نام کاربر',
			avatar: 'https://bootdey.com/img/Content/avatar/avatar1.png',
			text: 'پیام تستی کاربر پیام تستی کاربر پیام تستی کاربر پیام تستی کاربر پیام تستی کاربر پیام تستی کاربر پیام تستی کاربر',
			ago: '۲ دقیقه پیش' 
			
	}];
	
	let htmldiv = ``;
	jQuery.each( chatmessages, function( i, item ) {
			console.log(item);
			let position = item.username=='bot'? 'left': 'right';
			let ago = item.ago;
			htmldiv += `<div class="answer ${position}">
							<div class="avatar">
								<img src="${item.avatar}" alt="${item.name}">
								<div class="status offline"></div>
							</div>
							<div class="name">${item.name}</div>
							<div class="text">
								${item.text}
							</div>
							<div class="time">${ago}</div>
						</div>`;
	});
	
	console.log(htmldiv);
	$( "div#chat-messages" ).html(htmldiv);
	$(".chat").niceScroll();
}) 


$('.newbtn').bind("click" , function () {
	$('#pic').click();
});
 
function readURL(input) {
		if (input.files && input.files[0]) {
				var reader = new FileReader();

				reader.onload = function (e) {
						$('#blah')
								.attr('src', e.target.result);
				};

				reader.readAsDataURL(input.files[0]);
		}
}


function openNav() {
	document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
	document.getElementById("mySidenav").style.width = "0";
}


$(function() {
	var $tabButtonItem = $('#tab-button li'),
			$tabSelect = $('#tab-select'),
			$tabContents = $('.tab-contents'),
			activeClass = 'is-active';

	$tabButtonItem.first().addClass(activeClass);
	$tabContents.not(':first').hide();

	$tabButtonItem.find('a').on('click', function(e) {
		var target = $(this).attr('href');

		$tabButtonItem.removeClass(activeClass);
		$(this).parent().addClass(activeClass);
		$tabSelect.val(target);
		$tabContents.hide();
		$(target).show();
		e.preventDefault();
	});

	$tabSelect.on('change', function() {
		var target = $(this).val(),
				targetSelectNum = $(this).prop('selectedIndex');

		$tabButtonItem.removeClass(activeClass);
		$tabButtonItem.eq(targetSelectNum).addClass(activeClass);
		$tabContents.hide();
		$(target).show();
	});
});


$(document).ready(function () {
	$('[data-toggle="popover"]').popover();
});


// optional
$('#blogCarousel').carousel({
	interval: 5000
});
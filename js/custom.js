/** TIMER PARAM
 *
 *  Format of date: MOUNTH DAY, YEAR HOURS:MINUTES:SECONDS 
 *
 */

// Don't forget to change the Dates
var start = "October 1, 2013 00:00:00";
var end = 'January 1, 2014 00:00:00'; 

/** Hide Toolbar on iPhone **/
var ua = navigator.userAgent.toLowerCase();
if (ua.indexOf('iphone') != -1) {
	window.addEventListener('load', function(){
		setTimeout(scrollTo, 0, 0, 1);
	}, false);
}

var width;
$(function(){
	
	width = $(window).width();
	$(window).on('resize', function() {
		width = $(window).width();
	});

	/** Timer **/
	setTimeout(function(){
		$("#ct").countdown({
			until: new Date(end), 
			compact: true,
			onTick: updateTime
		});
	}, 100);
	
	/** Fix placeholder **/
	$('input[placeholder]').placeholder();
	
	/** Check-up the e-mail **/
	$('input[name=email]').bind('keyup keydown change', function(){
		var email = $('input[name=email]').val();
		(!isValidEmail(email) && email.length!=0) ? $(this).addClass('notvalid') : $(this).removeClass('notvalid');
	});
	
	$('.num div').eq(1).css('opacity', 0);
	
	/** Show the date of end **/
	var text_date = end.replace(end.substr(end.length-9), '');
	
	text_date = change_lang_date(text_date, ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "September", "Octubre", "Noviembre", "Diciembre"]);
	
	$('#progressbar .launch-date').text(text_date);
	
	update_progressbar();
	
	/** Sending email by AJAX **/
	$('#sub-form').submit(function(){

		var input = $('input[name=email]');
		if(input.hasClass('notvalid') || input.val().length == 0) {
			err(input);
			return false;
		}
		
		$('#subscribe').prop("disabled", true); // Disable the button;
		
		$.ajax({
			type: 'POST',
			url: $(this).attr('action'),
			data: $(this).serialize(),
			success: function(data) {
				if (data == 1) {
					$('#email form').animate({opacity: 0, marginTop: -30}, 200);
					$('#thank-you').animate({opacity: 1}, 200)
				} else err(input);
			}
		});

		return false;
	});

});

/** Makes timer work **/
function updateTime(time) {
	var ar = [];
	$.each(time, function(k,v) {
		if(k < 3) return true;
		ar.push(v.toString());
	});
	
	var nar = [];
	$.each(ar, function(k,v) {
		switch(k) {
			case 0:
				switch (v.length) {
					case 0: v = '000'; break;								
					case 1: v = '00'+v; break;
					case 2: v = '0'+v; break;
				}
			break;
			default:
				switch (v.length) {
					case 0: v = '00'; break;								
					case 1: v = '0'+v; break;
				}
			break;
		}

		$.each(v, function(key,val) {
			nar.push(val);
		});
	});
	
	// Update time
	$('.num').each(function(k){
		var obj = $(this).find('div');
		
		if(obj.eq(0).text() == nar[k]) return true;
		if(width<=768)
			obj.eq(0).text(nar[k]);
		else {		
			/** Animate numbers **/
			if($.browser.mozilla) {
				// Firefox bugfix
				obj.eq(1)
					.text(nar[k])
					.css({marginTop: -190})
					.animate({opacity: 1}, function(){ $(this).removeAttr('style') });
				
				obj.eq(0).animate({opacity:0}, function(){ 
					var parent = $(this).parent();
					$(this).remove();
					$('<div/>').css({opacity:0}).appendTo(parent);
				});
			
			} else {
			
				obj.eq(1)
					.text(nar[k])
					.animate({opacity:1});
				obj.eq(0).animate({'margin-top': -190, opacity:0}, 600, function(){ 
					var parent = $(this).parent();
					$(this).remove();
					$('<div/>').css({opacity:0}).appendTo(parent);
				});
			
			}
		}
	});
	
	update_progressbar();
}

function update_progressbar() {
	var first = new Date(start);
	var last  = new Date(end);
	var today = new Date();
	
	var p = Math.floor(((today-first)/(last-first))*100);
		p = (p>100) ? 100 : p;
	
	$('#progressbar .front').animate({width: p+'%'}, 600, 'swing', function(){
		$('#progressbar .num')
			.text(p+'%')
			.css({marginLeft: $('#progressbar .front').width()-$('#progressbar .num').width()-15})
			.animate({opacity: 1}, 200);
	});

}

function err(input) {
	input.stop(true,true).animate({opacity:0}, 300, function(){
		$(this).animate({opacity:1}, 300);
	});
	$('#subscribe').prop("disabled", false);
}

function isValidEmail (email, strict) {
	if ( !strict ) email = email.replace(/^\s+|\s+$/g, '');
	return (/^([a-z0-9_\-]+\.)*[a-z0-9_\-]+@([a-z0-9][a-z0-9\-]*[a-z0-9]\.)+[a-z]{2,4}$/i).test(email);
}

function change_lang_date (str, arr) { 
  var replace = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
  for (var i=0; i<replace.length; i++) 
     str = str.replace(replace[i], arr[i]);
  return str; 
} 

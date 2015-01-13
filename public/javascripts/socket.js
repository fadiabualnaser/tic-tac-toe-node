
$(document).ready(function(){

	var socket =  io.connect();//io('localhost:3000');
	var loadingSpan = $('span#loading');
	var message = $('#message');
	var findPlyer = $('#findPlyer');
	var playerName ;
	var nickname = $('#nickname');
	var playerCarecter = '';
	$('#gameContainer').hide();
	var wait = false;
	loadingSpan.hide();
	findPlyer.hide();

	// check if there is a coocki fill the name 



	nickname.keyup(function(){

		var val = $(this).val();
		if(val.trim().length > 0){
			findPlyer.fadeIn('slow');
		} else {
			findPlyer.fadeOut('slow');
		}
	});

	nickname.val(getCookie("nickname"));
	nickname.keyup();

	socket.on('turn' , function(c){
		var coordinate = c.coordinate;
		wait = false;
		fillCoordinate(coordinate);
		// if(){
		// 	$('#gameContainer tr[r=' + coordinate[0] + '] td[c=' + coordinate[1] + ']').addClass(oposite(playerCarecter));
		// }
	});

	socket.on('finished' , function(){

		$('.repeat').removeClass('hidden');
	})
	socket.on('winner' , function(p){
		var path = p.path ;
		var coordinate = p.coordinate;
		fillCoordinate(coordinate);
		for (var i = 0; i < path.length; i++) {
			var e = path[i];
			$('#gameContainer tr[r='+e[0]+'] td[c='+e[1]+']').addClass('blue');
		};
		$('.repeat').removeClass('hidden');
	});

	socket.on('repeat' , function(){
		playerCarecter = oposite(playerCarecter);
		if(playerCarecter == 'x'){
			wait =false;
		}else{
			wait = true;
		}

		$('#chartcterLogo').removeClass('o').removeClass('x').addClass(playerCarecter);

		// $('#gameContainer tr td').removeClass('o').removeClass('x').removeClass('blue');
		resetGame();
		$('.repeat').addClass('hidden');
	})

	$('.repeat').click(function(){
		
		socket.emit('repeat');
	});

	$('.quit').click(function  () {
		socket.emit('quit');
		$('.nicknameContainer').show();
		resetGame();
		// nickname.value(playerName);
		$('#gameContainer').hide();
	});

	findPlyer.click(function  () {
		showLoader();

		var nkname = nickname.val();
		playerName = nkname;
		setCookie("nickname" , nkname , 360);
		$('.nicknameContainer').hide();
		socket.emit("findPlyer" , {
			nickname : nkname
		});
	});

	$('#gameContainer tr td').click(function(){
		
		if(wait === true || $(this).hasClass('x') || $(this).hasClass('o')){
			return false;
		}
		$(this).addClass(playerCarecter);
		var coordinate = [$(this).parent().attr('r') , $(this).attr('c')];
		socket.emit('tick' , {
			coordinate : coordinate
		});
		wait = true;
	});
	socket.on('connectedWithPlayer' , function(p){
		hideLoader();
		playerCarecter = p.chartcter;
		wait = p.wait;
		var connect_msg = 'your partner name is <b>'  + p.partner_name + '</b>';

		$('#chartcterLogo').addClass(playerCarecter);
		if(wait){
			// connect_msg += '<br> please for ' + p.partner_name +' to pick';
		} 
		message.html(connect_msg);
		
		$('#gameContainer').show();
	});

	socket.on('partnerDisconnected' , function(){
		
		message.text('your partner gone !! sorry for you, you are alone ');

		$('.nicknameContainer').show();
		resetGame();
		// nickname.value(playerName);
		$('#gameContainer').hide();
		
	});

	socket.on('numberOfuers' , function(num){
		$('#numOfUsers').text(num.num)
	});

	function fillCoordinate(coordinate){
		if(coordinate){
			$('#gameContainer tr[r=' + coordinate[0] + '] td[c=' + coordinate[1] + ']').addClass(oposite(playerCarecter));
		}
	}

})

function showLoader(divId){
	if(!divId){
		divId = "#loading";
	}
	$(divId).append('<div id="ballsWaveG"><div id="ballsWaveG_1" class="ballsWaveG"></div><div id="ballsWaveG_2" class="ballsWaveG"></div><div id="ballsWaveG_3" class="ballsWaveG"></div><div id="ballsWaveG_4" class="ballsWaveG"></div><div id="ballsWaveG_5" class="ballsWaveG"></div><div id="ballsWaveG_6" class="ballsWaveG"></div><div id="ballsWaveG_7" class="ballsWaveG"></div><div id="ballsWaveG_8" class="ballsWaveG"></div></div>');
	$(divId).show();	
}
function hideLoader(divId){
	if(!divId){
		divId = "#loading";
	}
	$(divId).html('').hide();
}

function oposite(c){
	if(c == "o"){
		c = 'x'
	} else {
		c = 'o'
	}
	return c;
}

function resetGame(){
	$('#gameContainer tr td').removeClass('o').removeClass('x').removeClass('blue');
	$('#chartcterLogo').removeClass('o').removeClass('x')
}

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// function checkCookie(name) {
//     var user=getCookie(name);
//     if (user != "") {

//     } else {
//        if (user != "" && user != null) {
//            setCookie(name, user, 360);
//        }
//     }
// }
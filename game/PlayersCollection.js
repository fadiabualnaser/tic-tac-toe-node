var Player = require('./Player.js').Player , 
	_ = require('underscore');


function PlayersCollection () {
	this.players = [];
};


PlayersCollection.prototype.addPlayer = function(socket) {
	// players.push(new Player(socket));
	this.players.push({
		socket_id : socket.id,
		player : new Player(socket)
	});
	// this.printPlayers();
};

PlayersCollection.prototype.getPlayer = function(socket_id) {
	return _.findWhere(this.players , {socket_id : socket_id});
};

PlayersCollection.prototype.removePlayer = function(socket , callback) {
	var p = this.getPlayer(socket.id);

	if(p.player.isConnected){
		try{
			var partner = _.findWhere(this.players , {socket_id : p.player.partner_id}).player;
			partner.isConnected = true;
			partner.partner_id = p.player.socket_id;
			partner.isSearchingForPartner = false;
		}catch(err){
			console.log('catch catch catch catch catch catch catch catch ')
		}
		
	};

	this.players = _.without(this.players , _.findWhere(this.players , {socket_id: socket.id}));
	callback(p.player.partner_id)
	// this.printPlayers();
};

PlayersCollection.prototype.printPlayers = function() {
	// console.log('****************** start printing the players ******************');
	// console.log('the length is '  , this.players.length);
	// console.log('******************');
	// for (var i = 0; i < this.players.length; i++) {
	// 	var p = this.players[i];
	// 	console.log(p , p.player.socket_id , p.player.isConnected , p.player.partner_id);
	// 	console.log('****************** end printing the players ******************');
	// 	console.log('');	
	// };
	// console.log('');
	// console.log('---------------------------');
	// console.log()
};

PlayersCollection.prototype.getPlayersLength = function() {
	return this.players.length;
};

PlayersCollection.prototype.findPatner = function(socket , nickname , callback) {
	var player1  = _.findWhere(this.players , {socket_id : socket.id}).player;
	player1.isSearchingForPartner = true;
	player1.nickname = nickname;
	for(var i = 0 ; i< this.players.length ; i++ ){
		var p = this.players[i];
		// console.log(p.player.socket_id , socket.id  ,  p.player.isSearchingForPartner)
		if(p.player.socket_id != socket.id && p.player.isSearchingForPartner){
			this.players[i].player.isConnected = true;
			this.players[i].player.partner_id = socket.id;
			this.players[i].player.isSearchingForPartner = false;
			this.players[i].charecter = 'o';

			player1.isConnected = true;
			player1.partner_id = p.player.socket_id;
			player1.isSearchingForPartner = false;
			player1.charecter = 'x';

			callback(p.socket_id , p.player.nickname , nickname);
			
			break;
		}
	}

	// this.printPlayers();
};

PlayersCollection.prototype.tick = function(socket_id , coordinate  , callback ) {
	var player = _.findWhere(this.players , {socket_id : socket_id}).player;
	var partner = _.findWhere(this.players , {socket_id : player.partner_id}).player;
	player.upDateMatrix(coordinate , 1);
	partner.upDateMatrix(coordinate , 0 );
	player.checkForWinner(function(path , value , isFinished){
		callback(partner.socket_id , path , value, isFinished );	
	});
	
};

PlayersCollection.prototype.repeat = function(socket_id , callback){
	var player = _.findWhere(this.players , {socket_id : socket_id}).player;
	var partner = _.findWhere(this.players , {socket_id : player.partner_id}).player;
	player.repeat();
	partner.repeat();
	callback(partner.socket_id)
};

exports.PlayersCollection = PlayersCollection;
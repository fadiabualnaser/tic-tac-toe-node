function Player (socket) {
	this.socket_id = socket.id;
	this.nickname = '';
	this.isConnected = false ;
	this.partner_id = null;
	this.isSearchingForPartner = false;  
	this.charecter = '' , 
	this.matrix = [
		[-1 , -1 , -1] ,
		[-1 , -1 , -1] ,
		[-1 , -1 , -1]  
	] 
}

Player.prototype.connect = function(socket) {
	this.isConnected = true;
	this.partner_id = socket.id;
};

Player.prototype.disconnect = function() {
	this.socket_id = null;
	this.isConnected = false;
	this.partner_id = null;
};

Player.prototype.conncetWith = function(player){
	this.isConnected = true;
	this.partner_id = player.socket_id;
};
Player.prototype.upDateMatrix = function(coordinate , flag){

	this.matrix[coordinate[0]][coordinate[1]] = flag ;

};

Player.prototype.checkForWinner = function(callback){
	var m = this.matrix;
	var winningPath ;
	var winnerValue ;
	for (var i = 0; i < 3; i++) {
		if (m[i][0] !== -1 && ((m[i][0] == m[i][1]) && (m[i][0] == m[i][2]))) {
			winnerValue = m[i][0];
			winningPath = [
				[i, 0],
				[i, 1],
				[i, 2]
			];
			break;
		}

		if (m[0][i] !== -1 && ((m[0][i] == m[1][i]) && (m[0][i] == m[2][i]))) {
			winnerValue = m[0][i];
			winningPath = [
				[0, i],
				[1, i],
				[2, i]
			];
			break;
		}
	}

	// check diagonal
	
	if (m[0][0] !== -1 && ((m[0][0] == m[1][1]) && (m[0][0] == m[2][2]))) {
		winnerValue = m[0][0];
		winningPath = [
			[0, 0],
			[1, 1],
			[2, 2]
		];
	}

	if (m[0][2] !== -1 && ((m[0][2] == m[1][1]) && (m[0][2] == m[2][0]))) {
		winnerValue = m[0][2];
		winningPath = [
			[0, 2],
			[1, 1],
			[2, 0]
		];
	};
	var isFinished = true;
	for (var i = 0; i < 3 ; i++) {
		for (var j = 0; j < 3; j++) {
			if(m[i][j] == -1 ){
				isFinished = false;
				break;
			}
		};
	};
	callback(winningPath  , winnerValue , isFinished)
};

Player.prototype.repeat = function() {
	this.matrix = [
		[-1 , -1 , -1] ,
		[-1 , -1 , -1] ,
		[-1 , -1 , -1]  
	] 
};

exports.Player = Player;
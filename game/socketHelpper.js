// export socketHelpper 
var _PlayersCollection = require('./PlayersCollection.js').PlayersCollection;

var PlayersCollection = new _PlayersCollection();
var users = {};
var count = 0 ; 
function socketHelpper (io) {
	
	io.on('connection', function(socket){
	  	//console.log('a user connected');
	  	users[socket.id] = {
	  		connected : false ,
	  		partner_id : null
	  	};
	  	++count;
	  	io.emit('numberOfuers' , {
	  		num : count
	  	})
	  	
	  	PlayersCollection.addPlayer(socket);
	  	
	  	//console.log(users);

	  	socket.on('disconnect' ,function(){
	  		--count;
	  		io.emit('numberOfuers' , {
		  		num : count
		  	});

	  		PlayersCollection.removePlayer(socket , function(s_id){
	  			io.to(s_id).emit('partnerDisconnected');
	  		});
	  	});

	  	socket.on('quit' ,function(){
	  		PlayersCollection.removePlayer(socket , function(s_id){
	  			io.to(s_id).emit('partnerDisconnected');
	  		});
	  	});

	  	

	  	socket.on('findPlyer' , function(nkname){
	  		var nickname = nkname.nickname;

	  		PlayersCollection.findPatner(socket , nickname , function(s_id  , p1 , p2){
	  			io.to(s_id).emit('connectedWithPlayer' , {
	  				partner_name : p2 , 
	  				chartcter : 'o' , 
	  				wait : true
	  			});
				
				socket.emit('connectedWithPlayer',  {
	  				partner_name : p1 , 
	  				chartcter : 'x' , 
	  				wait : false
	  			});
	  		});
	  		
	  	});

	  	socket.on('tick' , function(c){
	  		var coordinate = c.coordinate;
	  		
	  		PlayersCollection.tick(socket.id , coordinate  , function(sid , path , value , isFinished){
	  			
	  			if(isFinished && !path){
	  				io.to(sid).emit('finished' , {
		  				path : path , 
		  				coordinate : coordinate
		  			});
		  			socket.emit('finished' , {
		  				path : path
		  			})
		  			return;
	  			}

	  			if(path){
	  				// there is a winner 
	  				io.to(sid).emit('winner' , {
		  				path : path , 
		  				coordinate : coordinate
		  			});
		  			socket.emit('winner' , {
		  				path : path
		  			})
		  			return;
	  			}

  				io.to(sid).emit('turn' , {
	  				coordinate : coordinate
	  			});
	  			return;	
  			

	  			
	  		});
	  	});

	  	socket.on('repeat' , function(){
	  		PlayersCollection.repeat(socket.id , function(sid){
	  			io.to(sid).emit('repeat');
	  			socket.emit('repeat')
	  		})
	  	});
	});
};


exports.socketHelpper = socketHelpper;

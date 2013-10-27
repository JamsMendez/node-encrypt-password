

//Libreria para Encriptar 
var bcrypt = require('bcrypt');

// DB Usuarios
var db = [];


exports.index = function(req, res){
	if(req.session.alert){
		var alert = req.session.alert;
		// Se destruye la propiedad alert
		delete(req.session.alert);
		res.render('index', { alert: alert });
	}else{
		res.render('index');
	}
};

exports.login = function(req, res){

	// Valores del formulario de Login
  var username = req.body.username,
  		password = req.body.password;

  var user;
	for (var i = 0; i < db.length; i++) {
		if(db[i].username == username){
			user = db[i];
		}
	}
	
	if(user){
		bcrypt.compare(password, user.password, function (err, auth) {
			if(!err && auth){
				req.session.alert = { message: 'Usuario y/o Contraseña Correctos', status: 'success' };
			}else{
				req.session.alert = { message: 'Usuario y/o Contraseña Incorrectos', status: 'danger' };		
			}
			res.redirect('/');
		});
	}else{
		req.session.alert = { message: 'Usuario y/o Contraseña Incorrectos', status: 'danger' };
		res.redirect('/');
	}
}

exports.user = function (req, res) {
	res.render('user');
}

exports.addUser = function (req, res) {
	var username = req.body.username,
			password = req.body.password;

	bcrypt.genSalt(10, function (err, salt) {
		if(err){
			req.session.alert = { message: 'Error de registro de Usuario', status: 'danger' };
		}else{
			bcrypt.hash(password, salt, function (err, hash) {
				if(!err){
					var user = { username: username, password: hash };
					// console.log(user);
					db.push(user);

				}else{
					req.session.alert = { message: 'Error de registro de Usuario', status: 'danger' };
				}
			});
		}
		res.redirect('/');
	});			
}


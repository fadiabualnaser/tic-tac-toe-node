
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Tic Tac Toe NodeJs' });
};
var settings = require('../settings');
var path = require('path');
var musics = path.join(__dirname, '../public/musics');
var crypto = require('crypto'),
	User = require('../models/host.js'),
	Post = require('../models/post.js'),
	Comment = require('../models/comment.js');
module.exports = function(app) {
	app.get('/', function(req, res) {
		//判断是否是第一页，并把请求的页数转换成 number 类型
		var page = req.query.p ? parseInt(req.query.p) : 1;
		Post.getEight(page, function(err, posts, total) {
			if (err) {
				posts = [];
			}
			res.render('index', {
				title: 'BLOG',
				posts: posts,
				page: page,
				isFirstPage: (page - 1) == 0,
				isLastPage: ((page - 1) * 8 + posts.length) == total,
				user: req.session.user
			});
		});
	});
	app.get('/reg', function(req, res) {
		res.render('reg', {
			title: '注册',
			user: req.session.user
		});
	});
	app.post('/reg', function(req, res) {
		var name = req.body.name,
			password = req.body.password;
		//生成密码的 md5 值
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			name: name,
			password: password
		});
		//检查用户名是否已经存在 
		User.get(newUser.name, function(err, user) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			//如果不存在则新增用户
			newUser.save(function(err, user) {
				if (err) {
					req.flash('error', err);
					return res.redirect('/reg'); //注册失败返回主册页
				}
				req.session.user = user; //用户信息存入 session
				req.flash('success', '注册成功!');
				res.redirect('/'); //注册成功后返回主页
			});
		});
	});
	app.get('/login', checkNotLogin);
	app.get('/login', function(req, res) {
		res.render('login', {
			title: '登录',
			user: req.session.user
		});
	});
	app.post('/login', checkNotLogin);
	app.post('/login', function(req, res) {
		//生成密码的 md5 值
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		//检查用户是否存在
		User.get(req.body.name, function(err, user) {
			if (!user) {
				req.flash('error', '用户不存在!');
				return res.redirect('/login'); //用户不存在则跳转到登录页
			}
			//检查密码是否一致
			if (user.password != password) {
				req.flash('error', '密码错误!');
				return res.redirect('/login'); //密码错误则跳转到登录页
			}
			//用户名密码都匹配后，将用户信息存入 session
			req.session.user = user;
			req.flash('success', '登陆成功!');
			res.redirect('/'); //登陆成功后跳转到主页
		});
	});
	app.get('/post', checkLogin);
	app.get('/post', function(req, res) {
		res.render('post', {
			title: '发表',
			user: req.session.user
		});
	});
	app.post('/post', checkLogin);
	app.post('/post', function(req, res) {
		post = new Post(req.body.blogTitle, req.body.image, req.body.post);
		post.save(function(err) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			req.flash('success', '发布成功!');
			res.redirect('/'); //发表成功跳转到主页
		});
	});
	app.get('/logout', checkLogin);
	app.get('/logout', function(req, res) {
		req.session.user = null;
		req.flash('success', '登出成功!');
		res.redirect('/'); //登出成功后跳转到主页
	});
	app.get('/upload', checkLogin);
	app.get('/upload', function(req, res) {
		res.render('upload', {
			title: '文件上传',
			user: req.session.user
		});
	});
	app.post('/upload', checkLogin);
	app.post('/upload', function(req, res) {
		req.flash('success', '文件上传成功!');
		res.redirect('/upload');
	});
	app.get('/u/:blogTitle', function(req, res) {
		Post.getOne(req.params.blogTitle, function(err, post) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			res.render('blog', {
				title: req.params.blogTitle,
				post: post,
				user: req.session.user
			});
		});
	});
	app.get('/remove/:blogTitle', checkLogin);
	app.get('/remove/:blogTitle', function(req, res) {
		Post.remove(req.params.blogTitle, function(err) {
			if (err) {
				req.flash('error', err);
				return res.redirect('back');
			}
			req.flash('success', '删除成功!');
			res.redirect('/');
		});
	});
	app.post('/u/:blogTitle', function(req, res) {
		var date = new Date(),
			time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
			date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
		var comment = {
			name: req.body.name,
			email: req.body.email,
			time: time,
			content: req.body.content
		};
		var newComment = new Comment(req.params.blogTitle, comment);
		newComment.save(function(err) {
			if (err) {
				req.flash('error', err);
				return res.redirect('back');
			}
			req.flash('success', '留言成功!');
			res.redirect('back');
		});
	});
	app.get('/music', function(req, res) {
		var fs = require('fs');
		fs.readdir(musics, function(err, names) {
			if (err) {
				console.log(err);
			} else {
				res.render('music', {
					title: 'MUSIC',
					musicName: names,
					user: req.session.user
				})
			}
		})
	});
	app.get('/about', function(req, res) {
		res.render('about', {
			title: '自我简介',
			user: req.session.user
		});
	});

	function checkLogin(req, res, next) {
		if (!req.session.user) {
			req.flash('error', '未登录!');
			res.redirect('/login');
		}
		next();
	}

	function checkNotLogin(req, res, next) {
		if (req.session.user) {
			req.flash('error', '已登录!');
			res.redirect('back'); //返回之前的页面
		}
		next();
	}

};
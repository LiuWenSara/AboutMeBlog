var mongodb = require('./db');
var markdown = require('markdown').markdown;

function Post(blogTitle, image, post) {
  this.blogTitle = blogTitle;
  this.image = image;
  this.post = post;
}

module.exports = Post;

//存储一篇文章及其相关信息
Post.prototype.save = function(callback) {
  var date = new Date();
  //存储各种时间格式，方便以后扩展
  var time = {
      date: date,
      year: date.getFullYear(),
      month: date.getFullYear() + "-" + (date.getMonth() + 1),
      day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    }
    //要存入数据库的文档
  var post = {
    time: time,
    image: this.image,
    blogTitle: this.blogTitle,
    post: this.post,
    comments: []
  };
  //打开数据库
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //将文档插入 posts 集合
      collection.insert(post, {
        safe: true
      }, function(err) {
        mongodb.close();
        if (err) {
          return callback(err); //失败！返回 err
        }
        callback(null); //返回 err 为 null
      });
    });
  });
};

//读取文章及其相关信息
Post.getEight = function(page, callback) {
  //打开数据库
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.count({}, function(err, total) {
        collection.find({}, {
          skip: (page - 1) * 8,
          limit: 8
        }).sort({
          time: -1
        }).toArray(function(err, docs) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
          callback(null, docs, total);
        });
      });
    });
  });
};
//获取一篇文章
Post.getOne = function(blogTitle, callback) {
  //打开数据库
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "blogTitle": blogTitle
      }, function(err, doc) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        //解析 markdown 为 html
        doc.post = markdown.toHTML(doc.post);
        callback(null, doc); //返回查询的一篇文章
      });
    });
  });
};
//删除一篇文章
Post.remove = function(blogTitle, callback) {
  //打开数据库
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.remove({
        "blogTitle": blogTitle
      }, {
        w: 1
      }, function(err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};
var mongodb = require('./db');

function Comment(blogTitle, comment) {
  this.blogTitle = blogTitle;
  this.comment = comment;
}

module.exports = Comment;

//存储一条留言信息
Comment.prototype.save = function(callback) {
  var blogTitle = this.blogTitle,
    comment = this.comment;
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
      collection.update({
        "blogTitle": blogTitle
      }, {
        $push: {
          "comments": comment
        }
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
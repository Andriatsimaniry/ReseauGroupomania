changePassword = (user, callback) => {
    db.query("SELECT password FROM users WHERE id=?",[user.id], (error, result) => {
        if (error) return callback(error); // pass to caller
        bcrypt.compare(user.current, result[0].password, (err, match) => {
            if (err) return callback(err); // pass this one too!
            if (match){
                bcrypt.hash(user.new, saltRounds, function (er, hash) {
                    if (er) return callback(er); // and this one!!
                    db.query("UPDATE users SET password=? WHERE id=?", [hash, user.id], callback);
                });
            }else {
              // that's not good, send an error to the caller
              var err = new Error('Password does not match');
              err.code = 'BAD_PASSWORD';
              callback(err);
            }
        });
    })

};
module.exports = changePassword ;
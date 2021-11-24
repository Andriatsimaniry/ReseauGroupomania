module.exports.change = (req, res, next) => {
    if (req.body.new === req.body.confirm){
          let user = {
                id : req.user.id,
                old : req.body.current,
                new : req.body.new
            };
        users.changePassword(user, (err, result)=> {
            if (err) {
                if (err.code === 'BAD_PASSWORD') {
                    // do something
                } else {
                   next(err); // pass the error to the next handler
                }
            } else {
                res.redirect("/");
            }
        });
    }else{
        res.redirect("/change-password");
    }

};
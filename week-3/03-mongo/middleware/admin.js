// Middleware for handling auth
const { Admin } = require("../db/index");

async function adminMiddleware(req, res, next) {
    const username = req.headers.username;
    const password = req.headers.password;
    
    const user = await Admin.findOne({
        username:username,
        password:password,
    });
    
    if(user){
        next();
    }
    else{
        res.status(403).json({
            msg:"Admin does not exist "+ username +" "+ password,
        })
    }

}

module.exports = adminMiddleware;
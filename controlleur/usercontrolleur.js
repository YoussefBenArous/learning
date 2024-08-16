const user = require('../modles/users/user');
//get all users 
exports.getUser = async (req,res)=> {
    const {name }= req.body;
    try {
        const prend = await user.findOne(name) ;
        if(!prend){
            console.log("no user exist ..");
            return res.status(404).json({msg:"no user exist .."})
        }
        console.log("user u have in database ..",prend);
        res.json({msg:"user u have in database ..",prend});
    }catch(err){
        console.log("there is a error cant show users...");
        return res.status(500).json({msg:"there is a error cant show users..."});
    }
};
exports.getUserBuId = async(req,res)=> {
    const {_id} = req.body;
    try {
        const byid = await user.findById(_id);
        if(!byid){
            console.log("no user have this id ..");
            return res.status(404).json({msg:"no user have this id .."})
        }
        console.log("user find ...",byid);
        res.json({msg:"user find ...",byid});
    }catch(error){
        console.log("error to find user");
        return res.status(500).json({msg:"error to find user"});
    }
}
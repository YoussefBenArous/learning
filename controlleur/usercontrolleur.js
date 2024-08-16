const user = require('../modles/users/user');
//get all users 
exports.getUser = async (req,res)=> {
    const {name} = req.body;
    try {
        const prend = await user.find(name);
        console.log("All Users Found ",prend);
        res.json({msg:"All Users Found",prend});
    }catch(error){
        console.log("Error to show all user");
        return res.status(500).json({msg:"Error to show all user"});
    };
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
};
exports.createUser = async (req, res) => {
    const {name,email,password,role}= req.body;
    try {
        const cree = await user.create({name,email,password,role});
        if(!cree){
            console.log("veref votre entree ..");
            return res.status(404).json({msg:"veref votre entrree .."});
        }
        console.log("creation acc success ...",cree);
        res.json({msg:"Creation acc success ...",cree});
    }catch(error){
        console.log("error to creat new user ..");
        return res.status(500).json({msg:"error to creat new user .."});
    }
};
exports.updateUser = async (req , res )=> {
    const {_id,name,email,password,role}=req.body;
    try {
        const modifier = await user.findByIdAndUpdate(_id,{name,email,password,role});
        if(!modifier) {
            console.log("user not found");
            return res.status(404).json({msg:"user not found"});
        }
        console.log("update successful...",modifier);
        res.json({msg:"update successful..",modifier});
    }catch(error) {
        console.log("error to update user ..");
        return res.status(500).json({msg:"error to update user .."});
    }
};
exports.deletuser = async (req , res)=>{
    const {_id} = req.body;
    try {
        const supp = await user.findByIdAndDelete(_id);
        if (!supp){
            console.log("no user finded with this Id..");
            return res.status(404).json({msg:"no user finded with this Id.."});
        };
        console.log("Delete Successful..");
        res.json({msg:"Delete Successful.."});
    }catch(error){
        console.log("error to delete user ..");
        return res.status(500).json ({msg:"error to delete user .."});
    };
}
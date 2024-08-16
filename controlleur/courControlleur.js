const cour = require('../modles/cours');
exports.getCours = async (req,res) => {
    const {titreC } = req.body;
    try{
        const prend = await cour.find(titreC);
        if (!prend){
            console.log('No cours founds ....');
            return res.status(404).json({msg:'No cours founds ....'});
        }
        console.log('cours founded are :'+prend);
        res.json({cours:prend});

    }catch(err){
        console.error(err);
        return res.status(404).json({msg:"error on cant get cour ..."});
    }

};
exports.getCourById = async (req, res) =>{
    const {_id} = req.body;
    try {
        const byid = await cour.findById(_id);
        if (!byid){
            console.log("no found any cour have this id ..");
            return res.status(404).json({msg:"no found any cour have this id .."});
        }
        console.log("this id is for this cour :"+byid);
        res.json({msg:"this id is for this cour :",byid})
    }catch(err){
        console.log("erro to get cour by id ...");
        return res.status(404).json({msg:"erro to get cour by id ..."});
    }
};
exports.createCour = async (req, res)=>{
    const {titreC , descriptionC}= req.body;
    try {
        const mawjoud = await cour.findOne({titreC})
        
        if (mawjoud){
            console.log("cour exist ..");
            return res.status(404).json({msg:"cour exist .."});
        }
        const cree = await cour.create({titreC , descriptionC});
        if(cree||mawjoud)
        {console.log("creat cour sucess ",cree);
        res.json({msg:"creat cour sucess"})}
    }catch(error){
        console.log("error to creat cour ..");
        return res.status(500).json({msg:"error to creat cour .."});
    }
};
exports.updateCour =async (req,res)=> {
    const {_id} = req.body;
    const {titreC,descriptionC}= req.body;
    try {
        const ubdate = await cour.findByIdAndUpdate(_id,{titreC,descriptionC});
        if(!ubdate){
            console.log("Cour not found...");
            return res.status(404).json({msg:"Cour not found ..."});
        }
        console.log("Update cour sucess ..",ubdate);
        res.json({msg:"Update cour sucess ..",ubdate});
    }catch(error){
        console.log("error to update cour");
        return res.status(500).json({msg:"error to update cour"});
    }
}
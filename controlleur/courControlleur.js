const cour = require('../modles/cours');
const Formation = require('../modles/formation');
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
    try {
        const byid = await cour.findById(req.params.getCourById);
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
//update cour
exports.updateCour =async (req,res)=> {
    const {titreC,descriptionC}= req.body;
    try {
        const ubdate = await cour.findById(req.params.updateCour);
        if(!ubdate){
            console.log("Cour not found...");
            return res.status(404).json({msg:"Cour not found ..."});
        }
        const ubdate2 = await cour.findOneAndUpdate({titreC,descriptionC});
        console.log("Update cour sucess ..",ubdate2);
        res.json({msg:"Update cour sucess ..",ubdate2});
    }catch(error){
        console.log("error to update cour");
        return res.status(500).json({msg:"error to update cour"});
    }
};
// veref if cour exist in formation and delet it
exports.suprimer = async (req, res )=> {
    try {
        // vere if foramtion exist 
        const veref = await Formation.findById(req.params.formationid);
        if(!veref){
            console.log("Formation n'existe pas");
            return res.status(404).json({msg:"Formation n'existe pas"});
        }
        console.log("Formation Exist");

        if (veref.cours && veref.cours.includes(req.params.courid) ){
            console.log("Cour Exist on Formation",req.params.courid);

            //delet cour find
            veref.cours = veref.cours.filter(id=>id.toString()!==req.params.courid);

            //save the update
            await veref.save();

            console.log("delete Cour Successful From Formation");
            return res.json({msg:"delete Cour Successful From formation"});
        }else{
            console.log("Cour does not exist in Formation");
            return res.status(404).json({msg:"Cour does not exist in formation"});
        }
    }catch(err){
        console.log("Error to suprimer veref votre code..");
        return res.status(500).json({msg:"Error to suprimer veref votre code.."});
    }
};
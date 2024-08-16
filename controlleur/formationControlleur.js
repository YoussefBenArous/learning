const Formation = require('../modles/formation'); // Ensure the path to your model is correct

exports.getFormation = async (req, res) => {
    const { nameF } = req.query; // Use req.query if you're passing parameters via query strings or to get from what we have on bd

    try {
       

        // Count documents that match the query
        const formCount = await Formation.countDocuments( nameF );
        if (formCount == 0) {
            console.log("Not found any Formation....");
            return res.status(404).json({ msg: 'Not found any Formation....' });
        }

        // Find all documents that match the query
        const allFormation = await Formation.find( nameF );

        if (formCount > 0) {
            console.log("Number of formations is " + formCount);
            console.log("The formations are "+ allFormation);
            return res.json({ count: formCount, formations: allFormation });
        }

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ msg: 'There is a problem ...' });
    }
};
exports.getFormationById = async (req,res)=>
   { 
    
    // params to get the id 
    const {_id}= req.body;
    console.log("Received ID:", _id); // Log the received ID for debugging
    try {
        
        // to find formation by id
        const byid = await Formation.findById(_id);
        if(!byid){
            console.log("no fomation found by Id ...");
            return res.status(404).json({msg:'no Formation founded by Id ....'});
        }
        console.log("Formation Found:", byid);
        res.json({msg : "Formation Found :",byid});
        

    }catch(err){
        console.log("error on find by ID");
        return res.status(404).json({msg:"problem de found by Id ..."})
    }
};
exports.creationFormation= async (req,res)=>{
    // Use req.body to get data from the request body
    const {nameF,dureeF,formateur,descriptionF} = req.body;
    try {
        const add = await Formation.create({nameF,dureeF,formateur,descriptionF});
        if (!add){
            return res.status(500).json({msg:"no creation .."})
        }
        console.log("creation sucess ...");
        res.json({msg:"creation sucess ..."});


    }catch (err){
        return res.status(404).json({msg:"problem de created .."})
    }
};
exports.updateFormation = async (req, res) => {
    const { _id ,nameF, dureeF, formateur, descriptionF } = req.body; // Extract the updated fields from the request body

    try {
        // Find the formation by ID and update it with the new values
        const upd = await Formation.findByIdAndUpdate(_id,{nameF, dureeF, formateur, descriptionF});
        if (!upd) {
            console.log("No formation found to update...");
            return res.status(404).json({ msg: "No formation found to update..." });
        }
        console.log(upd)
        console.log("Update successful:", upd);
        return res.json({ msg: "Update successful", updatedFormation: upd });
    } catch (err) {
        console.log("Problem updating formation:", err.message);
        return res.status(500).json({ msg: "Problem updating formation..." });
    }
};



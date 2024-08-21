const Formation = require('../modles/formation'); // Ensure the path to your model is correct
const cour = require('../modles/cours');
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
exports.addcour = async (req, res) => {
    const { _id, titreC, descriptionC } = req.body;
    try {
        // Verify if the formation exists
        const formation = await Formation.findById(_id);
        if (!formation) {
            console.log("There is no Formation with this ID.");
            return res.status(404).json({ msg: "There is no Formation with this ID." });
        }

        // Check if the course already exists
        let existingCour = await cour.findOne({ titreC, descriptionC });
        if (existingCour) {
         // Link the course to the formation
            if (!formation.cours.includes(existingCour._id)) {
                formation.cours.push(existingCour._id);
                await formation.save();
            }
            console.log("Existing course linked to the formation.");
            return res.json({ msg: "Existing course linked to the formation.", existingCour });
        }

        // If course does not exist, create a new one
        const newCour = await cour.create({ titreC, descriptionC });
        formation.cours.push(newCour._id); // Link the new course to the formation
        await formation.save(); // Save the updated formation

        console.log("Added successfully:", newCour);
        res.json({ msg: "Added successfully.", newCour });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error adding course." });
    }
};


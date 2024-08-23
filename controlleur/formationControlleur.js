const Formation = require('../modles/formation'); // Ensure the path to your model is correct
const cour = require('../modles/cours');
const user = require('../modles/users/user');
exports.getFormation = async (req, res) => {
    try {
       

        // Count documents that match the query
        const formCount = await Formation.countDocuments();
        if (formCount == 0) {
            console.log("Not found any Formation....");
            return res.status(404).json({ msg: 'Not found any Formation....' });
        }

        // Find all documents that match the query
        const allFormation = await Formation.find();

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
    try {
        
        // to find formation by id
        const byid = await Formation.findById(req.params.getFormationById);
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
    const {nameF,dureeF,formateur,descriptionF,cours} = req.body;
    try {
        const add = await Formation.create({nameF,dureeF,formateur,descriptionF,cours});
        if (!add){
            return res.status(500).json({msg:"no creation .."})
        }
        console.log("creation sucess ...");
        res.json({msg:"creation sucess ..."});


    }catch (err){
        return res.status(404).json({msg:"problem de created .."})
    }
};
//update formation
exports.updateFormation = async (req, res) => {
    const { nameF, dureeF, formateur, descriptionF } = req.body; // Extract the updated fields from the request body

    try {
        // Find the formation by ID and update it with the new values
        const upd = await Formation.findByIdAndUpdate(req.params.idofformation,{nameF, dureeF, formateur, descriptionF});
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
//add cour to formation
exports.addcour = async (req, res) => {
    const { titreC, descriptionC } = req.body;
    try {
        // Verify if the formation exists
        const formation = await Formation.findById(req.params.addcourid);
        console.log(req.params.addcourid)
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
                console.log("Cours Linked To Formation.");
                return res.status(202).json({ msg: "Cours Linked To Formation." });
                
            }else
            {console.log("Cours Exist ON the formation.");
            return res.status(202).json({ msg: "Cours Exist ON the formation." });}
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
//delet formateur from formation
exports.suppformateurfromformation = async (req,res)=>{
    try {

        const veref = await Formation.findById(req.params.foramtionid);
        console.log(req.params.foramtionid);
        if(!veref){
            console.log("Foramtion not found");
            return res.status(404).json({msg:"Formation not found"});
        }
        
        console.log("Formation found")
        if(veref.formateur.includes(req.params.formateurid)){
            veref.formateur = veref.formateur.filter(f=>f.toString()!==req.params.formateurid);
            await veref.save();
            console.log("delete Formateur from formation sucessfully");
            return res.status(202).json({msg:"delete Formateur from formation Successfully"})
        }
        console.log("Formateur Not Found on Formation");
    }catch(error){
        console.log(error);
        return res.status(500).json({msg:"Eroor to delete formateur"});
    }
};
// add formateur to formation 
exports.addFormateur = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        veref = await Formation.findById(req.params.foramaid);
        if (veref) {
            console.log("Formation Found");
            
            const vereffor = await user.findOne({ name, email, role });
            if (vereffor) {
                if (veref.formateur.includes(vereffor._id)) {
                    console.log("Formateur Exist on Formation");
                    return res.status(200).json({ msg: "Formateur Exist on Formation" });
                } else {
                    veref.formateur.push(vereffor._id);
                    await veref.save();
                    console.log("Formation Linked to Formation");
                    return res.status(200).json({ msg: "Formateur Linked to Formation" });
                }
            } else {
                const newFormateur = await user.create({ name, email, password, role });
                veref.formateur.push(newFormateur._id);
                await veref.save();
                console.log("NEW Formation Creat And Linked Successfully", newFormateur);
                return res.status(201).json({ msg: "NEW Formation Creat And Linked Successfully", newFormateur });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Problem To Add Formateur" });
    }
};



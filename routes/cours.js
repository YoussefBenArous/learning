const express= require('express');
const { check,validationResult } = require('express-validator');
const {getCours} = require('../controlleur/courControlleur');
const {getCourById} = require('../controlleur/courControlleur');
const {createCour}= require('../controlleur/courControlleur');
const {updateCour} = require ('../controlleur/courControlleur');
const router = express.Router();
const Cour = require ('../modles/cours');
router.post (
    '/Cours',
    [
        check('titreC','entrez le titre ...').not().isEmpty(),
        check('descriptionC','Etrez la description ...').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return console.error(errors);
        }
        const { titreC, descriptionC } = req.body;
        try {
            let cour = await Cour.findOne({ titreC });
            if (cour) {
                return console.log("Titre already exist ... ");
            }
            cour = new Cour({
                titreC,
                descriptionC
            });
            await cour.save();
            res.status(201).json({ msg: "cour created successfully", cour });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
)
// Supprimer un  cour d'une formation  (Admin seulement)
router.delete(
    '/:id',
    async(req,res)=>{
        try {
            // veref ask foramtion and cour exist
            const formation = await formation.findById(req.params.foramtionId);
            if(!formation){
                return res.status(404).json({msg:'formation not found'});
            }
            const cour = await cour.findById(req.params.courId);
            if (!cour){
                return res.status(404).json({msg:'cour not found'});   
            }
            if(cour.formation.toString()!==req.params.foramtionId){
                return res.status(404).json({msg:'ce cour n appartient pas a cette formation'});

            }
            
        
        // delete cour
        await cour.delete();
        res.json({msg:'cour deleted ...'});
        //suprimer la reference de la lecon 
        formation.cours= formation.cours.filter(
            courId => courId.toString()!==req.params.courId);
        
        await formation.save();
        res.json({msg:'cour suprime'});
    }catch(error){
        res.status(500).json({msg:'error to delete cour'});
    }
});
// show all cours we have
router.get('/getcour',
    getCours
);
//find cours using id
router.get('/getCourById',
    getCourById
);
// creation de nouveaux cours
router.post('/createCour',
    createCour
);
//Update cour
router.put('/updateCour',
    updateCour
);
module.exports = router;
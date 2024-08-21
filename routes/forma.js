const express = require('express');
const { check, validationResult } = require('express-validator');
const Formation = require('../modles/formation');
const {getFormation} = require('../controlleur/formationControlleur');
const {getFormationById} = require('../controlleur/formationControlleur');
const {creationFormation} = require ('../controlleur/formationControlleur');
const {updateFormation} = require('../controlleur/formationControlleur');
const router = express.Router();
router.post('/formation',
    [
        check('nameF', 'Entrez le nom').not().isEmpty(),
        check('dureeF', 'Entrez le temps').not().isEmpty(),
        check('formateur', 'Entrez la nom de Formateur').not().isEmpty(),
        check('descriptionF', 'Entrez la description').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nameF, dureeF,formateur, descriptionF } = req.body;

        try {
            // Check if the formation already exists
            let formation = await Formation.findOne({ nameF });
            if (formation) {
                return res.status(400).json({ msg: "Formation already exists" });
            }

            // Create a new Formation
            formation = new Formation({
                nameF,
                dureeF,
                formateur,
                descriptionF
            });
        
            // Save the Formation to the database
            await formation.save();

            // Return a success response
            res.status(201).json({ msg: "Formation saved successfully", formation });

        } catch (err) {
            console.error(err.message);
            res.status(500).send('forma error');
        }
    }
);
// Supprimer un  cour d'une formation  (Admin seulement)
router.delete(
    '/name',
    async(req,res)=>{
        
        //pour veref a nameF
        const {nameF}=req.body;
        try {
            //check formation exit ou non 
            const name = await name.findOne({nameF});
            if (!name){
                return res.status(200).json({msg:"Formation unetrouvable ..."});
            }
            //veref si admin ou utilisateur
            if(name.formateur.toString()!==req.session.userid){
                return res.status(401).json({msg:'utilisateur non autorisee'});
            }
            await name.remove();
            res.json({msg:'foramtion deleted ..'});
        }catch (err){
            res.status(500).send('formation didnt delete ..');
        }
        
    }
);
// récupérer formation
router.get(
    '/getFormation',
    
    getFormation

);
// recuper fomation by id
router.get(
    '/getFormationById',

    getFormationById
);
// creer Formation
router.post(
    '/creationFormation',
    creationFormation
);
// update Formation
router.put('/updateFormation',
    

    updateFormation
);
module.exports=router;

const express= require('express');
const { check,validationResult } = require('express-validator');
const {getCours} = require('../controlleur/courControlleur');
const {getCourById} = require('../controlleur/courControlleur');
const {createCour}= require('../controlleur/courControlleur');
const {updateCour} = require ('../controlleur/courControlleur');
const {suprimer} = require('../controlleur/courControlleur');
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
);

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
//delete cour from Formation
router.delete('/suprimer',
    suprimer
)
module.exports = router;
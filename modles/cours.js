const mongoose = require('mongoose');
const Courschema = new mongoose.Schema({
    titreC:{
        type: String,
        required:true
    },
    descriptionC:{
        type: String,
        required:true
    },
});
module.exports= mongoose.model('Cours',Courschema);

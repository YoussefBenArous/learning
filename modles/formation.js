const mongoose = require('mongoose');

const formationschema = new mongoose.Schema({
    nameF:{
        type: String,
        required: true
    },
    dureeF:{
        type: String ,
        required: true
    },
    formateur:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User',        
        required: true
    },
    descriptionF:{
        type: String ,
        required: true
    },
});
module.exports = mongoose.model('Formation', formationschema);

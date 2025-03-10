const mongoose = require('mongoose');

function connectToDB() {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('Connected to DB');
    })
    // mongoose.connect(MONGO_URI);
}

module.exports = connectToDB;
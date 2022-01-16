const mongoose = require('mongoose');

const dbCode = "mongodb+srv://phamkhoa_ledong:phamkhoavaledonglasuperadmin@bkfc-taythanh.m4vxh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const dbCode = 'mongodb+srv://ledong0110:zyxOvPvnytMiDh0q@cluster0.digrh.mongodb.net/Dong-Dev-Blog?retryWrites=true&w=majority'
async function connect() {
    try {
        await mongoose.connect(dbCode, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect successfully');
    } catch (error) {
        console.log('Connect Failure!');
    }
}

module.exports = { connect };

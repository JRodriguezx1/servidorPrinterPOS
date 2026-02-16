import mongoose from "mongoose";


export default ( async ()=>{

    try {
        await mongoose.connect('mongodb+srv://julianithox1_db_user:p6YgOcwRDJZrmgMA@apiusers.kx0cvp8.mongodb.net/apiUsers?appName=apiUsers');
        console.log("MongoDB conectado");
    } catch (error) {
        console.log("error >> ", error);
        process.exit(1);
    }
    
})();

const express = require('express');
const mongoose = require('mongoose');
const adminRouter = require('./routes/admin');

const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');

const PORT = 3000;
const app = express();
const DB = "mongodb+srv://Louis47:lh4za3TxOHT7RbKt@cluster0.zqzir.mongodb.net/?retryWrites=true&w=majority"

app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

//Connect to MongoDB
mongoose.connect(DB).then(() =>{
    console.log('Connected to MongoDB');
}).catch(err =>{
    console.log('Error:', err.message);
});


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Connecté sur le port ${PORT}`);
    });
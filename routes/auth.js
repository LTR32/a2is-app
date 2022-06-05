const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

authRouter.post('/api/signup', async (req, res) => {
    const {name, email, password } = req.body;

    try { 
        const existingUser = await User.findOne({email: email});
        if(existingUser){
            return res
            .status(400)
            .json({msg: 'Email déjà utilisée'});
        }

        const hashedPassword = await bcrypt.hash(password, 8);
    
        let user = new User({
            email,
            password: hashedPassword,
            name,
        });
        user = await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

authRouter.post('/api/signin', async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res
            .status(400)
            .json({msg: 'Utilisateur non trouvé'});  // si l'utilisateur n'existe pas
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res
            .status(400)
            .json({msg: 'Mot de passe incorrect'});
        }

        const token = jwt.sign({id: user._id}, "passwordKey");
        res.json({token, ...user._doc});
        
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

authRouter.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if(!token) return res.json(false);
        const {verified} = jwt.verify(token, "passwordKey");
        if(!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if(!user) return res.json(false);
        return res.json(true);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

authRouter.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({...user._doc, token: req.token});
});

module.exports = authRouter;

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createError } = require('../utils/errorUtil');

exports.register = async (req, res, next) => {
    const { username, email, password, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user){
            res.status(400).json({status:400, message: "Email is already exist" });
            return next(createError(400, 'Email already exists'));

        } 
        
        user = new User({ username, email, password, role });
        
        // If a file was uploaded, add its path to the user data
        if (req.file) {
            user.profileimage = req.file.path; 
        }
        const payload = { id: user._id, isAdmin: user.role === 'admin' };  
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        await user.save();

        user = user.toObject(); 
        user.token = token;

        res.status(201).json({status: 201 ,message: "USer register successfully", data: user });
    } catch (error) {
        res.status(400).json({status:400, message: "error ", error });
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return next(createError('Invalid credentials', 400));
        console.log(user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return next(createError('Invalid credentials', 400));

        const payload = { id: user._id, isAdmin: user.role === 'admin' }; 
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        const userwithtoken = user.toObject(); 
        userwithtoken.token = token;
                
        res.json({status:201 ,message: "Login successful", Data : userwithtoken });
    } catch (error) {
        res.status(400).json({status:400, message: "error ", error });
    }
};

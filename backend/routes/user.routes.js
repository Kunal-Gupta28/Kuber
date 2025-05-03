const express= require('express');
const router = express.Router();
const {body} = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middlewares");
const upload = require("../middlewares/multer.middleware");


router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('First name atleast 3 characters long'),
    body('password').isLength({min:6}).withMessage('Password must be 6 characters long')

],userController.registerUser);

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password must be 6 characters long')

],userController.loginUser);

router.get('/profile',authMiddleware.authUser,userController.getUserProfile);

// Upload profile image
router.post('/upload-profile-image',authMiddleware.authUser ,upload.single('image'), userController.uploadImage);

router.put('/update-profile',authMiddleware.authUser,userController.updateProfile);

router.get('/logout',userController.logoutUser);


module.exports = router;     
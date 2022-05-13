const router = require('express').Router();
const { authControllers } = require('../controllers');
const fileUploader = require('../lib/uploader');
const { loginAuthorizedToken } = require('../middlewares/authMiddleware');

router.post('/register', authControllers.registerUser);
// router.get('/verify/:token', authControllers.verifyUser);
router.post('/login', authControllers.loginUser);
router.get('/:id', loginAuthorizedToken, authControllers.getUserData);
router.get('/user/:id', loginAuthorizedToken, authControllers.getUserDataById);

router.patch(
  '/profile/picture',
  loginAuthorizedToken,
  fileUploader({
    destinationFolder: 'profile_picture',
    fileType: 'image',
    prefix: 'Profile',
  }).single('profile_image_file'),
  authControllers.uploadProfilPic
);

router.patch('/profile', loginAuthorizedToken, authControllers.editProfile);

// router.post('/resend-verification', loginAuthorizedToken, authControllers.resendVerificationEmail);

// router.post('/forgot-password-email', authControllers.sendForgotPasswordEmail);
// router.patch('/reset-password/:token', authControllers.changeUserForgotPassword);

module.exports = router;
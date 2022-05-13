const router = require('express').Router();
const { postControllers } = require('../controllers');
const fileUploader = require('../lib/uploader');
const { loginAuthorizedToken } = require('../middlewares/authMiddleware');

router.post(
  '/',
  loginAuthorizedToken,
  fileUploader({
    destinationFolder: 'posts',
    fileType: 'image',
    prefix: 'POST',
  }).single('post_image_file'),
  postControllers.postUpload
);

router.get('/', loginAuthorizedToken, postControllers.getAllpost);
router.get('/:id', postControllers.getPostById);
router.get('/:id/comment', loginAuthorizedToken, postControllers.getAllComment);
router.get('/user/:id', loginAuthorizedToken, postControllers.getAllpostByUserId);
router.get('/:PostId/like-status', loginAuthorizedToken, postControllers.likeStatus);
router.get('/like/:UserId', loginAuthorizedToken, postControllers.getAllLovedPost);

router.delete('/:id', loginAuthorizedToken, postControllers.deletePost);

router.post('/:id-comment', loginAuthorizedToken, postControllers.commentAPost);
router.patch('/:PostId/like', loginAuthorizedToken, postControllers.likeApost);
router.patch('/:PostId/dislike', loginAuthorizedToken, postControllers.dislikeApost); 
router.patch('/:id/caption/', loginAuthorizedToken, postControllers.editPost);

module.exports = router;
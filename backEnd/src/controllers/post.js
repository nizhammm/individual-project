const { Post, User, Like, Comment } = require('../lib/sequelize');

const postControllers = {
  postUpload: async (req, res) => {
    try {
      const { caption, location } = req.body;

      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      console.log(uploadFileDomain)
      const filePath = 'post_images';
      const { filename } = req.file;

      await Post.create({
        image_url: `${uploadFileDomain}/${filePath}/${filename}`,
        caption,
        location,
        UserId: req.token.id,
      });

      const newPost = await Post.findOne({
        where: {
          image_url: `${uploadFileDomain}/${filePath}/${filename}`,
        },
        include: {
          model: User,
          attributes: ['id', 'username', 'image_url'],
        },
      });

      console.log(newPost);

      return res.status(201).json({
        message: 'create new post success',
        result: newPost,
      });
    } catch (err) {
      return res.status(500).json({
        message: 'server error',
      });
    }
  },
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;

      const deletePost = await Post.destroy({
        where: {
          id,
          UserId: req.token.id,
        },
      });

      if (!deletePost) {
        return res.status(200).json({
          message: 'post not found',
          result: deletePost,
        });
      }

      return res.status(201).json({
        message: 'Delete Post succsess',
        result: deletePost,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Server error',
      });
    }
  },
  editPost: async (req, res) => {
    try {
      const { id } = req.params;
      const { caption } = req.body;

      const editPost = await Post.update(
        { caption },
        {
          where: {
            id,
            UserId: req.token.id,
          },
        }
      );

      if (!editPost) {
        return res.status(200).json({
          message: 'post not found',
        });
      }

      return res.status(201).json({
        message: 'edit caption success',
        result: caption,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Server error',
      });
    }
  },
  getAllpost: async (req, res) => {
    try {
      const { _limit = 5, _page = [1, 1], _sortBy = '', _sortDir = '' } = req.query;

      delete req.query._limit;
      delete req.query._page;
      delete req.query._sortBy;
      delete req.query._sortDir;

      const allpost = await Post.findAndCountAll({
        where: {
          ...req.query,
        },
        limit: _limit ? parseInt(_limit) : undefined,
        offset: (_page[0] - 1) * _limit,
        include: [
          { model: User, attributes: ['username', 'full_name', 'image_url'] },
          {
            model: Like,
            include: [{ model: User, attributes: ['id', 'username'] }],
            // where: { UserId: req.token.id },
          },
          {
            model: Comment,
            //
            limit: _limit ? parseInt(_limit) : undefined,
            offset: (_page[1] - 1) * _limit,
            include: [{ model: User, atrributes: ['id', 'username'] }],
          },
          //
        ],
        distinct: true,
        order: [['createdAt', 'DESC']],
      });

      console.log(allpost)
      return res.status(200).json({
        message: 'get all post succsess',
        result: allpost,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Server error',
      });
    }
  },
  getPostById: async (req, res) => {
    try {
      const { id } = req.params;

      const allpost = await Post.findByPk(id, {
        include: [{ model: User, attributes: ['username', 'full_name', 'image_url'] }],
      });

      return res.status(200).json({
        message: 'get post succsess',
        result: allpost,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Server error',
      });
    }
  },
  commentAPost: async (req, res) => {
    try {
      const { comment } = req.body;
      const { id } = req.params;

      const newcomment = await Comment.create({
        comment,
        UserId: req.token.id,
        PostId: id,
      });

      const findComment = await Comment.findOne({
        where: {
          id: newcomment.id,
        },
        include: [{ model: User, attributes: ['username', 'full_name', 'image_url'] }],
      });

      return res.status(201).json({
        message: 'create comment to a post succsess',
        result: findComment,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Server error',
      });
    }
  },
  likeApost: async (req, res) => {
    try {
      const { PostId } = req.params;

      const findPost = await Post.findOne({
        where: {
          id: PostId,
        },
      });

      const findLikeStatus = await Like.findOne({
        where: {
          PostId,
          UserId: req.token.id,
        },
      });

      if (!findLikeStatus) {
        await Like.create({
          PostId,
          UserId: req.token.id,
        });

        const like = await Post.increment({ like_count: 1 }, { where: { id: PostId } });
        console.log('like');

        return res.status(200).json({
          message: 'Liked post',
          result: findPost,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Server error',
      });
    }
  },
  dislikeApost: async (req, res) => {
    try {
      const { PostId } = req.params;

      const findPost = await Post.findOne({
        where: {
          id: PostId,
        },
      });

      const findLikeStatus = await Like.findOne({
        where: {
          PostId,
          UserId: req.token.id,
        },
      });

      if (findLikeStatus) {
        await Like.destroy({
          where: {
            PostId,
            UserId: req.token.id,
          },
        });

        const dislike = await Post.decrement({ like_count: 1 }, { where: { id: PostId } });
        console.log('dislike');
        // console.log(dislike);

        return res.status(200).json({
          message: 'disLiked post',
          result: findPost,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Server error',
      });
    }
  },
  likeStatus: async (req, res) => {
    const { PostId } = req.params;

    const findLikeStatus = await Like.findOne({
      where: {
        PostId,
        UserId: req.token.id,
      },
    });

    if (findLikeStatus) {
      return res.status(200).json({
        message: 'post already like',
        result: true,
      });
    }
    if (!findLikeStatus) {
      return res.status(200).json({
        message: 'post not liked yet',
        result: false,
      });
    }
  },
  getAllpostByUserId: async (req, res) => {
    const { _limit = 5, _page = 1, _sortBy = '', _sortDir = '' } = req.query;

    delete req.query._limit;
    delete req.query._page;
    delete req.query._sortBy;
    delete req.query._sortDir;

    const { id } = req.params;
    try {
      const allpost = await Post.findAndCountAll({
        where: {
          ...req.query,
          UserId: id,
        },
        include: [{ model: User, attributes: ['username', 'full_name', 'image_url', 'id', 'bio'] }],
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json({
        message: 'get all post succsess',
        result: allpost,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Server error',
      });
    }
  },
  getAllLovedPost: async (req, res) => {
    try {
      const { UserId } = req.params;
      const findLikePost = await Like.findAll({
        where: { UserId },
        include: [
          {
            model: Post,
            include: [{ model: User, attributes: ['id', 'username'] }],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json({
        message: 'get all post succsess',
        result: findLikePost,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Server error',
      });
    }
  },
  getAllComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { _limit = 5, _page = 1 } = req.query;

      delete req.query._limit;
      delete req.query._page;

      const allComment = await Comment.findAndCountAll({
        where: {
          ...req.query,
          PostId: id,
        },
        limit: _limit ? parseInt(_limit) : undefined,
        offset: (_page - 1) * _limit,
        include: [{ model: User, attributes: ['username', 'full_name', 'image_url'] }],
        distinct: true,
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json({
        message: 'get all comment succsess',
        result: allComment,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Server error',
      });
    }
  },
};
module.exports = postControllers;
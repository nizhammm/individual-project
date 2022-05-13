const { Op } = require('sequelize');
const { User, VerificationToken, ForgotPasswordToken } = require('../lib/sequelize');
const bcrypt = require('bcrypt');
const { generateToken, verifyToken } = require('../lib/jwt');
const mailer = require('../lib/mailer');
const mustache = require('mustache');
const fs = require('fs');
const { nanoid } = require('nanoid');
const moment = require('moment');

const authControllers = {
  registerUser: async (req, res) => {
    try {
      const { username, email, full_name, password, repeatPassword } = req.body;

      if (password !== repeatPassword) {
        return res.status(400).json({
          message: 'password not match',
        });
      }

      const isUsernameEmailRegisterd = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });

      if (isUsernameEmailRegisterd) {
        return res.status(400).json({
          message: 'username is not available or email has been registered',
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 5);

      const newUser = await User.create({
        username,
        email,
        full_name,
        password: hashedPassword,
      });

      // Verification email
      // const verificationToken = nanoid(40);
      // console.log(verificationToken);

      // await VerificationToken.create({
      //   token: verificationToken,
      //   UserId: newUser.id,
      //   valid_until: moment().add(1, 'hour'),
      //   is_valid: true,
      // });

      // const verificationLink = `http://localhost:2060/auth/verify/${verificationToken}`;
      // console.log(verificationLink);
      // const template = fs.readFileSync(__dirname + '/../templates/verify.html').toString();

      // const renderedTemplate = mustache.render(template, {
      //   username,
      //   verify_url: verificationLink,
      //   full_name,
      // });

      // await mailer({
      //   to: email,
      //   subject: 'Verify your account!',
      //   html: renderedTemplate,
      // });

      console.log('email terkirim');
      return res.status(201).json({
        message: 'register succsess',
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'server error',
      });
    }
  },
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;

      const findUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email: username }],
        },
      });

      if (!findUser) {
        return res.status(400).json({
          message: 'Wrong username or password',
        });
      }

      const isPasswordCorrect = bcrypt.compareSync(password, findUser.password);

      if (!isPasswordCorrect) {
        console.log(isPasswordCorrect);
        return res.status(400).json({
          message: 'Wrong username or password',
        });
      }

      delete findUser.dataValues.password;

      const token = generateToken({
        id: findUser.id,
      });

      // // await mailer({
      // //   to: findUser.email,
      // //   subject: "Logged in account",
      // //   text: "An account using your email has logged in"
      // })

      return res.status(200).json({
        message: 'Logged in user',
        result: {
          user: findUser,
          token,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Server error',
      });
    }
  },
  editProfile: async (req, res) => {
    try {
      const { id, bio, username, email, full_name, image_url, is_verified } = req.body;

      const isUsernameEmailRegisterd = await User.findOne({
        where: { username },
      });

      if (isUsernameEmailRegisterd) {
        return res.status(400).json({
          message: 'username is not available',
        });
      }
      const updateData = { id, username, bio, email, full_name, image_url, is_verified };
      console.log(updateData);
      const newProfile = await User.update(updateData, { where: { id: req.token.id } });

      if (!newProfile) {
        return res.status(400).json({
          message: 'data failed',
        });
      }

      return res.status(201).json({
        message: 'profile create or edit succses',
        result: { ...updateData },
      });
    } catch (err) {
      return res.status(500).json({
        message: 'server error',
      });
    }
  },
  uploadProfilPic: async (req, res) => {
    try {
      const upLoadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filepath = 'profile_picture';
      const { filename } = req.file;

      const updateData = { image_url: `${upLoadFileDomain}/${filepath}/${filename}` };
      console.log(updateData);
      const newProfile = await User.update(updateData, { where: { id: req.token.id } });

      if (!newProfile) {
        return res.status(400).json({
          message: 'data failed',
        });
      }

      return res.status(201).json({
        message: 'profile create or edit succses',
        result: updateData,
      });
    } catch (err) {
      return res.status(500).json({
        message: 'server error',
      });
    }
  },
  getUserData: async (req, res) => {
    try {
      const findUser = await User.findOne({
        where: {
          id: req.token.id,
        },
      });

      delete findUser.dataValues.password;
      return res.status(200).json({
        message: 'Logged in user',
        result: {
          user: findUser,
        },
      });
    } catch (err) {
      return res.status(500).json({
        message: 'server error',
      });
    }
  },
  getUserDataById: async (req, res) => {
    try {
      const { id } = req.params;

      const findUser = await User.findOne({
        where: {
          id,
        },
      });

      delete findUser.dataValues.password;
      return res.status(200).json({
        message: 'user data gate success',
        result: findUser,
      });
    } catch (err) {
      return res.status(500).json({
        message: 'server error',
      });
    }
  },
  resendVerificationEmail: async (req, res) => {
    try {
      const { id } = req.token; // JWT

      const findToken = await VerificationToken.update(
        { is_valid: false },
        {
          where: {
            is_valid: true,
            UserId: id,
          },
        }
      );

      console.log(findToken);
      if (!findToken) {
      }

      const verificationToken = nanoid(40);

      await VerificationToken.create({
        token: verificationToken,
        is_valid: true,
        UserId: id,
        valid_until: moment().add(1, 'hour'),
      });

      const findUser = await User.findByPk(id);

      const verificationLink = `http://localhost:2060/auth/verify/${verificationToken}`;
      console.log(verificationLink);

      const template = fs.readFileSync(__dirname + '/../templates/verify.html').toString();

      const renderedTemplate = mustache.render(template, {
        username: findUser.username,
        verify_url: verificationLink,
        full_name: findUser.full_name,
      });

      await mailer({
        to: findUser.email,
        subject: 'Verify your account!',
        html: renderedTemplate,
      });

      console.log('email terkirim');

      return res.status(201).json({
        message: 'Resent verification email',
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Server error',
      });
    }
  },
  verifyUser: async (req, res) => {
    try {
      const { token } = req.params;
      console.log(token);

      const findToken = await VerificationToken.findOne({
        where: {
          token,
          is_valid: true,
          valid_until: {
            [Op.gt]: moment().utc(),
          },
        },
      });

      if (!findToken) {
        return res.status(400).json({
          message: 'Your token is invalid',
        });
      }

      await User.update(
        { is_verified: true },
        {
          where: {
            id: findToken.UserId,
          },
        }
      );

      findToken.is_valid = false;
      findToken.save();

      return res.redirect(`http://localhost:3000/verification`);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Server error',
      });
    }
  },
  sendForgotPasswordEmail: async (req, res) => {
    try {
      const { email } = req.body;

      const findUser = await User.findOne({
        where: {
          email,
        },
      });

      console.log(findUser.id);
      const passwordToken = nanoid(40);

      await ForgotPasswordToken.update(
        { is_valid: false },
        {
          where: {
            UserId: findUser.id,
            is_valid: true,
          },
        }
      );

      await ForgotPasswordToken.create({
        token: passwordToken,
        valid_until: moment().add(1, 'hour'),
        is_valid: true,
        UserId: findUser.id,
      });

      const forgotPasswordLink = `http://localhost:3000/reset-password/${passwordToken}`;

      const template = fs.readFileSync(__dirname + '/../templates/forgot.html').toString();

      const renderedTemplate = mustache.render(template, {
        username: findUser.username,
        forgot_password_url: forgotPasswordLink,
        full_name: findUser.full_name,
      });

      await mailer({
        to: findUser.email,
        subject: 'Forgot password!',
        html: renderedTemplate,
      });

      return res.status(201).json({
        message: 'Resent verification email',
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Server error',
      });
    }
  },
  changeUserForgotPassword: async (req, res) => {
    try {
      const { password } = req.body;
      const { token } = req.params;
      console.log(password);

      console.log(token);

      const findToken = await ForgotPasswordToken.findOne({
        where: {
          token,
          is_valid: true,
          valid_until: {
            [Op.gt]: moment().utc(),
          },
        },
      });

      console.log(findToken);

      if (!findToken) {
        return res.status(400).json({
          message: 'Invalid token',
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 5);

      await User.update(
        { password: hashedPassword },
        {
          where: {
            id: findToken.UserId,
          },
        }
      );

      await ForgotPasswordToken.update(
        { is_valid: false },
        {
          where: {
            UserId: findToken.UserId,
            is_valid: true,
          },
        }
      );

      return res.status(200).json({
        message: 'Change password success',
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Server error',
      });
    }
  },
};

module.exports = authControllers;

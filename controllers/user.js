const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
const config = require("../config/auth.config");
const { encode } = require("../middlewares/jwt");
const SECRET_KEY = "some-secret-key";

async function login(req, res) {
  try {
    let user = await UserModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      res.json({
        success: false,
        msg: "Authorization Failed , User not found",
      });
    } else {
      if (user.comparePassword(req.body.password)) {
        let token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: config.jwtExpiration,
        });

        let refreshToken = await RefreshToken.createToken(user);

        res.status(200).send({
          success: true,
          id: user._id,
          email: user.email,
          name: user.name,
          accessToken: token,
          refreshToken: refreshToken,
          expiryDate: refreshToken.expiryDate,
        });
      } else {
        res.status(403).json({
          success: false,
          msg: "Authorization Failed , wrong password",
        });
      }
    }
  } catch (error) {
    res.status(403).json({
      success: false,
      msg: "Authorization Failed , wrong password",
    });
  }
}

async function signup(req, res) {
  try {
    const { name, email, password, password2 } = req.body;

    if (password === password2) {
      const user = await UserModel.create({
        name,
        email,
        password,
      });

      let token = jwt.sign(user.toJSON(), config.secret, {
        expiresIn: config.jwtExpiration,
      });

      let refreshToken = await RefreshToken.createToken(user);

      res.json({
        success: true,
        id: user._id,
        email: user.email,
        name: user.name,
        accessToken: token,
        refreshToken: refreshToken,
      });
    } else {
      res.json({
        success: false,
        message: "Confirm password is wrong",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
}

async function refreshToken(req, res) {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    res.status(403).json({
      message: "Refresh Token is Required!",
    });
    console.log("Refresh Token is Required!");
    return;
  }

  try {
    let refreshToken = await RefreshToken.findOne({
      token: requestToken,
    });

    if (!refreshToken) {
      return res.status(403).send("Refresh token is not in database!");
    }
    console.log("Refresh token is not in database!");

    if (RefreshToken.verifyExpiration(refreshToken)) {
      await RefreshToken.findOneAndDelete({
        _id: refreshToken._id,
      });

      res
        .status(401)
        .send("Refresh token was expired. Please make a new signin request");
      console.log(
        "Refresh token was expired. Please make a new signin request"
      );
      return;
    }

    let newAccessToken = jwt.sign(
      { id: refreshToken.user._id },
      config.secret,
      {
        expiresIn: config.jwtExpiration,
      }
    );

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
}

async function logout(req , res){
  const refreshToken = req.body.refreshToken;
  try {
    await RefreshToken.findOneAndDelete({
      _id : refreshToken
    })
    res.status(200).json({
      success : true,
      message : 'You are logged out from your account!'
    })
  } catch (error) {
    return res.status(500).send({ message: error });
  }
}

module.exports = {
  login,
  signup,
  refreshToken,
  logout
};

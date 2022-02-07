const redis = require("redis");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const { promisify } = require("util");

const { UserModel } = require("../db/index");

const client = redis.createClient();

class User {
  constructor() {}

  async create(user) {
    const findUser = await UserModel.findOne({ email: user.email });

    if (findUser) {
      throw new Error("This email is already exists");
    }
    const result = await UserModel.create({
      ...user,
      password: md5(user.password),
    });
    return result;
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email, password: md5(password) });
    if (!user) {
      throw new Error("User not found!");
    }
    const token = jwt.sign({ userId: user.id }, "basicItCenter");
    console.log(token);
    await promisify(client.set).bind(client)(user.id, token);
    return { token };
  }

  async logOut(token) {
    const { userId, iat } = jwt.verify(token, "basicItCenter");
    console.log("iattt", iat, userId);
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      throw new Error("Sonething went wrong");
    }
    await promisify(client.del).bind(client)(user.id);
    return "success";
  }

  async checkLogin(token) {
    const { userId, iat } = jwt.verify(token, "basicItCenter");
    const user = await UserModel.findOne({ _id: userId });
    const id = user._id;
    const isLogined = await promisify(client.get).bind(client)(
      user._id.toString()
    );
    if (!user || !isLogined) {
      throw new Error("This user not found!");
    }

    return user._id;
  }

  async find(id) {
    const result = await UserModel.findOne({ _id: id });
    return result;
  }
}

module.exports = User;

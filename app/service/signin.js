const Service = require('egg').Service;

const serialLevel = [0, 5, 10, 20, 30, 50, 70, 100, 150, 200, 300, 400];
const prizeLevel = [0, 1, 2, 3, 4, 5, 7, 10, 15, 20, 30, 100];

class SigninService extends Service {
  async find(id) {
    const signin = await this.ctx.model.Signin.findOne({
      id,
    });
    return signin;
  }

  async findByUserId(user_id) {
    const signin = await this.ctx.model.Signin.findOne({
      user_id,
    });
    return signin;
  }

  async save(params) {
    const signin = await this.findByUserId(params.user_id);
    if (signin) return false;
    const new_signin = new this.ctx.model.Signin(params);
    new_signin.id = await this.service.ids.getId('signin_id');
    await new_signin.save();
    return new_signin;
  }

  async update(params) {
    const signin = await this.ctx.model.Signin.findOneAndUpdate({
      id: params.id,
    }, params, {
      new: true,
    });
    return signin;
  }

  async doSignin(user_id) {
    const signin = await this.findByUserId(user_id);
    let serial = 0;
    if (signin) {
      serial = signin.serial;
      const form = {
        id: signin.id,
        serial: signin.serial + 1,
        update_time: Date.now(),
      }
      await this.update(form);
    } else {
      const form = {
        user_id,
        serial: 1,
      };
      await this.save(form);
    }

    const num = await this.getSigninCcoin(serial);

    const user = await this.service.user.find();
    if (user) {
      if (!user.ccoin) user.ccoin = 0;
      user.ccoin += num;
    }
    await this.service.user.updateCcoin(user);

    return {
      serial,
      ccoin: user.ccoin,
      ccoin_add: num,
    };
  }

  async getSigninCcoin(serial = 0) {
    let idx = 0;
    for (let i = 0; i < serialLevel.length; i += 1) {
      if (serialLevel[i] >= serial) {
        break;
      } else {
        idx += 1;
      }
    }
    return prizeLevel[idx] + 5;
  }
}

module.exports = SigninService;
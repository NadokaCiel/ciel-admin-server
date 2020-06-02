'use strict';

const createRule = {
  title: {
    type: 'string',
    required: true,
  },
  content: {
    type: 'string',
    required: true,
  },
  type: {
    type: 'string',
    required: true,
  },
  options: {
    type: 'array',
    required: true,
  },
  answer: {
    type: 'array',
    required: true,
  },
};

const updateRule = {
  id: {
    type: 'number',
    required: true,
  },
  title: {
    type: 'string',
    required: true,
  },
  content: {
    type: 'string',
    required: true,
  },
  type: {
    type: 'string',
    required: true,
  },
  options: {
    type: 'array',
    required: true,
  },
  answer: {
    type: 'array',
    required: true,
  },
};

const Controller = require('../../core/api_controller');
class SubjectController extends Controller {

  async index() {
    const actor = await this.getUser(true);
    if (this.roleRank(actor.role) < 3) {
      return this.error('仅限管理员使用该功能');
    } else {
      await this.repackList('Subject');
    }
  }

  async create() {
    try {
      this.ctx.validate(createRule);

      const actor = await this.getUser(true);
      if (this.roleRank(actor.role) < 3) {
        return this.error('没有操作权限');
      }

      const repeat = await this.ctx.model.Subject.find({
        title: this.ctx.request.body.title,
      });
      if (repeat.length > 0) {
        return this.error('该题已存在于题库');
      }

      let subject = new this.ctx.model.Subject(this.ctx.request.body);

      if(!this.checkOption(subject.options, subject.type)) return;

      subject.id = await this.getId('subject_id');
      subject.creator = await this.getUser();
      subject = await subject.save();

      this.success({
        id: subject.id,
      });
    } catch (err) {
      this.logger.error(err);
      this.error('Create Subject Failed');
    }
  }

  async show() {
    if (!this.ctx.params.id) {
      return this.error('缺少参数');
    }
    const actor = await this.getUser(true);
    if (this.roleRank(actor.role) < 3) {
      return this.error('没有操作权限');
    }
    try {
      const subject = await this.ctx.model.Subject.findOne({
        id: this.ctx.params.id,
      });
      this.success(subject);
    } catch (err) {
      this.logger.error(err);
      this.error('获取题目失败！');
    }
  }

  async update() {
    try {
      this.ctx.validate(updateRule);

      const data = this.ctx.request.body;

      if(!this.checkOption(data.options, data.type)) return;

      const actor = await this.getUser(true);

      const old = await this.ctx.model.Subject.findOne({
        id: data.id,
      });

      if (actor.id !== old.creator.id && this.roleRank(actor.role) < 3) {
        return this.error('没有操作权限');
      }

      const repeat = await this.ctx.model.Subject.find({
        id: {
          $ne: data.id,
        },
        title: this.ctx.request.body.title,
      });
      if (repeat.length > 0) {
        return this.error('该题已存在于题库');
      }

      data.updater = await this.getUser();
      data.update_time = Date.now();

      const subject = await this.ctx.model.Subject.findOneAndUpdate({
        id: data.id,
      }, data, {
        new: true,
      });
      this.success(subject);
    } catch (err) {
      this.logger.error(err);
      return this.error('更新题目失败');
    }
  }

  checkOption(options, type) {
    let count = 0;
    options = options.filter(option => option.text);
    options.forEach(option => {
      if (option.isTrue) {
        count += 1;
      }
    });
    console.log('options', options);
    if (options.length < 2) {
      this.error('请提供至少2个选项');
      return false;
    }
    if (count === 0) {
      this.error('题目没有正确答案');
      return false;
    }
    if (count === 1 && type === 'multi_select') {
      this.error('多选题需要多个正确答案');
      return false;
    }
    if (count > 1 && type === 'select') {
      this.error('单选题只能由一个正确答案');
      return false;
    }
    return true;
  }

  async destroy() {
    if (!this.ctx.params.id) {
      return this.error('缺少参数');
    }

    const actor = await this.getUser(true);

    if (this.roleRank(actor.role) < 4) {
      return this.error('无权进行该操作');
    }

    try {
      await this.ctx.model.Subject.remove({
        id: this.ctx.params.id,
      });
      this.success('题目删除成功');
    } catch (err) {
      this.logger.error(err);
      this.error('题目删除失败！');
    }
  }

  async option() {
    try {
      const {
        query,
        model,
      } = this.ctx;

      const filter = '-_id -__v -create_time -update_time -creator -updater';

      const subjectDoc = model.Subject;
      const subjectArr = await subjectDoc.find().select(filter);

      this.success({
        subject: subjectArr,
      });
    } catch (err) {
      this.logger.error(err);
      this.error(err);
    }
  }
}
module.exports = SubjectController;
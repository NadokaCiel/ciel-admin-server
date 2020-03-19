'use strict';

const fs = require('mz/fs');
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;

const createRule = {
  name: {
    type: 'string',
    required: true,
  },
  url: {
    type: 'string',
    required: false,
  },
};

function randomString(expect = 5) {
  let str = Math.random().toString(36).substring(2);
  while (str.length < expect) {
    str += Math.random().toString(36).substring(2);
  }
  return str.substring(0, expect);
}

function mkdirPath(pathStr) {
  let projectPath = path.join(process.cwd());
  const tempDirArray = pathStr.split('\\');
  for (var i = 0; i < tempDirArray.length; i++) {
    projectPath = projectPath + '/' + tempDirArray[i];
    if (fs.existsSync(projectPath)) {
      const tempstats = fs.statSync(projectPath);
      if (!(tempstats.isDirectory())) {
        fs.unlinkSync(projectPath);
        fs.mkdirSync(projectPath);
      }
    } else {
      fs.mkdirSync(projectPath);
    }
  }
  return projectPath;
}

const originPath = 'app/public/uploads';

const Controller = require('../core/api_controller');
class ImageController extends Controller {

  async index() {
    const actor = await this.getUser(true);
    if (this.roleRank(actor.role) < 3) {
      return this.error('没有操作权限');
    } else {
      await this.repackList('Image');
    }
  }

  async upload() {
    // 获取文件流
    const stream = await this.ctx.getFileStream();
    // 定义文件名
    const filename = Date.now() + randomString(4) + path.extname(stream.filename).toLocaleLowerCase();
    // 目标文件
    mkdirPath(originPath);
    const target = path.join(originPath, filename);
    const writeStream = fs.createWriteStream(target);
    console.log('-----------获取表单中其它数据 start--------------');
    console.log(stream.fields);
    console.log('-----------获取表单中其它数据 end--------------');
    try {
      console.log('filename', filename);
      //异步把文件流 写入
      await awaitWriteStream(stream.pipe(writeStream));

      let image = new this.ctx.model.Image({
        url: '/public/uploads/' + filename,
        name: filename,
      });
      image.id = await this.getId('image_id');
      // image.creator = await this.getUser();
      image = await image.save();
      // 自定义方法
      this.success({
        name: filename,
        url: image.url,
      });
    } catch (err) {
      console.log(err);
      this.logger.error(err);
      // 自定义方法
      this.error(err);
    } finally {
      //如果出现错误，关闭管道
      sendToWormhole(stream);
    }
  }

  async create() {
    try {
      this.ctx.validate(createRule);

      const repeat = await this.ctx.model.Image.find({
        title: this.ctx.request.body.title,
      });
      if (repeat.length > 0) {
        return this.error('图片标题已被使用');
      }

      const actor = await this.getUser(true);
      if (this.roleRank(actor.role) < 2) {
        return this.error('没有操作权限');
      }

      let image = new this.ctx.model.Image(this.ctx.request.body);
      image.id = await this.getId('image_id');
      image.creator = await this.getUser();
      image.status = 'pending';
      image = await image.save();

      this.success({
        id: image.id,
      });
    } catch (err) {
      this.logger.error(err);
      this.error('Create Image Failed');
    }
  }

  async show() {
    if (!this.ctx.params.id) {
      return this.error('缺少参数');
    }
    try {
      const image = await this.ctx.model.Image.findOne({
        id: this.ctx.params.id,
      });
      this.success(image);
    } catch (err) {
      this.logger.error(err);
      this.error('获取图片失败！');
    }
  }

  async destroy() {
    if (!this.ctx.params.id) {
      return this.error('缺少参数');
    }

    const actor = await this.getUser(true);

    if (this.roleRank(actor.role) < 3) {
      return this.error('无权进行该操作');
    }

    try {
      const image = await this.ctx.model.Image.findOne({
        id: this.ctx.params.id,
      });
      if (!image) {
        this.error('图片不存在');
        return;
      }
      const imagePath = path.join(originPath, image.name);
      if (!fs.existsSync(imagePath)) {
        await this.ctx.model.Image.remove({
          id: this.ctx.params.id,
        });
        this.success('文件不存在，清除图片记录');
        return;
      }
      fs.unlinkSync(imagePath);
      await this.ctx.model.Image.remove({
        id: this.ctx.params.id,
      });
      this.success('图片删除成功');
    } catch (err) {
      this.logger.error(err);
      this.error('图片删除失败！');
    }
  }

}
module.exports = ImageController;

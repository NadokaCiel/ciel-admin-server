const Service = require('egg').Service;

const fs = require('mz/fs');
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const awaitReadStream = require('await-stream-ready').read;
const awaitWriteStream = require('await-stream-ready').write;

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

const originPath = 'app/public/qrcode';

class ImageService extends Service {

  async save(name, buffer) {
    try {
      // const base64Img = buffer.toString('base64');
      // console.log(base64Img);
      // const decodeImg = Buffer.from(base64Img, 'base64');
      // const stream = fs.createReadStream(decodeImg);
      const filename = Date.now() + randomString(4) + path.extname(name).toLocaleLowerCase() + '.png';
      mkdirPath(originPath);
      const target = path.join(originPath, filename);
      // console.log("---------------------------- image target ----------------------------");
      // console.log(target);
      // const writeStream = fs.createWriteStream(target);
      // console.log('filename', filename);
      // const stream = fs.createReadStream(buffer);
      // await awaitReadStream(stream); 
      // console.log("---------------------------- image stream ----------------------------");
      // console.log(stream);
      // // //异步把文件流 写入
      // await awaitWriteStream(stream.pipe(writeStream));
      const base64Img = buffer.toString('base64');
      const decodeImg = new Buffer(base64Img, 'base64');
      await fs.writeFileSync(target, decodeImg);
      let image = new this.ctx.model.Image({
        url: '/public/qrcode/' + filename,
        name: filename,
      });
      image.id = await this.service.ids.getId('image_id');
      // image.creator = await this.getUser();
      image = await image.save();
      // 自定义方法
      return({
        name: filename,
        url: image.url,
      });
    } catch (err) {
      // console.log("---------------------------- image save err ----------------------------");
      // console.log(err);
      this.logger.error(err);
      return err;
    }
  }
}

module.exports = ImageService;
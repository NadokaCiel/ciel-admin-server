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

const originPath = 'app/public';

class ImageService extends Service {

  async save(name, route = "/upload", buffer) {
    try {
      const filename = Date.now() + randomString(4) + path.extname(name).toLocaleLowerCase() + '.png';
      mkdirPath(originPath + route);
      const target = path.join(originPath + route, filename);
      const base64Img = buffer.toString('base64');
      const decodeImg = Buffer.from(base64Img, 'base64');
      await fs.writeFileSync(target, decodeImg);
      let image = new this.ctx.model.Image({
        url: `/public${route}/${filename}`,
        name: filename,
      });
      image.id = await this.service.ids.getId('image_id');
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
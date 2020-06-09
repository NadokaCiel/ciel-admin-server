const Service = require('egg').Service;

class TranscriptService extends Service {
  async find(id) {
    const transcript = await this.ctx.model.Transcript.findOne({
      id,
    });
    return transcript;
  }

  async ifDuplicate(quiz_id) {
    const openid = await this.service.weapp.openid();

    if (!openid) return {
      retcode: 41000,
      msg: '用户未登录',
    }

    const old_t = await this.ctx.model.Transcript.findOne({
      quiz_id,
      user_id: openid,
    });

    if (old_t) {
      return {
        retcode: 42000,
        msg: '用户已提交过试卷',
        data: {
          old_id: old_t.id,
        },
      }
    } else {
      return {};
    }
  }

  // params
  //   quiz_id 问卷id
  //   user_name 用户昵称
  //   user_avatar 用户头像
  //   sheet 答题卡
  //   score 分数
  //   openid 用户openid
  // multi 是否允许同一用户多次提交
  async save(params, multi = false) {

    const openid = await this.service.weapp.openid();

    console.log('—————————————————————— openid ——————————————————————');
    console.log(openid);

    if (!openid) return {
      retcode: 41000,
      msg: '用户未登录',
    }

    if (!multi) {
      const old_t = await this.ctx.model.Transcript.findOne({
        quiz_id: params.quiz_id,
        user_id: openid,
      });

      console.log('—————————————————————— old_t ——————————————————————');
      console.log(old_t);

      if (old_t) {
        return {
          retcode: 42000,
          msg: '用户已提交过试卷',
          data: {
            old_id: old_t.id,
          },
        }
      }
    }

    const quiz = await this.service.quiz.find(params.quiz_id);

    if (!quiz) return {
      msg: '试卷不存在',
    }

    const option = {
      quiz_id: quiz.id,
      title: quiz.title,
      cover: quiz.cover,
      user_id: openid,
      user_name: params.user_name,
      user_avatar: params.user_avatar,
      sheet: params.sheet,
      score: params.score,
    }
    
    const new_transcript = new this.ctx.model.Transcript(option);
    new_transcript.id = await this.service.ids.getId('transcript_id');
    await new_transcript.save();
    return new_transcript;
  }
}

module.exports = TranscriptService;
const createRule = {
	title: {
		type: 'string',
		required: true
	},
	author: {
		type: 'string',
		required: false
	},
	content: {
		type: 'string',
		required: true
	},
	tag: {
		type: 'array',
		required: false
	},
}

const updateRule = {
	id: {
		type: 'number',
		required: true
	},
	title: {
		type: 'string',
		required: true
	},
	author: {
		type: 'string',
		required: false
	},
	content: {
		type: 'string',
		required: true
	},
	tag: {
		type: 'array',
		required: false
	},
}

const Controller = require('../core/api_controller')
class ArticleController extends Controller {

	async index() {
		await this.repackList('Article')
	}

	async create() {
		try {
			this.ctx.validate(createRule)

			const repeat = await this.ctx.model.Article.find({
				title: this.ctx.request.body.title
			})
			if (repeat.length > 0) {
				return this.error("Article title already used")
			}

			let article = new this.ctx.model.Article(this.ctx.request.body)
			article.id = await this.getId('article_id')
			article.creator = await this.getUser()
			console.log(article.creator)
			article = await article.save()

			this.success({
				id: article.id,
			})
		} catch (err) {
			console.log(err);
			this.error("Create Article Failed");
		}
	}

	async show() {
		if (!this.ctx.params.id) {
			return this.error("Parameter missing！")
		}
		try {
			const article = await this.ctx.model.Article.findOne({
				id: this.ctx.params.id
			})
			this.success(article)
		} catch (err) {
			this.error("Get Article Failed")
		}
	}

	async update() {
		try {
			this.ctx.validate(updateRule)

			let data = this.ctx.request.body

			const repeat = await this.ctx.model.Article.find({
				id: {
					$ne: data.id
				},
				title: this.ctx.request.body.title,
			})
			if (repeat.length > 0) {
				return this.error("Article title already used")
			}

			data.updater = await this.getUser()

			data.update_time = Date.now()

			const article = await this.ctx.model.Article.findOneAndUpdate({
				id: data.id
			}, data, {
				new: true
			})
			this.success(article)
		} catch (err) {
			return this.error("Update Article Failed")
		}
	}

	async destroy() {
		if (!this.ctx.params.id) {
			return this.error("Parameter missing！")
		}
		try {
			const article = await this.ctx.model.Article.remove({
				id: this.ctx.params.id
			})
			this.success("Article successfully deleted")
		} catch (err) {
			this.error("Delete Article Failed")
		}
	}

}
module.exports = ArticleController;
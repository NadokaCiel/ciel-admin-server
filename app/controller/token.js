const createRule = {
	user_name: {
		type: 'string',
		required: true
	},
	password: {
		type: 'password',
		required: true,
		allowEmpty: false,
		min: 4
	},
}

const Controller = require('../core/api_controller')
class TokenController extends Controller {

	async create() {
		try {
			this.ctx.validate(createRule)

			const name = this.ctx.request.body.user_name
			const user = await this.ctx.model.User.findOne({
				user_name: name
			})
			if (!user) {
				return this.error("User doesn't exsit")
			}
			if (user.password != this.encryption(this.ctx.request.body.password)) {
				return this.error("Wrong password")
			}

			const now = Date.now() + ''
			const token = this.encryption(name + now)
			const auth = this.encryption(name)

			console.log('auth', auth);
			console.log('this.app.redis', JSON.stringify(this.app));

			await this.app.redis.set(token, user.id, 'EX', 7 * 24 * 60 * 60 * 1000)
			this.ctx.cookies.set('token', token, {
				maxAge: 7 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				secure: false,
				// domain: this.ctx.get('Origin')
			})
			this.ctx.cookies.set('auth', auth, {
				maxAge: 7 * 24 * 60 * 60 * 1000,
				httpOnly: false,
				secure: false,
				// domain: this.ctx.get('Origin')
			})
			// this.ctx.set('Access-Control-Allow-Origin', this.ctx.get('Origin'));
			// this.ctx.set('Access-Control-Allow-Credentials', true);
			// this.ctx.set('Access-Control-Allow-Headers', 'Content-Type, Set-Cookie, *');
			// this.ctx.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS');
			return this.success("Login successfully.")
		} catch (err) {
			console.log(err);
			this.error("Login Failed.")
		}
	}

	async destroy() {
		const token = this.ctx.cookies.get('token')
		if (!token) {
			return this.success(res, "Logout successfully.")
		}
		try {
			await this.app.redis.del(token)
			this.ctx.cookies.delete('token')
			return this.success("Logout successfully.")
		} catch (err) {
			return this.error("Logout Failed.")
		}
	}

}
module.exports = TokenController;
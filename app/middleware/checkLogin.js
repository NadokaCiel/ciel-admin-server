module.exports = () => {
	return async(ctx, next) => {

		const token = ctx.cookies.get('token')
		if (!token) {
			ctx.body = {
				retcode: 40000,
				status: 'unauthorized',
				msg: 'Please login before your further operation.'
			}
			return
		}
		const redis_token = await ctx.app.redis.get(token)
		if (!redis_token) {
			ctx.body = {
				retcode: 40000,
				status: 'unauthorized',
				msg: 'Please login before your further operation.'
			}
			return
		} else {
			await next()
		}
	}
}

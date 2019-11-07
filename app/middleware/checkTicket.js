module.exports = () => {
	return async(ctx, next) => {

		let ticket;
		if (ctx.request.method === 'GET') {
			ticket = ctx.request.query.ticket;
		} else {
			ticket = ctx.request.body.ticket;
		}
		if (!ticket) {
			ctx.body = {
				retcode: 41000,
				status: 'unauthorized',
				msg: 'Please login before your further operation.'
			}
			return
		}
		const redis_ticket = await ctx.app.redis.get(ticket)
		if (!redis_ticket) {
			ctx.body = {
				retcode: 41000,
				status: 'unauthorized',
				msg: 'Please login before your further operation.'
			}
			return
		} else {
			await next()
		}
	}
}

import { defaultSign } from 'mksign';

module.exports = (option, app) => {
	return async(ctx, next) => {

		let data;
		if (ctx.request.method === 'GET') {
			data = ctx.request.query;
		} else {
			data = ctx.request.body;
		}

		// console.log('ctx.request', ctx.request);
		// console.log('app.config.apiCode', app.config.apiCode);
		if (Object.keys(data).length > 0) {

			const sign = data.sign;
			const signData = {};
			Object.keys(data).forEach((item) => {
				if (item !== 'sign') {
					signData[item] = data[item];
				}
			});

			const checkSign = defaultSign(signData, [app.config.apiCode]);
			// console.log('signData', signData);
			// console.log('checkSign', checkSign);

			if(!data.sign || checkSign !== sign) {
				ctx.body = {
					retcode: 40003,
					status: 'signature error',
					msg: 'invalid signature.'
				};
				return;
			} else {
				await next();
			}
		}else {
			await next();
		}
	}
}

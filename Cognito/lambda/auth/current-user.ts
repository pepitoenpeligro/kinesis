import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CookieMap, parseAuthorization, parseCookies, verifyToken } from '../utils';

exports.handler = async function (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	console.log('[CurrentUser-event]', event);

	console.log("[current-userparseCookie HEaders]")
	console.log(event.headers)

	// const cookies: CookieMap = parseCookies(event);
	// const authToken: string = parseAuthorization(event);
	// console.log(authToken);
	// console.log("el token");
	// console.log(authToken);
	// const token = event?.headers["Authorization"];

	const token = event?.headers.Authorization;
	console.log("El token ess: ");
	console.log(token);

	// if (!cookies) {
	// 	return {
	// 		statusCode: 200,
	// 		body: JSON.stringify({
	// 			sub: null,
	// 			email: null,
	// 		}),
	// 	};
	// }

	if (!token) {
		return {
			statusCode: 200,
			body: JSON.stringify({
				sub: null,
				email: null,
			}),
		};
	}

	// const verifiedJwt = await verifyToken(cookies.token, process.env.USER_POOL_ID!);
	const verifiedJwt = await verifyToken(token, process.env.USER_POOL_ID!);
	const sub = verifiedJwt ? verifiedJwt.sub : null;
	const email = verifiedJwt ? verifiedJwt.email : null;

	return {
		statusCode: 200,
		body: JSON.stringify({ sub, email }),
	};
};

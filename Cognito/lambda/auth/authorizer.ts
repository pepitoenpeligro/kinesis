import { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { CookieMap, createPolicy, parseCookies, verifyToken, parseAuthorization } from '../utils';

exports.handler = async (event: APIGatewayRequestAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
	console.log('[EVENT]', event);

	console.log("[parseCookie]")
	console.log(event.headers)

	const cookies: CookieMap = parseCookies(event);

	// const authToken: string = parseAuthorization(event);
	// console.log("el token");
	// console.log(authToken);
	// const token = event?.headers["Authorization"];



	if (!cookies) {
		return {
			principalId: '',
			policyDocument: createPolicy(event, 'Deny'),
		};
	}

	const verifiedJwtCookie = await verifyToken(cookies.token, process.env.USER_POOL_ID!);
	// const verifiedJwtJWT = await verifyToken(authToken, process.env.USER_POOL_ID!);

	return {
		principalId: verifiedJwtCookie ? verifiedJwtCookie.sub!.toString() : '',
		policyDocument: createPolicy(event, verifiedJwtCookie ? 'Allow' : 'Deny'),
	};
	// return {
	// 	principalId: verifiedJwtJWT ? verifiedJwtJWT.sub!.toString() : '',
	// 	policyDocument: createPolicy(event, verifiedJwtJWT ? 'Allow' : 'Deny'),
	// };
};

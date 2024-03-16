import { json, text } from '@sveltejs/kit';
import { createUser, checkUserExists, checkSiteExists } from '../../stores'
export async function POST({ request }) {
	const { type, user, pass, site } = await request.json(); 
	if ( type == null || user == null || pass == null || site == null ) return json({"error":"Authentication Type or Required Field is Missing."}); // reject request if type is missing
	if (type !== 1) {
		if (await checkUserExists(user)) {
			return json({"error":"User Already Exists."})
		} else if (await checkSiteExists(site)) {
			return json({"error":"Site Already Exists."}) // check if either user or site exists. no duplicates.
		} else {
			let UserCreate = await createUser(user,pass,site)
			console.log(UserCreate)
			return json(UserCreate)
		}
	}
	return json({
		type,
		user,
		pass,
		site
	});
}

// This handler will respond to PUT, PATCH, DELETE, etc./** @type {import('./$types').RequestHandler} */

export async function fallback({ request }) {
	return text(`I caught your ${request.method} request!`);
}
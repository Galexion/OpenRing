import { json, text } from '@sveltejs/kit';
import { createUser, authenticateUser, checkUserExists, checkSiteExists } from '../../stores'
export async function POST({ request }) {
	const { type, user, pass, site } = await request.json(); 
	if ( type == null || user == null || pass == null ) return json({"error":"Authentication Type or Required Field is Missing."}); // reject request if type is missing
	if (type !== 1) {
		if (site == null) return json({"error":"Website Field is NULL."})
		if (await checkUserExists(user)) {
			return json({"error":"User Already Exists."})
		} else if (await checkSiteExists(site)) {
			return json({"error":"Site Already Exists."}) // check if either user or site exists. no duplicates.
		} else {
			let UserCreate = await createUser(user,pass,site)
			return json(UserCreate)
		}
	} else {
		if (!await checkUserExists(user)) {
			return json({"error":"User Does Not Exist."})
		} else {
			let authenticated = await authenticateUser(user,pass)
			if(authenticated) {
				return json({"status":authenticated})
			} else {
				return json({"error":"Password is incorrect."})
			}
		}
	}
}

// This handler will respond to PUT, PATCH, DELETE, etc./** @type {import('./$types').RequestHandler} */

export async function fallback({ request }) {
	return text(`I caught your ${request.method} request!`);
}
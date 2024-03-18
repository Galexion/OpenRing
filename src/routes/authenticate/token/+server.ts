import { json, text } from '@sveltejs/kit';
import { verifyToken } from '../../../stores'

export async function POST({ request }) {
	const { token,webring_id } = await request.json(); 
    if(await verifyToken(token,webring_id)) {
        return json({"status":true})
    } else {
        return json({"status":false})
    }
}
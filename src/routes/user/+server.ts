import { json, text } from '@sveltejs/kit';
import { verifyToken,updateWebringData } from '../../stores'

export async function POST({ request }) {
	const { token,webring_id,profile_picture,site_button } = await request.json(); 
    if(await verifyToken(token,webring_id)) {

        let statusUpdate = await updateWebringData(site_button,profile_picture,webring_id)
        return json({"status":statusUpdate})
    } else {
        return json({"error":"Authentication Failed."})
    }
}
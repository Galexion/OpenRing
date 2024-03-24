import { json, text, redirect } from '@sveltejs/kit';
import { previousWebsite } from '$lib/stores'


export async function GET({params}) {
    let webring_id:any = params.webring_id
    const webringData = await previousWebsite(webring_id); // Ensure this await is here
    if(webringData) {
        redirect(307,webringData.website)
        //return json(webringData);
    } else {
        return json({"error":"No placement found."});
    }
}
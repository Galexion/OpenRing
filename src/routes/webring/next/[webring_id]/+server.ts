import { json, text, redirect } from '@sveltejs/kit';
import { nextWebsite } from '$lib/stores'


export async function GET({params}) {
    let webring_id:any = params.webring_id
    const webringData:any = await nextWebsite(webring_id); // Ensure this await is here
    if(webringData) {
        redirect(307,webringData.website)
    } else {
        return json({"error":"No placement found."});
    }
}
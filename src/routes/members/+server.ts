import { json } from '@sveltejs/kit';
import { getWebringData } from '$lib/stores';

export async function GET() {
    const webringData = await getWebringData(); // Ensure this await is here
    return json(webringData);
}
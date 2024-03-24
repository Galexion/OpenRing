// +page.server.js
import { getWebringData } from '$lib/stores';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const data = await getWebringData();
  return { data };
}
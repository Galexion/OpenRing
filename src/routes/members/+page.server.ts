// +page.server.js
import { getWebringData } from '../../stores';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const data = await getWebringData();
  return { data };
}
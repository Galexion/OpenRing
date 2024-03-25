<!-- +page.svelte -->
<script lang="ts">
  interface data {
    data: webring[]
  }
	interface webring {
			username: string;
			website: string;
			buttonGif: string;
			profilePicture: string;
	}
	export let data:data;

	let webring:webring[] = data.data;

	// Use the data here
</script>

<h1 class="chivo-mono-header">&gt;&gt;&gt; Members</h1>

{#if webring}
	{#each webring as bead}
		<div class="flex">
			<span>
				<h2 style="">
					{#if (bead.website.toLowerCase().startsWith('https://'))}
					{bead.username} &gt; <i><b>{bead.website.slice(8, bead.website.length - 1)}</b></i>
					{:else if (bead.website.toLowerCase().startsWith('http://'))}
						{bead.username} &gt; <i><b>{bead.website.slice(7, bead.website.length - 1)}</b></i>
					{/if}
				</h2>
			</span>
			<span style="margin-left:1em;margin-top:-4px">
				<a href={bead.website}><picture>
					<source id="s1" srcset={bead.buttonGif} type="image/png">
					<img src="https://cdn.galexion.link/roboring/robonetstandbybutton.gif" alt="{bead.username}'s website" onerror="this.onerror=null;
					document.getElementById('s1').srcset=this.src;">
				</picture>
				</a>
			</span>
		</div>
		<hr style="width:75vw" />
	{/each}
	<h2>&gt; Data Stream END</h2>
{:else}
	<p class="chivo-mono-text">&lt;&lt;&lt; Waiting For Data...</p>
{/if}

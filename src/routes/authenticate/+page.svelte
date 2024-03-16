<script context="module" lang="ts">
	import { writable } from 'svelte/store';
	export const formSubmitted = writable(false);

	let formData = new FormData();
	let error: string = '';
	async function handleSubmit(event: any) {
		event.preventDefault();

		// Get form data
		formData.append('username', event.target.username.value);
		formData.append('password', event.target.password.value);
		formData.append('website', event.target.website.value);
		formData.append('action', event.target.action.value);

		// Send form data to server

		console.log(formData);

		const response = await fetch('/authenticate', {
			method: 'POST',
			body: `{"type":${event.target.action.value},"user":"${event.target.username.value}","pass":"${event.target.password.value}","site":"${event.target.website.value}"}`
		}).then((res) => res.json()).then((res) => {
		// Form submission successful, update UI
		formSubmitted.set(true);
		if (res.error) {
			console.log("triggering error")
			error = `&gt; Attention: ` + res.error;
		}
		// Redirect or perform other actions as needed


		});

	}
</script>

<p class="chivo-mono-sub">{@html error}</p>
<div class="flex" style="width:100%; padding-top:2vh">
	<div class="flex-item center">
		<h2 class="chivo-mono-sub">Sign-Up</h2>
		<p>Read the <a href="/rules">rules</a> before creating an account.</p>
		<form on:submit|preventDefault={handleSubmit} method="post" action="/authenticate">
			<input type="hidden" name="action" value="0" />
			<label for="username">username</label>
			<input type="text" id="username" name="username" />
			<label for="password">password</label>
			<input type="password" id="password" name="password" />
			<label for="website">your website</label>
			<input type="text" id="website" name="website" />
			<input type="hidden" name="ANTI-AUTOMATION-FIELD" value="" />
			<input type="submit" value="Register" />
		</form>
	</div>
	<div class="flex-item">
		<h2 class="chivo-mono-sub">Sign-In</h2>
		<form on:submit|preventDefault={handleSubmit} method="post" action="/authenticate">
			<input type="hidden" name="action" value="1" />
			<label for="username">username</label>
			<input type="text" id="username" name="username" />
			<label for="password">password</label>
			<input type="password" id="password" name="password" />
			<input type="hidden" name="ANTI-AUTOMATION-FIELD" value="" />
			<input type="submit" value="Autenticate" />
		</form>
	</div>
</div>

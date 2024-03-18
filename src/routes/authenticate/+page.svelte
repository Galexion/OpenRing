<script context="module" lang="ts">
	import { writable } from 'svelte/store';
	export const formSubmitted = writable(false);

	let formData = new FormData();
	let error: string = '';
	async function handleSubmit(event: any) {
		event.preventDefault();

		// Send form data to server

		console.log({
			type: event.target.action.value,
			user: event.target.username.value,
			passLength: event.target.password.value.length,
			site: event.target.website?.value || null
		});
		let reqBody;
		if (event.target.action.value == 1) {
			reqBody = `{"type":${event.target.action.value},"user":"${event.target.username.value}","pass":"${event.target.password.value}"}`;
		} else {
			reqBody = `{"type":${event.target.action.value},"user":"${event.target.username.value}","pass":"${event.target.password.value}","site":"${event.target.website.value}"}`;
		}

		const response = await fetch('/authenticate', {
			method: 'POST',
			body: reqBody
		})
			.then((res) => res.json())
			.then((res) => {
				// Form submission successful, update UI
				formSubmitted.set(true);
				if (res.error) {
					console.log('triggering error');
					error = `> Attention: ` + res.error;
					const node = document.getElementById('error-box');
					const existingError = document.getElementById('error-msg');

					if (!existingError) {
						const blockquote = document.createElement('blockquote');
						const para = document.createElement('p');

						para.textContent = error;
						para.classList.add('chivo-mono-sub');
						para.id = 'error-msg';
						blockquote.id = 'error-bq';

						blockquote?.append(para);
						node?.append(blockquote);
					} else {
						existingError.textContent = error;
					}
				}
				const currentDate = new Date();
				const expiryDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
				console.log(`Response:`+ JSON.stringify(res))
				document.cookie = `token=${res.token}; expires=${expiryDate.toUTCString()}; SameSite=Strict `;
				document.cookie = `webring_id=${res.webring_id}; expires=${expiryDate.toUTCString()}; SameSite=Strict `;
				// Redirect or perform other actions as needed
				
			});
	}
</script>

<div id="error-box"></div>
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

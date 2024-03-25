<script lang="ts">
	import { onMount } from 'svelte';
	let siteButton: string;
	let profileImage: string;
	let webring_id: any;
	let token: any;
	let widgetvalue: string;
	function getCookie(cname: string) {
		let name = cname + '=';
		let ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return '';
	}

	onMount(async () => {
		webring_id = getCookie('webring_id');
		token = getCookie('token');
		widgetvalue = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" /><style>* {margin: 0;padding: 0;}.roboRingTransport {width:150px;height:50px;background: url("https://cdn.galexion.link/roboring/RoboNetTransport.gif");margin:0px;}a {color:gray;text-decoration: none;}@font-face {font-family: 'Material Symbols Outlined';font-style: normal;font-weight: 100 700;src: url(https://fonts.gstatic.com/s/materialsymbolsoutlined/v170/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsI.woff2) format('woff2');}.material-symbols-outlinedaa {text-align: center;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;font-size: 50px;width:30px;height:30px;margin-top:-8px;font-family: 'Material Symbols Outlined';font-weight: normal;font-style: normal;line-height: 1;letter-spacing: normal;text-transform: none;display: inline-block;white-space: nowrap;word-wrap: normal;direction: ltr;-moz-font-feature-settings: 'liga';-moz-osx-font-smoothing: grayscale;}</style><div class="roboRingTransport"><div style="height:18px;width:150px;"><a style="display: block;height: 100%;width: 100%;" href="https://roboring.galexion.link"></a></div><div><a href="https://roboring.galexion.link/webring/previous/${webring_id}"><span class="material-symbols-outlinedaa">skip_previous</span></a><a href="https://roboring.galexion.link/webring/next/${webring_id}" style="padding-left: 65px;"><span class="material-symbols-outlinedaa">skip_next</span></a></div></div>`;

		if (webring_id && token) {
		} else {
			window.location = '/';
		}

		const options = { method: 'GET' };

		let webring: any;

		await fetch('/members', options)
			.then((response) => response.json())
			.then((response) => {
				webring = response.find((element: any) => element.webring_id == webring_id);
			})
			.catch((err) => console.error(err));

		siteButton = webring.buttonGif;
		profileImage = webring.profilePicture;
	});
	function saveDetails() {
		const options = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: `{"token":"${token}","webring_id":${webring_id},"profile_picture":"${profileImage}","site_button":"${siteButton}"}`
		};

		fetch('/user', options)
			.then((response) => response.json())
			.then((response) => {
				window.location.replace('/user');
			})
			.catch((err) => console.error(err));
	}
</script>

<h1 class="chivo-mono-header">
	&gt; <span class="material-symbols-outlined material-icons" style="font-size:1em;">
		edit_note
	</span>Edit Profile
</h1>

<div>
	<div style="display:flex">
		<span style="padding-right:2em;">
			<h3 class="chivo-mono-sub">Site Button</h3>
			<input bind:value={siteButton} />
		</span>
		<span>
			<h3 class="chivo-mono-sub">Preview</h3>
			<img src={siteButton} height="50px" alt="Button Preview" />
		</span>
	</div>
	<br />
	<div style="display:flex">
		<span style="padding-right:2em;">
			<h3 class="chivo-mono-sub">Profile Image</h3>
			<input bind:value={profileImage} />
		</span>
		<span>
			<h3 class="chivo-mono-sub">Preview</h3>
			<img src={profileImage} width="100px" height="100px" alt="Profile Preview" />
		</span>
	</div>
	<br />
	<input type="submit" value="Save" on:click={saveDetails} />
</div>

<h1 class="chivo-mono-header">
	&gt; <span class="material-symbols-outlined" style="margin-left:-3px;padding-right:5px;">
		widgets
	</span>Site Widgets
</h1>
<div>
	<div style="display:flex">
		<span style="padding-right:2em;">
			<h3 class="chivo-mono-sub">Compact</h3>
			<input value="{widgetvalue}" />
		</span>
		<span>
			<div>{@html widgetvalue}</div>
		</span>
	</div>
</div>

<style>
	input {
		background-color: black !important;
	}
</style>

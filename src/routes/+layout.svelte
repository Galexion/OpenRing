<script lang="ts">
	import Navbar from './navbar.svelte';
</script>

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>RoboNet</title>
	<link rel="stylesheet" href="/style.css" />

	<style>
		:root {
			--text: #ffffff;
			--background: #000000;
			--primary: #040060;
			--secondary: #dedcff;
			--accent: #444093;
		}

		body {
			background-color: var(--background);
			color: var(--text);

			font-family: 'Chivo Mono', monospace;
			font-optical-sizing: auto;
			font-weight: 400;
			font-style: normal;
		}

		.chivo-mono-header {
			font-family: 'Chivo Mono', monospace;
			font-optical-sizing: auto;
			font-weight: 900;
			font-style: normal;
		}

		.chivo-mono-sub {
			font-family: 'Chivo Mono', monospace;
			font-optical-sizing: auto;
			font-weight: 600;
			font-style: normal;
		}

		.chivo-mono-text {
			font-family: 'Chivo Mono', monospace;
			font-optical-sizing: auto;
			font-weight: 400;
			font-style: normal;
		}

		.nav-right-align {
			justify-content: flex-end;
			margin-top: 0.2em;
		}
		.nav-right-align a {
			font-family: 'Chivo Mono', monospace;
			font-optical-sizing: auto;
			font-weight: 600 !important;
			font-style: normal !important;
			font-size: 20px !important;
			color: white;
			transition: all 0.25s;
		}

		#logo-nav a {
			color: white;
			transition: all 0.25s;
		}

		#logo-nav a:hover,
		.nav-right-align a:hover {
			color: orange;
			transition: all 0.25s;
		}

        .material-symbols-outlined {
          font-variation-settings:
          'FILL' 0,
          'wght' 300,
          'GRAD' 0,
          'opsz' 24
        }
		.material-icons {
			display: inline-flex;
			vertical-align: bottom;
		}
		.flex-item {
			flex: 1;
		}
		.flex {
			display: flex;
		}
		.center {
			justify-content: center;
		}
		input[type='text'],
		input[type='password'],
		input[type='submit'],
		textarea {
			background-color: var(--background);
		}
	</style>
    
</head>
<body>
	<Navbar />
	<hr style="margin-top:-1em;width:90vw" />
	<slot />
</body>

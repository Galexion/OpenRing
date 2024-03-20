<script lang="ts">
    export let navType:number = 0

    function removeCookies() {
        // Set the expiration date to a date in the past
        const expirationDate = new Date(0).toUTCString();

        // Set the token cookie to expire
        document.cookie = `token=; expires=${expirationDate}`;

        // Set the webring_id cookie to expire
        document.cookie = `webring_id=; expires=${expirationDate}`;
        
			window.location = '/';
    }
</script>
<style>
    .material-symbols-outlined {
      font-variation-settings:
      'FILL' 0,
      'wght' 600,
      'GRAD' 0,
      'opsz' 24
    }
    </style>
<nav>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" /> 
    <span id="logo-nav">
        <h1 class="chivo-mono-header">RoboNet</h1>
        <h4 class="chivo-mono-sub" style="margin-top:-1.25em">
            Powered by <a href="https://galexion.link">GXNetworks</a>
        </h4>
    </span>
    <span class="nav-right-align">
        <p>
            <a href="/">Home</a>
            /
            <a href="/members">Members</a>
            /
            {#if navType == 1}
            <a href="/user/">Profile</a>
            /
            <a href="/" on:click={removeCookies}><span class="material-symbols-outlined material-icons" style="margin-bottom:2px;">
                logout
                </span></a>
            {:else}
            <a href="/authenticate">Authenticate</a>
            {/if}
        </p>
    </span>
</nav>
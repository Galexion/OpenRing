<script lang="ts">
    let siteButton:string;
    let profileImage:string;

    function saveDetails() {
        
    }
</script>
<style>
    input {
        background-color: black;
    }
</style>
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
    <br>
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
    <br>
<button on:click={saveDetails}>
Save
    </button>
</div>

<h1 class="chivo-mono-header">
	&gt; <span class="material-symbols-outlined" style="margin-left:-3px;padding-right:5px;">
        widgets
        </span>Site Widgets
</h1>
<div>
    <div style="display:flex">
        <span style="padding-right:2em;">
    <h3 class="chivo-mono-sub">Site Widgets</h3>
        </span>
        <span>
    <h3 class="chivo-mono-sub">Coming Soon</h3>
        </span>
    </div>
</div>
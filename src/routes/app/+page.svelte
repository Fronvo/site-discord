<script lang="ts">
    import { indexVisible } from 'stores/index';
    import { onMount } from 'svelte';
    import { getKey } from 'utilities/global';
    import { cachedAccountData, currentToken, showLayout } from 'stores/main';
    import { redirectApp } from 'utilities/index';
    import { performLogin } from 'utilities/main';
    import BlurredBackground2 from '$lib/index/BlurredBackground2.svelte';
    import AppRegisterMain from '$lib/app/index/AppRegisterMain.svelte';

    let mountReady = false;

    onMount(async () => {
        // Remove homepage for registered users
        if (getKey('token')) {
            const val = window.navigator.userAgent.toLowerCase();

            // Block access to mobile, get the app
            if (!(val.includes('android') || val.includes('iphone'))) {
                redirectApp();

                $currentToken = getKey('token');

                await performLogin(getKey('token'), $cachedAccountData);
                return;
            }
        }

        // Disable __layout in index
        $showLayout = false;

        // Default when accessed
        $indexVisible = true;

        // Show the index page
        mountReady = true;
    });
</script>

{#if mountReady && $indexVisible}
    <div class="index-container">
        {#if $indexVisible}
            <AppRegisterMain />

            <BlurredBackground2 />
        {/if}
    </div>
{/if}

<style>
    .index-container {
        width: 100%;
        height: 100vh;
    }
</style>

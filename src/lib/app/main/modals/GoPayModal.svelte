<script lang="ts">
    import { onMount } from 'svelte';
    import { loadStripe } from '@stripe/stripe-js';
    import { Elements, PaymentElement } from 'svelte-stripe';
    import type { ModalData } from 'stores/modals';
    import { dismissModal } from 'utilities/main';
    import { cachedAccountData, currentToken, darkTheme } from 'stores/main';
    import { loadProfile } from 'utilities/profile';
    import { loadThemes } from 'utilities/themes';
    import ModalTemplate from '../ModalTemplate.svelte';

    let stripe = null;
    let clientSecret = null;
    let elements: any;
    let processing = false;

    onMount(async () => {
        stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC);

        clientSecret = await createPaymentIntent();
    });

    async function createPaymentIntent() {
        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({}),
        });
        const { clientSecret } = await response.json();

        return clientSecret;
    }

    async function submit() {
        if (processing) return;

        processing = true;

        const result = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        // Payment Status
        if (result.error) {
            processing = false;
        } else {
            await fetch('/api/apply-pro', {
                method: 'POST',
                body: JSON.stringify({
                    token: $currentToken,
                    ch: result.paymentIntent.id,
                }),
            });

            await loadProfile($cachedAccountData);
            await loadThemes();

            dismissModal();
        }
    }

    const data: ModalData = {
        title: 'Join PRO for 5€',

        actions: [
            {
                title: !processing ? 'Pay' : 'Processing',
                callback: submit,
                primary: true,
            },
            {
                title: 'Cancel',
                callback: processing ? () => {} : dismissModal,
            },
        ],
    };
</script>

<ModalTemplate {data}>
    {#if stripe && clientSecret}
        <Elements
            {stripe}
            {clientSecret}
            labels="floating"
            theme={'night'}
            bind:elements
            variables={{
                colorPrimary: 'rgb(0, 220, 220)',
                colorBackground: $darkTheme
                    ? 'rgb(30, 30, 30)'
                    : 'rgb(250, 250, 250)',
            }}
            rules={{
                '.Input': {
                    border: $darkTheme ? 'rgb(30, 30, 30)' : 'rgb(20, 20, 20)',
                },
            }}
        >
            <form on:submit|preventDefault={submit}>
                <PaymentElement />
            </form>
        </Elements>
    {/if}
</ModalTemplate>

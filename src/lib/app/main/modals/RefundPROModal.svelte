<script lang="ts">
    import { dismissModal } from 'utilities/main';
    import ModalTemplate from '../ModalTemplate.svelte';
    import InfoHeader from '$lib/app/reusables/all/InfoHeader.svelte';
    import { cachedAccountData, currentToken } from 'stores/main';
    import type { ModalData } from 'stores/modals';
    import { loadProfile } from 'utilities/profile';
    import { themes } from 'stores/themes';
    import { resetLocalTheme } from 'utilities/themes';

    async function refundPRO(): Promise<void> {
        await fetch('/api/refund-pro', {
            method: 'POST',
            body: JSON.stringify({
                token: $currentToken,
            }),
        });

        await loadProfile($cachedAccountData);
        $themes = [];
        resetLocalTheme();

        dismissModal();
    }

    const data: ModalData = {
        title: 'Refund your subscription',
        actions: [
            { title: 'Refund PRO', callback: refundPRO, danger: true },
            {
                title: 'Cancel',
                callback: dismissModal,
            },
        ],
    };
</script>

<ModalTemplate {data}>
    <h1 class="modal-header">
        You will lose access to all of the PRO features.
    </h1>

    <InfoHeader
        marginLeft={'30px'}
        text={'You can subscribe again in the future'}
    />
</ModalTemplate>

<style>
    h1 {
        font-size: 1.2rem;
        width: 82%;
        text-align: start;
    }
</style>

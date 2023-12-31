<script lang="ts">
    import { dismissModal, showModal } from 'utilities/main';
    import ModalTemplate from '../ModalTemplate.svelte';
    import { ModalTypes, type ModalData, modalLoading } from 'stores/modals';
    import { socket } from 'stores/main';
    import InfoHeader from '$lib/app/reusables/all/InfoHeader.svelte';
    import { onMount } from 'svelte';
    import ErrorHeader from '$lib/app/reusables/all/ErrorHeader.svelte';

    let element: HTMLInputElement;

    let errorMessage: string;
    let profileId: string;

    function addFriend(): void {
        if (!profileId || $modalLoading) return;

        if (profileId.trim().length == 0) {
            return;
        }

        // Custom errors to prettify
        if (profileId.length < 5) {
            errorMessage = 'Must be atleast 5 characters.';
            return;
        }

        $modalLoading = true;

        socket.emit(
            'addFriend',
            { profileId: profileId ? profileId : '' },
            ({ err }) => {
                if (err) {
                    // Prettify
                    if (err.name == 'INVALID_REGEX') {
                        errorMessage =
                            'Identifier contains invalid characters.';
                    } else if (err.name == 'OVER_FRIENDS_LIMIT') {
                        showModal(ModalTypes.MaxFriends);
                    } else {
                        errorMessage = err.msg;

                        $modalLoading = false;
                    }
                } else {
                    dismissModal();
                }
            }
        );
    }

    onMount(() => {
        element.focus();

        element.onkeyup = (ev) => {
            if (ev.key == 'Enter') {
                addFriend();
            }
        };
    });

    const data: ModalData = {
        title: 'Add a friend',
        actions: [
            {
                title: 'Send request',
                callback: addFriend,
                primary: true,
            },

            {
                title: 'Cancel',
                callback: dismissModal,
            },
        ],
    };
</script>

<ModalTemplate {data}>
    <ErrorHeader size={'1.2rem'} {errorMessage} />

    <div class="friend-container">
        <h1 class="modal-header">@</h1>
        <input
            bind:this={element}
            class="modal-input"
            bind:value={profileId}
            maxlength={20}
        />
    </div>

    <InfoHeader
        marginLeft={'50px'}
        text={'The other user will have to accept you in order to chat'}
    />
</ModalTemplate>

<style>
    .friend-container {
        display: flex;
        align-items: center;
    }

    h1 {
        font-size: 1.7rem;
        height: 50px;
    }

    input {
        font-weight: 600;
        border: 2px solid transparent;
        transition: 150ms;
    }

    input:focus {
        border: 2px solid var(--branding);
    }
</style>

import type {
    FronvoAccount,
    RoomMessage,
    Room,
    Server,
    Channel,
} from 'interfaces/all';
import { writable, type Writable } from 'svelte/store';

/****************************** Room ******************************/
export const dmsList: Writable<Room[]> = writable([]);
export const dmsFilter: Writable<string> = writable('');

export const roomsList: Writable<Room[]> = writable([]);

export const serversList: Writable<Server[]> = writable([]);
export const isInServer: Writable<boolean> = writable(false);
export const currentServerId: Writable<string> = writable();
export const currentServerName: Writable<string> = writable();
export const currentServerChannels: Writable<Channel[]> = writable([]);
export const channelFilter: Writable<string> = writable('');

export const currentRoomId: Writable<string> = writable();
export const currentRoomData: Writable<Partial<Room>> = writable();
export const currentRoomMessages: Writable<
    {
        message: RoomMessage;
        profileData: FronvoAccount;
    }[]
> = writable([]);
export const currentRoomLoaded = writable(false);
/****************************** Room ******************************/

/****************************** Message ******************************/
export const sendContent: Writable<string> = writable('');
export const sendingImage: Writable<boolean> = writable(false);
/****************************** Message ******************************/

/****************************** Reply ******************************/
export const replyingTo: Writable<string> = writable();
export const replyingToId: Writable<string> = writable();
/****************************** Reply ******************************/

/****************************** RoomScrollBottom ******************************/
export const showScrollBottom: Writable<boolean> = writable();
/****************************** RoomScrollBottom ******************************/

/****************************** FollowInfoModal ******************************/
export const targetMessageDropdown: Writable<RoomMessage> = writable();
/****************************** FollowInfoModal ******************************/

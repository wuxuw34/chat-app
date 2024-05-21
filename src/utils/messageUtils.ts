import {MessageBodyType} from "@/type/message";
import userInfoStore from "@/stores/userInfoStore.ts";
import useFriendsStore from "@/stores/friendsStore.ts";


export function setMessageContent(
    body:MessageBodyType,
    receiver?:string
){
    const friendsStore = useFriendsStore()

    return {
        body:body,
        time:new Date().getTime(),
        sender_id:userInfoStore().info.id,
        receiver_id:receiver || friendsStore.selectedFriend,
        isGroup:friendsStore.isGroup(receiver || friendsStore.selectedFriend)
    }
}
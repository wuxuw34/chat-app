import {defineStore} from "pinia";
import {onMounted, ref} from "vue";
import {FriendType} from "@/type/user";
import {useStorage} from "@/hooks/useStorage.ts";
import {useMessageStore} from "@/stores/messageStore.ts";
import {MessageType} from "@/type/message";
import useUserInfoStore from "@/stores/userInfoStore.ts";

const useFriendsStore = defineStore('friends', () => {
    const friendsList = ref<Map<string, FriendType>|null>() // 好友列表
    const selectedFriend = ref<string>('')
    const storage = useStorage('friends')
    const messageStore = useMessageStore()
    const userinfo = useUserInfoStore()

    onMounted(()=>{
        messageStore.onMessageUpdate((id:string,message:MessageType)=>{
            const friend = friendsList.value?.get(id)
            if(friend) friend.lastMessage = message
        })
    })

    // 初始化好友列表
    const initFriendsList = (friends: FriendType[]) => {
        if(!friendsList.value){
            friendsList.value = new Map()
        }
        friends.forEach(friend => {
            friend.id = friend.id.toString()
            friendsList.value!.set(friend.id,friend)
        })
        storage.$map_set(friendsList.value)
    }

    function setLastMessage(id:string,message:MessageType){
        const friend = friendsList.value?.get(id)
        if(friend) friend.lastMessage = message
    }

    // 被点击的好友
    const updateSelectedFriend = (id:string)=>{
        selectedFriend.value = id
    }


    const getUsernameByGroup = (id:string)=>{
        const users = friendsList.value?.get(selectedFriend.value)?.users || []
        for(let i=0;i<users?.length;i++){
            if(users[i].id === id){
                return users[i]
            }
        }
        return null
    }

    function getUsernameById(id:string){
        if(id === userinfo.info.id){
            return userinfo.info.username
        }
        let username = friendsList.value?.get(id)?.username
        if(!username){
            username = getUsernameByGroup(id)?.username
        }
        return username
    }

    function isGroup(id:string){
        return friendsList.value?.get(id)?.isGroup
    }

    return {
        friendsList,selectedFriend, initFriendsList,updateSelectedFriend,getUsernameByGroup,isGroup,
        getUsernameById,setLastMessage
    }

})

export default useFriendsStore
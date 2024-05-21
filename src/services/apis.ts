import urls from "@/services/urls.ts";
import axiosIns from "@/services/request.ts";
import {useStorage} from "@/hooks/useStorage.ts";
import {setMessageContent} from "@/utils/messageUtils.ts";
import {MESSAGE_TYPE} from "@/enums";
import useFriendsStore from "@/stores/friendsStore.ts";

const tokenStorage = useStorage('token')
const getRequest = <T>(url:string,config?:any)=>{
    const _config = config?config:{}
    _config.token = tokenStorage.value

    return axiosIns.get<T>(url,{params:_config})
}
const postRequest = <T>(url:string,params?:any,config?:any)=>{

    params.token = tokenStorage.value

    return axiosIns.post<T>(url,params,config)
}
const postFormRequest = (url:string,params?:any)=>{
    return axiosIns.postForm(url,params)
}
export default {
    getFriendsList:() => getRequest(urls.getFriendsList),
    getMessageList:(params:any)=>getRequest(urls.message,params),
    login:(params:any)=>postRequest(urls.login,params),
    register:(params:any)=>postRequest(urls.register,params),
    sendMsg:(params:any)=>postRequest(urls.sendMsg,params),
    user:(params:any)=>getRequest(urls.user,params),
    friend:(params:any)=>postRequest(urls.friend,params),
    group:(params:any)=>postRequest(urls.group,params),
    upload:(params:any)=>postFormRequest(urls.upload,params),
    read:(params:any)=>getRequest(urls.message,params),
    call:(id:string)=>postRequest(urls.sendMsg,setMessageContent({
        type:MESSAGE_TYPE.CALL,
        data:{
            callInfo:{
                calleeId:id
            }
        }
    },id)),
    rejectCall:(id:string)=>postRequest(urls.sendMsg,setMessageContent({
        type:MESSAGE_TYPE.HANG_UP,
        data:{
            callInfo: {
                callerId:id
            }
        }
    },id)),
    hangup:(id:string)=>postRequest(urls.sendMsg,setMessageContent({
        type:MESSAGE_TYPE.HANG_UP,
        data:{
            callInfo: {
                callerId:id
            }
        }
    },id)),
    answer:(callerId:string,sdp:any)=>postRequest(urls.sendMsg,setMessageContent({
        type:MESSAGE_TYPE.HANG_UP,
        data:{
            callInfo: {
                callerId:callerId,
                sdp:sdp
            }
        }
    },callerId)),
    getHistoryMessage:(params:any)=>{
        params.type = 'history'
        const friendStore = useFriendsStore()
        params.friend_id = friendStore.selectedFriend
        return getRequest(urls.message,params)
    },
    notification:(params:any)=>getRequest(urls.notification,params),
    recall:(mid:string)=>{
      return  postRequest(urls.recall,{
          mid
      })
    }
}
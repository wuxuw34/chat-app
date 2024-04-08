import {defineStore} from "pinia";
import {ref} from "vue";
import {UserType} from "@/type/user";
import apis from "@/services/apis.ts";

const useUserInfoStore = defineStore('userInfo', ()=>{

    const info = ref<UserType>({
        id:'',
        username:'',
        avatar:''
    })

    function getUserInfo(){
        apis.user({
            getUserInfo:1
        }).then(r=>{
            const data = r.data as any
            if(data.state){
                info.value.id = data.data.id.toString()
                info.value.username = data.data.username
            }
        })
    }


    return {
        info,
        getUserInfo
    }

})


export default useUserInfoStore
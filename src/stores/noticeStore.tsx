import {defineComponent, h, ref} from "vue";
import {MessageType} from "@/type/message";
import {ElButton, ElNotification, ElText, ElProgress} from 'element-plus'
import styles from './styles/notice.module.scss'
import {MESSAGE_TYPE} from "@/enums";
import apis from "@/services/apis.ts";

const AddFriendNoticeItem = defineComponent({
    props: {
        username: String,
        confirm: Function,
        cancel: Function,
        id:Number
    },
    setup(props, _) {
        console.log(props)
        return () => <div class={styles['add-friend-notice-item']}>
            <div>
                <ElText class="mx-1" type="primary">{props.username}</ElText>
                <ElText class="mx-1">请求添加您为好友</ElText>
            </div>
            <div class='buttons' style={{
                marginTop: '6px'
            }}>
                <ElButton size="small" type='danger' onClick={() => {
                    props.cancel(props.id)
                }}>拒绝</ElButton>
                <ElButton size="small" type='primary' onClick={() => {
                    props.confirm(props.id)
                }}>接受</ElButton>
            </div>
        </div>
    },
    style: {}
})

const events = {
    [MESSAGE_TYPE.ADD_FRIEND]: {
        confirm: (id:number) => {
            apis.friend({
                type:'add_friend_confirm',
                data:{
                    result:1,
                    friend_id:id
                }
            })
        },
        cancel: (id:number) => {
            console.log('取消')
        }
    }
}

export function useNoticeStore() {

    const noticeList = ref<any[]>([])

    function addNotice(message: MessageType, temporary: boolean = false) {
        const type = message.body.type

        switch (type) {
            case MESSAGE_TYPE.ADD_FRIEND: {
                ElNotification.success({
                    title: '好友请求',
                    duration: 5000,
                    message: h(AddFriendNoticeItem, {
                        username: message.body.data.username,
                        id:message.senderId,
                        confirm: events[message.body.type]['confirm'],
                        cancel: events[message.body.type]['cancel']
                    })
                })
                break
            }
        }

    }

    return {
        noticeList,
        addNotice
    }

}
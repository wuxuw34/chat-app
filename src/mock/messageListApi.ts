import Mock, {Random} from 'mockjs'
import {MESSAGE_TYPE} from "@/enums";


Mock.mock(/\/api\/getMessageList/, 'get', () => {
    const data = []
    for (let i = 0; i < 100; i++) {
        data.push(Mock.mock({
            'id': '@increment()',
            'body': {
                type:MESSAGE_TYPE.TEXT,
                data:{
                    url:'',
                    content:'@cword(0,20)'
                }
            },
            'time':Random.now(),
            'senderId':Random.natural(10000,99999),
            'reciver':Random.natural(10000,99999)
        }))
    }
    return data
})


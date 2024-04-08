import Mock from 'mockjs'

Mock.mock(/\/api\/getFriendsList/, 'get', () => {
    const data = []
    for (let i = 0; i < 100; i++) {
        data.push(Mock.mock({
            'id': '@increment()',
            'name': '@cword(4,8)',
            'remark|0-3': '@cword(4,8)'
        }))
    }
    return data
})


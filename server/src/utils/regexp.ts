const email = /^[0-9a-zA-z-_]+@[0-9a-zA-z-_]+.[0-9a-zA-z-_]+/

export enum REGEXP_TYPE {
    EMAIL,
    PHONE,
    ACCOUNT
}

export function checkRegExp(type: REGEXP_TYPE, content: string) {
    switch (type) {
        case REGEXP_TYPE.EMAIL: {
            return email.test(content)
        }
    }
    return null
}
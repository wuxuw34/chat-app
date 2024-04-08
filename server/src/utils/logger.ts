import winston from "winston";

export const LOGGER_LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
}
function logger(){
    const logger = winston.createLogger({
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'combined.log' })
        ]
    })

    return {
        info:(message:string)=>{
            logger.log({
                level:'info',
                message
            })
        },
        error:(message:string)=>{
            logger.error({
                level:'error',
                message
            })
        }
    }
}

export default logger()
import fs from 'fs';
import winston from 'winston';

const fsPromise = fs.promises;  // promises will allow to create and write data into files or synchronously without callbacks

    /** Without Winston Library  */
// async function log(logData) {
//     try {
//         logData = `\n ${new Date().toString()} - ${logData}}`;
//         await fsPromise.appendFile("log.txt", logData);
//     } catch (error) {
//         console.log(error);
//     }
// }

    /** Using WINSTON library */
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'request-logging' },
    transports: [
        new winston.transports.File({ filename: 'log.txt' })
    ]
})

const loggerMiddleware = async (req, res, next) => {
    // 1. Log request body

    if(!req.url.includes('signin') || req.url.includes('signup')) {
        const logData = `${req.url} - ${JSON.stringify(req.body)}`
            /** Without Winston Library  */
        // await log(logData);
            /** Using WINSTON library */
        logger.info(logData);
    }

    next();
}

export default loggerMiddleware;
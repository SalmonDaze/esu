import dayjs from 'dayjs'

class Logger{
    warn(info) {
        console.warn(`[Esu Engine ${dayjs().format('HH:mm:ss')}] ${info}`)
    }
}

export const logger = new Logger()
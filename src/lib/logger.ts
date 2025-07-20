import { createConsola, LogLevels } from 'consola'
import { IS_DEV } from './const'

const logger = createConsola({
  level: IS_DEV ? LogLevels.debug : LogLevels.info,
  defaults: {
    tag: 'wiki-qa'
  }
})

// 扩展 logger 功能
export const chatLogger = logger.withTag('chat')
export const apiLogger = logger.withTag('api')
export const knowledgeLogger = logger.withTag('knowledge')
export const envLogger = logger.withTag('env')

// 便捷方法
export const logError = (context: string, error: any, details?: any) => {
  logger.error(`[${context}]`, error, details ? { details } : undefined)
}

export const logInfo = (context: string, message: string, data?: any) => {
  logger.info(`[${context}]`, message, data ? { data } : undefined)
}

export const logDebug = (context: string, message: string, data?: any) => {
  logger.debug(`[${context}]`, message, data ? { data } : undefined)
}

export const logWarn = (context: string, message: string, data?: any) => {
  logger.warn(`[${context}]`, message, data ? { data } : undefined)
}

export default logger

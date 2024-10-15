import logger from 'm-node-logger'
import AppError from './AppError'

interface IErrorHandled {
  status: number
  message: string
  data?: string
}

function handleError(err: Error): IErrorHandled {
  if (err instanceof AppError) {
    logger.error(`Status: ${err.statusCode}, message: ${err.message}`)

    return {
      status: err.statusCode,
      message: err.message,
    }
  }

  if (/prisma/g.test(err?.message)) {
    logger.error(`Status: ${400}, message: ${err.message}`)
    return {
      status: 400,
      message: 'Transaction Error',
      data: err.message,
    }
  }
  logger.error(`Status: ${500}, message: ${err.message}`)
  return {
    status: 500,
    message: 'Ocorreu algum erro no servidor, tente novamente mais tarde',
    data: err?.message,
  }
}

export default handleError

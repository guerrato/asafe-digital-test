import { isEmpty } from "./string"

export type HTTPResponse<T> = {
  success: boolean
  message?: string | null
  data?: T | null | undefined
  error?: string | null
}

export type ResponseContent<T> = Omit<HTTPResponse<T>, 'success'>

const httpResponse = <T>(response: ResponseContent<T>): HTTPResponse<T> => {
  const { data, error, message } = response
  let success = true

  if (isEmpty(data) && isEmpty(error) && isEmpty(message)) {
    return {
      success: false,
      message: 'data or error or message has to be filled in response',
    }
  }

  if (error && error !== null) {
    success = false
  }

  return {
    success: success ?? null,
    message: message ?? null,
    data: data ?? null,
    error: error ?? null,
  }
}

export default httpResponse
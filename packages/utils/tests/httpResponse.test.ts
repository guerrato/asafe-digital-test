import { HTTPResponse, ResponseContent, httpResponse } from '../src/httpResponse'

describe('httpResponse', () => {
  test('should return success: false and message when data, error, and message are all empty', () => {
    const response: ResponseContent<any> = {}
    const expected: HTTPResponse<any> = {
      success: false,
      error: 'data or error or message has to be filled in response',
      message: null,
      data: null,
    }
    expect(httpResponse(response)).toEqual(expected)
  })

  test('should return success: false when error is not null', () => {
    const response: ResponseContent<any> = {
      error: 'Something went wrong',
    }
    const expected: HTTPResponse<any> = {
      success: false,
      message: null,
      data: null,
      error: 'Something went wrong',
    }
    expect(httpResponse(response)).toEqual(expected)
  })

  test('should return success: true when error is null', () => {
    const response: ResponseContent<any> = {
      data: { id: 1, name: 'John Doe' },
    }
    const expected: HTTPResponse<any> = {
      success: true,
      message: null,
      data: { id: 1, name: 'John Doe' },
      error: null,
    }
    expect(httpResponse(response)).toEqual(expected)
  })

  test('should return error: message, error and data when message is null', () => {
    const response: ResponseContent<any> = {
      message: null,
    }
    const expected: HTTPResponse<any> = {
      success: false,
      error: 'data or error or message has to be filled in response',
      data: null,
      message: null,
    }
    expect(httpResponse(response)).toEqual(expected)
  })
})

import { RequestError } from '../errors/RequestError';
import { RequestTimeoutError } from '../errors/RequestTimeoutError';
import { ResponseParseError } from '../errors/ResponseParseError';

interface ErrorResponse {
  description?: string;
  name: string;
}

function isErrorResponse(payload: unknown): payload is ErrorResponse {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'name' in (payload as ErrorResponse)
  );
}

export const getErrorMessage = async (error: unknown) => {
  if (error instanceof RequestError) {
    let text;
    try {
      const parsed = await error.response.json();

      if (!isErrorResponse(parsed)) {
        return 'Error parsing server response';
      }

      return parsed.description ? parsed.description : `Error: ${parsed.name}`;
    } catch (parseError) {
      console.error(parseError);

      if (parseError instanceof Error) {
        text = `Error parsing server response: ${parseError.message}`;
      } else {
        text = 'Error parsing server response';
      }
    }
    return text;
  } else if (error instanceof RequestTimeoutError) {
    return 'Request Timeout Error, is your backend available?';
  } else if (error instanceof ResponseParseError) {
    return 'Server response is no valid JSON';
  } else if (error instanceof TypeError) {
    return 'Network Request Failed, is your backend available?';
  } else {
    return 'Failed: unknown, check JS Console';
  }
};

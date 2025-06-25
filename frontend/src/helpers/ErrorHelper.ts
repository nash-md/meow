import { RequestError } from '../errors/RequestError';
import { RequestTimeoutError } from '../errors/RequestTimeoutError';
import { ResponseParseError } from '../errors/ResponseParseError';
import { Translations } from '../Translations';
import { DEFAULT_LANGUAGE } from '../Constants';

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
        return Translations.ErrorParsingResponse[DEFAULT_LANGUAGE];
      }

      return parsed.description ? parsed.description : `Error: ${parsed.name}`;
    } catch (parseError) {
      console.error(parseError);

      if (parseError instanceof Error) {
        text = Translations.ErrorParsingResponseWithMessage[DEFAULT_LANGUAGE].replace('{0}', parseError.message);
      } else {
        text = Translations.ErrorParsingResponse[DEFAULT_LANGUAGE];
      }
    }
    return text;
  } else if (error instanceof RequestTimeoutError) {
    return Translations.RequestTimeoutErrorMessage[DEFAULT_LANGUAGE];
  } else if (error instanceof ResponseParseError) {
    return Translations.InvalidJsonResponse[DEFAULT_LANGUAGE];
  } else if (error instanceof TypeError) {
    return Translations.NetworkRequestFailed[DEFAULT_LANGUAGE];
  } else {
    return Translations.UnknownError[DEFAULT_LANGUAGE];
  }
};

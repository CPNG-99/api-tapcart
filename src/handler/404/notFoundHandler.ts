import { IHttpResponse, MessageStatus } from "../../utils/httpResponse";

export const notFoundHandler = ():IHttpResponse<null> => ({
    code: 404,
    message: MessageStatus.BadRequest,
    error: "",
    data: null
});
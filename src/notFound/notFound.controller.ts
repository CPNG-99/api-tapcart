import { IHttpResponse, MessageStatus } from "../utils/httpResponse";

class NotFoundController {
  notFound(): IHttpResponse<null> {
    return {
      code: 404,
      message: MessageStatus.BadRequest,
      error: "",
      data: null,
    };
  }
}

export default new NotFoundController();

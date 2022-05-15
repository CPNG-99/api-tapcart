import { HttpResponse, MessageStatus } from "../../utils/http.response";

class NotFoundController {
  notFound(): HttpResponse<null> {
    return {
      code: 404,
      message: MessageStatus.BadRequest,
      error: "",
      data: null,
    };
  }
}

export default new NotFoundController();

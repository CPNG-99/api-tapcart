import { HttpResponse, messageStatus } from "../../utils/http.response";

class NotFoundController {
  notFound(): HttpResponse<null> {
    return {
      code: 404,
      message: messageStatus[400],
      error: "",
      data: null,
    };
  }
}

export default new NotFoundController();

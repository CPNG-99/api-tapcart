export const messageStatus: { [key: number]: string } = {
  200: "Success",
  201: "Created",
  202: "Accepted",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
};
export interface HttpResponse<Type> {
  code: number;
  message: string;
  error: string;
  data: Type | null;
}

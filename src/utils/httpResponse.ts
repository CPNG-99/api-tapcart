export enum MessageStatus {
    Success = "Success",
    BadRequest = "Bad Request",
    Unauthorized = "Unauthorized",
    InternalServerError = "Internal Server Error"
}

export interface IHttpResponse<Type> {
    "code": number,
    "message": string,
    "error": string,
    "data": Type | null,
}
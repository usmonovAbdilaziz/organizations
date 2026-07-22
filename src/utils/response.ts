import {
    HttpException,
    HttpStatus,
    InternalServerErrorException,
} from "@nestjs/common";

export const successResponse = (
    data: any,
    message = "Success",
) => ({
    success: true,
    statusCode: HttpStatus.OK,
    message,
    data,
});

export const errorResponse = (error: any) => {
    // NestJS HttpException bo'lsa
      console.log(error);
    if (error instanceof HttpException) {
        throw new HttpException(
            {
                success: false,
                statusCode: error.getStatus(),
                message: error.message,
            },
            error.getStatus(),
        );
    }
    throw new InternalServerErrorException({
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
    });
};
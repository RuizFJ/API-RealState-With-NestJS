import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext) /*data es el argumento del decorador */ => {
    //ctx es el contexto de ejecucion de la peticion es decir los datos del usuario a traves del jwt que esta haciendo la peticion
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new InternalServerErrorException('User not found'); //lanza la excepcion si el guard que valida y extrae el payload del jwt no funciona o no está

    return !data ? user : user[data];
  },
);
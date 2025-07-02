import { IsString, Length, MinLength } from 'class-validator';

export class CreateAgentRequestDto {
  @IsString()
  @MinLength(3)
  fullName: string;

  @IsString()
  @Length(8, 20)
  identificacion_number: string;

  @IsString()
  @MinLength(8)
  phone: string;

  @IsString()
  @MinLength(5)
  address: string;

  //El userId no se envía desde el cliente (lo obtienes del JWT del usuario logueado).
  //El campo status tampoco, ya que internamente comienza como "pendiente".
}

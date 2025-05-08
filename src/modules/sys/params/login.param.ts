import { IsNotEmpty } from "class-validator";

export class LoginParam{
    @IsNotEmpty()
    userName?: string;
    @IsNotEmpty()
    password?: string;
}
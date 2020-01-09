import { CanActivate, Injectable, ExecutionContext, HttpException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { GqlExecutionContext } from "@nestjs/graphql";
import { jwtConstants } from "../auth/constants";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(readonly jwtService: JwtService/*, readonly userService: UsersService*/) { }
    canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().request;
        const Authorization = request.get('Authorization');

        if (Authorization) {
            const token = Authorization.replace('Bearer ', '');
            const { userId, firstName } = this.jwtService.verify(token)  as { userId: string; firstName: string } ;
            
            
            
            return !!userId;
            throw new UnauthorizedException();
        }
    }
}
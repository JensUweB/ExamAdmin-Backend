import { Field, ObjectType } from '@nestjs/graphql';
import { UserDto } from '../user/dto/user.dto';

/**
 * CoreAuthModel model for the response after the sign in
 */
@ObjectType({ description: 'Auth' })
export class AuthModel {
  // ===================================================================================================================
  // Properties
  // ===================================================================================================================
  @Field() token: string;
  @Field() tokenExpireDate: Date;
  @Field() user: UserDto;
}

import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { UseGuards } from '@nestjs/common';
import { User as CurrentUser } from '../decorators/user.decorator';
import { GraphqlAuthGuard } from '../guards/graphql-auth.guard';
import { UserInput } from './input/user.input';
import { Upload } from '../types/Upload';
import { normalizeFileUri } from '../helpers/file.helper';
import * as fs  from 'fs';
import { GraphQLUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { pathToFileURL } from 'url';
import { MaRanksInput } from './input/maRanks.input';

@UseGuards(GraphqlAuthGuard)
@Resolver('User')
export class UserResolver {

  constructor(private readonly userService: UserService) { }

  // ===========================================================================
  // Queries
  // ===========================================================================

  @Query(() => UserDto, { description: 'Returns an user object representing the current logged in user including avatar file' })
  async getUser(@CurrentUser() user: any) {
    try {
      return this.userService.findById(user.userId);
    } catch (error) { return error; }
  }

  // ===========================================================================
  // Mutations
  // ===========================================================================
  @Mutation(() => UserDto, { description: 'Add a new club to the clubs array of a user' })
  async addUserToClub(@CurrentUser() user: any, @Args('clubId') clubId: string) {
    try { return this.userService.addClub(user.userId, clubId);
    } catch (error) { return error; }
  }

  @Mutation(() => Boolean, {description: 'Removes the current user from a club member list'})
  async removeUserFromClub(@CurrentUser() user: any, @Args('clubId') clubId: string) {
    try { return this.userService.removeClub(user.userId, clubId);
    } catch (error) { return error; }
  }

  @Mutation(() => UserDto, { description: 'Add a new martial art rank to the current user' })
  async addMartialArtRankToUser(@CurrentUser() user: any, @Args('userId') userId: string, @Args('maRank') maRank: MaRanksInput) {
    try {
      return this.userService.addMartialArtRank(user.userId, userId, maRank);
    } catch (error) { return error; }
  }

  @Mutation(() => UserDto, {description: 'Updates the current user'})
  async updateUser(@CurrentUser() user, @Args('input') input: UserInput) {
    try {
      return this.userService.update(user.userId, input);
    } catch (error) { return error; }
  }

  @Mutation(() => Boolean, {description: 'Deletes the account of the current user'})
  async deleteUser(@CurrentUser() user: any) {
    try { return this.userService.deleteUser(user.userId);
    } catch (error) { return error; }
  }

  // {"query":"mutation uploadAvatar($file: Upload!)\n{\n  uploadAvatar(protocol: $file)\n}"}
  @Mutation(() => Boolean, {description: 'Examiners can upload an exam protocol to an existing exam result. Use cURL request to send required data.'})
    async uploadAvatar(@CurrentUser() currentUser: any, @Args({name: 'protocol', type: () => GraphQLUpload})
    { createReadStream, filename }: Upload): Promise<Boolean> {
        // Checks if the sending user is equal to the examiner
        try {
            const user = await this.userService.findById(currentUser.userId);

            // Deletes file if some already exist
            if (user.avatarUri) { fs.unlinkSync(user.avatarUri.split('///')[1]); }

            // Create an new unique file name with absolute uri
            const relativePath = await normalizeFileUri('avatars', filename);

            // Add the file uri to the user
            this.userService.addReportUri(user._id, pathToFileURL(relativePath).toString());

            return new Promise(async (resolve, reject) =>
                createReadStream()
                .pipe(createWriteStream(relativePath))
                .on('finish', result => {
                    resolve(true);
                })
                .on('error', () => reject(false)),
            );
        } catch (error) { return error; }
    }
// {"query":"mutation uploadAvatar($file: Upload!)\n{\n  uploadAvatar(protocol: $file)\n}"}
  // ===========================================================================
  // Subscriptions
  // ===========================================================================
}

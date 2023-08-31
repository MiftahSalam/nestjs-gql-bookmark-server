import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class GetUserArg {
  @Field()
  @IsString()
  @IsNotEmpty()
  _id: string;
}

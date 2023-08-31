import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractModel } from 'src/users/models/abstract-model.model';

@ObjectType()
export class Bookmark extends AbstractModel {
  @Field()
  readonly name: string;

  @Field()
  readonly userId: string;

  @Field(() => [String])
  readonly links: string[];
}

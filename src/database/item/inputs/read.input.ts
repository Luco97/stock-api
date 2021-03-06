import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ReadInput {
  @Field(() => Number, { nullable: true, defaultValue: 10 })
  take: number;

  @Field(() => Number, { nullable: true, defaultValue: 0 })
  skip: number;

  @Field(() => String, { nullable: true, defaultValue: 'createdAt' })
  orderBy: string;

  @Field(() => String, { nullable: true, defaultValue: 'ASC' })
  order: 'ASC' | 'DESC';
}

import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@Shared/auth';
import { ItemEntity } from '../model/item-entity';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateInput } from '../inputs/create.input';
import { ItemRepositoryService } from '../repository/item-repository.service';

@Resolver()
export class CreateItemResolver {
  constructor(
    private _authService: AuthService,
    private _itemService: ItemRepositoryService,
  ) {}

  @Mutation(() => ItemEntity)
  @UseGuards(AuthGuard)
  async create(
    @Args('paginate', { nullable: true }) createInput: CreateInput,
    @Context() context,
  ): Promise<ItemEntity> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;

    const { name, imageUrl, stock } = createInput;
    const id_user = this._authService.userID(token);
    const item = await this._itemService.itemRepo.save(
      this._itemService.itemRepo.create({
        imageUrl,
        name,
        stock,
      }),
    );
    await this._itemService.itemRepo
      .createQueryBuilder('item')
      .relation('user')
      .of(item.id)
      .set(id_user);
    return item;
  }
}

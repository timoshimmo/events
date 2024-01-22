import { Controller, Get, Post, Put, Param, Body, Delete, NotFoundException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';

@Controller('category')
export class CategoryController {

    constructor(private readonly categoryService:CategoryService){}

    //get all Categorys
  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  //get Category by id
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Category> {
    const Category = await this.categoryService.findOne(id);
    if (!Category) {
      throw new NotFoundException('Category does not exist!');
    } else {
      return Category;
    }
  }

  //create Category
  @Post()
  async create(@Body() category: Category): Promise<Category> {
    return this.categoryService.create(category);
  }

  //update Category
  @Put(':id')
  async update (@Param('id') id: number, @Body() category: Category): Promise<any> {
    return this.categoryService.update(id, category);
  }

  //delete Category
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    //handle error if Category does not exist
    const Category = await this.categoryService.findOne(id);
    if (!Category) {
      throw new NotFoundException('Category does not exist!');
    }
    return this.categoryService.delete(id);
  }

  //get Category by parent id
  @Get('subs/:id')
  async findSubCategorys(@Param('id') id: number): Promise<Category[]> {
    return await this.categoryService.findSubCategorys(id);
    
  }
}

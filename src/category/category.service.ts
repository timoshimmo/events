import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ){}

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
      }
    
      async findOne(id: number): Promise<Category> {
        return this.categoryRepository.findOne({ where: { id } });
      }
    
      async create(Category: Partial<Category>): Promise<Category> {
        const newCategory = this.categoryRepository.create(Category);
        return this.categoryRepository.save(newCategory);
      }
    
      async update(id: number, Category: Partial<Category>): Promise<Category> {
        await this.categoryRepository.update(id, Category);
        return this.categoryRepository.findOne({ where: { id } });
      }
    
      async delete(id: number): Promise<void> {
        await this.categoryRepository.delete(id);
      }

      async findSubCategorys(id: number): Promise<Category[]> {
        return this.categoryRepository.find({ where: { parentId: id } });
      }
}

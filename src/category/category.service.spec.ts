import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';


const categoryArray = [
  new Category(1, 'wedding', null),
  new Category(2, 'birthdays', 2),
  new Category(3, 'conferences', 2),
];

const categoryParentArray = [
  new Category(2, 'birthdays', 2),
  new Category(3, 'conferences', 2),
];

const categoryRow = new Category(4, "conferences", null);

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findAll: jest.fn().mockResolvedValue(categoryArray),
            findOne: jest.fn().mockResolvedValue(categoryRow),
            create: jest.fn().mockReturnValue(categoryRow),
            save: jest.fn(),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            update: jest.fn().mockResolvedValue(true),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            delete: jest.fn().mockResolvedValue(true),
          }
        }
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const categories = await service.findAll();
      expect(categories).toEqual(categoryArray);
    });
  });

  describe('Find One By Id', () => {
      it('should get a single category', () => {
        const jestRepoSpy = jest.spyOn(categoryRepository, 'findOne');
        expect(service.findOne(4)).resolves.toEqual(categoryRow);
        expect(jestRepoSpy).toBeCalledWith({ where: { id: 4 } });
      });
  });

  describe('Find One By Parent Id', () => {
    it('should get all categories with parent id', () => {
      const jestRepoSpy = jest.spyOn(categoryRepository, 'find');
      expect(service.findSubCategorys(2)).resolves.toEqual(categoryParentArray);
      expect(jestRepoSpy).toBeCalledWith({ where: { parentId: 2 } });
    });
  });

  describe('Insert New Category Data', () => {
    it('should successfully insert a category', () => {
      expect(
        service.create({
          id: 4,
          name: "conferences",
          parentId: null,
        }),
      ).resolves.toEqual(categoryRow);
      expect(categoryRepository.create).toBeCalledTimes(1);
      expect(categoryRepository.create).toBeCalledWith({
        id: 4,
        name: "conferences",
        parentId: null,
      });
      expect(categoryRepository.save).toBeCalledTimes(1);
    });
  });

  describe('Update a category', () => {
    it('should call the update method', async () => {
      const cat = await service.update(1, { name: "dinners", parentId: 3});
      expect(cat).toEqual(categoryRow);
      expect(categoryRepository.update).toBeCalledTimes(1);
      expect(categoryRepository.update).toBeCalledWith(
        { id: 1 },
        { name: "dinners", parentId: 3},
      );
    });
  });

  describe('Delete Category Item', () => {
    it('should return {deleted: true}', () => {
      expect(service.delete(3)).resolves.toEqual({ deleted: true });
    });
    it('should return {deleted: false, message: err.message}', () => {
      const repoSpy = jest
        .spyOn(categoryRepository, 'delete')
        .mockRejectedValueOnce(new Error('Bad Delete Method.'));
      expect(service.delete(7)).resolves.toEqual({
        deleted: false,
        message: 'Bad Delete Method.',
      });
      expect(repoSpy).toBeCalledWith({ id: 7 });
      expect(repoSpy).toBeCalledTimes(1);
    });
  });

});

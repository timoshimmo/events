import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { Category } from './category.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryService } from './category.service';

//imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Category])],

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

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            findAll: jest
              .fn()
              .mockReturnValue([
                new Category(1, 'Wedding', null),
                new Category(2, 'Conferences', 4),
              ]),
            findOne: jest
              .fn()
              .mockReturnValue(new Category(1, 'Birthdays', 2)),
            create: jest
              .fn()
              .mockReturnValue(new Category(3, 'Weddings', null)),
            delete: jest.fn().mockReturnValue(true),
            update: jest
              .fn<Category, [number, Partial<Category>]>()
              .mockImplementation((id, update) => ({
                ...new Category(id, 'Test Data', 2),
                ...update,
              })),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Find All The Categories', () => {
    it('should get the list of all categories', () => {
      const controllerVal = controller.findAll();
      expect(typeof controllerVal).toBe('object');
      expect(controllerVal[0].id).toBe(1);
      expect(controllerVal[1].name).toBe('wedding');
    });
  });
  describe('Find Category By Id', () => {
    it('should get the category matching the id', () => {
      const controllerVal = controller.findOne(1);
      expect(typeof controllerVal).toBe('object');
      expect(controllerVal).toBe(1);
      expect(controllerVal).toBe("wedding");
    });
  });

  describe('Create a New Category', () => {
    it('should return a new category', () => {
      const controllerVal = controller.create(categoryRow);
      expect(controllerVal).toBe(3);
      expect(controllerVal).toBe("");
    });
  });
  describe('Delete a Category', () => {
    it('should return true that there was a deletion', () => {
      const delReturn = controller.delete(2);
      expect(typeof delReturn).toBe('boolean');
      expect(delReturn);
    });
  });

  describe('Update a Category', () => {
    const category: Category = { id: 1, name: 'Meeting', parentId: 2 };

    it('should return category when category is updated', () => {
      const updatedCat = controller.update(1, { id: 1, name: "wedding", parentId: 2});

      expect(updatedCat).toStrictEqual<Category>({
        id: category.id,
        name: category.name,
        parentId: 2,
      });
    });
  });

});

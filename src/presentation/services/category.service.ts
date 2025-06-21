import { CategoryModel } from "../../data/mongo/models/category.model";
import {
  CreateCategoryDto,
  CustomError,
  PaginationDto,
  UserEntity,
} from "../../domain";

export class CategoryService {
  // DI
  constructor() {}
  public async createCategory(
    createCategoryDto: CreateCategoryDto,
    user: UserEntity
  ) {
    const categoryExist = await CategoryModel.findOne({
      name: createCategoryDto.name,
    });
    if (categoryExist) throw CustomError.badRequest("Category already exists");

    try {
      const category = new CategoryModel({
        ...createCategoryDto,
        user: user.id,
      });
      await category.save();
      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      throw CustomError.internalServerError(`Internal server ${error}`);
    }
  }

  public async getCategories(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, categories] = await Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
      ])
      return {
        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
          available: category.available,
        })),
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        nextPage: `/api/categories?page=${page + 1}&limit=${limit}`,
        prevPage: `/api/categories?page=${page - 1}&limit=${limit}`,
      };
    } catch (error) {
      throw CustomError.internalServerError(`Internal server ${error}`);
    }
  }
}

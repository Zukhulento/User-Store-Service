// El controlador está encargador de retornar la respuesta al cliente

import { Request, Response } from "express";
import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain";
import { CategoryService } from "../services";

export class CategoryController {
  // DI
  constructor(private readonly categoryService: CategoryService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        error: error.message,
      });
      return;
    }
    console.log(`Error: ${error}`);
    res.status(500).json({
      error: "Internal server error",
    });
  };

  createCategory = (req: Request, res: Response) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    this.categoryService
      .createCategory(createCategoryDto!, req.body.user)
      .then((category) => {
        res.status(201).json(category);
      })
      .catch((error) => this.handleError(error, res));
  };

  getCategories = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    this.categoryService
      .getCategories(paginationDto!)
      .then((categories) => {
        res.status(200).json(categories);
      })
      .catch((error) => this.handleError(error, res));
  };
}

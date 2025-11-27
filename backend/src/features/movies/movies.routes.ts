import { Router } from "express";
import { MoviesController } from "./movies.controller";
import { validate } from "../../shared/middleware/validation.middleware";
import { getMoviesQuerySchema } from "./movies.schema";

const router = Router();

router.get("/", validate(getMoviesQuerySchema, "query"), MoviesController.getAll);

export default router;

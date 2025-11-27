import { Request, Response, NextFunction } from "express";
import { Example } from "./example.model";
import { CreateExampleDto, UpdateExampleDto } from "./example.schema";

export class ExampleController {
	/**
	 * Get all examples
	 */
	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const examples = await Example.find({ isActive: true })
				.select("name description quantity isActive createdAt")
				.sort({ createdAt: -1 });

			res.json({
				success: true,
				count: examples.length,
				data: examples,
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get example by ID
	 */
	async getById(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;

			const example = await Example.findById(id);

			if (!example) {
				return res.status(404).json({
					success: false,
					error: "Example not found",
				});
			}

			res.json({
				success: true,
				data: example,
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Create new example
	 */
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const exampleData: CreateExampleDto = req.body;

			const example = await Example.create(exampleData);

			res.status(201).json({
				success: true,
				message: "Example created successfully",
				data: example,
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Update example by ID
	 */
	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const updateData: UpdateExampleDto = req.body;

			const example = await Example.findByIdAndUpdate(id, updateData, {
				new: true,
				runValidators: true,
			});

			if (!example) {
				return res.status(404).json({
					success: false,
					error: "Example not found",
				});
			}

			res.json({
				success: true,
				message: "Example updated successfully",
				data: example,
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Delete example by ID (soft delete)
	 */
	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;

			const example = await Example.findByIdAndUpdate(id, { isActive: false }, { new: true });

			if (!example) {
				return res.status(404).json({
					success: false,
					error: "Example not found",
				});
			}

			res.json({
				success: true,
				message: "Example deleted successfully",
			});
		} catch (error) {
			next(error);
		}
	}
}

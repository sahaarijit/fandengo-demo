"use client";

import { useState, useEffect } from "react";
import { exampleService } from "../services/example.service";
import type { Example, CreateExampleDto } from "../types/example.types";
import { Loader2, Plus, Trash2, Check, X } from "lucide-react";

export function ExampleList() {
	const [examples, setExamples] = useState<Example[]>([]);
	const [loading, setLoading] = useState(true);
	const [creating, setCreating] = useState(false);

	const [formData, setFormData] = useState<CreateExampleDto>({
		name: "",
		description: "",
		quantity: 0,
		isActive: true,
	});

	// Fetch examples on mount
	useEffect(() => {
		fetchExamples();
	}, []);

	const fetchExamples = async () => {
		try {
			setLoading(true);
			const response = await exampleService.getAll();
			if (response.success && response.data) {
				setExamples(response.data);
			}
		} catch (error) {
			console.error("Error fetching examples:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await exampleService.create(formData);
			if (response.success) {
				setFormData({ name: "", description: "", quantity: 0, isActive: true });
				setCreating(false);
				fetchExamples();
			}
		} catch (error) {
			console.error("Error creating example:", error);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this example?")) return;

		try {
			await exampleService.delete(id);
			fetchExamples();
		} catch (error) {
			console.error("Error deleting example:", error);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Examples</h2>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your examples with full CRUD operations</p>
				</div>
				<button
					onClick={() => setCreating(!creating)}
					className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
				>
					{creating ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
					{creating ? "Cancel" : "Add Example"}
				</button>
			</div>

			{/* Create Form */}
			{creating && (
				<form
					onSubmit={handleCreate}
					className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 space-y-4"
				>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
						<textarea
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
							rows={3}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity *</label>
						<input
							type="number"
							value={formData.quantity}
							onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
							required
							min="0"
						/>
					</div>

					<button
						type="submit"
						className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
					>
						<Check className="h-4 w-4" />
						Create Example
					</button>
				</form>
			)}

			{/* Examples List */}
			{examples.length === 0 ? (
				<div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
					<p className="text-gray-600 dark:text-gray-400">No examples found. Create one to get started!</p>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{examples.map((example) => (
						<div
							key={example._id}
							className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
						>
							<div className="flex items-start justify-between mb-3">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{example.name}</h3>
								<div className="flex gap-2">
									<button
										onClick={() => handleDelete(example._id)}
										className="text-red-600 hover:text-red-700 dark:text-red-400"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							</div>

							{example.description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{example.description}</p>}

							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-600 dark:text-gray-400">Quantity: {example.quantity}</span>
								<span
									className={`px-2 py-1 rounded-full text-xs font-semibold ${
										example.isActive
											? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
											: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
									}`}
								>
									{example.isActive ? "Active" : "Inactive"}
								</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

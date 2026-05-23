<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;

class AdminCategoryController extends Controller
{
    public function index(): InertiaResponse
    {
        $categories = Categories::withCount('products')->orderBy('name')->get();

        return Inertia::render('admin/categories', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
        ]);

        Categories::create($data);

        return redirect()->route('admin.categories')->with('success', 'Category created successfully!');
    }

    public function update(Request $request, Categories $category): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name,' . $category->id],
        ]);

        $category->update($data);

        return redirect()->route('admin.categories')->with('success', 'Category updated successfully!');
    }

    public function destroy(Categories $category): RedirectResponse
    {
        $category->delete();

        return redirect()->route('admin.categories')->with('success', 'Category deleted successfully!');
    }
}

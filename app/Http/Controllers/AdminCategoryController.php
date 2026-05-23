<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class AdminCategoryController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
        ]);

        Categories::create($data);

        return redirect()->route('admin.index')->with('success', 'Category created successfully!');
    }

    public function update(Request $request, Categories $category): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name,' . $category->id],
        ]);

        $category->update($data);

        return redirect()->route('admin.index')->with('success', 'Category updated successfully!');
    }

    public function destroy(Categories $category): RedirectResponse
    {
        $category->delete();

        return redirect()->route('admin.index')->with('success', 'Category deleted successfully!');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class AdminProductController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255', 'unique:products,title'],
            'price' => ['required', 'numeric', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
            'description' => ['required', 'string'],
            'image' => ['required', 'string'],
            'badge' => ['nullable', 'string', 'max:50'],
            'tags' => ['nullable'],
            'allergens' => ['nullable'],
            'additional_images' => ['nullable'],
        ]);

        // Process tags
        if (isset($data['tags'])) {
            if (is_string($data['tags'])) {
                $data['tags'] = array_values(array_filter(array_map('trim', explode(',', $data['tags']))));
            }
        } else {
            $data['tags'] = [];
        }

        // Process allergens
        if (isset($data['allergens'])) {
            if (is_string($data['allergens'])) {
                $data['allergens'] = array_values(array_filter(array_map('trim', explode(',', $data['allergens']))));
            }
        } else {
            $data['allergens'] = [];
        }

        // Process additional images
        if (isset($data['additional_images'])) {
            if (is_string($data['additional_images'])) {
                $data['additional_images'] = array_values(array_filter(array_map('trim', explode(',', $data['additional_images']))));
            }
        } else {
            $data['additional_images'] = [];
        }

        // Default counters
        $data['reviews_count'] = 0;
        $data['rating_score'] = 5.0;

        Products::create($data);

        return redirect()->route('admin.index')->with('success', 'Product created successfully!');
    }

    /**
     * Update the specified product in database.
     */
    public function update(Request $request, Products $product): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255', 'unique:products,title,' . $product->id],
            'price' => ['required', 'numeric', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
            'description' => ['required', 'string'],
            'image' => ['required', 'string'],
            'badge' => ['nullable', 'string', 'max:50'],
            'tags' => ['nullable'],
            'allergens' => ['nullable'],
            'additional_images' => ['nullable'],
        ]);

        // Process tags
        if (isset($data['tags'])) {
            if (is_string($data['tags'])) {
                $data['tags'] = array_values(array_filter(array_map('trim', explode(',', $data['tags']))));
            }
        } else {
            $data['tags'] = [];
        }

        // Process allergens
        if (isset($data['allergens'])) {
            if (is_string($data['allergens'])) {
                $data['allergens'] = array_values(array_filter(array_map('trim', explode(',', $data['allergens']))));
            }
        } else {
            $data['allergens'] = [];
        }

        // Process additional images
        if (isset($data['additional_images'])) {
            if (is_string($data['additional_images'])) {
                $data['additional_images'] = array_values(array_filter(array_map('trim', explode(',', $data['additional_images']))));
            }
        } else {
            $data['additional_images'] = [];
        }

        $product->update($data);

        return redirect()->route('admin.index')->with('success', 'Product updated successfully!');
    }

    /**
     * Remove the specified product from database.
     */
    public function destroy(Products $product): RedirectResponse
    {
        $product->delete();

        return redirect()->route('admin.index')->with('success', 'Product deleted successfully!');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;

class AdminSettingController extends Controller
{
    public function index(): InertiaResponse
    {
        $settings = Setting::all()->pluck('value', 'key');

        return Inertia::render('admin/settings', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'whatsapp_number' => ['required', 'string', 'max:20'],
            'store_location' => ['required', 'string', 'max:255'],
            'email_heading' => ['required', 'string', 'max:500'],
            'email_body' => ['required', 'string'],
            'email_features' => ['required', 'string'],
            'email_cta_text' => ['required', 'string', 'max:200'],
            'email_footer_address' => ['required', 'string', 'max:500'],
        ]);

        Setting::updateOrCreate(['key' => 'whatsapp_number'], ['value' => $data['whatsapp_number']]);
        Setting::updateOrCreate(['key' => 'store_location'], ['value' => $data['store_location']]);
        Setting::updateOrCreate(['key' => 'email_heading'], ['value' => $data['email_heading']]);
        Setting::updateOrCreate(['key' => 'email_body'], ['value' => $data['email_body']]);
        Setting::updateOrCreate(['key' => 'email_features'], ['value' => $data['email_features']]);
        Setting::updateOrCreate(['key' => 'email_cta_text'], ['value' => $data['email_cta_text']]);
        Setting::updateOrCreate(['key' => 'email_footer_address'], ['value' => $data['email_footer_address']]);

        return redirect()->route('admin.settings')->with('success', 'Settings saved successfully!');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::with('treatments')
            ->latest()
            ->get();

        return Inertia::render('clients', [
            'clients' => $clients,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'date_of_birth' => ['nullable', 'date'],
            'address' => ['nullable', 'string', 'max:255'],
            'allergies' => ['nullable', 'string'],
            'medical_conditions' => ['nullable', 'string'],
            'maintenance' => ['nullable', 'string'],
        ]);

        Client::create($this->normalizeOptionalTextFields($validated));

        return redirect()->route('clients');
    }

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'date_of_birth' => ['nullable', 'date'],
            'address' => ['nullable', 'string', 'max:255'],
            'allergies' => ['nullable', 'string'],
            'medical_conditions' => ['nullable', 'string'],
            'maintenance' => ['nullable', 'string'],
        ]);

        $client->update($this->normalizeOptionalTextFields($validated));

        return redirect()->route('clients');
    }

    public function destroy(Client $client)
    {
        $client->treatments()->delete();
        $client->delete();

        return redirect()->route('clients');
    }

    private function normalizeOptionalTextFields(array $validated): array
    {
        foreach (['allergies', 'medical_conditions', 'maintenance'] as $field) {
            $validated[$field] = filled($validated[$field] ?? null)
                ? trim((string) $validated[$field])
                : 'N/A';
        }

        return $validated;
    }
}

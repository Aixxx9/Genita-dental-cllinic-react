<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Treatment;
use Illuminate\Http\Request;

class TreatmentController extends Controller
{
    public function store(Request $request, Client $client)
    {
        $validated = $request->validate([
            'type' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
            'description' => ['nullable', 'string'],
            'total_cost' => ['required', 'numeric', 'min:0'],
            'amount_paid' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);

        $client->treatments()->create($validated);

        return redirect()->route('clients');
    }

    public function update(Request $request, Client $client, Treatment $treatment)
    {
        if ($treatment->client_id !== $client->id) {
            abort(404);
        }

        $validated = $request->validate([
            'type' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
            'description' => ['nullable', 'string'],
            'total_cost' => ['required', 'numeric', 'min:0'],
            'amount_paid' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);

        $treatment->update($validated);

        return redirect()->route('clients');
    }

    public function destroy(Client $client, Treatment $treatment)
    {
        if ($treatment->client_id !== $client->id) {
            abort(404);
        }

        $treatment->delete();

        return redirect()->route('clients');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    private const RESERVED_STATUSES = ['pending', 'approved'];

    public function index()
    {
        $appointments = Appointment::latest()->get();

        return Inertia::render('appointments', [
            'appointments' => $appointments,
        ]);
    }

    public function store(Request $request)
    {
        $timeOptions = [];
        for ($hour = 8; $hour <= 21; $hour++) {
            foreach ([0, 30] as $minute) {
                if ($hour === 21 && $minute > 0) {
                    continue;
                }
                $suffix = $hour >= 12 ? 'PM' : 'AM';
                $displayHour = (($hour + 11) % 12) + 1;
                $displayMinute = str_pad((string) $minute, 2, '0', STR_PAD_LEFT);
                $timeOptions[] = "{$displayHour}:{$displayMinute} {$suffix}";
            }
        }

        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'treatment_type' => ['required', 'string', 'max:255'],
            'allergies' => ['nullable', 'string'],
            'medical_conditions' => ['nullable', 'string'],
            'maintenance' => ['nullable', 'string'],
            'preferred_date' => ['required', 'date'],
            'preferred_time' => ['required', Rule::in($timeOptions)],
            'notes' => ['nullable', 'string'],
        ]);

        $alreadyBooked = $this->slotIsReserved(
            $validated['preferred_date'],
            $validated['preferred_time']
        );

        if ($alreadyBooked) {
            return back()->withErrors([
                'preferred_time' => 'That time already has a pending or approved appointment. Please choose another.',
            ]);
        }

        Appointment::create([
            ...$this->normalizeOptionalTextFields($validated),
            'status' => 'pending',
        ]);

        return back();
    }

    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'approved', 'completed', 'cancelled'])],
        ]);

        $appointment->update($validated);

        return back();
    }

    public function approve(Appointment $appointment)
    {
        $slotAlreadyTakenByAnotherAppointment = $this->slotIsReserved(
            $appointment->preferred_date->toDateString(),
            $appointment->preferred_time,
            $appointment->id
        );

        if ($slotAlreadyTakenByAnotherAppointment) {
            return back()->withErrors([
                'approve' => 'This appointment cannot be approved because the selected time slot is already reserved by another request.',
            ]);
        }

        $appointment->update(['status' => 'approved']);

        $normalizedEmail = $this->normalizeText($appointment->email);
        $firstName = $this->extractFirstName($appointment->full_name);
        $lastName = $this->extractLastName($appointment->full_name);

        $client = $this->findExistingClient($normalizedEmail, $firstName, $lastName)
            ?? new Client();

        $client->email = $normalizedEmail;
        $client->first_name = $firstName;
        $client->last_name = $lastName;
        $client->phone = $appointment->phone;
        $client->allergies = $this->mergeOptionalHealthField(
            $appointment->allergies,
            $client->allergies
        );
        $client->medical_conditions = $this->mergeOptionalHealthField(
            $appointment->medical_conditions,
            $client->medical_conditions
        );
        $client->maintenance = $this->mergeOptionalHealthField(
            $appointment->maintenance,
            $client->maintenance
        );
        $client->save();

        return redirect()->route('clients');
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return back();
    }

    private function extractFirstName(string $fullName): string
    {
        $parts = preg_split('/\s+/', trim($fullName)) ?: [];
        return $this->normalizeText($parts[0] ?? $fullName);
    }

    private function extractLastName(string $fullName): string
    {
        $parts = preg_split('/\s+/', trim($fullName)) ?: [];
        if (count($parts) <= 1) {
            return '';
        }
        array_shift($parts);
        return $this->normalizeText(implode(' ', $parts));
    }

    private function slotIsReserved(string $date, string $time, ?int $ignoreAppointmentId = null): bool
    {
        return Appointment::query()
            ->when(
                $ignoreAppointmentId !== null,
                fn ($query) => $query->whereKeyNot($ignoreAppointmentId)
            )
            ->whereDate('preferred_date', $date)
            ->where('preferred_time', $time)
            ->whereIn('status', self::RESERVED_STATUSES)
            ->exists();
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

    private function mergeOptionalHealthField(?string $incomingValue, ?string $existingValue): string
    {
        if (filled($incomingValue) && $incomingValue !== 'N/A') {
            return $incomingValue;
        }

        return filled($existingValue) ? $existingValue : 'N/A';
    }

    private function findExistingClient(string $email, string $firstName, string $lastName): ?Client
    {
        return Client::query()
            ->whereRaw('LOWER(email) = ?', [strtolower($email)])
            ->whereRaw('LOWER(first_name) = ?', [strtolower($firstName)])
            ->whereRaw('LOWER(last_name) = ?', [strtolower($lastName)])
            ->first();
    }

    private function normalizeText(string $value): string
    {
        return trim(preg_replace('/\s+/', ' ', $value) ?? $value);
    }
}

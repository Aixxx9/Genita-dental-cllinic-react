<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\TreatmentController;
use App\Models\Appointment;
use App\Models\Client;
use App\Models\Treatment;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    $bookedSlots = Appointment::query()
        ->whereIn('status', ['pending', 'approved'])
        ->get(['preferred_date', 'preferred_time'])
        ->map(fn ($item) => [
            'date' => $item->preferred_date?->format('Y-m-d'),
            'time' => $item->preferred_time,
        ]);

    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'bookedSlots' => $bookedSlots,
    ]);
})->name('home');

Route::get('dashboard', function () {
    $totalClients = Client::count();
    $recentClients = Client::latest()->take(5)->get([
        'id',
        'first_name',
        'last_name',
        'email',
    ]);
    $totalCost = (float) Treatment::sum('total_cost');
    $totalPaid = (float) Treatment::sum('amount_paid');
    $outstandingBalance = max(0, $totalCost - $totalPaid);
    $pendingAppointments = Appointment::where('status', 'pending')->count();
    $totalAppointments = Appointment::count();
    $recentPendingAppointments = Appointment::where('status', 'pending')
        ->latest()
        ->take(5)
        ->get([
            'id',
            'full_name',
            'preferred_date',
            'preferred_time',
            'treatment_type',
        ]);

    return Inertia::render('dashboard', [
        'stats' => [
            'totalClients' => $totalClients,
            'pendingAppointments' => $pendingAppointments,
            'totalAppointments' => $totalAppointments,
            'outstandingBalance' => $outstandingBalance,
        ],
        'recentClients' => $recentClients,
        'recentPendingAppointments' => $recentPendingAppointments,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::post('appointments', [AppointmentController::class, 'store'])
    ->name('appointments.store');
Route::get('appointments', [AppointmentController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('appointments');
Route::put('appointments/{appointment}', [AppointmentController::class, 'update'])
    ->middleware(['auth', 'verified'])
    ->name('appointments.update');
Route::post('appointments/{appointment}/approve', [AppointmentController::class, 'approve'])
    ->middleware(['auth', 'verified'])
    ->name('appointments.approve');
Route::delete('appointments/{appointment}', [AppointmentController::class, 'destroy'])
    ->middleware(['auth', 'verified'])
    ->name('appointments.destroy');

Route::get('clients', [ClientController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('clients');
Route::post('clients', [ClientController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('clients.store');
Route::put('clients/{client}', [ClientController::class, 'update'])
    ->middleware(['auth', 'verified'])
    ->name('clients.update');
Route::delete('clients/{client}', [ClientController::class, 'destroy'])
    ->middleware(['auth', 'verified'])
    ->name('clients.destroy');
Route::post('clients/{client}/treatments', [TreatmentController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('clients.treatments.store');
Route::put('clients/{client}/treatments/{treatment}', [TreatmentController::class, 'update'])
    ->middleware(['auth', 'verified'])
    ->name('clients.treatments.update');
Route::delete('clients/{client}/treatments/{treatment}', [TreatmentController::class, 'destroy'])
    ->middleware(['auth', 'verified'])
    ->name('clients.treatments.destroy');

require __DIR__.'/settings.php';

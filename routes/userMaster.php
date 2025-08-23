<?php

use App\Http\Controllers\UserManagement\AdminManagementController;
use App\Http\Controllers\UserManagement\InstructorManagementController;
use App\Http\Controllers\UserManagement\LearnerManagementController;
use App\Http\Controllers\UserMaster\UserManagementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::resource('user-management', UserManagementController::class);
// });


Route::prefix('user-management')->middleware(['auth', 'verified'])->group(function () {

    Route::post('/learners/{learner}/reset-password', [LearnerManagementController::class, 'resetPassword'])->name('learner.resetPassword');
    // Route::get('/learner/export', [LearnerManagementController::class, 'export'])->name('learner.export');
    Route::post('/learner/export', [LearnerManagementController::class, 'export'])
        ->name('learners.export.post');

    Route::get('/learner/bulk', [LearnerManagementController::class, 'bulkPage'])
        ->name('learners.bulk.page');

    Route::get('/learner/bulk/template', [LearnerManagementController::class, 'downloadTemplate'])
        ->name('learners.bulk.template');

    Route::post('/learner/bulk/upload', [LearnerManagementController::class, 'bulkUpload'])
        ->name('learners.bulk.upload');

    Route::post('/learner/bulk/insert', [LearnerManagementController::class, 'bulkInsert'])
        ->name('learners.bulk.insert');

    Route::resource('learner', LearnerManagementController::class);
    Route::resource('instructor', InstructorManagementController::class);
    Route::resource('admin', AdminManagementController::class);
});

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

    Route::post('/learner/{learner}/reset-password', [LearnerManagementController::class, 'resetPassword'])->name('learner.resetPassword');
    Route::post('/learner/export', [LearnerManagementController::class, 'export'])->name('learners.export.post');
    Route::get('/learner/bulk', [LearnerManagementController::class, 'bulkPage'])->name('learners.bulk.page');
    Route::get('/learner/bulk/template', [LearnerManagementController::class, 'downloadTemplate'])->name('learners.bulk.template');
    Route::post('/learner/bulk/upload', [LearnerManagementController::class, 'bulkUpload'])->name('learners.bulk.upload');
    Route::post('/learner/bulk/insert', [LearnerManagementController::class, 'bulkInsert'])->name('learners.bulk.insert');

    Route::post('/instructor/{instructor}/reset-password', [InstructorManagementController::class, 'resetPassword'])->name('instructor.resetPassword');
    Route::post('/instructor/export', [InstructorManagementController::class, 'export'])->name('instructors.export.post');
    Route::get('/instructor/bulk', [InstructorManagementController::class, 'bulkPage'])->name('instructors.bulk.page');
    Route::get('/instructor/bulk/template', [InstructorManagementController::class, 'downloadTemplate'])->name('instructors.bulk.template');
    Route::post('/instructor/bulk/upload', [InstructorManagementController::class, 'bulkUpload'])->name('instructors.bulk.upload');
    Route::post('/instructor/bulk/insert', [InstructorManagementController::class, 'bulkInsert'])->name('instructors.bulk.insert');

    Route::resource('learner', LearnerManagementController::class);
    Route::resource('instructor', InstructorManagementController::class);
    Route::resource('admin', AdminManagementController::class);
});

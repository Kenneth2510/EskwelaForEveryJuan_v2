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

    // Learner Management
    Route::post('/learner/{learner}/reset-password', [LearnerManagementController::class, 'resetPassword'])->name('learner.resetPassword')->middleware("permissions:user_management.update");
    Route::post('/learner/export', [LearnerManagementController::class, 'export'])->name('learners.export.post')->middleware("permissions:user_management.view");
    Route::get('/learner/bulk', [LearnerManagementController::class, 'bulkPage'])->name('learners.bulk.page')->middleware("permissions:user_management.create");
    Route::get('/learner/bulk/template', [LearnerManagementController::class, 'downloadTemplate'])->name('learners.bulk.template')->middleware("permissions:user_management.create");
    Route::post('/learner/bulk/upload', [LearnerManagementController::class, 'bulkUpload'])->name('learners.bulk.upload')->middleware("permissions:user_management.create");
    Route::post('/learner/bulk/insert', [LearnerManagementController::class, 'bulkInsert'])->name('learners.bulk.insert')->middleware("permissions:user_management.create");

    Route::resource('learner', LearnerManagementController::class)->only(["index", "show"])->middleware("permissions:user_management.view");
    Route::resource('learner', LearnerManagementController::class)->only(["create", "store"])->middleware("permissions:user_management.create");
    Route::resource('learner', LearnerManagementController::class)->only(["edit", "update"])->middleware("permissions:user_management.update");
    Route::resource('learner', LearnerManagementController::class)->only(["destroy"])->middleware("permissions:user_management.delete");

    // Instructor Management
    Route::post('/instructor/{instructor}/reset-password', [InstructorManagementController::class, 'resetPassword'])->name('instructor.resetPassword')->middleware("permissions:user_management.update");
    Route::post('/instructor/export', [InstructorManagementController::class, 'export'])->name('instructors.export.post')->middleware("permissions:user_management.view");
    Route::get('/instructor/bulk', [InstructorManagementController::class, 'bulkPage'])->name('instructors.bulk.page')->middleware("permissions:user_management.create");
    Route::get('/instructor/bulk/template', [InstructorManagementController::class, 'downloadTemplate'])->name('instructors.bulk.template')->middleware("permissions:user_management.create");
    Route::post('/instructor/bulk/upload', [InstructorManagementController::class, 'bulkUpload'])->name('instructors.bulk.upload')->middleware("permissions:user_management.create");
    Route::post('/instructor/bulk/insert', [InstructorManagementController::class, 'bulkInsert'])->name('instructors.bulk.insert')->middleware("permissions:user_management.create");

    Route::resource('instructor', InstructorManagementController::class)->only(["index","show"])->middleware("permissions:user_management.view");
    Route::resource('instructor', InstructorManagementController::class)->only(["create", "store"])->middleware("permissions:user_management.create");
    Route::resource('instructor', InstructorManagementController::class)->only(["edit", "update"])->middleware("permissions:user_management.update");
    Route::resource('instructor', InstructorManagementController::class)->only(["delete"])->middleware("permissions:user_management.delete");


    // Admin Management
    Route::post('/admin/{admin}/reset-password', [AdminManagementController::class, 'resetPassword'])->name('admin.resetPassword')->middleware("permissions:admin_management.update");
    Route::post('/admin/export', [AdminManagementController::class, 'export'])->name('admins.export.post')->middleware("permissions:admin_management.view");
    Route::get('/admin/bulk', [AdminManagementController::class, 'bulkPage'])->name('admins.bulk.page')->middleware("permissions:admin_management.create");
    Route::get('/admin/bulk/template', [AdminManagementController::class, 'downloadTemplate'])->name('admins.bulk.template')->middleware("permissions:admin_management.create");
    Route::post('/admin/bulk/upload', [AdminManagementController::class, 'bulkUpload'])->name('admins.bulk.upload')->middleware("permissions:admin_management.create");
    Route::post('/admin/bulk/insert', [AdminManagementController::class, 'bulkInsert'])->name('admins.bulk.insert')->middleware("permissions:admin_management.create");

    Route::resource('admin', AdminManagementController::class)->only(["index", "show"])->middleware("permissions:admin_management.view");
    Route::resource('admin', AdminManagementController::class)->only(["create", "store"])->middleware("permissions:admin_management.create");
    Route::resource('admin', AdminManagementController::class)->only(["edit", "update"])->middleware("permissions:admin_management.update");
    Route::resource('admin', AdminManagementController::class)->only(["destroy"])->middleware("permissions:admin_management.delete");
});

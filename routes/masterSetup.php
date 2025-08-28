<?php

use App\Http\Controllers\RoleManagement\AssignRoleManagementController;
use App\Http\Controllers\RoleManagement\RoleManagementController;
use Illuminate\Support\Facades\Route;



Route::prefix('master-setup')->middleware(['auth', 'verified'])->group(function () {
    Route::resource('role', RoleManagementController::class);
    Route::resource('role-assign', AssignRoleManagementController::class)->only(["index", "update"]);
});

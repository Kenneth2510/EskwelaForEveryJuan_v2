<?php

use App\Http\Controllers\RoleManagement\AssignRoleManagementController;
use App\Http\Controllers\RoleManagement\RoleManagementController;
use Illuminate\Support\Facades\Route;



Route::prefix('master-setup')->middleware(['auth', 'verified'])->group(function () {
    Route::resource('role', RoleManagementController::class)->middleware("permissions:settings.roles_permissions");
    Route::resource('role-assign', AssignRoleManagementController::class)->only(["index", "update"])->middleware("permissions:user_management.assignRoles|admin_management.assignRoles");
});

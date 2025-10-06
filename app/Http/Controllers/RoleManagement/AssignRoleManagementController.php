<?php

namespace App\Http\Controllers\RoleManagement;

use App\Http\Controllers\Controller;
use App\Services\RoleManagement\AssignRoleManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssignRoleManagementController extends Controller
{
    protected $assignRoleService;

    public function __construct(AssignRoleManagementService $assignRoleService)
    {
        $this->assignRoleService = $assignRoleService;
    }

    /**
     * Display a listing of the resource (users + roles).
     */
    public function index()
    {
        [$users, $roles] = $this->assignRoleService->getUsersAndRoles();

        return Inertia::render('masterSetup/userRoleManagement/index', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    /**
     * Assign / Sync role(s) to a user.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'roles'   => 'required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $this->assignRoleService->syncUserRoles($id, $request->roles);
        return redirect()
            ->back()
            ->with('success', 'User roles updated successfully!');
    }
}

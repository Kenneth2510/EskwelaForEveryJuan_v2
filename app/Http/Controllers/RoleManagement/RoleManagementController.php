<?php

namespace App\Http\Controllers\RoleManagement;

use App\Http\Controllers\Controller;
use App\Services\RoleManagement\RoleManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleManagementController extends Controller
{
    protected $roleService;

    public function __construct(RoleManagementService $roleService)
    {
        $this->roleService = $roleService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = $this->roleService->getAllRoles();

        return Inertia::render('masterSetup/roleManagement/index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('masterSetup/roleManagement/actions/create', [
            'presets' => $this->roleService->getPresetPermissions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'required|array',
            'permissions.*' => 'string',
            'category' => 'required|in:learner,instructor,admin',
        ]);

        $this->roleService->createRole([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'permissions' => $validated['permissions'],
            'category' => $validated['category'],
            'guard_name' => 'web',
        ]);

        return to_route('role.index')->with('success', 'Role created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $role = $this->roleService->findRoleWithPermissions($id);

        return Inertia::render('masterSetup/roleManagement/actions/edit', [
            'role' => $role,
            'presets' => $this->roleService->getPresetPermissions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'required|array',
            'permissions.*' => 'string',
            'category' => 'required|in:learner,instructor,admin',
        ]);

        $this->roleService->updateRole($id, $validated);

        return redirect()->route('role.index')->with('success', 'Role updated successfully.');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->roleService->deleteRole($id);

        return redirect()->route('role.index')->with('success', 'Role deleted successfully.');
    }
}

<?php

namespace App\Services\RoleManagement;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Cache;

class AssignRoleManagementService
{
    protected string $cacheKey = 'assign_roles.all_assigned_roles';
    protected int $cacheTTL = 600;

    /**
     * Get all users with category + roles, and all available roles.
     */
    public function getUsersAndRoles(): array
    {
        $users = Cache::remember($this->cacheKey . '.users', $this->cacheTTL, function () {
            return User::with('roles:id,name') // eager load only id+name of roles
                ->latest()
                ->get()
                ->map(function ($user) {
                    return [
                        'id'       => $user->id,
                        'name'     => $user->name,
                        'email'    => $user->email,
                        'category' => $user->category ?? 'N/A',
                        'roles'    => $user->roles->map(fn($r) => [
                            'id'   => $r->id,
                            'name' => $r->name,
                        ]),
                    ];
                });
        });

        $roles = Cache::remember($this->cacheKey . '.roles', $this->cacheTTL, function () {
            return Role::select('id', 'name')->get();
        });

        return [$users, $roles];
    }

    /**
     * Sync user roles with selected roles.
     */
    public function syncUserRoles(int $userId, array $roles): void
    {
        $user = User::findOrFail($userId);
        $user->syncRoles($roles);

        // clear cache since roles have changed
        Cache::forget($this->cacheKey . '.users');
        Cache::forget($this->cacheKey . '.roles');
    }
}

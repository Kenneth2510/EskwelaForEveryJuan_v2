<?php

namespace App\Services\RoleManagement;

use App\Models\Role;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Spatie\Permission\Models\Permission;

class RoleManagementService
{
    protected string $cacheKey = 'role_management.all_roles';
    protected int $cacheTTL = 600;
    /**
     * Create a new class instance.
     */
    public function getAllRoles()
    {
        return Cache::remember($this->cacheKey, $this->cacheTTL, function () {
            return Role::with('permissions')
                ->latest()
                ->get()
                ->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                        'description' => $role->description,
                        'permissionsCount' => $role->permissions->count(),
                        'updated_at' => $role->updated_at,
                    ];
                });
        });
    }

    public function getPresetPermissions(): array
    {
        // Keep this in sync with the frontend PRESET_PERMISSIONS in create.tsx
        return [
            'learner' => [
                [
                    'id' => 'learner.dashboard',
                    'label' => 'Dashboard',
                    'permissions' => [
                        ['id' => 'dashboard.view', 'label' => 'View Dashboard'],
                    ],
                ],
                [
                    'id' => 'learner.courses',
                    'label' => 'Course Access',
                    'permissions' => [
                        ['id' => 'course_enrollment.enroll', 'label' => 'Enroll to Course'],
                        ['id' => 'course_enrollment.view', 'label' => 'View Enrollments'],
                        ['id' => 'course_management.viewOwn', 'label' => 'View Own Courses'],
                        ['id' => 'syllabus_content.view', 'label' => 'View Syllabus / Content'],
                        ['id' => 'lessons_files.view', 'label' => 'View Lesson Files'],
                    ],
                ],
                [
                    'id' => 'learner.quizzes',
                    'label' => 'Quizzes & Exams',
                    'permissions' => [
                        ['id' => 'quizzes_exams.take', 'label' => 'Take Quizzes/Exams'],
                        ['id' => 'quizzes_exams.view', 'label' => 'View Quizzes/Exams'],
                        ['id' => 'quizzes_exams.attempt', 'label' => 'Attempt Quiz/Exam'],
                    ],
                ],
                [
                    'id' => 'learner.interactions',
                    'label' => 'Messaging & Forums',
                    'permissions' => [
                        ['id' => 'message_forums.send', 'label' => 'Send Messages / Post'],
                        ['id' => 'message_forums.deleteOwn', 'label' => 'Delete Own Messages'],
                    ],
                ],
                [
                    'id' => 'learner.misc',
                    'label' => 'Misc',
                    'permissions' => [
                        ['id' => 'notes.manage', 'label' => 'Manage Notes'],
                        ['id' => 'rag_assistant.use', 'label' => 'Use RAG Assistant'],
                        ['id' => 'task_manager.view', 'label' => 'View Task Manager'],
                    ],
                ],
            ],

            'instructor' => [
                [
                    'id' => 'instructor.courses',
                    'label' => 'Course Management',
                    'permissions' => [
                        ['id' => 'course_management.create', 'label' => 'Create Course'],
                        ['id' => 'course_management.viewOwn', 'label' => 'View Own Courses'],
                        ['id' => 'course_management.updateOwn', 'label' => 'Edit Own Courses'],
                        ['id' => 'course_clone_archival.clone', 'label' => 'Clone Course'],
                    ],
                ],
                [
                    'id' => 'instructor.content',
                    'label' => 'Syllabus & Content',
                    'permissions' => [
                        ['id' => 'syllabus_content.create', 'label' => 'Create Syllabus / Content'],
                        ['id' => 'syllabus_content.update', 'label' => 'Update Content'],
                        ['id' => 'syllabus_content.delete', 'label' => 'Delete Content'],
                        ['id' => 'lessons_files.upload', 'label' => 'Upload Lesson Files'],
                        ['id' => 'lessons_files.add', 'label' => 'Add Lesson Files'],
                        ['id' => 'lessons_files.update', 'label' => 'Update Lesson Files'],
                        ['id' => 'lessons_files.delete', 'label' => 'Delete Lesson Files'],
                    ],
                ],
                [
                    'id' => 'instructor.assessment',
                    'label' => 'Quizzes & Question Bank',
                    'permissions' => [
                        ['id' => 'quizzes_exams.create', 'label' => 'Create Quizzes/Exams'],
                        ['id' => 'quizzes_exams.update', 'label' => 'Update Quizzes/Exams'],
                        ['id' => 'quizzes_exams.viewSubmission', 'label' => 'View Submissions'],
                        ['id' => 'quizzes_exams.gradeSubmission', 'label' => 'Grade Submissions'],
                        ['id' => 'question_bank.manage', 'label' => 'Manage Question Bank'],
                    ],
                ],
                [
                    'id' => 'instructor.interactions',
                    'label' => 'Students & Communication',
                    'permissions' => [
                        ['id' => 'instructor.students.view', 'label' => 'View Enrolled Students'],
                        ['id' => 'instructor.students.message', 'label' => 'Message Students'],
                        ['id' => 'message_forums.moderateMessage', 'label' => 'Moderate Forum Messages'],
                    ],
                ],
            ],

            'admin' => [
                [
                    'id' => 'admin.core',
                    'label' => 'System Core',
                    'permissions' => [
                        ['id' => 'dashboard.viewAll', 'label' => 'View All Dashboards/Overview'],
                        ['id' => 'tos_calculations.manage', 'label' => 'TOS Calculations'],
                        ['id' => 'rag_assistant.train', 'label' => 'Train RAG Assistant'],
                    ],
                ],
                [
                    'id' => 'admin.course',
                    'label' => 'Course Administration',
                    'permissions' => [
                        ['id' => 'course_management.viewAll', 'label' => 'View All Courses'],
                        ['id' => 'course_management.updateAll', 'label' => 'Update Any Course'],
                        ['id' => 'course_management.deleteAll', 'label' => 'Delete Any Course'],
                        ['id' => 'course_approval.approve', 'label' => 'Approve Courses'],
                        ['id' => 'course_clone_archival.archive', 'label' => 'Archive Course'],
                        ['id' => 'course_clone_archival.restore', 'label' => 'Restore Course'],
                    ],
                ],
                [
                    'id' => 'admin.enrollment',
                    'label' => 'Enrollment & Reports',
                    'permissions' => [
                        ['id' => 'course_enrollment.manage', 'label' => 'Manage Enrollments'],
                        ['id' => 'reports.generate', 'label' => 'Generate Reports'],
                        ['id' => 'reports.view', 'label' => 'View Reports'],
                    ],
                ],
                [
                    'id' => 'admin.users',
                    'label' => 'User & Admin Management',
                    'permissions' => [
                        ['id' => 'user_management.view', 'label' => 'View Users'],
                        ['id' => 'user_management.create', 'label' => 'Create Users'],
                        ['id' => 'user_management.update', 'label' => 'Edit Users'],
                        ['id' => 'user_management.delete', 'label' => 'Delete Users'],
                        ['id' => 'user_management.assignRoles', 'label' => 'Assign Roles to Users'],
                        ['id' => 'admin_management.view', 'label' => 'View Admins'],
                        ['id' => 'admin_management.create', 'label' => 'Create Admins'],
                        ['id' => 'admin_management.assignRoles', 'label' => 'Assign Admin Roles'],
                    ],
                ],
                [
                    'id' => 'admin.system',
                    'label' => 'System Settings & Files',
                    'permissions' => [
                        ['id' => 'settings.update', 'label' => 'Update Settings'],
                        ['id' => 'settings.roles_permissions', 'label' => 'Manage Roles & Permissions'],
                        ['id' => 'file_management.manage', 'label' => 'Manage Files'],
                        ['id' => 'activity_logs.view', 'label' => 'View Activity Logs'],
                    ],
                ],
            ],
        ];
    }

    public function createRole(array $data): Role
    {
        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
            'description' => $data['description'] ?? null,
            'category' => $data['category'] ?? 'learner',
        ]);

        $permNames = Arr::get($data, 'permissions', []);
        $permsToSync = [];

        foreach ($permNames as $permName) {
            $permission = Permission::firstOrCreate(
                ['name' => $permName, 'guard_name' => $data['guard_name'] ?? 'web']
            );
            $permsToSync[] = $permission->name;
        }

        $role->syncPermissions($permsToSync);

        $this->invalidateCache();

        return $role;
    }

    public function invalidateCache(): void
    {
        Cache::forget($this->cacheKey);
    }

    public function findRoleWithPermissions($id)
    {
        $role = Role::with('permissions')->findOrFail($id);

        return [
            'id' => $role->id,
            'name' => $role->name,
            'description' => $role->description,
            'category' => $role->category,
            'permissions' => $role->permissions->pluck('name'),
        ];
    }

    public function updateRole($id, array $data)
    {
        $role = Role::findOrFail($id);

        $role->update([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'category' => $data['category'] ?? 'learner',
        ]);

        $role->syncPermissions($data['permissions']);

        $this->invalidateCache();

        return $role;
    }

    public function deleteRole($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();
        Cache::forget($this->cacheKey);
    }
}

<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // map of role => permission names (flat arrays)
        $mapping = [
            'Learner' => [
                'dashboard.view',
                'course_enrollment.enroll',
                'course_enrollment.view',
                'course_management.viewOwn',
                'syllabus_content.view',
                'lessons_files.view',
                'quizzes_exams.take',
                'quizzes_exams.view',
                'quizzes_exams.attempt',
                'message_forums.send',
                'message_forums.deleteOwn',
                'notes.manage',
                'rag_assistant.use',
                'task_manager.view',
            ],
            'Instructor' => [
                'course_management.create',
                'course_management.viewOwn',
                'course_management.updateOwn',
                'course_clone_archival.clone',
                'syllabus_content.create',
                'syllabus_content.update',
                'syllabus_content.delete',
                'lessons_files.upload',
                'lessons_files.add',
                'lessons_files.update',
                'lessons_files.delete',
                'quizzes_exams.create',
                'quizzes_exams.update',
                'quizzes_exams.viewSubmission',
                'quizzes_exams.gradeSubmission',
                'question_bank.manage',
                'instructor.students.view',
                'instructor.students.message',
                'message_forums.moderateMessage',
            ],
            'Admin' => [
                'dashboard.viewAll',
                'tos_calculations.manage',
                'rag_assistant.train',
                'course_management.viewAll',
                'course_management.updateAll',
                'course_management.deleteAll',
                'course_approval.approve',
                'course_clone_archival.archive',
                'course_clone_archival.restore',
                'course_enrollment.manage',
                'reports.generate',
                'reports.view',
                'user_management.view',
                'user_management.create',
                'user_management.update',
                'user_management.delete',
                'user_management.assignRoles',
                'admin_management.view',
                'admin_management.create',
                'admin_management.update',
                'admin_management.delete',
                'admin_management.assignRoles',
                'settings.update',
                'settings.roles_permissions',
                'file_management.manage',
                'activity_logs.view',
            ],
        ];

        // Step 1: Ensure all permissions exist
        $allPermissions = collect($mapping)->flatten()->unique();
        foreach ($allPermissions as $perm) {
            Permission::firstOrCreate([
                'name' => $perm,
                'guard_name' => 'web',
            ]);
        }

        // Step 2: Create roles & sync permissions
        foreach ($mapping as $roleName => $perms) {
            $role = Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => 'web',
            ], [
                'category' => $roleName,
                'description' => "Default role for {$roleName}",
            ]);

            $role->syncPermissions($perms);
        }

        $this->command->info('Permissions seeded and roles created/updated with their permissions.');
    }
}

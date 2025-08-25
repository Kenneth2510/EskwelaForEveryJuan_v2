<?php

namespace App\Http\Controllers\UserManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserManagement\StoreAdminRequest;
use App\Http\Requests\UserManagement\UpdateAdminRequest;
use App\Models\User;
use App\Services\UserManagement\AdminManagementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminManagementController extends Controller
{

    protected $adminService;

    public function __construct(AdminManagementService $adminService)
    {
        $this->adminService = $adminService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $admins = $this->adminService->getAllAdmins();

        return Inertia::render('userManagement/adminManagement/index', [
            'admins' => $admins,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('userManagement/adminManagement/actions/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAdminRequest $request)
    {
        $this->adminService->createAdmin($request->validated());

        Cache::forget('admin.index');

        return redirect()->route('admin.index')
            ->with('success', 'Admin created successfully.');
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
    public function edit(User $admin)
    {
        $adminDetails = User::with('roles', 'admin')
            ->where('id', $admin->id)
            ->first();

        return Inertia::render('userManagement/adminManagement/actions/edit', [
            'admin' => $adminDetails,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAdminRequest $request, User $admin)
    {
        $admin->load('admin');
        $this->adminService->updateAdmin($admin, $request->validated());

        return redirect()->route('admin.index')
            ->with('success', 'Admin updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $admin)
    {
        $this->adminService->deleteAdmin($admin);

        return redirect()->route('admin.index')
            ->with('success', 'Admin deleted successfully.');
    }

    public function resetPassword(User $admin)
    {
        $this->adminService->resetAdminPassword($admin);

        return redirect()->route('admin.index')
            ->with('success', 'Admin password reset successfully.');
    }

    public function export(Request $request)
    {
        return $this->adminService->export($request);
    }

    public function bulkPage()
    {
        $templateUrl = asset('templates/AdminManagementBulkInsertTemplate.xlsx');

        return Inertia::render('userManagement/adminManagement/actions/bulkUpload', [
            'templateUrl' => $templateUrl,
        ]);
    }

    /**
     * GET /user-management/learner/bulk/template
     * Download template file (or fallback CSV)
     */
    public function downloadTemplate()
    {
        $path = public_path('templates/admins_template.xlsx');

        if (file_exists($path)) {
            return response()->download($path, 'admins_template.xlsx');
        }

        // fallback CSV if XLSX not present
        $csvHeader = implode(',', [
            'fname',
            'mname',
            'lname',
            'bday',
            'email',
            'phone',
            'admin_code',
        ]) . "\n";

        $csvSample = 'Juan,De,la Cruz,2003-04-15,juan@example.com,+639171234567,AD-0001' . "\n";

        return response($csvHeader . $csvSample, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="admins_template.csv"',
        ]);
    }

    /**
     * POST /user-management/learner/bulk/upload
     * Accept file, parse & validate via service, return preview JSON
     */
    public function bulkUpload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        // parseAndValidate should return [$rows, $summary]
        [$rows, $summary] = $this->adminService->parseAndValidate($request->file('file'));

        return response()->json([
            'rows' => $rows,
            'summary' => $summary,
        ]);
    }

    /**
     * POST /user-management/learner/bulk/insert
     * Accept selected validated rows and commit to DB
     */
    public function bulkInsert(Request $request)
    {
        $request->validate([
            'rows' => 'required|array|min:1',
            'rows.*.fname' => ['required', 'regex:/^[A-Za-z\s\-]+$/'],
            'rows.*.mname' => ['nullable', 'regex:/^[A-Za-z\s\-]+$/'],
            'rows.*.lname' => ['required', 'regex:/^[A-Za-z\s\-]+$/'],
            'rows.*.bday' => 'required|date',
            'rows.*.email' => 'required|email',
            'rows.*.phone' => ['required', 'regex:/^\+63\d{10}$/'],
            'rows.*.admin_code' => ['required', 'regex:/^[A-Z0-9\-]+$/'],
        ]);

        $rows = $request->input('rows');

        $inserted = $this->adminService->insertRows($rows);

        // clear cache if you cache the index/listing
        try {
            Cache::forget('admin.index');
        } catch (\Throwable $e) {
            Log::warning('Failed to clear admin.index cache after bulk insert: ' . $e->getMessage());
        }

        return response()->json([
            'message' => "Inserted {$inserted} admin successfully.",
            'inserted' => $inserted,
        ]);
    }
}

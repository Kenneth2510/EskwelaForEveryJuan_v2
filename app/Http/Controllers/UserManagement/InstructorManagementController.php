<?php

namespace App\Http\Controllers\UserManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserManagement\StoreInstructorRequest;
use App\Http\Requests\UserManagement\UpdateInstructorRequest;
use App\Models\User;
use App\Services\UserManagement\InstructorManagementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class InstructorManagementController extends Controller
{
    protected $instructorService;

    public function __construct(InstructorManagementService $instructorService)
    {
        $this->instructorService = $instructorService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $instructors = $this->instructorService->getAllInstructors();

        return Inertia::render('userManagement/instructorManagement/index', [
            'instructors' => $instructors,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
        public function create()
    {
        return Inertia::render('userManagement/instructorManagement/actions/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInstructorRequest $request)
    {
        $this->instructorService->createInstructor($request->validated());

        Cache::forget('instructor.index');

        return redirect()->route('instructor.index')
            ->with('success', 'Instructor created successfully.');
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
    public function edit(User $instructor)
    {
        $instructorDetails = User::with('roles', 'instructor')
            ->where('id', $instructor->id)
            ->first();

        return Inertia::render('userManagement/instructorManagement/actions/edit', [
            'instructor' => $instructorDetails,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInstructorRequest $request, User $instructor)
    {
        $instructor->load('instructor');
        $this->instructorService->updateInstructor($instructor, $request->validated());

        return redirect()->route('instructor.index')
            ->with('success', 'Instructor updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $instructor)
    {
        $this->instructorService->deleteInstructor($instructor);

        return redirect()->route('instructor.index')
            ->with('success', 'Instructor deleted successfully.');
    }

    public function resetPassword(User $instructor)
    {
        $this->instructorService->resetInstructorPassword($instructor);

        return redirect()->route('instructor.index')
            ->with('success', 'Instructor password reset successfully.');
    }

    public function export(Request $request)
    {
        return $this->instructorService->export($request);
    }

    public function bulkPage()
    {
        $templateUrl = asset('templates/InstructorManagementBulkInsertTemplate.xlsx');

        return Inertia::render('userManagement/instructorManagement/actions/bulkUpload', [
            'templateUrl' => $templateUrl,
        ]);
    }

    /**
     * GET /user-management/learner/bulk/template
     * Download template file (or fallback CSV)
     */
    public function downloadTemplate()
    {
        $path = public_path('templates/InstructprManagementBulkInsertTemplate.xlsx');

        if (file_exists($path)) {
            return response()->download($path, 'InstructprManagementBulkInsertTemplate.xlsx');
        }

        // fallback CSV if XLSX not present
        $csvHeader = implode(',', [
            'fname',
            'mname',
            'lname',
            'bday',
            'email',
            'phone',
            'instructor_code',
            'instructor_type',
            'date_started',
        ]) . "\n";

        $csvSample = 'Juan,De,la Cruz,2003-04-15,juan@example.com,+639171234567,INS-2023-001,Part-Time Faculty,2023-08-01' . "\n";

        return response($csvHeader . $csvSample, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="instructors_template.csv"',
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
        [$rows, $summary] = $this->instructorService->parseAndValidate($request->file('file'));

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
            'rows.*.instructor_code' => ['required', 'regex:/^[A-Z0-9\-]+$/'],
            'rows.*.instructor_type' => 'required|string',
            'rows.*.date_started' => 'nullable|date',
        ]);

        $rows = $request->input('rows');

        $inserted = $this->instructorService->insertRows($rows);

        // clear cache if you cache the index/listing
        try {
            Cache::forget('instructor.index');
        } catch (\Throwable $e) {
            Log::warning('Failed to clear instructors.index cache after bulk insert: ' . $e->getMessage());
        }

        return response()->json([
            'message' => "Inserted {$inserted} instructors successfully.",
            'inserted' => $inserted,
        ]);
    }
}


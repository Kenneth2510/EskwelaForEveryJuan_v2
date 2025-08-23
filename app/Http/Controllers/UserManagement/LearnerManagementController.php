<?php

namespace App\Http\Controllers\UserManagement;

use App\Http\Controllers\Controller;
use App\Services\UserManagement\LearnerManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\UserManagement\StoreLearnerRequest;
use App\Http\Requests\UserManagement\UpdateLearnerRequest;
use App\Models\Learner;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class LearnerManagementController extends Controller
{
    protected $learnerService;

    public function __construct(LearnerManagementService $learnerService)
    {
        $this->learnerService = $learnerService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $learners = $this->learnerService->getAllLearners();

        return Inertia::render('userManagement/learnerManagement/index', [
            'learners' => $learners,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('userManagement/learnerManagement/actions/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLearnerRequest $request, LearnerManagementService $learnerService)
    {
        $learnerService->createLearner($request->validated());

        Cache::forget('learner.index');

        return redirect()->route('learner.index')
            ->with('success', 'Learner created successfully.');
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
    public function edit(User $learner)
    {
        $learnerDetails = User::with('roles', 'learner')
            ->where('id', $learner->id)
            ->first();

        return Inertia::render('userManagement/learnerManagement/actions/edit', [
            'learner' => $learnerDetails,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLearnerRequest $request, User $learner, LearnerManagementService $learnerService)
    {
        $learner->load('learner');
        $learnerService->updateLearner($learner, $request->validated());

        return redirect()->route('learner.index')
            ->with('success', 'Learner updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $learner, LearnerManagementService $learnerService)
    {
        $learnerService->deleteLearner($learner);

        return redirect()->route('learner.index')
            ->with('success', 'Learner deleted successfully.');
    }

    public function resetPassword(User $learner, LearnerManagementService $learnerService)
    {
        $learnerService->resetLearnerPassword($learner);

        return redirect()->route('learner.index')
            ->with('success', 'Learner password reset successfully.');
    }

    public function export(Request $request, LearnerManagementService $learnerService)
    {
        return $learnerService->export($request);
    }

    public function bulkPage()
    {
        $templateUrl = asset('templates/LearnerManagementBulkInsertTemplate.xlsx');

        return Inertia::render('userManagement/learnerManagement/actions/bulkUpload', [
            'templateUrl' => $templateUrl,
        ]);
    }

    /**
     * GET /user-management/learner/bulk/template
     * Download template file (or fallback CSV)
     */
    public function downloadTemplate()
    {
        $path = public_path('templates/learners_template.xlsx');

        if (file_exists($path)) {
            return response()->download($path, 'learners_template.xlsx');
        }

        // fallback CSV if XLSX not present
        $csvHeader = implode(',', [
            'fname',
            'mname',
            'lname',
            'bday',
            'email',
            'phone',
            'student_number',
            'course',
            'enrollment_date',
        ]) . "\n";

        $csvSample = 'Juan,De,la Cruz,2003-04-15,juan@example.com,+639171234567,STU-2023-001,BS Information Tech,2023-08-01' . "\n";

        return response($csvHeader . $csvSample, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="learners_template.csv"',
        ]);
    }

    /**
     * POST /user-management/learner/bulk/upload
     * Accept file, parse & validate via service, return preview JSON
     */
    public function bulkUpload(Request $request, LearnerManagementService $learnerService)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        // parseAndValidate should return [$rows, $summary]
        [$rows, $summary] = $learnerService->parseAndValidate($request->file('file'));

        return response()->json([
            'rows' => $rows,
            'summary' => $summary,
        ]);
    }

    /**
     * POST /user-management/learner/bulk/insert
     * Accept selected validated rows and commit to DB
     */
    public function bulkInsert(Request $request, LearnerManagementService $learnerService)
    {
        $request->validate([
            'rows' => 'required|array|min:1',
            'rows.*.fname' => ['required', 'regex:/^[A-Za-z\s\-]+$/'],
            'rows.*.mname' => ['nullable', 'regex:/^[A-Za-z\s\-]+$/'],
            'rows.*.lname' => ['required', 'regex:/^[A-Za-z\s\-]+$/'],
            'rows.*.bday' => 'required|date',
            'rows.*.email' => 'required|email',
            'rows.*.phone' => ['required', 'regex:/^\+63\d{10}$/'],
            'rows.*.student_number' => ['required', 'regex:/^[A-Z0-9\-]+$/'],
            'rows.*.course' => 'required|string',
            'rows.*.enrollment_date' => 'nullable|date',
        ]);

        $rows = $request->input('rows');

        $inserted = $learnerService->insertRows($rows);

        // clear cache if you cache the index/listing
        try {
            Cache::forget('learner.index');
        } catch (\Throwable $e) {
            Log::warning('Failed to clear learner.index cache after bulk insert: ' . $e->getMessage());
        }

        return response()->json([
            'message' => "Inserted {$inserted} learners successfully.",
            'inserted' => $inserted,
        ]);
    }
}

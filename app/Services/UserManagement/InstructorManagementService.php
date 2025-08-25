<?php

namespace App\Services\UserManagement;

use App\Exports\UserManagement\InstructorsExport;
use App\Mail\UserManagement\ResetInstructorPassword;
use App\Mail\UserManagement\SendInstructorCredentials;
use App\Models\Instructor;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Excel as ExcelWriter;
use PhpOffice\PhpSpreadsheet\Shared\Date as PhpSpreadsheetDate;

class InstructorManagementService
{
    /**
     * Create a new class instance.
     */

    protected string $cacheKey = 'instructor_management.all_instructor';
    protected int $cacheTTL = 600;
    /**
     * Create a new class instance.
     */
    public function getAllInstructors()
    {
        return Cache::remember($this->cacheKey, $this->cacheTTL, function () {
            return User::with('roles', 'instructor')
                ->where('category', 'instructor')
                ->latest()
                ->get()
                ->map(function ($instructor) {
                    return [
                        'id' => $instructor->id,
                        'name' => $instructor->fname . ' ' . ($instructor->mname ?? '') . ' ' . $instructor->lname,
                        'email' => $instructor->email,
                        'phone' => $instructor->phone,
                        'status' => $instructor->status,
                        'updated_at' => $instructor->updated_at->format('Y-m-d H:i:s'),
                        'instructor_code' => $instructor->instructor->instructor_code ?? null,
                        'instructor_type' => $instructor->instructor->instructor_type ?? null,
                        'profile_picture' => $instructor->profile_picture,
                    ];
                });
        });
    }

    public function clearCache()
    {
        Cache::forget($this->cacheKey);
    }

    public function createInstructor(array $data): User
    {
        $plainPassword = Str::password(12);

        DB::transaction(function () use ($data, $plainPassword) {
            $user = User::create([
                'fname' => $data['fname'],
                'mname' => $data['mname'] ?? null,
                'lname' => $data['lname'],
                'bday' => $data['bday'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'username' => $data['instructor_code'],
                'category' => 'Instructor',
                'password' => Hash::make($plainPassword),
                'status' => $data['status'] ?? 'active',
            ]);

            $instructor = Instructor::create([
                'user_id' => $user->id,
                'instructor_code' => $data['instructor_code'],
                'instructor_type' => $data['instructor_type'],
                'date_started' => $data['date_started'],
            ]);

            $this->clearCache();

            Mail::to($user->email)
                ->queue(new SendInstructorCredentials($user->email, $plainPassword, $user));
        });

        return User::where('email', $data['email'])->with('instructor')->first();
    }

    public function updateInstructor(User $instructor, array $data)
    {
        DB::transaction(function () use ($instructor, $data) {
            // Update user info
            $instructor->update([
                'fname' => $data['fname'],
                'mname' => $data['mname'] ?? null,
                'lname' => $data['lname'],
                'bday' => $data['bday'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'status' => $data['status'] ?? $instructor->status,
            ]);

            // Update instructor info
            $instructor->instructor->update([
                'instructor_code' => $data['instructor_code'],
                'instructor_type' => $data['instructor_type'],
                'date_started' => $data['date_started'],
            ]);

            $this->clearCache();
        });

        return $instructor;
    }

    public function deleteInstructor($instructor)
    {
        DB::transaction(function () use ($instructor) {
            // Delete instructor info
            $instructor->instructor->delete();

            // Delete user info
            $instructor->delete();

            $this->clearCache();
        });

        return $instructor;
    }

    public function resetInstructorPassword(User $instructor)
    {
        $newPassword = Str::random(12);
        $instructor->update(['password' => Hash::make($newPassword)]);

        Mail::to($instructor->email)
            ->queue(new ResetInstructorPassword($instructor->email, $newPassword, $instructor));

        return $instructor;
    }

    public function export(Request $request)
    {
        Log::info('Exporting instructors', [
            'request' => $request->all(),
        ]);

        $format = strtolower((string) ($request->get('format') ?? $request->input('exportType') ?? 'csv'));

        $sortBy = (string) ($request->get('sortBy') ?? $request->input('sortBy') ?? '');
        $sortDir = $request->get('sortDir') ?? $request->input('sortDir') ?? false;
        $sortDir = $sortDir ? 'DESC' : 'ASC';

        $filter = (string) ($request->get('filter') ?? $request->input('searchVal') ?? '');

        // Start building query
        $query = \App\Models\Instructor::query();

        $query->with('user')
            ->when($filter, function ($q) use ($filter) {
                $q->where(function ($sub) use ($filter) {
                    $sub->where('instructor_code', 'like', "%{$filter}%")
                        ->orWhere('instructor_type', 'like', "%{$filter}%")
                        ->orWhereHas('user', function ($uq) use ($filter) {
                            $uq->where('fname', 'like', "%{$filter}%")
                                ->orWhere('lname', 'like', "%{$filter}%")
                                ->orWhere('email', 'like', "%{$filter}%")
                                ->orWhere('status', 'like', "%{$filter}%");
                        });
                });
            });

        $allowed = ['instructor_code', 'name', 'email', 'instructor_type', 'status', 'created_at'];

        if (empty($sortBy) || ! in_array($sortBy, $allowed)) {
            $sortBy = 'created_at';
            $sortDir = 'DESC';
        }

        if ($sortBy === 'name') {
            $query->join('users', 'instructors.user_id', '=', 'users.id')
                ->select('instructors.*')
                ->orderBy('users.fname', $sortDir)
                ->orderBy('users.lname', $sortDir);
        } elseif (in_array($sortBy, ['email', 'status'])) {
            $userCol = $sortBy;
            $query->join('users', 'instructors.user_id', '=', 'users.id')
                ->select('instructors.*')
                ->orderBy("users.{$userCol}", $sortDir);
        } else {
            $query->orderBy($sortBy, $sortDir);
        }

        // Final results
        $instructors = $query->latest('created_at')->get();

        Log::info('Instructors exported', [
            'format' => $format,
            'filter' => $filter,
            'total'  => $instructors->count(),
            // optionally log only IDs or a small sample to avoid huge logs
            'sample_ids' => $instructors->pluck('id')->take(10),
        ]);

        switch ($format) {
            case 'xlsx':
                return Excel::download(new InstructorsExport($instructors), 'instructors.xlsx', ExcelWriter::XLSX);

            case 'pdf':
                $pdf = Pdf::loadView('exports.userManagement.instructorExport', [
                    'instructors' => $instructors,
                ])->setPaper('a4', 'portrait');

                return response($pdf->output(), 200)
                    ->header('Content-Type', 'application/pdf')
                    ->header('Content-Disposition', 'inline; filename="instructors.pdf"');

            case 'csv':
            default:
                // For CSV, pass writer type and headers (UTF-8 charset helps Excel clients)
                $csvHeaders = [
                    'Content-Type' => 'text/csv; charset=UTF-8',
                    // Add BOM for Excel if needed by client: 'Content-Encoding' => 'utf-8' (but package handles most cases)
                ];
                return Excel::download(new InstructorsExport($instructors), 'instructors.csv', ExcelWriter::CSV, $csvHeaders);
        }
    }
    public function parseAndValidate(UploadedFile $file): array
    {
        // Read sheets as arrays (first sheet expected)
        $sheets = Excel::toArray(null, $file);
        if (empty($sheets) || empty($sheets[0])) {
            return [
                [],
                ['total' => 0, 'valid' => 0, 'invalid' => 0],
            ];
        }

        $rows = $sheets[0];

        // Normalize header keys (lowercase, trim)
        $rawHeader = $rows[0] ?? [];
        $header = array_map(fn($v) => strtolower(trim((string)$v)), $rawHeader);

        $dataRows = array_slice($rows, 1);

        // Load existing unique values for checks
        $existingInstructorNumbers = Instructor::pluck('instructor_code')->map(fn($v) => (string)$v)->all();
        $existingEmails = User::pluck('email')->map(fn($v) => (string)$v)->all();
        $existingPhones = User::pluck('phone')->map(fn($v) => (string)$v)->all();

        $seenInstructorCodes = [];
        $seenEmails = [];
        $seenPhones = [];

        $parsed = [];
        $rowNumber = 2; // header is row 1

        foreach ($dataRows as $raw) {
            // build assoc by header
            $assoc = [];
            foreach ($header as $i => $key) {
                $assoc[$key] = isset($raw[$i]) ? trim((string)$raw[$i]) : null;
            }

            // Map common variations
            $fname = $assoc['fname'] ?? $assoc['first_name'] ?? $assoc['first name'] ?? null;
            $mname = $assoc['mname'] ?? $assoc['middle_name'] ?? $assoc['middle name'] ?? null;
            $lname = $assoc['lname'] ?? $assoc['last_name'] ?? $assoc['last name'] ?? null;
            $bdayRaw = $assoc['bday'] ?? $assoc['birthday'] ?? $assoc['birthdate'] ?? null;
            $email = $assoc['email'] ?? null;
            $phoneRaw = $assoc['phone'] ?? $assoc['contact'] ?? null;
            $instructorCode = $assoc['instructor_code'] ?? $assoc['instructor code'] ?? null;
            $instructorType = $assoc['instructor_type'] ?? $assoc['instructor type'] ?? null;
            $dateStarted = $assoc['date_started'] ?? $assoc['date started'] ?? null;

            //
            // --- Normalize birthday (handle Excel serials like 37726 and string formats) ---
            //
            $normalizedBday = null;

            if (!empty($bdayRaw)) {
                // If the cell is numeric (Excel date serial)
                if (is_numeric($bdayRaw)) {
                    try {
                        // convert excel serial to DateTime
                        $dt = PhpSpreadsheetDate::excelToDateTimeObject((float) $bdayRaw);
                        $normalizedBday = $dt->format('Y-m-d');
                    } catch (\Throwable $e) {
                        // fallback to null (validation will catch)
                        $normalizedBday = null;
                    }
                } else {
                    // Try several common formats first
                    $formats = ['Y-m-d', 'd/m/Y', 'd-m-Y', 'm/d/Y', 'd M Y'];
                    foreach ($formats as $fmt) {
                        try {
                            $dt = Carbon::createFromFormat($fmt, $bdayRaw);
                            if ($dt !== false) {
                                $normalizedBday = $dt->format('Y-m-d');
                                break;
                            }
                        } catch (\Throwable $e) {
                            // try next format
                        }
                    }

                    // Last resort: try Carbon::parse which handles many human formats
                    if (is_null($normalizedBday)) {
                        try {
                            $dt = Carbon::parse($bdayRaw);
                            $normalizedBday = $dt->format('Y-m-d');
                        } catch (\Throwable $e) {
                            $normalizedBday = null;
                        }
                    }
                }
            }

            // Normalize phone to +63##########
            $normalizedPhone = null;
            if (!empty($phoneRaw)) {
                $digits = preg_replace('/\D+/', '', $phoneRaw); // keep digits only

                if (Str::startsWith($phoneRaw, '+')) {
                    if (Str::startsWith($phoneRaw, '+63')) {
                        $digitsOnly = preg_replace('/\D+/', '', $phoneRaw);
                        if (strlen($digitsOnly) === 12) {
                            $normalizedPhone = '+' . $digitsOnly;
                        }
                    }
                } else {
                    if (strlen($digits) === 11 && Str::startsWith($digits, '09')) {
                        $normalizedPhone = '+63' . substr($digits, 1);
                    } elseif (strlen($digits) === 12 && Str::startsWith($digits, '63')) {
                        $normalizedPhone = '+' . $digits;
                    } elseif (strlen($digits) === 10) {
                        $normalizedPhone = '+63' . $digits;
                    }
                }
            }

            // Validate using StoreLearnerRequest rules (mirrored)
            $validator = Validator::make([
                'fname' => $fname,
                'mname' => $mname,
                'lname' => $lname,
                'bday' => $normalizedBday,
                'email' => $email,
                'phone' => $normalizedPhone,
                'instructor_code' => $instructorCode,
                'instructor_type' => $instructorType,
                'date_started' => $dateStarted,
            ], [
                'fname' => ['required', 'regex:/^[A-Za-z\s\-]+$/'],
                'mname' => ['nullable', 'regex:/^[A-Za-z\s\-]+$/'],
                'lname' => ['required', 'regex:/^[A-Za-z\s\-]+$/'],
                'bday' => ['required', 'date'],
                'email' => ['required', 'email'],
                'phone' => ['required', 'regex:/^\+63\d{10}$/'],
                'instructor_code' => ['required', 'regex:/^[A-Z0-9\-]+$/'],
                'instructor_type' => ['required', 'string'],
                'date_started' => ['nullable', 'date'],
            ]);

            $errors = $validator->errors()->all();

            // uniqueness checks
            if ($email) {
                if (in_array($email, $existingEmails, true)) {
                    $errors[] = 'Email already exists in system.';
                }
                if (in_array($email, $seenEmails, true)) {
                    $errors[] = 'Duplicate email in file.';
                } else {
                    $seenEmails[] = $email;
                }
            }

            if ($normalizedPhone) {
                if (in_array($normalizedPhone, $existingPhones, true)) {
                    $errors[] = 'Phone number already exists in system.';
                }
                if (in_array($normalizedPhone, $seenPhones, true)) {
                    $errors[] = 'Duplicate phone number in file.';
                } else {
                    $seenPhones[] = $normalizedPhone;
                }
            } else {
                // if the file provided a phone but we couldn't normalize it, flag it
                if (!empty($phoneRaw)) {
                    $errors[] = 'Phone format not recognized. Use +63XXXXXXXXXX or 09XXXXXXXXX.';
                }
            }

            if ($instructorCode) {
                if (in_array($instructorCode, $existingInstructorNumbers, true)) {
                    $errors[] = 'Instructor Code already exists in system.';
                }
                if (in_array($instructorCode, $seenInstructorCodes, true)) {
                    $errors[] = 'Duplicate student number in file.';
                } else {
                    $seenInstructorCodes[] = $instructorCode;
                }
            }

            $parsed[] = [
                'row' => $rowNumber,
                'fname' => $fname,
                'mname' => $mname,
                'lname' => $lname,
                'bday_raw' => $bdayRaw,
                'bday' => $normalizedBday,
                'email' => $email,
                'phone' => $normalizedPhone,
                'phone_raw' => $phoneRaw,
                'instructor_code' => $instructorCode,
                'instructor_type' => $instructorType,
                'date_started' => $dateStarted,
                'valid' => count($errors) === 0,
                'errors' => $errors,
            ];

            $rowNumber++;
        }

        $summary = [
            'total' => count($parsed),
            'valid' => collect($parsed)->where('valid', true)->count(),
            'invalid' => collect($parsed)->where('valid', false)->count(),
        ];

        return [$parsed, $summary];
    }

    public function insertRows(array $rows): int
    {
        $inserted = 0;

        foreach ($rows as $r) {
            // Defensive: ensure required fields exist
            if (empty($r['fname']) || empty($r['lname']) || empty($r['email']) || empty($r['phone']) || empty($r['instructor_code'])) {
                Log::warning('Skipping row during bulk insert due to missing fields', $r);
                continue;
            }

            // Defensive uniqueness checks to avoid DB exceptions:
            $emailExists = User::where('email', $r['email'])->exists();
            $phoneExists = User::where('phone', $r['phone'])->exists();
            $instructorExists = Instructor::where('instructor_code', $r['instructor_code'])->exists();

            if ($emailExists || $phoneExists || $instructorExists) {
                $reasons = [];
                if ($emailExists) $reasons[] = 'email already exists';
                if ($phoneExists) $reasons[] = 'phone already exists';
                if ($instructorExists) $reasons[] = 'instructor code already exists';
                Log::warning('Skipping row during bulk insert due to uniqueness conflict: ' . implode(', ', $reasons), $r);
                continue;
            }

            try {
                // Prepare payload in the exact shape your createLearner expects.
                $payload = [
                    'fname' => $r['fname'],
                    'mname' => $r['mname'] ?? null,
                    'lname' => $r['lname'],
                    'bday' => $r['bday'] ?? null,
                    'email' => $r['email'],
                    'phone' => $r['phone'],
                    'instructor_code' => $r['instructor_code'],
                    'instructor_type' => $r['instructor_type'] ?? null,
                    'date_started' => $r['date_started'] ?? null,
                    'status' => $r['status'] ?? 'active',
                ];

                // Reuse createLearner so behavior (password/email/cache) matches single create.
                // createLearner() internally queues the SendLearnerCredentials mail.
                $this->createInstructor($payload);

                $inserted++;
            } catch (\Throwable $e) {
                Log::error('Bulk insert failed for row: ' . $e->getMessage(), $r);
                // continue with next row (do not break the whole batch)
                continue;
            }
        }

        return $inserted;
    }
}


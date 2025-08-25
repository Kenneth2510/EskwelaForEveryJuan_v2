<?php

namespace App\Services\UserManagement;

use App\Exports\UserManagement\AdminsExport;
use App\Mail\UserManagement\ResetAdminCredentials;
use App\Mail\UserManagement\SendAdminCredentials;
use App\Models\Admin;
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


class AdminManagementService
{
    protected string $cacheKey = 'admin_management.all_admins';
    protected int $cacheTTL = 600;
    /**
     * Create a new class instance.
     */
    public function getAllAdmins()
    {
        return Cache::remember($this->cacheKey, $this->cacheTTL, function () {
            return User::with('roles', 'admin')
                ->where('category', 'admin')
                ->latest()
                ->get()
                ->map(function ($admin) {
                    return [
                        'id' => $admin->id,
                        'name' => $admin->fname . ' ' . ($admin->mname ?? '') . ' ' . $admin->lname,
                        'email' => $admin->email,
                        'phone' => $admin->phone,
                        'status' => $admin->status,
                        'updated_at' => $admin->updated_at->format('Y-m-d H:i:s'),
                        'admin_code' => $admin->admin->admin_code ?? null,
                        'profile_picture' => $admin->profile_picture,
                    ];
                });
        });
    }

    public function clearCache()
    {
        Cache::forget($this->cacheKey);
    }

    public function createAdmin(array $data): User
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
                'username' => $data['admin_code'],
                'category' => 'admin',
                'password' => Hash::make($plainPassword),
                'status' => $data['status'] ?? 'active',
            ]);

            $admin = Admin::create([
                'user_id' => $user->id,
                'admin_code'=> $data['admin_code'],
            ]);

            $this->clearCache();

            Mail::to($user->email)
                ->queue(new SendAdminCredentials($user->email, $plainPassword, $user));
        });

        return User::where('email', $data['email'])->with('admin')->first();
    }

    public function updateAdmin(User $admin, array $data)
    {
        DB::transaction(function () use ($admin, $data) {
            // Update user info
            $admin->update([
                'fname' => $data['fname'],
                'mname' => $data['mname'] ?? null,
                'lname' => $data['lname'],
                'bday' => $data['bday'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'status' => $data['status'] ?? $admin->status,
            ]);

            // Update admin info
            $admin->admin->update([
                'admin_code' => $data['admin_code'],
            ]);

            $this->clearCache();
        });

        return $admin;
    }

    public function deleteAdmin($admin)
    {
        DB::transaction(function () use ($admin) {
            // Delete admin info
            $admin->admin->delete();

            // Delete user info
            $admin->delete();

            $this->clearCache();
        });

        return $admin;
    }

    public function resetAdminPassword(User $admin)
    {
        $newPassword = Str::random(12);
        $admin->update(['password' => Hash::make($newPassword)]);

        Mail::to($admin->email)
            ->queue(new ResetAdminCredentials($admin->email, $newPassword, $admin));

        return $admin;
    }

    public function export(Request $request)
    {
        Log::info('Exporting admins', [
            'request' => $request->all(),
        ]);

        $format = strtolower((string) ($request->get('format') ?? $request->input('exportType') ?? 'csv'));

        $sortBy = (string) ($request->get('sortBy') ?? $request->input('sortBy') ?? '');
        $sortDir = $request->get('sortDir') ?? $request->input('sortDir') ?? false;
        $sortDir = $sortDir ? 'DESC' : 'ASC';

        $filter = (string) ($request->get('filter') ?? $request->input('searchVal') ?? '');

        // Start building query
        $query = \App\Models\Admin::query();

        $query->with('user')
            ->when($filter, function ($q) use ($filter) {
                $q->where(function ($sub) use ($filter) {
                    $sub->where('admin_code', 'like', "%{$filter}%")
                        ->orWhereHas('user', function ($uq) use ($filter) {
                            $uq->where('fname', 'like', "%{$filter}%")
                                ->orWhere('lname', 'like', "%{$filter}%")
                                ->orWhere('email', 'like', "%{$filter}%")
                                ->orWhere('status', 'like', "%{$filter}%");
                        });
                });
            });

        $allowed = ['admin_code', 'name', 'email', 'status', 'created_at'];

        if (empty($sortBy) || ! in_array($sortBy, $allowed)) {
            $sortBy = 'created_at';
            $sortDir = 'DESC';
        }

        if ($sortBy === 'name') {
            $query->join('users', 'admins.user_id', '=', 'users.id')
                ->select('admins.*')
                ->orderBy('users.fname', $sortDir)
                ->orderBy('users.lname', $sortDir);
        } elseif (in_array($sortBy, ['email', 'status'])) {
            $userCol = $sortBy;
            $query->join('users', 'admins.user_id', '=', 'users.id')
                ->select('admins.*')
                ->orderBy("users.{$userCol}", $sortDir);
        } else {
            $query->orderBy($sortBy, $sortDir);
        }

        // Final results
        $admins = $query->latest('created_at')->get();

        Log::info('admins exported', [
            'format' => $format,
            'filter' => $filter,
            'total'  => $admins->count(),
            // optionally log only IDs or a small sample to avoid huge logs
            'sample_ids' => $admins->pluck('id')->take(10),
        ]);

        switch ($format) {
            case 'xlsx':
                return Excel::download(new AdminsExport($admins), 'admins.xlsx', ExcelWriter::XLSX);

            case 'pdf':
                $pdf = Pdf::loadView('exports.userManagement.adminExport', [
                    'admins' => $admins,
                ])->setPaper('a4', 'portrait');

                return response($pdf->output(), 200)
                    ->header('Content-Type', 'application/pdf')
                    ->header('Content-Disposition', 'inline; filename="admins.pdf"');

            case 'csv':
            default:
                // For CSV, pass writer type and headers (UTF-8 charset helps Excel clients)
                $csvHeaders = [
                    'Content-Type' => 'text/csv; charset=UTF-8',
                    // Add BOM for Excel if needed by client: 'Content-Encoding' => 'utf-8' (but package handles most cases)
                ];
                return Excel::download(new AdminsExport($admins), 'admins.csv', ExcelWriter::CSV, $csvHeaders);
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
        $existingAdminNumbers = Admin::pluck('admin_code')->map(fn($v) => (string)$v)->all();
        $existingEmails = User::pluck('email')->map(fn($v) => (string)$v)->all();
        $existingPhones = User::pluck('phone')->map(fn($v) => (string)$v)->all();

        $seenAdminNumbers = [];
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
            $adminCode = $assoc['admin_code'] ?? $assoc['admin code'] ?? null;

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

            // Validate using StoreadminRequest rules (mirrored)
            $validator = Validator::make([
                'fname' => $fname,
                'mname' => $mname,
                'lname' => $lname,
                'bday' => $normalizedBday,
                'email' => $email,
                'phone' => $normalizedPhone,
                'admin_code' => $adminCode,
            ], [
                'fname' => ['required', 'regex:/^[A-Za-z\s\-]+$/'],
                'mname' => ['nullable', 'regex:/^[A-Za-z\s\-]+$/'],
                'lname' => ['required', 'regex:/^[A-Za-z\s\-]+$/'],
                'bday' => ['required', 'date'],
                'email' => ['required', 'email'],
                'phone' => ['required', 'regex:/^\+63\d{10}$/'],
                'admin_code' => ['required', 'regex:/^[A-Z0-9\-]+$/'],
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

            if ($adminCode) {
                if (in_array($adminCode, $existingAdminNumbers, true)) {
                    $errors[] = 'Admin code already exists in system.';
                }
                if (in_array($adminCode, $seenAdminNumbers, true)) {
                    $errors[] = 'Duplicate admin code in file.';
                } else {
                    $seenAdminNumbers[] = $adminCode;
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
                'admin_code' => $adminCode,
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
            if (empty($r['fname']) || empty($r['lname']) || empty($r['email']) || empty($r['phone']) || empty($r['admin_code'])) {
                Log::warning('Skipping row during bulk insert due to missing fields', $r);
                continue;
            }

            // Defensive uniqueness checks to avoid DB exceptions:
            $emailExists = User::where('email', $r['email'])->exists();
            $phoneExists = User::where('phone', $r['phone'])->exists();
            $adminExists = admin::where('admin_code', $r['admin_code'])->exists();

            if ($emailExists || $phoneExists || $adminExists) {
                $reasons = [];
                if ($emailExists) $reasons[] = 'email already exists';
                if ($phoneExists) $reasons[] = 'phone already exists';
                if ($adminExists) $reasons[] = 'admin code already exists';
                Log::warning('Skipping row during bulk insert due to uniqueness conflict: ' . implode(', ', $reasons), $r);
                continue;
            }

            try {
                // Prepare payload in the exact shape your createadmin expects.
                $payload = [
                    'fname' => $r['fname'],
                    'mname' => $r['mname'] ?? null,
                    'lname' => $r['lname'],
                    'bday' => $r['bday'] ?? null,
                    'email' => $r['email'],
                    'phone' => $r['phone'],
                    'admin_code' => $r['admin_code'],
                    'status' => $r['status'] ?? 'active',
                ];

                // Reuse createadmin so behavior (password/email/cache) matches single create.
                // createadmin() internally queues the SendadminCredentials mail.
                $this->createAdmin($payload);

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

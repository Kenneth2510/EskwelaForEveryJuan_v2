<?php
// app/Exports/UserManagement/adminsExport.php

namespace App\Exports\UserManagement;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Events\AfterSheet;
use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class AdminsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithEvents, WithColumnFormatting
{
    protected Collection $admins;

    public function __construct(Collection $admins)
    {
        $this->admins = $admins;
    }

    /**
     * Return a collection for export; WithMapping will map each row.
     */
    public function collection()
    {
        // Return raw collection — mapping is handled in map()
        return $this->admins;
    }

    /**
     * Map each admin to the desired row order/values.
     */
    public function map($admin): array
    {
        $user = $admin->user ?? null;

        // admin_name: combine names (first, middle (if available), last)
        $adminName = 'N/A';
        if ($user) {
            $parts = [];
            if (!empty($user->fname)) $parts[] = $user->fname;
            if (!empty($user->mname)) $parts[] = $user->mname;
            if (!empty($user->lname)) $parts[] = $user->lname;
            $adminName = trim(implode(' ', $parts)) ?: 'N/A';
        }


        // phone: try common properties and ensure string
        $phone = (string) ($user->phone ?? $user->mobile ?? '');

        // If phone starts with +63, replace with 0
        if (strpos($phone, '+63') === 0) {
            $phone = '0' . substr($phone, 3);
        }
        // status: use user's status (fallback to empty string)
        $status = $user->status ?? '';

        return [
            // keep keys lowercased like you requested
            'admin_code'   => (string) ($admin->admin_code ?? ''), // force string
            'admin_name'     => $adminName,
            'email'            => $user->email ?? '',
            'phone'            => $phone,
            'status'           => $status,
        ];
    }

    /**
     * Headings for the exported file — exact column names you requested.
     */
    public function headings(): array
    {
        return [
            'admin_code',
            'admin_name',
            'email',
            'phone',
            'status',
        ];
    }

    /**
     * Column formats for Excel (force text on A and F).
     */
    public function columnFormats(): array
    {
        return [
            'A' => NumberFormat::FORMAT_TEXT, // admin_number
            'F' => NumberFormat::FORMAT_TEXT, // phone
        ];
    }

    /**
     * Excel event hooks for styling (applies to XLSX export).
     */
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                // Determine used range
                $highestRow = $sheet->getHighestRow();
                $highestColumn = $sheet->getHighestColumn();
                $range = "A1:{$highestColumn}{$highestRow}";

                // --- Header styling (row 1) ---
                // Brand color header (use your brand color or change as needed)
                $headerBg = '991B1B'; // your brand red from PDF template
                $sheet->getStyle('A1:G1')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'color' => ['rgb' => 'FFFFFF'],
                        'size' => 12,
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => $headerBg],
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);

                // Freeze header row
                $sheet->freezePane('A2');

                // Apply autofilter for the whole header row
                $sheet->setAutoFilter("A1:G{$highestRow}");

                // --- Borders for entire range ---
                $sheet->getStyle($range)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => 'E6E9EE'],
                        ],
                    ],
                ]);

                // --- Alternating row background (subtle) ---
                // Start from row 2 (data rows) to highestRow
                for ($row = 2; $row <= $highestRow; $row++) {
                    if ($row % 2 === 0) {
                        // apply a light background for even rows
                        $sheet->getStyle("A{$row}:G{$row}")->applyFromArray([
                            'fill' => [
                                'fillType' => Fill::FILL_SOLID,
                                'startColor' => ['rgb' => 'FBFCFD'], // subtle light fill
                            ],
                        ]);
                    }
                }

                // --- Column alignments / widths tweaks ---
                // Center status column
                $sheet->getStyle("G2:G{$highestRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

                // Optionally set wrap for long text columns (name, course)
                $sheet->getStyle("B2:B{$highestRow}")->getAlignment()->setWrapText(true);
                $sheet->getStyle("C2:C{$highestRow}")->getAlignment()->setWrapText(true);

                // Ensure admin Number and Phone are explicitly text values by prefixing with apostrophe
                // (We already cast them to string and set columnFormats to TEXT; this is an extra safe step.)
                // Loop rows to ensure these cells are treated as strings:
                for ($row = 2; $row <= $highestRow; $row++) {
                    // Prepend apostrophe only if not already starting with one (avoid double)
                    $adminCell = "A{$row}";
                    $phoneCell = "F{$row}";

                    $adminVal = (string) $sheet->getCell($adminCell)->getValue();
                    if ($adminVal !== '' && $adminVal[0] !== "'") {
                        $sheet->setCellValueExplicit($adminCell, $adminVal, \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
                    }

                    $phoneVal = (string) $sheet->getCell($phoneCell)->getValue();
                    if ($phoneVal !== '' && $phoneVal[0] !== "'") {
                        $sheet->setCellValueExplicit($phoneCell, $phoneVal, \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
                    }
                }
            },
        ];
    }
}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Students Directory Report</title>
    <style>
        /* Basic reset */
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; }
        html, body { height: 100%; }

        /* Use a plain sans-serif stack for DomPDF */
        body {
            font-family: Arial, Helvetica, sans-serif;
            color: #333333;
            font-size: 12px;
            line-height: 1.3;
            margin: 5px;
        }

        /* Page setup */
        @page {
            margin: 18mm 18mm 20mm 18mm; /* top right bottom left */
            size: A4;
        }

        /* Header */
        .report-header {
            padding: 12px 10px;
            border-bottom: 2px solid #E6E9EE;
            margin-bottom: 14px;
            display: block;
        }

        .header-inner {
            /* Use table-layout to keep compatibility with DomPDF */
            display: table;
            width: 100%;
            table-layout: fixed;
        }

        .brand {
            display: table-cell;
            width: 38%;
            vertical-align: middle;
        }

        .brand .logo {
            width: 64px;
            height: 64px;
            border-radius: 8px;
            background: #991B1B;
            display: inline-block;
            text-align:center;
            line-height:64px;
            color: #fff;
            font-weight: 700;
            font-size: 28px;
        }

        .title {
            display: table-cell;
            vertical-align: middle;
            width: 62%;
            padding-left: 12px;
        }

        .title h1 {
            font-size: 20px;
            color: #111827;
            margin-bottom: 4px;
        }

        .title p {
            font-size: 12px;
            color: #6B7280;
        }

        /* Summary cards */
        .summary {
            margin-top: 12px;
            margin-bottom: 18px;
            display: table;
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
        }

        .card {
            display: table-cell;
            padding: 10px;
            vertical-align: middle;
            background: #FFFFFF;
            border: 1px solid #E6E9EE;
            border-radius: 6px;
            margin-right: 10px;
        }

        .card + .card { margin-left: 12px; }

        .kpi {
            font-size: 18px;
            font-weight: 700;
            color: #111827;
        }

        .kpi-label {
            font-size: 11px;
            color: #6B7280;
            margin-top: 4px;
        }

        /* Table container */
        .table-wrap {
            border: 1px solid #E6E9EE;
            border-radius: 6px;
            overflow: hidden;
            margin-bottom: 18px;
        }

        table.report-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
        }

        table.report-table thead {
            background: #991B1B;
            color: #ffffff;
        }

        table.report-table thead th {
            padding: 10px 8px;
            text-align: left;
            font-weight: 700;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }

        table.report-table tbody td {
            padding: 9px 8px;
            border-bottom: 1px solid #EEF2F6;
            vertical-align: middle;
        }

        table.report-table tbody tr:nth-child(even) {
            background: #FBFCFD;
        }

        .student-number { color: #991B1B; font-weight: 600; font-size: 11px; }
        .student-name { font-weight: 600; color: #111827; }
        .meta { color: #6B7280; font-size: 11px; }
        .small { font-size: 10px; color: #6B7280; }

        /* Status pills */
        .pill {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }
        .pill.active { background: #DCFCE7; color: #166534; }
        .pill.inactive { background: #FEE2E2; color: #991B1B; }
        .pill.pending { background: #FEF3C7; color: #92400E; }

        /* Footer (fixed) */
        .report-footer {
            position: fixed;
            bottom: 6mm;
            left: 18mm;
            right: 18mm;
            height: 16px;
            font-size: 10px;
            color: #6B7280;
            border-top: 1px solid #E6E9EE;
            padding-top: 6px;
            text-align: center;
        }

        /* Page numbering - DomPDF supports counters */
        .pagenum:before { content: "Page " counter(page) " of " counter(pages); }

        /* Keep rows from breaking across pages awkwardly */
        tr { page-break-inside: avoid; page-break-after: auto; }
        thead { display: table-header-group; }
        tfoot { display: table-footer-group; }

        /* Responsive/print adjustments */
        @media print {
            body { -webkit-print-color-adjust: exact; color-adjust: exact; }
        }
    </style>
</head>
<body>
    @php
        // Counts
        $total = is_countable($learners) ? count($learners) : 0;
        $active = 0; $inactive = 0; $pending = 0;
        foreach ($learners as $l) {
            $status = optional($l->user)->status ? strtolower(optional($l->user)->status) : 'inactive';
            if ($status === 'active') $active++;
            elseif ($status === 'pending') $pending++;
            else $inactive++;
        }
    @endphp

    <!-- Header -->
    <header class="report-header">
        <div class="header-inner">
            <div class="brand">
                <div class="logo">S</div>
            </div>
            <div class="title">
                <h1>Students Directory — Report</h1>
                <p>Generated: {{ date('F d, Y \a\t H:i') }} · Total: <strong>{{ $total }}</strong></p>
            </div>
        </div>

        <!-- Summary KPIs -->
        <div class="summary" style="margin-top:12px;">
            <div class="card" style="width: 32%;">
                <div class="kpi">{{ $total }}</div>
                <div class="kpi-label">Total Students</div>
            </div>

            <div class="card" style="width: 32%;">
                <div class="kpi">{{ $active }}</div>
                <div class="kpi-label">Active</div>
            </div>

            <div class="card" style="width: 32%;">
                <div class="kpi">{{ $inactive }}</div>
                <div class="kpi-label">Inactive / Others</div>
            </div>
        </div>
    </header>

    <main>
        @if($total > 0)
            <div class="table-wrap">
                <table class="report-table" cellpadding="0" cellspacing="0" role="table" aria-label="Students">
                    <thead>
                        <tr>
                            <th style="width:14%;">Student No.</th>
                            <th style="width:28%;">Name</th>
                            <th style="width:22%;">Course</th>
                            <th style="width:18%;">Contact</th>
                            <th style="width:18%;">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        @foreach($learners as $learner)
                            <tr>
                                <td class="student-number">{{ $learner->student_number ?? 'N/A' }}</td>

                                <td class="student-name">
                                    @if(optional($learner->user))
                                        {{ trim((optional($learner->user)->fname ?? '') . ' ' . (optional($learner->user)->mname ? optional($learner->user)->mname . ' ' : '') . (optional($learner->user)->lname ?? '')) }}
                                    @else
                                        N/A
                                    @endif
                                </td>

                                <td>
                                    <div>{{ $learner->course ?? 'N/A' }}</div>
                                    <div class="small">Enrolled: {{ $learner->enrollment_date ? \Illuminate\Support\Carbon::parse($learner->enrolled_date)->format('M d, Y') : (isset($learner->enrolled_at) && $learner->enrolled_at ? $learner->enrolled_at->format('M d, Y') : 'N/A') }}</div>
                                </td>

                                <td>
                                    <div class="meta">{{ optional($learner->user)->email ?? 'N/A' }}</div>
                                    <div class="meta">{{ optional($learner->user)->phone ?? 'N/A' }}</div>
                                </td>

                                <td>
                                    @php $st = strtolower(optional($learner->user)->status ?? 'inactive'); @endphp
                                    <span class="pill {{ $st }}">{{ ucfirst($st) }}</span>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div style="padding:28px; text-align:center; color:#6B7280;">
                <div style="font-size:40px; opacity:0.25; margin-bottom:6px;">👥</div>
                <h3 style="margin-bottom:6px;">No students found</h3>
                <p>No students match the current criteria.</p>
            </div>
        @endif
    </main>

    <!-- Footer -->
    <footer class="report-footer">
        <span class="pagenum"></span> · Student Management System · © {{ date('Y') }}
    </footer>
</body>
</html>

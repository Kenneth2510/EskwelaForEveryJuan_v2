import MySwal from '@/components/swal-alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { AlertCircle, CheckCircle2, ChevronLeft, FileSpreadsheet, Loader2, UploadCloud } from 'lucide-react';
import React, { useMemo, useState } from 'react';

type PreviewRow = {
    row: number;
    fname?: string | null;
    mname?: string | null;
    lname?: string | null;
    bday?: string | null;
    email?: string | null;
    phone?: string | null; // normalized phone (+63...)
    phone_raw?: string | null; // original value from file (optional)
    student_number?: string | null;
    course?: string | null;
    enrollment_date?: string | null;
    valid: boolean;
    errors: string[];
    checked?: boolean;
};

type PageProps = {
    templateUrl: string;
};

export default function BulkUpload({ templateUrl }: PageProps) {
    const [file, setFile] = useState<File | null>(null);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [rows, setRows] = useState<PreviewRow[]>([]);
    const [committing, setCommitting] = useState(false);

    const summary = useMemo(() => {
        const total = rows.length;
        const valid = rows.filter((r) => r.valid).length;
        const selected = rows.filter((r) => r.valid && r.checked).length;
        const invalid = total - valid;
        return { total, valid, invalid, selected };
    }, [rows]);

    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0] ?? null;
        setFile(f);
    }

    async function handlePreview(e: React.FormEvent) {
        e.preventDefault();
        if (!file) {
            MySwal.fire({ icon: 'warning', title: 'No file selected', text: 'Please choose an .xlsx file first.' });
            return;
        }
        const form = new FormData();
        form.append('file', file);

        setLoadingPreview(true);
        try {
            // <- backend expects /user-management/learner/bulk/upload
            const { data } = await axios.post('/user-management/learner/bulk/upload', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // parser returns rows in the shape we agreed on; mark checked if valid
            const withCheck = (data.rows as PreviewRow[]).map((r) => ({ ...r, checked: r.valid }));
            setRows(withCheck);

            MySwal.fire({
                icon: 'success',
                title: 'File loaded',
                text: `Found ${withCheck.length} rows. ${withCheck.filter((r) => r.valid).length} valid.`,
                timer: 1600,
                showConfirmButton: false,
                background: 'var(--background)',
                color: 'var(--foreground)',
            });
        } catch (err: any) {
            const msg = err?.response?.data?.errors ? JSON.stringify(err.response.data.errors) : (err?.response?.data?.message ?? 'Preview failed');
            MySwal.fire({ icon: 'error', title: 'Preview failed', text: msg });
        } finally {
            setLoadingPreview(false);
        }
    }

    function toggleRow(i: number) {
        setRows((prev) => {
            const copy = [...prev];
            copy[i].checked = !copy[i].checked;
            return copy;
        });
    }

    function setAll(val: boolean) {
        setRows((prev) => prev.map((r) => (r.valid ? { ...r, checked: val } : r)));
    }

    async function handleCommit() {
        // backend bulkInsert expects fname,mname,lname,bday,email,phone,student_number,course,enrollment_date
        const toInsert = rows
            .filter((r) => r.valid && r.checked)
            .map((r) => ({
                fname: r.fname ?? '',
                mname: r.mname ?? null,
                lname: r.lname ?? '',
                bday: r.bday ?? null,
                email: r.email ?? null,
                phone: r.phone ?? null, // normalized phone (must be +63XXXXXXXXXX)
                student_number: r.student_number ?? '',
                course: r.course ?? null,
                enrollment_date: r.enrollment_date ?? null,
            }));

        if (!toInsert.length) {
            MySwal.fire({ icon: 'info', title: 'Nothing to insert', text: 'Select at least one valid row.' });
            return;
        }

        // Use SweetAlert confirm
        const { isConfirmed } = await MySwal.fire({
            title: `Insert ${toInsert.length} learners?`,
            text: 'This will create user and learner records for each selected row.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, insert',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            background: 'var(--background)',
            color: 'var(--foreground)',
        });

        if (!isConfirmed) return;

        setCommitting(true);
        try {
            const { data } = await axios.post('/user-management/learner/bulk/insert', { rows: toInsert });

            await MySwal.fire({
                icon: 'success',
                title: 'Bulk insert complete',
                text: data?.message ?? 'Inserted successfully.',
                timer: 1800,
                showConfirmButton: false,
                background: 'var(--background)',
                color: 'var(--foreground)',
            });

            // Reset UI
            setRows([]);
            setFile(null);

            // Redirect back to learners list (use simple navigation so we don't require @inertiajs/inertia)
            window.location.href = '/user-management/learner';
        } catch (err: any) {
            const msg = err?.response?.data?.error ?? err?.response?.data?.message ?? 'Something went wrong.';
            MySwal.fire({ icon: 'error', title: 'Insert failed', text: msg });
        } finally {
            setCommitting(false);
        }
    }

    function displayName(r: PreviewRow) {
        const parts = [r.fname, r.mname, r.lname].filter(Boolean);
        return parts.join(' ');
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Learner Management', href: '/user-management/learner' },
                { title: 'Bulk Insert', href: '/user-management/learner/bulk' },
            ]}
        >
            <Head title="Bulk Insert — Student Management" />
            <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-gradient-to-br from-red-800 to-red-900 p-3 shadow-lg">
                                <FileSpreadsheet className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Bulk Insert Learners</h1>
                                <p className="text-gray-600 dark:text-gray-400">Upload an .xlsx file, review validations, then commit.</p>
                            </div>
                        </div>

                        <Button asChild variant="outline" className="border-gray-200 dark:border-gray-700">
                            <Link href="/user-management/learner" className="flex items-center gap-2">
                                <ChevronLeft className="h-4 w-4" />
                                Back to list
                            </Link>
                        </Button>
                    </div>

                    {/* Step 1: Template & Upload */}
                    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="space-y-1">
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    1) Download the template, 2) Fill it up, 3) Upload to preview.
                                </div>
                                <a
                                    href={templateUrl ?? '/templates/LearnerManagementBulkInsertTemplate.xlsx'}
                                    className="inline-flex items-center gap-2 text-red-700 underline hover:text-red-800 dark:text-red-300"
                                >
                                    <UploadCloud className="h-4 w-4" />
                                    Download XLSX Template
                                </a>
                            </div>

                            <form onSubmit={handlePreview} className="flex w-full items-center gap-2 sm:w-auto">
                                <Input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={onFileChange}
                                    className="max-w-xs border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700"
                                />
                                <Button
                                    type="submit"
                                    disabled={loadingPreview || !file}
                                    className="bg-red-800 text-white hover:bg-red-900 dark:bg-red-700 dark:hover:bg-red-600"
                                >
                                    {loadingPreview ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                                    Upload & Preview
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Step 2: Preview */}
                    {rows.length > 0 && (
                        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">Total: {summary.total}</Badge>
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                        Valid: {summary.valid}
                                    </Badge>
                                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Invalid: {summary.invalid}</Badge>
                                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                        Selected: {summary.selected}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" onClick={() => setAll(true)} className="border-gray-200 dark:border-gray-700">
                                        Select all valid
                                    </Button>
                                    <Button variant="outline" onClick={() => setAll(false)} className="border-gray-200 dark:border-gray-700">
                                        Unselect all
                                    </Button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b-2 border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                                            <TableHead />
                                            <TableHead>Row</TableHead>
                                            <TableHead>Student #</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Course</TableHead>
                                            <TableHead>Birthday</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Enrollment</TableHead>
                                            <TableHead>Validation</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rows.map((r, i) => {
                                            const hasErrors = !r.valid && r.errors?.length;
                                            return (
                                                <TableRow key={i} className={hasErrors ? 'bg-red-50/50 dark:bg-red-950/10' : ''}>
                                                    <TableCell>
                                                        <input
                                                            type="checkbox"
                                                            className="h-4 w-4 accent-red-600"
                                                            checked={!!r.checked}
                                                            disabled={!r.valid}
                                                            onChange={() => toggleRow(i)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs opacity-70">{r.row}</TableCell>
                                                    <TableCell className="font-mono">{r.student_number ?? '—'}</TableCell>
                                                    <TableCell className="font-medium">{displayName(r) || '—'}</TableCell>
                                                    <TableCell>{r.course ?? '—'}</TableCell>
                                                    <TableCell>{r.bday ?? '—'}</TableCell>
                                                    <TableCell className="text-sm">
                                                        {r.email ?? '—'}
                                                        {r.email && r.phone ? ' / ' : ''}
                                                        {r.phone ?? r.phone_raw ?? '—'}
                                                    </TableCell>
                                                    <TableCell>{r.enrollment_date ?? '—'}</TableCell>
                                                    <TableCell className="text-sm">
                                                        {r.valid ? (
                                                            <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-300">
                                                                <CheckCircle2 className="h-4 w-4" /> OK
                                                            </span>
                                                        ) : (
                                                            <ul className="space-y-1 text-red-700 dark:text-red-300">
                                                                {r.errors?.map((e, idx) => (
                                                                    <li key={idx} className="flex items-start gap-1">
                                                                        <AlertCircle className="mt-[2px] h-4 w-4 flex-shrink-0" />
                                                                        <span>{e}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Only <strong>valid</strong> rows can be selected for insertion.
                                </div>
                                <Button
                                    onClick={handleCommit}
                                    disabled={committing || summary.selected === 0}
                                    className="bg-red-800 text-white hover:bg-red-900 dark:bg-red-700 dark:hover:bg-red-600"
                                >
                                    {committing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Insert {summary.selected} row{summary.selected === 1 ? '' : 's'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

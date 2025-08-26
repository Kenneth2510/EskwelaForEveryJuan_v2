<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
   protected $dashboardService;

   public function __construct(DashboardService $dashboardService)
   {
        $this->dashboardService = $dashboardService;
   }

   public function index()
   {
        $user = Auth::user();

        $category = $user->category;

        if ($category === 'learner') {
            $dashboardData = $this->dashboardService->learnerDashbord();

            return Inertia::render('dashboard/learner');
        } else if ($category === 'instructor') {
            $dashboardData = $this->dashboardService->instructorDashboard();

            return Inertia::render('dashboard/instructor');
        } else {
            $dashboardData = $this->dashboardService->adminDashboard();

            return Inertia::render('dashboard/admin');
        }
   }
}

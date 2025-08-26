<?php

namespace App\Services;

class DashboardService
{
    protected string $cacheKey = 'dashboard';

    protected int $cacheTTL = 600;

    public function learnerDashbord()
    {
        return null;
    }

    public function instructorDashboard()
    {
        return null;
    }

    public function adminDashboard()
    {
        return null;
    }
}

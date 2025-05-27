<?php

namespace App\Http\Controllers;

use App\Models\Club;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Interview;
use App\Models\InterviewSlot;
use App\Models\Application;
use Illuminate\Support\Facades\Auth;
use DateTime;
class ClubController extends Controller
{
    public function index()
    {
        return response()->json(Club::all());

    }
    public function create()
    {
        //
    }
    public function store(Request $request)
    {
        //
    }
    public function show(Club $club)
    {
        //
    }

    public function edit(Club $club)
    {
        //
    }

    public function update(Request $request, Club $club)
    {
        //
    }

    public function destroy(Club $club)
    {
        //
    }

    public function getinterViewSlotsList(Club $club)
    {
        // Get all interview slots related to the club
        $interviews = $club->interviewSlots;

        // If there are no interview slots, return an appropriate response
        if ($interviews->isEmpty()) {
            return response()->json(['message' => 'No interview slots found.'], 404);
        }

        // Get the last interview slot
        $lastInterview = $interviews->last();

        $startDate = Carbon::parse($lastInterview->start_time);
        $endDate = Carbon::parse($lastInterview->end_time);
        $now = Carbon::now();

        // Check if now is within the start and end time
        $isOngoing = $now->between($startDate, $endDate);

        // Calculate remaining days if it's ongoing
        $daysLeft = $isOngoing ? $now->diffInDays($endDate, false) : null;

        return response()->json([
            'interviews' => $interviews,
            'lastInterview' => $lastInterview,
            'isOngoing' => $isOngoing,
            'daysLeft' => $daysLeft
        ], 200);
    }

    public function getEventsList(Club $club)
    {
        $events = $club->events;
        return response()->json($events);
    }

    public function getApplication(InterviewSlot $interview)
    {
        // $applications = $interview->application;
        return response()->json($interview->application);
    }

    public function saveApplication(Request $request, InterviewSlot $interview)
    {
        $request->validate([
            'motivation' => 'required|string|max:2000',
        ]);

        $userId = Auth::user()->id;

        // Check if the user already applied to this interview slot
        $existing = Application::where('user_id', $userId)
            ->where('club_id', $interview->club_id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Vous avez déjà postulé à cet entretien.'
            ], 409);
        }

        $application = new Application();
        $application->user_id = $userId;
        $application->motivation = $request->motivation;
        $application->club_id = $interview->club_id;
        $application->save();

        return response()->json([
            'message' => 'Application submitted successfully.',
            'application' => $application
        ], 201);
    }
    function test()
    {
        return response()->json(['message' => 'ClubController is working!']);
    }
}

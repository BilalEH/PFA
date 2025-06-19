<?php

namespace App\Http\Controllers;

use App\Models\Club;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use DateTime;
use App\Models\Notification;
use App\Models\Application;
use App\Models\InterviewSlot;
use App\Models\Interview;
class ClubController extends Controller
{

    /**
     * Liste tous les clubs.
     */
    public function index(): JsonResponse
    {
        $clubs = Club::all();

        return response()->json([
            'data' => $clubs,
        ], 200);
    }

    /**
     * Crée un nouveau club.
     * Seul le SYSTEM_ADMIN peut exécuter cette action.
     */
    public function store(Request $request): JsonResponse
    {
        if (Auth::user()->user_type !== 'system_admin') {
            return response()->json([
                'message' => 'Forbidden',
            ], 403);
        }

        $validated = $request->validate([
            'name'            => 'required|string|max:191',
            'description'     => 'nullable|string',
            'rules'           => 'nullable|string',
            'logo'            => 'nullable|string|max:191',
            'cover_image'     => 'nullable|string|max:191',
            'is_active'       => 'boolean',
            'foundation_date' => 'nullable|date',
        ]);

        $club = Club::create($validated);

        return response()->json([
            'message' => 'Club créé',
            'data'    => $club,
        ], 201);
    }

    /**
     * Affiche un club spécifique.
     */
    public function show(Club $club): JsonResponse
    {
        return response()->json([
            'data' => $club,
        ], 200);
    }

    /**
     * Met à jour un club existant.
     * Seul le SYSTEM_ADMIN peut exécuter cette action.
     */
    public function update(Request $request, Club $club): JsonResponse
    {
        if (Auth::user()->user_type !== 'system_admin') {
            return response()->json([
                'message' => 'Forbidden',
            ], 403);
        }

        $validated = $request->validate([
            'name'            => 'sometimes|required|string|max:191',
            'description'     => 'nullable|string',
            'rules'           => 'nullable|string',
            'logo'            => 'nullable|string|max:191',
            'cover_image'     => 'nullable|string|max:191',
            'is_active'       => 'boolean',
            'foundation_date' => 'nullable|date',
        ]);

        $club->update($validated);

        return response()->json([
            'message' => 'Club mis à jour',
            'data'    => $club,
        ], 200);
    }

    /**
     * Supprime un club.
     * Seul le SYSTEM_ADMIN peut exécuter cette action.
     */
    public function destroy(Club $club): JsonResponse
    {
        if (Auth::user()->user_type !== 'system_admin') {
            return response()->json([
                'message' => 'Forbidden',
            ], 403);
        }

        $club->delete();

        return response()->json(null, 204);
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

        $startDate = \Carbon\Carbon::parse($lastInterview->start_time);
        $endDate = \Carbon\Carbon::parse($lastInterview->end_time);
        $now = \Carbon\Carbon::now();

        // Check if now is within the start and end time
        $isOngoing = $now->between($startDate, $endDate);

        // Calculate remaining days if it's ongoing
        $daysLeft = $isOngoing ? $now->diffInDays($endDate, false) : null;

        return response()->json([
            'interviews' => $interviews,
            'lastInterview' => $lastInterview,
            'isOngoing' => $isOngoing,
            'daysLeft' => $daysLeft // this will be null if not ongoing
        ], 200);
    }

    public function getEventsList(Club $club)
    {
        $events = $club->events;
        return response()->json($events);
    }

    public function getApplication(Interview $interview)
    {
        // $applications = $interview->application;
        return response()->json($interview);
    }

    public function saveApplication(Request $request, InterviewSlot $interview)
    {
        $request->validate([
            'motivation' => 'required|string|max:2000',
        ]);

        $userId = Auth::user()->id;

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

        $interview->update(['booked_interviews' => $interview->booked_interviews + 1]); 

        //add notification
        $notification = [
            'title' => 'Nouvelle candidature',
            'message' => 'Vous avez une nouvelle candidature pour l\'entretien de club ' . $interview->club->name,
            'type' => 'application',
            'link' => '/interview/application/' . $interview->id,
            'user_id' => $userId,
        ];
        Notification::create($notification);

        return response()->json([
            'message' => 'Application submitted successfully.',
            'application' => $application
        ], 201);
    }


    function getClubMembers()
    {
        $user = Auth::user();

        $userClubs = $user->clubUsers()->where('role', 'admin')->get();
        $members = [];

        foreach ($userClubs as $clubUser) {
            $club = $clubUser->club()->first();
            if ($club) {
                $clubMembers = $club->clubUsers()->with('user')->get();
                foreach ($clubMembers as $clubMember) {
                    $memberData = $clubMember->toArray();
                    $memberData['is_auth_user'] = $clubMember->user_id === $user->id;
                    $members[] = $memberData;
                }
            }
        }

        return response()->json([
            'data' => $members,
        ], 200);
    }


    function MemberRoleChange(Request $request, $memberId)
    {
        $user = Auth::user();
        if ($user->user_type !== 'club_admin' && $user->user_type !== 'system_admin') {
            return response()->json([
                'message' => 'Forbidden',
            ], 403);
        }

        $validated = $request->validate([
            'role' => 'required|string|in:member,admin,president,vice_president,secretary,treasurer',
        ]);

        $clubUser = \App\Models\ClubUser::all()->where('user_id', $memberId)->first();
        if (!$clubUser) {
            return response()->json([
                'message' => 'Member not found.',
            ], 404);
        }

        $clubUser->role = $validated['role'];
        $clubUser->save();

        return response()->json([
            'message' => 'Member role updated successfully.',
            'data' => $clubUser,
        ], 200);
    }

    public function getInterviewsByClub()
    {
        $user = Auth::user();

        $userClubs = $user->clubUsers()->where('role', 'admin')->get();
        $interviews = [];

        foreach ($userClubs as $clubUser) {
            $club = $clubUser->club;
            if ($club) {
                $clubInterviews = $club->interviewSlots;
                foreach ($clubInterviews as $interview) {
                    $interviewData = $interview->toArray();
                    $interviews[] = $interviewData;
                }
            }
        }

        return response()->json([
            'data' => $interviews,
        ], 200);
    }
    public function ClubEvents()
    {
        $user = Auth::user();
        $userClubs = $user->clubUsers()->where('role', 'admin')->get();
        $events = [];
        foreach ($userClubs as $clubUser) {
            $club = $clubUser->club;
            if ($club) {
                $clubEvents = $club->events;
                foreach ($clubEvents as $event) {
                    $eventData = $event->toArray();
                    $eventData['is_auth_user'] = $event->eventUsers()->where('user_id', $user->id)->exists();
                    $eventData['participants_count'] = $event->eventUsers()->count();
                    $events[] = $eventData;
                }
            }
        }

        return response()->json([
            'data' => $events,
        ], 200);
    }

    public function ClubDashboard()
    {
        $user = Auth::user();
        $userClubs = $user->clubUsers()->where('role', 'admin')->get();
        $dashboardData = [];

        foreach ($userClubs as $clubUser) {
            $club = $clubUser->club;
            if ($club) {
                $upcomingEvents = $club->events()->where('start_date', '>', now())->count();
                $upcomingInterviews = $club->interviewSlots()->where('end_time', '>', now())->count();
                $dashboardData[] = [
                    'club_id' => $club->id,
                    'name' => $club->name,
                    'description' => $club->description,
                    'logo' => $club->logo,
                    'cover_image' => $club->cover_image,
                    'is_active' => $club->is_active,
                    'foundation_date' => $club->foundation_date,
                    'members_count' => $club->clubUsers()->count(),
                    'interviews_count' => $club->interviewSlots()->count(),
                    'events_count' => $club->events()->count(),
                    'upcoming_events_count' => $upcomingEvents,
                    'upcoming_interviews_count' => $upcomingInterviews,
                ];
            }
        }

        return response()->json([
            'data' => $dashboardData,
        ], 200);
    }

    public function ClubInfo(){
        $user = Auth::user();
        $userClubs = $user->clubUsers()->where('role', 'admin')->get();
        $clubsInfo = [];

        foreach ($userClubs as $clubUser) {
            $club = $clubUser->club;
            if ($club) {
                $clubsInfo[] = [
                    'id' => $club->id,
                    'name' => $club->name,
                    'description' => $club->description,
                    'logo' => $club->logo,
                    'cover_image' => $club->cover_image,
                    'is_active' => $club->is_active,
                    'foundation_date' => $club->foundation_date,
                ];
            }
        }

        return response()->json([
            'data' => $clubsInfo,
        ], 200);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Club;
use App\Models\Candidature;
use App\Models\Interview;
use App\Models\InterviewSlot;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class test extends Controller
{
    public function getClubs()
    {
        try {
            $clubs = Club::get();

            return response()->json([
                'success' => true,
                'clubs' => $clubs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch clubs',
                'error' => $e
            ], 500);
        }
    }

    /**
     * Apply to club
     */
    public function applyToClub(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'club_id' => 'required|exists:clubs,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if already applied
        $existing = Candidature::where('utilisateur_id', $request->user_id)
            ->where('club_id', $request->club_id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Already applied to this club'
            ], 409);
        }

        try {
            $candidatureId = Candidature::create([
                'utilisateur_id' => $request->user_id,
                'club_id' => $request->club_id,
                'date_candidature' => now(),
                'statut' => 'en_attente'
            ])->id;

            return response()->json([
                'success' => true,
                'message' => 'Application submitted successfully',
                'candidature_id' => $candidatureId
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit application'
            ], 500);
        }
    }

    /**
     * Get available interview slots for a candidature
     */
    public function getAvailableInterviews($candidatureId)
    {
        try {
            // Get candidature details
            $candidature = Candidature::with('club')
                ->where('id', $candidatureId)
                ->first();

            if (!$candidature) {
                return response()->json([
                    'success' => false,
                    'message' => 'Candidature not found'
                ], 404);
            }

            // Get available slots
            $slots = InterviewSlot::where('club_id', $candidature->club_id)
                ->where('is_available', 1)
                ->where('date', '>=', now()->toDateString())
                ->whereRaw('booked_candidates < max_candidates')
                ->orderBy('date')
                ->orderBy('time_slot')
                ->get();

            return response()->json([
                'success' => true,
                'candidature' => $candidature,
                'available_slots' => $slots
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch interview slots'
            ], 500);
        }
    }

    /**
     * Book interview slot
     */
    public function bookInterview(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'candidature_id' => 'required|exists:candidatures,id',
            'slot_id' => 'required|exists:interview_slots,id',
            'additional_info' => 'nullable|string|max:1000',
            'phone' => 'nullable|string|max:15',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Verify slot availability
            $slot = InterviewSlot::where('id', $request->slot_id)
                ->where('is_available', 1)
                ->whereRaw('booked_candidates < max_candidates')
                ->first();

            if (!$slot) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Slot no longer available'
                ], 409);
            }

            $candidature = Candidature::find($request->candidature_id);

            // Create interview record
            $interview = Interview::create([
                'club_id' => $candidature->club_id,
                'candidature_id' => $request->candidature_id,
                'interview_date' => $slot->date . ' ' . $slot->time_slot,
                'interview_time_slot' => $slot->time_slot,
                'location' => 'TBA',
                'status' => 'scheduled',
                'notes' => $request->additional_info,
            ]);

            // Update slot booking count
            $slot->increment('booked_candidates');

            // Update candidature status
            $candidature->update(['statut' => 'acceptee']);

            // Create notification
            Notification::create([
                'utilisateur_id' => $candidature->utilisateur_id,
                'message' => "Interview scheduled for {$slot->date} at {$slot->time_slot}",
                'date_notification' => now(),
                'lu' => 0
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Interview booked successfully',
                'interview_id' => $interview->id
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to book interview'
            ], 500);
        }
    }

    /**
     * Get student dashboard data
     */
    public function getDashboard($userId)
    {
        try {
            // Get applications
            $applications = Candidature::with(['club', 'interviews'])
                ->where('utilisateur_id', $userId)
                ->orderBy('date_candidature', 'desc')
                ->get();

            // Get notifications
            $notifications = Notification::where('utilisateur_id', $userId)
                ->orderBy('date_notification', 'desc')
                ->take(10)
                ->get();

            return response()->json([
                'success' => true,
                'applications' => $applications,
                'notifications' => $notifications
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard data'
            ], 500);
        }
    }

    /**
     * Admin: Create interview slots
     */
    public function createInterviewSlots(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'club_id' => 'required|exists:clubs,id',
            'date' => 'required|date|after_or_equal:today',
            'time_slots' => 'required|array',
            'time_slots.*' => 'required|string',
            'max_candidates_per_slot' => 'required|integer|min:1|max:10'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $createdSlots = [];
            foreach ($request->time_slots as $timeSlot) {
                $slot = InterviewSlot::create([
                    'club_id' => $request->club_id,
                    'date' => $request->date,
                    'time_slot' => $timeSlot,
                    'max_candidates' => $request->max_candidates_per_slot,
                    'booked_candidates' => 0,
                    'is_available' => 1,
                ]);
                $createdSlots[] = $slot->id;
            }

            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Interview slots created successfully',
                'created_slots' => $createdSlots
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create interview slots'
            ], 500);
        }
    }

    /**
     * Get interview slots for admin management
     */
    public function getInterviewSlots($clubId)
    {
        try {
            $slots = InterviewSlot::where('club_id', $clubId)
                ->orderBy('date')
                ->orderBy('time_slot')
                ->get();

            return response()->json([
                'success' => true,
                'slots' => $slots
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch interview slots'
            ], 500);
        }
    }
}


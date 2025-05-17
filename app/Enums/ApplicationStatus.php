<?php

namespace App\Enums;

enum ApplicationStatus: string
{
    case PENDING = 'pending';
    case INTERVIEW_SCHEDULED = 'interview_scheduled';
    case ACCEPTED = 'accepted';
    case REJECTED = 'rejected';
}
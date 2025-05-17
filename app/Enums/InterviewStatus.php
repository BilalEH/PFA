<?php

namespace App\Enums;

enum InterviewStatus: string
{
    case SCHEDULED = 'scheduled';
    case COMPLETED = 'completed';
    case CANCELED = 'canceled';
    case MISSED = 'missed';
}
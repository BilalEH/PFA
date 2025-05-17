<?php

namespace App\Enums;

enum UserType: string
{
    case STUDENT = 'student';
    case CLUB_ADMIN = 'club_admin';
    case SYSTEM_ADMIN = 'system_admin';
}
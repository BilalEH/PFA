<?php

namespace App\Enums;

enum ClubUserRole: string
{
    case MEMBER = 'member';
    case ADMIN = 'admin';
    case PRESIDENT = 'president';
    case VICE_PRESIDENT = 'vice_president';
    case SECRETARY = 'secretary';
    case TREASURER = 'treasurer';
}
<?php

namespace App\Enums;

enum EventUserStatus: string
{
    case REGISTERED = 'registered';
    case ATTENDED = 'attended';
    case CANCELED = 'canceled';
}
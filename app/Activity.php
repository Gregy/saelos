<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Activity
 *
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $details
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $entity
 * @property-read \App\User $user
 * @mixin \Eloquent
 */
class Activity extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function entity()
    {
        return $this->morphTo();
    }

    public function details()
    {
        return $this->morphTo();
    }

    public function toArray()
    {
        return parent::toArray(); // TODO: Change the autogenerated stub
    }
}

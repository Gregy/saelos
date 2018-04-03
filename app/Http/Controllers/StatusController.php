<?php

namespace App\Http\Controllers;

use App\Status;
use Illuminate\Http\Request;
use App\Http\Resources\StatusCollection;
use App\Http\Resources\Status as StatusResource;

class StatusController extends Controller
{
    const INDEX_WITH = [
        // 'contacts',
    ];

    const SHOW_WITH = [
        // 'contacts',
    ];

    public function index(Request $request)
    {
      $statuses = Status::with(static::INDEX_WITH);

        if ($searchString = $request->get('searchString')) {
            $statuses->where('name', 'LIKE', $searchString.'%');
        }

        $statuses->orderBy('name');

        return new StatusCollection($statuses->paginate());
    }

    public function show($id)
    {
        return new StatusResource(Status::with(static::SHOW_WITH)->find($id));
    }

    public function update(Request $request, $id)
    {
        $stage = Status::findOrFail($id);
        $data = $request->all();

        $stage->update($data);

        return $stage;
    }

    public function store(Request $request)
    {
        return Status::create($request->all());
    }

    public function destroy($id)
    {
        Status::findOrFail($id)->delete();

        return '';
    }
}

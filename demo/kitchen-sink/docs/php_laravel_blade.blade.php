<!-- Stored in resources/views/layouts/app.blade.php -->

<html>
    <head>
        <title>App Name - @yield('title')</title>
        <script>
            var app = @json($array);
        </script>
    </head>
    <body>
        @extends('layouts.app')
        @section('sidebar')
            @parent

            <p>This is appended to the master sidebar.</p>
        @endsection
 
        @if (count($records) === 1)
            I have one record!
        @elseif (count($records) > 1)
            I have multiple records!
        @else
            I don't have any records!
        @endif

        @foreach ($users as $user)
            @if ($user->type == 1)
                @continue
            @endif

            <li>{{ $user->name }}</li>

            @if ($user->number == 5)
                @break
            @endif
        @endforeach

        @foreach ($users as $user)
            @continue($user->type == 1)

            <li>{{ $user->name }}</li>

            @break($user->number == 5)
        @endforeach

        <div>
            @include('shared.errors')

            <form>
                <!-- Form Contents -->
            </form>
        </div>

        @includeIf('view.name', ['some' => 'data'])

        @env('local')
            // The application is in the local environment...
        @elseenv('testing')
            // The application is in the testing environment...
        @else
            // The application is not in the local or testing environment...
        @endenv

        <div class="container">
            @yield('content')
        </div>
    </body>
</html>


{{-- comment --}}

@if (
    {{-- comment --}}
    /*block comment*/
    #another comment
    $user->type == 1
    // c comment
    /* comment*/
)
    # not a comment <div id="#//x"></div>
@endif

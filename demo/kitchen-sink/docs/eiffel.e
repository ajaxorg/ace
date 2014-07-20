note
	description: "[
		Sudoku grid and simple resolution facilities.
	]"
	author: "Victorien ELVINGER"
	date: "22 August 2013"
	revision: "3"
	libraries: "Relies on ARRAY2 from EiffelBase"

class
	SUDOKU_GRID

inherit

	ANY
		redefine
			default_create,
			out
		end

create
	default_create

feature {NONE} -- Creation

	default_create
			-- Create an empty grid.
		do
			create grid.make_filled (Default_value, 9, 9)
		ensure then
			unsolved: not solved
		end

feature -- Access

	item alias "[]" (a_row, a_column: INTEGER): INTEGER assign put
			-- Value at coordinates (`a_row', `a_column').
		require
			valid_row (a_row)
			valid_column (a_column)
		do
			Result := grid [a_row, a_column]
		end

	out: STRING
			-- Printable representation.
		do
			Result := ""
			across column_range as column_ic loop
				across row_range as row_ic loop
					Result := Result + grid [row_ic.item, column_ic.item].out + " "
				end
				Result := Result + "%N"
			end
		end

	column_range: INTEGER_INTERVAL
			-- Column interval.
		do
			 Result := 1 |..| grid.width
		end

	row_range: INTEGER_INTERVAL
			-- Row interval.
		do
			Result := 1 |..| grid.height
		end

	subgrid_column_range (a_column: INTEGER): INTEGER_INTERVAL
			-- Colum interval of the subgrids including `a_column'.
		require
			valid_column (a_column)
		local
			l_column: like a_column
		do
			l_column := ((a_column - 1) // 3)*3 + 1
			Result := l_column |..| (l_column + 2)
		ensure
			lower_bound: (<<1, 4, 7>>).has (Result.lower)
			upper_bound: (<<3, 6, 9>>).has (Result.upper)
		end

	subgrid_row_range (a_row: INTEGER): INTEGER_INTERVAL
			-- Row interval of the subgrids including `a_row'.
		require
			valid_row (a_row)
		local
			l_row: like a_row
		do
			l_row := ((a_row - 1) // 3) * 3 + 1
			Result := l_row |..| (l_row + 2)
		ensure
			lower_bound: (<<1, 4, 7>>).has (Result.lower)
			upper_bound: (<<3, 6, 9>>).has (Result.upper)
		end

feature -- Status report

	solved: BOOLEAN
			-- Is completed?

	valid_column (a_column: INTEGER): BOOLEAN
			-- Is `a_column' a valid coordinate?
		do
			Result := 1 <= a_column and a_column <= grid.width
		end

	valid_row (a_row: INTEGER): BOOLEAN
			-- Is `a_row' a valid coordinate?
		do
			Result := 1 <= a_row and a_row <= grid.height
		end

	valid_value (a_value: INTEGER): BOOLEAN
			-- Is `a_value' a valid item?
		do
			Result := 1 <= a_value and a_value <= 9
		end

	valid (a_value: INTEGER; a_row, a_column: INTEGER): BOOLEAN
			-- Can `a_value' be inserted at coordinates (`a_row', `a_column')?
		require
			valid_value (a_value)
			valid_row (a_row)
			valid_column (a_column)
		do
			Result := not (subgrid_has (a_value, a_row, a_column) or row_has (a_value, a_row) or column_has (a_value, a_column))
		end

	subgrid_has (a_value: INTEGER; a_row, a_column: INTEGER): BOOLEAN
			-- Is there `a_value' in the subgrid containing coordinates (`a_row', `a_column')?
		require
			valid_row (a_row)
			valid_column (a_column)
		do
			across
				subgrid_row_range (a_row) as row_ic
			until
				Result
			loop
				across
					subgrid_column_range (a_column) as column_ic
				until
					Result
				loop
					Result := grid [row_ic.item, column_ic.item] = a_value
				end
			end
		end

	row_has (a_value: INTEGER; a_row: INTEGER): BOOLEAN
			-- Exist there an item `a_value' at coordinates (`a_row', ?)?
		require
			valid_row (a_row)
		do
			Result := across column_range as ic some grid [a_row, ic.item] = a_value end
		end

	column_has (a_value: INTEGER; a_column: INTEGER): BOOLEAN
			-- Exist there an item `a_value' at coordinates (?, `a_column')?
		require
			valid_column (a_column)
		do
			Result := across row_range as ic some grid [ic.item, a_column] = a_value end
		end

feature -- Extension

	put (a_value: INTEGER; a_row, a_column: INTEGER)
			-- Assign item `a_value' at coordinates (`a_row', `a_column').
		require
			valid_value (a_value)
			valid_row (a_row)
			valid_column (a_column)
			valid (a_value, a_row, a_column)
		do
			grid [a_row, a_column] := a_value
		ensure
			item_inserted: grid [a_row, a_column] = a_value
		end

feature -- Change

	solve
			-- Try to solve grid.
		do
			sub_solve (1, 1)
		end

feature {NONE} -- Implementation

	grid: ARRAY2 [INTEGER]
			-- Board.

	Default_value: INTEGER = 0
			-- Empty cell content.

	sub_solve (a_row, a_column: INTEGER)
			-- Solve grid from row `a_row' and column `a_column'.
		require
			valid_row (a_row)
			valid_column (a_column)
		do
			if valid_value (grid [a_row, a_column]) then
				solve_after (a_row, a_column)
			else
				across
					1 |..| 9 as ic
				until
					solved
				loop
					if valid (ic.item, a_row, a_column) then
						put (ic.item, a_row, a_column)
						solve_after (a_row, a_column)

						if not solved then
							grid [a_row, a_column] := Default_value
						end
					end
				end
			end
		end

	solve_after (a_row, a_column: INTEGER)
			-- Solve the next cell.
		require
			valid_row (a_row)
			valid_column (a_column)
		do
			if a_column = grid.width then
				if a_row = grid.height then
					solved := True
				else
					sub_solve (a_row + 1, 1)
				end
			else
				sub_solve (a_row, a_column + 1)
			end
		end

invariant
	valid_numbers: solved implies across grid as ic all valid_value (ic.item) end
	nine_columns: grid.width = 9
	nine_rows: grid.height = 9

end

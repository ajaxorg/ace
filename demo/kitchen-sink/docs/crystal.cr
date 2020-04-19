# crystal comment

require "llvm"

NUM_CELLS          = 30000
CELL_SIZE_IN_BYTES =     1

abstract class Instruction
  abstract def compile(program, bb)
end

class Increment < Instruction
  def initialize(@amount : Int32)
  end

  def compile(program, bb)
    cell_val_is_zero = builder.icmp LLVM::IntPredicate::EQ, cell_val, zero
    call_args = [@ctx.int32.const_int(NUM_CELLS), @ctx.int32.const_int(CELL_SIZE_IN_BYTES)]
    builder.cond cell_val_is_zero, loop_after, loop_body_block

    @body.each do |instruction|
      loop_body_block = instruction.compile(program, loop_body_block)
    end

    builder.position_at_end loop_body_block

    unless matching_close_index
      error "Unmatched '[' at position #{i}"
    end

    bb
  end
end

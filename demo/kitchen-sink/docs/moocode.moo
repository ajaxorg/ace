@program toy:wind
/* This is a
 * multiline
 * comment!
 */
if (this.location == player)
  if (this.wound < this.maximum)
    this.wound = this.wound + 2;
    player:tell("You wind up the ", this.name, ".");
    player.location:announce(player.name, " winds up the ", this.name, ".");
    if (this.wound >= this.maximum)
      player:tell("The knob comes to a stop while winding.");
    endif
  else
    player:tell("The ", this.name, " is already fully wound.");
  endif
else
  player:tell("You have to be holding the ", this.name, ".");
endif
.

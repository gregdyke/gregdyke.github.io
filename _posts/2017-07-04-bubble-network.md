---
layout: post
date: 2017-07-04
title: Bubble Network - a contra dance sorting algorithm
tags: dance, contra, english
---

I was inspired by a [project demonstrating sorting algorithms with folk dances](http://algo-rythmics.ms.sapientia.ro/) to write a contra dance that worked along the same principle. I was first called by Cindy Harris in Pittsburgh and subsequently adjusted based on her suggestions and those of Nils Fredland, who has also called it.

## Bubble Network by Greg Dyke 

The rule is: each time there is a swing, the taller person must "lead" and emerge on the left hand side of the swing, regardless of gender (avoid gender-neutral swings as they will make the exit harder)

  * A1: In a ring of four, balance and swing your neighbour on the side
  * A2: Circle left 3 places and swing whoever is with you on the side (i.e the person you didn't swing previously)
  * B1: in a line of 4 walk down the hall. The dancers in the middle of the line turn as a couple, back up the hall, bend and form a circle [at this point, the tallest two people of each set will be on the left side as seen from the stage - possibly in the walkthrough let people on the right know they will be progressing *down* whereas the people on the left will be progressing *up*]
  * B2: balance, petronella twirl, balance, and california twirl to new neighbours

Run for N iterations (where N is the number of couples in the set) (plus 1 or 2 times for mistakes)

B2-last time through: balance, petronella turn, and swing the person across the set from you (not on the side!). Open up facing to the left as seen from the stage. You now have a line of people sorted from tallest (at the top) to shortest at the bottom (which should presumably be entertaining on its own, even for people who are not computer scientists).

----

3 unusual aspects:
- gender/role is not preserved
- partner is not preserved, even within a single time through
- direction of movement is not preserved (and the tallest and shortest
people will spend at least the last half of the dance out at the
top/bottom)

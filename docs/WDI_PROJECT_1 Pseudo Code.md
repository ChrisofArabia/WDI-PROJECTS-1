#WDI_PROJECT_1
##Minesweeper

###Pseudo Code
1. Start new game
2. Choose grid size (9x9 (81),16x16 (256), 30x16(480))
3. Create board layout based on selected grid size - set id based array index
4. Using 'size', loop over the squares and randomly place the number of bombs for that grid size (40) - AND RECORD LOCATIONS [ use array methods ]
5. [This step may not be required] - update the array/object each other square is adjacent to.
6. Capture click on a square
7. Identify whether the clicked square contains a bomb
8. If clicked square (containsBomb = true) {lose game & reveal all squares}
9. Work out which squares are immediately adjacent to the clicked square e.g. for clickedSquare, it will be surrounded by [ +1, -1, %base for above and below). Record in secondArray.
10. Compare secondArray with baseArray and check whether it contains a bomb - if it does, increment a counter.
11. At the end of the loop, set the value of the clickedSquare to the value of the counter and add a class for color.
12. For each of the squares around the original one (identified in secondArray) - repeat step 9 except for the square used to create secondArray.
 

def change(amount, coins):
  desk = []
  coins.sort()
  def backtrack(dish, menus):
    if sum(dish) > amount:
      return
    elif sum(dish) == amount:
      dish.sort()
      if dish not in desk:
        desk.append(dish[:])
      return 
    for idx, val in enumerate(menus):
      dish.append(val)
      residue = amount - sum(dish)
      backtrack(dish, [i for i in menus if i <= residue ])
      dish.pop()
  backtrack([], coins)
  print(desk)
  return len(desk)

print(change(5, [1,2,5]))



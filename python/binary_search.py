# 二分法查找
list = range(0, 20, 2)
print(list)

def binary_search(l, item):
  low = 0
  high = len(l) - 1
  
  while low <= high:
    mid = (low + high) // 2 # 向下取整
    guess = l[mid]
    if guess == item:
      return mid
    if guess > item:
      high = mid - 1
    else:
      low = mid + 1
  return None

print(binary_search(list, 12))

# 快排算法
def findSmallest(arr):
  smallest = arr[0]
  smallest_index = 0
  for i in range(1, len(arr)):
    if arr[i] < smallest:
      smallest = arr[i]
      smallest_index = i
  return smallest_index

def selectionSort(arr):
  newArr = []
  for i in range(len(arr)):
    smallest = findSmallest(arr)
    newArr.append(arr.pop(smallest))
  return newArr



def fastSort(arr):
  if (len(arr) < 2):
    return arr
  else:
    pivot = arr[0]
    less = [i for i in arr[1:] if i <= pivot]
    greater = [i for i in arr[1:] if i > pivot]
    return fastSort(less) + [pivot] + fastSort(greater) 


print(fastSort([5, 3, 6, 2, 10]))

class Solution:
    def combine(self, n: int, k: int) -> List[List[int]]:
        result, track = [], []
        self.backtrack(n, k, 1, track, result)
        return result

    def backtrack(self, n, k, start, track, result):
        if len(track) == k:
            result.append(track[:])
        for i in range(start, n+1):
            track.append(i)
            self.backtrack(n, k, i+1, track, result)
            track.pop()

class Solution:
  def combine(self, n, k):
    result, track = [], []
    self.backtrack(n, k, 1, track, result)
    return result

  def backtrack(self, n, k, start, track, result):
    if (len(track) == k):
      result.append(track[:])
    for i in range(start, n + 1):
      track.append(i)
      self.backtrack(n, k, i + 1, track, result)
      track.pop()


def combine2(n, k):
  res = []
  def backtrack(path, sel):
    if(len(path) == 2):
      res.append(path[:])
      return
    for item in sel:
      path.append(item)
      backtrack(path, sel)
      path.pop()
  backtrack([], list(range(1, n))) 
  return res


def combine (n, k):
  desk = []

  def getMenus(start):
    return range(start, n + 1)

  # dish: 打菜盘，menus: 菜单
  def backtrack(dish, start):
    # 满足某个条件时，把打菜盘放到桌上（记录结果）
    if (len(dish) == k):
      # 引用类型需要克隆一份
      desk.append(dish[:])
      return
    for i in getMenus(start):
      # 做选择
      dish.append(i)
      backtrack(dish, i + 1)
      # 撤销选择
      dish.pop()

  backtrack([], 1)

  return desk

  def dining(nums):
    desk = []
    def backtrack(dish, menus):
      if (满足某个条件):
        desk.append(dish)
      for val in menus:
        dish.append(val)
        backtrack(dish, new_menus)
        dish.pop()
    backtrack([], nums)
    return desk
    

# 伪码框架
def coinChange(coins, amount):
  def dp(n):
    if n == 0: return 0
    if n < 0: return -1
    res = float('INF')
    for coin in coins:
      subproblem = dp(n - coin)
      if subproblem == -1: continue 
      res = min(res, 1 + subproblem)
    return res
  return dp(amount)

class Solution:
  def change(self, amount: int, coins: List[int]) -> int:
    desk = []
    def backtrack(dish, menus):
      if sum(dish) == amount:
        desk.append(dish[:])
      for val in menus:
        dish.append(val)
        backtrack(dish, menus)
        dish.pop()
    backtrack([], coins)
    return len(desk)
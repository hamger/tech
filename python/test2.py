'''
          a
    b            c
d       e      f   g
      h   i
'''
tree = {
  'value': 'a',
  'left': {
    'value': 'b',
    'left': {
      'value': 'd',
    },
    'right': {
      'value': 'e',
      'left': {
        'value': 'h',
      },
      'right': {
        'value': 'i',
      }
    }
  },
  'right': {
    'value': 'c',
    'left': {
      'value': 'f',
    },
    'right': {
      'value': 'g',
    }
  }
}


# 深度优先 栈
def dfs(node):
  arr = []
  stack = [node]
  while (len(stack) > 0):
    temp = stack.pop(0) # 取最后一个
    if temp['right']:
      stack.append(temp['right'])
    arr.append(temp['value'])
    if temp['left']:
      stack.append(temp['left'])
  return arr

dfs(tree)


# 广度优先  队列  
def bfs(node):
  arr = []
  queue = [node]
  while (len(queue) > 0):
    temp = queue.pop(0) # 取第一个
    arr.append(temp['value'])
    if temp['left']:
      queue.append(temp['left'])
    if temp['right']:
      queue.append(temp['right'])
  return arr

bfs(tree)
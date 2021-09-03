triangle = [
     [2],
    [3,4],
   [6,5,7],
  [4,1,8,3],
  [14,99,88,13,2],
]

# 假设最后一个元素的位置为 [i][j]

def minimumTotal(triangle):
  n = len(triangle)
  dp = [0] * n
  # 从最后一行到第一行
  for i in range(n - 2, 0, -1):
    # 从第一列到最后一页
    for j in range(0, i + 1, 1):
      dp[j] = min(dp[j], dp[j + 1]) + triangle[i][j]
  print(dp)
  return dp[0]

print(minimumTotal(triangle))


def minimumTotal2(triangle):
        n = len(triangle)
        f = [0] * n
        f[0] = triangle[0][0]

        for i in range(1, n):
            f[i] = f[i - 1] + triangle[i][i]
            for j in range(i - 1, 0, -1):
                f[j] = min(f[j - 1], f[j]) + triangle[i][j]
            f[0] += triangle[i][0]
        
        return min(f)
        
        n = len(triangle)
        f = [[0] * n for _ in range(n)]
        f[0][0] = triangle[0][0]

        for i in range(1, n):
            f[i][0] = f[i - 1][0] + triangle[i][0]
            for j in range(1, i):
                f[i][j] = min(f[i - 1][j - 1], f[i - 1][j]) + triangle[i][j]
            f[i][i] = f[i - 1][i - 1] + triangle[i][i]
        
        return min(f[n - 1])

print(minimumTotal2(triangle))

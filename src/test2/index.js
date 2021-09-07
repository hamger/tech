// var a = [3, 5, 6, 7, 8, 1, 99];

// a.splice(
//   a.findIndex((e) => e === 8),
//   1
// );

// console.log(a);

var minimumTotal = function(triangle) {
  // var n = triangle.length
  // var dp = new Array(n).fill(0).map(() => new Array(n).fill(0));
  // dp[0][0] = triangle[0][0];

  // for (var i = 1; i < n; i++) {
  //   dp[i][0] = dp[i - 1][0] + triangle[i][0];
  //   for (var j = 1; j < i - 1; j++) {
  //     dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i - 1][j]) + triangle[i][j];
  //   }
  //   dp[i][i] = dp[i - 1][1 - 1] + triangle[i][i];
  // }

  // console.log(dp[n - 1])

  // return Math.min(...dp[n - 1]);

  for (let i = 1; i < triangle.length; i++) {
    for (let j = 0; j < triangle[i].length; j++) {
      triangle[i][j] =
        triangle[i][j] +
        Math.min(
          triangle[i - 1][j] ?? Infinity,
          triangle[i - 1][j - 1] ?? Infinity
        )
    }
  }
  return Math.min(...triangle[triangle.length - 1])
}

var aa = [[2], [3, 4], [6, 5, 7], [4, 1, 8, 3], [99, 88, 88, 1, 1]]

console.log(minimumTotal(aa))

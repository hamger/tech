### XSS 攻击
跨站脚本攻击（Cross Site Scripting）缩写为CSS，但这会与层叠样式表（Cascading Style Sheets，CSS）的缩写混淆。因此，有人将跨站脚本攻击缩写为XSS。

#### 案例一
```html
<input type="text" value="<%= getParameter("keyword") %>">
<button>搜索</button>
<div>
  您搜索的关键词是：<%= getParameter("keyword") %>
</div>
```
访问地址`http://xxx/search?keyword="><script>alert('XSS');</script>`就会出问题，形成如下HTML
```html
<input type="text" value=""><script>alert('XSS');</script>">
<button>搜索</button>
<div>
  您搜索的关键词是："><script>alert('XSS');</script>
</div>
```
浏览器把用户的输入当成了脚本进行了执行，那么只要告诉浏览器这段内容是文本就可以了，因此需要对代码进行转义:
```html
<input type="text" value="<%= escapeHTML(getParameter("keyword")) %>">
<button>搜索</button>
<div>
  您搜索的关键词是：<%= escapeHTML(getParameter("keyword")) %>
</div>
```

#### 案例二
```html
<a href="<%= escapeHTML(getParameter("redirect_to")) %>">跳转...</a>
```
这段代码，当攻击 URL 为 `http://xxx/?redirect_to=javascript:alert('XSS')`，服务端响应就成了：
```html
<a href="javascript:alert(&#x27;XSS&#x27;)">跳转...</a>
```
> 不仅仅是特殊字符，`javascript:`这样的字符串如果出现在特定的位置也会引发 XSS 攻击。
# packing-glob

基于glob的文件选择器

* 支持minmatch的所有参数
* 支持数组传参数

```javascript
var pg = require('packing-glob');
var patterns = [
  '**/*.png', // ['1.png', '2/3.png', 'logo.png']
  '!logo.png'
];
var options = {
  cwd: process.cwd()
};
var matches = pg(patterns, options); // ['1.png', '2/3.png']

```

function component() {
var element = document.createElement('div');
// Lodash, now imported by this script
element.innerHTML = _.join(['Hello', '我是公共的js', '哈哈'], ' ');

return element;
 }
document.body.appendChild(component());
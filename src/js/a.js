import "../common/css/base.css";
import "../common/css/comm.less";
import "../style/a.less";
import _ from 'lodash';
require('../common/js/base.js');

function elEcomponent() {
var element = document.createElement('div');
// Lodash, now imported by this script
element.innerHTML = _.join(['Hello', 'webpack', '哈哈'], ' ');

return element;
 }
document.body.appendChild(elEcomponent());

console.log('webpack-a')

console.log(process.env)


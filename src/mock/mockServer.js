// 引入  这里必须大写M    因为Mock是个对象
import Mock from 'mockjs'

import banner from './banner.json'
import floor from './floor.json'

//code表示成功返回的代码
Mock.mock('/mock/banner', { code: 200, data: banner })
Mock.mock('/mock/floor', { code: 200, data: floor })

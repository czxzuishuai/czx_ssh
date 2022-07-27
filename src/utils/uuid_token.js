import { v4 as uuidv4 } from 'uuid'
// 生成的uuid不能变了，要储存在本地储存中，在生成之前先看看本地储存中有没有
export const getUUID = () => {
  let uuid_token = localStorage.getItem('UUIDTOKEN')
  if (!uuid_token) {
    //生成临时用户id并且本地储存
    uuid_token = uuidv4()
    localStorage.setItem('UUIDTOKEN', uuid_token)
  }
  // 没有返回值的话是undefined
  return uuid_token
}

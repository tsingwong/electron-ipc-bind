import queryString from 'query-string'
import { useEffect, useState } from 'react'
import { BVM_EVENT_NAME, CUSTOM_CHANNEL_TYPE } from '../utils'


function Index() {
  const [name, setName] = useState("")
  const [type, setType] = useState<CUSTOM_CHANNEL_TYPE>(0)
  const [webContentNames, setWebContentNames] = useState<Array<string>>([])


  const BWOrBVName = queryString.parseUrl(location.href).query.name
  const createWindowOrView = async() => {
    console.log(await window.electronAPI.createWindowOrView({
      name,
      url: queryString.stringifyUrl({url:window.location.href,query: {
        name
      }}),
      type
    }))
  }

  const getAllWebContentNames = async() => {
    console.log("发送请求")
    const res = await window.electronAPI.events.invokeTo("main", BVM_EVENT_NAME.GET_ALL_POOL, null)
    console.log(res)
    setWebContentNames(res as Array<string>)
  }

  const sendMessageTo = (webContentName: string | string[]) => {
    window.electronAPI.events.emitTo(webContentName, BVM_EVENT_NAME.SEND_MESSAGE_TO, 123)
  }

  const sendAsyncMessageTo = async (webContentName: string | string[]) => {
    const res = await window.electronAPI.events.invokeTo(webContentName, BVM_EVENT_NAME.SEND_MESSAGE_TO, 123)
    console.log(res)
  }



  return (
    <>
      <h1>我是 {BWOrBVName}</h1>
      <hr />
      <h3>创建新的 BW BV</h3>
      <div>
        <span>请输出名称：</span><input onChange={e => setName(e.target.value)} />
        <input type="radio" name="type" value={0} id="BWtype" defaultChecked onClick={e => setType(0)} /> <label htmlFor="BWtype">BW</label>
        <input type="radio" name="type" value={1} id="BVtype"  onClick={e => setType(1)} /><label htmlFor="BVtype">BV</label>
        <button type='button' onClick={(e) => {
          createWindowOrView()
          getAllWebContentNames()}}> 创建</button>
      </div>
      <hr />
      <h3>跟其他 BW BV 同步通信</h3>
      <button type='button' onClick={() => sendMessageTo("main")} >给主线程发送消息</button>
      <button type='button' onClick={() => sendMessageTo(webContentNames.filter(webContentName => webContentName !== BWOrBVName))} >给其他渲染线程群发消息</button>
      <p></p>
      {
        webContentNames.map((webContentName,index) => <button key={index} type='button' onClick={() => sendMessageTo(webContentName)}>给{webContentName}发送消息</button>)
      }
      <hr />
      <h3>跟其他 BW BV 异步通信</h3>
      <button type='button' onClick={() => sendAsyncMessageTo("main")} >给主线程发送消息</button>
      <button type='button' onClick={() => sendAsyncMessageTo(webContentNames.filter(webContentName => webContentName !== BWOrBVName))} >给其他渲染线程群发消息</button>
      <p></p>
      {
        webContentNames.map((webContentName,index) => <button key={index} type='button' onClick={() => sendAsyncMessageTo(webContentName)}>给{webContentName}发送消息</button>)
      }
    </>
  )
}

export default Index

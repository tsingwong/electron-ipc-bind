import { useState } from 'react'
import { CUSTOM_CHANNEL_TYPE } from '../utils'


function Index() {
  const [name, setName] = useState("")
  const [type, setType] = useState<CUSTOM_CHANNEL_TYPE>(0)

  const createWindowOrView = () => {
    window.electronAPI.createWindowOrView({
      name,
      url: "",
      type
    })
  }

  return (
    <>
      <h3>创建新的 BV BW</h3>
      <div>
        <span>请输出名称：</span><input onChange={e => setName(e.target.value)} />
        <input type="radio" name="0" value={0} id="BWtype" /> <label htmlFor="BWtype">BW</label>
        <input type="radio" name="1" value={1} id="BVtype" /><label htmlFor="BVtype">BV</label>
        <button type='button' >创建</button>

      </div>
    </>
  )
}

export default Index

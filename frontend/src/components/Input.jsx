import React, { useState } from 'react'

const Input = () => {
    const [email, setEmail] = useState("")
  return (
    <div>
        <form>
            <label for = "email">Enter you email</label><br/>
            <input type="text" name="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <button>Submit</button>
        </form>
    </div>
  )
}

export default Input
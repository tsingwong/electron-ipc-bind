import { Suspense, useState } from 'react'
import { Route, Switch } from "wouter"
import Index from './index'

function App() {

  return (
    <Suspense>
      <Switch>
      <Route path="/" component={Index} />
      <Route path="/view" component={Index} />
      </Switch>
    </Suspense>
  )
}

export default App

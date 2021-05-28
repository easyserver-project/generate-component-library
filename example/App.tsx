import React, { ReactElement } from 'react'
import * as stories from './stories'
import { Nav } from './Nav'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

const IndexPage = () => <div>Index</div>

export const App = () => {
  const storyKeys = Object.keys(stories)
  return (
    <>
      <Nav>
        {storyKeys.map((key) => (
          <a href={`#/${key}`}>{key}</a>
        ))}
      </Nav>
      <Router>
        <Switch>
          {storyKeys.map((key) => (
            <Route
              path={`/${key}`}
              component={(stories as { [index: string]: () => ReactElement })[key]}
            />
          ))}
          <Route path="/" component={IndexPage} />
        </Switch>
      </Router>
    </>
  )
}

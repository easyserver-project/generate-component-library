import React, { ReactElement } from 'react'
import * as stories from './stories'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { Nav } from './Nav'

const IndexPage = () => <div>Index</div>

export const App = () => {
  const storyKeys = Object.keys(stories)
  return (
    <>
      <Nav>
        {[
          <a href={'#'}>Index</a>,
          ...storyKeys.map((key) => (
            <a key={key} href={`#/${key}`}>
              {key}
            </a>
          )),
        ]}
      </Nav>
      <Router>
        <Switch>
          {storyKeys.map((key) => (
            <Route
              key={key}
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

import React, {ReactElement} from 'react'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'
import {Nav} from './components/Nav'

const stories = {} // Template, DO NOT CHANGE!

const IndexPage = () => <>
    <h1>Index</h1></>

export const App = () => {
    const storyKeys = Object.keys(stories)
    return (
        <>
            <Nav>
                {[
                    <a key={"index"} href={'#'}>Index</a>,
                    ...storyKeys.map((key) => (
                        <a key={`route-link-${key}`} href={`#/${key}`}>
                            {key}
                        </a>
                    )),
                ]}
            </Nav>
            <Router>
                <Switch>
                    {storyKeys.map((key) => (
                        <Route
                            key={`route-${key}`}
                            path={`/${key}`}
                            component={(stories as { [index: string]: () => ReactElement })[key]}
                        />
                    ))}
                    <Route path="/" component={IndexPage}/>
                </Switch>
            </Router>
        </>
    )
}


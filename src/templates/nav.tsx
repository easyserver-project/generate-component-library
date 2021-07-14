export const NavTemplate = `import React from 'react'

export const Nav = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
  return <ul>{Array.isArray(children) ? children.map((el, index) => <li key={index}>{el}</li>) : { children }}</ul>
}
`

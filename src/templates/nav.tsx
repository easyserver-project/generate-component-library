export const NavTemplate = `import React from 'react'

export const Nav = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
  return <ul>{Array.isArray(children) ? children.map((el) => <li>{el}</li>) : { children }}</ul>
}
`

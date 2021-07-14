export const NavTemplate = `import React from 'react'

export const Nav = ({ children }: { children: JSX.Element[] }) => {
  return <ul>{children.map((el, index) => <li key={index}>{el}</li>)}</ul>
}
`

import React from 'react'

const TableCommerces = ({ commerces }) => {
  return (
    <div>
      {commerces.map((commerce, index) => (
        <div key={index}>
          <div>Libellé: {commerce.tco_libelle}</div>
          <div>Ville: {commerce.ville}</div>
          <div>Code Postal: {commerce.code_postal}</div>
          <br />
        </div>
      ))}
    </div>
  )
}

export default TableCommerces

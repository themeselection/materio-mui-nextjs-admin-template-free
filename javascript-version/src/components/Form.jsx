'use client'

const FormComponent = props => {
  // Props
  const { onSubmit, ...rest } = props

  return <form {...rest} onSubmit={onSubmit ? e => onSubmit(e) : e => e.preventDefault()} />
}

export default FormComponent

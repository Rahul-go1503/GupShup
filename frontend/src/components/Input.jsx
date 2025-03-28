const Input = ({
  label,
  icon,
  refprop,
  type,
  placeholder,
  name,
  value,
  onChange,
  disabled = false,
  className,
}) => {
  return (
    <div>
      <label className="block">{label}</label>
      <div className="inset-shadow-sm mb-1 flex items-center justify-start gap-2 rounded border-b-2 border-b-transparent bg-base-200/80 p-2 transition-all duration-300 focus-within:border-b-accent focus-within:bg-base-200">
        <div className="text-muted self-auto text-primary">{icon}</div>
        <input
          ref={refprop}
          type={type}
          placeholder={placeholder}
          name={name}
          className={`me-2 w-full rounded bg-transparent outline-none ${className}`}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete="off"
        />
      </div>
    </div>
  )
}

export default Input

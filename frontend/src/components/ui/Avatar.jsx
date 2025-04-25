const Avatar = ({ profile, name, size = 10 }) => {
  return (
    <div className="avatar my-auto">
      <div className={`h-${size} w-${size} rounded-full`}>
        <img
          src={
            profile ||
            'https://ui-avatars.com/api/?name=' +
              name?.split(' ').join('+') +
              '&background=random&color=fff'
          }
          alt={name}
        />
      </div>
    </div>
  )
}

export default Avatar

const Avatar = ({ profile, name }) => {
  return (
    <div className="avatar my-auto">
      <div className="h-10 w-10 rounded-full">
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

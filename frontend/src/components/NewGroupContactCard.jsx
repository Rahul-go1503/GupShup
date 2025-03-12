const NewGroupContactCard = ({ data, funHandleSelect }) => {
  return (
    <label className="my-1 flex cursor-pointer items-center gap-3 p-2 hover:bg-base-200">
      <div className="avatar">
        <div className="m-1 h-12 w-12 rounded-full">
          <img
            src={
              data.profile ||
              `https://ui-avatars.com/api/?name=${data.name.split(' ').join('+')}&background=random&color=fff`
            }
            alt={data.name}
          />
        </div>
      </div>
      <div className="flex-grow">
        <p className="font-bold">{data.name}</p>
      </div>
      <input
        type="checkbox"
        checked={data.selected}
        className="checkbox checkbox-sm transition-none checked:animate-none"
        onChange={() => funHandleSelect()}
      />
    </label>
  )
}

export default NewGroupContactCard

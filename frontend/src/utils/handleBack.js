export const handleBack = ({ modalRef, funAction }) => {
    const handleClickOutside = (event) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target)
        )
            funAction()
    }
    // handle esc key
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') funAction()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleKeyDown)
    }
}
const initialState = {
}
export const createGroupSlice = (set, get) => ({

    ...initialState,
    reset: () => {
        set(initialState)
    }
})
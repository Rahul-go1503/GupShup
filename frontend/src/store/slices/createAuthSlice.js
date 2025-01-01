export const createAuthSlice = (set) => ({
    userInfo : undefined,
    setUserInfo : (info) => set({userInfo : info})
})
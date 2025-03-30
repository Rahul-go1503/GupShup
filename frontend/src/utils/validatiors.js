import { toast } from "sonner"

export const isEmailValid = (email) => {
    const emailRegEx = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/ // Email validation regex
    // intial validation
    if (!emailRegEx.test(email)) {
        toast.error('Invalid Credentials.')
        return false
    }
    return true
}

export const isPasswordValid = (password) => {
    const passwordRegex =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    if (!passwordRegex.test(password)) {
        toast.error('Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.')
        return false
    }
    return true
}
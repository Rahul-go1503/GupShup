import { format, isToday, isYesterday, isThisWeek } from 'date-fns';

export const formatDateTitle = (date) => {
    const messageDate = new Date(date);

    // Check if the date is today
    if (isToday(messageDate)) {
        return 'Today';
    }
    // Check if the date is yesterday
    if (isYesterday(messageDate)) {
        return 'Yesterday';
    }

    // Check if the date is within this week
    if (isThisWeek(messageDate)) {
        return format(messageDate, 'EEEE'); // Show weekday name (e.g., Monday)
    }

    // For dates outside this week, show 'dd-MM-yyyy'
    return format(messageDate, 'dd-MM-yyyy');
}

export const formatLastMessageTime = (date) => {
    const messageDate = new Date(date);

    // Check if the date is today
    if (isToday(messageDate)) {
        return format(messageDate, 'HH:mm'); // Show time for today (e.g., 14:30)
    }

    // Check if the date is yesterday
    if (isYesterday(messageDate)) {
        return 'Yesterday';
    }

    // Check if the date is within this week
    if (isThisWeek(messageDate)) {
        return format(messageDate, 'EEEE'); // Show weekday name (e.g., Monday)
    }

    // For dates outside this week, show 'dd-MM-yyyy'
    return format(messageDate, 'dd-MM-yyyy');
}

export const formatMessageTime = (date) => {
    // console.log('formatMessageTime : ', date)
    const messageDate = new Date(date);
    return format(messageDate, 'HH:mm');
}
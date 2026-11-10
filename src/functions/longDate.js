const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// "2025-06-01" -> "June 1, 2025"
export default function longDate(date) {
    const p = (date + "").split("-");
    return MONTHS[Number(p[1]) - 1] + " " + parseInt(p[2], 10) + ", " + p[0];
}

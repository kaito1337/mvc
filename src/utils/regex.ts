const passwordRegex = /^.*(?=.{6,})(?!.*\s)(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s:]).*$/
const emailRegex = /(\w+\.?|-?\w+?)+@\w+\.?-?\w+?(\.\w{2,3})+/

export { passwordRegex, emailRegex }
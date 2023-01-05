// функция проверки и регулярка

import { passwordRegex, emailRegex } from '../../utils/regex'

function validatePassword(password:string) {
    return passwordRegex.test(password);
}

function validateEmail(email:string) {
    return emailRegex.test(email);
}

export { validatePassword, validateEmail};
// Logic of checking Valid email and password


const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);


}

const validatePassword = (password) => {
    // Password must be atleast 8 characters and so on the whatever standards ts
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);

}
module.exports = {validateEmail, validatePassword}
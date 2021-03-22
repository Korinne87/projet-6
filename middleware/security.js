module.exports = (req, res, next) => {
    // Email with at least 4 characters, then an @ then at least 4 characters, no psecial characters and domain extensions .com, .net or .fr
    const regExpEmail = /([A-Z]|[a-z]|[^<>()\[\]\\\/.,;:\s@"]){4,}\@([A-Z]|[a-z]|[^<>()\[\]\\\/.,;:\s@"]){4,}\.(com|net|fr)/;
    // Password with at least 6 characters, a lowercase, an uppercase, and a special character
    const regExpPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/;
    if (regExpEmail.test(req.body.email)) {
        if (regExpPassword.test(req.body.password)) {
            next();
        } else {
            res.status(400).json({
                message: "Votre mot de passe doit comporter au moins 6 caractères, une minuscule, une majuscule et un caractère spécial de cette liste: ! @ $ # ^ * & %"
            });
        }
    } else {
        res.status(400).json({
            message: "Votre adresse email n'est pas valide (seul les .com, .net et .fr sont acceptées"
        });
    }
}


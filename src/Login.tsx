import React from "react"
import LoginForm from "./LoginForm"
import PageTitle from "./components/PageTitle"

const Login = () => {
    return <main className="container mx-auto max-w-6xl px-6 flex-grow text-center">
    <div className="my-4">
        <PageTitle title="Accédez à votre compte" />
        <p>Renseignez votre identifiant et votre mot de passe afin d'accéder à votre espace</p>
    </div><LoginForm />
    </main>
}

export default Login

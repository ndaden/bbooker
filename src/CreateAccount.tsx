import React from "react"
import UserForm from "./UserForm"
import PageTitle from "./components/PageTitle"

const CreateAccount = () => {
    return  <main className="container mx-auto max-w-6xl px-6 flex-grow">
        <div className="my-3">
            <PageTitle title="Créez votre compte" />
            <p>Créez votre espace, afin de pouvoir prendre des rendez-vous en ligne.</p>
        </div>
        <UserForm />
        </main>
}

export default CreateAccount

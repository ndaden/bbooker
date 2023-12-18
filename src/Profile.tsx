import React from "react"
import useAuthentication from "./hooks/useAuthentication"
import { Button } from "@nextui-org/react"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"

const Profile = () => {
    const {userData, isLoading, isError} = useAuthentication()
    const queryCache = useQueryClient();
    const navigate = useNavigate()

    const logoutHandler = async () => {
        await queryCache.removeQueries({ queryKey:["AUTHENTICATED_USER"] })
        sessionStorage.removeItem('auth_token')
        navigate('/')
    }
    return <div>
        {isLoading && <div>isLoading</div>}
        {isError ? <div>Une erreur est survenue.</div> :
        <>{!isLoading && <div>
            <div>Bonjour {userData.user.profile.firstName} {userData.user.profile.lastName}</div>
            <div>Email: {userData.user.email.address}</div>
            <div><Button onClick={logoutHandler}>Fermer la session</Button></div>
            </div>}
            </>  }
    </div>
}

export default Profile

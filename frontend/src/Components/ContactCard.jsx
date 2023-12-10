export default function ContactCard({user}){
    return(
        <>
            <div className="card shadow mx-3 my-3 p-3" style={{maxWidth: "31.5%"}}>
                <div className="fs-3">{user.name}</div>
                <div className="fs-5">Phone Number : {user.phoneNumber}</div>
                <button className="btn btn-primary my-2">Chat</button>
            </div>
        </>
    )
}
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {

    const [credentials, setCredentials] = useState({ Name: "", Email: "", Password: "", cPassword: "" })
    let navigate = useNavigate();
    const handleSubmit = async (e) => {

        e.preventDefault();
        const { Name, Email, Password } = credentials;

        const response = await fetch("http://localhost:5000/api/auth/createuser", {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name, Email, Password })

        });

        const json = await response.json()
        console.log(json);

        if (json.success) {
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken);
            navigate("/");
            props.showAlert("Account created Successfully", "success")
        }
        else {
            props.showAlert("Invalid Credentials", "danger")
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }


    return (
        <div className='container mt-3'>
            <h2>SignUp to continue to iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" name="Name" aria-describedby="emailHelp" placeholder="Enter Name" onChange={onChange} />

                </div>
                <div className="mb-3">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" name="Email" aria-describedby="emailHelp" placeholder="Enter email" onChange={onChange} />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="mb-3">
                    <label htmlFor="Password">Password</label>
                    <input type="password" className="form-control" id="Password" name="Password" placeholder="Password" onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cPassword">Conform Password</label>
                    <input type="password" className="form-control" id="cPassword" name="cPassword" placeholder="Conform Password" onChange={onChange} minLength={5} required />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
export default Signup
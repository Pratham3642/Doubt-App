import React, { useState, useRef } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Swal from 'sweetalert2'; 
import emoji from "./emoji.png";

export default function Doubt() {
    const rName = useRef();
    const rDoubt = useRef();
    const rPhone = useRef();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [doubt, setDoubt] = useState("");
    const [msg, setMsg] = useState("");
    const [phoneValid, setPhoneValid] = useState(true);
    const [errors, setErrors] = useState({
        name: "",
        phone: "",
        doubt: ""
    });

    const hName = (event) => { setName(event.target.value); };
    const hPhone = (event) => { 
        const phoneValue = event.target.value;
        setPhone(phoneValue);
        const isValid = /^[789][0-9]{9}$/.test(phoneValue);
        setPhoneValid(isValid);
    };
    const hDoubt = (event) => { setDoubt(event.target.value); };

    const validateName = (name) => {
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!name) {
            return 'Name is required!';
        } else if (name.length < 2) {
            return 'Name should be at least 2 characters long';
        } else if (!nameRegex.test(name)) {
            return 'Name should only contain letters and spaces!';
        }
        return '';
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[789][0-9]{9}$/;
        if (!phone) {
            return 'Phone number is required!';
        } else if (!phoneRegex.test(phone)) {
            return 'Phone number must be 10 digits long and start with 7, 8, or 9.';
        }
        return '';
    };

    const validateDoubt = (doubt) => {
        if (!doubt) {
            return 'Doubt is required!';
        }
        return '';
    };

    const save = (event) => {
        event.preventDefault();
        validateForm();
    };

    const validateForm = () => {
        setTimeout(() => {
            const nameError = validateName(name);
            setErrors(prevErrors => ({ ...prevErrors, name: nameError }));

            if (nameError) {
                rName.current.focus();
                return;
            }

            setTimeout(() => {
                const phoneError = validatePhone(phone);
                setErrors(prevErrors => ({ ...prevErrors, phone: phoneError }));

                if (!phoneValid || phoneError) {
                    if (!phoneError) {
                        rPhone.current.focus();
                    }
                    return;
                }

                setTimeout(() => {
                    const doubtError = validateDoubt(doubt);
                    setErrors(prevErrors => ({ ...prevErrors, doubt: doubtError }));

                    if (doubtError) {
                        rDoubt.current.focus();
                        return;
                    }

                    submitForm();
                }, 400);
            }, 400);
        }, 400);
    };

    const submitForm = () => {
        let data = { name, phone, doubt };
        let url = "https://doubt-app.onrender.com/save";
        axios.post(url, data)
            .then(res => {
                console.log(res.data);
                setName("");
                setPhone("");
                setDoubt("");
                rName.current.focus();
                Swal.fire({
                    title: 'Success!',
                    text: 'Thank you! We will get back to you.',
                    icon: 'success',
                    confirmButtonText: 'Okay'
                });
            })
            .catch(err => setMsg("Issue: " + err.message));
    };

    return (
        <>
            <div className="background">
                <div className="doubt-container">
                    <img src={emoji} alt="emoji" className="emoji-icon" />
                    <h1 className="doubt-header">Ask Your Doubt</h1>
                    <form onSubmit={save}>
                        <div className="input-group mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                id="name"
                                type="text"
                                className={`doubt-input ${errors.name ? 'is-invalid' : ''}`}
                                placeholder="Enter your Name"
                                onChange={hName}
                                ref={rName}
                                value={name}
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>
                        <div className="input-group mb-3">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input
                                id="phone"
                                type="tel"
                                className={`doubt-input ${!phoneValid || errors.phone ? 'is-invalid' : ''}`}
                                placeholder="Enter your phone number"
                                onChange={hPhone}
                                ref={rPhone}
                                value={phone}
                                pattern="[789][0-9]{9}"
                                title="Please enter a valid 10-digit phone number starting with 7, 8, or 9."
                            />
                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                        </div>
                        <div className="input-group mb-3">
                            <label htmlFor="doubt" className="form-label">Doubt</label>
                            <textarea
                                id="doubt"
                                className={`doubt-textarea ${errors.doubt ? 'is-invalid' : ''}`}
                                placeholder="Enter your doubt"
                                rows={4}
                                onChange={hDoubt}
                                ref={rDoubt}
                                value={doubt}
                            ></textarea>
                            {errors.doubt && <div className="invalid-feedback">{errors.doubt}</div>}
                        </div>
                        <button type="submit" className="doubt-btn">Submit</button>
                    </form>
                    {msg && <h2 className="text-center mt-4 doubt-error">{msg}</h2>}
                </div>
            </div>
        </>
    );
}

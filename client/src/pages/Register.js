import React, { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Register(props) {
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});

    const { onChange, onSubmit, values } = useForm(registerUser, {
        username: '', email: '', pwd: '', confirmPwd: ''
    });
 
    const [addUser, { loanding }] = useMutation(REGISTER_USER, {
        update(_, {data: {register: userData}}) {
            context.login(userData);
            props.history.push('/'); //Go to home when register a user
        },
        onError(err) {  
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    });

    function registerUser(){
        addUser();
    }
    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loanding ? "Cargando..." : ''}>
                <h1>REGISTRO</h1>
                <Form.Input label="Nombre de usuario" placeholder="Nombre de usuario" name="username" type="text"
                    value={values.username} error={errors.username ? true : false} onChange={onChange} />
                <Form.Input label="Correo electrónico" placeholder="Correo electrónico" name="email" type="email"
                    value={values.email} error={errors.email ? true : false} onChange={onChange} />
                <Form.Input label="Contraseña" placeholder="Contraseña" name="pwd" type="password"
                    value={values.pwd} error={errors.pwd ? true : false} onChange={onChange} />
                <Form.Input label="Repetir contraseña" placeholder="Repetir contraseña" name="confirmPwd" type="password"
                    value={values.confirmPwd} error={errors.confirmPwd ? true : false} onChange={onChange} />
                <Button type="submit" primary >Registrar</Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map((value) => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $pwd: String!
        $confirmPwd: String!
    ){
        register(
            registerInput: {
                username: $username
                email: $email
                pwd: $pwd
                confirmPwd: $confirmPwd
            }
        ){
            id email username createdat token
        }
    }
`;

export default Register;
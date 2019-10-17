import React, { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Login(props) {
    const context = useContext(AuthContext); //Esto verifica el contexto de login, logout
    const [errors, setErrors] = useState({});
    const { onChange, onSubmit, values } = useForm(loginUserCallBack, {
        username: '', pwd: ''
    });
    const [loginUser, { loanding }] = useMutation(LOGIN_USER, {
        update(_, {data: { login: userData}}) {
            context.login(userData)
            props.history.push('/'); //Go to home when register a user
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    });
    function loginUserCallBack() {
        loginUser();
    };

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loanding ? "Cargando..." : ''}>
                <h1>LOGIN</h1>
                <Form.Input label="Nombre de usuario" placeholder="Nombre de usuario" name="username" type="text"
                    value={values.username} error={errors.username ? true : false} onChange={onChange} />
                <Form.Input label="Contraseña" placeholder="Contraseña" name="pwd" type="password"
                    value={values.pwd} error={errors.pwd ? true : false} onChange={onChange} />
                <Button type="submit" primary >Login</Button>
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

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $pwd: String!
    ){
        login(
            username: $username pwd: $pwd
        ){
            id email username createdat token
        }
    }
`;

export default Login;
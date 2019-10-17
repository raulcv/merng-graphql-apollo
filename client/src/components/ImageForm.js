import React from "react";
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useForm } from '../util/hooks';
import { FETCH_IMAGES_QUERY } from '../util/graphql';

function ImageForm() {
    const { values, onChange, onSubmit } = useForm(addImageCallBack, {
        title: ''
    });

    const [addImage, { error }] = useMutation(ADD_IMAGE_MUTATION, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_IMAGES_QUERY
            });
            //data si vuelve todo
            //1:data.getImages = [result.data.addImage, ...data.getImages];
            //2:proxy.writeQuery({ query: FETCH_IMAGES_QUERY, data});
            const new_image = result.data.addImage
            proxy.writeQuery({
                query: FETCH_IMAGES_QUERY,
                data: { getImages: [new_image, ...data.getImages] }
            })
            values.title = ''
        }
    });

    function addImageCallBack() {
        addImage();
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Subir nueva imagen:</h2>
                <Form.Field>
                    <Form.Input placeholder="Hola subiendo nueva imagen" name="title"
                        onChange={onChange} value={values.title} error={error ? true : false} />
                    <Button type="submit" color="teal">Subir</Button>
                </Form.Field>
            </Form>
            {error && (
                <div className="ui error message" style={{ marginBottom: 20 }}>
                    <ul className="list">
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </>
    );

}

const ADD_IMAGE_MUTATION = gql`
    mutation addImage($title: String!){
        addImage(title: $title){
            id title createdat username 
            likes{ id username createdat }
            likeCount
            comments { id comment username createdat}
            commentCount
        }
    }
`;

export default ImageForm;
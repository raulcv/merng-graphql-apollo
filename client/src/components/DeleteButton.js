import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon } from 'semantic-ui-react';
import { FETCH_IMAGES_QUERY } from '../util/graphql'
import MyPopup from '../util/MyPopup';

function DeleteButton({ imageId, commentId, callback }) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_IMAGE_MUTATION;
    const [deleteImageOrMutation] = useMutation(mutation, {
        update(proxy) {
            setConfirmOpen(false);
            if (!commentId) {
                const data = proxy.readQuery({
                    query: FETCH_IMAGES_QUERY
                });
                data.getImages = data.getImages.filter((p) => p.id !== imageId);
                proxy.writeQuery({ query: FETCH_IMAGES_QUERY, data });
            }
            if (callback) callback(); //SingleImage: refresca y redigirje a Home.js
        },
        variables: {
            imageId,
            commentId
        }
    });
    return (
        <>
            <MyPopup content={commentId ? "Eliminar Comentario" : "Eliminar Imagen"}>
                <Button as="div" color="red" floated="right" onClick={() => setConfirmOpen(true)}>
                    <Icon name="trash" style={{ margin: 0 }} />
                </Button>
            </MyPopup>
            <Confirm open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deleteImageOrMutation} />
        </>
    );
}

const DELETE_IMAGE_MUTATION = gql`
    mutation deleteImage($imageId: ID!) {
        deleteImage(imgId: $imageId)
    }
`;

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($imageId: ID!, $commentId: ID!){
        deleteComment(imgId: $imageId, commentId: $commentId){
            id
            comments{ id username createdat comment}
            commentCount
        }
    }
`;

export default DeleteButton;

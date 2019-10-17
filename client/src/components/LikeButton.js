import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Label, Icon} from 'semantic-ui-react';
import MyPopup from '../util/MyPopup';

function LikeButton({ user, image: { id, likes, likeCount } }) {
    const [liked, setLiked] = useState(false);
    useEffect(() => {
        if (user && likes.find((like) => like.username === user.username)) {
            setLiked(true);
        } else setLiked(false);
    }, [user, likes]);

    const [likeImage] = useMutation(LIKE_IMAGE_MUTATION, {
        variables: { imageId: id }
    });

    const likeButton = user ? (
        liked ? (
            <Button color='teal'>
                <Icon name='heart' />
            </Button>
        ) : (
                <Button color='teal' basic>
                    <Icon name='heart' />
                </Button>
            )
    ) : (
            <Button as={Link} to={`/login`} color='teal' basic>
                <Icon name='heart' />
            </Button>
        )
    return (
        <Button as='div' labelPosition='right' onClick={likeImage}>
            <MyPopup content={ liked ? "No me gusta" : "Me gusta"}>{likeButton}</MyPopup>
            <Label basic color='teal' pointing='left'>{likeCount}</Label>
        </Button>
    )
}
const LIKE_IMAGE_MUTATION = gql `
    mutation likeImage($imageId: ID!){
        likeImage(imgId: $imageId){
            id
            likes{ id username}
            likeCount
        }
    }
`;

export default LikeButton;
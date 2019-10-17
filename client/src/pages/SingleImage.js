import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Grid, Card, Button, Form, Icon, Label, Image } from 'semantic-ui-react';
import moment from 'moment';
import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../util/MyPopup';

function SingleImage(props) {
    const imageId = props.match.params.imageId;
    const { user } = useContext(AuthContext);
    //console.log(imageId);
    const commentInputRef = useRef(null);
    const [comment, setComment] = useState('');

    const { data } = useQuery(FETCH_IMAGE_QUERY, {
        variables: { imageId }
    })
    let getImage;
    if (data) {
        getImage = data.getImage
    }
    /*const { data: { getImage } } = useQuery(FETCH_IMAGE_QUERY, {
        variables: {
            imageId
        }
    })*/
    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update() {
            setComment('');
            commentInputRef.current.blur(); //No FOCUS en comentario input
        },
        variables: {
            imageId,
            comment: comment
        }
    })

    function deleteImageCallBack() {
        props.history.push('/');
    }

    let imageMarkUp;
    if (!getImage) {
        imageMarkUp = <p>Cargando imagen...</p>
    } else {
        const { id, title, createdat, username, likes, likeCount, comments, commentCount } = getImage;
        imageMarkUp = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                            size="small"
                            float="right" />
                    </Grid.Column>

                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdat).fromNow()}</Card.Meta>
                                <Card.Description>{title}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={user} image={{ id, likes, likeCount }} />
                                <MyPopup content="Comentar en la Imagen">
                                    <Button as="div" labelPosition="right" onClick={() => console.log("comentiarios aqui")}>
                                        <Button color="blue" basic>
                                            <Icon name="comments" />
                                        </Button>
                                        <Label color="blue" pointing="left" basic>{commentCount}</Label>
                                    </Button>
                                </MyPopup>
                                {user && user.username === username && (
                                    <DeleteButton imageId={id} callback={deleteImageCallBack} />
                                )}
                            </Card.Content>
                        </Card>
                        {user &&
                            <Card fluid>
                                <Card.Content>
                                    <p>Agregar un comentario</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input type="text" placeholder="Escribir..." name="comment" value={comment}
                                                onChange={event => setComment(event.target.value)}
                                                ref={commentInputRef} />
                                            <button type="submit" className="ui button teal"
                                                disabled={comment.trim() === ''}
                                                onClick={submitComment}>Publicar</button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>}
                        {comments.map((comment) => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton imageId={id} commentId={comment.id} />
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdat).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.comment}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>

                </Grid.Row>
            </Grid>
        );
    }
    return imageMarkUp;
}

const FETCH_IMAGE_QUERY = gql`
    query($imageId: ID!){
        getImage(imgId: $imageId){
            id title createdat username 
            likes{ username }
            likeCount
            comments{ id username createdat comment}
            commentCount
        }
    }
`;

const SUBMIT_COMMENT_MUTATION = gql`
    mutation($imageId: String!, $comment: String!){
        addComment(imgId: $imageId, comment: $comment){
            id
            comments{ id username createdat comment}
            commentCount
        }
    }
`;

export default SingleImage;
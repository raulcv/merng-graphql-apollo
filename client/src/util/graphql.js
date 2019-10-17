import gql from 'graphql-tag';

export const FETCH_IMAGES_QUERY = gql `
   { 
       getImages {
        id 
        title 
        createdat 
        username 
        likeCount 
        likes{
            username
        } 
        commentCount 
        comments{
            id username createdat comment
        }
        }
    }
`;
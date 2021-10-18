import jsonPlaceholder from '../apis/jsonPlaceholder';
import _ from 'lodash';

//bad approach!!

// export const fetchPosts = async () => {
//   const response = await jsonPlaceholder.get('/posts');
//   return {
//     type: 'FETCH_POSTS',
//     payload: response
//   };
// };

// 2 probleme

//1
//Action creators must return plain JS objects with a type  property (optional: and a  payload)
//codul este transpilat, iar din cauza sintaxei async await, functia este extinsa
//codul contine un switch statement care are un case 0 ce returneaza jsonPlaceholder.get('/posts)
//deci prima data cand este invocat action creator, returneaza requestul, iar nu obiectul cu proprietate type 'FETCH_POSTS'
//
//de aceea nu se returneaza un obiect JS cu proprietatea type. we did not return a plain object. we returned a request object

//2
// this is not a fix!!
// export const fetchPosts =  () => {
//   const promise = jsonPlaceholder.get('/posts');
//   return {
//     type: 'FETCH_POSTS',
//     payload: promise
//   };
// };

//by the time our action gets to a reducer, we don't have fetched data
//cand chemam un action creator, toti pasii din redux cycle se executa in o fractiune de milisecunda(instantaneu).
// pana primim raspunsul de la API, actiunea deja a fost procesarta de reducer. Reducerul a cautat in promise obect si a vazut ca requestul nu este complet (nu avem data)
//nu putem intarzia reducerul pana primim raspunsul

//HOW WE USE REDUX THUNK:

export const fetchPostsAndUsers = () => async (dispatch, getState) => {
  //functie care returenaza o functie
  //1. chemam action creator fetchPosts. cand chemam fetchPosts trebuie sa trecem rezultatul acestei functii intr-o functie dispatch
  //1.2 ne asiguram ca API requestul e complet inainte de a trece mai departe
  await dispatch(fetchPosts());
  //2. dupa ce asteptam ca lista de postari sa fie procesata, chemam getState
  const userIds = _.uniq(_.map(getState().posts, 'userId'));
  //'argumentul userId scoate doar proprietatea UserId' -
  //_.uniq scoate doar userIds unice
  //  3. iteram prin lista de id-uri, iar pt fiecare id chemam action creator fetchUser. trecem rezultatul fucntiei prin dispatch
  userIds.forEach((id) => dispatch(fetchUser(id)));
};

export const fetchPosts = () => {
  return async (dispatch) => {
    //redux thunk invoca functia cu dispatch si getState ca argumente
    //
    //este o functie care invoca o functie

    const response = await jsonPlaceholder.get('/posts');
    dispatch({ type: 'FETCH_POSTS', payload: response.data });
    //nu vreu doar rapsunsul, ci doar proprietatea data !
  };
};

//DEFINIM O FUNCTIE CARE RETURNEAZA O FUNCTIE
export const fetchUser = (id) => async (dispatch) => {
  //pass the id of the user we want to fetch
  const response = await jsonPlaceholder.get(`/users/${id}`);
  dispatch({ type: 'FETCH_USER', payload: response.data });
  //response va fi un obiect, nu un array
};

// ---
// MEMOIZE solution pentru a face 10 requesturi, iar nu 100
//nu poti face fetch decat o data pentru fiecare user

// export const fetchUser = (id) => (dispatch) => {
//   _fetchUser(id, dispatch);
// };

// const _fetchUser = _.memoize(async (id, dispatch) => {
//   const response = await jsonPlaceholder.get(`/users/${id}`);
//   dispatch({ type: 'FETCH_USER', payload: response.data });
// });
// ---
